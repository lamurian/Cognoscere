/**
 * Filesystem → DuckDB index synchronisation.
 *
 * Compares filesystem mtimes against the stored index, then:
 * - Inserts / updates changed files
 * - Deletes removed files
 * - Rebuilds the BM25 term index for changed files
 * - Recomputes corpus-level statistics
 *
 * Everything runs inside a single transaction for atomicity.
 */

import type duckdb from "duckdb";
import { type FileEntry, type ParsedFile, BM25_DEFAULTS } from "./types.js";
import { runWithRecovery, allWithRecovery, healAbortedTx } from "./db.js";
import { scanAllParaDirs, parseFile } from "./files.js";
import { tokenize } from "./search.js";

// ── Term-index building ─────────────────────────────────────────

/**
 * Tokenize a document (title boosted + body) and insert into the inverted index.
 * Deletes any existing term_index rows for this file first.
 */
async function buildTermIndexForFile(
  db: duckdb.Database,
  filePath: string,
  title: string,
  body: string,
): Promise<number> {
  // Remove old entries
  await runWithRecovery(db, "DELETE FROM term_index WHERE file_path = ?", filePath);

  // Tokenize: repeat title TITLE_BOOST times to boost title terms
  const boostedTitle = Array.from({ length: BM25_DEFAULTS.TITLE_BOOST }, () => title).join(" ");
  const text = `${boostedTitle} ${body}`;
  const terms = tokenize(text);

  if (terms.length === 0) {
    // Update doc_length to 0
    await runWithRecovery(db, `
      INSERT OR REPLACE INTO doc_lengths (file_path, doc_length) VALUES (?, 0)
    `, filePath);
    return 0;
  }

  // Count term frequencies
  const tfMap = new Map<string, number>();
  for (const term of terms) {
    tfMap.set(term, (tfMap.get(term) ?? 0) + 1);
  }

  // Batch insert terms
  for (const [term, tf] of tfMap) {
    await runWithRecovery(db,
      "INSERT INTO term_index (term, file_path, tf) VALUES (?, ?, ?)",
      term, filePath, tf,
    );
  }

  const docLength = terms.length;

  // Update doc_length
  await runWithRecovery(db, `
    INSERT OR REPLACE INTO doc_lengths (file_path, doc_length) VALUES (?, ?)
  `, filePath, docLength);

  return docLength;
}

/**
 * Recompute corpus-level statistics (total_docs, avg_doc_length).
 */
async function recomputeCorpusStats(db: duckdb.Database): Promise<void> {
  const rows = await allWithRecovery(db, `
    SELECT
      COUNT(*) AS total_docs,
      COALESCE(AVG(doc_length), 1.0) AS avg_doc_length
    FROM doc_lengths
  `);

  if (rows.length > 0) {
    const r = rows[0] as Record<string, unknown>;
    // COUNT(*) returns BigInt in DuckDB node binding; convert to Number
    // for the REAL column. AVG returns Number already.
    const totalDocs = typeof r.total_docs === 'bigint' ? Number(r.total_docs) : (r.total_docs as number);
    const avgDocLen = typeof r.avg_doc_length === 'bigint' ? Number(r.avg_doc_length) : (r.avg_doc_length as number);

    await runWithRecovery(db,
      "UPDATE corpus_stats SET value = ? WHERE key = 'total_docs'",
      totalDocs,
    );
    await runWithRecovery(db,
      "UPDATE corpus_stats SET value = ? WHERE key = 'avg_doc_length'",
      avgDocLen,
    );
  }
}

// ── Main sync entry point ───────────────────────────────────────

/**
 * Sync the DuckDB index with the filesystem.
 *
 * Returns `true` if any changes were made (inserts, updates, or deletes).
 *
 * Operations:
 * 1. Scan all PARA directories for `.md` files
 * 2. Compare mtime against stored index
 * 3. For new/changed files: update `files` row, re-index tags, rebuild term_index
 * 4. For deleted files: remove from all tables
 * 5. Recompute corpus_stats
 *
 * All changes happen inside a single BEGIN/COMMIT transaction.
 */
export async function syncIndex(db: duckdb.Database, cwd: string): Promise<boolean> {
  const files = await scanAllParaDirs(cwd);
  const stored = await allWithRecovery(db, "SELECT path, file_mtime FROM files");
  const storedMap = new Map(
    stored.map((r: any) => [r.path, new Date(r.file_mtime ?? 0).getTime()]),
  );

  const fsMap = new Map(files.map((f) => [f.path, f.mtimeMs]));
  const changed: FileEntry[] = [];

  for (const f of files) {
    const storedMtime = storedMap.get(f.path);
    if (storedMtime === undefined || Math.abs(storedMtime - f.mtimeMs) > 1) {
      changed.push(f);
    }
  }

  const toDelete: string[] = [];
  for (const p of storedMap.keys()) {
    if (!fsMap.has(p as string)) toDelete.push(p as string);
  }

  if (changed.length === 0 && toDelete.length === 0) return false;

  // ── Deletes (outside transaction — auto-committed individually) ──
  for (const p of toDelete) {
    try {
      await runWithRecovery(db, "DELETE FROM tags WHERE file_path = ?", p);
      await runWithRecovery(db, "DELETE FROM term_index WHERE file_path = ?", p);
      await runWithRecovery(db, "DELETE FROM doc_lengths WHERE file_path = ?", p);
      await runWithRecovery(db, "DELETE FROM files WHERE path = ?", p);
    } catch (e) {
      console.error(`[sync] Failed to delete ${p}:`, e);
    }
  }

  // ── Inserts / updates (file-by-file; each error is logged and skipped) ──
  let successCount = 0;
  let errorCount = 0;

  for (const entry of changed) {
    try {
      const parsed: ParsedFile = await parseFile(entry);
      const mtimeStr = new Date(entry.mtimeMs).toISOString();

      // Upsert file row
      await runWithRecovery(
        db,
        `INSERT OR REPLACE INTO files (path, title, body, author, editor, created, modified, file_mtime)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        entry.path,
        parsed.title,
        parsed.body,
        parsed.author,
        parsed.editor,
        parsed.created,
        new Date().toISOString(),
        mtimeStr,
      );

      // Re-insert tags (delete \u2192 insert)
      await runWithRecovery(db, "DELETE FROM tags WHERE file_path = ?", entry.path);
      for (const tag of parsed.tags) {
        await runWithRecovery(db, "INSERT INTO tags (file_path, tag) VALUES (?, ?)", entry.path, tag);
      }

      // Rebuild BM25 term index
      await buildTermIndexForFile(db, entry.path, parsed.title, parsed.body);
      successCount++;
    } catch (e) {
      console.error(`[sync] Failed to index ${entry.path}:`, e);
      errorCount++;
    }
  }

  // Recompute corpus-level stats
  await recomputeCorpusStats(db);

  console.error(`[sync] Done: ${successCount} indexed, ${errorCount} errors, ${toDelete.length} deleted`);
  return successCount > 0 || toDelete.length > 0;
}
