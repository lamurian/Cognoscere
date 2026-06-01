/**
 * find_existing_summary tool — checks whether a URL already has a summary
 * in the knowledge base, by exact `source_url` match and by content similarity.
 *
 * Workflow:
 * 1. Query DuckDB for any document whose `source_url` column matches the given URL
 * 2. If found → return the existing document (title, path)
 * 3. If not found by URL → compute Jaccard similarity (word trigrams) against
 *    existing documents (using BM25 as a fast pre-filter)
 * 4. If any existing document has >90% similarity → return it
 * 5. Otherwise → report "no match found"
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { withDb, allWithRecovery, initDb } from "../db.js";
import { tokenize } from "../search.js";
import { BM25_DEFAULTS } from "../types.js";

// ── Similarity helpers ──────────────────────────────────────────

/**
 * Build a set of word trigrams from text.
 * "the quick brown fox" → {"the quick brown", "quick brown fox"}
 */
function wordTrigrams(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 0);

  const trigrams = new Set<string>();
  for (let i = 0; i <= words.length - 3; i++) {
    trigrams.add(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
  }
  return trigrams;
}

/**
 * Compute Jaccard similarity between two sets.
 * |A ∩ B| / |A ∪ B|
 */
function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  const intersection = new Set<string>();
  for (const item of a) {
    if (b.has(item)) intersection.add(item);
  }

  const union = new Set<string>([...a, ...b]);
  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

/**
 * Compute Jaccard similarity between two text strings using word trigrams.
 */
function textSimilarity(textA: string, textB: string): number {
  const trigramsA = wordTrigrams(textA);
  const trigramsB = wordTrigrams(textB);
  return jaccardSimilarity(trigramsA, trigramsB);
}

// ── Tool registration ──────────────────────────────────────────

export function registerFindExistingSummaryTool(pi: ExtensionAPI): void {
  pi.registerTool({
    name: "find_existing_summary",
    label: "Find Existing Summary",
    description:
      "Check whether a URL already has a summary saved in the knowledge base. " +
      "First checks for an exact `source_url` match in the DuckDB index, then " +
      "falls back to content-based similarity (>90% Jaccard similarity on " +
      "word trigrams). If found, returns the existing document path and title " +
      "so the agent can inform the user instead of re-summarising.",
    promptSnippet: "Check if a URL already has a saved summary before re-summarising",
    promptGuidelines: [
      "Use find_existing_summary when the user shares a link to check if it's already summarised.",
      "If found, inform the user of the existing note path and title instead of re-summarising.",
      "If not found, proceed with fetch_url to get the content, then summarise and save.",
    ],
    parameters: Type.Object({
      url: Type.String({ description: "The URL to check for existing summaries" }),
      content: Type.Optional(
        Type.String({
          description:
            "Optional extracted text content. When provided, also performs " +
            "content-based similarity matching against existing documents.",
        }),
      ),
    }),

    async execute(_toolCallId, params, _signal, onUpdate, ctx) {
      const { url, content } = params;

      onUpdate?.({
        content: [
          {
            type: "text" as const,
            text: `🔍 Checking for existing summary of ${url}…`,
          },
        ],
      });

      try {
        const result = await withDb(ctx.cwd, "read", async (db) => {
          // ── Phase 1: Exact source_url match ──
          let exactMatch: { path: string; title: string } | null = null;
          try {
            const urlRows = await allWithRecovery(
              db,
              "SELECT path, title, body, source_url FROM files WHERE source_url = ?",
              url,
            );
            if (urlRows.length > 0) {
              const row = urlRows[0] as Record<string, unknown>;
              exactMatch = {
                path: row.path as string,
                title: row.title as string,
              };
            }
          } catch {
            // source_url column may not exist yet (DB created before schema upgrade)
            // Fall through to content-based matching
          }

          if (exactMatch) {
            return {
              found: true,
              matchType: "exact_url",
              path: exactMatch.path,
              title: exactMatch.title,
              similarity: 1.0,
            };
          }

          // ── Phase 2: Content-based similarity (only if content provided) ──
          if (!content || content.trim().length < 50) {
            return { found: false, matchType: "none" };
          }

          // Use BM25 term index to find candidate documents
          const queryTerms = tokenize(content);
          if (queryTerms.length === 0) {
            return { found: false, matchType: "none" };
          }

          // Get corpus size
          const statsRows = await allWithRecovery(db, "SELECT key, value FROM corpus_stats");
          const stats = new Map<string, number>(
            (statsRows as any[]).map((r: any) => [r.key, r.value]),
          );
          const N = stats.get("total_docs") ?? 0;
          if (N === 0) return { found: false, matchType: "none" };

          // Batch-lookup terms
          const termPlaceholders = queryTerms.map(() => "?").join(",");
          const termRows = await allWithRecovery(
            db,
            `SELECT ti.term, ti.file_path, ti.tf, dl.doc_length
             FROM term_index ti
             LEFT JOIN doc_lengths dl ON ti.file_path = dl.file_path
             WHERE ti.term IN (${termPlaceholders})`,
            ...queryTerms,
          );

          // Score candidates with BM25
          const candidateTfs = new Map<string, Map<string, number>>();
          const docLengths = new Map<string, number>();
          const dfMap = new Map<string, number>();

          for (const row of termRows as any[]) {
            const term = row.term as string;
            const fp = row.file_path as string;
            const tf = row.tf as number;
            const docLen = (row.doc_length as number) ?? 100;

            dfMap.set(term, (dfMap.get(term) ?? 0) + 1);
            if (!candidateTfs.has(fp)) candidateTfs.set(fp, new Map());
            candidateTfs.get(fp)!.set(term, tf);
            if (!docLengths.has(fp)) docLengths.set(fp, docLen);
          }

          if (candidateTfs.size === 0) {
            return { found: false, matchType: "none" };
          }

          // Score & rank candidates
          const avgDocLen =
            [...docLengths.values()].reduce((s, l) => s + l, 0) /
            Math.max(docLengths.size, 1);

          const scores = new Map<string, number>();
          const { K1, B } = BM25_DEFAULTS;

          for (const [fp, termMap] of candidateTfs) {
            const docLen = docLengths.get(fp) ?? 100;
            let score = 0;
            for (const term of queryTerms) {
              const tf = termMap.get(term) ?? 0;
              if (tf === 0) continue;
              const df = dfMap.get(term) ?? 1;
              const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1);
              const numerator = tf * (K1 + 1);
              const denominator = tf + K1 * (1 - B + B * (docLen / avgDocLen));
              score += idf * (numerator / denominator);
            }
            scores.set(fp, score);
          }

          // Take top 10 candidates
          const topCandidates = [...scores.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([fp]) => fp);

          if (topCandidates.length === 0) {
            return { found: false, matchType: "none" };
          }

          // Fetch full body text for top candidates
          const placeholders = topCandidates.map(() => "?").join(",");
          const docRows = await allWithRecovery(
            db,
            `SELECT path, title, body FROM files WHERE path IN (${placeholders})`,
            ...topCandidates,
          );

          // Compute exact Jaccard similarity
          const contentTrigrams = wordTrigrams(content);
          let bestMatch: {
            path: string;
            title: string;
            similarity: number;
          } | null = null;

          for (const row of docRows as any[]) {
            const body = (row.body as string) ?? "";
            if (body.length < 50) continue;
            const sim = textSimilarity(content, body);
            if (sim > (bestMatch?.similarity ?? 0)) {
              bestMatch = {
                path: row.path as string,
                title: row.title as string,
                similarity: sim,
              };
            }
          }

          if (bestMatch && bestMatch.similarity > 0.9) {
            return {
              found: true,
              matchType: "content_similarity",
              path: bestMatch.path,
              title: bestMatch.title,
              similarity: bestMatch.similarity,
            };
          }

          return { found: false, matchType: "none", topSimilarity: bestMatch?.similarity ?? 0 };
        });

        if (result.found) {
          const matchDetail =
            (result as any).matchType === "exact_url"
              ? "Exact source_url match"
              : `Content similarity ${((result as any).similarity * 100).toFixed(1)}%`;

          return {
            content: [
              {
                type: "text" as const,
                text:
                  `✅ Found existing summary — ${matchDetail}\n\n` +
                  `**Title:** ${(result as any).title}\n` +
                  `**Path:** ${(result as any).path}\n` +
                  `**URL:** ${url}\n\n` +
                  `No need to re-summarise. The existing note above already covers this link. ` +
                  `You can read it with \`read(path: "${(result as any).path}")\` if needed.`,
              },
            ],
            details: {
              found: true,
              matchType: (result as any).matchType,
              path: (result as any).path,
              title: (result as any).title,
              similarity: (result as any).similarity,
            },
          };
        }

        return {
          content: [
            {
              type: "text" as const,
              text: `📭 No existing summary found for ${url}. You can proceed with fetch_url to retrieve the content and then create a new summary.`,
            },
          ],
          details: {
            found: false,
            notFoundReason: content && content.trim().length >= 50 ? "no-match" : "no-content",
          },
        };
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        if (msg === "DB_NOT_FOUND") {
          return {
            content: [
              {
                type: "text" as const,
                text: "📭 No knowledge base found yet. No existing summaries to check.",
              },
            ],
            details: { found: false, notFoundReason: "no-db" },
          };
        }
        throw e;
      }
    },
  });
}
