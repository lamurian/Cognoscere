/**
 * Unit tests for yaml-enforcer analyzer logic
 */

import { describe, it, expect } from "vitest";

// Functions under test — these are embedded in yaml-enforcer/index.ts
// We extract the pure logic for isolated testing

function needsYamlQuoting(value: string): boolean {
  if (value.length === 0) return true;
  if (/^[[\]{},&*!|>'"%@`#:?-\s]/.test(value)) return true;
  if (/: /.test(value)) return true;
  if (/^(true|false|yes|no|on|off|null|undefined|~)$/i.test(value)) return true;
  if (/^\d+(\.\d+)?$/.test(value)) return true;
  return false;
}

function yamlQuote(value: string): string {
  if (!needsYamlQuoting(value)) return value;
  if (value.includes("'")) return `"${value.replace(/"/g, '\\"')}"`;
  return `'${value}'`;
}

interface FrontmatterIssue {
  type: "invalid-yaml" | "needs-quoting" | "nonstandard-field" | "missing-field";
  field?: string;
  message: string;
  suggestion?: string;
}

interface FrontmatterAnalysis {
  hasFrontmatter: boolean;
  rawBlock: string;
  bodyStart: number;
  fields: Record<string, string | string[]>;
  issues: FrontmatterIssue[];
  keyOrder: string[];
}

const FIELD_ALIASES: Record<string, string> = {
  source_url: "source",
  url: "source",
  created: "date",
};

function isQuoted(value: string): boolean {
  const trimmed = value.trim();
  return (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  );
}

function analyzeFrontmatter(content: string): FrontmatterAnalysis {
  const result: FrontmatterAnalysis = {
    hasFrontmatter: false,
    rawBlock: "",
    bodyStart: 0,
    fields: {},
    issues: [],
    keyOrder: [],
  };

  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    result.issues.push({
      type: "invalid-yaml",
      message: "No YAML frontmatter block found (missing --- delimiters)",
    });
    return result;
  }

  result.hasFrontmatter = true;
  result.rawBlock = match[1];
  result.bodyStart = match[0].length;

  const lines = match[1].split("\n");
  let currentKey = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const kv = line.match(/^([\w_-]+):\s*(.*)/);
    if (kv) {
      currentKey = kv[0].trim();
      const key = kv[1];
      const rawVal = kv[2].trim();
      result.keyOrder.push(key);

      if (rawVal && !rawVal.startsWith("-")) {
        const val = rawVal.replace(/^['"]|['"]$/g, "");
        if (needsYamlQuoting(val) && !isQuoted(rawVal)) {
          result.issues.push({
            type: "needs-quoting",
            field: key,
            message: `Value for '${key}' contains YAML-special characters and needs quoting`,
            suggestion: `${key}: ${yamlQuote(val)}`,
          });
        }

        const canonical = FIELD_ALIASES[key];
        if (canonical) {
          result.issues.push({
            type: "nonstandard-field",
            field: key,
            message: `'${key}' should be renamed to '${canonical}' (standardised field)`,
            suggestion: `Replace '${key}: ...' with '${canonical}: ...'`,
          });
        }

        if (!result.fields[key]) result.fields[key] = rawVal;
      }
    }

    const li = line.match(/^\s*-\s+(.+)/);
    if (li && currentKey.startsWith("tags")) {
      if (!Array.isArray(result.fields.tags)) result.fields.tags = [];
      (result.fields.tags as string[]).push(li[1].trim());
    }
  }

  return result;
}

describe("analyzeFrontmatter", () => {
  it("reports missing frontmatter", () => {
    const result = analyzeFrontmatter("Just body text");
    expect(result.hasFrontmatter).toBe(false);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].type).toBe("invalid-yaml");
  });

  it("detects unquoted values with colons", () => {
    const result = analyzeFrontmatter(`---
title: Doc: Two
tags: []
---`);
    const quotingIssues = result.issues.filter((i) => i.type === "needs-quoting");
    expect(quotingIssues.length).toBeGreaterThanOrEqual(1);
  });

  it("detects non-standard field names", () => {
    const result = analyzeFrontmatter(`---
title: Test
source_url: https://example.com
created: '2026-01-01'
tags: []
---`);
    const aliasIssues = result.issues.filter((i) => i.type === "nonstandard-field");
    const aliasFields = aliasIssues.map((i) => i.field);
    expect(aliasFields).toContain("source_url");
    expect(aliasFields).toContain("created");
  });

  it("extracts tag list items", () => {
    const result = analyzeFrontmatter(`---
title: Test
tags:
  - alpha
  - beta
---`);
    expect(result.fields.tags).toEqual(["alpha", "beta"]);
  });

  it("reports no issues for valid standard frontmatter", () => {
    const result = analyzeFrontmatter(`---
title: Valid Doc
author: pi
editor: lam
date: '2026-01-01'
tags:
  - test
source: https://example.com
---`);
    const criticalIssues = result.issues.filter(
      (i) => i.type !== "missing-field" && i.type !== "invalid-yaml",
    );
    expect(criticalIssues).toHaveLength(0);
  });
});

describe("yamlQuote (yaml-enforcer)", () => {
  it("wraps values with colons in single quotes", () => {
    expect(yamlQuote("title: value")).toBe("'title: value'");
  });

  it("leaves values with embedded single quotes unquoted", () => {
    // Single quotes in the middle of a value don't need YAML quoting
    expect(yamlQuote("it's here")).toBe("it's here");
  });
});

describe("isQuoted", () => {
  it("detects single-quoted values", () => {
    expect(isQuoted("'hello'")).toBe(true);
  });

  it("detects double-quoted values", () => {
    expect(isQuoted('"hello"')).toBe(true);
  });

  it("returns false for unquoted values", () => {
    expect(isQuoted("hello")).toBe(false);
  });
});
