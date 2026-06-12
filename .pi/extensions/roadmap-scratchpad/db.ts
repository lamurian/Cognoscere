/**
 * DuckDB helpers for roadmap scratchpad indexing and cleanup.
 */

import { resolve } from "node:path";
import duckdb from "duckdb";
import { tokenize } from "../_common/tokenize.js";
import { getOrCreateTermId } from "../para-knowledge/config.js";

const DB_FILE = "notes.duckdb";

/** Open the DuckDB database. */
export function openDb(cwd: string): duckdb.Database {
  return new duckdb.Database(resolve(cwd, DB_FILE));
}

/** Execute SQL that returns no rows. */
export function run(db: duckdb.Database, sql: string, ...params: unknown[]): Promise<void> {
  return new Promise((resolve_, reject) => {
    db.run(sql, ...params, (err: Error | null) => {
      if (err) reject(err);
      else resolve_();
    });
  });
}

/** Execute a query and return all rows. */
export function all<T = Record<string, unknown>>(
  db: duckdb.Database,
  sql: string,
  ...params: unknown[]
): Promise<T[]> {
  return new Promise((resolve_, reject) => {
    const callback: duckdb.Callback<duckdb.TableData> = (
      err: duckdb.DuckDbError | null,
      rows: duckdb.TableData,
    ) => {
      if (err) reject(err);
      else resolve_(rows as unknown as T[]);
    };
    db.all(sql, ...params, callback);
  });
}

/** Ensure all required tables and indexes exist. */
export async function initDb(db: duckdb.Database): Promise<void> {
  await run(
    db,
    `CREATE TABLE IF NOT EXISTS files (
    path VARCHAR PRIMARY KEY, title VARCHAR NOT NULL DEFAULT '',
    body TEXT NOT NULL DEFAULT '', author VARCHAR NOT NULL DEFAULT '',
    editor VARCHAR NOT NULL DEFAULT '', created TIMESTAMP,
    modified TIMESTAMP, file_mtime TIMESTAMP, source_url VARCHAR DEFAULT NULL
  )`,
  );
  try {
    await run(db, "ALTER TABLE files ADD COLUMN IF NOT EXISTS source_url VARCHAR DEFAULT NULL");
  } catch {
    /* column may already exist */
  }

  await run(
    db,
    `CREATE TABLE IF NOT EXISTS tags (file_path VARCHAR NOT NULL, tag VARCHAR NOT NULL)`,
  );
  await run(db, "CREATE INDEX IF NOT EXISTS idx_tags_tag  ON tags(tag)");
  await run(db, "CREATE INDEX IF NOT EXISTS idx_tags_path ON tags(file_path)");

  await run(
    db,
    `CREATE TABLE IF NOT EXISTS term_index (
    term_id INTEGER NOT NULL, file_path VARCHAR NOT NULL, tf INTEGER NOT NULL DEFAULT 0
  )`,
  );
  await run(db, "CREATE INDEX IF NOT EXISTS idx_term_index_tid ON term_index(term_id)");
  await run(db, "CREATE INDEX IF NOT EXISTS idx_term_index_path ON term_index(file_path)");

  // Phase 2a: term_dict for normalised term→ID mapping
  await run(
    db,
    `CREATE TABLE IF NOT EXISTS term_dict (
      term_id INTEGER PRIMARY KEY, term VARCHAR UNIQUE NOT NULL
    )`,
  );
  await run(db, "CREATE SEQUENCE IF NOT EXISTS term_dict_seq START 1");

  await run(
    db,
    `CREATE TABLE IF NOT EXISTS doc_lengths (file_path VARCHAR PRIMARY KEY, doc_length INTEGER NOT NULL DEFAULT 0)`,
  );
  await run(
    db,
    `CREATE TABLE IF NOT EXISTS corpus_stats (key VARCHAR PRIMARY KEY, value REAL NOT NULL)`,
  );
  await run(db, `INSERT OR IGNORE INTO corpus_stats (key, value) VALUES ('total_docs', 0)`);
  await run(db, `INSERT OR IGNORE INTO corpus_stats (key, value) VALUES ('avg_doc_length', 1.0)`);
}

/** Delete all DuckDB index entries for a file path. */
export async function deleteFromIndex(db: duckdb.Database, relPath: string): Promise<void> {
  await run(db, "DELETE FROM tags WHERE file_path = ?", relPath);
  await run(db, "DELETE FROM term_index WHERE file_path = ?", relPath);
  await run(db, "DELETE FROM doc_lengths WHERE file_path = ?", relPath);
  await run(db, "DELETE FROM files WHERE path = ?", relPath);
}

/** Recompute corpus-level statistics. */
export async function recomputeStats(db: duckdb.Database): Promise<void> {
  const rows = await all<{ total_docs: number | bigint; avg_doc_length: number }>(
    db,
    "SELECT COUNT(*) AS total_docs, COALESCE(AVG(doc_length), 1.0) AS avg_doc_length FROM doc_lengths",
  );
  if (rows.length > 0) {
    const totalDocs: number =
      typeof rows[0].total_docs === "bigint"
        ? Number(rows[0].total_docs)
        : (rows[0].total_docs as number);
    await run(db, "UPDATE corpus_stats SET value = ? WHERE key = 'total_docs'", totalDocs);
    await run(
      db,
      "UPDATE corpus_stats SET value = ? WHERE key = 'avg_doc_length'",
      rows[0].avg_doc_length,
    );
  }
}

/** Index a scratchpad file in DuckDB (BM25 terms, tags, files table). */
export async function indexScratchpad(
  db: duckdb.Database,
  relPath: string,
  title: string,
  body: string,
  tags: string[],
): Promise<void> {
  const now = new Date().toISOString();

  await run(
    db,
    `INSERT OR REPLACE INTO files (path, title, body, author, editor, created, modified, file_mtime, source_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    relPath,
    title,
    body,
    "pi",
    "lam",
    now,
    now,
    now,
    null,
  );

  await run(db, "DELETE FROM tags WHERE file_path = ?", relPath);
  for (const tag of tags) {
    await run(db, "INSERT INTO tags (file_path, tag) VALUES (?, ?)", relPath, tag);
  }

  await run(db, "DELETE FROM term_index WHERE file_path = ?", relPath);
  const boostedTitle = Array.from({ length: 3 }, () => title).join(" ");
  const terms = tokenize(`${boostedTitle} ${body}`);
  const tfMap = new Map<string, number>();
  for (const t of terms) tfMap.set(t, (tfMap.get(t) ?? 0) + 1);
  for (const [term, tf] of tfMap) {
    const termId = await getOrCreateTermId(db, term);
    await run(
      db,
      "INSERT INTO term_index (term_id, file_path, tf) VALUES (?, ?, ?)",
      termId,
      relPath,
      tf,
    );
  }

  await run(
    db,
    "INSERT OR REPLACE INTO doc_lengths (file_path, doc_length) VALUES (?, ?)",
    relPath,
    terms.length,
  );
}
