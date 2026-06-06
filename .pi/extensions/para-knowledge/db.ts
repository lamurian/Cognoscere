/**
 * DuckDB connection management.
 *
 * Uses ephemeral database connections – open, use, close.
 * - Reads open in READ_ONLY mode (no write lock acquired).
 * - Writes open in READ_WRITE mode with queue + timeout for cross-process safety.
 * - Lock is held for milliseconds, not the entire session.
 *
 * Lock/recovery helpers (healAbortedTx, runWithRecovery, allWithRecovery, isLockError)
 * are in lock.ts to keep this file under 300 lines.
 */

import { stat } from "node:fs/promises";
import { resolve } from "node:path";
import duckdb from "duckdb";
import { DB_FILE, type WithDbOptions } from "./types.js";
import { isLockError, queryRows } from "./lock.js";

const WRITE_QUEUE_TIMEOUT = 300_000;
const QUEUE_POLL_INTERVAL = 2_000;

const OPEN_FLAGS = {
  read: duckdb.OPEN_READONLY,
  write: duckdb.OPEN_READWRITE | duckdb.OPEN_CREATE,
} as const;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function openDatabase(dbPath: string, flags: number): Promise<duckdb.Database> {
  return new Promise<duckdb.Database>((resolve, reject) => {
    const db = new duckdb.Database(dbPath, flags, (err: Error | null) => {
      if (err) reject(err);
      else resolve(db);
    });
  });
}

function closeDatabase(db: duckdb.Database): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    (db.close as unknown as (...args: unknown[]) => void)((err: Error | null) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

/**
 * ════════════════════════════════════════════════════════════
 * Corruption prevention: DuckDB configuration
 * ════════════════════════════════════════════════════════════
 *
 * These PRAGMAs reduce the risk of database corruption from
 * crashes or concurrent writes:
 *
 * 1. wal_autocheckpoint (4 MiB vs default 16 MiB)
 *    — Forces periodic WAL flushes. Less data at risk if the
 *      process crashes mid-write.
 *
 * 2. checkpoint_threshold (4 MiB vs default 16 MiB)
 *    — Triggers checkpoint earlier, keeping the WAL small.
 *
 * 3. enable_checkpoint_on_shutdown
 *    — Ensures a final checkpoint when the connection closes
 *      gracefully (default is already true in DuckDB).
 *
 * 4. After every write operation, closeDatabase() calls
 *    CHECKPOINT explicitly before closing.
 * ════════════════════════════════════════════════════════════
 */

const WAL_CHECKPOINT_THRESHOLD = "4 MiB";

/** Run a SQL statement and return a Promise. */
function runSql(db: duckdb.Database, sql: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    (db.run as unknown as (...args: unknown[]) => void)(sql, (err: Error | null) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

/**
 * Configure DuckDB for crash safety.
 */
async function configureCrashSafety(db: duckdb.Database): Promise<void> {
  await runSql(db, `PRAGMA wal_autocheckpoint = '${WAL_CHECKPOINT_THRESHOLD}'`);
  await runSql(db, `PRAGMA checkpoint_threshold = '${WAL_CHECKPOINT_THRESHOLD}'`);
}

/**
 * Check whether a table has a PRIMARY KEY on the given columns.
 * Used by schema migration — if a PK already exists, we skip
 * redundant UNIQUE INDEX creation that would conflict with it.
 */
async function tableHasPrimaryKey(
  db: duckdb.Database,
  table: string,
  columns: string[],
): Promise<boolean> {
  try {
    const rows = await queryRows<{ pk: number; name: string }>(
      db,
      `SELECT name, pk FROM pragma_table_info('${table}') WHERE pk = 1`,
    );
    const pkCols = rows.map((r) => r.name);
    return (
      pkCols.length === columns.length &&
      columns.every((c) => pkCols.includes(c))
    );
  } catch {
    return false;
  }
}

export async function initDb(db: duckdb.Database): Promise<void> {
  // ── Step 1: Crash-safety configuration (must run before any writes) ──
  await configureCrashSafety(db);

  // ── Step 2: Schema creation ──

  await runSql(db, `CREATE TABLE IF NOT EXISTS files (
    path VARCHAR PRIMARY KEY, title VARCHAR NOT NULL DEFAULT '',
    body TEXT NOT NULL DEFAULT '', author VARCHAR NOT NULL DEFAULT '',
    editor VARCHAR NOT NULL DEFAULT '', created TIMESTAMP,
    modified TIMESTAMP, file_mtime TIMESTAMP, source_url VARCHAR DEFAULT NULL
  )`);

  try {
    await runSql(db, "ALTER TABLE files ADD COLUMN IF NOT EXISTS source_url VARCHAR DEFAULT NULL");
  } catch {
    /* ok */
  }

  await runSql(db, `CREATE TABLE IF NOT EXISTS tags (
    file_path VARCHAR NOT NULL,
    tag VARCHAR NOT NULL,
    PRIMARY KEY (file_path, tag)
  )`);
  await runSql(db, "CREATE INDEX IF NOT EXISTS idx_tags_tag  ON tags(tag)");
  await runSql(db, "CREATE INDEX IF NOT EXISTS idx_tags_path ON tags(file_path)");
  if (!(await tableHasPrimaryKey(db, "tags", ["file_path", "tag"]))) {
    // Migration for databases created before PRIMARY KEY was added.
    // Old databases have no PK on tags. Since DuckDB doesn't support
    // ALTER TABLE ADD PRIMARY KEY, we use a UNIQUE INDEX instead.
    try {
      await runSql(db, "CREATE UNIQUE INDEX IF NOT EXISTS idx_tags_unique ON tags(file_path, tag)");
    } catch {
      /* Non-fatal — tags use DELETE+INSERT, not upserts */
    }
  }

  await runSql(db, `CREATE TABLE IF NOT EXISTS term_index (
    term VARCHAR NOT NULL,
    file_path VARCHAR NOT NULL,
    tf INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (term, file_path)
  )`);
  await runSql(db, "CREATE INDEX IF NOT EXISTS idx_term_index_term ON term_index(term)");
  await runSql(db, "CREATE INDEX IF NOT EXISTS idx_term_index_path ON term_index(file_path)");
  if (!(await tableHasPrimaryKey(db, "term_index", ["term", "file_path"]))) {
    // Migration for databases created before PRIMARY KEY was added.
    try {
      await runSql(db, "CREATE UNIQUE INDEX IF NOT EXISTS idx_term_index_unique ON term_index(term, file_path)");
    } catch {
      /* Non-fatal; term_index uses DELETE+INSERT, not upserts */
    }
  }

  await runSql(
    db,
    `CREATE TABLE IF NOT EXISTS doc_lengths (
      file_path VARCHAR PRIMARY KEY,
      doc_length INTEGER NOT NULL DEFAULT 0
    )`,
  );
  if (!(await tableHasPrimaryKey(db, "doc_lengths", ["file_path"]))) {
    // Migration for databases created before PRIMARY KEY was added.
    // Old databases have no PK, so INSERT OR REPLACE would fail.
    try {
      await runSql(db, "CREATE UNIQUE INDEX IF NOT EXISTS idx_doc_lengths_unique ON doc_lengths(file_path)");
    } catch {
      /* Non-fatal; INSERT OR REPLACE won't work without a constraint */
    }
  }
  await runSql(
    db,
    `CREATE TABLE IF NOT EXISTS corpus_stats (key VARCHAR PRIMARY KEY, value REAL NOT NULL)`,
  );
  await runSql(db, `INSERT OR IGNORE INTO corpus_stats (key, value) VALUES ('total_docs', 0)`);
  await runSql(db, `INSERT OR IGNORE INTO corpus_stats (key, value) VALUES ('avg_doc_length', 1.0)`);

  // ── Citations table (for BibTeX-based citation system) ──
  await runSql(db, `CREATE TABLE IF NOT EXISTS citations (
    citekey VARCHAR PRIMARY KEY,
    bibtex TEXT NOT NULL,
    doi VARCHAR,
    source_url VARCHAR,
    created TIMESTAMP,
    updated TIMESTAMP
  )`);
  await runSql(db, "CREATE INDEX IF NOT EXISTS idx_citations_doi ON citations(doi)");
  await runSql(db, "CREATE INDEX IF NOT EXISTS idx_citations_url ON citations(source_url)");

  // ── Step 3: Initial checkpoint ──
  await runSql(db, "CHECKPOINT");
}

/* eslint-disable-next-line complexity */
export async function withDb<T>(
  cwd: string,
  mode: "read" | "write",
  fn: (db: duckdb.Database) => Promise<T>,
  options?: WithDbOptions,
): Promise<T> {
  const dbPath = resolve(cwd, DB_FILE);

  if (mode === "read") {
    try {
      await stat(dbPath);
    } catch {
      throw new Error("DB_NOT_FOUND");
    }
  }

  const flags = OPEN_FLAGS[mode];
  const startTime = Date.now();
  let userAsked = false;

  for (;;) {
    try {
      const db = await openDatabase(dbPath, flags);
      try {
        if (mode === "write") await initDb(db);
        const result = await fn(db);
        // ── Corruption prevention: force checkpoint after every write ──
        // This flushes the WAL to the main database file before closing,
        // reducing the risk of data loss if the process crashes.
        if (mode === "write") {
          await runSql(db, "CHECKPOINT").catch(() => {
            /* best-effort checkpoint — DB may still be consistent without it */
          });
        }
        return result;
      } finally {
        try {
          await closeDatabase(db);
        } catch {
          /* best-effort close */
        }
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg === "DB_NOT_FOUND") throw e;
      if (!isLockError(msg)) throw e;

      if (mode === "read" || options?.noQueue) throw e;

      const elapsed = Date.now() - startTime;
      if (elapsed >= WRITE_QUEUE_TIMEOUT) {
        throw new Error(
          "Write lock queue timed out after 5 minutes.\n" +
            "Another pi session is still holding the database lock.\n" +
            "Please close the other session and retry.",
          { cause: e },
        );
      }

      if (!userAsked && options?.ctx?.ui?.confirm) {
        const remaining = Math.ceil((WRITE_QUEUE_TIMEOUT - elapsed) / 1000);
        const ok = await options.ctx.ui.confirm(
          "Knowledge Database Locked",
          `Another pi session is currently writing to the knowledge database.\nQueue and wait (up to ${remaining}s)?`,
        );
        if (!ok) {
          throw new Error(
            "Write cancelled by user.\nAnother pi session holds the database lock.\nPlease close the other session and retry.",
            { cause: e },
          );
        }
        userAsked = true;
        continue;
      }

      if (!userAsked) {
        const elapsedSec = Math.round(elapsed / 1000);
        options?.onUpdate?.({
          content: [
            { type: "text" as const, text: `🔒 Waiting for database lock (${elapsedSec}s)...` },
          ],
          details: {},
        });
      }

      await sleep(QUEUE_POLL_INTERVAL);
    }
  }
}
export { runWithRecovery, allWithRecovery, queryRows, healAbortedTx, isLockError } from "./lock.js";
