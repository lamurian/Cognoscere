/**
 * Filesystem -> DuckDB index synchronisation.
 *
 * Compares filesystem mtimes against the stored index, then:
 * - Inserts / updates changed files
 * - Deletes removed files
 * - Rebuilds the BM25 term index for changed files
 * - Recomputes corpus-level statistics
 * - Phase 1b: VACUUM after rebuild if DB exceeds 50 MB
 */

import type duckdb from "duckdb";
import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { type FileEntry, type ParsedFile, BM25_DEFAULTS } from "./types.js";
import { runWithRecovery, queryRows } from "./db.js";
import { runSql, insertTermIndexEntries } from "./config.js";
import { scanAllParaDirs, parseFile } from "./files.js";
import { tokenize } from "./bm25.js";

interface StoredFile { path: string; file_mtime: string }

/** Strip control chars that could corrupt DuckDB ART indexes. */
export function sanitiseTag(raw: string): string | null {
  const cleaned = raw.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim();
  return cleaned.length > 0 ? cleaned : null;
}

/**
 * Tokenize a document (title boosted + body) and insert into the inverted index
 * using term_dict-normalized term_id (Phase 2a).
 */
async function buildTermIndexForFile(
  db: duckdb.Database,
  filePath: string,
  title: string,
  body: string,
): Promise<number> {
  const boostedTitle = Array.from({ length: BM25_DEFAULTS.TITLE_BOOST }, () => title).join(" ");
  const terms = tokenize(`${boostedTitle} ${body}`);

  if (terms.length === 0) {
    await runWithRecovery(db, "INSERT OR REPLACE INTO doc_lengths (file_path, doc_length) VALUES (?, 0)", filePath);
    return 0;
  }

  const tfMap = new Map<string, number>();
  for (const term of terms) tfMap.set(term, (tfMap.get(term) ?? 0) + 1);

  // Phase 2a: insert via term_dict-normalized entries
  await insertTermIndexEntries(db, filePath, tfMap);

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
  db: duckdb.Database,
  files: FileEntry[],
): Promise<{ changed: FileEntry[]; toDelete: string[] }> {
  const stored = await queryRows<StoredFile>(db, "SELECT path, file_mtime FROM files");
  const storedMap = new Map(stored.map((r) => [r.path, new Date(r.file_mtime ?? 0).getTime()]));
  const fsMap = new Map(files.map((f) => [f.path, f.mtimeMs]));
  const changed: FileEntry[] = [];

  for (const f of files) {
    const storedMtime = storedMap.get(f.path);
    if (storedMtime === undefined || Math.abs(storedMtime - f.mtimeMs) > 1) {
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

async function processChangedFiles(
  db: duckdb.Database,
  entries: FileEntry[],
): Promise<{ success: number; errors: number }> {
  let success = 0, errors = 0;
  for (const entry of entries) {
    try {
      await runWithRecovery(db, "BEGIN TRANSACTION");
      const parsed: ParsedFile = await parseFile(entry);
      const mtimeStr = new Date(entry.mtimeMs).toISOString();

      await runWithRecovery(
        db,
        `INSERT OR REPLACE INTO files (path, title, body, author, editor, created, modified, file_mtime, source_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        entry.path, parsed.title, parsed.body, parsed.author, parsed.editor,
        parsed.created, new Date().toISOString(), mtimeStr, parsed.source_url,
      );

      await runWithRecovery(db, "DELETE FROM tags WHERE file_path = ?", entry.path);
      for (const tag of parsed.tags) {
        const cleanTag = sanitiseTag(tag);
        if (cleanTag === null) continue;
        await runWithRecovery(db, "INSERT INTO tags (file_path, tag) VALUES (?, ?)", entry.path, cleanTag);
      }

      await buildTermIndexForFile(db, entry.path, parsed.title, parsed.body);
      await runWithRecovery(db, "COMMIT");
      success++;
    } catch (e) {
      try { await runWithRecovery(db, "ROLLBACK"); } catch { /* best-effort */ }
      console.error(`[sync] Failed to index ${entry.path}:`, e);
      errors++;
    }
  }
  return { success, errors };
}

function parseBibtexEntry(text: string): { citekey: string; raw: string } | null {
  const match = text.match(/@\w+\{([^,]+),\s*([\s\S]*?)\n?\}/);
  if (!match) return null;
  return { citekey: match[1].trim(), raw: match[0] };
}

/** Read @ref.bib and insert new citations into DuckDB. */
export async function syncCitations(db: duckdb.Database, cwd: string): Promise<number> {
  const refBibPath = resolve(cwd, "ref.bib");
  let content: string;
  try { content = await readFile(refBibPath, "utf-8"); } catch { return 0; }

  const entries: { citekey: string; raw: string }[] = [];
  const entryRegex = /@\w+\{[^}]+\}/g;
  let m: RegExpExecArray | null;
  while ((m = entryRegex.exec(content)) !== null) {
    const parsed = parseBibtexEntry(m[0]);
    if (parsed) entries.push(parsed);
  }
  if (entries.length === 0) return 0;

  const now = new Date().toISOString();
  let inserted = 0;
  for (const entry of entries) {
    const existing = await queryRows<{ citekey: string }>(db, "SELECT citekey FROM citations WHERE citekey = ?", entry.citekey);
    if (existing.length > 0) continue;
    const doiMatch = entry.raw.match(/doi\s*=\s*\{([^}]+)\}/i);
    const urlMatch = entry.raw.match(/url\s*=\s*\{([^}]+)\}/i);
    await runWithRecovery(
      db, "INSERT OR IGNORE INTO citations (citekey, bibtex, doi, source_url, created, updated) VALUES (?, ?, ?, ?, ?, ?)",
      entry.citekey, entry.raw, doiMatch?.[1] ?? null, urlMatch?.[1] ?? null, now, now,
    );
    inserted++;
  }
  if (inserted > 0) console.error(`[sync] Synced ${inserted} new citation(s) from ref.bib`);
  return inserted;
}

/** Phase 1b: VACUUM the database if it exceeds 50 MB on disk. */
async function vacuumIfNeeded(db: duckdb.Database, cwd: string): Promise<void> {
  try {
    const dbPath = resolve(cwd, "notes.duckdb");
    const s = await stat(dbPath);
    if (s.size > 50 * 1024 * 1024) await runSql(db, "VACUUM");
  } catch { /* best-effort */ }
}

export async function syncIndex(db: duckdb.Database, cwd: string): Promise<boolean> {
  const files = await scanAllParaDirs(cwd);
  const { changed, toDelete } = await findChangedFiles(db, files);

  if (changed.length === 0 && toDelete.length === 0) {
    await syncCitations(db, cwd);
    return false;
  }

  await deleteRemoved(db, toDelete);
  const { success, errors } = await processChangedFiles(db, changed);
  await recomputeCorpusStats(db);
  await syncCitations(db, cwd);

  // Phase 1b: Compact database if it exceeds 50 MB
  await vacuumIfNeeded(db, cwd);

  console.error(`[sync] Done: ${success} indexed, ${errors} errors, ${toDelete.length} deleted`);
  return success > 0 || toDelete.length > 0;
}
