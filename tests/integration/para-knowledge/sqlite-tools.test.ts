/**
 * Integration tests for para-knowledge tools ported to SQLite.
 *
 * Tests that the database operations performed by tools work correctly.
 * Each tool's core logic is tested through the underlying SQLite functions.
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { createDb, initDb, indexFile, searchDocs } from "../../../.pi/extensions/para-knowledge/db-sqlite.js";

const TEST_DIR = "/dev/shm/tools-test";
const DB_PATH = resolve(TEST_DIR, "notes.db");

describe("SQLite para-knowledge tools", () => {
  let dbPathIndex = 0;

  /** Create a fresh database path for each test to avoid cross-contamination. */
  function freshDbPath(): string {
    dbPathIndex++;
    return resolve(TEST_DIR, `notes-${dbPathIndex}.db`);
  }

  beforeAll(async () => {
    await rm(TEST_DIR, { recursive: true, force: true });
    await mkdir(TEST_DIR, { recursive: true });
  });

  afterAll(async () => {
    await rm(TEST_DIR, { recursive: true, force: true });
  });

  it("searchDocs returns correct results matching the tool's behavior", async () => {
    const dbPath = freshDbPath();
    const db = createDb(dbPath);
    initDb(db);
    indexFile(db, {
      path: "Resources/doc1.md",
      title: "Machine Learning",
      body: "Content about machine learning and AI.",
      tags: ["machine-learning", "AI"],
      author: "pi",
      editor: "lam",
      created: "2024-01-01T00:00:00.000Z",
      modified: "2024-01-01T00:00:00.000Z",
      file_mtime: "2024-01-01T00:00:00.000Z",
      source_url: null,
    });
    indexFile(db, {
      path: "Resources/doc2.md",
      title: "Statistics",
      body: "Content about statistics and research methods.",
      tags: ["statistics", "research"],
      author: "pi",
      editor: "lam",
      created: "2024-01-01T00:00:00.000Z",
      modified: "2024-01-01T00:00:00.000Z",
      file_mtime: "2024-01-01T00:00:00.000Z",
      source_url: null,
    });

    const mlResults = searchDocs(db, "machine");
    expect(mlResults.length).toBe(1);
    expect(mlResults[0].path).toBe("Resources/doc1.md");

    const statsResults = searchDocs(db, "", { tags: ["statistics"] });
    expect(statsResults.length).toBe(1);
    expect(statsResults[0].path).toBe("Resources/doc2.md");

    const tagRows = db.prepare("SELECT DISTINCT tag FROM tags ORDER BY tag")
      .all<{ tag: string }>();
    expect(tagRows.map((r) => r.tag)).toEqual(["AI", "machine-learning", "research", "statistics"]);

    db.close();
  });

  it("createDoc equivalent via indexFile creates searchable content", async () => {
    const dbPath = freshDbPath();
    const db = createDb(dbPath);
    initDb(db);
    indexFile(db, {
      path: "Projects/my-project.md",
      title: "My Project",
      body: "Project description and goals for 2024.",
      tags: ["project", "goals"],
      author: "pi",
      editor: "lam",
      created: "2024-06-01T00:00:00.000Z",
      modified: "2024-06-01T00:00:00.000Z",
      file_mtime: "2024-06-01T00:00:00.000Z",
      source_url: null,
    });

    const results = searchDocs(db, "project goals");
    expect(results.some((r) => r.path === "Projects/my-project.md")).toBe(true);
    db.close();
  });

  it("updateDoc equivalent via indexFile overwrites existing content", async () => {
    const dbPath = freshDbPath();
    const db = createDb(dbPath);
    initDb(db);
    indexFile(db, {
      path: "Resources/updatable.md",
      title: "Original Title",
      body: "Original content.",
      tags: ["original"],
      author: "pi",
      editor: "lam",
      created: "2024-01-01T00:00:00.000Z",
      modified: "2024-01-01T00:00:00.000Z",
      file_mtime: "2024-01-01T00:00:00.000Z",
      source_url: null,
    });

    indexFile(db, {
      path: "Resources/updatable.md",
      title: "Updated Title",
      body: "Updated content with new information.",
      tags: ["updated"],
      author: "pi",
      editor: "lam",
      created: "2024-01-01T00:00:00.000Z",
      modified: "2024-06-01T00:00:00.000Z",
      file_mtime: "2024-06-01T00:00:00.000Z",
      source_url: null,
    });

    expect(searchDocs(db, "original").length).toBe(0);
    expect(searchDocs(db, "updated").length).toBeGreaterThan(0);
    const tags = db.prepare("SELECT tag FROM tags").all<{ tag: string }>().map((r) => r.tag);
    expect(tags).not.toContain("original");
    expect(tags).toContain("updated");

    db.close();
  });
});
