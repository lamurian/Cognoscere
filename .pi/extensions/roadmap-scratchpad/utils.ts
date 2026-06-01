/**
 * Utility functions for FAQ scratchpad YAML frontmatter,
 * file path helpers, JSON serialisation, and merge logic.
 */

import type { ScratchpadData, ScratchpadUpdate } from "./types.js";

const FIELD_ORDER = ["title", "description", "author", "editor", "date", "tags", "source"] as const;

/** Slugify a title to a safe filename. */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Quote a YAML value if it contains special characters. */
export function yamlQuote(value: string): string {
  if (value.length === 0) return "''";
  if (/^[[\]{},&*!|>'"%@`#:?-\s]/.test(value)) return `'${value}'`;
  if (/: /.test(value) || / #/.test(value)) return `'${value}'`;
  if (/^(true|false|yes|no|on|off|null|undefined|~)$/i.test(value)) return `'${value}'`;
  if (/^\d+(\.\d+)?$/.test(value)) return `'${value}'`;
  return value;
}

/** Build standardised YAML frontmatter string. */
export function formatFrontmatter(fields: Record<string, unknown>): string {
  let out = "---\n";
  let sourceVal: string | undefined;
  if (typeof fields.source === "string" && fields.source) sourceVal = fields.source;
  else if (typeof fields.source_url === "string" && fields.source_url)
    sourceVal = fields.source_url;

  for (const key of FIELD_ORDER) {
    if (key === "tags") {
      const v = fields.tags;
      if (Array.isArray(v) && v.length > 0) {
        out += "tags:\n";
        for (const t of v) out += `  - ${yamlQuote(String(t))}\n`;
      }
    } else if (key === "source") {
      if (sourceVal) out += `source: ${yamlQuote(sourceVal)}\n`;
    } else {
      const v = fields[key];
      if (typeof v === "string" && v) out += `${key}: ${yamlQuote(v)}\n`;
    }
  }
  return out + "---\n";
}

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

/** Lightweight tokenizer for BM25 term extraction. */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1);
}
