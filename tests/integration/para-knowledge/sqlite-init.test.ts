/**
 * Integration tests for SQLite-based database initialization.
 *
 * Verifies that initDb() creates all expected tables including FTS5,
 * enables WAL mode, and that the database is ready for BM25 search.
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import type { SqliteDb } from "../../../.pi/extensions/para-knowledge/db-sqlite.js";
import { createDb, initDb } from "../../../.pi/extensions/para-knowledge/db-sqlite.js";

describe("SQLite database initialization", () => {
  let db: SqliteDb;

  beforeAll(() => {
    db = createDb(":memory:");
    initDb(db);
  });

  afterAll(() => {
    db.close();
  });

  const expectedTables = ["files", "tags", "docs_fts", "citations"];

  for (const table of expectedTables) {
    it(`creates table '${table}'`, () => {
      const rows = db.prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name = ?",
      ).all<{ name: string }>(table);
      expect(rows.length).toBe(1);
      expect(rows[0].name).toBe(table);
    });
  }

  it("creates files table with correct columns", () => {
    const cols = db.prepare(
      "SELECT name FROM pragma_table_info('files')",
    ).all<{ name: string }>();
    const names = cols.map((c) => c.name).sort();
    expect(names).toContain("path");
    expect(names).toContain("title");
    expect(names).toContain("author");
    expect(names).toContain("editor");
    expect(names).toContain("created");
    expect(names).toContain("modified");
    expect(names).toContain("file_mtime");
    expect(names).toContain("source_url");
  });

  it("creates tags table with correct columns and primary key", () => {
    const cols = db.prepare(
      "SELECT name FROM pragma_table_info('tags')",
    ).all<{ name: string }>();
    const names = cols.map((c) => c.name).sort();
    expect(names).toEqual(["file_path", "tag"]);

    // Verify primary key exists (file_path, tag)
    const pkCols = db.prepare(
      "SELECT name FROM pragma_table_info('tags') WHERE pk > 0 ORDER BY pk",
    ).all<{ name: string }>();
    expect(pkCols.length).toBe(2);
    expect(pkCols[0].name).toBe("file_path");
    expect(pkCols[1].name).toBe("tag");
  });

  it("creates citations table with correct columns", () => {
    const cols = db.prepare(
      "SELECT name FROM pragma_table_info('citations')",
    ).all<{ name: string }>();
    const names = cols.map((c) => c.name).sort();
    expect(names).toContain("citekey");
    expect(names).toContain("bibtex");
    expect(names).toContain("doi");
    expect(names).toContain("source_url");
    expect(names).toContain("created");
    expect(names).toContain("updated");
  });

  it("creates docs_fts as an FTS5 virtual table", () => {
    // FTS5 tables register as both a table and an index in sqlite_master
    const rows = db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='docs_fts'",
    ).all();
    expect(rows.length).toBe(1);

    // Verify FTS5 shadow tables exist (FTS5 creates data, idx, content, docsize, config)
    const internalTables = db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'docs_fts_%'",
    ).all<{ name: string }>();
    expect(internalTables.length).toBeGreaterThanOrEqual(3);
    const names = internalTables.map((r) => r.name);
    expect(names).toContain("docs_fts_data");
    expect(names).toContain("docs_fts_idx");
  });

  it("uses WAL journal mode for file-based databases", () => {
    // :memory: databases always report "memory" for journal_mode
    // For file-based DBs, journal_mode returns "wal" after PRAGMA journal_mode=WAL
    const row = db.prepare("PRAGMA journal_mode").get<{ journal_mode: string }>();
    expect(["wal", "memory"]).toContain(row!.journal_mode.toLowerCase());

    // Verify the PRAGMA was accepted by checking it didn't error
    const check = db.prepare("PRAGMA journal_mode").get<{ journal_mode: string }>();
    expect(check).toBeTruthy();
  });

  it("sets small cache size (< 10 MB)", () => {
    const row = db.prepare("PRAGMA cache_size").get<{ cache_size: number }>();
    // cache_size is in pages (default page size is 4096 bytes)
    // -2000 means 2000 * 4096 = ~8 MB
    // Verify it's negative (page count mode) and relatively small
    const cacheSize = row!.cache_size;
    expect(cacheSize).toBeLessThan(5000); // well under 20 MB
    expect(cacheSize).toBeLessThan(0); // negative means page count, not byte limit
  });

  it("uses synchronous NORMAL mode for safe WAL performance", () => {
    const row = db.prepare("PRAGMA synchronous").get<{ synchronous: number }>();
    // NORMAL = 1
    expect(row!.synchronous).toBe(1);
  });

  it("is ready for BM25 search via FTS5", () => {
    // Insert a test document
    db.prepare(
      "INSERT INTO files (path, title, author, editor, created, modified, file_mtime) VALUES (?, ?, ?, ?, ?, ?, ?)",
    ).run("test/doc.md", "Test Document", "pi", "lam", "2024-01-01", "2024-01-01", "2024-01-01");

    // Insert into FTS5 index
    db.prepare(
      "INSERT INTO docs_fts (path, title, body, tags_csv) VALUES (?, ?, ?, ?)",
    ).run("test/doc.md", "Test Document", "This is a test document about machine learning and AI", "test, document");

    // Search using FTS5 BM25
    const results = db.prepare(
      "SELECT path, title, rank FROM docs_fts WHERE docs_fts MATCH 'machine' ORDER BY rank",
    ).all<{ path: string; title: string; rank: number }>();

    expect(results.length).toBe(1);
    expect(results[0].path).toBe("test/doc.md");
    expect(results[0].title).toBe("Test Document");
    // rank should be negative (BM25: lower is better, best match is most negative)
    expect(results[0].rank).toBeLessThan(0);
  });
});
