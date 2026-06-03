/**
 * search_para_docs tool — BM25-powered search across PARA documents.
 *
 * On each call:
 * 1. Best-effort index sync (no-queue, skip if another session holds lock)
 * 2. Tokenise query and run BM25 search with optional tag filter
 * 3. Return ranked results with scores
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { stat } from "node:fs/promises";
import { resolve } from "node:path";
import { withDb, isLockError, initDb } from "../db.js";
import { searchDocuments, searchByTagsOnly } from "../search.js";
import { syncIndex } from "../sync.js";

/**
 * Register the search_para_docs tool.
 */
export function registerSearchDocsTool(pi: ExtensionAPI): void {
  pi.registerTool({
    name: "search_para_docs",
    label: "Search PARA Docs",
    description:
      "Search the DuckDB-indexed PARA documents (Areas/Projects/Resources) by tags and content. " +
      "Uses BM25 (Okapi BM25) ranking for text search with O(log n) inverted-index lookups. " +
      "Tags use OR logic for filtering. The index is auto-synced on each call.",
    promptSnippet:
      "Search for relevant knowledge documents in Areas, Projects, Resources directories",
    promptGuidelines: [
      "Use search_para_docs first when the user asks a knowledge question.",
      "Pass the user's question as query and infer relevant tags from context.",
      "Cite sources using BibTeX citation keys from @ref.bib. Use [@citekey] or @citekey inline.",
      "For existing PARA docs, reference by path — no BibTeX entry needed.",
      "See knowledge skill for citation format.",
    ],
    parameters: Type.Object({
      query: Type.String({ description: "Search query or topic" }),
      tags: Type.Optional(Type.Array(Type.String(), { description: "Filter by tag (OR logic)" })),
    }),

    async execute(_toolCallId, params, _signal, onUpdate, ctx) {
      // ── Step 1: Lightweight sync (write, but safe now with batch INSERTs + transactions) ──
      onUpdate?.({
        content: [{ type: "text" as const, text: "🗄️ notes.duckdb — checking index freshness…" }],
        details: {},
      });

      // Only sync if DB already exists (avoids WAL creation for missing DB)
      const dbPath = resolve(ctx.cwd, "notes.duckdb");
      try {
        await stat(dbPath);
        // DB exists — try sync (best-effort, no-queue to avoid blocking)
        await withDb(
          ctx.cwd,
          "write",
          async (db) => {
            await syncIndex(db, ctx.cwd);
          },
          { noQueue: true },
        ).catch(() => {
          /* best-effort sync */
        });
      } catch {
        // DB doesn't exist or stat failed — create it with a sync
        await withDb(ctx.cwd, "write", async (db) => {
          await initDb(db);
          await syncIndex(db, ctx.cwd);
        }, { noQueue: true }).catch(() => {
          /* best-effort create */
        });
      }

      // ── Step 2: BM25 search (read-only) ──
      const query = params.query ?? "";
      const filterTags = params.tags ?? [];

      onUpdate?.({
        content: [
          {
            type: "text" as const,
            text:
              filterTags.length > 0
                ? `🗄️ notes.duckdb — BM25 search with tag filter [${filterTags.join(", ")}]`
                : "🗄️ notes.duckdb — BM25 search...",
          },
        ],
        details: {},
      });

      try {
        const { results, trace } = await withDb(ctx.cwd, "read", async (db) => {
          if (!query && filterTags.length > 0) {
            // Only tags, no text query
            const results = await searchByTagsOnly(db, filterTags);
            return { results, trace: "tag-only" };
          }
          return await searchDocuments(db, query, filterTags);
        });

        const responseTrace = `🗄️ notes.duckdb — ${trace}  results:${results.length}`;

        if (results.length === 0) {
          return {
            content: [
              {
                type: "text" as const,
                text: `${responseTrace}\nNo documents found for "${query}"${filterTags.length ? ` with tags [${filterTags.join(", ")}]` : ""}.`,
              },
            ],
            details: { results: [], count: 0, trace },
          };
        }

        // Build result listing with BM25 scores
        const list = results
          .map((r) => {
            const rel = r.matchedByTag
              ? "tag-only"
              : r.score > 5
                ? "high"
                : r.score > 2
                  ? "medium"
                  : "low";
            const tagHint =
              r.tagMatches.length > 0 ? ` 🏷️${r.tagMatches.slice(0, 3).join(", ")}` : "";
            return `- [${r.title}](${r.path})  (score: ${r.score.toFixed(2)}, relevance: ${rel}${tagHint})`;
          })
          .join("\n");

        return {
          content: [
            {
              type: "text" as const,
              text: `${responseTrace}\n\nFound ${results.length} document(s):\n\n${list}`,
            },
          ],
          details: { results, count: results.length, trace },
        };
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        if (msg === "DB_NOT_FOUND") {
          return {
            content: [
              {
                type: "text" as const,
                text: "📭 No documents indexed yet. Create a document first to populate the index.",
              },
            ],
            details: { results: [], count: 0, trace: "no-db" },
          };
        }
        if (isLockError(msg)) {
          return {
            content: [
              {
                type: "text" as const,
                text: "🔒 Knowledge database is locked by another pi session.\nPlease close the other session and retry.",
              },
            ],
            details: { results: [], count: 0, trace: "locked" },
          };
        }
        throw e;
      }
    },
  });
}
