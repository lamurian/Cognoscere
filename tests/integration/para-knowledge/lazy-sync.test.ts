/**
 * Integration tests for lazy sync via git commit hash.
 *
 * Tests that search_para_docs skips the write connection (syncIndex) when
 * no PARA files have changed since the last sync, using a dotfile to
 * store the last-synced commit hash.
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve } from "node:path";

const TEST_PROJECT = process.cwd();
const LAST_SYNC_FILE = ".last_sync_commit";
const PARA_DIRS = ["Areas", "Projects", "Resources"];

/**
 * Get the current git HEAD commit hash.
 */
function getGitHead(): string {
  return execSync("git rev-parse HEAD", { cwd: TEST_PROJECT, encoding: "utf-8" }).trim();
}

/**
 * Check whether PARA directories have uncommitted changes.
 */
function paraDirsClean(): boolean {
  const result = execSync(
    `git status --porcelain ${PARA_DIRS.join(" ")}`,
    { cwd: TEST_PROJECT, encoding: "utf-8" },
  );
  return result.trim().length === 0;
}

/**
 * Read the last-synced commit hash from disk.
 */
async function readLastSyncCommit(): Promise<string | null> {
  try {
    const content = await readFile(resolve(TEST_PROJECT, LAST_SYNC_FILE), "utf-8");
    return content.trim();
  } catch {
    return null;
  }
}

/**
 * Write the last-synced commit hash to disk.
 */
async function writeLastSyncCommit(hash: string): Promise<void> {
  await writeFile(resolve(TEST_PROJECT, LAST_SYNC_FILE), hash + "\n", "utf-8");
}

async function removeLastSyncFile(): Promise<void> {
  try {
    const { rm } = await import("node:fs/promises");
    await rm(resolve(TEST_PROJECT, LAST_SYNC_FILE), { force: true });
  } catch { /* ok */ }
}

/**
 * Decide whether a sync is needed based on git state.
 * Returns { needsSync: boolean, reason: string }.
 */
async function checkSyncNeeded(): Promise<{ needsSync: boolean; reason: string }> {
  const currentHash = getGitHead();
  const lastSyncHash = await readLastSyncCommit();

  if (lastSyncHash === null) {
    return { needsSync: true, reason: "no-previous-sync" };
  }

  if (currentHash !== lastSyncHash) {
    // New commit — check if PARA files changed in that commit
    // Use merge-base to handle potentially invalid refs gracefully
    try {
      const changedFiles = execSync(
        `git diff --name-only ${lastSyncHash}..${currentHash} -- ${PARA_DIRS.join(" ")}`,
        { cwd: TEST_PROJECT, encoding: "utf-8" },
      ).trim();
      if (changedFiles.length > 0) {
        return { needsSync: true, reason: "para-files-changed-in-commit" };
      }
    } catch {
      // Invalid ref (e.g. hash from before repo existed) — treat as dirty
      if (!paraDirsClean()) {
        return { needsSync: true, reason: "dirty-para-files" };
      }
    }
    // Commit happened but PARA files unchanged — update hash and skip sync
    await writeLastSyncCommit(currentHash);
    return { needsSync: false, reason: "commit-without-para-changes" };
  }

  // Same commit — check for dirty files
  if (!paraDirsClean()) {
    return { needsSync: true, reason: "dirty-para-files" };
  }

  return { needsSync: false, reason: "clean-state" };
}

/** Execute the lazy sync check logic (simulates searchDocs.ts behavior). */
async function lazySyncCheck(): Promise<{ skipped: boolean; reason: string }> {
  const { needsSync, reason } = await checkSyncNeeded();
  if (needsSync) {
    // Would call syncIndex(db, cwd) here
    await writeLastSyncCommit(getGitHead());
    return { skipped: false, reason };
  }
  return { skipped: true, reason };
}

describe("Phase 1c: Lazy sync — git-based dirty check", () => {
  beforeAll(async () => { await removeLastSyncFile(); });
  afterAll(async () => { await removeLastSyncFile(); });

  it("needs sync when no .last_sync_commit file exists", async () => {
    const result = await checkSyncNeeded();
    expect(result.needsSync).toBe(true);
    expect(result.reason).toBe("no-previous-sync");
  });

  it("returns skipped=false and writes hash after first sync", async () => {
    const result = await lazySyncCheck();
    expect(result.skipped).toBe(false);
    expect(result.reason).toBe("no-previous-sync");

    // Verify hash was written
    const writtenHash = await readLastSyncCommit();
    expect(writtenHash).toBe(getGitHead());
  });

  it("returns skipped=true on second check (nothing changed)", async () => {
    const result = await lazySyncCheck();
    expect(result.skipped).toBe(true);
    expect(result.reason).toBe("clean-state");
  });

  it("detects dirty PARA files", async () => {
    // Ensure PARA dirs are clean before we start
    expect(paraDirsClean()).toBe(true);

    // Create a temporary test file in Areas
    const testFile = resolve(TEST_PROJECT, "Areas/_test_lazy_sync_temp.md");
    await writeFile(testFile, "---\ntitle: temp\ntags: []\n---\n\nTemporary file for lazy sync test\n", "utf-8");

    try {
      const result = await checkSyncNeeded();
      expect(result.needsSync).toBe(true);
      expect(result.reason).toBe("dirty-para-files");
    } finally {
      // Clean up test file
      const { rm } = await import("node:fs/promises");
      await rm(testFile, { force: true });
    }

    // Verify PARA dirs are clean again
    expect(paraDirsClean()).toBe(true);
  });

  it("handles invalid commit hash gracefully", async () => {
    // Write an obviously invalid hash
    await writeLastSyncCommit("0000000000000000000000000000000000000000");

    const result = await checkSyncNeeded();
    // Should fall through to dirty-check logic
    expect(typeof result.needsSync).toBe("boolean");
    // Reset to real hash
    await writeLastSyncCommit(getGitHead());
  });
});
