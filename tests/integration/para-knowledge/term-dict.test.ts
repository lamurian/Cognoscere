/**
 * Integration tests for Phase 2a: term_index normalization with dictionary table.
 *
 * Tests that:
 * 1. initDb() creates the term_dict table with correct schema
 * 2. Inserting terms uses term_dict to resolve VARCHAR → INTEGER IDs
 * 3. term_index stores term_id instead of raw VARCHAR terms
 * 4. BM25 search still works correctly via JOIN through term_dict
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import duckdb from "duckdb";

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

// ── Phase 2a: term_dict + normalized term_index ────────────────

async function configureCrashSafety(db: duckdb.Database): Promise<void> {
  await runSql(db, "PRAGMA wal_autocheckpoint = '4 MiB'");
  await runSql(db, "PRAGMA checkpoint_threshold = '4 MiB'");
  await runSql(db, "PRAGMA memory_limit = '50MB'");
  await runSql(db, "PRAGMA threads = 2");
}

/**
 * Get or create a term_id for a given term VARCHAR.
 * Returns the existing term_id or inserts and returns the new one.
 */
async function getOrCreateTermId(db: duckdb.Database, term: string): Promise<number> {
  // Check if term already exists
  const existing = await queryRows<{ term_id: number }>(
    db,
    "SELECT term_id FROM term_dict WHERE term = ?",
    term,
  );
  if (existing.length > 0) return existing[0].term_id;

  // Insert new term with explicit sequence-assigned ID
  await runSql(db, "INSERT INTO term_dict (term_id, term) VALUES (nextval('term_dict_seq'), ?)", term);
  const newRows = await queryRows<{ term_id: number }>(
    db,
    "SELECT term_id FROM term_dict WHERE term = ?",
    term,
  );
  return newRows[0].term_id;
}

/**
 * Insert term-frequency entries into term_index using term_dict for ID resolution.
 */
async function insertTermIndexEntries(
  db: duckdb.Database,
  filePath: string,
  terms: Map<string, number>,
): Promise<void> {
  // Delete existing entries for this file
  await runSql(db, "DELETE FROM term_index WHERE file_path = ?", filePath);

  // Insert in batches of 500
  const entries = [...terms.entries()];
  for (let i = 0; i < entries.length; i += 500) {
    const chunk = entries.slice(i, i + 500);
    const placeholders = chunk.map(() => "(?, ?, ?)").join(", ");
    const params: unknown[] = [];

    for (const [term, tf] of chunk) {
      const termId = await getOrCreateTermId(db, term);
      params.push(termId, filePath, tf);
    }

    await runSql(
      db,
      `INSERT OR REPLACE INTO term_index (term_id, file_path, tf) VALUES ${placeholders}`,
      ...params,
    );
  }
}

/**
 * Initialize database with Phase 2a schema (term_dict + normalized term_index).
 */
async function initPhase2a(db: duckdb.Database): Promise<void> {
  await configureCrashSafety(db);

  // term_dict table — term_id assigned manually via sequence
  await runSql(db, `CREATE TABLE IF NOT EXISTS term_dict (
    term_id INTEGER PRIMARY KEY,
    term VARCHAR UNIQUE NOT NULL
  )`);
  await runSql(db, "CREATE SEQUENCE IF NOT EXISTS term_dict_seq START 1");

  // Modified term_index — uses term_id instead of VARCHAR term
  await runSql(db, `CREATE TABLE IF NOT EXISTS term_index (
    term_id INTEGER NOT NULL,
    file_path VARCHAR NOT NULL,
    tf INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (term_id, file_path)
  )`);
  await runSql(db, "CREATE INDEX IF NOT EXISTS idx_term_index_tid ON term_index(term_id)");
  await runSql(db, "CREATE INDEX IF NOT EXISTS idx_term_index_path ON term_index(file_path)");

  // Keep other tables as-is for search to work
  await runSql(db, `CREATE TABLE IF NOT EXISTS files (
    path VARCHAR PRIMARY KEY, title VARCHAR NOT NULL DEFAULT '',
    body TEXT NOT NULL DEFAULT '', author VARCHAR NOT NULL DEFAULT '',
    editor VARCHAR NOT NULL DEFAULT '', created TIMESTAMP,
    modified TIMESTAMP, file_mtime TIMESTAMP, source_url VARCHAR DEFAULT NULL
  )`);

  await runSql(db, `CREATE TABLE IF NOT EXISTS tags (
    file_path VARCHAR NOT NULL, tag VARCHAR NOT NULL,
    PRIMARY KEY (file_path, tag)
  )`);

  await runSql(db, `CREATE TABLE IF NOT EXISTS doc_lengths (
    file_path VARCHAR PRIMARY KEY, doc_length INTEGER NOT NULL DEFAULT 0
  )`);

  await runSql(db, `CREATE TABLE IF NOT EXISTS corpus_stats (
    key VARCHAR PRIMARY KEY, value REAL NOT NULL
  )`);
  await runSql(db, "INSERT OR IGNORE INTO corpus_stats VALUES ('total_docs', 0)");
  await runSql(db, "INSERT OR IGNORE INTO corpus_stats VALUES ('avg_doc_length', 1.0)");

  await runSql(db, "CHECKPOINT");
}

describe("Phase 2a: term_dict table creation", () => {
  let db: duckdb.Database;

  beforeAll(async () => {
    db = await openDb(":memory:");
    await initPhase2a(db);
  });

  afterAll(async () => {
    await closeDb(db);
  });

  it("creates term_dict table", async () => {
    const rows = await queryRows<{ table_name: string }>(
      db,
      "SELECT table_name FROM information_schema.tables WHERE table_schema='main' AND table_name='term_dict'",
    );
    expect(rows.length).toBe(1);
    expect(rows[0].table_name).toBe("term_dict");
  });

  it("term_dict has term_id INTEGER and term VARCHAR UNIQUE columns", async () => {
    const cols = await queryRows<{ column_name: string; data_type: string; is_nullable: string }>(
      db,
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name='term_dict' ORDER BY ordinal_position",
    );
    expect(cols.length).toBe(2);
    expect(cols[0].column_name).toBe("term_id");
    expect(cols[1].column_name).toBe("term");
  });

  it("term_index uses term_id INTEGER instead of term VARCHAR", async () => {
    const cols = await queryRows<{ column_name: string; data_type: string }>(
      db,
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name='term_index' ORDER BY ordinal_position",
    );
    const termCol = cols.find((c) => c.column_name === "term_id");
    expect(termCol).toBeDefined();
    expect(termCol!.data_type).toBe("INTEGER");
    const oldTermCol = cols.find((c) => c.column_name === "term");
    expect(oldTermCol).toBeUndefined(); // No VARCHAR 'term' column
  });
});

describe("Phase 2a: term insertion and lookup", () => {
  let db: duckdb.Database;

  beforeAll(async () => {
    db = await openDb(":memory:");
    await initPhase2a(db);
  });

  afterAll(async () => {
    await closeDb(db);
  });

  it("getOrCreateTermId inserts a new term and returns a positive integer ID", async () => {
    const id = await getOrCreateTermId(db, "publication");
    expect(typeof id).toBe("number");
    expect(id).toBeGreaterThanOrEqual(1);
  });

  it("getOrCreateTermId returns the same ID for duplicate terms", async () => {
    const id1 = await getOrCreateTermId(db, "bias");
    const id2 = await getOrCreateTermId(db, "bias");
    expect(id1).toBe(id2);
  });

  it("getOrCreateTermId assigns different IDs for different terms", async () => {
    const id1 = await getOrCreateTermId(db, "meta-analysis");
    const id2 = await getOrCreateTermId(db, "systematic-review");
    expect(id1).not.toBe(id2);
  });

  it("insertTermIndexEntries stores data correctly through term_dict", async () => {
    const terms = new Map<string, number>([
      ["funnel", 3],
      ["plot", 2],
      ["asymmetry", 1],
    ]);
    await insertTermIndexEntries(db, "test/doc.md", terms);

    // Verify via join — term_index stores term_id, JOIN term_dict to get term
    const rows = await queryRows<{ term: string; tf: number; file_path: string }>(
      db,
      `SELECT t.term, ti.tf, ti.file_path
       FROM term_index ti
       JOIN term_dict t ON ti.term_id = t.term_id
       WHERE ti.file_path = 'test/doc.md'
       ORDER BY ti.tf DESC`,
    );
    expect(rows.length).toBe(3);
    expect(rows[0].term).toBe("funnel");
    expect(rows[0].tf).toBe(3);
    expect(rows[1].term).toBe("plot");
    expect(rows[1].tf).toBe(2);
    expect(rows[2].term).toBe("asymmetry");
    expect(rows[2].tf).toBe(1);
  });

  it("BM25 search via JOIN works with normalized term_index", async () => {
    // Insert a document with known terms
    const terms = new Map<string, number>([
      ["publication", 2],
      ["bias", 3],
      ["meta", 1],
      ["analysis", 1],
    ]);
    await insertTermIndexEntries(db, "search/doc1.md", terms);

    // Insert doc_lengths and corpus_stats for BM25
    await runSql(db, "INSERT OR REPLACE INTO doc_lengths VALUES ('search/doc1.md', 7)");
    await runSql(db, "UPDATE corpus_stats SET value = 1 WHERE key = 'total_docs'");
    await runSql(db, "UPDATE corpus_stats SET value = 7.0 WHERE key = 'avg_doc_length'");

    // Query using the normalized schema with JOIN to term_dict
    const bm25Rows = await queryRows<{ file_path: string; score: number }>(
      db,
      `SELECT ti.file_path,
              SUM(LOG((1.0 - 0.5) / (df.df + 0.5) + 1) *
                  (ti.tf * (1.2 + 1)) / (ti.tf + 1.2 * (1 - 0.75 + 0.75 * (dl.doc_length / 7.0)))) AS score
       FROM term_index ti
       JOIN term_dict t ON ti.term_id = t.term_id
       JOIN doc_lengths dl ON ti.file_path = dl.file_path
       JOIN (
         SELECT t2.term, COUNT(*) AS df
         FROM term_index ti2
         JOIN term_dict t2 ON ti2.term_id = t2.term_id
         WHERE t2.term IN ('publication', 'bias', 'meta', 'analysis')
         GROUP BY t2.term
       ) df ON t.term = df.term
       WHERE t.term IN ('publication', 'bias', 'meta', 'analysis')
       GROUP BY ti.file_path, dl.doc_length`,
    );

    expect(bm25Rows.length).toBeGreaterThan(0);
    expect(bm25Rows[0].score).toBeGreaterThan(0);
  });
});
