/**
 * create_para_doc tool — creates a new markdown file with YAML frontmatter
 * and inserts it into the DuckDB index (including BM25 term index).
 *
 * Frontmatter fields (standardised):
 *   title, description, author, editor, date, tags, source
 *
 * Values are automatically YAML-quoted by formatFrontmatter.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { withDb, runWithRecovery, initDb } from "../db.js";
import { formatFrontmatter } from "../frontmatter.js";
import { slugify } from "../files.js";
import { sanitiseTag } from "../sync.js";
import { tokenize } from "../bm25.js";
import { insertTermIndexEntries } from "../config.js";
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
      description: Type.Optional(
        Type.String({ description: "Short summary ≤ 200 characters, enriches BM25 search" }),
      ),
      source: Type.Optional(
        Type.String({ description: "Original source URL (optional, exact verbatim URL)" }),
      ),
    }),

    async execute(_toolCallId, params, _signal, onUpdate, ctx) {
      const area = params.area ?? "Resources";
      const dirPath = resolve(ctx.cwd, area);
      const slug = slugify(params.title);
      const filePath = join(dirPath, `${slug}.md`);
      const relPath = `${area}/${slug}.md`;
      const now = new Date().toISOString();

      // ── Build standardised frontmatter ──
      // Phase 2c: auto-generate description from content if not provided
      const autoDesc = params.description?.trim() ||
        params.content.replace(/\n+/g, " ").slice(0, 150).trim() || null;

      const frontmatterFields: Record<string, unknown> = {
        title: params.title,
        author: "pi",
        editor: "lam",
        date: now,
        tags: params.tags,
      };
      if (autoDesc) {
        frontmatterFields.description = autoDesc;
      }
      if (params.source && params.source.trim()) {
        frontmatterFields.source = params.source.trim();
      }

      const fm = formatFrontmatter(frontmatterFields);

      // ── Write file to disk (always succeeds) ──
      await mkdir(dirPath, { recursive: true });
      await writeFile(filePath, fm + "\n" + params.content, "utf-8");

      // ── Update index (write connection with queue + user confirm) ──
      onUpdate?.({
        content: [{ type: "text" as const, text: "🗄️ notes.duckdb — inserting into index…" }],
        details: {},
      });

      let indexOk = false;
      try {
        await withDb(
          ctx.cwd,
          "write",
          async (db) => {
            await initDb(db);

            // Upsert file row (Phase 2b: no body column — body read from disk)
            await runWithRecovery(
              db,
              `INSERT OR REPLACE INTO files (path, title, author, editor, created, modified, file_mtime, source_url)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              relPath,
              params.title,
              "pi",
              "lam",
              now,
              now,
              now,
              params.source || null,
            );

            // Re-insert tags (sanitised)
            await runWithRecovery(db, "DELETE FROM tags WHERE file_path = ?", relPath);
            for (const tag of params.tags) {
              const cleanTag = sanitiseTag(tag);
              if (cleanTag === null) continue;
              await runWithRecovery(
                db,
                "INSERT INTO tags (file_path, tag) VALUES (?, ?)",
                relPath,
                cleanTag,
              );
            }

            // Build BM25 term index (Phase 2a: via term_dict-normalized entries)
            const boostedTitle = Array.from(
              { length: BM25_DEFAULTS.TITLE_BOOST },
              () => params.title,
            ).join(" ");
            const descriptionBoost = autoDesc ?? "";
            const terms = tokenize(`${boostedTitle} ${descriptionBoost} ${params.content}`);
            const tfMap = new Map<string, number>();
            for (const term of terms) {
              tfMap.set(term, (tfMap.get(term) ?? 0) + 1);
            }
            // Phase 2a: insert via term_dict-normalized entries
            await insertTermIndexEntries(db, relPath, tfMap);

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

      const sourceNote = params.source ? `\nSource: ${params.source}` : "";
      const descNote = autoDesc ? `\nDescription: ${autoDesc}` : "";
      return {
        content: [
          {
            type: "text" as const,
            text: `${indexNote}\nCreated: ${filePath}\nTitle: ${params.title}\nTags: ${params.tags.join(", ")}${descNote}${sourceNote}`,
          },
        ],
        details: {
          path: filePath,
          title: params.title,
          description: autoDesc,
          tags: params.tags,
          source: params.source ?? null,
          indexOk,
        },
      };
    },
  });
}
