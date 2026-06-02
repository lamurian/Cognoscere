/**
 * Unit tests for _common/yaml.ts — yamlQuote, formatFrontmatter
 *
 * Functions tested are duplicated here for isolated, self-contained unit testing.
 * The vitest module resolver has issues with the .pi/ hidden directory.
 */

import { describe, it, expect } from "vitest";

const FIELD_ORDER = ["title", "description", "author", "editor", "date", "tags", "source"] as const;

function needsYamlQuoting(value: string): boolean {
  if (value.length === 0) return true;
  if (/^[[\]{},&*!|>'"%@`#:?-\s]/.test(value)) return true;
  if (/: /.test(value) || / #/.test(value)) return true;
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

function formatFrontmatter(fields: Record<string, unknown>): string {
  let out = "---\n";
  let sourceVal: string | undefined;
  if (typeof fields.source === "string" && fields.source) sourceVal = fields.source;
  else if (typeof fields.source_url === "string" && fields.source_url) sourceVal = fields.source_url;

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

describe("yamlQuote", () => {
  it("leaves simple strings unquoted", () => {
    expect(yamlQuote("hello")).toBe("hello");
    expect(yamlQuote("foo bar")).toBe("foo bar");
    expect(yamlQuote("a-b_c")).toBe("a-b_c");
  });

  it("quotes empty strings", () => {
    expect(yamlQuote("")).toBe("''");
  });

  it("quotes values with leading special characters", () => {
    expect(yamlQuote("[bracket]")).toBe("'[bracket]'");
    expect(yamlQuote("{brace}")).toBe("'{brace}'");
    expect(yamlQuote(":colon")).toBe("':colon'");
    expect(yamlQuote("-dash")).toBe("'-dash'");
    expect(yamlQuote("?question")).toBe("'?question'");
  });

  it("quotes values containing colon-space", () => {
    expect(yamlQuote("title: A Story")).toBe("'title: A Story'");
    expect(yamlQuote("key: value")).toBe("'key: value'");
  });

  it("quotes YAML boolean-like values", () => {
    expect(yamlQuote("true")).toBe("'true'");
    expect(yamlQuote("false")).toBe("'false'");
    expect(yamlQuote("yes")).toBe("'yes'");
    expect(yamlQuote("no")).toBe("'no'");
    expect(yamlQuote("null")).toBe("'null'");
  });

  it("quotes numeric strings", () => {
    expect(yamlQuote("123")).toBe("'123'");
    expect(yamlQuote("3.14")).toBe("'3.14'");
  });

  it("leaves values with embedded single quotes unquoted", () => {
    // Single quotes in the middle don't need YAML scalar quoting
    expect(yamlQuote("it's a test")).toBe("it's a test");
  });

  it("leaves values with double quotes unquoted", () => {
    // Double quotes in the middle don't need YAML scalar quoting
    expect(yamlQuote(`say "hello" world`)).toBe(`say "hello" world`);
  });
});

describe("formatFrontmatter", () => {
  it("produces valid YAML frontmatter with all standard fields", () => {
    const result = formatFrontmatter({
      title: "Test Doc",
      description: "A test document",
      author: "pi",
      editor: "lam",
      date: "2026-01-01T00:00:00.000Z",
      tags: ["test", "unit"],
      source: "https://example.com",
    });

    expect(result).toContain("---\n");
    expect(result).toContain("title: Test Doc");
    expect(result).toContain("description: A test document");
    expect(result).toContain("author: pi");
    expect(result).toContain("editor: lam");
    expect(result).toContain("date: 2026-01-01T00:00:00.000Z");
    expect(result).toContain("tags:");
    expect(result).toContain("  - test");
    expect(result).toContain("  - unit");
    expect(result).toContain("source: https://example.com");
    expect(result).toMatch(/^---\n.*\n---\n$/s);
  });

  it("omits source when not provided", () => {
    const result = formatFrontmatter({
      title: "No Source",
      author: "pi",
      editor: "lam",
      date: "2026-01-01T00:00:00.000Z",
      tags: [],
    });
    expect(result).not.toContain("source:");
  });

  it("handles empty tags array", () => {
    const result = formatFrontmatter({
      title: "Empty Tags",
      author: "pi",
      editor: "lam",
      date: "2026-01-01T00:00:00.000Z",
      tags: [],
    });
    expect(result).toContain("title: Empty Tags");
    expect(result).not.toContain("tags:");
  });

  it("accepts source_url as legacy alias", () => {
    const result = formatFrontmatter({
      title: "Legacy",
      author: "pi",
      editor: "lam",
      date: "2026-01-01T00:00:00.000Z",
      tags: [],
      source_url: "https://legacy.example.com",
    });
    expect(result).toContain("source: https://legacy.example.com");
  });

  it("handles special characters in tag values", () => {
    const result = formatFrontmatter({
      title: "Doc: The Beginning",
      author: "pi",
      editor: "lam",
      date: "2026-01-01T00:00:00.000Z",
      tags: ["tag:one", "tag-two"],
    });
    expect(result).toContain("'Doc: The Beginning'");
    // colon without trailing space is valid YAML in list items
    expect(result).toContain("tag:one");
    expect(result).toContain("tag-two");
  });

  it("handles minimal fields", () => {
    const result = formatFrontmatter({
      title: "Minimal",
      tags: [],
    });
    expect(result).toContain("title: Minimal");
    expect(result).not.toContain("author:");
    expect(result).not.toContain("editor:");
    expect(result).not.toContain("date:");
  });
});
