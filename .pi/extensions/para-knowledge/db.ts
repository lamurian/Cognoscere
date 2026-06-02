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
import { isLockError } from "./lock.js";

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

export async function initDb(db: duckdb.Database): Promise<void> {
  const run = async (sql: string) => {
    await new Promise<void>((resolve, reject) => {
      (db.run as unknown as (...args: unknown[]) => void)(sql, (err: Error | null) => {
        if (err) reject(err);
        else resolve();
      });
    });
  };

  await run(`CREATE TABLE IF NOT EXISTS files (
    path VARCHAR PRIMARY KEY, title VARCHAR NOT NULL DEFAULT '',
    body TEXT NOT NULL DEFAULT '', author VARCHAR NOT NULL DEFAULT '',
    editor VARCHAR NOT NULL DEFAULT '', created TIMESTAMP,
    modified TIMESTAMP, file_mtime TIMESTAMP, source_url VARCHAR DEFAULT NULL
  )`);

  try {
    await run("ALTER TABLE files ADD COLUMN IF NOT EXISTS source_url VARCHAR DEFAULT NULL");
  } catch {
    /* ok */
  }

  await run(`CREATE TABLE IF NOT EXISTS tags (file_path VARCHAR NOT NULL, tag VARCHAR NOT NULL)`);
  await run("CREATE INDEX IF NOT EXISTS idx_tags_tag  ON tags(tag)");
  await run("CREATE INDEX IF NOT EXISTS idx_tags_path ON tags(file_path)");
  await run("CREATE UNIQUE INDEX IF NOT EXISTS idx_tags_unique ON tags(file_path, tag)");

  await run(`CREATE TABLE IF NOT EXISTS term_index (
    term VARCHAR NOT NULL, file_path VARCHAR NOT NULL, tf INTEGER NOT NULL DEFAULT 0
  )`);
  await run("CREATE INDEX IF NOT EXISTS idx_term_index_term ON term_index(term)");
  await run("CREATE INDEX IF NOT EXISTS idx_term_index_path ON term_index(file_path)");

  await run(
    `CREATE TABLE IF NOT EXISTS doc_lengths (file_path VARCHAR PRIMARY KEY, doc_length INTEGER NOT NULL DEFAULT 0)`,
  );
  await run(
    `CREATE TABLE IF NOT EXISTS corpus_stats (key VARCHAR PRIMARY KEY, value REAL NOT NULL)`,
  );
  await run(`INSERT OR IGNORE INTO corpus_stats (key, value) VALUES ('total_docs', 0)`);
  await run(`INSERT OR IGNORE INTO corpus_stats (key, value) VALUES ('avg_doc_length', 1.0)`);
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
        return await fn(db);
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
