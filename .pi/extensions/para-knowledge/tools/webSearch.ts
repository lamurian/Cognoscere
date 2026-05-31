/**
 * fetch_reputable_web tool — searches .edu, .ac.*, .gov, and university websites.
 *
 * Uses a Python script via ddgs (DuckDuckGo Search) with domain filtering.
 * Falls back to unfiltered results if no reputable sources are found.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

/** Python script shared across invocations (inlined for portability). */
const PY_SCRIPT = `
import sys, json, re
try:
    from ddgs import DDGS
except ImportError:
    print(json.dumps({"error": "Python 'ddgs' library not found. Install: pip install ddgs"}))
    sys.exit(0)

try:
    q = sys.argv[1]
    results = []
    seen_urls = set()

    with DDGS() as ddgs:
        # Strategy 1: search with site: filters targeting .edu and .ac.uk
        for site_filter in ["site:edu", "site:ac.uk"]:
            for r in ddgs.text(f"{site_filter} {q}", max_results=5):
                url = r.get("href", "") or ""
                if url and url not in seen_urls:
                    seen_urls.add(url)
                    results.append({
                        "title": r.get("title", ""),
                        "url": url,
                        "snippet": r.get("body", ""),
                    })

        # Strategy 2: general search, post-filter for edu/ac/gov domains
        pat = re.compile(r"\\.(edu|ac\\.[a-z]{2,}|gov\\.[a-z]{2,}|go\\.[a-z]{2,})", re.I)
        for r in ddgs.text(q, max_results=25):
            url = r.get("href", "") or ""
            if url and url not in seen_urls and pat.search(url):
                seen_urls.add(url)
                results.append({
                    "title": r.get("title", ""),
                    "url": url,
                    "snippet": r.get("body", ""),
                })

        # Strategy 3: if still no results, return general top results
        if not results:
            for r in ddgs.text(q, max_results=5):
                url = r.get("href", "") or ""
                if url and url not in seen_urls:
                    seen_urls.add(url)
                    results.append({
                        "title": r.get("title", ""),
                        "url": url,
                        "snippet": r.get("body", ""),
                    })

    print(json.dumps(results[:10]))
except Exception as e:
    print(json.dumps({"error": str(e)}))
`.trim();

/**
 * Register the fetch_reputable_web tool.
 */
export function registerWebSearchTool(pi: ExtensionAPI): void {
  pi.registerTool({
    name: "fetch_reputable_web",
    label: "Fetch Reputable Web",
    description:
      "Search the web for information from .edu, .ac.*, .gov, .go.*, and university websites. " +
      "Use only when search_para_docs returned no results and after /skill:brainstorm has refined the query.",
    promptSnippet: "Search reputable web sources (.edu, .ac.*, .gov, universities) for information",
    promptGuidelines: [
      "Use fetch_reputable_web only after search_para_docs returned no results.",
      "Run /skill:brainstorm first to refine the query before searching.",
      "Cite every result using markdown footnotes (e.g. [^1]) with the page title and URL.",
    ],
    parameters: Type.Object({
      query: Type.String({ description: "The search query" }),
    }),

    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      try {
        const r = await pi.exec("python3", ["-c", PY_SCRIPT, params.query], { timeout: 30_000 });
        if (r.code !== 0) throw new Error(r.stderr || `exit code ${r.code}`);

        const data = JSON.parse(r.stdout);

        if (data && data.error) {
          const fallbackUrl =
            `https://duckduckgo.com/?q=${encodeURIComponent(`(site:edu OR site:ac.* OR site:gov) ${params.query}`)}`;
          return {
            content: [
              {
                type: "text" as const,
                text: `Web search unavailable: ${data.error}\n\nTry manually:\n${fallbackUrl}`,
              },
            ],
            details: { error: data.error, fallbackUrl },
          };
        }

        if (!data || !data.length) {
          const fallbackUrl =
            `https://duckduckgo.com/?q=${encodeURIComponent(`(site:edu OR site:ac.* OR site:gov) ${params.query}`)}`;
          return {
            content: [
              {
                type: "text" as const,
                text: `No results from reputable sources. Try manually:\n${fallbackUrl}`,
              },
            ],
            details: { count: 0, fallbackUrl },
          };
        }

        const text = data
          .map(
            (r: { title: string; url: string; snippet?: string }, i: number) =>
              `${i + 1}. [${r.title}](${r.url})${r.snippet ? `\n   ${(r.snippet || "").slice(0, 200)}` : ""}`,
          )
          .join("\n\n");

        return {
          content: [
            {
              type: "text" as const,
              text: `Results for "${params.query}" from reputable sources:\n\n${text}`,
            },
          ],
          details: { results: data, count: data.length },
        };
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        const fallbackUrl =
          `https://duckduckgo.com/?q=${encodeURIComponent(`(site:edu OR site:ac.* OR site:gov) ${params.query}`)}`;
        return {
          content: [
            {
              type: "text" as const,
              text: `Search failed (${msg}). Try:\n${fallbackUrl}`,
            },
          ],
          details: { error: msg, fallbackUrl },
        };
      }
    },
  });
}
