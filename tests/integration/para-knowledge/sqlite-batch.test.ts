/**
 * Integration tests for batch-create ported to SQLite.
 *
 * Verifies that findRelated (BM25 semantic search for auto-linking)
 * works correctly with the SQLite FTS5 backend, and that appendLinks
 * remains functional (it doesn't depend on the database engine).
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { mkdir, rm, writeFile, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createDb, initDb, indexFile } from "../../../.pi/extensions/para-knowledge/db-sqlite.js";
import { findRelated, appendLinks } from "../../../.pi/extensions/batch-create/search.js";

const TEST_DIR = "/dev/shm/batch-test";
const DB_PATH = resolve(TEST_DIR, "notes.db");

async function cleanTestDir(): Promise<void> {
  await rm(TEST_DIR, { recursive: true, force: true });
  await mkdir(TEST_DIR, { recursive: true });
}

describe("SQLite batch-create integration", () => {
  beforeAll(async () => {
    await cleanTestDir();
  });

  afterAll(async () => {
    await rm(TEST_DIR, { recursive: true, force: true });
  });

  it("findRelated returns related documents using FTS5 BM25", async () => {
    const db = createDb(DB_PATH);
    initDb(db);

    // Index three related documents
    indexFile(db, {
      path: "Resources/machine-learning-intro.md",
      title: "Introduction to Machine Learning",
      body: "Machine learning is a subset of artificial intelligence that enables systems to learn from data without explicit programming.",
      tags: ["machine-learning", "AI", "tutorial"],
      author: "pi",
      editor: "lam",
      created: "2024-01-01T00:00:00.000Z",
      modified: "2024-01-01T00:00:00.000Z",
      file_mtime: "2024-01-01T00:00:00.000Z",
      source_url: null,
    });

    indexFile(db, {
      path: "Resources/deep-learning-basics.md",
      title: "Deep Learning Basics",
      body: "Deep learning uses neural networks with multiple layers. It is a subfield of machine learning and artificial intelligence.",
      tags: ["deep-learning", "neural-networks", "AI"],
      author: "pi",
      editor: "lam",
      created: "2024-01-02T00:00:00.000Z",
      modified: "2024-01-02T00:00:00.000Z",
      file_mtime: "2024-01-02T00:00:00.000Z",
      source_url: null,
    });

    indexFile(db, {
      path: "Resources/statistical-analysis.md",
      title: "Statistical Analysis",
      body: "Statistical analysis involves hypothesis testing and regression methods for data science research.",
      tags: ["statistics", "research", "data-science"],
      author: "pi",
      editor: "lam",
      created: "2024-01-03T00:00:00.000Z",
      modified: "2024-01-03T00:00:00.000Z",
      file_mtime: "2024-01-03T00:00:00.000Z",
      source_url: null,
    });

    // findRelated for the ML doc should return DL (similar topic) before statistics
    const mlRelated = await findRelated(db, "Resources/machine-learning-intro.md", "Introduction to Machine Learning", ["machine-learning", "AI", "tutorial"], 5);
    expect(mlRelated.length).toBeGreaterThan(0);
    expect(mlRelated[0]).toBe("Resources/deep-learning-basics.md");
    expect(mlRelated.includes("Resources/statistical-analysis.md")).toBe(false); // Less related

    // findRelated for the statistics doc should return DL or ML (both mention data)
    const statsRelated = await findRelated(db, "Resources/statistical-analysis.md", "Statistical Analysis", ["statistics", "research", "data-science"], 5);
    expect(statsRelated.length).toBeGreaterThan(0);

    db.close();
  });

  it("findRelated excludes the source document itself", async () => {
    const db = createDb(DB_PATH);
    initDb(db);

    // Only one document indexed — findRelated should return nothing
    const results = await findRelated(db, "Resources/machine-learning-intro.md", "Introduction to Machine Learning", ["machine-learning", "AI", "tutorial"], 5);
    expect(results.some((r) => r === "Resources/machine-learning-intro.md")).toBe(false);

    db.close();
  });

  it("appendLinks adds [[wikilinks]] to a markdown file", async () => {
    const filePath = resolve(TEST_DIR, "test-doc.md");
    await writeFile(filePath, [
      "---",
      "title: Test Document",
      "tags: [test]",
      "---",
      "",
      "This is a test document.",
    ].join("\n"), "utf-8");

    await appendLinks(filePath, ["Resources/deep-learning-basics.md", "Resources/machine-learning-intro.md"]);

    const content = await readFile(filePath, "utf-8");
    expect(content).toContain("[[deep-learning-basics]]");
    expect(content).toContain("[[machine-learning-intro]]");
    expect(content).toContain("## Relevant notes");
  });

  it("appendLinks appends to an existing Relevant notes section", async () => {
    const filePath = resolve(TEST_DIR, "test-doc-existing.md");
    await writeFile(filePath, [
      "---",
      "title: Test Document",
      "tags: [test]",
      "---",
      "",
      "Content here.",
      "",
      "## Relevant notes",
      "",
      "- [[existing-link]]",
    ].join("\n"), "utf-8");

    await appendLinks(filePath, ["Resources/new-link.md"]);

    const content = await readFile(filePath, "utf-8");
    // Should keep existing link and add new one
    expect(content).toContain("[[existing-link]]");
    expect(content).toContain("[[new-link]]");
  });
});
