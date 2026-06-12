/**
 * BM25 semantic search and [[wikilink]] appending for batch-created documents.
 *
 * DB operations delegate to para-knowledge/lock.ts (allWithRecovery)
 * for aborted-transaction recovery. tokenize comes from _common.
 */

import { readFile, writeFile } from "node:fs/promises";
import duckdb from "duckdb";
import { tokenize } from "../_common/tokenize.js";
import { allWithRecovery } from "../para-knowledge/lock.js";

/**
 * Find related documents via BM25 term overlap.
 * Returns up to `maxResults` paths sorted by relevance.
 */
export async function findRelated(
  db: duckdb.Database,
  relPath: string,
  title: string,
  tags: string[],
  maxResults: number,
): Promise<string[]> {
  const queryTerms = tokenize(title + " " + tags.join(" "));
  if (queryTerms.length === 0) return [];

  // Fetch all doc_lengths
  const allLengths = (await allWithRecovery(
    db,
    "SELECT file_path, doc_length FROM doc_lengths",
  )) as unknown as { file_path: string; doc_length: number }[];
  const lengthMap = new Map(allLengths.map((r) => [r.file_path, r.doc_length]));
  const totalDocs = allLengths.length;
  const avgDocLen = allLengths.reduce((s, r) => s + r.doc_length, 0) / Math.max(totalDocs, 1);

  // Get term_index rows for all query terms (Phase 2a: join through term_dict)
  const placeholders = queryTerms.map(() => "?").join(",");
  const indexRows = (await allWithRecovery(
    db,
    `SELECT t.term, ti.file_path, ti.tf
     FROM term_index ti
     JOIN term_dict t ON ti.term_id = t.term_id
     WHERE t.term IN (${placeholders}) AND ti.file_path != ?`,
    ...queryTerms,
    relPath,
  )) as unknown as { term: string; file_path: string; tf: number }[];

  // Compute document frequency per term
  const dfMap = new Map<string, number>();
  const seenForTerm = new Map<string, Set<string>>();
  for (const row of indexRows) {
    if (!seenForTerm.has(row.term)) seenForTerm.set(row.term, new Set());
    seenForTerm.get(row.term)!.add(row.file_path);
  }
  for (const [term, paths] of seenForTerm) dfMap.set(term, paths.size);

  // Score each candidate document
  const scores = new Map<string, number>();
  for (const row of indexRows) {
    const docLen = lengthMap.get(row.file_path) ?? avgDocLen;
    const df = dfMap.get(row.term) ?? 1;
    const k1 = 1.2,
      b = 0.75;
    const idf = Math.log(1 + (totalDocs - df + 0.5) / (df + 0.5));
    const tfNorm =
      (row.tf * (k1 + 1)) / (row.tf + k1 * (1 - b + b * (docLen / Math.max(avgDocLen, 1))));
    scores.set(row.file_path, (scores.get(row.file_path) ?? 0) + idf * tfNorm);
  }

  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxResults)
    .map(([path]) => path);
}

/**
 * Append [[wikilinks]] to a markdown file under a "## Relevant notes" section.
 */
export async function appendLinks(filePath: string, links: string[]): Promise<void> {
  if (links.length === 0) return;

  const content = await readFile(filePath, "utf-8");
  const body = content.replace(/^---\n[\s\S]*?\n---\n?/, "").trim();

  const newSlugs = links.map((p) => {
    const slug = p.replace(/\.md$/, "").split("/").pop() ?? "";
    return `[[${slug}]]`;
  });

  const hasSection = /^##\s+Relevant notes\s*$/m.test(body);

  let newBody: string;
  if (hasSection) {
    const lines = body.split("\n");
    const sectionIdx = lines.findIndex((l) => /^##\s+Relevant notes\s*$/.test(l));
    let insertIdx = sectionIdx + 1;
    while (insertIdx < lines.length && /^\s*[-*]\s/.test(lines[insertIdx])) insertIdx++;

    const existingLinks = new Set<string>();
    for (let i = sectionIdx + 1; i < lines.length; i++) {
      const m = lines[i].match(/\[\[([^\]]+)\]\]/);
      if (m) existingLinks.add(m[1]);
    }
    const toAdd = newSlugs.filter((s) => {
      const slugMatch = s.match(/\[\[([^\]]+)\]\]/);
      return slugMatch ? !existingLinks.has(slugMatch[1]) : true;
    });
    if (toAdd.length === 0) return;

    const indent =
      insertIdx > sectionIdx + 1 ? (lines[sectionIdx + 1].match(/^\s*/)?.[0] ?? "- ") : "- ";
    lines.splice(insertIdx, 0, ...toAdd.map((l) => `${indent}${l}`));
    newBody = lines.join("\n");
  } else {
    newBody = body + "\n\n## Relevant notes\n\n" + newSlugs.map((s) => `- ${s}`).join("\n");
  }

  const fmMatch = content.match(/^---\n[\s\S]*?\n---\n/);
  const frontmatter = fmMatch ? fmMatch[0] : "";
  await writeFile(filePath, frontmatter + newBody, "utf-8");
}
