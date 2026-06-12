/**
 * DuckDB configuration helpers — crash-safety, memory governance, temp directory.
 *
 * Phase 1a: OOM prevention (memory_limit, threads, temp_directory).
 * Phase 2a: getOrCreateTermId — term dictionary lookup/insert for normalized term_index.
 */

import type duckdb from "duckdb";
import { rm, mkdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const WAL_CHECKPOINT_THRESHOLD = "4 MiB";
const MEMORY_LIMIT = "50MB";
const MAX_THREADS = 2;
const TEMP_DIR = ".duckdb_tmp";

/** Run a SQL statement with optional positional parameters. */
export function runSql(db: duckdb.Database, sql: string, ...params: unknown[]): Promise<void> {
  return new Promise<void>((resolve, reject) => {
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

/** Query rows with optional positional parameters. */
export function querySql<T = Record<string, unknown>>(
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
 * Look up a term in term_dict, or insert and return the new ID.
 * Used by sync/create/update to normalize VARCHAR terms to integer IDs.
 */
export async function getOrCreateTermId(
  db: duckdb.Database,
  term: string,
): Promise<number> {
  const existing = await querySql<{ term_id: number }>(
    db,
    "SELECT term_id FROM term_dict WHERE term = ?",
    term,
  );
  if (existing.length > 0) return existing[0].term_id;

  await runSql(db, "INSERT INTO term_dict (term_id, term) VALUES (nextval('term_dict_seq'), ?)", term);
  const newRows = await querySql<{ term_id: number }>(
    db,
    "SELECT term_id FROM term_dict WHERE term = ?",
    term,
  );
  return newRows[0].term_id;
}

/**
 * Batch-insert term_index entries using term_dict IDs.
 * Deletes existing entries for the file_path first.
 */
export async function insertTermIndexEntries(
  db: duckdb.Database,
  filePath: string,
  terms: Map<string, number>,
): Promise<void> {
  await runSql(db, "DELETE FROM term_index WHERE file_path = ?", filePath);

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
      `INSERT INTO term_index (term_id, file_path, tf) VALUES ${placeholders}`,
      ...params,
    );
  }
}

export async function configureCrashSafety(db: duckdb.Database): Promise<void> {
  await runSql(db, `PRAGMA wal_autocheckpoint = '${WAL_CHECKPOINT_THRESHOLD}'`);
  await runSql(db, `PRAGMA checkpoint_threshold = '${WAL_CHECKPOINT_THRESHOLD}'`);
  await runSql(db, `PRAGMA memory_limit = '${MEMORY_LIMIT}'`);
  await runSql(db, `PRAGMA threads = ${MAX_THREADS}`);
}

export function resolveTempDir(dbPath: string): string {
  return resolve(dbPath, "..", TEMP_DIR);
}

export async function cleanTempDir(dbPath: string): Promise<void> {
  const dir = resolveTempDir(dbPath);
  try {
    await rm(dir, { recursive: true, force: true });
    await mkdir(dir, { recursive: true });
  } catch { /* best-effort */ }
}

export async function setTempDir(db: duckdb.Database, dbPath: string): Promise<void> {
  const dir = resolveTempDir(dbPath);
  await runSql(db, `PRAGMA temp_directory = '${dir}'`);
}

/** Strip YAML frontmatter from markdown content, returning only the body. */
export function stripFrontmatter(content: string): string {
  return content.replace(/^---\n[\s\S]*?\n---\n?/, "").trim();
}

/**
 * Read a markdown file from disk and return just the body (no frontmatter).
 * Phase 2b: files.body is no longer stored in DuckDB; read from disk on demand.
 */
export async function readDocumentBody(projectDir: string, filePath: string): Promise<string> {
  const fullPath = resolve(projectDir, filePath);
  const content = await readFile(fullPath, "utf-8");
  return stripFrontmatter(content);
}
