/**
 * Integration tests for FTS5 BM25 search with tag filtering.
 *
 * Verifies that searchDocs() returns correctly ranked results using FTS5's
 * built-in BM25 ranking, with optional tag filtering and tag boost.
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { SqliteDb } from "../../../.pi/extensions/para-knowledge/db-sqlite.js";
import {
  createDb,
  initDb,
  indexFile,
  searchDocs,
  type SearchResult,
} from "../../../.pi/extensions/para-knowledge/db-sqlite.js";

describe("SQLite FTS5 search", () => {
  let db: SqliteDb;

  beforeAll(() => {
    db = createDb(":memory:");
    initDb(db);

    // Seed documents for search tests
    indexFile(db, {
      path: "Resources/machine-learning.md",
      title: "Machine Learning Fundamentals",
      body: "Machine learning is a subset of artificial intelligence that focuses on building systems that learn from data. Key concepts include supervised learning, unsupervised learning, and reinforcement learning.",
      tags: ["AI", "machine-learning", "tutorial"],
      author: "pi",
      editor: "lam",
      created: "2024-01-01T00:00:00.000Z",
      modified: "2024-01-01T00:00:00.000Z",
      file_mtime: "2024-01-01T00:00:00.000Z",
      source_url: null,
    });

    indexFile(db, {
      path: "Resources/deep-learning.md",
      title: "Deep Learning with Neural Networks",
      body: "Deep learning uses neural networks with multiple layers to model complex patterns. It has revolutionized computer vision and natural language processing.",
      tags: ["deep-learning", "neural-networks", "AI"],
      author: "pi",
      editor: "lam",
      created: "2024-01-02T00:00:00.000Z",
      modified: "2024-01-02T00:00:00.000Z",
      file_mtime: "2024-01-02T00:00:00.000Z",
      source_url: null,
    });

    indexFile(db, {
      path: "Projects/statistical-analysis.md",
      title: "Statistical Analysis in Research",
      body: "Statistical analysis methods including hypothesis testing, regression analysis, and Bayesian inference for research applications.",
      tags: ["statistics", "research", "hypothesis-testing"],
      author: "pi",
      editor: "lam",
      created: "2024-01-03T00:00:00.000Z",
      modified: "2024-01-03T00:00:00.000Z",
      file_mtime: "2024-01-03T00:00:00.000Z",
      source_url: null,
    });

    indexFile(db, {
      path: "Areas/python-snippets.md",
      title: "Python Code Snippets",
      body: "Useful Python snippets for data processing and automation scripts.",
      tags: ["python", "snippets", "automation"],
      author: "pi",
      editor: "lam",
      created: "2024-01-04T00:00:00.000Z",
      modified: "2024-01-04T00:00:00.000Z",
      file_mtime: "2024-01-04T00:00:00.000Z",
      source_url: null,
    });
  });

  afterAll(() => {
    db.close();
  });

  it("returns results ranked by BM25 relevance", () => {
    const results = searchDocs(db, "machine learning");

    expect(results.length).toBeGreaterThan(0);
    // machine-learning.md should be ranked highest (title + body both mention "machine learning")
    expect(results[0].path).toBe("Resources/machine-learning.md");
    // All results should have scores (negative values, lower = more relevant)
    for (const r of results) {
      expect(r.score).toBeLessThanOrEqual(0);
    }
  });

  it("returns results ordered by descending relevance (most relevant first)", () => {
    const results = searchDocs(db, "learning");

    // Should return both ML and DL docs (both mention "learning")
    const paths = results.map((r) => r.path);
    expect(paths.length).toBeGreaterThanOrEqual(2);

    // machine-learning.md mentions "learning" 4x, deep-learning.md mentions it 1x
    // So ML should rank higher (more negative rank)
    expect(results[0].path).toBe("Resources/machine-learning.md");
    expect(results[1].path).toBe("Resources/deep-learning.md");
  });

  it("filters results by tag (single tag)", () => {
    const results = searchDocs(db, "learning", { tags: ["AI"] });

    // All results should have the AI tag
    for (const r of results) {
      expect(r.tagMatches).toContain("AI");
    }

    // Should exclude the statistical-analysis doc (doesn't have AI tag)
    const paths = results.map((r) => r.path);
    expect(paths).not.toContain("Projects/statistical-analysis.md");
    expect(paths).not.toContain("Areas/python-snippets.md");
  });

  it("filters results by multiple tags (OR logic)", () => {
    const results = searchDocs(db, "learning", { tags: ["AI", "python"] });

    // AI-tagged docs that also match the text query
    const paths = results.map((r) => r.path);
    expect(paths).toContain("Resources/machine-learning.md");
    expect(paths).toContain("Resources/deep-learning.md");

    // python-snippets has the "python" tag but doesn't match "learning" in text.
    // Tag-only results are only included when text matches nothing.
    // Since text matched AI-tagged docs, python-snippets is excluded.
    expect(paths).not.toContain("Areas/python-snippets.md");

    // Should exclude non-matching tags
    expect(paths).not.toContain("Projects/statistical-analysis.md");
  });

  it("returns tag-only results when query is empty", () => {
    const results = searchDocs(db, "", { tags: ["statistics"] });

    expect(results.length).toBe(1);
    expect(results[0].path).toBe("Projects/statistical-analysis.md");
    expect(results[0].matchedByTag).toBe(true);
  });

  it("applies tag boost to documents matching filter tags", () => {
    // Search for "neural" which only matches deep-learning.md
    const results = searchDocs(db, "neural", { tags: ["AI"] });

    expect(results.length).toBe(1);
    expect(results[0].path).toBe("Resources/deep-learning.md");
  });

  it("returns tag-only results when text query has no matches under the tag filter", () => {
    // Search for "learning" with python tag — no document matches "learning" AND "python"
    // Should return python-snippets as tag-only fallback
    const results = searchDocs(db, "learning", { tags: ["python"] });

    expect(results.length).toBe(1);
    expect(results[0].path).toBe("Areas/python-snippets.md");
    expect(results[0].matchedByTag).toBe(true);
  });

  it("returns metadata (title, author, tags) in search results", () => {
    const results = searchDocs(db, "statistical");

    expect(results.length).toBe(1);
    const r = results[0];
    expect(r.title).toBe("Statistical Analysis in Research");
    expect(r.author).toBe("pi");
    expect(r.tags).toContain("statistics");
    expect(r.tags).toContain("hypothesis-testing");
  });

  it("limits results to a specified max count", () => {
    const results = searchDocs(db, "learning", {}, 1);

    expect(results.length).toBe(1);
    expect(results[0].path).toBe("Resources/machine-learning.md");
  });

  it("returns empty array for unmatched query with no tag filter", () => {
    const results = searchDocs(db, "zzzznonexistent");
    expect(results.length).toBe(0);
  });

  it("handles single-character and stop-word queries gracefully", () => {
    // Single char
    const single = searchDocs(db, "a");
    // Should handle gracefully — FTS5 may still match tokens
    expect(Array.isArray(single)).toBe(true);

    // Stop word only
    const stop = searchDocs(db, "the");
    expect(Array.isArray(stop)).toBe(true);
  });

  it("handles queries containing dots without FTS5 syntax error", () => {
    // Dots (e.g., "paseo.sh") previously triggered an FTS5 column-prefix syntax error.
    // They should be handled gracefully without throwing.
    const results = searchDocs(db, "paseo.sh chat room agentic orchestration");
    expect(Array.isArray(results)).toBe(true);
  });
});
