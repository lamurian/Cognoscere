/**
 * batch_create_para_docs — creates multiple PARA documents in one call,
 * indexes all in DuckDB, then runs batch semantic linking across them.
 *
 * Tools provided:
 *   batch_create_para_docs  — create N documents, index them, auto-link
 *
 * DB connection management delegates to para-knowledge/db.ts (withDb)
 * for concurrent-write safety (retry queue, lock detection, TX recovery).
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { slugify, formatFrontmatter } from "./yaml.js";
import { withDb, initDb } from "../para-knowledge/db.js";
import { runWithRecovery, allWithRecovery } from "../para-knowledge/lock.js";
import { tokenize } from "../_common/tokenize.js";
import { findRelated, appendLinks } from "./search.js";

// ── Types ─────────────────────────────────────────────────────────────

interface BatchDoc {
  title: string;
  content: string;
  tags: string[];
  area?: string;
  description?: string;
  source?: string;
}

interface CreatedFile {
  path: string;
  title: string;
  relPath: string;
}

// ── Step 1: Create all files on disk ──────────────────────────────────

async function createFilesOnDisk(docs: BatchDoc[], cwd: string): Promise<CreatedFile[]> {
  const created: CreatedFile[] = [];

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    const area = doc.area ?? "Resources";
    const dirPath = resolve(cwd, area);
    const slug = slugify(doc.title);
    const filePath = join(dirPath, `${slug}.md`);
    const relPath = `${area}/${slug}.md`;
    const now = new Date().toISOString();

    const frontmatterFields: Record<string, unknown> = {
      title: doc.title,
      author: "pi",
      editor: "lam",
      date: now,
      tags: doc.tags,
    };
    if (doc.description?.trim()) frontmatterFields.description = doc.description.trim();
    if (doc.source?.trim()) frontmatterFields.source = doc.source.trim();

    const fm = formatFrontmatter(frontmatterFields);
    await mkdir(dirPath, { recursive: true });
    await writeFile(filePath, fm + "\n" + doc.content, "utf-8");

    created.push({ path: filePath, title: doc.title, relPath });
  }

  return created;
}

// ── Step 2: Index all documents in DuckDB ─────────────────────────────
// Uses para-knowledge's withDb (retry queue + lock recovery).

async function indexDocumentsInDb(
  docs: BatchDoc[],
  created: CreatedFile[],
  cwd: string,
): Promise<void> {
  await withDb(cwd, "write", async (db) => {
    await initDb(db);
    const now = new Date().toISOString();

    for (let i = 0; i < docs.length; i++) {
      const doc = docs[i];
      const relPath = created[i].relPath;

      // ── Insert/replace file row ──
      await runWithRecovery(
        db,
        `INSERT OR REPLACE INTO files (path, title, body, author, editor, created, modified, file_mtime, source_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        relPath,
        doc.title,
        doc.content,
        "pi",
        "lam",
        now,
        now,
        now,
        doc.source ?? null,
      );

      // ── Re-index tags ──
      await runWithRecovery(db, "DELETE FROM tags WHERE file_path = ?", relPath);
      for (const tag of doc.tags) {
        await runWithRecovery(
          db,
          "INSERT INTO tags (file_path, tag) VALUES (?, ?)",
          relPath,
          tag,
        );
      }

      // ── Re-build BM25 term index ──
      await runWithRecovery(db, "DELETE FROM term_index WHERE file_path = ?", relPath);
      const boostedTitle = Array.from({ length: 3 }, () => doc.title).join(" ");
      const terms = tokenize(`${boostedTitle} ${doc.content}`);
      const tfMap = new Map<string, number>();
      for (const t of terms) tfMap.set(t, (tfMap.get(t) ?? 0) + 1);
      const termEntries = [...tfMap.entries()];
      for (let j = 0; j < termEntries.length; j += 500) {
        const chunk = termEntries.slice(j, j + 500);
        const placeholders = chunk.map(() => "(?, ?, ?)").join(", ");
        const batchParams: unknown[] = [];
        for (const [term, tf] of chunk) batchParams.push(term, relPath, tf);
        await runWithRecovery(
          db,
          `INSERT INTO term_index (term, file_path, tf) VALUES ${placeholders}`,
          ...batchParams,
        );
      }

      // ── Doc length ──
      await runWithRecovery(
        db,
        "INSERT OR REPLACE INTO doc_lengths (file_path, doc_length) VALUES (?, ?)",
        relPath,
        terms.length,
      );
    }

    // ── Recompute corpus stats ──
    const rows = (await allWithRecovery(
      db,
      "SELECT COUNT(*) AS total_docs, COALESCE(AVG(doc_length), 1.0) AS avg_doc_length FROM doc_lengths",
    )) as unknown as { total_docs: number | bigint; avg_doc_length: number }[];
    if (rows.length > 0) {
      const totalDocs: number =
        typeof rows[0].total_docs === "bigint"
          ? Number(rows[0].total_docs)
          : (rows[0].total_docs as number);
      await runWithRecovery(
        db,
        "UPDATE corpus_stats SET value = ? WHERE key = 'total_docs'",
        totalDocs,
      );
      await runWithRecovery(
        db,
        "UPDATE corpus_stats SET value = ? WHERE key = 'avg_doc_length'",
        rows[0].avg_doc_length,
      );
    }
  });
}

// ── Step 3: Auto-link across the batch ────────────────────────────────
// Uses para-knowledge's withDb (retry queue + lock recovery).

async function autoLinkBatch(
  docs: BatchDoc[],
  created: CreatedFile[],
  cwd: string,
): Promise<number> {
  return withDb(cwd, "read", async (db) => {
    await initDb(db);
    let linkedCount = 0;

    for (let i = 0; i < docs.length; i++) {
      const doc = docs[i];
      const relPath = created[i].relPath;
      const related = await findRelated(db, relPath, doc.title, doc.tags, 5);
      if (related.length > 0) {
        await appendLinks(created[i].path, related);
        linkedCount++;
      }
    }

    return linkedCount;
  });
}

// ── Tool registration ─────────────────────────────────────────────────

export default function (pi: ExtensionAPI): void {
  pi.registerTool({
    name: "batch_create_para_docs",
    label: "Batch Create PARA Docs",
    description:
      "Create multiple PARA knowledge documents (markdown with YAML frontmatter) in one call, " +
      "index all of them in notes.duckdb, and run semantic auto-linking across the batch. " +
      "Fundamental/reference content should go in Resources/; practical content in Projects/.",
    promptSnippet: "Create several PARA documents at once, index them, and auto-link them",
    promptGuidelines: [
      "Use batch_create_para_docs when creating 3+ related documents to save tool calls and enable batch auto-linking.",
      "Each document in the array has: title, content, tags, area (Resources/Projects/Areas), optional description, optional source.",
      "After creation, the tool auto-links all documents in the batch to each other using BM25 semantic similarity.",
    ],
    parameters: Type.Object({
      documents: Type.Array(
        Type.Object({
          title: Type.String({ description: "Document title" }),
          content: Type.String({ description: "Markdown body content" }),
          tags: Type.Array(Type.String(), { description: "Tags for frontmatter" }),
          area: Type.Optional(
            Type.String({
              description:
                'PARA category: "Areas", "Projects", or "Resources" (default: "Resources")',
            }),
          ),
          description: Type.Optional(
            Type.String({ description: "Short summary ≤ 200 characters, enriches BM25 search" }),
          ),
          source: Type.Optional(Type.String({ description: "Original source URL (optional)" })),
        }),
        { description: "Array of documents to create" },
      ),
      autoLink: Type.Optional(
        Type.Boolean({
          description:
            "Whether to run semantic auto-linking across the batch after creation (default: true)",
        }),
      ),
    }),

    async execute(_toolCallId, params, _signal, onUpdate, ctx) {
      const docs = params.documents;
      const autoLink = params.autoLink !== false;
      const cwd = ctx.cwd;

      // Step 1: Create files on disk
      let created: CreatedFile[];
      try {
        created = await createFilesOnDisk(docs, cwd);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        return {
          content: [{ type: "text", text: `❌ File creation failed: ${msg}` }],
          details: { error: "CREATE_FAILED" },
        };
      }

      onUpdate?.({
        content: [
          { type: "text", text: `📝 Created ${created.length} files. Indexing in notes.duckdb…` },
        ],
        details: {},
      });

      // Step 2: Index in DuckDB (withDb handles lock retry + recovery)
      try {
        await indexDocumentsInDb(docs, created, cwd);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error("[batch-create] DuckDB indexing error:", msg);
        onUpdate?.({
          content: [
            {
              type: "text",
              text: `⚠️  Files created but DuckDB indexing failed: ${msg.slice(0, 200)}.`,
            },
          ],
          details: {},
        });
        return {
          content: [
            {
              type: "text",
              text: `Created ${created.length} documents. DB indexing failed — will sync on next search.`,
            },
          ],
          details: { created: created.map((c) => c.path), autoLinked: false },
        };
      }

      // Step 3: Auto-link across the batch
      let linkedCount = 0;
      if (autoLink) {
        onUpdate?.({
          content: [{ type: "text", text: "🔗 Running batch semantic auto-linking…" }],
          details: {},
        });

        try {
          linkedCount = await autoLinkBatch(docs, created, cwd);
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e);
          console.error("[batch-create] Auto-link error:", msg);
          onUpdate?.({
            content: [{ type: "text", text: `⚠️  Auto-linking error: ${msg.slice(0, 200)}.` }],
            details: {},
          });
        }
      }

      const linkNote = autoLink
        ? `\n🔗 Auto-linked: ${linkedCount}/${created.length} documents received [[wikilinks]]`
        : "";
      const lines = created.map((c) => `  • ${c.relPath} — ${c.title}`).join("\n");

      return {
        content: [
          {
            type: "text",
            text: `✅ Batch created and indexed ${created.length} documents:${linkNote}\n\n${lines}`,
          },
        ],
        details: {
          created: created.map((c) => ({ path: c.path, title: c.title, relPath: c.relPath })),
          count: created.length,
          autoLinked: autoLink,
          linkedCount,
        },
      };
    },
  });
}
