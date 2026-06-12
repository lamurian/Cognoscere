/**
 * Integration tests for roadmap-scratchpad helpers ported to SQLite.
 *
 * Verifies that registerInDb, updateDbIndex, and deleteFromDb work
 * correctly with the SQLite backend, making scratchpads searchable
 * via FTS5 and properly cleaned up on deletion.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdir, rm, writeFile, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { existsSync } from "node:fs";
import {
  registerInDb,
  updateDbIndex,
  deleteFromDb,
} from "../../../.pi/extensions/roadmap-scratchpad/helpers.js";
import { createDb, initDb, searchDocs } from "../../../.pi/extensions/para-knowledge/db-sqlite.js";

const TEST_DIR = "/dev/shm/scratchpad-test";
const DB_PATH = resolve(TEST_DIR, "notes.db");

const SAMPLE_CONTENT = [
  "---",
  "title: Scratchpad: test-topic",
  "tags: [scratchpad, roadmap, test-topic]",
  "---",
  '{"name":"test-topic","description":"A test","steps":[{"id":1,"title":"Step 1","done":false}],"questions":[],"searchResults":[],"milestones":[]}',
].join("\n");

async function cleanTestDir(): Promise<void> {
  await rm(TEST_DIR, { recursive: true, force: true });
  await mkdir(TEST_DIR, { recursive: true });
}

describe("SQLite scratchpad helpers", () => {
  beforeEach(async () => {
    await cleanTestDir();
  });

  afterEach(async () => {
    await rm(TEST_DIR, { recursive: true, force: true });
  });

  it("registerInDb creates a searchable scratchpad in SQLite", async () => {
    const result = await registerInDb(TEST_DIR, "Areas/_scratchpad-test-topic.md", "test-topic", SAMPLE_CONTENT);

    expect(result).toBe(true);

    // Verify the database file exists
    expect(existsSync(DB_PATH)).toBe(true);

    // Open the database and verify the scratchpad is searchable
    const db = createDb(DB_PATH);
    initDb(db);
    try {
      const results = searchDocs(db, "scratchpad");
      expect(results.length).toBeGreaterThan(0);
      const match = results.find((r) => r.path === "Areas/_scratchpad-test-topic.md");
      expect(match).toBeDefined();
      expect(match!.title).toBe("Scratchpad: test-topic");
      expect(match!.tags).toContain("scratchpad");

      // Verify tag-only search also works
      const tagResults = searchDocs(db, "", { tags: ["scratchpad"] });
      expect(tagResults.length).toBeGreaterThan(0);
      expect(tagResults.some((r) => r.path === "Areas/_scratchpad-test-topic.md")).toBe(true);
    } finally {
      db.close();
    }
  });

  it("updateDbIndex refreshes the searchable content", async () => {
    // First register
    await registerInDb(TEST_DIR, "Areas/_scratchpad-test-topic.md", "test-topic", SAMPLE_CONTENT);

    // Update with different content
    const updatedContent = SAMPLE_CONTENT.replace("A test", "Updated description");
    const result = await updateDbIndex(TEST_DIR, "Areas/_scratchpad-test-topic.md", "test-topic", updatedContent);
    expect(result).toBe(true);

    // Verify updated content is searchable via new text
    const db = createDb(DB_PATH);
    initDb(db);
    try {
      const results = searchDocs(db, "Updated");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.path === "Areas/_scratchpad-test-topic.md")).toBe(true);
    } finally {
      db.close();
    }
  });

  it("deleteFromDb removes the scratchpad from the index", async () => {
    // First register
    await registerInDb(TEST_DIR, "Areas/_scratchpad-test-topic.md", "test-topic", SAMPLE_CONTENT);

    // Then delete
    const result = await deleteFromDb(TEST_DIR, "Areas/_scratchpad-test-topic.md");
    expect(result.ok).toBe(true);
    expect(result.error).toBeNull();

    // Verify the scratchpad is no longer searchable
    const db = createDb(DB_PATH);
    initDb(db);
    try {
      const results = searchDocs(db, "scratchpad");
      expect(results.every((r) => r.path !== "Areas/_scratchpad-test-topic.md")).toBe(true);

      // Verify files table is clean
      const fileRow = db.prepare("SELECT path FROM files WHERE path = ?").get("Areas/_scratchpad-test-topic.md");
      expect(fileRow).toBeUndefined();

      // Verify tags table is clean
      const tagRows = db.prepare("SELECT tag FROM tags WHERE file_path = ?").all("Areas/_scratchpad-test-topic.md");
      expect(tagRows.length).toBe(0);
    } finally {
      db.close();
    }
  });

  it("deleteFromDb on non-existent path returns ok without error", async () => {
    const result = await deleteFromDb(TEST_DIR, "Areas/_scratchpad-nonexistent.md");
    expect(result.ok).toBe(true);
    expect(result.error).toBeNull();
  });

  it("three helpers work in sequence (register → update → delete → register)", async () => {
    // Register
    expect(await registerInDb(TEST_DIR, "Areas/_scratchpad-cycle.md", "cycle", "Cycle test")).toBe(true);

    // Verify searchable
    const db1 = createDb(DB_PATH);
    initDb(db1);
    expect(searchDocs(db1, "cycle").length).toBeGreaterThan(0);
    db1.close();

    // Update
    expect(await updateDbIndex(TEST_DIR, "Areas/_scratchpad-cycle.md", "cycle", "Cycle test updated")).toBe(true);

    // Delete
    const del = await deleteFromDb(TEST_DIR, "Areas/_scratchpad-cycle.md");
    expect(del.ok).toBe(true);

    // Verify gone
    const db2 = createDb(DB_PATH);
    initDb(db2);
    expect(searchDocs(db2, "cycle").length).toBe(0);
    db2.close();

    // Re-register
    expect(await registerInDb(TEST_DIR, "Areas/_scratchpad-cycle.md", "cycle", "Cycle test re-registered")).toBe(true);

    // Verify searchable again
    const db3 = createDb(DB_PATH);
    initDb(db3);
    expect(searchDocs(db3, "re-registered").length).toBeGreaterThan(0);
    db3.close();
  });
});
