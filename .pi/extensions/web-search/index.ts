/**
 * web-search — Three-tier web search extension (pure TypeScript)
 *
 * Architecture:
 *   Tier 1 — Fetches curated source search URLs (from sources.json) via
 *            Lightpanda headless browser, extracts result links from the
 *            rendered Markdown.  The agent then follows promising links
 *            with fetch_url for full content.
 *   Tier 2 — Searches DuckDuckGo via Lightpanda with site: filters for
 *            academic/institutional domains (site:.edu, etc.).
 *   Tier 3 — Unfiltered DuckDuckGo search via Lightpanda.
 *
 * Lightpanda fallback: If Lightpanda is unavailable, tiers 2/3 fall back
 * to DuckDuckGo's non-JS HTML page (/html/).  Tier 1 requires Lightpanda
 * since source pages are JS-rendered search portals.
 *
 * This extension replaces the old Python-based `fetch_reputable_web` tool
 * in para-knowledge.  No Python dependencies.
 *
 * sources.json format:
 *   {
 *     "tiers": [
 *       { "tier": 1, "sources": [
 *           { "type": "textbook.medical", "name": "PubMed",
 *             "site": "https://pubmed.ncbi.nlm.nih.gov/",
 *             "example": "https://pubmed.ncbi.nlm.nih.gov/?term=resilience" }
 *       ]},
 *       { "tier": 2, "sources": [
 *           { "type": "academia", "site": ["*.edu", "*.ac.*"] }
 *       ]}
 *     ]
 *   }
 */

import { spawn } from "node:child_process";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// ── Constants ────────────────────────────────────────────────────────

const MAX_CONTENT_CHARS = 80_000;
const MAX_RESULTS = 10;

// ── Types ────────────────────────────────────────────────────────────

interface SourceItem {
  type: string;
  name?: string;
  site?: string | string[];
  example?: string;
  key?: string;
}

interface TierConfig {
  tier: number;
  sources: SourceItem[];
}

interface SourcesConfig {
  tiers: TierConfig[];
}

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source_label: string;
  tier: number;
}

// ══════════════════════════════════════════════════════════════════════
//  File loaders
// ══════════════════════════════════════════════════════════════════════

function loadSources(cwd: string): SourcesConfig | null {
  for (const p of [
    resolve(cwd, "sources.json"),
    resolve(cwd, ".pi", "sources.json"),
  ]) {
    try {
      if (existsSync(p)) return JSON.parse(readFileSync(p, "utf-8"));
    } catch {
      /* try next */
    }
  }
  return null;
}

// ══════════════════════════════════════════════════════════════════════
//  .env loader
// ══════════════════════════════════════════════════════════════════════

/**
 * Read .env file (local machine, not committed) into a key-value map.
 * Sources in sources.json may have a "key" field referencing an env var
 * name (e.g. "SEMANTIC_SCHOLAR_KEY").  The value is loaded here for
 * future direct API integrations.
 */
function loadEnv(cwd: string): Record<string, string> {
  const envPath = resolve(cwd, ".env");
  const vars: Record<string, string> = {};
  if (!existsSync(envPath)) return vars;

  try {
    for (const line of readFileSync(envPath, "utf-8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;

      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();

      // Strip surrounding quotes
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      vars[key] = val;
    }
  } catch {
    /* .env is optional — fail silently */
  }
  return vars;
}

// ══════════════════════════════════════════════════════════════════════
//  Lightpanda — spawn headless browser, get Markdown
// ══════════════════════════════════════════════════════════════════════

/** Fetch a URL via Lightpanda and return rendered Markdown. */
function fetchLightpanda(
  url: string,
  signal?: AbortSignal,
): Promise<string | null> {
  return new Promise((resolve_) => {
    const child = spawn(
      "lightpanda",
      [
        "fetch",
        "--obey-robots",
        "--dump",
        "markdown",
        "--log-level",
        "error",
        url,
      ],
      { stdio: ["ignore", "pipe", "pipe"], signal, timeout: 30_000 },
    );

    const chunks: Buffer[] = [];
    child.stdout.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
      const total = chunks.reduce((s, c) => s + c.length, 0);
      if (total > MAX_CONTENT_CHARS * 2) child.kill("SIGTERM");
    });

    child.on("close", (code) => {
      if (code !== 0 && code !== null) {
        resolve_(null);
        return;
      }
      const md = Buffer.concat(chunks).toString("utf-8").trim();
      resolve_(md || null);
    });

    child.on("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "ENOENT") resolve_(null);
      else resolve_(null);
    });
  });
}

// ══════════════════════════════════════════════════════════════════════
//  Link extraction from Markdown
// ══════════════════════════════════════════════════════════════════════

/**
 * Extract result links from Markdown.
 * Returns deduplicated { title, url } pairs (up to MAX_RESULTS).
 */
function extractLinks(
  markdown: string,
  existingUrls: Set<string>,
): Array<{ title: string; url: string }> {
  const links: Array<{ title: string; url: string }> = [];

  // Match [title](url)
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(markdown)) !== null) {
    const title = match[1].trim();
    let url = match[2].trim();
    // Strip trailing junk after first space
    url = url.split(/\s/)[0];
    if (!url.startsWith("http")) continue;
    if (existingUrls.has(url)) continue;
    existingUrls.add(url);
    links.push({ title, url });
    if (links.length >= MAX_RESULTS) break;
  }

  return links;
}

// ══════════════════════════════════════════════════════════════════════
//  Tier 1 — Curated sources via Lightpanda
// ══════════════════════════════════════════════════════════════════════

/**
 * Build the actual search URL from the example URL pattern.
 * Replaces the query-parameter value with the user's search term.
 */
function buildSearchUrl(example: string, query: string): string | null {
  try {
    const url = new URL(example);
    // Common search-parameter names
    const params = ["term", "q", "query", "search", "keywords", "text"];
    let found = false;
    for (const p of params) {
      if (url.searchParams.has(p)) {
        url.searchParams.set(p, query);
        found = true;
        break;
      }
    }
    if (!found) url.searchParams.set("q", query);
    return url.toString();
  } catch {
    return null;
  }
}

/** Tier 1: Fetch each curated source's search page via Lightpanda. */
async function searchTier1(
  query: string,
  config: SourcesConfig,
  signal: AbortSignal | undefined,
): Promise<SearchResult[]> {
  const tier1 = config.tiers?.find((t) => t.tier === 1);
  if (!tier1?.sources?.length) return [];

  const results: SearchResult[] = [];
  const seen = new Set<string>();

  for (const src of tier1.sources) {
    if (!src.example) continue;
    const searchUrl = buildSearchUrl(src.example, query);
    if (!searchUrl) continue;

    const markdown = await fetchLightpanda(searchUrl, signal);
    if (!markdown) continue;

    const links = extractLinks(markdown, seen);
    for (const link of links) {
      results.push({
        title: link.title,
        url: link.url,
        snippet: "",
        source_label: src.name ?? src.type,
        tier: 1,
      });
    }

    // Early exit if we have enough results across all sources
    if (results.length >= MAX_RESULTS) break;
  }

  return results.slice(0, MAX_RESULTS);
}

// ══════════════════════════════════════════════════════════════════════
//  DuckDuckGo helpers (used by tiers 2 & 3)
// ══════════════════════════════════════════════════════════════════════

/**
 * Convert sources.json site patterns to DuckDuckGo-compatible site: filters.
 *
 * Mapping rules:
 *   *.edu → .edu
 *   *.ac.* → .ac.uk,.ac.in,.ac.nz,...  (practical common ones)
 *   *.gov → .gov
 *   *.go.* → .go.id,.go.jp,...
 *   https://domain.ext → domain.ext
 */
function buildDdgSiteFilters(rawPatterns: string[]): string[] {
  const filters: string[] = [];

  for (const p of rawPatterns) {
    let f = p.trim().toLowerCase();

    // Strip leading *. or *.
    if (f.startsWith("*.")) f = f.slice(1);
    else if (f.startsWith("*")) f = "." + f.slice(1);

    // If it's a URL, extract domain
    if (f.startsWith("http")) {
      try {
        f = new URL(f).hostname;
      } catch {
        continue;
      }
    }

    // Special handling for patterns like "ac.*" — expand to common TLDs
    if (f === ".ac.*" || f === "ac.*") {
      filters.push(".ac.uk", ".ac.in", ".ac.nz", ".ac.jp", ".ac.kr", ".ac.cn", ".ac.th", ".ac.id", ".ac.il", ".ac.za");
      continue;
    }

    filters.push(f);
  }

  return filters;
}

/**
 * Search DuckDuckGo via the non-JS HTML page.
 * Returns parsed results (title, url, snippet).
 *
 * This is the fallback path; the primary path uses Lightpanda.
 */
async function searchDdgHttp(
  query: string,
  siteFilters: string[],
  signal?: AbortSignal,
): Promise<SearchResult[]> {
  // Build the search query with site: filters
  let searchQuery = query;
  if (siteFilters.length > 0) {
    const siteParts = siteFilters.map((f) => `site:${f}`);
    searchQuery = siteParts.join(" ") + " " + query;
  }

  const url =
    "https://duckduckgo.com/html/?q=" + encodeURIComponent(searchQuery);

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      signal,
      redirect: "follow",
    });
  } catch {
    return [];
  }
  if (!response.ok) return [];

  const html = await response.text();

  // Parse result blocks from the non-JS HTML page
  const results: SearchResult[] = [];
  const seen = new Set<string>();
  const blocks = html.split(
    'class="result results_links results_links_deep web-result ',
  );

  for (let i = 1; i < blocks.length && results.length < MAX_RESULTS; i++) {
    const block = blocks[i];

    // Extract title
    const titleM = block.match(
      /<a[^>]+class="result__a"[^>]*>([\s\S]*?)<\/a>/,
    );
    if (!titleM) continue;
    const title = titleM[1].replace(/<[^>]*>/g, "").trim();
    if (!title) continue;

    // Extract redirect URL and decode to real URL
    const hrefM = block.match(
      /<a[^>]+class="result__a"[^>]*href="([^"]+)"/,
    );
    if (!hrefM) continue;
    let rawUrl = hrefM[1];
    if (rawUrl.startsWith("//")) rawUrl = "https:" + rawUrl;

    let realUrl = rawUrl;
    try {
      const parsed = new URL(rawUrl);
      const uddg = parsed.searchParams.get("uddg");
      if (uddg) realUrl = decodeURIComponent(uddg);
    } catch {
      /* use raw URL */
    }

    if (seen.has(realUrl)) continue;
    seen.add(realUrl);

    // Extract snippet
    const snippetM = block.match(
      /<a[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/a>/,
    );
    const snippet = snippetM
      ? snippetM[1].replace(/<[^>]*>/g, "").replace(/&#?\w+;/g, " ").trim()
      : "";

    results.push({
      title,
      url: realUrl,
      snippet,
      source_label: "Web",
      tier: 0, // filled in by caller
    });
  }

  return results;
}

/**
 * Search DuckDuckGo via Lightpanda (primary path).
 * More reliable — renders JavaScript and supports all features.
 */
async function searchDdgLightpanda(
  query: string,
  siteFilters: string[],
  signal: AbortSignal | undefined,
): Promise<SearchResult[]> {
  let searchQuery = query;
  if (siteFilters.length > 0) {
    const siteParts = siteFilters.map((f) => `site:${f}`);
    searchQuery = siteParts.join(" ") + " " + query;
  }

  const url =
    "https://duckduckgo.com/?q=" + encodeURIComponent(searchQuery);
  const markdown = await fetchLightpanda(url, signal);
  if (!markdown) return [];

  const seen = new Set<string>();
  const links = extractLinks(markdown, seen);

  return links.map((l) => ({
    title: l.title,
    url: l.url,
    snippet: "",
    source_label: "Web",
    tier: 0,
  }));
}

// ══════════════════════════════════════════════════════════════════════
//  Tiers 2 & 3 — DuckDuckGo search
// ══════════════════════════════════════════════════════════════════════

async function searchTier23(
  query: string,
  siteFilters: string[],
  tier: number,
  signal: AbortSignal | undefined,
): Promise<SearchResult[]> {
  // Primary: Lightpanda (JS rendering, handles all features)
  let results = await searchDdgLightpanda(query, siteFilters, signal);

  // Fallback: if Lightpanda not available (returns null), use HTTP non-JS
  if (results.length === 0) {
    results = await searchDdgHttp(query, siteFilters, signal);
  }

  const label = tier === 2 ? "Academic" : "General Web";
  results.forEach((r) => {
    r.tier = tier;
    r.source_label = label;
  });

  return results;
}

async function searchTier2(
  query: string,
  config: SourcesConfig | null,
  signal: AbortSignal | undefined,
): Promise<SearchResult[]> {
  let rawPatterns = ["*.edu", "*.ac.*"];
  if (config) {
    const t2 = config.tiers?.find((t) => t.tier === 2);
    if (t2?.sources?.length) {
      rawPatterns = [];
      for (const src of t2.sources) {
        if (Array.isArray(src.site)) rawPatterns.push(...src.site);
        else if (src.site) rawPatterns.push(src.site);
      }
    }
  }
  const siteFilters = buildDdgSiteFilters(rawPatterns);
  return searchTier23(query, siteFilters, 2, signal);
}

async function searchTier3(
  query: string,
  signal: AbortSignal | undefined,
): Promise<SearchResult[]> {
  return searchTier23(query, [], 3, signal);
}

// ══════════════════════════════════════════════════════════════════════
//  Result formatting
// ══════════════════════════════════════════════════════════════════════

function formatForLLM(
  results: SearchResult[],
  query: string,
  tierLabel: string,
  tier: number,
): string {
  if (!results.length) {
    return `**No results** from ${tierLabel} for "${query}".`;
  }

  const lines = results.map((r, i) => {
    let line = `${i + 1}. [${r.title}](${r.url})`;
    if (r.source_label && r.source_label !== "Web")
      line += ` — *${r.source_label}*`;
    if (r.snippet) line += `\n   ${r.snippet.slice(0, 250)}`;
    return line;
  });

  const help =
    tier === 1
      ? "\n\n**→ Tier 1 links extracted from curated source search pages. Follow promising ones with `fetch_url` to get full content.**"
      : "";

  return (
    `**Search results** for "${query}" (${tierLabel}, ${results.length} results)` +
    help +
    "\n\n" +
    lines.join("\n\n")
  );
}

// ══════════════════════════════════════════════════════════════════════
//  Extension entry point
// ══════════════════════════════════════════════════════════════════════

export default function (pi: ExtensionAPI): void {
  const cwd = process.cwd();
  const sourcesConfig = loadSources(cwd);
  const envVars = loadEnv(cwd);

  const sourceCount =
    sourcesConfig?.tiers?.reduce(
      (n, t) => n + (t.sources?.length ?? 0),
      0,
    ) ?? 0;
  if (sourcesConfig) {
    console.log(
      `[web-search] ✓ sources.json (${sourcesConfig.tiers.length} tier(s), ${sourceCount} source(s))`,
    );
  } else {
    console.log("[web-search] No sources.json — will use defaults");
  }

  const envKeysAvailable = Object.keys(envVars);
  if (envKeysAvailable.length > 0) {
    console.log(`[web-search] ✓ .env loaded (${envKeysAvailable.length} key(s): ${envKeysAvailable.join(", ")})`);
  }

  pi.registerTool({
    name: "web_search",
    label: "Web Search (3-Tier)",
    description: [
      "Three-tier web search for authoritative information.",
      "Tier 1 — Fetches curated source search pages (defined in sources.json) via Lightpanda headless browser.",
      "  Returns result links extracted from the rendered Markdown. Follow promising links with fetch_url.",
      "Tier 2 — DuckDuckGo filtered to academic/institutional domains (site:.edu, .ac.uk, etc.).",
      "Tier 3 — Unfiltered DuckDuckGo general web search.",
      "Auto-escalates: tier 1 → tier 2 → tier 3 if < 3 results. Pass tier: N to force a specific layer.",
      "Sources in sources.json can have a 'key' field referencing a .env variable",
      "(loaded from the local .env file, not committed to git). Reserved for future",
      "direct API integrations.",
      "Pure TypeScript — no Python required.",
    ].join(" "),
    promptSnippet:
      "Search the web (3-tier: curated sources → academic → general)",
    promptGuidelines: [
      "Use web_search when you need authoritative information not found in local PARA documents.",
      "Auto-escalates from curated sources (tier 1) → academic (tier 2) → general web (tier 3).",
      "For tier 1 results, use fetch_url on promising links to read full content before synthesising.",
      "Pass tier: 1, 2, or 3 to force a specific tier and skip auto-escalation.",
      "Cite every result with markdown footnotes (e.g. [^1]) including page title and URL.",
    ],
    parameters: Type.Object({
      query: Type.String({
        description: "The search query",
      }),
      tier: Type.Optional(
        Type.Number({
          description:
            "Force a specific tier: 1 (curated sources), 2 (academic filters), 3 (general web). Omit to auto-escalate.",
        }),
      ),
    }),

    async execute(_toolCallId, params, signal, _onUpdate, _ctx) {
      const { query, tier } = params;
      let results: SearchResult[] = [];
      let tierLabel: string;
      let usedTier: number;

      if (tier === 1) {
        results = await searchTier1(
          query,
          sourcesConfig ?? { tiers: [] },
          signal,
        );
        tierLabel = "Tier 1 (curated sources via Lightpanda)";
        usedTier = 1;
      } else if (tier === 2) {
        results = await searchTier2(query, sourcesConfig, signal);
        tierLabel = "Tier 2 (academic filters)";
        usedTier = 2;
      } else if (tier === 3) {
        results = await searchTier3(query, signal);
        tierLabel = "Tier 3 (general web)";
        usedTier = 3;
      } else {
        // Auto-escalate
        results = await searchTier1(
          query,
          sourcesConfig ?? { tiers: [] },
          signal,
        );
        tierLabel = "Tier 1 (curated sources via Lightpanda)";
        usedTier = 1;

        if (results.length < 3) {
          results = await searchTier2(query, sourcesConfig, signal);
          tierLabel = "Tier 2 (academic filters)";
          usedTier = 2;

          if (results.length < 3) {
            results = await searchTier3(query, signal);
            tierLabel = "Tier 3 (general web)";
            usedTier = 3;
          }
        }
      }

      return {
        content: [
          {
            type: "text" as const,
            text: formatForLLM(results, query, tierLabel, usedTier),
          },
        ],
        details: {
          envKeysAvailable,
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
