/**
 * DuckDB interaction helpers for roadmap scratchpad lifecycle.
 */

import { slugify } from "../_common/slug.js";
import { openDb, initDb, indexScratchpad, deleteFromIndex, recomputeStats } from "./db.js";

/** Create or re-register a scratchpad in the DuckDB index. */
export async function registerInDb(
  cwd: string,
  relPath: string,
  name: string,
  content: string,
): Promise<boolean> {
  try {
    const db = openDb(cwd);
    await initDb(db);
    await indexScratchpad(db, relPath, `Scratchpad: ${name}`, content, [
      "scratchpad",
      "roadmap",
      slugify(name),
    ]);
    await recomputeStats(db);
    db.close();
    return true;
  } catch (e: unknown) {
    console.error("[roadmap-scratchpad] DuckDB error:", e instanceof Error ? e.message : String(e));
    return false;
  }
}

/** Update a scratchpad's DuckDB index entry. */
export async function updateDbIndex(
  cwd: string,
  relPath: string,
  name: string,
  content: string,
): Promise<boolean> {
  try {
    const db = openDb(cwd);
    await initDb(db);
    await indexScratchpad(db, relPath, `Scratchpad: ${name}`, content, [
      "scratchpad",
      "roadmap",
      slugify(name),
    ]);
    await recomputeStats(db);
    db.close();
    return true;
  } catch (e: unknown) {
    console.error(
      "[roadmap-scratchpad] update: DuckDB error:",
      e instanceof Error ? e.message : String(e),
    );
    return false;
  }
}

/** Remove a scratchpad from the DuckDB index. */
export async function deleteFromDb(
  cwd: string,
  relPath: string,
): Promise<{ ok: boolean; error: string | null }> {
  try {
    const db = openDb(cwd);
    await initDb(db);
    await deleteFromIndex(db, relPath);
    await recomputeStats(db);
    db.close();
    return { ok: true, error: null };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message.slice(0, 200) : String(e).slice(0, 200);
    console.error("[roadmap-scratchpad] delete: DuckDB error:", msg);
    return { ok: false, error: msg };
  }
}
