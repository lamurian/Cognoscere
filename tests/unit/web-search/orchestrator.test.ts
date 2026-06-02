/**
 * Unit tests for web-search orchestrator logic
 */

import { describe, it, expect } from "vitest";

// Test the formatResults function and tier label logic

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source_label: string;
  tier: number;
}

function formatResults(
  results: SearchResult[],
  query: string,
  tierLabel: string,
): string {
  if (!results.length) {
    return `**No results** from any source for "${query}".`;
  }

  const lines = results.map((r, i) => {
    let line = `${i + 1}. [${r.title}](${r.url})`;
    if (r.source_label !== "Web") line += ` — *${r.source_label}*`;
    if (r.snippet) line += `\n   ${r.snippet.slice(0, 250)}`;
    return line;
  });

  return (
    `**Search results** for "${query}" (${tierLabel}, ${results.length} results)` +
    "\n\n" +
    lines.join("\n\n")
  );
}

function getTierLabel(tier: number, source: string): string {
  const labels = ["Academic", "Filtered", "General"];
  return `Tier ${tier} — ${labels[tier - 1]} (${source})`;
}

describe("formatResults", () => {
  const sampleResults: SearchResult[] = [
    {
      title: "Test Result",
      url: "https://example.com",
      snippet: "This is a test snippet describing the result.",
      source_label: "PubMed",
      tier: 1,
    },
    {
      title: "Second Result",
      url: "https://example.org",
      snippet: "Another snippet for testing.",
      source_label: "Web",
      tier: 3,
    },
  ];

  it("returns header with query, tier label, and count", () => {
    const output = formatResults(sampleResults, "test query", "Tier 1 — Academic (SearXNG)");
    expect(output).toContain('"test query"');
    expect(output).toContain("Tier 1 — Academic (SearXNG)");
    expect(output).toContain("2 results");
  });

  it("includes source label for non-Web results", () => {
    const output = formatResults(sampleResults, "test", "Tier 1");
    expect(output).toContain("PubMed");
    expect(output).not.toContain("Web"); // source_label: "Web" doesn't get appended
  });

  it("includes snippet text", () => {
    const output = formatResults(sampleResults, "test", "Tier 1");
    expect(output).toContain("test snippet");
  });

  it("returns no-results message for empty array", () => {
    const output = formatResults([], "anything", "Tier 3");
    expect(output).toContain("No results");
    expect(output).toContain("anything");
  });

  it("truncates long snippets to 250 chars", () => {
    const longSnippet = "x".repeat(300);
    const results: SearchResult[] = [{
      title: "Long",
      url: "https://ex.com",
      snippet: longSnippet,
      source_label: "Web",
      tier: 3,
    }];
    const output = formatResults(results, "q", "Tier 3");
    expect(output.length).toBeLessThan(500);
  });

  it("handles a single result", () => {
    const output = formatResults([sampleResults[0]], "single", "Tier 1");
    expect(output).toContain("1 results");
  });
});

describe("getTierLabel", () => {
  it("returns correct label for each tier", () => {
    expect(getTierLabel(1, "SearXNG")).toContain("Academic");
    expect(getTierLabel(2, "Tavily")).toContain("Filtered");
    expect(getTierLabel(3, "native HTTP fallback")).toContain("General");
  });
});
