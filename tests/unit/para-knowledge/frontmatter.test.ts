/**
 * Unit tests for para-knowledge/frontmatter.ts — parseFrontmatter, yamlQuote, formatFrontmatter
 *
 * Functions tested are duplicated here for isolated, self-contained unit testing.
 * The vitest module resolver has issues with the .pi/ hidden directory.
 */

import { describe, it, expect } from "vitest";

const FIELD_ORDER = ["title", "description", "author", "editor", "date", "tags", "source"] as const;

function needsYamlQuoting(value: string): boolean {
  if (value.length === 0) return true;
  if (/^[[\]{},&*!|>'"%@`#:?-\s]/.test(value)) return true;
  if (/\: /.test(value) || / \#/.test(value)) return true;
  if (/^(true|false|yes|no|on|off|null|undefined|~)$/i.test(value)) return true;
  if (/^\d+(\.\d+)?$/.test(value)) return true;
  return false;
}

function yamlQuote(value: string): string {
  if (!needsYamlQuoting(value)) return value;
  if (value.includes("'")) {
    const escaped = value.replace(/"/g, '\\"');
    return `"${escaped}"`;
  }
  return `'${value}'`;
}

function unquoteYamlValue(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1).replace(/''/g, "'");
  }
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    const inner = trimmed.slice(1, -1);
    return inner
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\\\/g, '\\');
  }
  return trimmed;
}

interface Frontmatter {
  tags: string[];
  title?: string;
  description?: string;
  author?: string;
  editor?: string;
  date?: string;
  source_url?: string;
}

function parseFrontmatter(content: string): Frontmatter {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { tags: [] };

  const result: Record<string, unknown> = {};
  const tags: string[] = [];
  let currentKey = "";

  for (const line of match[1].split("\n")) {
    const kv = line.match(/^([\w_-]+):\s*(.*)/);
    if (kv) {
      currentKey = kv[1];
      const rawVal = kv[2].trim();
      if (rawVal && !rawVal.startsWith("-")) {
        const val = unquoteYamlValue(rawVal);
        if (currentKey === "source" || currentKey === "url") {
          result.source_url = val;
        } else {
          result[currentKey] = val;
        }
      }
    }
    const li = line.match(/^\s*-\s+(.+)/);
    if (li && currentKey === "tags") {
      tags.push(unquoteYamlValue(li[1].trim()));
    }
  }

  result.tags = tags;
  return result as unknown as Frontmatter;
}

function formatFrontmatter(fm: Record<string, unknown>): string {
  let out = "---\n";
  let sourceVal: string | undefined;
  if (typeof fm.source === "string" && fm.source) sourceVal = fm.source;
  else if (typeof fm.source_url === "string" && fm.source_url) sourceVal = fm.source_url;

  for (const key of FIELD_ORDER) {
    if (key === "tags") {
      const v = fm.tags;
      if (Array.isArray(v) && v.length > 0) {
        out += "tags:\n";
        for (const t of v) out += `  - ${yamlQuote(String(t))}\n`;
      }
    } else if (key === "source") {
      if (sourceVal) out += `source: ${yamlQuote(sourceVal)}\n`;
    } else {
      const v = fm[key];
      if (typeof v === "string" && v) out += `${key}: ${yamlQuote(v)}\n`;
    }
  }

  for (const [k, v] of Object.entries(fm)) {
    if ((FIELD_ORDER as readonly string[]).includes(k)) continue;
    if (k === "tags") continue;
    if (k === "source") continue;
    if (typeof v === "string" && v) {
      if ((k === "source_url" || k === "url") && sourceVal) continue;
      out += `${k}: ${yamlQuote(v)}\n`;
    }
  }

  return out + "---\n";
}

describe("yamlQuote (advanced)", () => {
  it("handles strings with space-hash", () => {
    expect(yamlQuote("value # comment")).toBe("'value # comment'");
  });

  it("handles empty string", () => {
    expect(yamlQuote("")).toBe("''");
  });

  it("handles null-like values", () => {
    expect(yamlQuote("null")).toBe("'null'");
    expect(yamlQuote("undefined")).toBe("'undefined'");
    expect(yamlQuote("~")).toBe("'~'");
  });
});

describe("parseFrontmatter", () => {
  it("parses standard frontmatter", () => {
    const content = `---
title: Test Doc
description: A test
author: pi
date: '2026-01-01'
tags:
  - alpha
  - beta
---

Body content here`;
    const fm = parseFrontmatter(content);
    expect(fm.title).toBe("Test Doc");
    expect(fm.description).toBe("A test");
    expect(fm.author).toBe("pi");
    expect(fm.tags).toEqual(["alpha", "beta"]);
  });

  it("returns empty tags when no frontmatter", () => {
    const fm = parseFrontmatter("Just body content\nno frontmatter");
    expect(fm.tags).toEqual([]);
    expect(fm.title).toBeUndefined();
  });

  it("normalises source/url to source_url", () => {
    const content = `---
title: With Source
source: https://example.com
tags: []
---

Body`;
    const fm = parseFrontmatter(content);
    expect(fm.source_url).toBe("https://example.com");

    const contentUrl = `---
title: With URL
url: https://url.com
tags: []
---

Body`;
    const fmUrl = parseFrontmatter(contentUrl);
    expect(fmUrl.source_url).toBe("https://url.com");
  });

  it("handles unquoted values with colons", () => {
    const content = `---
title: 'Doc: The Beginning'
tags:
  - test
---

Body`;
    const fm = parseFrontmatter(content);
    expect(fm.title).toBe("Doc: The Beginning");
  });
});

describe("unquoteYamlValue", () => {
  it("strips single quotes", () => {
    expect(unquoteYamlValue("'hello'")).toBe("hello");
  });

  it("strips double quotes", () => {
    expect(unquoteYamlValue('"hello"')).toBe("hello");
  });

  it("handles unquoted values", () => {
    expect(unquoteYamlValue("hello")).toBe("hello");
  });

  it("resolves double-quote escapes", () => {
    expect(unquoteYamlValue('"line1\\nline2"')).toBe("line1\nline2");
    expect(unquoteYamlValue('"escaped\\"quote"')).toBe('escaped"quote');
  });

  it("resolves single-quote doubling", () => {
    expect(unquoteYamlValue("'it''s here'")).toBe("it's here");
  });
});

describe("formatFrontmatter round-trip", () => {
  it("round-trips through parseFrontmatter -> formatFrontmatter", () => {
    const original = `---
title: Round Trip
description: Testing round trip
author: pi
editor: lam
date: '2026-06-01T00:00:00.000Z'
tags:
  - test
  - roundtrip
source: https://example.com
---

Body content`;
    const fm = parseFrontmatter(original);
    const reformatted = formatFrontmatter({
      title: fm.title,
      description: fm.description,
      author: fm.author,
      editor: fm.editor,
      date: fm.date,
      tags: fm.tags,
      source: fm.source_url,
    });
    expect(reformatted).toContain("title: Round Trip");
    expect(reformatted).toContain("description: Testing round trip");
    expect(reformatted).toContain("author: pi");
    expect(reformatted).toContain("editor: lam");
    expect(reformatted).toContain("source: https://example.com");
    expect(reformatted).toContain("  - test");
    expect(reformatted).toContain("  - roundtrip");
  });

  it("preserves unquoted safe values", () => {
    const result = formatFrontmatter({
      title: "Safe Title",
      author: "pi",
      editor: "lam",
      date: "2026-01-01",
      tags: [],
    });
    expect(result).toContain("title: Safe Title");
    expect(result).toContain("author: pi");
  });

  it("strips legacy source_url from output when source is present", () => {
    const result = formatFrontmatter({
      title: "Test",
      source: "https://primary.com",
      source_url: "https://legacy.com",
      tags: [],
    });
    expect(result).toContain("source: https://primary.com");
    expect(result).not.toContain("source_url:");
  });
});
