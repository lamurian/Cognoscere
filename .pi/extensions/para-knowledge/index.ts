/**
 * PARA Knowledge Extension — DuckDB-powered
 *
 * Maintains a persistent notes.duckdb index of all markdown files in
 * Areas/Projects/Resources.  Tag lookups are O(log n) via DuckDB's ART
 * index; body search uses ILIKE (with FTS as a future upgrade).
 *
 * Tools:
 *   search_para_docs   — query the index by tags + content text
 *   fetch_reputable_web — web search (unchanged, no DB involvement)
 *   create_para_doc    — create file + insert into index
 *   update_para_doc    — update file + refresh index row
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { mkdir, readFile, readdir, writeFile, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import duckdb from "duckdb";

// ── Constants ───────────────────────────────────────────────────

const PARA_DIRS = ["Areas", "Projects", "Resources"] as const;
const DB_FILE   = "notes.duckdb";

// ── Helpers ─────────────────────────────────────────────────────

function parseFrontmatter(content: string): {
  tags: string[];
  title?: string;
  author?: string;
  editor?: string;
  created?: string;
  modified?: string;
} {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { tags: [] };

  const result: Record<string, unknown> = {};
  const tags: string[] = [];

  for (const line of match[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)/);
    if (kv) {
      const val = kv[2].trim();
      if (val && !val.startsWith("-")) result[kv[1]] = val;
    }
    const li = line.match(/^\s*-\s+(.+)/);
    if (li) tags.push(li[1].trim());
  }
  result.tags = tags;
  return result as ReturnType<typeof parseFrontmatter>;
}

function formatFrontmatter(fm: Record<string, unknown>): string {
  let out = "---\n";
  for (const [k, v] of Object.entries(fm)) {
    if (k === "tags" && Array.isArray(v) && v.length) {
      out += "tags:\n";
      for (const t of v) out += `  - ${t}\n`;
    } else if (typeof v === "string") {
      out += `${k}: ${v}\n`;
    }
  }
  return out + "---\n";
}

/** Slugify a title to a filename-safe string. */
function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── DuckDB wrappers ─────────────────────────────────────────────

function allAsync(db: duckdb.Database, sql: string, ...params: unknown[]): Promise<Record<string, unknown>[]> {
  return new Promise((resolve, reject) => {
    (db.all as Function)(sql, ...params, (err: Error | null, rows: Record<string, unknown>[]) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function runAsync(db: duckdb.Database, sql: string, ...params: unknown[]): Promise<void> {
  return new Promise((resolve, reject) => {
    (db.run as Function)(sql, ...params, (err: Error | null) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// ── File-system scanning ────────────────────────────────────────

interface FileEntry {
  path: string;          // relative path e.g. "Projects/foo.md"
  absPath: string;
  mtimeMs: number;
}

/** Walk one PARA directory and return all .md files with their mtimes. */
async function scanParaDir(dir: string, base: string): Promise<FileEntry[]> {
  const abs = resolve(base, dir);
  let entries: string[];
  try { entries = await readdir(abs); } catch { return []; }

  const results: FileEntry[] = [];
  for (const name of entries) {
    if (!name.endsWith(".md")) continue;
    const absPath = join(abs, name);
    const s = await stat(absPath);
    results.push({ path: `${dir}/${name}`, absPath, mtimeMs: s.mtimeMs });
  }
  return results;
}

function scanAllParaDirs(base: string): Promise<FileEntry[]> {
  return Promise.all(PARA_DIRS.map((d) => scanParaDir(d, base))).then((r) => r.flat());
}

// ── Database initialisation & sync ──────────────────────────────

async function initDb(db: duckdb.Database): Promise<void> {
  await runAsync(db, `
    CREATE TABLE IF NOT EXISTS files (
      path        VARCHAR PRIMARY KEY,
      title       VARCHAR NOT NULL DEFAULT '',
      body        TEXT    NOT NULL DEFAULT '',
      author      VARCHAR NOT NULL DEFAULT '',
      editor      VARCHAR NOT NULL DEFAULT '',
      created     TIMESTAMP,
      modified    TIMESTAMP,
      file_mtime  TIMESTAMP
    )
  `);
  await runAsync(db, `
    CREATE TABLE IF NOT EXISTS tags (
      file_path VARCHAR NOT NULL,
      tag       VARCHAR NOT NULL
    )
  `);
  await runAsync(db, "CREATE INDEX IF NOT EXISTS idx_tags_tag  ON tags(tag)");
  await runAsync(db, "CREATE INDEX IF NOT EXISTS idx_tags_path ON tags(file_path)");
}

/** Parse frontmatter + body from a file entry. */
async function parseFile(
  entry: FileEntry,
): Promise<{ title: string; body: string; tags: string[]; author: string; editor: string; created: string | null }> {
  const content = await readFile(entry.absPath, "utf-8");
  const fm = parseFrontmatter(content);

  // Body is everything after the frontmatter block
  const body = content.replace(/^---\n[\s\S]*?\n---\n?/, "").trim();

  return {
    title: fm.title ?? entry.path.replace(/\.md$/, "").split("/").pop() ?? "",
    body,
    tags: fm.tags ?? [],
    author: fm.author ?? "",
    editor: fm.editor ?? "",
    created: fm.created ?? null,
  };
}

/**
 * Sync the DuckDB index with the filesystem.
 * - Inserts new files
 * - Updates changed files (by mtime)
 * - Deletes removed files
 * Runs inside a single transaction for atomicity.
 */
async function syncIndex(db: duckdb.Database, cwd: string): Promise<boolean> {
  const files = await scanAllParaDirs(cwd);
  const stored = await allAsync(db, "SELECT path, file_mtime FROM files");
  const storedMap = new Map(stored.map((r: any) => [r.path, new Date(r.file_mtime ?? 0).getTime()]));

  const fsMap = new Map(files.map((f) => [f.path, f.mtimeMs]));
  const changed: FileEntry[] = [];

  for (const f of files) {
    const storedMtime = storedMap.get(f.path);
    if (storedMtime === undefined || Math.abs(storedMtime - f.mtimeMs) > 1) {
      changed.push(f);
    }
  }

  const toDelete: string[] = [];
  for (const p of storedMap.keys()) {
    if (!fsMap.has(p as string)) toDelete.push(p as string);
  }

  if (changed.length === 0 && toDelete.length === 0) return false;

  // Everything in one transaction
  await runAsync(db, "BEGIN TRANSACTION");
  try {
    for (const p of toDelete) {
      await runAsync(db, "DELETE FROM tags WHERE file_path = ?", p);
      await runAsync(db, "DELETE FROM files WHERE path = ?", p);
    }
    for (const entry of changed) {
      const parsed = await parseFile(entry);
      const mtimeStr = new Date(entry.mtimeMs).toISOString();

      // Upsert file
      await runAsync(db, `
        INSERT OR REPLACE INTO files (path, title, body, author, editor, created, modified, file_mtime)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, entry.path, parsed.title, parsed.body, parsed.author, parsed.editor,
         parsed.created, new Date().toISOString(), mtimeStr);

      // Re-insert tags (delete then insert)
      await runAsync(db, "DELETE FROM tags WHERE file_path = ?", entry.path);
      for (const tag of parsed.tags) {
        await runAsync(db, "INSERT INTO tags (file_path, tag) VALUES (?, ?)", entry.path, tag);
      }
    }
    await runAsync(db, "COMMIT");
  } catch (e) {
    await runAsync(db, "ROLLBACK");
    throw e;
  }
  return true;
}

// ── Tool definitions ────────────────────────────────────────────

const Area = Type.String({ description: 'PARA category: "Areas", "Projects", or "Resources"' });

export default function (pi: ExtensionAPI) {
  // Lazy singleton DB — created on first tool call that needs it
  let db: duckdb.Database | null = null;

  function openDb(cwd: string): duckdb.Database {
    if (!db) {
      db = new duckdb.Database(resolve(cwd, DB_FILE));
      // Run init synchronously before any async calls
      initDb(db).catch((e) => {
        console.error("[para-knowledge] DB init failed:", e);
      });
    }
    return db;
  }

  /* ─── Tool 1: search_para_docs ─────────────────────────────── */
  pi.registerTool({
    name: "search_para_docs",
    label: "Search PARA Docs",
    description:
      "Search the DuckDB-indexed PARA documents (Areas/Projects/Resources) by tags and content. " +
      "Tag search is O(log n) via index; body search uses ILIKE. " +
      "The index is automatically synced with the filesystem on each call.",
    promptSnippet: "Search for relevant knowledge documents in Areas, Projects, Resources directories",
    promptGuidelines: [
      "Use search_para_docs first when the user asks a knowledge question.",
      "Pass the user's question as query and infer relevant tags from context.",
    ],
    parameters: Type.Object({
      query: Type.String({ description: "Search query or topic" }),
      tags: Type.Optional(Type.Array(Type.String(), { description: "Filter by tag (OR logic)" })),
    }),

    async execute(_toolCallId, params, _signal, onUpdate, ctx) {
      onUpdate?.({ content: [{ type: "text" as const, text: "🗄️ notes.duckdb — checking index freshness…" }] });

      const d = openDb(ctx.cwd);
      const synced = await syncIndex(d, ctx.cwd);

      onUpdate?.({ content: [{ type: "text" as const, text: synced
        ? "🗄️ notes.duckdb — index synced (files changed)"
        : "🗄️ notes.duckdb — index up to date" }] });

      const filterTags = params.tags ?? [];
      const q = params.query.toLowerCase();

      // Build query dynamically
      let sql = "SELECT DISTINCT f.path, f.title, f.body, f.author, f.editor, f.file_mtime FROM files f";
      const sqlParams: unknown[] = [];

      if (filterTags.length > 0) {
        sql += " JOIN tags t ON f.path = t.file_path";
        onUpdate?.({ content: [{ type: "text" as const,
          text: `🗄️ notes.duckdb — tag filter: ${filterTags.join(", ")} (ART index O(log n))` }] });
      }

      const conditions: string[] = [];
      if (filterTags.length > 0) {
        const placeholders = filterTags.map(() => "LOWER(t.tag) LIKE ?");
        conditions.push(`(${placeholders.join(" OR ")})`);
        for (const tag of filterTags) sqlParams.push(`%${tag.toLowerCase()}%`);
      }

      if (q) {
        conditions.push("(LOWER(f.title) LIKE ? OR LOWER(f.body) LIKE ?)");
        sqlParams.push(`%${q}%`, `%${q}%`);
      }

      if (conditions.length > 0) sql += " WHERE " + conditions.join(" AND ");
      sql += " ORDER BY f.title";

      onUpdate?.({ content: [{ type: "text" as const, text: "🗄️ notes.duckdb — executing query…" }] });
      const rows = await allAsync(d, sql, ...sqlParams);

      const tagUsed = filterTags.length > 0 ? "tag-index" : "none";
      const bodyUsed = q ? "ILIKE-scan" : "none";
      const trace = `🗄️ notes.duckdb — tag:${tagUsed}  body:${bodyUsed}  results:${rows.length}`;

      if (rows.length === 0) {
        return {
          content: [{ type: "text" as const,
            text: `${trace}\nNo documents found for "${params.query}"${filterTags.length ? ` with tags [${filterTags.join(", ")}]` : ""}.`,
          }],
          details: { results: [], count: 0, trace },
        };
      }

      const list = rows
        .map((r: any) => {
          const titleLower = (r.title ?? "").toLowerCase();
          const bodyLower  = (r.body  ?? "").toLowerCase();
          const rel = titleLower.includes(q) ? "high" : bodyLower.includes(q) ? "medium" : "tag-only";
          return `- [${r.title}](${r.path})  (relevance: ${rel})`;
        })
        .join("\n");

      return {
        content: [{ type: "text" as const, text: `${trace}\n\nFound ${rows.length} document(s):\n\n${list}` }],
        details: { results: rows, count: rows.length, trace },
      };
    },
  });

  /* ─── Tool 2: fetch_reputable_web ───────────────────────────── */
  pi.registerTool({
    name: "fetch_reputable_web",
    label: "Fetch Reputable Web",
    description:
      "Search the web for information from .edu, .ac.*, .gov, .go.*, and university websites. " +
      "Use only when search_para_docs returned no results and after /skill:brainstorm has refined the query.",
    promptSnippet: "Search reputable web sources (.edu, .ac.*, .gov, universities) for information",
    promptGuidelines: [
      "Use fetch_reputable_web only after search_para_docs returned no results.",
      "Run /skill:brainstorm first to refine the query before searching.",
    ],
    parameters: Type.Object({
      query: Type.String({ description: "The search query" }),
    }),

    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      const pyScript = `
import sys, json, urllib.request, urllib.parse, re, html as h

q = sys.argv[1]
filters = "site:edu OR site:ac.uk OR site:ac.nz OR site:ac.jp OR site:ac.kr OR site:ac.in OR site:ac.cn OR site:gov OR site:go.id OR site:go.jp OR site:go.kr"
url = "https://html.duckduckgo.com/html/?q=" + urllib.parse.quote(f"({filters}) {q}")

req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"})
try:
    body = urllib.request.urlopen(req, timeout=20).read().decode("utf-8", errors="replace")

    results = []
    for m in re.finditer(r'<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>(.*?)</a>', body, re.DOTALL):
        results.append({"title": re.sub(r"<[^>]+>", "", m.group(2)).strip(), "url": h.unescape(m.group(1))})

    snippets = []
    for sm in re.finditer(r'<a[^>]*class="result__snippet"[^>]*>(.*?)</a>', body, re.DOTALL):
        snippets.append(re.sub(r"<[^>]+>", "", sm.group(1)).strip())
    for i, s in enumerate(snippets):
        if i < len(results): results[i]["snippet"] = s

    if not results:
        for m in re.finditer(r'<a[^>]*rel="nofollow"[^>]*href="([^"]*)"[^>]*>(.*?)</a>', body, re.DOTALL):
            u = h.unescape(m.group(1))
            t = re.sub(r"<[^>]+>", "", m.group(2)).strip()
            if u.startswith("http") and t: results.append({"title": t, "url": u})

    pat = re.compile(r"\\.(edu|ac\\.[a-z]{2,}|gov\\.?|go\\.[a-z]{2,})", re.I)
    filtered = [r for r in results if pat.search(r["url"])]
    print(json.dumps(filtered[:10] if filtered else results[:5]))
except Exception as e:
    print(json.dumps({"error": str(e), "query": q}))
`.trim();

      try {
        const r = await pi.exec("python3", ["-c", pyScript, params.query], { timeout: 30_000 });
        if (r.code !== 0) throw new Error(r.stderr || `exit code ${r.code}`);

        const data = JSON.parse(r.stdout);

        if (data.error) {
          const fallbackUrl =
            `https://duckduckgo.com/?q=${encodeURIComponent(`(site:edu OR site:ac.* OR site:gov) ${params.query}`)}`;
          return {
            content: [{ type: "text" as const, text: `Web search unavailable (${data.error}). Try manually:\n${fallbackUrl}` }],
            details: { error: data.error, fallbackUrl },
          };
        }

        if (!data.length) {
          return {
            content: [{ type: "text" as const, text: "No results from reputable sources. Try refining the query." }],
            details: { count: 0 },
          };
        }

        const text = data
          .map((r: { title: string; url: string; snippet?: string }, i: number) =>
            `${i + 1}. [${r.title}](${r.url})${r.snippet ? `\n   ${r.snippet}` : ""}`)
          .join("\n\n");

        return {
          content: [{ type: "text" as const, text: `Results for "${params.query}" from reputable sites:\n\n${text}` }],
          details: { results: data, count: data.length },
        };
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        const fallbackUrl =
          `https://duckduckgo.com/?q=${encodeURIComponent(`(site:edu OR site:ac.* OR site:gov) ${params.query}`)}`;
        return {
          content: [{ type: "text" as const, text: `Search failed (${msg}). Try:\n${fallbackUrl}` }],
          details: { error: msg, fallbackUrl },
        };
      }
    },
  });

  /* ─── Tool 3: create_para_doc ───────────────────────────────── */
  pi.registerTool({
    name: "create_para_doc",
    label: "Create PARA Doc",
    description:
      "Create a new markdown file with YAML frontmatter in Areas, Projects, or Resources. " +
      "Also inserts the document into the DuckDB index automatically.",
    promptSnippet: "Create a new knowledge document in the PARA directory structure",
    parameters: Type.Object({
      title: Type.String({ description: "Document title" }),
      content: Type.String({ description: "Markdown body content" }),
      tags: Type.Array(Type.String(), { description: "Tags for frontmatter" }),
      area: Type.Optional(Area),
    }),

    async execute(_toolCallId, params, _signal, onUpdate, ctx) {
      const area = params.area ?? "Resources";
      const dirPath = resolve(ctx.cwd, area);
      const slug = slugify(params.title);
      const filePath = join(dirPath, `${slug}.md`);
      const relPath = `${area}/${slug}.md`;
      const now = new Date().toISOString();

      const fm = formatFrontmatter({
        author: "pi",
        date: now,
        editor: "lam",
        title: params.title,
        tags: params.tags,
      });

      await mkdir(dirPath, { recursive: true });
      await writeFile(filePath, fm + "\n" + params.content, "utf-8");

      onUpdate?.({ content: [{ type: "text" as const, text: "🗄️ notes.duckdb — inserting new document into index…" }] });
      try {
        const d = openDb(ctx.cwd);
        await runAsync(d,
          "INSERT OR REPLACE INTO files (path, title, body, author, editor, created, modified, file_mtime) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          relPath, params.title, params.content, "pi", "lam", now, now, now);
        await runAsync(d, "DELETE FROM tags WHERE file_path = ?", relPath);
        for (const tag of params.tags) {
          await runAsync(d, "INSERT INTO tags (file_path, tag) VALUES (?, ?)", relPath, tag);
        }
      } catch (e) {
        console.error("[para-knowledge] DB insert failed for new doc:", e);
      }

      return {
        content: [{ type: "text" as const, text:
          `🗄️ notes.duckdb — indexed\nCreated: ${filePath}\nTitle: ${params.title}\nTags: ${params.tags.join(", ")}` }],
        details: { path: filePath, title: params.title, tags: params.tags },
      };
    },
  });

  /* ─── Tool 4: update_para_doc ───────────────────────────────── */
  pi.registerTool({
    name: "update_para_doc",
    label: "Update PARA Doc",
    description:
      "Update an existing markdown file's body content and renew its YAML frontmatter " +
      "(date refreshed, author: pi / editor: lam preserved). Also syncs the DuckDB index.",
    promptSnippet: "Update and renew frontmatter of an existing knowledge document",
    parameters: Type.Object({
      path: Type.String({ description: "Relative path, e.g. Projects/my-doc.md" }),
      content: Type.String({ description: "New body content (without frontmatter)" }),
      tags: Type.Optional(Type.Array(Type.String(), { description: "Replacement tags (omit to keep existing)" })),
      title: Type.Optional(Type.String({ description: "Replacement title (omit to keep existing)" })),
    }),

    async execute(_toolCallId, params, _signal, onUpdate, ctx) {
      const filePath = resolve(ctx.cwd, params.path);
      const existing = await readFile(filePath, "utf-8");
      const fm = parseFrontmatter(existing);
      const oldTags: string[] = fm.tags ?? [];
      const now = new Date().toISOString();

      const newFm = formatFrontmatter({
        author: "pi",
        date: now,
        editor: "lam",
        title: params.title ?? fm.title ?? "",
        tags: params.tags ?? oldTags,
      });

      await writeFile(filePath, newFm + "\n" + params.content, "utf-8");

      onUpdate?.({ content: [{ type: "text" as const, text: "🗄️ notes.duckdb — updating index row…" }] });
      try {
        const d = openDb(ctx.cwd);
        const newTags = params.tags ?? oldTags;
        await runAsync(d,
          "UPDATE files SET title = ?, body = ?, modified = ?, file_mtime = ? WHERE path = ?",
          params.title ?? fm.title ?? "", params.content, now, now, params.path);
        await runAsync(d, "DELETE FROM tags WHERE file_path = ?", params.path);
        for (const tag of newTags) {
          await runAsync(d, "INSERT INTO tags (file_path, tag) VALUES (?, ?)", params.path, tag);
        }
      } catch (e) {
        console.error("[para-knowledge] DB update failed:", e);
      }

      return {
        content: [{ type: "text" as const, text:
          `🗄️ notes.duckdb — updated\nUpdated: ${filePath} (frontmatter renewed, index synced).` }],
        details: { path: filePath, title: params.title ?? fm.title ?? "" },
      };
    },
  });
}
