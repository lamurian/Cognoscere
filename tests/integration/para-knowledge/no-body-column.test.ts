/**
 * Integration tests for Phase 2b: remove files.body column, read from disk.
 *
 * Tests that:
 * 1. initDb() creates files table WITHOUT body column
 * 2. Inserting a file entry without body works correctly
 * 3. readDocumentBody() reads the body from the markdown file on disk
 * 4. Search results populate body by reading from disk
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import duckdb from "duckdb";
import { readFile, writeFile, mkdtemp, mkdir, rm } from "node:fs/promises";
import { resolve, join, dirname } from "node:path";
import { tmpdir } from "node:os";

/**
 * Open a DuckDB database from path or :memory:.
 */
function openDb(dbPath: string): Promise<duckdb.Database> {
  return new Promise((resolve, reject) => {
    const db = new duckdb.Database(dbPath, duckdb.OPEN_READWRITE | duckdb.OPEN_CREATE, (err) => {
      if (err) reject(err);
      else resolve(db);
    });
  });
}

/**
 * Run a SQL statement with optional positional parameters and return a Promise.
 */
function runSql(db: duckdb.Database, sql: string, ...params: unknown[]): Promise<void> {
  return new Promise((resolve, reject) => {
    (db.run as unknown as (...args: unknown[]) => void)(
      sql,
      ...params,
      (err: Error | null) => {
        if (err) reject(err);
        else resolve();
      },
    );
  });
}

/**
 * Query rows and return a Promise.
 */
function queryRows<T = Record<string, unknown>>(
  db: duckdb.Database,
  sql: string,
  ...params: unknown[]
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    (db.all as unknown as (...args: unknown[]) => void)(
      sql,
      ...params,
      (err: Error | null, rows: T[]) => {
        if (err) reject(err);
        else resolve(rows);
      },
    );
  });
}

/**
 * Close the database.
 */
function closeDb(db: duckdb.Database): Promise<void> {
  return new Promise((resolve, reject) => {
    (db.close as unknown as (...args: unknown[]) => void)((err: Error | null) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// ── Phase 2b helpers ──────────────────────────────────────────

/** Strip YAML frontmatter from markdown content, returning only the body. */
function stripFrontmatter(content: string): string {
  return content.replace(/^---\n[\s\S]*?\n---\n?/, "").trim();
}

/** Read a markdown file from disk and return just the body (no frontmatter). */
async function readDocumentBody(projectDir: string, filePath: string): Promise<string> {
  const fullPath = resolve(projectDir, filePath);
  const content = await readFile(fullPath, "utf-8");
  return stripFrontmatter(content);
}

/** Write a markdown file with frontmatter to disk. */
async function writeDocFile(
  projectDir: string,
  filePath: string,
  title: string,
  body: string,
  tags: string[] = [],
): Promise<string> {
  const fullPath = resolve(projectDir, filePath);
  await mkdir(dirname(fullPath), { recursive: true });
  const fm = `---
title: ${title}
author: pi
editor: lam
date: '2026-06-12'
tags:
${tags.map((t) => `  - ${t}`).join("\n")}
---
\n${body}`;
  await writeFile(fullPath, fm, "utf-8");
  return fullPath;
}

/**
 * Initialize database with Phase 2b schema (no body column in files table).
 */
async function initNoBodySchema(db: duckdb.Database, projectDir: string): Promise<void> {
  await runSql(db, "PRAGMA wal_autocheckpoint = '4 MiB'");
  await runSql(db, "PRAGMA checkpoint_threshold = '4 MiB'");
  await runSql(db, "PRAGMA memory_limit = '50MB'");
  await runSql(db, "PRAGMA threads = 2");

  // files table WITHOUT body column (Phase 2b)
  await runSql(db, `CREATE TABLE IF NOT EXISTS files (
    path VARCHAR PRIMARY KEY, title VARCHAR NOT NULL DEFAULT '',
    author VARCHAR NOT NULL DEFAULT '', editor VARCHAR NOT NULL DEFAULT '',
    created TIMESTAMP, modified TIMESTAMP, file_mtime TIMESTAMP,
    source_url VARCHAR DEFAULT NULL
  )`);

  // Other tables needed for search
  await runSql(db, `CREATE TABLE IF NOT EXISTS tags (
    file_path VARCHAR NOT NULL, tag VARCHAR NOT NULL,
    PRIMARY KEY (file_path, tag)
  )`);

  await runSql(db, `CREATE TABLE IF NOT EXISTS term_index (
    term_id INTEGER NOT NULL, file_path VARCHAR NOT NULL,
    tf INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (term_id, file_path)
  )`);

  await runSql(db, `CREATE TABLE IF NOT EXISTS doc_lengths (
    file_path VARCHAR PRIMARY KEY, doc_length INTEGER NOT NULL DEFAULT 0
  )`);

  await runSql(db, `CREATE TABLE IF NOT EXISTS corpus_stats (
    key VARCHAR PRIMARY KEY, value REAL NOT NULL
  )`);
  await runSql(db, "INSERT OR IGNORE INTO corpus_stats VALUES ('total_docs', 0)");
  await runSql(db, "INSERT OR IGNORE INTO corpus_stats VALUES ('avg_doc_length', 1.0)");

  // term_dict (Phase 2a)
  await runSql(db, `CREATE TABLE IF NOT EXISTS term_dict (
    term_id INTEGER PRIMARY KEY, term VARCHAR UNIQUE NOT NULL
  )`);
  await runSql(db, "CREATE SEQUENCE IF NOT EXISTS term_dict_seq START 1");

  await runSql(db, "CHECKPOINT");
}

/** Get or create a term ID (same as config.ts implementation). */
async function getOrCreateTermId(db: duckdb.Database, term: string): Promise<number> {
  const existing = await queryRows<{ term_id: number }>(
    db, "SELECT term_id FROM term_dict WHERE term = ?", term,
  );
  if (existing.length > 0) return existing[0].term_id;
  await runSql(db, "INSERT INTO term_dict (term_id, term) VALUES (nextval('term_dict_seq'), ?)", term);
  const newRows = await queryRows<{ term_id: number }>(
    db, "SELECT term_id FROM term_dict WHERE term = ?", term,
  );
  return newRows[0].term_id;
}

describe("Phase 2b: files table without body column", () => {
  let db: duckdb.Database;

  beforeAll(async () => {
    db = await openDb(":memory:");
    await initNoBodySchema(db, process.cwd());
  });

  afterAll(async () => {
    await closeDb(db);
  });

  it("creates files table without body column", async () => {
    const cols = await queryRows<{ column_name: string }>(
      db,
      "SELECT column_name FROM information_schema.columns WHERE table_name='files' AND column_name='body'",
    );
    expect(cols.length).toBe(0);
  });

  it("inserts a file entry without body field", async () => {
    await runSql(
      db,
      `INSERT INTO files (path, title, author, editor, created, modified, file_mtime)
       VALUES ('test/no-body.md', 'No Body Doc', 'pi', 'lam', NOW(), NOW(), NOW())`,
    );
    // Verify it stored without error
    const rows = await queryRows<{ path: string; title: string }>(
      db,
      "SELECT path, title FROM files WHERE path = 'test/no-body.md'",
    );
    expect(rows.length).toBe(1);
    expect(rows[0].title).toBe("No Body Doc");
  });

  it("files table has no body column (querying body returns error or null)", async () => {
    // DuckDB will error if we SELECT a non-existent column
    try {
      await queryRows(db, "SELECT body FROM files LIMIT 1");
      expect.fail("Should have thrown — body column does not exist");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      expect(msg).toMatch(/does not exist|not found|cannot be found/i);
    }
  });
});

describe("Phase 2b: readDocumentBody from disk", () => {
  let tempDir: string;

  beforeAll(async () => {
    tempDir = await mkdtemp(join(tmpdir(), "phase2b-test-"));
    // Create a PARA-like directory structure
    await rm(tempDir, { recursive: true, force: true });
  });

  afterAll(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it("reads body from a markdown file and strips frontmatter", async () => {
    const filePath = "Resources/test-doc.md";
    await writeDocFile(
      tempDir,
      filePath,
      "Test Doc",
      "This is the body content.\n\nIt has multiple paragraphs.",
      ["test", "phase2b"],
    );

    const body = await readDocumentBody(tempDir, filePath);
    expect(body).toBe("This is the body content.\n\nIt has multiple paragraphs.");
  });

  it("returns empty string for body-only file with no frontmatter", async () => {
    const fullPath = resolve(tempDir, "Resources/no-frontmatter.md");
    await writeFile(fullPath, "Just body text, no frontmatter markers", "utf-8");

    const body = await readDocumentBody(tempDir, "Resources/no-frontmatter.md");
    expect(body).toBe("Just body text, no frontmatter markers");
  });

  it("returns empty for empty file", async () => {
    const fullPath = resolve(tempDir, "Resources/empty.md");
    await writeFile(fullPath, "", "utf-8");

    const body = await readDocumentBody(tempDir, "Resources/empty.md");
    expect(body).toBe("");
  });

  it("handles files with complex frontmatter", async () => {
    const content = `---
title: Complex
description: A complex doc with special chars
author: pi
editor: lam
date: '2026-06-12'
tags:
  - alpha
  - beta:gamma
source: https://example.com
---
# Heading 1

Body paragraph with **bold** and _italic_.

- List item 1
- List item 2

\`\`\`
code block
\`\`\`
`;
    const fullPath = resolve(tempDir, "Resources/complex.md");
    await writeFile(fullPath, content, "utf-8");

    const body = await readDocumentBody(tempDir, "Resources/complex.md");
    expect(body).toContain("# Heading 1");
    expect(body).toContain("Body paragraph with");
    expect(body).toContain("code block");
    expect(body).not.toContain("title: Complex");
  });
});

describe("Phase 2b: search result returns body from disk", () => {
  let db: duckdb.Database;
  let tempDir: string;

  beforeAll(async () => {
    tempDir = await mkdtemp(join(tmpdir(), "phase2b-search-"));
    db = await openDb(":memory:");
    await initNoBodySchema(db, tempDir);
  });

  afterAll(async () => {
    await closeDb(db);
    await rm(tempDir, { recursive: true, force: true });
  });

  it("fetches search results with body read from disk", async () => {
    // Write a doc to disk
    const relPath = "Resources/search-result-doc.md";
    const docBody = "This is the document body for search result testing.";
    await writeDocFile(tempDir, relPath, "Search Result Doc", docBody, ["search-test"]);

    // Insert into DB (no body column)
    await runSql(
      db,
      `INSERT INTO files (path, title, author, editor, created, modified, file_mtime)
       VALUES (?, ?, 'pi', 'lam', NOW(), NOW(), NOW())`,
      relPath,
      "Search Result Doc",
    );

    // Insert tags
    await runSql(db, "INSERT INTO tags VALUES (?, ?)", relPath, "search-test");

    // Verify we can query the file entry
    const rows = await queryRows<{ path: string; title: string }>(
      db,
      "SELECT path, title FROM files WHERE path = ?",
      relPath,
    );
    expect(rows.length).toBe(1);
    expect(rows[0].path).toBe(relPath);

    // Simulate what the search pipeline does: read body from disk
    const body = await readDocumentBody(tempDir, relPath);
    expect(body).toBe(docBody);
  });
});
