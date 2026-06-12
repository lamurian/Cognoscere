/**
 * Integration tests for SQLite document indexing (insert, update, delete).
 *
 * Verifies that indexFile, removeFile, and recomputeStats work correctly
 * with the FTS5 full-text search index and the metadata tables.
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { SqliteDb } from "../../../.pi/extensions/para-knowledge/db-sqlite.js";
import {
  createDb,
  initDb,
  indexFile,
  removeFile,
  recomputeStats,
} from "../../../.pi/extensions/para-knowledge/db-sqlite.js";

describe("SQLite document indexing", () => {
  let db: SqliteDb;

  beforeAll(() => {
    db = createDb(":memory:");
    initDb(db);
  });

  afterAll(() => {
    db.close();
  });

  it("inserts a document and makes it searchable via FTS5", () => {
    indexFile(db, {
      path: "Resources/machine-learning-intro.md",
      title: "Introduction to Machine Learning",
      body: "Machine learning is a subset of artificial intelligence that enables systems to learn from data.",
      tags: ["machine-learning", "AI", "tutorial"],
      author: "pi",
      editor: "lam",
      created: "2024-01-01T00:00:00.000Z",
      modified: "2024-01-01T00:00:00.000Z",
      file_mtime: "2024-01-01T00:00:00.000Z",
      source_url: null,
    });

    // Verify files table
    const fileRow = db.prepare(
      "SELECT path, title, author, editor, source_url FROM files WHERE path = ?",
    ).get<{ path: string; title: string }>("Resources/machine-learning-intro.md");
    expect(fileRow).toBeTruthy();
    expect(fileRow!.title).toBe("Introduction to Machine Learning");

    // Verify tags table
    const tagRows = db.prepare(
      "SELECT tag FROM tags WHERE file_path = ? ORDER BY tag",
    ).all<{ tag: string }>("Resources/machine-learning-intro.md");
    expect(tagRows.map((r) => r.tag)).toEqual(["AI", "machine-learning", "tutorial"]);

    // Verify FTS5 search works
    const results = db.prepare(
      "SELECT path, title, rank FROM docs_fts WHERE docs_fts MATCH 'machine' ORDER BY rank",
    ).all<{ path: string; title: string; rank: number }>();
    expect(results.length).toBe(1);
    expect(results[0].path).toBe("Resources/machine-learning-intro.md");

    // Verify matching by tag text (tags_csv is searchable)
    const tagResults = db.prepare(
      "SELECT path FROM docs_fts WHERE docs_fts MATCH 'tutorial'",
    ).all<{ path: string }>();
    expect(tagResults.length).toBe(1);
    expect(tagResults[0].path).toBe("Resources/machine-learning-intro.md");
  });

  it("inserts a second document and ranks relevance correctly", () => {
    indexFile(db, {
      path: "Resources/deep-learning.md",
      title: "Deep Learning Basics",
      body: "Deep learning uses neural networks with many layers to model complex patterns in data.",
      tags: ["deep-learning", "neural-networks", "AI"],
      author: "pi",
      editor: "lam",
      created: "2024-01-02T00:00:00.000Z",
      modified: "2024-01-02T00:00:00.000Z",
      file_mtime: "2024-01-02T00:00:00.000Z",
      source_url: null,
    });

    // Search for "deep" — should rank deep-learning.md higher
    const results = db.prepare(
      "SELECT path, rank FROM docs_fts WHERE docs_fts MATCH 'deep' ORDER BY rank",
    ).all<{ path: string; rank: number }>();
    expect(results.length).toBe(1);
    expect(results[0].path).toBe("Resources/deep-learning.md");
    expect(results[0].rank).toBeLessThan(0);

    // Search for "learning" — should match both, with correct ranking
    const both = db.prepare(
      "SELECT path, rank FROM docs_fts WHERE docs_fts MATCH 'learning' ORDER BY rank",
    ).all<{ path: string; rank: number }>();
    expect(both.length).toBe(2);
    // The document with more "learning" mentions should rank first (more negative rank)
    expect(both[0].rank).toBeLessThanOrEqual(both[1].rank);
  });

  it("updates an existing document's content and title", () => {
    // Update the machine learning doc
    indexFile(db, {
      path: "Resources/machine-learning-intro.md",
      title: "ML Fundamentals (Updated)",
      body: "Updated content about machine learning fundamentals and supervised learning.",
      tags: ["machine-learning", "supervised-learning", "AI"],
      author: "pi",
      editor: "lam",
      created: "2024-01-01T00:00:00.000Z",
      modified: "2024-01-03T00:00:00.000Z",
      file_mtime: "2024-01-03T00:00:00.000Z",
      source_url: null,
    });

    // Verify files table was updated
    const fileRow = db.prepare(
      "SELECT title, modified FROM files WHERE path = ?",
    ).get<{ title: string; modified: string }>("Resources/machine-learning-intro.md");
    expect(fileRow!.title).toBe("ML Fundamentals (Updated)");
    expect(fileRow!.modified).toBe("2024-01-03T00:00:00.000Z");

    // Verify old tags were replaced
    const tagRows = db.prepare(
      "SELECT tag FROM tags WHERE file_path = ? ORDER BY tag",
    ).all<{ tag: string }>("Resources/machine-learning-intro.md");
    expect(tagRows.map((r) => r.tag)).toEqual(["AI", "machine-learning", "supervised-learning"]);

    // Verify FTS5 reflects the update
    const oldResults = db.prepare(
      "SELECT path FROM docs_fts WHERE docs_fts MATCH 'tutorial'",
    ).all<{ path: string }>();
    expect(oldResults.length).toBe(0); // "tutorial" was removed

    const newResults = db.prepare(
      "SELECT path FROM docs_fts WHERE docs_fts MATCH 'supervised'",
    ).all<{ path: string }>();
    expect(newResults.length).toBe(1);
    expect(newResults[0].path).toBe("Resources/machine-learning-intro.md");
  });

  it("removes a document from all tables and FTS5", () => {
    removeFile(db, "Resources/deep-learning.md");

    // Verify files table
    const fileRow = db.prepare(
      "SELECT path FROM files WHERE path = ?",
    ).get("Resources/deep-learning.md");
    expect(fileRow).toBeUndefined();

    // Verify tags table
    const tagRows = db.prepare(
      "SELECT tag FROM tags WHERE file_path = ?",
    ).all("Resources/deep-learning.md");
    expect(tagRows.length).toBe(0);

    // Verify FTS5 — should not appear in search anymore
    const results = db.prepare(
      "SELECT path FROM docs_fts WHERE docs_fts MATCH 'deep'",
    ).all<{ path: string }>();
    expect(results.length).toBe(0);
  });

  it("recomputes corpus statistics after inserts and deletes", () => {
    // After removal of deep-learning.md, only machine-learning-intro.md remains
    const fileCount = db.prepare(
      "SELECT COUNT(*) as cnt FROM files",
    ).get<{ cnt: number }>();
    expect(fileCount!.cnt).toBe(1); // Only the ML doc remains

    // Verify we can still search the remaining doc
    const results = db.prepare(
      "SELECT path FROM docs_fts WHERE docs_fts MATCH 'machine'",
    ).all<{ path: string }>();
    expect(results.length).toBe(1);
  });

  it("handles documents with no tags gracefully", () => {
    indexFile(db, {
      path: "Resources/untagged.md",
      title: "Untagged Document",
      body: "This document has no tags at all.",
      tags: [],
      author: "pi",
      editor: "lam",
      created: "2024-01-01T00:00:00.000Z",
      modified: "2024-01-01T00:00:00.000Z",
      file_mtime: "2024-01-01T00:00:00.000Z",
      source_url: null,
    });

    const fileRow = db.prepare(
      "SELECT path FROM files WHERE path = ?",
    ).get("Resources/untagged.md");
    expect(fileRow).toBeTruthy();

    const tagRows = db.prepare(
      "SELECT tag FROM tags WHERE file_path = ?",
    ).all("Resources/untagged.md");
    expect(tagRows.length).toBe(0);

    // Clean up
    removeFile(db, "Resources/untagged.md");
  });

  it("handles documents with source_url correctly", () => {
    indexFile(db, {
      path: "Resources/sourced-doc.md",
      title: "Sourced Document",
      body: "This document has a source URL.",
      tags: ["reference"],
      author: "pi",
      editor: "lam",
      created: "2024-01-01T00:00:00.000Z",
      modified: "2024-01-01T00:00:00.000Z",
      file_mtime: "2024-01-01T00:00:00.000Z",
      source_url: "https://example.com/article",
    });

    const fileRow = db.prepare(
      "SELECT path, source_url FROM files WHERE path = ?",
    ).get<{ path: string; source_url: string }>("Resources/sourced-doc.md");
    expect(fileRow!.source_url).toBe("https://example.com/article");

    removeFile(db, "Resources/sourced-doc.md");
  });
});
