/**
 * BM25 search engine for PARA documents.
 *
 * Orchestrates the search pipeline using step helpers from search-steps.ts.
 * Pipeline (3 round-trips total):
 * 1. Tokenise query
 * 2. Fetch corpus stats (N, avg_doc_length)
 * 3. Batch-lookup all query terms in one SQL query
 * 4. Score each candidate document using BM25 + tag-match boost
 * 5. Sort by score, return top results
 */

import type duckdb from "duckdb";
import { type SearchResult, BM25_DEFAULTS } from "./types.js";
import { tokenize } from "./bm25.js";
import {
  handleEmptyQuery,
  fetchCorpusStats,
  buildTagFilterParams,
  batchLookupTerms,
  fetchCandidateTags,
  computeBm25Scores,
  sortTopResults,
  fetchResultDocuments,
  buildSearchResults,
  searchByTagsOnly,
} from "./search-steps.js";

/**
 * Search documents using BM25 ranking.
 */
export async function searchDocuments(
  db: duckdb.Database,
  query: string,
  filterTags?: string[],
): Promise<{ results: SearchResult[]; trace: string }> {
  const queryTerms = tokenize(query);
  if (queryTerms.length === 0) return handleEmptyQuery(db, filterTags);

  const { N, avgDocLen } = await fetchCorpusStats(db);
  if (N === 0) return { results: [], trace: "empty-corpus" };

  const { clause, params: tagParams } = buildTagFilterParams(filterTags);
  const { candidateTfs, docLengths, dfMap } = await batchLookupTerms(
    db,
    queryTerms,
    clause,
    tagParams,
  );

  if (candidateTfs.size === 0) {
    if (filterTags?.length) {
      const r = await searchByTagsOnly(db, filterTags);
      return { results: r, trace: "bm25-no-text-match" };
    }
    return { results: [], trace: "bm25-no-match" };
  }

  const docTags = await fetchCandidateTags(db, [...candidateTfs.keys()]);
  const candidateScores = computeBm25Scores(
    queryTerms,
    candidateTfs,
    docLengths,
    dfMap,
    docTags,
    filterTags,
    N,
    avgDocLen,
  );
  const sortedPaths = sortTopResults(candidateScores, BM25_DEFAULTS.MAX_RESULTS);
  if (sortedPaths.length === 0) return { results: [], trace: "bm25-zero-scored" };

  const rowMap = await fetchResultDocuments(db, sortedPaths);
  const results = buildSearchResults(
    sortedPaths,
    rowMap,
    candidateTfs,
    docTags,
    candidateScores,
    queryTerms,
  );

  return {
    results,
    trace: `bm25-batched (terms:${queryTerms.length} candidates:${candidateTfs.size} N:${N})`,
  };
}

// Re-export for backward compat (used by tools/searchDocs.ts)
export { searchByTagsOnly } from "./search-steps.js";
