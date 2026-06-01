/**
 * BM25 search engine for PARA documents.
 *
 * Pipeline:
 * 1. Tokenise the user's query into individual meaningful words
 * 2. Batch-lookup all query terms in the DuckDB inverted index in **one query**
 *    (ART index on term_index.term is O(k) per term, k ≈ term length)
 * 3. Compute Okapi BM25 score for each candidate document
 * 4. Add tag-match boost for documents whose tags overlap with query terms
 * 5. Sort by combined score descending, return top results
 *
 * Optimisations for near O(1) round-trips:
 *  - All term lookups are batched into a single SQL IN-list query (1 round-trip)
 *  - doc_lengths are fetched via LEFT JOIN in the same query (no 2nd round-trip)
 *  - The files table (title/body) is joined only for the top-25 results, not
 *    for every candidate (avoids pulling large text columns through the pipeline)
 *  - Tags are fetched in one batched query (1 round-trip)
 *  - Total: 3 round-trips regardless of query length
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
    `SELECT DISTINCT f.path, f.title, f.body, f.author, f.editor, f.file_mtime, f.source_url
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
    source_url: r.source_url ?? null,
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
 * Pipeline (3 round-trips total, regardless of query length):
 * 1. Tokenise the query
 * 2. Fetch corpus stats (N, avg_doc_length)
 * 3. **Batch-lookup** all query terms in **one SQL query** with an IN-list,
 *    joining doc_lengths via LEFT JOIN — avoids O(terms) round-trips
 * 4. Build per-term df, per-document tf map, and doc_lengths from the single result
 * 5. Fetch tags for all candidates (1 batched query)
 * 6. Score each candidate document using BM25 + tag-match boost
 * 7. Sort by score, return top results (fetch files only for top 25)
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
      "SELECT path, title, body, author, editor, file_mtime, source_url FROM files ORDER BY title",
    );
    const results: SearchResult[] = (rows as any[]).map((r) => ({
      path: r.path,
      title: r.title ?? "",
      body: r.body ?? "",
      author: r.author ?? "",
      editor: r.editor ?? "",
      file_mtime: r.file_mtime ?? "",
      source_url: r.source_url ?? null,
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

  // ── Build tag filter clauses ──
  // If filterTags provided, restrict to documents having at least one matching tag.
  const tagFilterSubquery =
    filterTags && filterTags.length > 0
      ? `AND ti.file_path IN (
           SELECT DISTINCT t2.file_path FROM tags t2
           WHERE ${filterTags.map(() => "LOWER(t2.tag) LIKE ?").join(" OR ")}
         )`
      : "";
  const tagFilterParams: unknown[] =
    filterTags?.map((t) => `%${t.toLowerCase()}%`) ?? [];

  // ── Batch all term lookups in a single query (O(1) round-trip) ──
  // Returns (term, file_path, tf, doc_length) for every matching term.
  // No JOIN with files yet — title/body are fetched only for top-25 results.
  const termPlaceholders = queryTerms.map(() => "?").join(",");
  const termRows = await allWithRecovery(
    db,
    `SELECT ti.term, ti.file_path, ti.tf, dl.doc_length
     FROM term_index ti
     LEFT JOIN doc_lengths dl ON ti.file_path = dl.file_path
     WHERE ti.term IN (${termPlaceholders}) ${tagFilterSubquery}`,
    ...queryTerms,
    ...tagFilterParams,
  );

  // ── Build in-memory maps from the batched result ──
  const candidateTfs = new Map<string, Map<string, number>>();  // file_path → (term → tf)
  const docLengths = new Map<string, number>();                  // file_path → doc_length
  const dfMap = new Map<string, number>();                       // term → document frequency

  for (const row of termRows as any[]) {
    const term = row.term as string;
    const fp = row.file_path as string;
    const tf = row.tf as number;
    const docLen = (row.doc_length as number) ?? 100;

    // Track df (per term)
    dfMap.set(term, (dfMap.get(term) ?? 0) + 1);

    // Track tf (per file_path × term)
    if (!candidateTfs.has(fp)) {
      candidateTfs.set(fp, new Map());
    }
    candidateTfs.get(fp)!.set(term, tf);

    // Track doc_length (first occurrence wins — all should be same)
    if (!docLengths.has(fp)) {
      docLengths.set(fp, docLen);
    }
  }

  if (candidateTfs.size === 0) {
    if (filterTags && filterTags.length > 0) {
      const results = await searchByTagsOnly(db, filterTags);
      return { results, trace: "bm25-no-text-match" };
    }
    return { results: [], trace: "bm25-no-match" };
  }

  // ── Fetch tags for all candidates (1 batched query) ──
  const candidatePaths = [...candidateTfs.keys()];
  const lenPlaceholders = candidatePaths.map(() => "?").join(",");

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

  // ── Compute BM25 scores + tag boost ──
  const candidateScores = new Map<string, number>();

  for (const [fp, termMap] of candidateTfs) {
    const docLen = docLengths.get(fp) ?? 100;
    let score = 0;

    for (const term of queryTerms) {
      const tf = termMap.get(term) ?? 0;
      if (tf === 0) continue;
      const df = dfMap.get(term) ?? 1;
      score += bm25TermScore(tf, df, N, docLen, avgDocLen);
    }

    // Tag-match boost
    const tags = docTags.get(fp) ?? [];
    const tagMatches: string[] = [];
    for (const tag of tags) {
      const tagLower = tag.toLowerCase();
      if (queryTerms.some((qt) => tagLower.includes(qt) || qt.includes(tagLower))) {
        tagMatches.push(tag);
      }
    }
    if (filterTags) {
      for (const ft of filterTags) {
        if (tags.some((t) => t.toLowerCase() === ft.toLowerCase()) && !tagMatches.includes(ft)) {
          tagMatches.push(ft);
        }
      }
    }
    score += tagMatches.length * BM25_DEFAULTS.TAG_BOOST;

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

  // ── Fetch full document rows only for top-25 results ──
  const resultPlaceholders = sortedPaths.map(() => "?").join(",");
  const resultRows = await allWithRecovery(
    db,
    `SELECT path, title, body, author, editor, file_mtime, source_url
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
      source_url: r?.source_url ?? null,
      score: candidateScores.get(fp) ?? 0,
      matchedByTag: matchedQt.length === 0 && tagMatches.length > 0,
      tagMatches,
    };
  });

  const trace = `bm25-batched (terms:${queryTerms.length} candidates:${candidateTfs.size} N:${N})`;
  return { results, trace };
}
