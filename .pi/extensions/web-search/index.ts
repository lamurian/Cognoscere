/**
 * web-search — Three-tier web search extension (pure TypeScript)
 *
 * Architecture:
 *   Tier 1 — Fetches curated source search URLs (from sources.json) via
 *            Lightpanda headless browser, extracts result links from the
 *            rendered Markdown.  The agent then follows promising links
 *            with fetch_url for full content.
 *
 *   Tiers 2 & 3 — DuckDuckGo search via the Lite endpoint
 *            (POST https://lite.duckduckgo.com/lite/) using Node.js
 *            built-in fetch(). The /html/ endpoint was abandoned because
 *            it now presents a captcha challenge for automated requests.
 *            The Lite endpoint returns clean HTML table rows with
 *            class='result-link' and class='result-snippet'.
 *            Lightpanda is used only as a fallback if Lite returns nothing.
 *
 *   Content fetching — The extension provides fetchUrlWithFallback() which
 *            tries Lightpanda to convert a specific URL to Markdown, then
 *            validates the content is meaningful. If Lightpanda returns
 *            junk (navigation-only, very short), it falls back to HTTP
 *            fetch + HTML-to-Markdown conversion.
 *
 *   Tier 1 still requires Lightpanda since source pages are JS-rendered
 *   search portals that the non-JS fallback cannot handle.
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
 * Quick check: does the URL look like a navigation/UI element rather than
 * an actual content result?  Returns true if the link is meaningful content.
 */
function isContentLink(url: string, title: string): boolean {
  // Skip image/icon/media URLs
  if (/[\.\/](png|svg|jpg|jpeg|gif|ico|webp|bmp|avif)([?#]|$)/i.test(url)) return false;

  // Skip auth/account pages
  if (/\/(login|signin|signout|logout|register|signup|auth|forgot|reset|myncbi|myaccount|account\/settings)/i.test(url)) return false;
  if (/\/(dashboard|settings|preferences|profile)(\/|$)/i.test(url)) return false;

  // Skip social media/share links
  if (/^https?:\/\/(www\.)?(twitter\.com|x\.com|facebook\.com|linkedin\.com|youtube\.com|instagram\.com|github\.com|t\.co|fb\.com|lnkd\.in)/i.test(url)) return false;

  // Skip footer/help/nav pages
  if (/\/(help|about|contact|privacy|terms|cookies|accessibility|careers|disclaimer|web\-policies|foia|vulnerability\-disclosure|browsers|guide)/i.test(url)) return false;

  // Skip very short titles (single word UI labels like "Log in", "Help", "Close")
  const stripped = title.replace(/[\[\]!?.]+/g, "").trim();
  if (stripped.length < 4) return false;

  // Skip titles that are clearly UI labels
  const uiLabels = [
    "log in", "log out", "sign in", "sign out", "sign up", "register",
    "dashboard", "settings", "account", "profile", "help", "about",
    "contact", "privacy", "terms", "access keys", "main content",
    "main navigation", "show account info", "close", "menu",
    "open menu", "search", "advanced", "create alert",
    "table of contents", "supplemental content", "search details",
    "recent activity", "follow n", "connect with",
    "all regions", "safe search", "any time", "custom date range",
    "homepage", "themes", "share feedback",
  ];
  const lower = stripped.toLowerCase();
  if (uiLabels.some((l) => lower === l || lower.startsWith(l + ":"))) return false;

  // Skip government banner text (official website indicators)
  if (lower.includes("us flag") || lower.includes("dot gov") || lower.includes("https")) return false;
  if (lower.includes("official website") || lower.includes("government website")) return false;
  if (lower.includes("here's how you know") || lower.includes("site is secure")) return false;

  return true;
}

/**
 * Extract result links from Markdown.
 * Returns deduplicated { title, url } pairs (up to MAX_RESULTS).
 * Filters out navigation chrome, image files, auth links, and other non-content UI.
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
    if (!isContentLink(url, title)) continue;
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
//  Content validation & fetch-with-fallback
// ══════════════════════════════════════════════════════════════════════

/**
 * Quick check: is the rendered Markdown content meaningful?
 * Rejects pages that are mostly navigation, very short, or metadata-only.
 */
function isContentMeaningful(markdown: string): boolean {
  if (!markdown || markdown.length < 150) return false;

  // Strip Markdown link/image syntax, emphasis, headers, code
  const textOnly = markdown
    .replace(/!?\[[^\]]*\]\([^)]*\)/g, "$1")
    .replace(/[#*`>|_~]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (textOnly.length < 80) return false;

  // Must have at least 2 sentence-ending punctuation marks
  const sentences = (textOnly.match(/[.?!]+/g) || []).length;
  if (sentences < 2) return false;

  // Check it's not just navigation chrome by counting "nav" keywords
  const lower = textOnly.toLowerCase();
  const navWords = ["all", "images", "videos", "maps", "shopping",
    "sign in", "sign up", "log in", "register", "privacy", "terms",
    "cookies", "settings", "help", "about", "contact"];
  const navHits = navWords.filter((w) => lower.includes(w)).length;

  // If >50% of early content is nav words and total is small, it's junk
  if (navHits > 4 && textOnly.length < 400) return false;

  return true;
}

/**
 * Simple HTML-to-Markdown conversion for the HTTP fallback path.
 * Handles common block elements, links, emphasis, and code blocks.
 */
function htmlToMarkdown(html: string): string {
  let md = html;

  // Remove scripts, styles, comments, nav, header, footer
  md = md.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
  md = md.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  md = md.replace(/<!--[\s\S]*?-->/g, "");
  md = md.replace(/<(?:nav|header|footer|aside)[^>]*>[\s\S]*?<\/(?:nav|header|footer|aside)>/gi, "");

  // Block-level conversions
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n");
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n");
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n");
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, "#### $1\n\n");
  md = md.replace(/<h5[^>]*>(.*?)<\/h5>/gi, "##### $1\n\n");
  md = md.replace(/<h6[^>]*>(.*?)<\/h6>/gi, "###### $1\n\n");
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n");
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n");
  md = md.replace(/<br\s*\/?>/gi, "\n");
  md = md.replace(/<hr\s*\/?>/gi, "\n---\n");
  md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, "> $1\n\n");
  md = md.replace(/<pre[^>]*>(.*?)<\/pre>/gis, "```\n$1\n```\n\n");
  md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`");

  // Inline conversions (order matters: links before bold to avoid nested issues)
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)");
  md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**");
  md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**");
  md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*");
  md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*");

  // Strip remaining unknown tags
  md = md.replace(/<[^>]*>/g, "");

  // Decode common HTML entities
  const entities: Record<string, string> = {
    "&amp;": "&", "&lt;": "<", "&gt;": ">",
    "&quot;": '"', "&#39;": "'", "&#x27;": "'",
    "&nbsp;": " ", "&mdash;": "---", "&ndash;": "--",
  };
  for (const [enc, dec] of Object.entries(entities)) {
    md = md.replace(new RegExp(enc, "g"), dec);
  }
  md = md.replace(/&#?\w+;/g, " ");

  // Clean up excessive blank lines
  md = md.replace(/\n{4,}/g, "\n\n");

  return md.trim();
}

/**
 * Fetch a specific URL and convert to Markdown, with validation and fallback.
 *
 * 1. Tries Lightpanda (best Markdown conversion for JS-heavy pages)
 * 2. Validates the content is meaningful (not just nav chrome)
 * 3. If Lightpanda output is junk, falls back to HTTP fetch + htmlToMarkdown
 *
 * Returns the best Markdown we could produce, or null if both failed.
 */
async function fetchUrlWithFallback(
  url: string,
  signal?: AbortSignal,
): Promise<string | null> {
  // Step 1: Try Lightpanda
  const lightpandaMd = await fetchLightpanda(url, signal);

  if (lightpandaMd && isContentMeaningful(lightpandaMd)) {
    return lightpandaMd;
  }

  // Step 2: Lightpanda output was empty or junk — fall back to HTTP + HTML
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      signal,
      redirect: "follow",
    });

    if (!response.ok) return lightpandaMd;

    const html = await response.text();
    const htmlMd = htmlToMarkdown(html);

    if (htmlMd && isContentMeaningful(htmlMd)) {
      return htmlMd;
    }

    // If HTML fallback also produced junk, return the original Lightpanda output
    return lightpandaMd || htmlMd || null;
  } catch {
    return lightpandaMd;
  }
}

// ══════════════════════════════════════════════════════════════════════
//  DuckDuckGo Lite endpoint (used by tiers 2 & 3)
//  Note: DuckDuckGo's /html/ endpoint now presents a captcha challenge
//  for automated requests.  The Lite endpoint (https://lite.duckduckgo.com/lite/)
//  still returns clean HTML results via POST and is more reliable.
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
 * Search DuckDuckGo via the Lite endpoint (POST-based HTML).
 * Returns parsed results (title, url, snippet).
 *
 * The Lite endpoint at https://lite.duckduckgo.com/lite/ accepts POST
 * requests with a `q` parameter and returns clean HTML table rows with
 * result links, snippets, and display URLs.  It does not present captcha
 * challenges like the /html/ endpoint does.
 *
 * Result HTML structure:
 *   <a class='result-link' href="...">Title</a>
 *   <td class='result-snippet'>Snippet text...</td>
 *   <span class='link-text'>display.url</span>
 */
async function searchDdgLite(
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

  const url = "https://lite.duckduckgo.com/lite/";

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "text/html,application/xhtml+xml",
      },
      body: new URLSearchParams({ q: searchQuery }).toString(),
      signal,
      redirect: "follow",
    });
  } catch {
    return [];
  }
  if (!response.ok) return [];

  const html = await response.text();

  // Parse result rows from the Lite HTML page
  const results: SearchResult[] = [];
  const seen = new Set<string>();

  // Extract result link blocks:
  //   <a rel="nofollow" href="URL" class='result-link'>TITLE</a>
  //   <a class='result-link' href="URL">TITLE</a>
  // href= can appear before or after class=, so use a two-step approach:
  //   Step 1: find the full <a...> tag with class='result-link'
  //   Step 2: extract href and title from that tag
  const linkTagRe = /<a[^>]+class=['"]result-link['"][^>]*>([\s\S]*?)<\/a>/gi;
  let linkMatch: RegExpExecArray | null;

  while ((linkMatch = linkTagRe.exec(html)) !== null && results.length < MAX_RESULTS) {
    const fullTag = linkMatch[0];

    // Extract href from the full tag
    const hrefM = fullTag.match(/href="([^"]+)"/i);
    if (!hrefM) continue;
    const url = hrefM[1].trim();

    // Extract title from the captured inner content
    const title = linkMatch[1].replace(/<[^>]*>/g, "").trim();
    if (!url || !title || seen.has(url)) continue;
    if (!isContentLink(url, title)) continue;
    seen.add(url);

    // Find the snippet for this result (snippet rows follow the link row)
    const snippet = extractSnippetAfterLink(html, linkMatch.index, url);

    results.push({
      title,
      url,
      snippet,
      source_label: "Web",
      tier: 0, // filled in by caller
    });
  }

  return results.slice(0, MAX_RESULTS);
}

/**
 * Extract the snippet following a result link in the Lite HTML.
 * Snippet is in <td class='result-snippet'>...</td> that appears
 * in a <tr> element after the link row.
 */
function extractSnippetAfterLink(
  html: string,
  linkIndex: number,
  url: string,
): string {
  // Look for the next <td class='result-snippet'> after this link
  const after = html.slice(linkIndex);
  const snippetMatch = after.match(
    /<td[^>]+class=['"]result-snippet['"][^>]*>([\s\S]*?)<\/td>/i,
  );
  if (!snippetMatch) return "";

  let snippet = snippetMatch[1]
    .replace(/<[^>]*>/g, "")
    .replace(/&#?\w+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return snippet.length > 300 ? snippet.slice(0, 300) + "..." : snippet;
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
  // Primary: DuckDuckGo Lite endpoint (POST-based, no captcha)
  let results = await searchDdgLite(query, siteFilters, signal);

  // Fallback: if Lite returned nothing, try the JS version via Lightpanda
  // (unlikely to work for DDG since results are xhr-loaded, but try anyway)
  if (results.length === 0) {
    const url =
      "https://duckduckgo.com/?q=" + encodeURIComponent(query);
    const markdown = await fetchLightpanda(url, signal);
    if (markdown) {
      const seen = new Set<string>();
      const links = extractLinks(markdown, seen);
      results = links.map((l) => ({
        title: l.title,
        url: l.url,
        snippet: "",
        source_label: "Web",
        tier: 0,
      }));
    }
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
      "Tiers 2/3 use HTTP POST to the DuckDuckGo Lite endpoint (lite.duckduckgo.com/lite/)",
      "  for reliable result extraction without captcha challenges.",
      "  Lightpanda is only tried as a fallback if Lite returns nothing.",
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
      "Tiers 2 and 3 use the DuckDuckGo Lite endpoint (POST) for search; Lightpanda is fallback only.",
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
