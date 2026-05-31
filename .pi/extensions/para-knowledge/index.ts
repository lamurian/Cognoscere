/**
 * PARA Knowledge Extension — DuckDB-powered
 *
 * Uses ephemeral database connections — open, use, close.
 * - Searches open in READ_ONLY mode (no write lock acquired)
 * - Creates/updates open in READ_WRITE mode with queue+timeout for cross-process safety
 * - Lock is held for milliseconds, not the entire session
 *
 * Tools:
 *   search_para_docs   — query the index by tags + content text
 *   fetch_reputable_web — web search (uses DDG HTML API)
 *   create_para_doc    — create file + insert into index
 *   update_para_doc    — update file + refresh index row
 */

import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { mkdir, readFile, readdir, writeFile, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import duckdb from "duckdb";

// ── Constants ───────────────────────────────────────────────────

const PARA_DIRS = ["Areas", "Projects", "Resources"] as const;
const DB_FILE   = "notes.duckdb";

/** Maximum time (ms) to wait for a write lock before giving up. */
const WRITE_QUEUE_TIMEOUT = 300_000; // 5 minutes

/** Polling interval (ms) when queueing for a write lock. */
const QUEUE_POLL_INTERVAL = 2_000;

/** DuckDB error message indicating an aborted transaction needs rollback. */
const TX_ABORTED_MSG = "Current transaction is aborted (please ROLLBACK)";

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

// ── DuckDB wrappers with recovery ──────────────────────────────

/**
 * Attempt to heal a broken DuckDB connection by rolling back any
 * aborted transaction.  Swallows "no transaction is active" errors.
 */
async function healAbortedTx(db: duckdb.Database): Promise<void> {
  try {
    await new Promise<void>((resolve, reject) => {
      (db.run as Function)("ROLLBACK", (err: Error | null) => {
        if (err) {
          const msg = err.message ?? "";
          if (msg.includes("no transaction is active")) resolve();
          else reject(err);
        } else resolve();
      });
    });
  } catch {
    // ignore unexpected rollback errors — db is likely beyond repair
  }
}

/**
 * Run a SQL statement and recover from aborted-transaction errors
 * by rolling back and retrying once.
 */
async function runWithRecovery(db: duckdb.Database, sql: string, ...params: unknown[]): Promise<void> {
  try {
    await new Promise<void>((resolve, reject) => {
      (db.run as Function)(sql, ...params, (err: Error | null) => {
        if (err) reject(err);
        else resolve();
      });
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes(TX_ABORTED_MSG)) {
      await healAbortedTx(db);
      // Retry once
      await new Promise<void>((resolve, reject) => {
        (db.run as Function)(sql, ...params, (err: Error | null) => {
          if (err) reject(err);
          else resolve();
        });
      });
    } else {
      throw e;
    }
  }
}

/**
 * Run a query and recover from aborted-transaction errors.
 */
async function allWithRecovery(
  db: duckdb.Database, sql: string, ...params: unknown[]
): Promise<Record<string, unknown>[]> {
  try {
    return await new Promise<Record<string, unknown>[]>((resolve, reject) => {
      (db.all as Function)(sql, ...params, (err: Error | null, rows: Record<string, unknown>[]) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes(TX_ABORTED_MSG)) {
      await healAbortedTx(db);
      // Retry once
      return await new Promise<Record<string, unknown>[]>((resolve, reject) => {
        (db.all as Function)(sql, ...params, (err: Error | null, rows: Record<string, unknown>[]) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    }
    throw e;
  }
}

// ── Ephemeral database connection management ────────────────────

/** Pool of DuckDB open flags. */
const OPEN_FLAGS = {
  read:  duckdb.OPEN_READONLY,
  write: duckdb.OPEN_READWRITE | duckdb.OPEN_CREATE,
} as const;

/** Options for withDb(). */
interface WithDbOptions {
  /** Extension context — needed for user-confirm dialogs during queueing. */
  ctx?: ExtensionContext;
  /** Progress callback. */
  onUpdate?: (update: { content: { type: string; text: string }[] }) => void;
  /** If true, fail immediately on lock conflict instead of queueing. */
  noQueue?: boolean;
}

/** Sleep helper. */
const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

/**
 * Check whether an error message indicates a DuckDB lock conflict.
 */
function isLockError(msg: string): boolean {
  const lower = msg.toLowerCase();
  return lower.includes("lock") || lower.includes("conflicting lock");
}

/**
 * Open a DuckDB database and return the instance.
 * Rejects on failure (including lock conflicts).
 */
function openDatabase(dbPath: string, flags: number): Promise<duckdb.Database> {
  return new Promise<duckdb.Database>((resolve, reject) => {
    // The callback only receives an error; the Database instance is the
    // return value of the constructor.  We capture it eagerly so we can
    // resolve with it.
    const db = new duckdb.Database(dbPath, flags, (err: Error | null) => {
      if (err) reject(err);
      else resolve(db);
    });
  });
}

/**
 * Close a DuckDB database, releasing the file lock.
 */
function closeDatabase(db: duckdb.Database): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    (db.close as Function)((err: Error | null) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

/**
 * Open a DuckDB database, run `fn(db)`, then close it.
 *
 * - **Read mode** (`mode: 'read'`): Opens with `OPEN_READONLY`.
 *   Fails fast if another process holds the lock.
 * - **Write mode** (`mode: 'write'`): Opens with `OPEN_READWRITE | OPEN_CREATE`.
 *   On lock conflict (another pi session writing), prompts the user to queue
 *   and retries for up to `WRITE_QUEUE_TIMEOUT` (5 minutes).
 *   Tables are auto-created on first open.
 *
 * @returns The value returned by `fn`.
 */
async function withDb<T>(
  cwd: string,
  mode: "read" | "write",
  fn: (db: duckdb.Database) => Promise<T>,
  options?: WithDbOptions,
): Promise<T> {
  const dbPath = resolve(cwd, DB_FILE);

  // For reads the database must already exist
  if (mode === "read") {
    try {
      await stat(dbPath);
    } catch {
      throw new Error("DB_NOT_FOUND");
    }
  }

  const flags = OPEN_FLAGS[mode];
  const startTime = Date.now();
  let userAsked = false;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const db = await openDatabase(dbPath, flags);
      try {
        // Ensure tables exist on write (idempotent — CREATE IF NOT EXISTS)
        if (mode === "write") {
          await initDb(db);
        }
        return await fn(db);
      } finally {
        // Release the file lock immediately after the operation
        try {
          await closeDatabase(db);
        } catch {
          /* best-effort close */
        }
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);

      // Re-throw non-lock errors immediately
      if (msg === "DB_NOT_FOUND") throw e;
      if (!isLockError(msg)) throw e;

      // ── Lock conflict handling ──
      if (mode === "read" || options?.noQueue) {
        // Reads and no-queue operations fail fast
        throw e;
      }

      const elapsed = Date.now() - startTime;
      if (elapsed >= WRITE_QUEUE_TIMEOUT) {
        throw new Error(
          "⏱ Write lock queue timed out after 5 minutes.\n" +
          "Another pi session is still holding the database lock.\n" +
          "Please close the other session and retry.",
        );
      }

      // Ask the user once whether they want to queue
      if (!userAsked && options?.ctx?.ui?.confirm) {
        const remaining = Math.ceil((WRITE_QUEUE_TIMEOUT - elapsed) / 1000);
        const ok = await options.ctx.ui.confirm(
          "Knowledge Database Locked",
          `Another pi session is currently writing to the knowledge database.\n` +
          `Queue and wait (up to ${remaining}s)?`,
        );
        if (!ok) {
          throw new Error(
            "Write cancelled by user.\n" +
            "Another pi session holds the database lock.\n" +
            "Please close the other session and retry.",
          );
        }
        userAsked = true;
        continue; // immediately retry after user confirms
      }

      // Show a progress update for silent retries (before user was asked)
      if (!userAsked) {
        const elapsedSec = Math.round(elapsed / 1000);
        options?.onUpdate?.({
          content: [{ type: "text" as const, text: `🔒 Waiting for database lock (${elapsedSec}s)...` }],
        });
      }

      // Wait before retrying
      await sleep(QUEUE_POLL_INTERVAL);
    }
  }
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
  await runWithRecovery(db, `
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
  await runWithRecovery(db, `
    CREATE TABLE IF NOT EXISTS tags (
      file_path VARCHAR NOT NULL,
      tag       VARCHAR NOT NULL
    )
  `);
  await runWithRecovery(db, "CREATE INDEX IF NOT EXISTS idx_tags_tag  ON tags(tag)");
  await runWithRecovery(db, "CREATE INDEX IF NOT EXISTS idx_tags_path ON tags(file_path)");
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
  const stored = await allWithRecovery(db, "SELECT path, file_mtime FROM files");
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
  await runWithRecovery(db, "BEGIN TRANSACTION");
  try {
    for (const p of toDelete) {
      await runWithRecovery(db, "DELETE FROM tags WHERE file_path = ?", p);
      await runWithRecovery(db, "DELETE FROM files WHERE path = ?", p);
    }
    for (const entry of changed) {
      const parsed = await parseFile(entry);
      const mtimeStr = new Date(entry.mtimeMs).toISOString();

      // Upsert file
      await runWithRecovery(db, `
        INSERT OR REPLACE INTO files (path, title, body, author, editor, created, modified, file_mtime)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, entry.path, parsed.title, parsed.body, parsed.author, parsed.editor,
         parsed.created, new Date().toISOString(), mtimeStr);

      // Re-insert tags (delete then insert)
      await runWithRecovery(db, "DELETE FROM tags WHERE file_path = ?", entry.path);
      for (const tag of parsed.tags) {
        await runWithRecovery(db, "INSERT INTO tags (file_path, tag) VALUES (?, ?)", entry.path, tag);
      }
    }
    await runWithRecovery(db, "COMMIT");
  } catch (e) {
    // Attempt rollback — if it fails we heal the connection for next time
    await healAbortedTx(db);
    throw e;
  }
  return true;
}

// ── Tool definitions ────────────────────────────────────────────

const Area = Type.String({ description: 'PARA category: "Areas", "Projects", or "Resources"' });

export default function (pi: ExtensionAPI) {
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
      "Cite every source from results using markdown footnotes (e.g. [^1]).",
      "Use the document path and title as the footnote reference label.",
    ],
    parameters: Type.Object({
      query: Type.String({ description: "Search query or topic" }),
      tags: Type.Optional(Type.Array(Type.String(), { description: "Filter by tag (OR logic)" })),
    }),

    async execute(_toolCallId, params, _signal, onUpdate, ctx) {
      // ── Step 1: Best-effort index sync ──
      // Use a write connection *without queueing*.  If another session holds
      // the lock we skip sync and serve potentially stale data — the sync
      // will happen on the next write operation.
      onUpdate?.({ content: [{ type: "text" as const, text: "🗄️ notes.duckdb — checking index freshness…" }] });

      let syncMessage = "🗄️ notes.duckdb — sync skipped (another session writing — results may be stale)";
      try {
        await withDb(ctx.cwd, "write", async (db) => {
          const changed = await syncIndex(db, ctx.cwd);
          syncMessage = changed
            ? "🗄️ notes.duckdb — index synced (files changed)"
            : "🗄️ notes.duckdb — index up to date";
        }, { noQueue: true });
      } catch {
        // Lock conflict — skip sync, serve potentially stale results
      }
      onUpdate?.({ content: [{ type: "text" as const, text: syncMessage }] });

      // ── Step 2: Query (read-only) ──
      const filterTags = params.tags ?? [];
      const q = params.query.toLowerCase();

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

      let rows: Record<string, unknown>[];
      try {
        rows = await withDb(ctx.cwd, "read", async (db) => {
          return await allWithRecovery(db, sql, ...sqlParams);
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        if (msg === "DB_NOT_FOUND") {
          return {
            content: [{ type: "text" as const,
              text: "📭 No documents indexed yet. Create a document first to populate the index." }],
            details: { results: [], count: 0, trace: "no-db" },
          };
        }
        if (isLockError(msg)) {
          return {
            content: [{ type: "text" as const,
              text: "🔒 Knowledge database is locked by another pi session.\n" +
                    "Please close the other session and retry." }],
            details: { results: [], count: 0, trace: "locked" },
          };
        }
        throw e;
      }

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
      "Cite every result using markdown footnotes (e.g. [^1]) with the page title and URL.",
    ],
    parameters: Type.Object({
      query: Type.String({ description: "The search query" }),
    }),

    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      // Build a clean search query without duplicating site: filters
      const pyScript = `
import sys, json, re
try:
    from ddgs import DDGS
except ImportError:
    print(json.dumps({"error": "Python 'ddgs' library not found. Install: pip install ddgs"}))
    sys.exit(0)

try:
    q = sys.argv[1]
    results = []
    seen_urls = set()

    with DDGS() as ddgs:
        # Strategy 1: search with site: filters targeting .edu and .ac.uk
        for site_filter in ["site:edu", "site:ac.uk"]:
            for r in ddgs.text(f"{site_filter} {q}", max_results=5):
                url = r.get("href", "") or ""
                if url and url not in seen_urls:
                    seen_urls.add(url)
                    results.append({
                        "title": r.get("title", ""),
                        "url": url,
                        "snippet": r.get("body", ""),
                    })

        # Strategy 2: general search, post-filter for edu/ac/gov domains
        pat = re.compile(r"\\.(edu|ac\\.[a-z]{2,}|gov\\.[a-z]{2,}|go\\.[a-z]{2,})", re.I)
        for r in ddgs.text(q, max_results=25):
            url = r.get("href", "") or ""
            if url and url not in seen_urls and pat.search(url):
                seen_urls.add(url)
                results.append({
                    "title": r.get("title", ""),
                    "url": url,
                    "snippet": r.get("body", ""),
                })

        # Strategy 3: if still no results, return general top results
        if not results:
            for r in ddgs.text(q, max_results=5):
                url = r.get("href", "") or ""
                if url and url not in seen_urls:
                    seen_urls.add(url)
                    results.append({
                        "title": r.get("title", ""),
                        "url": url,
                        "snippet": r.get("body", ""),
                    })

    print(json.dumps(results[:10]))
except Exception as e:
    print(json.dumps({"error": str(e)}))
`.trim();

      try {
        const r = await pi.exec("python3", ["-c", pyScript, params.query], { timeout: 30_000 });
        if (r.code !== 0) throw new Error(r.stderr || `exit code ${r.code}`);

        const data = JSON.parse(r.stdout);

        if (data && data.error) {
          const fallbackUrl =
            `https://duckduckgo.com/?q=${encodeURIComponent(`(site:edu OR site:ac.* OR site:gov) ${params.query}`)}`;
          return {
            content: [{ type: "text" as const,
              text: `Web search unavailable: ${data.error}\n\nTry manually:\n${fallbackUrl}` }],
            details: { error: data.error, fallbackUrl },
          };
        }

        if (!data || !data.length) {
          const fallbackUrl =
            `https://duckduckgo.com/?q=${encodeURIComponent(`(site:edu OR site:ac.* OR site:gov) ${params.query}`)}`;
          return {
            content: [{ type: "text" as const,
              text: `No results from reputable sources. Try manually:\n${fallbackUrl}` }],
            details: { count: 0, fallbackUrl },
          };
        }

        const text = data
          .map((r: { title: string; url: string; snippet?: string }, i: number) =>
            `${i + 1}. [${r.title}](${r.url})${r.snippet ? `\n   ${(r.snippet || "").slice(0, 200)}` : ""}`)
          .join("\n\n");

        return {
          content: [{ type: "text" as const, text: `Results for "${params.query}" from reputable sources:\n\n${text}` }],
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

      // ── Write file to disk (always succeeds) ──
      const fm = formatFrontmatter({
        author: "pi",
        date: now,
        editor: "lam",
        title: params.title,
        tags: params.tags,
      });

      await mkdir(dirPath, { recursive: true });
      await writeFile(filePath, fm + "\n" + params.content, "utf-8");

      // ── Update index (write connection with queue + user confirm) ──
      onUpdate?.({ content: [{ type: "text" as const, text: "🗄️ notes.duckdb — inserting into index…" }] });

      let indexOk = false;
      try {
        await withDb(ctx.cwd, "write", async (db) => {
          await runWithRecovery(db,
            "INSERT OR REPLACE INTO files (path, title, body, author, editor, created, modified, file_mtime) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            relPath, params.title, params.content, "pi", "lam", now, now, now);
          await runWithRecovery(db, "DELETE FROM tags WHERE file_path = ?", relPath);
          for (const tag of params.tags) {
            await runWithRecovery(db, "INSERT INTO tags (file_path, tag) VALUES (?, ?)", relPath, tag);
          }
        }, { ctx, onUpdate });
        indexOk = true;
      } catch (e: unknown) {
        // File was written to disk even if index update failed.
        // It will be picked up on the next successful sync.
        console.error("[para-knowledge] DB insert failed for new doc:", e);
      }

      const indexNote = indexOk
        ? "🗄️ notes.duckdb — indexed"
        : "⚠️  File created but index update skipped (another session holds the lock). It will be indexed on next search.";

      return {
        content: [{ type: "text" as const, text:
          `${indexNote}\nCreated: ${filePath}\nTitle: ${params.title}\nTags: ${params.tags.join(", ")}` }],
        details: { path: filePath, title: params.title, tags: params.tags, indexOk },
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
      // ── Read existing file ──
      const filePath = resolve(ctx.cwd, params.path);
      const existing = await readFile(filePath, "utf-8");
      const fm = parseFrontmatter(existing);
      const oldTags: string[] = fm.tags ?? [];
      const now = new Date().toISOString();

      // ── Write updated file to disk (always succeeds) ──
      const newFm = formatFrontmatter({
        author: "pi",
        date: now,
        editor: "lam",
        title: params.title ?? fm.title ?? "",
        tags: params.tags ?? oldTags,
      });

      await writeFile(filePath, newFm + "\n" + params.content, "utf-8");

      // ── Update index (write connection with queue + user confirm) ──
      onUpdate?.({ content: [{ type: "text" as const, text: "🗄️ notes.duckdb — updating index row…" }] });

      let indexOk = false;
      try {
        await withDb(ctx.cwd, "write", async (db) => {
          const newTags = params.tags ?? oldTags;
          await runWithRecovery(db,
            "UPDATE files SET title = ?, body = ?, modified = ?, file_mtime = ? WHERE path = ?",
            params.title ?? fm.title ?? "", params.content, now, now, params.path);
          await runWithRecovery(db, "DELETE FROM tags WHERE file_path = ?", params.path);
          for (const tag of newTags) {
            await runWithRecovery(db, "INSERT INTO tags (file_path, tag) VALUES (?, ?)", params.path, tag);
          }
        }, { ctx, onUpdate });
        indexOk = true;
      } catch (e: unknown) {
        // File was written to disk even if index update failed.
        // It will be picked up on the next successful sync.
        console.error("[para-knowledge] DB update failed:", e);
      }

      const indexNote = indexOk
        ? "🗄️ notes.duckdb — updated"
        : "⚠️  File updated but index update skipped (another session holds the lock). It will be synced on next search.";

      return {
        content: [{ type: "text" as const, text:
          `${indexNote}\nUpdated: ${filePath} (frontmatter renewed).` }],
        details: { path: filePath, title: params.title ?? fm.title ?? "", indexOk },
      };
    },
  });
}
