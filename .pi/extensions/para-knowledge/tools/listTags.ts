/**
 * list_para_tags tool — returns all unique tags from the DuckDB-indexed
 * PARA documents (Areas/Projects/Resources). Useful for choosing existing
 * tags when creating a new document, rather than inventing new ones.
 *
 * Query: SELECT DISTINCT tag FROM tags ORDER BY tag
 *
 * Returns an array of tag strings. If the database doesn't exist yet,
 * returns an empty array (no tags indexed).
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { withDb, allWithRecovery } from "../db.js";

/**
 * Register the list_para_tags tool.
 */
export function registerListTagsTool(pi: ExtensionAPI): void {
  pi.registerTool({
    name: "list_para_tags",
    label: "List PARA Tags",
    description:
      "Return all unique tags from the DuckDB-indexed PARA documents " +
      "(Areas/Projects/Resources). Use this before create_para_doc to " +
      "choose existing tags and avoid tag proliferation.",
    promptSnippet: "List all existing unique tags in the PARA knowledge base",
    parameters: Type.Object({}),

    async execute(_toolCallId, _params, _signal, onUpdate, ctx) {
      onUpdate?.({
        content: [{ type: "text" as const, text: "🏷️ notes.duckdb — querying unique tags…" }],
        details: {},
      });

      try {
        const tags = await withDb(ctx.cwd, "read", async (db) => {
          const rows = await allWithRecovery(db, "SELECT DISTINCT tag FROM tags ORDER BY tag");
          return (rows as Record<string, unknown>[]).map(
            (r: Record<string, unknown>) => r.tag as string,
          );
        });

        if (tags.length === 0) {
          return {
            content: [
              {
                type: "text" as const,
                text: "🏷️ No tags found in the knowledge base yet. Create a document first to populate tags.",
              },
            ],
            details: { tags: [], count: 0 },
          };
        }

        return {
          content: [
            {
              type: "text" as const,
              text: `🏷️ Found ${tags.length} unique tag(s):\n\n${tags.map((t: string) => `- \`${t}\``).join("\n")}`,
            },
          ],
          details: { tags, count: tags.length },
        };
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        if (msg === "DB_NOT_FOUND") {
          return {
            content: [
              {
                type: "text" as const,
                text: "📭 No documents indexed yet. Create a document first to populate the knowledge base.",
              },
            ],
            details: { tags: [], count: 0 },
          };
        }
        throw e;
      }
    },
  });
}
