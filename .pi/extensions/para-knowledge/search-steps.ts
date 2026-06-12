/**
 * Search step helpers for BM25 pipeline.
 * Extracted from search.ts to keep each file under 300 lines.
 */
import type duckdb from "duckdb";
import { type SearchResult, BM25_DEFAULTS } from "./types.js";
import { allWithRecovery } from "./db.js";
import { bm25TermScore } from "./bm25.js";
import { readDocumentBody } from "./config.js";

type Row = Record<string, unknown>;
async function queryRows<T = Row>(db: duckdb.Database, sql: string, ...params: unknown[]): Promise<T[]> {
  const rows = await allWithRecovery(db, sql, ...params);
  return rows as unknown as T[];
}

interface FileRow { path: string; title: string; body: string; author: string; editor: string; file_mtime: string; source_url: string | null }
interface StatRow { key: string; value: number }
interface TermRow { term: string; file_path: string; tf: number; doc_length: number }
interface TagRow { file_path: string; tag: string }

export async function handleEmptyQuery(
  db: duckdb.Database, filterTags?: string[], cwd?: string,
): Promise<{ results: SearchResult[]; trace: string }> {
  if (filterTags?.length) {
    const results = await searchByTagsOnly(db, filterTags, cwd);
    return { results, trace: "tag-only" };
  }
  const rows = await queryRows<FileRow>(db, "SELECT path, title, author, editor, file_mtime, source_url FROM files ORDER BY title");
  return {
    results: await Promise.all(rows.map(async (r) => {
      let body = "";
      if (cwd) { try { body = await readDocumentBody(cwd, r.path); } catch { /* best-effort */ } }
      return { path: r.path, title: r.title ?? "", body, author: r.author ?? "", editor: r.editor ?? "", file_mtime: r.file_mtime ?? "", source_url: r.source_url ?? null, description: null, score: 0, matchedByTag: false, tagMatches: [] };
    })),
    trace: "no-query-terms",
  };
}

export async function fetchCorpusStats(db: duckdb.Database): Promise<{ N: number; avgDocLen: number }> {
  const rows = await queryRows<StatRow>(db, "SELECT key, value FROM corpus_stats");
  const stats = new Map(rows.map((r) => [r.key, r.value]));
  return { N: stats.get("total_docs") ?? 0, avgDocLen: stats.get("avg_doc_length") ?? 1.0 };
}

export function buildTagFilterParams(filterTags?: string[]): { clause: string; params: unknown[] } {
  if (!filterTags?.length) return { clause: "", params: [] };
  const expressions = filterTags.map(() => "LOWER(t2.tag) LIKE ?");
  return {
    clause: `AND ti.file_path IN (SELECT DISTINCT t2.file_path FROM tags t2 WHERE ${expressions.join(" OR ")})`,
    params: filterTags.map((t) => `%${t.toLowerCase()}%`),
  };
}

export interface BatchedLookup { candidateTfs: Map<string, Map<string, number>>; docLengths: Map<string, number>; dfMap: Map<string, number> }

export async function batchLookupTerms(
  db: duckdb.Database, queryTerms: string[], clause: string, tagParams: unknown[],
): Promise<BatchedLookup> {
  const placeholders = queryTerms.map(() => "?").join(",");
  const rows = await queryRows<TermRow>(
    db, `SELECT t.term, ti.file_path, ti.tf, dl.doc_length
         FROM term_index ti JOIN term_dict t ON ti.term_id = t.term_id
         LEFT JOIN doc_lengths dl ON ti.file_path = dl.file_path
         WHERE t.term IN (${placeholders}) ${clause}`,
    ...queryTerms, ...tagParams,
  );
  const candidateTfs = new Map<string, Map<string, number>>();
  const docLengths = new Map<string, number>();
  const dfMap = new Map<string, number>();
  for (const row of rows) {
    dfMap.set(row.term, (dfMap.get(row.term) ?? 0) + 1);
    if (!candidateTfs.has(row.file_path)) candidateTfs.set(row.file_path, new Map());
    candidateTfs.get(row.file_path)!.set(row.term, row.tf);
    if (!docLengths.has(row.file_path)) docLengths.set(row.file_path, row.doc_length ?? 100);
  }
  return { candidateTfs, docLengths, dfMap };
}

export async function fetchCandidateTags(db: duckdb.Database, paths: string[]): Promise<Map<string, string[]>> {
  if (paths.length === 0) return new Map();
  const placeholders = paths.map(() => "?").join(",");
  const rows = await queryRows<TagRow>(db, `SELECT file_path, tag FROM tags WHERE file_path IN (${placeholders})`, ...paths);
  const docTags = new Map<string, string[]>();
  for (const row of rows) {
    if (!docTags.has(row.file_path)) docTags.set(row.file_path, []);
    docTags.get(row.file_path)!.push(row.tag);
  }
  return docTags;
}

function computeTagBoost(tags: string[], queryTerms: string[], filterTags: string[] | undefined): number {
  let boost = 0;
  for (const tag of tags) {
    if (queryTerms.some((qt) => tag.toLowerCase().includes(qt) || qt.includes(tag.toLowerCase()))) boost++;
  }
  if (filterTags) for (const ft of filterTags) {
    if (tags.some((t) => t.toLowerCase() === ft.toLowerCase())) boost++;
  }
  return boost;
}

export function computeBm25Scores(
  queryTerms: string[], candidateTfs: Map<string, Map<string, number>>,
  docLengths: Map<string, number>, dfMap: Map<string, number>,
  docTags: Map<string, string[]>, filterTags: string[] | undefined, N: number, avgDocLen: number,
): Map<string, number> {
  const scores = new Map<string, number>();
  for (const [fp, termMap] of candidateTfs) {
    scores.set(fp, computeDocScore(fp, termMap, queryTerms, dfMap, docLengths, N, avgDocLen)
      + computeTagBoost(docTags.get(fp) ?? [], queryTerms, filterTags) * BM25_DEFAULTS.TAG_BOOST);
  }
  return scores;
}

function computeDocScore(fp: string, termMap: Map<string, number>, queryTerms: string[], dfMap: Map<string, number>, docLengths: Map<string, number>, N: number, avgDocLen: number): number {
  const docLen = docLengths.get(fp) ?? 100;
  let score = 0;
  for (const term of queryTerms) {
    const tf = termMap.get(term) ?? 0;
    if (tf === 0) continue;
    score += bm25TermScore(tf, dfMap.get(term) ?? 1, N, docLen, avgDocLen);
  }
  return score;
}

export function sortTopResults(scores: Map<string, number>, maxResults: number): string[] {
  return [...scores.entries()].sort((a, b) => b[1] - a[1]).slice(0, maxResults).map(([fp]) => fp);
}

export async function fetchResultDocuments(db: duckdb.Database, paths: string[], cwd?: string): Promise<Map<string, FileRow>> {
  if (paths.length === 0) return new Map();
  const placeholders = paths.map(() => "?").join(",");
  const rows = await queryRows<FileRow>(db, `SELECT path, title, author, editor, file_mtime, source_url FROM files WHERE path IN (${placeholders})`, ...paths);
  const result = new Map<string, FileRow>();
  for (const r of rows) {
    let body = "";
    if (cwd) { try { body = await readDocumentBody(cwd, r.path); } catch { /* file may be deleted */ } }
    result.set(r.path, { ...r, body });
  }
  return result;
}

function matchTags(fp: string, queryTerms: string[], candidateTfs: Map<string, Map<string, number>>, docTags: Map<string, string[]>): string[] {
  const tags = docTags.get(fp) ?? [];
  return tags.filter((tag) => {
    const lower = tag.toLowerCase();
    return queryTerms.some((qt) => lower.includes(qt) || qt.includes(lower));
  });
}

function buildSingleResult(fp: string, rowMap: Map<string, FileRow>, candidateScores: Map<string, number>, tagMatches: string[]): SearchResult {
  const r = rowMap.get(fp);
  return {
    path: r?.path ?? fp, title: r?.title ?? "", body: r?.body ?? "",
    author: r?.author ?? "", editor: r?.editor ?? "", file_mtime: r?.file_mtime ?? "",
    source_url: r?.source_url ?? null, description: null,
    score: candidateScores.get(fp) ?? 0, matchedByTag: tagMatches.length > 0, tagMatches,
  };
}

export function buildSearchResults(
  sortedPaths: string[], rowMap: Map<string, FileRow>,
  candidateTfs: Map<string, Map<string, number>>, docTags: Map<string, string[]>,
  candidateScores: Map<string, number>, queryTerms: string[],
): SearchResult[] {
  return sortedPaths.map((fp) => {
    const tagMatches = matchTags(fp, queryTerms, candidateTfs, docTags);
    return buildSingleResult(fp, rowMap, candidateScores, tagMatches);
  });
}

export async function searchByTagsOnly(db: duckdb.Database, tags: string[], cwd?: string): Promise<SearchResult[]> {
  if (tags.length === 0) return [];
  const likeClauses = tags.map(() => "LOWER(t.tag) LIKE ?");
  const params = tags.map((t) => `%${t.toLowerCase()}%`);
  const rows = await queryRows<FileRow & { path: string }>(
    db, `SELECT DISTINCT f.path, f.title, f.author, f.editor, f.file_mtime, f.source_url
         FROM files f JOIN tags t ON f.path = t.file_path WHERE (${likeClauses.join(" OR ")}) ORDER BY f.title`,
    ...params,
  );
  return await Promise.all(rows.map(async (r) => {
    let body = "";
    if (cwd) { try { body = await readDocumentBody(cwd, r.path); } catch { /* file may be deleted */ } }
    return { path: r.path, title: r.title ?? "", body, author: r.author ?? "", editor: r.editor ?? "",
      file_mtime: r.file_mtime ?? "", source_url: r.source_url ?? null, description: null, score: 1.0,
      matchedByTag: true, tagMatches: tags.filter((t) => r.path.toLowerCase().includes(t.toLowerCase())) };
  }));
}
