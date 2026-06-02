/**
 * SearXNG search backend for web-search extension.
 * Primary search via Docker container on port 8888.
 */

const SEARXNG_PORT = parseInt(process.env.SEARXNG_PORT || "8888", 10);

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source_label: string;
  tier: number;
}

/**
 * Query SearXNG JSON API via POST.
 * Tier mapping:
 *   1 — academic engines (openalex, pubmed, semanticscholar, arxiv)
 *   2 — duckduckgo with site: filters + archlinux
 *   3 — duckduckgo general
 */
export async function searchSearxng(
  query: string,
  tier: number,
  signal?: AbortSignal,
): Promise<SearchResult[]> {
  const baseUrl = `http://127.0.0.1:${SEARXNG_PORT}/search`;
  const params: Record<string, string> = { q: query, format: "json", language: "en", pageno: "1" };

  if (tier === 1) params.engines = "openalex,pubmed,semanticscholar,arxiv";
  else if (tier === 2) {
    params.q = `${query} site:edu OR site:ac.* OR site:gov OR site:go.* OR site:mil`;
    params.engines = "duckduckgo,archlinux";
  } else params.engines = "duckduckgo";

  let response: Response;
  try {
    response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(params),
      signal,
    });
  } catch { return []; }
  if (!response.ok) return [];

  let data: { results?: Array<Record<string, unknown>> };
  try { data = (await response.json()) as typeof data; } catch { return []; }

  return (data.results ?? []).slice(0, 10).map((r) => ({
    title: (r.title as string) ?? "",
    url: (r.url as string) ?? "",
    snippet: ((r.content as string) ?? "").replace(/<[^>]*>/g, "").slice(0, 300),
    source_label: (r.engine as string) ?? "SearXNG",
    tier,
  }));
}
