/**
 * update_para_doc tool — updates an existing markdown file's body content,
 * renews its YAML frontmatter, and refreshes the DuckDB index (including
 * BM25 term index) inside a single transaction.
 *
 * Frontmatter fields (standardised):
 *   title, description, author, editor, date, tags, source
 *
 * Values are automatically YAML-quoted by formatFrontmatter.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { withDb, runWithRecovery, initDb } from "../db.js";
import { parseFrontmatter, formatFrontmatter } from "../frontmatter.js";
import { tokenize } from "../bm25.js";
import { BM25_DEFAULTS } from "../types.js";

/**
 * Register the update_para_doc tool.
 */
export function registerUpdateDocTool(pi: ExtensionAPI): void {
  pi.registerTool({
    name: "update_para_doc",
    label: "Update PARA Doc",
    description:
      "Update an existing markdown file's body content and renew its YAML frontmatter " +
      "(date refreshed, author: pi / editor: lam preserved). Also syncs the DuckDB index " +
      "including the BM25 term index.",
    promptSnippet: "Update and renew frontmatter of an existing knowledge document",
    parameters: Type.Object({
      path: Type.String({ description: "Relative path, e.g. Projects/my-doc.md" }),
      content: Type.String({ description: "New body content (without frontmatter)" }),
      tags: Type.Optional(
        Type.Array(Type.String(), { description: "Replacement tags (omit to keep existing)" }),
      ),
      title: Type.Optional(
        Type.String({ description: "Replacement title (omit to keep existing)" }),
      ),
      description: Type.Optional(
        Type.String({
          description:
            "Short summary ≤ 200 characters (omit to keep existing; empty string to clear)",
        }),
      ),
      source: Type.Optional(
        Type.String({
          description: "Replacement source URL (omit to keep existing; empty string to clear)",
        }),
      ),
    }),

    /* eslint-disable-next-line complexity */
    async execute(_toolCallId, params, _signal, onUpdate, ctx) {
      // ── Read existing file ──
      const filePath = resolve(ctx.cwd, params.path);
      const existing = await readFile(filePath, "utf-8");
      const fm = parseFrontmatter(existing);
      const oldTags: string[] = fm.tags ?? [];
      const now = new Date().toISOString();

      const newTitle = params.title ?? fm.title ?? "";
      const newTags = params.tags ?? oldTags;
      // description: explicit param wins (empty string → null to clear), then existing, then null
      const newDescription =
        params.description !== undefined ? params.description || null : (fm.description ?? null);
      // source: explicit param wins (empty string → null to clear), then existing, then null
      const newSource =
        params.source !== undefined ? params.source || null : (fm.source_url ?? null);

      // ── Write updated file to disk ──
      const frontmatterFields: Record<string, unknown> = {
        title: newTitle,
        author: "pi",
        editor: "lam",
        date: now,
        tags: newTags,
      };
      if (newDescription) {
        frontmatterFields.description = newDescription;
      }
      if (newSource) {
        frontmatterFields.source = newSource;
      }

      const newFm = formatFrontmatter(frontmatterFields);

      await writeFile(filePath, newFm + "\n" + params.content, "utf-8");

      // ── Update index (write connection with queue + user confirm) ──
      onUpdate?.({
        content: [{ type: "text" as const, text: "🗄️ notes.duckdb — updating index row…" }],
        details: {},
      });

      let indexOk = false;
      try {
        await withDb(
          ctx.cwd,
          "write",
          async (db) => {
            await initDb(db);

            // Update file row (include source and description)
            await runWithRecovery(
              db,
              "UPDATE files SET title = ?, body = ?, modified = ?, file_mtime = ?, source_url = ? WHERE path = ?",
              newTitle,
              params.content,
              now,
              now,
              newSource,
              params.path,
            );

            // Re-insert tags
            await runWithRecovery(db, "DELETE FROM tags WHERE file_path = ?", params.path);
            for (const tag of newTags) {
              await runWithRecovery(
                db,
                "INSERT INTO tags (file_path, tag) VALUES (?, ?)",
                params.path,
                tag,
              );
            }

            // Rebuild BM25 term index (description boosts search relevance)
            await runWithRecovery(db, "DELETE FROM term_index WHERE file_path = ?", params.path);
            const boostedTitle = Array.from(
              { length: BM25_DEFAULTS.TITLE_BOOST },
              () => newTitle,
            ).join(" ");
            const descriptionBoost = newDescription ?? "";
            const terms = tokenize(`${boostedTitle} ${descriptionBoost} ${params.content}`);
            const tfMap = new Map<string, number>();
            for (const term of terms) {
              tfMap.set(term, (tfMap.get(term) ?? 0) + 1);
            }
            // Batch INSERT all terms — avoids WAL bloat from per-term transactions
            const termEntries = [...tfMap.entries()];
            for (let i = 0; i < termEntries.length; i += 500) {
              const chunk = termEntries.slice(i, i + 500);
              const placeholders = chunk.map(() => "(?, ?, ?)").join(", ");
              const batchParams: unknown[] = [];
              for (const [term, tf] of chunk) batchParams.push(term, params.path, tf);
              await runWithRecovery(
                db,
                `INSERT INTO term_index (term, file_path, tf) VALUES ${placeholders}`,
                ...batchParams,
              );
            }

            // Doc length
            await runWithRecovery(
              db,
              "INSERT OR REPLACE INTO doc_lengths (file_path, doc_length) VALUES (?, ?)",
              params.path,
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
        console.error("[para-knowledge] DB update failed:", e);
      }

      const indexNote = indexOk
        ? "🗄️ notes.duckdb — updated"
        : "⚠️  File updated but index update skipped (another session holds the lock). It will be synced on next search.";

      const sourceNote = newSource ? `\nSource: ${newSource}` : "";
      return {
        content: [
          {
            type: "text" as const,
            text: `${indexNote}\nUpdated: ${filePath} (frontmatter renewed).${sourceNote}`,
          },
        ],
        details: {
          path: filePath,
          title: newTitle,
          description: newDescription,
          source: newSource,
          indexOk,
        },
      };
    },
  });
}
