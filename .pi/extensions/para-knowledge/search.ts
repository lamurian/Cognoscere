/**
 * BM25 search engine for PARA documents.
 *
 * Pipeline:
 * 1. Tokenise the user's query into individual meaningful words
 * 2. Look up each term in the DuckDB inverted index (O(log n) per term)
 * 3. Compute Okapi BM25 score for each candidate document
 * 4. Add tag-match boost for documents whose tags overlap with query terms
 * 5. Sort by combined score descending, return top results
 *
 * When no text query is provided (empty / all stop words), falls back
 * to tag-only search.
 */

import type duckdb from "duckdb";
import { type SearchResult, BM25_DEFAULTS } from "./types.js";
import { allWithRecovery } from "./db.js";

// ── Stop words ──────────────────────────────────────────────────

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "shall", "can", "need", "dare", "ought",
  "used", "about", "above", "after", "again", "all", "also", "any",
  "because", "before", "between", "both", "each", "few", "from",
  "here", "how", "into", "just", "more", "most", "no", "not", "now",
  "only", "other", "over", "per", "same", "such", "than", "that",
  "their", "them", "there", "these", "they", "this", "those", "through",
  "under", "until", "very", "what", "when", "where", "which", "while",
  "who", "why", "up", "down", "out", "off", "about", "above",
]);

// ── Tokeniser ───────────────────────────────────────────────────

/**
 * Tokenise text into lowercase alphanumeric words,
 * removing stop words and single-character tokens.
 */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

// ── BM25 scoring ────────────────────────────────────────────────

/**
 * Compute the Okapi BM25 term contribution.
 *
 * @param tf         Term frequency in the document
 * @param df         Document frequency (number of docs containing this term)
 * @param N          Total number of documents in the corpus
 * @param docLength  Length of this document (in tokens)
 * @param avgDocLen  Average document length across the corpus
 * @param k1         BM25 k1 parameter (term frequency saturation)
 * @param b          BM25 b parameter (length normalisation)
 */
export function bm25TermScore(
  tf: number,
  df: number,
  N: number,
  docLength: number,
  avgDocLen: number,
  k1: number = BM25_DEFAULTS.K1,
  b: number = BM25_DEFAULTS.B,
): number {
  const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1);
  const numerator = tf * (k1 + 1);
  const denominator = tf + k1 * (1 - b + b * (docLength / avgDocLen));
  return idf * (numerator / denominator);
}

// ── Tag-only search ─────────────────────────────────────────────

/**
 * Search by tags only (no text query).
 * Returns all documents matching any of the provided tags (OR logic).
 */
export async function searchByTagsOnly(
  db: duckdb.Database,
  tags: string[],
): Promise<SearchResult[]> {
  if (tags.length === 0) return [];

  const placeholders = tags.map(() => "LOWER(t.tag) LIKE ?");
  const params: unknown[] = tags.map((t) => `%${t.toLowerCase()}%`);

  const rows = await allWithRecovery(
    db,
    `SELECT DISTINCT f.path, f.title, f.body, f.author, f.editor, f.file_mtime
     FROM files f
     JOIN tags t ON f.path = t.file_path
     WHERE (${placeholders.join(" OR ")})
     ORDER BY f.title`,
    ...params,
  );

  return (rows as any[]).map((r) => ({
    path: r.path,
    title: r.title ?? "",
    body: r.body ?? "",
    author: r.author ?? "",
    editor: r.editor ?? "",
    file_mtime: r.file_mtime ?? "",
    score: 1.0,
    matchedByTag: true,
    tagMatches: tags.filter((t) =>
      r.path.toLowerCase().includes(t.toLowerCase()),
    ),
  }));
}

// ── BM25 search ─────────────────────────────────────────────────

/**
 * Search documents using BM25 ranking.
 *
 * 1. Tokenise the query
 * 2. Fetch corpus stats (N, avg_doc_length)
 * 3. For each query term, look up term_index to get candidate docs with tf
 * 4. Compute per-document document frequency for IDF
 * 5. Score each candidate document using BM25
 * 6. Add tag-match boost
 * 7. Sort by score, return top results
 *
 * @param db        Open DuckDB connection
 * @param query     Raw user query string
 * @param filterTags Optional tag pre-filter (only docs with these tags are considered)
 */
export async function searchDocuments(
  db: duckdb.Database,
  query: string,
  filterTags?: string[],
): Promise<{ results: SearchResult[]; trace: string }> {
  const queryTerms = tokenize(query);

  // ── Edge case: no query terms → fall back to tag-only ├─
  if (queryTerms.length === 0) {
    if (filterTags && filterTags.length > 0) {
      const results = await searchByTagsOnly(db, filterTags);
      return { results, trace: "tag-only" };
    }
    // Return all documents, unscored
    const rows = await allWithRecovery(
      db,
      "SELECT path, title, body, author, editor, file_mtime FROM files ORDER BY title",
    );
    const results: SearchResult[] = (rows as any[]).map((r) => ({
      path: r.path,
      title: r.title ?? "",
      body: r.body ?? "",
      author: r.author ?? "",
      editor: r.editor ?? "",
      file_mtime: r.file_mtime ?? "",
      score: 0,
      matchedByTag: false,
      tagMatches: [],
    }));
    return { results, trace: "no-query-terms" };
  }

  // ── Fetch corpus stats ──
  const statsRows = await allWithRecovery(db, "SELECT key, value FROM corpus_stats");
  const stats = new Map<string, number>(
    (statsRows as any[]).map((r: any) => [r.key, r.value]),
  );
  const N = stats.get("total_docs") ?? 0;
  const avgDocLen = stats.get("avg_doc_length") ?? 1.0;

  if (N === 0) {
    return { results: [], trace: "empty-corpus" };
  }

  // ── Build tag filter subquery ──
  // If filterTags provided, restrict to documents having at least one matching tag.
  const tagFilterClause =
    filterTags && filterTags.length > 0
      ? `AND f.path IN (
           SELECT DISTINCT t2.file_path FROM tags t2
           WHERE ${filterTags.map(() => "LOWER(t2.tag) LIKE ?").join(" OR ")}
         )`
      : "";
  const tagFilterParams: unknown[] =
    filterTags?.map((t) => `%${t.toLowerCase()}%`) ?? [];

  // ── Look up each query term in the inverted index ──
  // For each term, get (file_path, tf) pairs.
  // We collect candidates across all terms.
  const candidateScores = new Map<string, number>();   // file_path → BM25 sum
  const candidateTfs = new Map<string, Map<string, number>>(); // file_path → (term → tf)
  const dfMap = new Map<string, number>();               // term → document frequency

  for (const term of queryTerms) {
    const termRows = await allWithRecovery(
      db,
      `SELECT ti.file_path, ti.tf, f.title, f.body
       FROM term_index ti
       JOIN files f ON ti.file_path = f.path
       WHERE ti.term = ? ${tagFilterClause}`,
      term,
      ...tagFilterParams,
    );

    // Document frequency = number of distinct docs containing this term
    dfMap.set(term, termRows.length);

    for (const row of termRows as any[]) {
      const fp = row.file_path as string;
      const tf = row.tf as number;

      if (!candidateTfs.has(fp)) {
        candidateTfs.set(fp, new Map());
      }
      candidateTfs.get(fp)!.set(term, tf);
    }
  }

  if (candidateTfs.size === 0) {
    // No term matches at all
    if (filterTags && filterTags.length > 0) {
      // Fallback: tag-only with filter
      const results = await searchByTagsOnly(db, filterTags);
      return { results, trace: "bm25-no-text-match" };
    }
    return { results: [], trace: "bm25-no-match" };
  }

  // ── Fetch doc_lengths for all candidates ──
  const candidatePaths = [...candidateTfs.keys()];
  if (candidatePaths.length === 0) {
    return { results: [], trace: "bm25-no-candidates" };
  }

  const lenPlaceholders = candidatePaths.map(() => "?").join(",");
  const lenRows = await allWithRecovery(
    db,
    `SELECT file_path, doc_length FROM doc_lengths WHERE file_path IN (${lenPlaceholders})`,
    ...candidatePaths,
  );
  const docLengths = new Map<string, number>(
    (lenRows as any[]).map((r: any) => [r.file_path, r.doc_length ?? 0]),
  );

  // ── Fetch tags for all candidates (for tag-boost) ──
  const tagRows = await allWithRecovery(
    db,
    `SELECT file_path, tag FROM tags WHERE file_path IN (${lenPlaceholders})`,
    ...candidatePaths,
  );
  const docTags = new Map<string, string[]>();
  for (const row of tagRows as any[]) {
    const fp = row.file_path as string;
    if (!docTags.has(fp)) docTags.set(fp, []);
    docTags.get(fp)!.push(row.tag as string);
  }

  // ── Compute BM25 scores ──
  for (const [fp, termMap] of candidateTfs) {
    const docLen = docLengths.get(fp) ?? 100;
    let score = 0;
    const matchedQueryTerms: string[] = [];

    for (const term of queryTerms) {
      const tf = termMap.get(term) ?? 0;
      if (tf === 0) continue;
      matchedQueryTerms.push(term);
      const df = dfMap.get(term) ?? 1;
      score += bm25TermScore(tf, df, N, docLen, avgDocLen);
    }

    // ── Tag-match boost ──
    const tags = docTags.get(fp) ?? [];
    let tagMatches: string[] = [];
    for (const tag of tags) {
      const tagLower = tag.toLowerCase();
      if (queryTerms.some((qt) => tagLower.includes(qt) || qt.includes(tagLower))) {
        tagMatches.push(tag);
      }
    }
    // Also boost if any filter tag matches directly
    if (filterTags) {
      for (const ft of filterTags) {
        if (tags.some((t) => t.toLowerCase() === ft.toLowerCase())) {
          if (!tagMatches.includes(ft)) tagMatches.push(ft);
        }
      }
    }

    const tagBoost = tagMatches.length * BM25_DEFAULTS.TAG_BOOST;
    score += tagBoost;

    candidateScores.set(fp, score);
  }

  // ── Sort by score descending, take top N ──
  const sortedPaths = [...candidateScores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, BM25_DEFAULTS.MAX_RESULTS)
    .map(([fp]) => fp);

  if (sortedPaths.length === 0) {
    return { results: [], trace: "bm25-zero-scored" };
  }

  // ── Fetch full document rows for top results ──
  const resultPlaceholders = sortedPaths.map(() => "?").join(",");
  const resultRows = await allWithRecovery(
    db,
    `SELECT path, title, body, author, editor, file_mtime
     FROM files
     WHERE path IN (${resultPlaceholders})`,
    ...sortedPaths,
  );

  // Re-sort to match sortedPaths order (SQL IN doesn't preserve order)
  const rowMap = new Map((resultRows as any[]).map((r: any) => [r.path, r]));
  const results: SearchResult[] = sortedPaths.map((fp) => {
    const r = rowMap.get(fp) as any;
    const tags = docTags.get(fp) ?? [];
    const matchedQt = queryTerms.filter((qt) => {
      const tf = candidateTfs.get(fp)?.get(qt) ?? 0;
      return tf > 0;
    });
    const tagMatches = tags.filter((tag) => {
      const tagLower = tag.toLowerCase();
      return queryTerms.some((qt) => tagLower.includes(qt) || qt.includes(tagLower));
    });

    return {
      path: r?.path ?? fp,
      title: r?.title ?? "",
      body: r?.body ?? "",
      author: r?.author ?? "",
      editor: r?.editor ?? "",
      file_mtime: r?.file_mtime ?? "",
      score: candidateScores.get(fp) ?? 0,
      matchedByTag: matchedQt.length === 0 && tagMatches.length > 0,
      tagMatches,
    };
  });

  const trace = `bm25 (terms:${queryTerms.length} candidates:${candidateTfs.size} N:${N})`;
  return { results, trace };
}
