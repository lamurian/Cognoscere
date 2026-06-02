/**
 * web-search — Three-tier web search (SearXNG + Tavily fallback)
 *
 * Architecture:
 *   Primary:  SearXNG running in Docker (searxng service, port 8888)
 *   Fallback: Tavily API (api.tavily.com), requires TAVILY_KEY in .env
 *   Last:     Native HTTP / Bing RSS (no deps, less accurate)
 *
 * Content fetching (fetch_url) is handled by the separate link-summarizer
 * extension which connects to Obscura CDP (obscura service, port 9222).
 *
 * Docker Compose setup: search-stack/docker-compose.yml
 *
 *   docker compose -f search-stack/docker-compose.yml up -d
 *
 * Tier mapping (via SearXNG &engines= parameter):
 *   Tier 1 — Academic: openalex, pubmed, semanticscholar, arxiv
 *   Tier 2 — Filtered: duckduckgo (site: filters), archlinux, github code
 *   Tier 3 — General:  duckduckgo
 *
 * Fallback chain:
 *   SearXNG → Tavily → native HTTP
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

// ── Constants ──────────────────────────────────────────────────────

const MAX_RESULTS = 10;
const SEARXNG_PORT = parseInt(process.env.SEARXNG_PORT || "8888", 10);

// ── Types ──────────────────────────────────────────────────────────

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source_label: string;
  tier: number;
}

// ══════════════════════════════════════════════════════════════════
//  SearXNG — primary search via Docker container
// ══════════════════════════════════════════════════════════════════

/**
 * Query SearXNG JSON API via POST.
 * Docker service must be running (searxng on port 8888).
 *
 * Tier mapping:
 *   1 — academic engines (openalex, pubmed, semanticscholar, arxiv)
 *   2 — duckduckgo with site: filters + archlinux + github code
 *   3 — duckduckgo general
 */
async function searchSearxng(
  query: string,
  tier: number,
  signal?: AbortSignal,
): Promise<SearchResult[]> {
  const baseUrl = `http://127.0.0.1:${SEARXNG_PORT}/search`;

  const params: Record<string, string> = {
    q: query,
    format: "json",
    language: "en",
    pageno: "1",
  };

  if (tier === 1) {
    params.engines = "openalex,pubmed,semanticscholar,arxiv";
  } else if (tier === 2) {
    params.q = `${query} site:edu OR site:ac.* OR site:gov OR site:go.* OR site:mil`;
    params.engines = "duckduckgo,archlinux";
  } else {
    params.engines = "duckduckgo";
  }

  let response: Response;
  try {
    response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(params),
      signal,
    });
  } catch {
    return [];
  }
  if (!response.ok) return [];

  let data: { results?: Array<Record<string, unknown>> };
  try {
    data = (await response.json()) as typeof data;
  } catch {
    return [];
  }

  return (data.results ?? [])
    .slice(0, MAX_RESULTS)
    .map((r) => ({
      title: (r.title as string) ?? "",
      url: (r.url as string) ?? "",
      snippet: ((r.content as string) ?? "")
        .replace(/<[^>]*>/g, "")
        .slice(0, 300),
      source_label: (r.engine as string) ?? "SearXNG",
      tier,
    }));
}

// ══════════════════════════════════════════════════════════════════
//  Tavily — fallback search API
// ══════════════════════════════════════════════════════════════════

const ACADEMIC_DOMAINS = [
  "pubmed.ncbi.nlm.nih.gov",
  "arxiv.org",
  "semanticscholar.org",
  "openalex.org",
  "doi.org",
  "ncbi.nlm.nih.gov",
  "science.org",
  "nature.com",
  "springer.com",
  "ieee.org",
  "acm.org",
];

/**
 * Query Tavily API. Requires TAVILY_KEY environment variable.
 * Returns results with full-page content (no separate fetch_url needed).
 */
async function searchTavily(
  query: string,
  tier: number,
  signal?: AbortSignal,
): Promise<SearchResult[]> {
  const apiKey = process.env.TAVILY_KEY;
  if (!apiKey) return [];

  const body: Record<string, unknown> = {
    api_key: apiKey,
    query,
    max_results: MAX_RESULTS,
    include_answer: false,
  };

  if (tier === 1) {
    body.search_depth = "advanced";
    body.include_domains = ACADEMIC_DOMAINS;
  } else if (tier === 2) {
    body.search_depth = "basic";
    body.include_domains = [".edu", ".gov", ".ac.uk"];
  } else {
    body.search_depth = "advanced";
  }

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
    });
    if (!response.ok) return [];

    const data = (await response.json()) as {
      results?: Array<Record<string, unknown>>;
    };
    return (data.results ?? []).slice(0, MAX_RESULTS).map((r) => ({
      title: (r.title as string) ?? "",
      url: (r.url as string) ?? "",
      snippet: ((r.content as string) ?? "").slice(0, 300),
      source_label: "Tavily",
      tier,
    }));
  } catch {
    return [];
  }
}

// ══════════════════════════════════════════════════════════════════
//  Native HTTP — last-resort fallback (Bing RSS)
// ══════════════════════════════════════════════════════════════════

/**
 * Minimal Bing RSS feed fetch.
 * Only used when both SearXNG and Tavily are unavailable.
 */
async function searchNativeHttp(
  query: string,
  tier: number,
  signal?: AbortSignal,
): Promise<SearchResult[]> {
  let searchQuery = query;
  if (tier === 2) {
    searchQuery = `(${query}) (site:edu OR site:ac.uk OR site:gov)`;
  }

  const url =
    "https://www.bing.com/search?q=" +
    encodeURIComponent(searchQuery) +
    "&format=rss";

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/rss+xml, application/xml",
      },
      signal,
    });
    if (!response.ok) return [];

    const xml = await response.text();
    const results: SearchResult[] = [];
    const seen = new Set<string>();
    const itemRe = /<item>([\s\S]*?)<\/item>/gi;
    let match: RegExpExecArray | null;

    while (
      (match = itemRe.exec(xml)) !== null &&
      results.length < MAX_RESULTS
    ) {
      const block = match[1];
      const titleM = block.match(/<title>([^<]*)<\/title>/i);
      const linkM = block.match(/<link>([^<]+)<\/link>/i);
      if (!titleM || !linkM) continue;
      const title = titleM[1].trim();
      const link = linkM[1].trim();
      if (!title || !link || seen.has(link)) continue;
      seen.add(link);

      const descM = block.match(/<description>([\s\S]*?)<\/description>/i);
      const snippet = descM
        ? descM[1]
            .replace(/<[^>]*>/g, "")
            .replace(/&#?\w+;/g, " ")
            .replace(/\s+/g, " ")
            .trim()
        : "";

      results.push({
        title,
        url: link,
        snippet: snippet.length > 300 ? snippet.slice(0, 300) + "..." : snippet,
        source_label: "Web",
        tier,
      });
    }
    return results;
  } catch {
    return [];
  }
}

// ══════════════════════════════════════════════════════════════════
//  Orchestrator
// ══════════════════════════════════════════════════════════════════

interface SearchOutput {
  results: SearchResult[];
  tier: number;
  tierLabel: string;
}

/**
 * Run search through the fallback chain.
 *
 * Forced tier (1/2/3):
 *   Only that tier's engines are queried via SearXNG.
 *   If SearXNG fails, falls through Tavily → native for the same tier.
 *
 * Auto-escalate (no tier):
 *   Tier 1 (SearXNG) → if < 3 results, Tavily tier 1
 *   → Tier 2 (SearXNG) → if < 3, Tavily tier 2
 *   → Tier 3 (SearXNG) → if < 3, Tavily tier 3
 *   → if still < 3, native HTTP
 */
async function search(
  query: string,
  forcedTier?: number,
  signal?: AbortSignal,
): Promise<SearchOutput> {
  // ── Forced tier: only that tier ──
  if (forcedTier !== undefined && forcedTier >= 1 && forcedTier <= 3) {
    const tier = forcedTier;
    const label = ["Academic (SearXNG)", "Filtered (SearXNG)", "General (SearXNG)"][
      tier - 1
    ];
    const fallbackLabel = ["Academic (Tavily)", "Filtered (Tavily)", "General (Tavily)"][
      tier - 1
    ];

    let results = await searchSearxng(query, tier, signal);
    if (results.length < 3) {
      const tavilyResults = await searchTavily(query, tier, signal);
      if (tavilyResults.length > 0) {
        return {
          results: tavilyResults,
          tier,
          tierLabel: `Tier ${tier} — ${fallbackLabel}`,
        };
      }
    }
    if (results.length < 3) {
      results = await searchNativeHttp(query, tier, signal);
    }
    return { results, tier, tierLabel: `Tier ${tier} — ${label}` };
  }

  // ── Auto-escalate: Tier 1 → Tavily → Tier 2 → Tavily → Tier 3 ──
  let results: SearchResult[];

  // Tier 1
  results = await searchSearxng(query, 1, signal);
  if (results.length >= 3) {
    return { results, tier: 1, tierLabel: "Tier 1 — Academic (SearXNG)" };
  }
  results = await searchTavily(query, 1, signal);
  if (results.length >= 3) {
    return { results, tier: 1, tierLabel: "Tier 1 — Academic (Tavily)" };
  }

  // Tier 2
  results = await searchSearxng(query, 2, signal);
  if (results.length >= 3) {
    return { results, tier: 2, tierLabel: "Tier 2 — Filtered (SearXNG)" };
  }
  results = await searchTavily(query, 2, signal);
  if (results.length >= 3) {
    return { results, tier: 2, tierLabel: "Tier 2 — Filtered (Tavily)" };
  }

  // Tier 3
  results = await searchSearxng(query, 3, signal);
  if (results.length >= 3) {
    return { results, tier: 3, tierLabel: "Tier 3 — General (SearXNG)" };
  }
  results = await searchTavily(query, 3, signal);
  if (results.length >= 3) {
    return { results, tier: 3, tierLabel: "Tier 3 — General (Tavily)" };
  }

  // Last resort
  results = await searchNativeHttp(query, 3, signal);

  return {
    results,
    tier: 3,
    tierLabel: results.length > 0
      ? "Tier 3 — General (native HTTP fallback)"
      : "Tier 3 — General (all sources exhausted)",
  };
}

// ══════════════════════════════════════════════════════════════════
//  Formatting
// ══════════════════════════════════════════════════════════════════

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

// ══════════════════════════════════════════════════════════════════
//  Extension Entry Point
// ══════════════════════════════════════════════════════════════════

export default function (pi: ExtensionAPI): void {
  console.log(
    "[web-search] ✓ SearXNG search + Tavily fallback" +
      (process.env.TAVILY_KEY ? " (Tavily key found)" : " (no Tavily key — native HTTP last resort)"),
  );

  pi.registerTool({
    name: "web_search",
    label: "Web Search (3-Tier: SearXNG + Tavily)",
    description: [
      "Three-tier web search for authoritative information.",
      "",
      "Tier 1 — Academic: SearXNG with OpenAlex, PubMed, Semantic Scholar, arXiv.",
      "Tier 2 — Filtered: DuckDuckGo (site:.edu/.gov/.mil filters), Arch Linux Wiki.",
      "Tier 3 — General: DuckDuckGo.",
      "",
      "Fallback chain: SearXNG (Docker) → Tavily API → native HTTP.",
      "",
      "Requires Docker Compose from search-stack/:",
      "  docker compose -f search-stack/docker-compose.yml up -d",
      "",
      "Set TAVILY_KEY in .env for Tavily fallback (free at https://tavily.com).",
    ].join(" "),
    promptSnippet:
      "Search the web (3-tier: SearXNG academic → filtered → general)",
    promptGuidelines: [
      "Use web_search when you need authoritative information not found locally.",
      "Auto-escalates: academic (tier 1) → filtered (tier 2) → general (tier 3).",
      "Pass tier: 1, 2, or 3 to force a specific tier.",
      "For full content from any result, use fetch_url.",
      "Cite every result with markdown footnotes (e.g. [^1]) including page title and URL.",
    ],
    parameters: Type.Object({
      query: Type.String({
        description: "The search query",
      }),
      tier: Type.Optional(
        Type.Number({
          description:
            "Force a specific tier: 1 (academic), 2 (filtered), 3 (general). Omit to auto-escalate.",
        }),
      ),
    }),

    async execute(_toolCallId, params, signal, _onUpdate, _ctx) {
      const { query, tier } = params;
      const { results, tier: usedTier, tierLabel } = await search(
        query,
        tier,
        signal,
      );

      return {
        content: [
          {
            type: "text" as const,
            text: formatResults(results, query, tierLabel),
          },
        ],
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
