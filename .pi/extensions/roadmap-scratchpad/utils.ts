/**
 * Utility functions for FAQ scratchpad YAML frontmatter,
 * file path helpers, JSON serialisation, and merge logic.
 */

import type { ScratchpadData, ScratchpadUpdate } from "./types.js";
import { slugify } from "../_common/slug.js";
import { formatFrontmatter } from "../_common/yaml.js";

/** Build the full scratchpad markdown content (frontmatter + JSON body). */
export function buildScratchpadFile(data: ScratchpadData): string {
  const title = `Scratchpad: ${data.name}`;
  const tags = ["scratchpad", "roadmap", slugify(data.name)];

  const frontmatterFields: Record<string, unknown> = {
    title,
    description: data.description.slice(0, 200),
    author: "pi",
    editor: "lam",
    date: new Date().toISOString(),
    tags,
  };
  const fm = formatFrontmatter(frontmatterFields);
  const json = JSON.stringify(data, null, 2);
  return fm + "\n```json\n" + json + "\n```\n";
}

/** Parse scratchpad JSON from a markdown body (code block or raw JSON). */
export function parseScratchpadBody(body: string): ScratchpadData | null {
  const codeBlockMatch = body.match(/```(?:json)?\s*\n([\s\S]*?)```/);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1]) as ScratchpadData;
    } catch {
      /* fall through */
    }
  }

  try {
    return JSON.parse(body.trim()) as ScratchpadData;
  } catch {
    return null;
  }
}

/** Deep partial merge: existing fields stay unless overridden. */
export function mergeData(existing: ScratchpadData, partial: ScratchpadUpdate): ScratchpadData {
  return {
    name: partial.name ?? existing.name,
    description: partial.description ?? existing.description,
    steps: partial.steps ?? existing.steps,
    questions: partial.questions ?? existing.questions,
    searchResults: partial.searchResults ?? existing.searchResults,
    milestones: partial.milestones ?? existing.milestones,
  };
}

/** Relative path for a scratchpad file. */
export function scratchpadRelPath(name: string): string {
  const slug = slugify(name);
  return `Areas/_scratchpad-${slug}.md`;
}

/** Absolute path for a scratchpad file. */
export function scratchpadAbsPath(cwd: string, name: string): string {
  return `${cwd}/${scratchpadRelPath(name)}`;
}
