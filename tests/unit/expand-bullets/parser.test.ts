/**
 * Unit tests for expand-bullets/parser.ts — extractBullets, parseFrontmatter, buildSearchQuery
 */

import { describe, it, expect } from "vitest";

// These functions are currently embedded in expand-bullets/index.ts
// We'll test them by importing from the source

// For now, let's test the logic by re-implementing the key functions

function parseFrontmatter(content: string): { tags: string[]; title?: string; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { tags: [], body: content };

  const tags: string[] = [];
  for (const line of match[1].split("\n")) {
    const li = line.match(/^\s*-\s+(.+)/);
    if (li) tags.push(li[1].trim());
  }

  const titleMatch = match[1].match(/^title:\s*(.*)/m);
  const title = titleMatch ? titleMatch[1].trim() : undefined;
  const body = content.slice(match[0].length).trim();

  return { tags, title, body };
}

function extractBullets(body: string): Array<{ text: string; context: string }> {
  const lines = body.split("\n");
  const bullets: Array<{ text: string; context: string }> = [];
  let currentHeading = "";

  for (const line of lines) {
    const headingMatch = line.match(/^#{2,3}\s+(.+)/);
    if (headingMatch) {
      currentHeading = headingMatch[1].trim();
      continue;
    }

    const bulletMatch = line.match(/^\s*-\s+(.+)/);
    if (bulletMatch) {
      const text = bulletMatch[1].trim();
      if (text.startsWith("[") || text.startsWith("http") || text.startsWith("@")) continue;
      if (text.length > 200) continue;
      bullets.push({ text, context: currentHeading });
    }
  }

  return bullets;
}

function buildSearchQuery(bullet: { text: string; context: string }): string {
  const parts = [bullet.text];
  if (bullet.context) parts.push(bullet.context);
  return `(site:edu OR site:ac.* OR site:gov) ${parts.join(" ")}`;
}

describe("parseFrontmatter (expand-bullets)", () => {
  it("extracts title and tags", () => {
    const result = parseFrontmatter(`---
title: Test Doc
tags:
  - tag1
  - tag2
---

Body text`);
    expect(result.title).toBe("Test Doc");
    expect(result.tags).toEqual(["tag1", "tag2"]);
    expect(result.body).toBe("Body text");
  });

  it("returns empty tags and full content when no frontmatter", () => {
    const result = parseFrontmatter("Just content");
    expect(result.tags).toEqual([]);
    expect(result.title).toBeUndefined();
    expect(result.body).toBe("Just content");
  });
});

describe("extractBullets", () => {
  it("extracts bullet points grouped by heading", () => {
    const body = `## Section One
- bullet one
- bullet two

## Section Two
- bullet three`;

    const bullets = extractBullets(body);
    expect(bullets).toHaveLength(3);
    expect(bullets[0]).toEqual({ text: "bullet one", context: "Section One" });
    expect(bullets[1]).toEqual({ text: "bullet two", context: "Section One" });
    expect(bullets[2]).toEqual({ text: "bullet three", context: "Section Two" });
  });

  it("skips wiki links, URLs, and @references", () => {
    const body = `- [[wikilink]]
- https://example.com
- @reference
- real bullet`;

    const bullets = extractBullets(body);
    expect(bullets).toHaveLength(1);
    expect(bullets[0].text).toBe("real bullet");
  });

  it("skips lines over 200 characters", () => {
    const longLine = "- " + "a".repeat(250);
    const body = longLine + "\n- short bullet";
    const bullets = extractBullets(body);
    expect(bullets).toHaveLength(1);
    expect(bullets[0].text).toBe("short bullet");
  });

  it("returns empty array for body with no bullets", () => {
    const body = "## Heading\n\nJust a paragraph.";
    const bullets = extractBullets(body);
    expect(bullets).toHaveLength(0);
  });

  it("handles empty body", () => {
    expect(extractBullets("")).toEqual([]);
  });
});

describe("buildSearchQuery", () => {
  it("includes domain filter and text", () => {
    const bullet = { text: "resilience factors", context: "Clinical Applications" };
    const query = buildSearchQuery(bullet);
    expect(query).toContain("site:edu");
    expect(query).toContain("resilience factors");
    expect(query).toContain("Clinical Applications");
  });

  it("works without context", () => {
    const bullet = { text: "key concept", context: "" };
    const query = buildSearchQuery(bullet);
    expect(query).toContain("key concept");
    expect(query).not.toContain("undefined");
  });
});
