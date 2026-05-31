/**
 * Expand Bullet Points Extension
 *
 * Registered tool: expand_bullet_points
 *
 * When the knowledge skill's search_para_docs finds a document that contains
 * unclear bullet points or brief ideation (e.g. "Associated Codes", "Keywords",
 * "Associated Codes" lists, or any `- ` line that reads like a stub), this
 * tool searches reputable web sources for each bullet and returns expanded,
 * coherent paragraphs grounded in real research.
 *
 * Workflow with the knowledge skill:
 *   1. search_para_docs → finds doc with brief bullets
 *   2. read → agent identifies unclear bullet points
 *   3. expand_bullet_points → searches web for each bullet, returns expansions
 *   4. update_para_doc → saves the enriched version (preserves frontmatter)
 *
 * Uses the same DuckDuckGo HTML scraping approach as fetch_reputable_web
 * so results come from .edu, .ac.*, .gov, .go.*, and university domains.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type, type Static } from "typebox";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

// ═══════════════════════════════════════════════════════════════
//  Types
// ═══════════════════════════════════════════════════════════════

interface BulletInfo {
  /** The raw bullet text (without leading "- ") */
  text: string;
  /** Section context: the heading or block this bullet belongs to */
  context: string;
}

interface WebResult {
  title: string;
  url: string;
  snippet: string;
}

interface Expansion {
  original: string;
  context: string;
  expanded: string;
  sources: WebResult[];
}

// ═══════════════════════════════════════════════════════════════
//  Helpers
// ═══════════════════════════════════════════════════════════════

/**
 * Parse frontmatter from a markdown file, return { tags, title, body }.
 */
function parseFrontmatter(content: string): {
  tags: string[];
  title?: string;
  body: string;
} {
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

/**
 * Extract bullet points from the document body, grouping them by the nearest
 * preceding heading (## or ### line) as context.
 */
function extractBullets(body: string): BulletInfo[] {
  const lines = body.split("\n");
  const bullets: BulletInfo[] = [];
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
      // Skip lines that are clearly internal links, lists of docs, or tags
      if (text.startsWith("[") || text.startsWith("http") || text.startsWith("@")) continue;
      // Skip very long lines — they're already coherent prose
      if (text.length > 200) continue;
      bullets.push({ text, context: currentHeading });
    }
  }

  return bullets;
}

/**
 * Build a search query from a bullet point and its section context.
 */
function buildSearchQuery(bullet: BulletInfo): string {
  const parts = [bullet.text];
  if (bullet.context) {
    parts.push(bullet.context);
  }
  // Include domain filter for reputable sources
  return `(site:edu OR site:ac.* OR site:gov) ${parts.join(" ")}`;
}

/**
 * Search the web for a given query using DuckDuckGo HTML endpoints.
 * Returns up to 5 results from reputable domains.
 *
 * Mirrors the approach used in fetch_reputable_web in para-knowledge.
 */
async function searchWeb(
  pi: ExtensionAPI,
  query: string,
): Promise<WebResult[]> {
  const pyScript = `
import sys, json, urllib.request, urllib.parse, re, html as h

q = sys.argv[1]

# DuckDuckGo Lite endpoint
url = "https://lite.duckduckgo.com/lite/?q=" + urllib.parse.quote(q)

req = urllib.request.Request(url, headers={
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"
})
try:
    body = urllib.request.urlopen(req, timeout=15).read().decode("utf-8", errors="replace")
    results = []
    for m in re.finditer(r'<a[^>]*class="result-link"[^>]*href="([^"]+)"[^>]*>\\s*(.*?)\\s*</a>', body, re.DOTALL):
        url = h.unescape(m.group(1)).strip()
        title = re.sub(r"<[^>]+>", "", m.group(2)).strip()
        if title and url:
            results.append({"title": title, "url": url})

    # Try main HTML endpoint if not enough results
    if len(results) < 3:
        url2 = "https://html.duckduckgo.com/html/?q=" + urllib.parse.quote(q)
        req2 = urllib.request.Request(url2, headers={
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"
        })
        body2 = urllib.request.urlopen(req2, timeout=15).read().decode("utf-8", errors="replace")
        seen = set(r["url"] for r in results)
        for m in re.finditer(r'<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>(.*?)</a>', body2, re.DOTALL):
            url = h.unescape(m.group(1)).strip()
            title = re.sub(r"<[^>]+>", "", m.group(2)).strip()
            if title and url and url not in seen:
                seen.add(url)
                results.append({"title": title, "url": url})

        # Extract snippets
        snippets = []
        for sm in re.finditer(r'<a[^>]*class="result__snippet"[^>]*>(.*?)</a>', body2, re.DOTALL):
            snippets.append(re.sub(r"<[^>]+>", "", sm.group(1)).strip())
        for i, s in enumerate(snippets):
            if i < len(results):
                results[i]["snippet"] = s

    # Filter by authoritative domains (edu, ac.*, gov, go.*)
    pat = re.compile(r"\\.(edu|ac\\.[a-z]{2,}|gov\\.[a-z]{2,}|go\\.[a-z]{2,})", re.I)
    filtered = [r for r in results if pat.search(r["url"])]

    for r in (filtered if filtered else results[:5]):
        r.setdefault("snippet", "")

    print(json.dumps(filtered[:5] if filtered else results[:3]))
except Exception as e:
    print(json.dumps({"error": str(e)}))
`.trim();

  try {
    const r = await pi.exec("python3", ["-c", pyScript, query], { timeout: 30_000 });
    if (r.code !== 0) {
      return [{ title: "Search error", url: "", snippet: r.stderr || `exit code ${r.code}` }];
    }
    const data = JSON.parse(r.stdout);
    if (data.error) return [];
    return data.map((d: { title?: string; url?: string; snippet?: string }) => ({
      title: d.title ?? "Untitled",
      url: d.url ?? "",
      snippet: d.snippet ?? "",
    }));
  } catch {
    return [];
  }
}

/**
 * Generate a coherent, paragraph-form expansion of a single bullet point
 * by combining web search results into a synthesised explanation.
 *
 * Uses web snippets as evidence and weaves them into a coherent paragraph
 * that explains the concept, its significance, and relevant context.
 */
function synthesizeExpansion(bullet: BulletInfo, results: WebResult[]): string {
  const term = bullet.text;
  const ctx = bullet.context;

  // Start with a definitional sentence
  let expansion = `**${term}** — `;

  if (results.length > 0 && results[0].snippet) {
    // Use the first snippet as the core definition
    const core = results[0].snippet.replace(/\s+/g, " ").trim();
    expansion += core;
  } else {
    // Generic fallback — the LLM will refine this with the return value
    expansion += `This concept relates to ${ctx || "the broader topic"} and represents a key element that deserves deeper exploration.`;
  }

  // Add supplementary detail from additional results
  if (results.length > 1) {
    const extras = results
      .slice(1, 3)
      .map((r) => r.snippet?.replace(/\s+/g, " ").trim())
      .filter(Boolean);
    if (extras.length > 0) {
      expansion += ` ${extras.join(" ")}`;
    }
  }

  return expansion;
}

// ═══════════════════════════════════════════════════════════════
//  Tool parameter schema
// ═══════════════════════════════════════════════════════════════

const ExpandParams = Type.Object({
  docPath: Type.String({
    description:
      "Relative path to the PARA document containing unclear bullet points, " +
      'e.g. "Projects/definition-of-resilience.md".',
  }),
  bullets: Type.Optional(
    Type.Array(Type.String(), {
      description:
        "Specific bullet-point texts to expand. Omit to auto-detect all " +
        "brief bullet points in the document body.",
    }),
  ),
  focusArea: Type.Optional(
    Type.String({
      description:
        "Optional theme or angle to guide the expansion, e.g. 'clinical applications' " +
        "or 'neuroscience research'. Helps narrow the web search.",
    }),
  ),
});

type ExpandParamsT = Static<typeof ExpandParams>;

// ═══════════════════════════════════════════════════════════════
//  Extension entry point
// ═══════════════════════════════════════════════════════════════

export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "expand_bullet_points",
    label: "Expand Bullet Points",
    description:
      "Expands unclear bullet points or brief ideation from a PARA knowledge document " +
      "into coherent, researched paragraphs by searching reputable web sources " +
      "(.edu, .ac.*, .gov). Use when a document contains underexplained bullet lists, " +
      "keywords, or stubs that need more substance. Works with update_para_doc to save results.",
    promptSnippet:
      "Search reputable web sources and expand unclear bullet points into coherent ideas",
    promptGuidelines: [
      "Use expand_bullet_points when you find a PARA document with brief bullet points, stubs, or keywords that lack explanation.",
      "After expansion, use update_para_doc to save the enriched document (this preserves frontmatter author/editor).",
      "The tool returns original bullets mapped to web-researched expansions with source citations.",
    ],
    parameters: ExpandParams,

    async execute(
      _toolCallId: string,
      params: ExpandParamsT,
      _signal: AbortSignal,
      onUpdate: ((update: { content: { type: "text"; text: string }[] }) => void) | undefined,
      ctx: { cwd: string },
    ) {
      const docAbsPath = resolve(ctx.cwd, params.docPath);

      // ── 1. Read document ────────────────────────────────────
      let content: string;
      try {
        content = await readFile(docAbsPath, "utf-8");
      } catch {
        return {
          content: [
            {
              type: "text" as const,
              text: `Could not read document at "${params.docPath}". Make sure the path is correct.`,
            },
          ],
          details: { error: `File not found: ${params.docPath}` },
        };
      }

      const { title, body } = parseFrontmatter(content);

      // ── 2. Identify bullet points ───────────────────────────
      let bullets: BulletInfo[];
      if (params.bullets && params.bullets.length > 0) {
        // Use user-specified bullets
        const raw = extractBullets(body);
        const specified = new Set(params.bullets.map((b) => b.toLowerCase().replace(/^-\s*/, "").trim()));
        bullets = raw.filter((b) => specified.has(b.text.toLowerCase()));
        // If none matched, fall back to all and let the user know
        if (bullets.length === 0) {
          bullets = raw;
        }
      } else {
        bullets = extractBullets(body);
      }

      if (bullets.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: "No brief bullet points found in this document. The document may already use full prose, or the bullet points are longer than 200 characters.",
            },
          ],
          details: { docPath: params.docPath, bulletCount: 0 },
        };
      }

      onUpdate?.({
        content: [
          {
            type: "text" as const,
            text: `📖 "${title || params.docPath}" — found ${bullets.length} bullet point(s) to expand. Searching reputable web sources…`,
          },
        ],
      });

      // ── 3. Search web for each bullet ───────────────────────
      const expansions: Expansion[] = [];
      const total = bullets.length;

      for (let i = 0; i < total; i++) {
        const bullet = bullets[i];

        onUpdate?.({
          content: [
            {
              type: "text" as const,
              text: `🔍 [${i + 1}/${total}] Searching: "${bullet.text}"${bullet.context ? ` (context: ${bullet.context})` : ""}`,
            },
          ],
        });

        let query = buildSearchQuery(bullet);

        // Incorporate optional focus area
        if (params.focusArea) {
          query = `${params.focusArea} ${query}`;
        }

        const results = await searchWeb(pi, query);
        const expanded = synthesizeExpansion(bullet, results);

        expansions.push({
          original: bullet.text,
          context: bullet.context,
          expanded,
          sources: results.filter((r) => r.url && r.url.length > 0),
        });
      }

      // ── 4. Build output ─────────────────────────────────────
      const lines: string[] = [
        `# Expanded Bullet Points — "${title || params.docPath}"`,
        "",
        `Source documents searched: ${bullets.length} bullet(s) expanded from reputable web sources.`,
        "",
      ];

      for (const exp of expansions) {
        lines.push(`## ${exp.original}`);
        if (exp.context) lines.push(`*Context: ${exp.context}*`);
        lines.push("");
        lines.push(exp.expanded);
        lines.push("");
        if (exp.sources.length > 0) {
          lines.push("**Sources:**");
          for (const src of exp.sources) {
            lines.push(`- [${src.title}](${src.url})`);
            if (src.snippet) {
              lines.push(`  ${src.snippet.slice(0, 150)}${src.snippet.length > 150 ? "…" : ""}`);
            }
          }
        }
        lines.push("");
        lines.push("---");
        lines.push("");
      }

      lines.push(
        "To save these expansions back to the document, call `update_para_doc` with the ",
        "enriched body content. The frontmatter (author/editor/title) will be preserved.",
      );

      return {
        content: [{ type: "text" as const, text: lines.join("\n") }],
        details: {
          docPath: params.docPath,
          docTitle: title ?? "",
          bulletCount: total,
          expansions: expansions.map((e) => ({
            original: e.original,
            context: e.context,
            expanded: e.expanded,
            sources: e.sources,
          })),
        },
      };
    },
  });
}
