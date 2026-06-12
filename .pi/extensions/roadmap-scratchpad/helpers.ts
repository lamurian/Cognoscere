/**
 * SQLite interaction helpers for roadmap scratchpad lifecycle.
 *
 * Replaces the DuckDB-based helpers with synchronous SQLite calls
 * via db-sqlite.ts. Each helper opens a connection, performs the
 * operation, and closes it — consistent with the ephemeral-connection
 * pattern of the original DuckDB implementation but without the
 * async callback overhead.
 */

import { slugify } from "../_common/slug.js";
import { dbPath, openScratchpadDb, indexScratchpad, deleteFromIndex } from "./db.js";

/** Create or re-register a scratchpad in the SQLite index. */
export async function registerInDb(
  cwd: string,
  relPath: string,
  name: string,
  content: string,
): Promise<boolean> {
  try {
    const db = openScratchpadDb(cwd);
    indexScratchpad(db, relPath, `Scratchpad: ${name}`, content, [
      "scratchpad",
      "roadmap",
      slugify(name),
    ]);
    db.close();
    return true;
  } catch (e: unknown) {
    console.error("[roadmap-scratchpad] SQLite error:", e instanceof Error ? e.message : String(e));
    return false;
  }
}

/** Update a scratchpad's SQLite index entry. */
export async function updateDbIndex(
  cwd: string,
  relPath: string,
  name: string,
  content: string,
): Promise<boolean> {
  try {
    const db = openScratchpadDb(cwd);
    indexScratchpad(db, relPath, `Scratchpad: ${name}`, content, [
      "scratchpad",
      "roadmap",
      slugify(name),
    ]);
    db.close();
    return true;
  } catch (e: unknown) {
    console.error(
      "[roadmap-scratchpad] update: SQLite error:",
      e instanceof Error ? e.message : String(e),
    );
    return false;
  }
}

/** Remove a scratchpad from the SQLite index. */
export async function deleteFromDb(
  cwd: string,
  relPath: string,
): Promise<{ ok: boolean; error: string | null }> {
  try {
    const db = openScratchpadDb(cwd);
    deleteFromIndex(db, relPath);
    db.close();
    return { ok: true, error: null };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message.slice(0, 200) : String(e).slice(0, 200);
    console.error("[roadmap-scratchpad] delete: SQLite error:", msg);
    return { ok: false, error: msg };
  }
}
