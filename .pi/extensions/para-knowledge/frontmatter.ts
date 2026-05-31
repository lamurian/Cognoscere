/**
 * YAML frontmatter parsing and formatting for PARA markdown files.
 */

import type { Frontmatter } from "./types.js";

/**
 * Parse YAML frontmatter from a markdown file's raw content.
 * Returns default values (empty tags) when no frontmatter is found.
 */
export function parseFrontmatter(content: string): Frontmatter {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { tags: [] };

  const result: Record<string, unknown> = {};
  const tags: string[] = [];

  for (const line of match[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)/);
    if (kv) {
      const val = kv[2].trim();
      if (val && !val.startsWith("-")) result[kv[1]] = val;
    }
    const li = line.match(/^\s*-\s+(.+)/);
    if (li) tags.push(li[1].trim());
  }
  result.tags = tags;
  return result as unknown as Frontmatter;
}

/**
 * Format a key-value map back into YAML frontmatter string.
 * Handles `tags` arrays specially (renders as a YAML list).
 */
export function formatFrontmatter(fm: Record<string, unknown>): string {
  let out = "---\n";
  for (const [k, v] of Object.entries(fm)) {
    if (k === "tags" && Array.isArray(v) && v.length) {
      out += "tags:\n";
      for (const t of v) out += `  - ${t}\n`;
    } else if (typeof v === "string") {
      out += `${k}: ${v}\n`;
    }
  }
  return out + "---\n";
}
