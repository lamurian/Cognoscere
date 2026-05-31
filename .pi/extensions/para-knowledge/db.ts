/**
 * DuckDB connection management.
 *
 * Uses ephemeral database connections – open, use, close.
 * - Reads open in READ_ONLY mode (no write lock acquired).
 * - Writes open in READ_WRITE mode with queue + timeout for cross-process safety.
 * - Lock is held for milliseconds, not the entire session.
 */

import { stat } from "node:fs/promises";
import { resolve } from "node:path";
import duckdb from "duckdb";
import { DB_FILE, TX_ABORTED_MSG, type WithDbOptions } from "./types.js";

// ── Constants ───────────────────────────────────────────────────

/** Maximum time (ms) to wait for a write lock before giving up. */
const WRITE_QUEUE_TIMEOUT = 300_000; // 5 minutes

/** Polling interval (ms) when queueing for a write lock. */
const QUEUE_POLL_INTERVAL = 2_000;

/** DuckDB open flags. */
const OPEN_FLAGS = {
  read: duckdb.OPEN_READONLY,
  write: duckdb.OPEN_READWRITE | duckdb.OPEN_CREATE,
} as const;

// ── Helpers ─────────────────────────────────────────────────────

/** Sleep for ms. */
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Check whether an error message indicates a DuckDB lock conflict.
 */
export function isLockError(msg: string): boolean {
  const lower = msg.toLowerCase();
  return lower.includes("lock") || lower.includes("conflicting lock");
}

/**
 * Attempt to heal a broken DuckDB connection by rolling back any
 * aborted transaction.  Swallows "no transaction is active" errors.
 */
export async function healAbortedTx(db: duckdb.Database): Promise<void> {
  try {
    await new Promise<void>((resolve, reject) => {
      (db.run as Function)("ROLLBACK", (err: Error | null) => {
        if (err) {
          const msg = err.message ?? "";
          if (msg.includes("no transaction is active")) resolve();
          else reject(err);
        } else resolve();
      });
    });
  } catch {
    // ignore unexpected rollback errors — db is likely beyond repair
  }
}

/**
 * Run a SQL statement and recover from aborted-transaction errors
 * by rolling back and retrying once.
 */
export async function runWithRecovery(
  db: duckdb.Database,
  sql: string,
  ...params: unknown[]
): Promise<void> {
  try {
    await new Promise<void>((resolve, reject) => {
      (db.run as Function)(sql, ...params, (err: Error | null) => {
        if (err) reject(err);
        else resolve();
      });
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes(TX_ABORTED_MSG)) {
      await healAbortedTx(db);
      // Retry once
      await new Promise<void>((resolve, reject) => {
        (db.run as Function)(sql, ...params, (err: Error | null) => {
          if (err) reject(err);
          else resolve();
        });
      });
    } else {
      throw e;
    }
  }
}

/**
 * Run a query and recover from aborted-transaction errors.
 */
export async function allWithRecovery(
  db: duckdb.Database,
  sql: string,
  ...params: unknown[]
): Promise<Record<string, unknown>[]> {
  try {
    return await new Promise<Record<string, unknown>[]>((resolve, reject) => {
      (db.all as Function)(sql, ...params, (err: Error | null, rows: Record<string, unknown>[]) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes(TX_ABORTED_MSG)) {
      await healAbortedTx(db);
      // Retry once
      return await new Promise<Record<string, unknown>[]>((resolve, reject) => {
        (db.all as Function)(sql, ...params, (err: Error | null, rows: Record<string, unknown>[]) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    }
    throw e;
  }
}

// ── Connection lifecycle ────────────────────────────────────────

/**
 * Open a DuckDB database and return the instance.
 * Rejects on failure (including lock conflicts).
 */
function openDatabase(dbPath: string, flags: number): Promise<duckdb.Database> {
  return new Promise<duckdb.Database>((resolve, reject) => {
    const db = new duckdb.Database(dbPath, flags, (err: Error | null) => {
      if (err) reject(err);
      else resolve(db);
    });
  });
}

/**
 * Close a DuckDB database, releasing the file lock.
 */
function closeDatabase(db: duckdb.Database): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    (db.close as Function)((err: Error | null) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// ── Database initialisation (idempotent) ────────────────────────

/**
 * Create all tables and indexes idempotently (CREATE IF NOT EXISTS).
 * Called automatically on every write connection.
 *
 * Tables:
 * - files         — Document metadata and body text
 * - tags          — Normalised file-to-tag mapping
 * - term_index    — Inverted index for BM25 (term → file_path + tf)
 * - doc_lengths   — Per-document token count (for BM25 length normalisation)
 * - corpus_stats  — Corpus-level statistics (total_docs, avg_doc_length)
 */
export async function initDb(db: duckdb.Database): Promise<void> {
  // Document store
  await runWithRecovery(db, `
    CREATE TABLE IF NOT EXISTS files (
      path        VARCHAR PRIMARY KEY,
      title       VARCHAR NOT NULL DEFAULT '',
      body        TEXT    NOT NULL DEFAULT '',
      author      VARCHAR NOT NULL DEFAULT '',
      editor      VARCHAR NOT NULL DEFAULT '',
      created     TIMESTAMP,
      modified    TIMESTAMP,
      file_mtime  TIMESTAMP
    )
  `);

  // Tags (normalised)
  await runWithRecovery(db, `
    CREATE TABLE IF NOT EXISTS tags (
      file_path VARCHAR NOT NULL,
      tag       VARCHAR NOT NULL
    )
  `);
  await runWithRecovery(db, "CREATE INDEX IF NOT EXISTS idx_tags_tag  ON tags(tag)");
  await runWithRecovery(db, "CREATE INDEX IF NOT EXISTS idx_tags_path ON tags(file_path)");

  // BM25 inverted index
  await runWithRecovery(db, `
    CREATE TABLE IF NOT EXISTS term_index (
      term      VARCHAR NOT NULL,
      file_path VARCHAR NOT NULL,
      tf        INTEGER NOT NULL DEFAULT 0
    )
  `);
  await runWithRecovery(db, "CREATE INDEX IF NOT EXISTS idx_term_index_term ON term_index(term)");
  await runWithRecovery(db, "CREATE INDEX IF NOT EXISTS idx_term_index_path ON term_index(file_path)");

  // Document lengths (for BM25 length normalisation)
  await runWithRecovery(db, `
    CREATE TABLE IF NOT EXISTS doc_lengths (
      file_path   VARCHAR PRIMARY KEY,
      doc_length  INTEGER NOT NULL DEFAULT 0
    )
  `);

  // Corpus-level statistics (cached)
  await runWithRecovery(db, `
    CREATE TABLE IF NOT EXISTS corpus_stats (
      key   VARCHAR PRIMARY KEY,
      value REAL NOT NULL
    )
  `);

  // Seed corpus stats if empty
  await runWithRecovery(db, `
    INSERT OR IGNORE INTO corpus_stats (key, value) VALUES ('total_docs', 0)
  `);
  await runWithRecovery(db, `
    INSERT OR IGNORE INTO corpus_stats (key, value) VALUES ('avg_doc_length', 1.0)
  `);
}

// ── withDb: open → use → close ─────────────────────────────────

/**
 * Open a DuckDB database, run `fn(db)`, then close it.
 *
 * **Read mode** (`mode: "read"`): Opens with `OPEN_READONLY`.
 *   Fails fast if another process holds the lock.
 *
 * **Write mode** (`mode: "write"`): Opens with `OPEN_READWRITE | OPEN_CREATE`.
 *   On lock conflict, prompts the user to queue and retries for up to 5 minutes.
 *   Tables are auto-created on first open.
 */
export async function withDb<T>(
  cwd: string,
  mode: "read" | "write",
  fn: (db: duckdb.Database) => Promise<T>,
  options?: WithDbOptions,
): Promise<T> {
  const dbPath = resolve(cwd, DB_FILE);

  // For reads the database must already exist
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

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const db = await openDatabase(dbPath, flags);
      try {
        // Ensure tables exist on write (idempotent)
        if (mode === "write") {
          await initDb(db);
        }
        return await fn(db);
      } finally {
        // Release the file lock immediately after the operation
        try {
          await closeDatabase(db);
        } catch {
          /* best-effort close */
        }
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);

      // Re-throw non-lock errors immediately
      if (msg === "DB_NOT_FOUND") throw e;
      if (!isLockError(msg)) throw e;

      // ── Lock conflict handling ──
      if (mode === "read" || options?.noQueue) {
        // Reads and no-queue operations fail fast
        throw e;
      }

      const elapsed = Date.now() - startTime;
      if (elapsed >= WRITE_QUEUE_TIMEOUT) {
        throw new Error(
          "⏱ Write lock queue timed out after 5 minutes.\n" +
            "Another pi session is still holding the database lock.\n" +
            "Please close the other session and retry.",
        );
      }

      // Ask the user once whether they want to queue
      if (!userAsked && options?.ctx?.ui?.confirm) {
        const remaining = Math.ceil((WRITE_QUEUE_TIMEOUT - elapsed) / 1000);
        const ok = await options.ctx.ui.confirm(
          "Knowledge Database Locked",
          `Another pi session is currently writing to the knowledge database.\n` +
            `Queue and wait (up to ${remaining}s)?`,
        );
        if (!ok) {
          throw new Error(
            "Write cancelled by user.\n" +
              "Another pi session holds the database lock.\n" +
              "Please close the other session and retry.",
          );
        }
        userAsked = true;
        continue; // immediately retry after user confirms
      }

      // Show a progress update for silent retries (before user was asked)
      if (!userAsked) {
        const elapsedSec = Math.round(elapsed / 1000);
        options?.onUpdate?.({
          content: [{ type: "text" as const, text: `🔒 Waiting for database lock (${elapsedSec}s)...` }],
        });
      }

      // Wait before retrying
      await sleep(QUEUE_POLL_INTERVAL);
    }
  }
}
