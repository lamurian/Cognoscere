/**
 * DuckDB lock and recovery helpers.
 * Extracted from db.ts to keep each file under 300 lines.
 */

import type duckdb from "duckdb";
import { TX_ABORTED_MSG } from "./types.js";

/** Sleep for ms. */
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Typed DuckDB query helper. Isolates `as any[]` casting in one place.
 * All callers get proper return types without explicit casts.
 */
export async function queryRows<T = Record<string, unknown>>(
  db: duckdb.Database,
  sql: string,
  ...params: unknown[]
): Promise<T[]> {
  const rows = await allWithRecovery(db, sql, ...params);
  return rows as unknown as T[];
}

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
      (db.run as unknown as (...args: unknown[]) => void)("ROLLBACK", (err: Error | null) => {
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
      (db.run as unknown as (...args: unknown[]) => void)(sql, ...params, (err: Error | null) => {
        if (err) reject(err);
        else resolve();
      });
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes(TX_ABORTED_MSG)) {
      await healAbortedTx(db);
      await new Promise<void>((resolve, reject) => {
        (db.run as unknown as (...args: unknown[]) => void)(sql, ...params, (err: Error | null) => {
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
      (db.all as unknown as (...args: unknown[]) => void)(
        sql,
        ...params,
        (err: Error | null, rows: Record<string, unknown>[]) => {
          if (err) reject(err);
          else resolve(rows);
        },
      );
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes(TX_ABORTED_MSG)) {
      await healAbortedTx(db);
      return await new Promise<Record<string, unknown>[]>((resolve, reject) => {
        (db.all as unknown as (...args: unknown[]) => void)(
          sql,
          ...params,
          (err: Error | null, rows: Record<string, unknown>[]) => {
            if (err) reject(err);
            else resolve(rows);
          },
        );
      });
    }
    throw e;
  }
}

export { sleep };
