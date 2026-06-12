/**
 * SQLite database path and helpers for roadmap scratchpad indexing.
 *
 * Replaces the DuckDB-based implementation with db-sqlite.ts calls.
 * The `indexFile` and `removeFile` functions from db-sqlite.ts handle
 * all FTS5 indexing, making the separate `term_index`, `term_dict`,
 * `doc_lengths`, and `corpus_stats` tables unnecessary.
 */

import { resolve } from "node:path";
import type { SqliteDb } from "../para-knowledge/db-sqlite.js";
import { createDb, initDb, indexFile, removeFile } from "../para-knowledge/db-sqlite.js";
import type { DocIndex } from "../para-knowledge/db-sqlite.js";

const DB_FILE = "notes.db";

/**
 * Normalise a working-directory path to the SQLite database file.
 */
export function dbPath(cwd: string): string {
  return resolve(cwd, DB_FILE);
}

/**
 * Open a SQLite database at the project's notes.db path.
 */
export function openScratchpadDb(cwd: string): SqliteDb {
  const db = createDb(dbPath(cwd));
  initDb(db);
  return db;
}

/**
 * Index a scratchpad document in the SQLite database.
 */
export function indexScratchpad(
  db: SqliteDb,
  relPath: string,
  title: string,
  body: string,
  tags: string[],
): void {
  const now = new Date().toISOString();
  const doc: DocIndex = {
    path: relPath,
    title,
    body,
    tags,
    author: "pi",
    editor: "lam",
    created: now,
    modified: now,
    file_mtime: now,
    source_url: null,
  };
  indexFile(db, doc);
}

/**
 * Remove a scratchpad document from the SQLite database.
 */
export { removeFile as deleteFromIndex };
