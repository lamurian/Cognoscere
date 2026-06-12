/**
 * find_existing_summary tool — checks whether a URL already has a summary
 * in the knowledge base, by exact `source_url` match and by content similarity.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import type duckdb from "duckdb";
import { withDb, queryRows } from "../db.js";
import { tokenize } from "../bm25.js";
import { BM25_DEFAULTS } from "../types.js";
import { textSimilarity } from "../similarity.js";
import { readDocumentBody } from "../config.js";

interface FileRow {
  path: string;
  title: string;
  source_url: string | null;
}
interface StatRow {
  key: string;
  value: number;
}
interface TermRow {
  term: string;
  file_path: string;
  tf: number;
  doc_length: number;
}

type MatchResult =
  | {
      found: true;
      matchType: "exact_url" | "content_similarity";
      path: string;
      title: string;
      similarity: number;
    }
  | { found: false; matchType: "none"; topSimilarity?: number };

async function findExactUrlMatch(
  db: duckdb.Database,
  url: string,
): Promise<{ path: string; title: string } | null> {
  try {
    const rows = await queryRows<FileRow>(
      db,
      "SELECT path, title, source_url FROM files WHERE source_url = ?",
      url,
    );
    return rows.length > 0 ? { path: rows[0].path, title: rows[0].title } : null;
  } catch {
    return null;
  }
}

/* eslint-disable-next-line complexity */
async function rankByContent(db: duckdb.Database, content: string): Promise<string[]> {
  const queryTerms = tokenize(content);
  if (queryTerms.length === 0) return [];

  const stats = new Map(
    (await queryRows<StatRow>(db, "SELECT key, value FROM corpus_stats")).map((r) => [
      r.key,
      r.value,
    ]),
  );
  const N = stats.get("total_docs") ?? 0;
  if (N === 0) return [];

  const placeholders = queryTerms.map(() => "?").join(",");
  const termRows = await queryRows<TermRow>(
    db,
    `SELECT t.term, ti.file_path, ti.tf, dl.doc_length
     FROM term_index ti
     JOIN term_dict t ON ti.term_id = t.term_id
     LEFT JOIN doc_lengths dl ON ti.file_path = dl.file_path
     WHERE t.term IN (${placeholders})`,
    ...queryTerms,
  );

  const dfMap = new Map<string, number>();
  const tfs = new Map<string, Map<string, number>>();
  const docLens = new Map<string, number>();

  for (const row of termRows) {
    dfMap.set(row.term, (dfMap.get(row.term) ?? 0) + 1);
    if (!tfs.has(row.file_path)) tfs.set(row.file_path, new Map());
    tfs.get(row.file_path)!.set(row.term, row.tf);
    if (!docLens.has(row.file_path)) docLens.set(row.file_path, row.doc_length ?? 100);
  }

  if (tfs.size === 0) return [];

  const avgLen = [...docLens.values()].reduce((s, l) => s + l, 0) / docLens.size;
  const scored: Array<[string, number]> = [];

  for (const [fp, termMap] of tfs) {
    const docLen = docLens.get(fp) ?? 100;
    let score = 0;
    for (const term of queryTerms) {
      const tf = termMap.get(term) ?? 0;
      if (tf === 0) continue;
      const df = dfMap.get(term) ?? 1;
      const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1);
      score +=
        idf *
        ((tf * (BM25_DEFAULTS.K1 + 1)) /
          (tf + BM25_DEFAULTS.K1 * (1 - BM25_DEFAULTS.B + BM25_DEFAULTS.B * (docLen / avgLen))));
    }
    scored.push([fp, score]);
  }

  return scored
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([fp]) => fp);
}

async function matchByContent(db: duckdb.Database, content: string, cwd: string): Promise<MatchResult> {
  const topCandidates = await rankByContent(db, content);
  if (topCandidates.length === 0) return { found: false, matchType: "none" };

  const docPlaceholders = topCandidates.map(() => "?").join(",");
  const docRows = await queryRows<FileRow>(
    db,
    `SELECT path, title, source_url FROM files WHERE path IN (${docPlaceholders})`,
    ...topCandidates,
  );

  let bestSim = 0,
    bestPath = "",
    bestTitle = "";
  for (const row of docRows) {
    let docBody = "";
    try { docBody = await readDocumentBody(cwd, row.path); } catch { continue; }
    if (docBody.length < 50) continue;
    const sim = textSimilarity(content, docBody);
    if (sim > bestSim) {
      bestSim = sim;
      bestPath = row.path;
      bestTitle = row.title;
    }
  }

  if (bestSim > 0.9)
    return {
      found: true,
      matchType: "content_similarity",
      path: bestPath,
      title: bestTitle,
      similarity: bestSim,
    };
  return { found: false, matchType: "none", topSimilarity: bestSim };
}

export function registerFindExistingSummaryTool(pi: ExtensionAPI): void {
  pi.registerTool({
    name: "find_existing_summary",
    label: "Find Existing Summary",
    description: "Check whether a URL already has a summary saved in the knowledge base.",
    promptSnippet: "Check if a URL already has a saved summary before re-summarising",
    parameters: Type.Object({
      url: Type.String({ description: "The URL to check for existing summaries" }),
      content: Type.Optional(
        Type.String({
          description: "Optional extracted text content for content-based similarity matching.",
        }),
      ),
    }),

    async execute(_toolCallId, params, _signal, onUpdate, ctx) {
      const { url, content } = params;
      onUpdate?.({
        content: [{ type: "text" as const, text: `Checking for existing summary of ${url}...` }],
        details: {},
      });

      try {
        const cwd = ctx.cwd;
        const result: MatchResult = await withDb(ctx.cwd, "read", async (db) => {
          const exact = await findExactUrlMatch(db, url);
          if (exact)
            return {
              found: true,
              matchType: "exact_url",
              path: exact.path,
              title: exact.title,
              similarity: 1.0,
            } as const;
          if (!content || content.trim().length < 50)
            return { found: false, matchType: "none" } as const;
          return await matchByContent(db, content, cwd);
        });

        if (result.found) {
          const pct = (result.similarity * 100).toFixed(1);
          const detail =
            result.matchType === "exact_url"
              ? "Exact source_url match"
              : `Content similarity ${pct}%`;
          return {
            content: [
              {
                type: "text" as const,
                text: `Found existing summary — ${detail}\n\n**Title:** ${result.title}\n**Path:** ${result.path}\n**URL:** ${url}\n\nNo need to re-summarise.`,
              },
            ],
            details: {
              found: true,
              matchType: result.matchType,
              path: result.path,
              title: result.title,
              similarity: result.similarity,
            },
          };
        }

        return {
          content: [
            {
              type: "text" as const,
              text: `No existing summary found for ${url}. Proceed with fetch_url.`,
            },
          ],
          details: {
            found: false,
            notFoundReason: (content?.trim().length ?? 0) >= 50 ? "no-match" : "no-content",
          },
        };
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        if (msg === "DB_NOT_FOUND")
          return {
            content: [{ type: "text" as const, text: "No knowledge base found yet." }],
            details: { found: false, notFoundReason: "no-db" },
          };
        throw e;
      }
    },
  });
}
