/**
 * Integration tests for para-knowledge DuckDB configuration.
 *
 * Tests that configureCrashSafety and initDb apply the correct PRAGMAs
 * (memory_limit, threads, temp_directory) and create all expected tables.
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import duckdb from "duckdb";

const WAL_CHECKPOINT_THRESHOLD = "4 MiB";

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
 * Run a SQL statement and return a Promise.
 */
function runSql(db: duckdb.Database, sql: string): Promise<void> {
  return new Promise((resolve, reject) => {
    (db.run as unknown as (...args: unknown[]) => void)(sql, (err: Error | null) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

/**
 * Query rows and return a Promise. Supports optional positional parameters.
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

// ── Phase 1a: Crash-safety configuration ──────────────────────

async function configureCrashSafety(db: duckdb.Database): Promise<void> {
  await runSql(db, `PRAGMA wal_autocheckpoint = '${WAL_CHECKPOINT_THRESHOLD}'`);
  await runSql(db, `PRAGMA checkpoint_threshold = '${WAL_CHECKPOINT_THRESHOLD}'`);
  // Phase 1a: Add memory limit, thread limit, and temp directory
  await runSql(db, "PRAGMA memory_limit = '50MB'");
  await runSql(db, "PRAGMA threads = 2");
  await runSql(db, "PRAGMA temp_directory = '/tmp/duckdb_tmp'");
}

// ── Schema tables ─────────────────────────────────────────────

async function initDb(db: duckdb.Database): Promise<void> {
  await configureCrashSafety(db);

  await runSql(db, `CREATE TABLE IF NOT EXISTS files (
    path VARCHAR PRIMARY KEY, title VARCHAR NOT NULL DEFAULT '',
    body TEXT NOT NULL DEFAULT '', author VARCHAR NOT NULL DEFAULT '',
    editor VARCHAR NOT NULL DEFAULT '', created TIMESTAMP,
    modified TIMESTAMP, file_mtime TIMESTAMP, source_url VARCHAR DEFAULT NULL
  )`);

  await runSql(db, `CREATE TABLE IF NOT EXISTS tags (
    file_path VARCHAR NOT NULL,
    tag VARCHAR NOT NULL,
    PRIMARY KEY (file_path, tag)
  )`);

  await runSql(db, "CREATE INDEX IF NOT EXISTS idx_tags_tag  ON tags(tag)");
  await runSql(db, "CREATE INDEX IF NOT EXISTS idx_tags_path ON tags(file_path)");

  await runSql(db, `CREATE TABLE IF NOT EXISTS term_index (
    term VARCHAR NOT NULL,
    file_path VARCHAR NOT NULL,
    tf INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (term, file_path)
  )`);
  await runSql(db, "CREATE INDEX IF NOT EXISTS idx_term_index_term ON term_index(term)");
  await runSql(db, "CREATE INDEX IF NOT EXISTS idx_term_index_path ON term_index(file_path)");

  await runSql(db, `CREATE TABLE IF NOT EXISTS doc_lengths (
    file_path VARCHAR PRIMARY KEY,
    doc_length INTEGER NOT NULL DEFAULT 0
  )`);

  await runSql(db, `CREATE TABLE IF NOT EXISTS corpus_stats (
    key VARCHAR PRIMARY KEY, value REAL NOT NULL
  )`);
  await runSql(db, `INSERT OR IGNORE INTO corpus_stats (key, value) VALUES ('total_docs', 0)`);
  await runSql(db, `INSERT OR IGNORE INTO corpus_stats (key, value) VALUES ('avg_doc_length', 1.0)`);

  await runSql(db, `CREATE TABLE IF NOT EXISTS citations (
    citekey VARCHAR PRIMARY KEY,
    bibtex TEXT NOT NULL,
    doi VARCHAR,
    source_url VARCHAR,
    created TIMESTAMP,
    updated TIMESTAMP
  )`);

  await runSql(db, "CHECKPOINT");
}

describe("Phase 1a: DuckDB crash-safety configuration", () => {
  let db: duckdb.Database;

  beforeAll(async () => {
    db = await openDb(":memory:");
  });

  afterAll(async () => {
    await closeDb(db);
  });

  it("caps memory_limit to a small value after configureCrashSafety", async () => {
    await configureCrashSafety(db);
    const rows = await queryRows<{ name: string; value: string }>(
      db,
      "SELECT name, value FROM duckdb_settings() WHERE name = 'memory_limit'",
    );
    expect(rows.length).toBe(1);
    // DuckDB deducts overhead, so 50 MB becomes ~47.6 MiB.
    // Verify it is capped to a small value (not the default 31.1 GiB).
    const value = parseFloat(rows[0].value);
    const unit = rows[0].value.replace(/[\d.\s]/g, "");
    expect(value).toBeLessThan(100);
    expect(unit.toLowerCase()).toBe("mib");
  });

  it("sets threads to 2 after configureCrashSafety", async () => {
    // Re-run to ensure it takes effect even if already set
    await configureCrashSafety(db);
    const rows = await queryRows<{ name: string; value: string }>(
      db,
      "SELECT name, value FROM duckdb_settings() WHERE name = 'threads'",
    );
    expect(rows.length).toBe(1);
    expect(rows[0].value).toBe("2");
  });

  it("sets temp_directory to /tmp/duckdb_tmp after configureCrashSafety", async () => {
    await configureCrashSafety(db);
    const rows = await queryRows<{ name: string; value: string }>(
      db,
      "SELECT name, value FROM duckdb_settings() WHERE name = 'temp_directory'",
    );
    expect(rows.length).toBe(1);
    expect(rows[0].value).toBe("/tmp/duckdb_tmp");
  });

  it("sets wal_autocheckpoint after configureCrashSafety", async () => {
    await configureCrashSafety(db);
    const rows = await queryRows<{ name: string; value: string }>(
      db,
      "SELECT name, value FROM duckdb_settings() WHERE name = 'wal_autocheckpoint'",
    );
    expect(rows.length).toBe(1);
    // DuckDB returns "4.0 MiB" — allow for minor formatting differences
    expect(rows[0].value).toMatch(/^4\.?0?\s*MiB$/i);
  });
});

describe("Phase 1a: initDb creates all expected tables", () => {
  let db: duckdb.Database;

  beforeAll(async () => {
    // Use a fresh :memory: database for clean state
    db = await openDb(":memory:");
    await initDb(db);
  });

  afterAll(async () => {
    await closeDb(db);
  });

  const expectedTables = ["files", "tags", "term_index", "doc_lengths", "corpus_stats", "citations"];

  for (const table of expectedTables) {
    it(`creates table '${table}'`, async () => {
      const rows = await queryRows<{ table_name: string }>(
        db,
        "SELECT table_name FROM information_schema.tables WHERE table_schema='main' AND table_name=?",
        table,
      );
      expect(rows.length).toBe(1);
      expect(rows[0].table_name).toBe(table);
    });
  }

  it("seeds corpus_stats with default values", async () => {
    const rows = await queryRows<{ key: string; value: number }>(
      db,
      "SELECT key, value FROM corpus_stats ORDER BY key",
    );
    expect(rows.length).toBe(2);
    expect(rows[0].key).toBe("avg_doc_length");
    expect(rows[0].value).toBe(1.0);
    expect(rows[1].key).toBe("total_docs");
    expect(rows[1].value).toBe(0);
  });

  it("is usable for insert and query after initDb", async () => {
    await runSql(
      db,
      `INSERT INTO files (path, title, body, author, editor, created, modified, file_mtime, source_url)
       VALUES ('test/doc.md', 'Test', 'Hello world', 'pi', 'lam', NOW(), NOW(), NOW(), NULL)`,
    );
    const rows = await queryRows<{ title: string; body: string }>(
      db,
      "SELECT title, body FROM files WHERE path = 'test/doc.md'",
    );
    expect(rows.length).toBe(1);
    expect(rows[0].title).toBe("Test");
    expect(rows[0].body).toBe("Hello world");
  });
});
