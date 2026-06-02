/**
 * Filesystem -> DuckDB index synchronisation.
 *
 * Compares filesystem mtimes against the stored index, then:
 * - Inserts / updates changed files
 * - Deletes removed files
 * - Rebuilds the BM25 term index for changed files
 * - Recomputes corpus-level statistics
 */

import type duckdb from "duckdb";
import { type FileEntry, type ParsedFile, BM25_DEFAULTS } from "./types.js";
import { runWithRecovery, queryRows } from "./db.js";
import { scanAllParaDirs, parseFile } from "./files.js";
import { tokenize } from "./bm25.js";

interface StoredFile { path: string; file_mtime: string; }
interface MissingTagFile { path: string; }

/**
 * Tokenize a document (title boosted + body) and insert into the inverted index.
 */
async function buildTermIndexForFile(
  db: duckdb.Database, filePath: string, title: string, body: string,
): Promise<number> {
  await runWithRecovery(db, "DELETE FROM term_index WHERE file_path = ?", filePath);

  const boostedTitle = Array.from({ length: BM25_DEFAULTS.TITLE_BOOST }, () => title).join(" ");
  const terms = tokenize(`${boostedTitle} ${body}`);

  if (terms.length === 0) {
    await runWithRecovery(db, "INSERT OR REPLACE INTO doc_lengths (file_path, doc_length) VALUES (?, 0)", filePath);
    return 0;
  }

  const tfMap = new Map<string, number>();
  for (const term of terms) tfMap.set(term, (tfMap.get(term) ?? 0) + 1);

  for (const [term, tf] of tfMap) {
    await runWithRecovery(db, "INSERT INTO term_index (term, file_path, tf) VALUES (?, ?, ?)", term, filePath, tf);
  }

  await runWithRecovery(db, "INSERT OR REPLACE INTO doc_lengths (file_path, doc_length) VALUES (?, ?)", filePath, terms.length);
  return terms.length;
}

async function recomputeCorpusStats(db: duckdb.Database): Promise<void> {
  const rows = await queryRows<{ total_docs: number | bigint; avg_doc_length: number }>(
    db, "SELECT COUNT(*) AS total_docs, COALESCE(AVG(doc_length), 1.0) AS avg_doc_length FROM doc_lengths",
  );
  if (rows.length > 0) {
    const totalDocs = typeof rows[0].total_docs === "bigint" ? Number(rows[0].total_docs) : rows[0].total_docs;
    await runWithRecovery(db, "UPDATE corpus_stats SET value = ? WHERE key = 'total_docs'", totalDocs);
    await runWithRecovery(db, "UPDATE corpus_stats SET value = ? WHERE key = 'avg_doc_length'", rows[0].avg_doc_length);
  }
}

async function findChangedFiles(
  db: duckdb.Database, files: FileEntry[],
): Promise<{ changed: FileEntry[]; toDelete: string[] }> {
  const stored = await queryRows<StoredFile>(db, "SELECT path, file_mtime FROM files");
  const storedMap = new Map(stored.map((r) => [r.path, new Date(r.file_mtime ?? 0).getTime()]));

  const missingTags = new Set<string>();
  try {
    const missing = await queryRows<MissingTagFile>(
      db, "SELECT f.path FROM files f LEFT JOIN tags t ON f.path = t.file_path WHERE t.tag IS NULL",
    );
    for (const r of missing) missingTags.add(r.path);
  } catch { /* best-effort */ }

  const fsMap = new Map(files.map((f) => [f.path, f.mtimeMs]));
  const changed: FileEntry[] = [];

  for (const f of files) {
    const storedMtime = storedMap.get(f.path);
    if (storedMtime === undefined || Math.abs(storedMtime - f.mtimeMs) > 1 || missingTags.has(f.path)) {
      changed.push(f);
    }
  }

  const toDelete = [...storedMap.keys()].filter((p) => !fsMap.has(p));
  return { changed, toDelete };
}

async function deleteRemoved(db: duckdb.Database, paths: string[]): Promise<void> {
  for (const p of paths) {
    try {
      await runWithRecovery(db, "DELETE FROM tags WHERE file_path = ?", p);
      await runWithRecovery(db, "DELETE FROM term_index WHERE file_path = ?", p);
      await runWithRecovery(db, "DELETE FROM doc_lengths WHERE file_path = ?", p);
      await runWithRecovery(db, "DELETE FROM files WHERE path = ?", p);
    } catch { /* best-effort per file */ }
  }
}

async function processChangedFiles(db: duckdb.Database, entries: FileEntry[]): Promise<{ success: number; errors: number }> {
  let success = 0, errors = 0;

  for (const entry of entries) {
    try {
      const parsed: ParsedFile = await parseFile(entry);
      const mtimeStr = new Date(entry.mtimeMs).toISOString();

      await runWithRecovery(db,
        `INSERT OR REPLACE INTO files (path, title, body, author, editor, created, modified, file_mtime, source_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        entry.path, parsed.title, parsed.body, parsed.author, parsed.editor,
        parsed.created, new Date().toISOString(), mtimeStr, parsed.source_url,
      );

      await runWithRecovery(db, "DELETE FROM tags WHERE file_path = ?", entry.path);
      for (const tag of parsed.tags) {
        await runWithRecovery(db, "INSERT INTO tags (file_path, tag) VALUES (?, ?)", entry.path, tag);
      }

      await buildTermIndexForFile(db, entry.path, parsed.title, parsed.body);
      success++;
    } catch (e) {
      console.error(`[sync] Failed to index ${entry.path}:`, e);
      errors++;
    }
  }
  return { success, errors };
}

export async function syncIndex(db: duckdb.Database, cwd: string): Promise<boolean> {
  const files = await scanAllParaDirs(cwd);
  const { changed, toDelete } = await findChangedFiles(db, files);

  if (changed.length === 0 && toDelete.length === 0) return false;

  await deleteRemoved(db, toDelete);
  const { success, errors } = await processChangedFiles(db, changed);
  await recomputeCorpusStats(db);

  console.error(`[sync] Done: ${success} indexed, ${errors} errors, ${toDelete.length} deleted`);
  return success > 0 || toDelete.length > 0;
}
