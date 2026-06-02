/**
 * web-search — Three-tier web search (SearXNG + Tavily fallback)
 *
 * Orchestrator combining search backends from searxng.ts, tavily.ts, native.ts.
 * Content fetching (fetch_url) is handled by the separate link-summarizer extension.
 *
 * Tier mapping:
 *   Tier 1 — Academic: openalex, pubmed, semanticscholar, arxiv
 *   Tier 2 — Filtered: site:edu/gov, archlinux
 *   Tier 3 — General: duckduckgo
 *
 * Fallback chain: SearXNG -> Tavily -> native HTTP
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { searchSearxng } from "./searxng.js";
import { searchTavily } from "./tavily.js";
import { searchNativeHttp } from "./native.js";
import type { SearchResult } from "./native.js";

interface SearchOutput {
  results: SearchResult[];
  tier: number;
  tierLabel: string;
}

const LABELS = ["Academic (SearXNG)", "Filtered (SearXNG)", "General (SearXNG)"];
const FALLBACK_LABELS = ["Academic (Tavily)", "Filtered (Tavily)", "General (Tavily)"];

async function tryTierEngine(
  query: string,
  tier: number,
  signal: AbortSignal | undefined,
): Promise<SearchOutput> {
  let results = await searchSearxng(query, tier, signal);
  if (results.length >= 3)
    return { results, tier, tierLabel: `Tier ${tier} — ${LABELS[tier - 1]}` };

  const tavilyResults = await searchTavily(query, tier, signal);
  if (tavilyResults.length > 0)
    return {
      results: tavilyResults,
      tier,
      tierLabel: `Tier ${tier} — ${FALLBACK_LABELS[tier - 1]}`,
    };

  if (results.length < 3) results = await searchNativeHttp(query, tier, signal);
  return { results, tier, tierLabel: `Tier ${tier} — ${LABELS[tier - 1]}` };
}

async function search(
  query: string,
  forcedTier?: number,
  signal?: AbortSignal,
): Promise<SearchOutput> {
  if (forcedTier !== undefined && forcedTier >= 1 && forcedTier <= 3) {
    return tryTierEngine(query, forcedTier, signal);
  }

  // Auto-escalate: Tier 1 -> Tier 2 -> Tier 3
  for (const tier of [1, 2, 3]) {
    const result = await tryTierEngine(query, tier, signal);
    if (result.results.length >= 3) return result;
  }

  const results = await searchNativeHttp(query, 3, signal);
  return {
    results,
    tier: 3,
    tierLabel:
      results.length > 0
        ? "Tier 3 — General (native HTTP fallback)"
        : "Tier 3 — General (all sources exhausted)",
  };
}

function formatResults(results: SearchResult[], query: string, tierLabel: string): string {
  if (!results.length) return `**No results** from any source for "${query}".`;

  const lines = results.map((r, i) => {
    let line = `${i + 1}. [${r.title}](${r.url})`;
    if (r.source_label !== "Web") line += ` — *${r.source_label}*`;
    if (r.snippet) line += `\n   ${r.snippet.slice(0, 250)}`;
    return line;
  });

  return `**Search results** for "${query}" (${tierLabel}, ${results.length} results)\n\n${lines.join("\n\n")}`;
}

export default function (pi: ExtensionAPI): void {
  pi.registerTool({
    name: "web_search",
    label: "Web Search (3-Tier: SearXNG + Tavily)",
    description: "Three-tier web search for authoritative information.",
    promptSnippet: "Search the web (3-tier: SearXNG academic -> filtered -> general)",
    parameters: Type.Object({
      query: Type.String({ description: "The search query" }),
      tier: Type.Optional(
        Type.Number({
          description:
            "Force a specific tier: 1 (academic), 2 (filtered), 3 (general). Omit to auto-escalate.",
        }),
      ),
    }),

    async execute(_toolCallId, params, signal, _onUpdate, _ctx) {
      const { query, tier } = params;
      const { results, tier: usedTier, tierLabel } = await search(query, tier, signal);
      return {
        content: [{ type: "text" as const, text: formatResults(results, query, tierLabel) }],
        details: {
          query,
          tier: usedTier,
          tierLabel,
          count: results.length,
          results: results.map((r) => ({
            title: r.title,
            url: r.url,
            snippet: r.snippet,
            source_label: r.source_label,
            tier: r.tier,
          })),
        },
      };
    },
  });
}
