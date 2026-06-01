/**
 * create_para_doc tool — creates a new markdown file with YAML frontmatter
 * and inserts it into the DuckDB index (including BM25 term index).
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { withDb, runWithRecovery, initDb } from "../db.js";
import { formatFrontmatter } from "../frontmatter.js";
import { slugify } from "../files.js";
import { tokenize } from "../search.js";
import { BM25_DEFAULTS } from "../types.js";

const Area = Type.String({
  description: 'PARA category: "Areas", "Projects", or "Resources"',
});

/**
 * Register the create_para_doc tool.
 */
export function registerCreateDocTool(pi: ExtensionAPI): void {
  pi.registerTool({
    name: "create_para_doc",
    label: "Create PARA Doc",
    description:
      "Create a new markdown file with YAML frontmatter in Areas, Projects, or Resources. " +
      "Also inserts the document and its BM25 term index into the DuckDB database automatically.",
    promptSnippet: "Create a new knowledge document in the PARA directory structure",
    parameters: Type.Object({
      title: Type.String({ description: "Document title" }),
      content: Type.String({ description: "Markdown body content" }),
      tags: Type.Array(Type.String(), { description: "Tags for frontmatter" }),
      area: Type.Optional(Area),
      source_url: Type.Optional(Type.String({ description: "Original source URL (optional, used for dedup checks)" })),
    }),

    async execute(_toolCallId, params, _signal, onUpdate, ctx) {
      const area = params.area ?? "Resources";
      const dirPath = resolve(ctx.cwd, area);
      const slug = slugify(params.title);
      const filePath = join(dirPath, `${slug}.md`);
      const relPath = `${area}/${slug}.md`;
      const now = new Date().toISOString();

      // ── Write file to disk (always succeeds) ──
      const frontmatterFields: Record<string, unknown> = {
        author: "pi",
        date: now,
        editor: "lam",
        title: params.title,
        tags: params.tags,
      };
      if (params.source_url && params.source_url.trim()) {
        frontmatterFields.source_url = params.source_url.trim();
      }
      const fm = formatFrontmatter(frontmatterFields);

      await mkdir(dirPath, { recursive: true });
      await writeFile(filePath, fm + "\n" + params.content, "utf-8");

      // ── Update index (write connection with queue + user confirm) ──
      onUpdate?.({
        content: [{ type: "text" as const, text: "🗄️ notes.duckdb — inserting into index…" }],
      });

      let indexOk = false;
      try {
        await withDb(
          ctx.cwd,
          "write",
          async (db) => {
            await initDb(db);

            // Upsert file row (include source_url)
            await runWithRecovery(
              db,
              `INSERT OR REPLACE INTO files (path, title, body, author, editor, created, modified, file_mtime, source_url)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              relPath,
              params.title,
              params.content,
              "pi",
              "lam",
              now,
              now,
              now,
              (params.source_url || null),
            );

            // Re-insert tags
            await runWithRecovery(db, "DELETE FROM tags WHERE file_path = ?", relPath);
            for (const tag of params.tags) {
              await runWithRecovery(db, "INSERT INTO tags (file_path, tag) VALUES (?, ?)", relPath, tag);
            }

            // Build BM25 term index
            await runWithRecovery(db, "DELETE FROM term_index WHERE file_path = ?", relPath);
            const boostedTitle = Array.from(
              { length: BM25_DEFAULTS.TITLE_BOOST },
              () => params.title,
            ).join(" ");
            const terms = tokenize(`${boostedTitle} ${params.content}`);
            const tfMap = new Map<string, number>();
            for (const term of terms) {
              tfMap.set(term, (tfMap.get(term) ?? 0) + 1);
            }
            for (const [term, tf] of tfMap) {
              await runWithRecovery(
                db,
                "INSERT INTO term_index (term, file_path, tf) VALUES (?, ?, ?)",
                term,
                relPath,
                tf,
              );
            }

            // Doc length
            await runWithRecovery(
              db,
              "INSERT OR REPLACE INTO doc_lengths (file_path, doc_length) VALUES (?, ?)",
              relPath,
              terms.length,
            );

            // Update corpus stats
            await runWithRecovery(
              db,
              `UPDATE corpus_stats SET value = (SELECT COUNT(*) FROM doc_lengths) WHERE key = 'total_docs'`,
            );
            await runWithRecovery(
              db,
              `UPDATE corpus_stats SET value = COALESCE((SELECT AVG(doc_length) FROM doc_lengths), 1.0) WHERE key = 'avg_doc_length'`,
            );
          },
          { ctx, onUpdate },
        );
        indexOk = true;
      } catch (e: unknown) {
        console.error("[para-knowledge] DB insert failed for new doc:", e);
      }

      const indexNote = indexOk
        ? "🗄️ notes.duckdb — indexed"
        : "⚠️  File created but index update skipped (another session holds the lock). It will be indexed on next search.";

      const sourceNote = params.source_url ? `\nSource: ${params.source_url}` : "";
      return {
        content: [
          {
            type: "text" as const,
            text: `${indexNote}\nCreated: ${filePath}\nTitle: ${params.title}\nTags: ${params.tags.join(", ")}${sourceNote}`,
          },
        ],
        details: { path: filePath, title: params.title, tags: params.tags, source_url: params.source_url || null, indexOk },
      };
    },
  });
}
