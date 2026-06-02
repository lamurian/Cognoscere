/**
 * Link Summarizer Extension
 *
 * Uses Obscura (headless browser, CDP WebSocket protocol) as the primary
 * engine for HTML content extraction. Obscura executes JavaScript (V8),
 * renders the DOM, and converts to clean Markdown via the LP.getMarkdown
 * CDP method — giving consistent results across server-rendered and
 * JS-heavy SPAs.
 *
 * Obscura runs as a Docker service alongside SearXNG:
 *   docker compose -f search-stack/docker-compose.yml up -d
 *
 * Falls back to simple HTTP fetch + text stripping when Obscura is not
 * running or reachable.
 *
 * **PDF support:** Detects PDF URLs (by extension or Content-Type header)
 * and extracts text using `pdftotext` (from poppler-utils). The extracted
 * text is returned as plain Markdown.
 *
 * Designed to be used by the `summarize-link` skill:
 *
 *   fetch → read markdown → summarize → create_para_doc
 */

import { execSync } from "node:child_process";
import { writeFile, unlink, mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

// ── Constants ──────────────────────────────────────────────────────────

const MAX_CONTENT_CHARS = 80_000;
const MAX_HTTP_BODY_BYTES = 8_000_000;
const MAX_PDF_BYTES = 100_000_000;
const OBSCURA_CDP_URL = "ws://127.0.0.1:9222/devtools/browser";

const PDF_EXT_RE = /\.pdf(?:[?#].*)?$/i;
const PDF_PATH_RE = /\/pdf\/[\d.]+(?:v\d+)?(?:[?#].*)?$/i;
const PDF_CT_RE = /^application\/pdf/i;

// ══════════════════════════════════════════════════════════════════════
//  CDP Client — connects to Obscura headless browser via WebSocket
// ══════════════════════════════════════════════════════════════════════

class CdpConnection {
  private ws: WebSocket | null = null;
  private nextId = 1;
  private pending = new Map<
    number,
    { resolve: (v: any) => void; reject: (e: any) => void }
  >();
  private eventHandlers = new Map<string, (params: any) => void>();
  private timeoutMs: number;

  constructor(timeoutMs = 30_000) {
    this.timeoutMs = timeoutMs;
  }

  connect(url: string, connectTimeoutMs = 5_000): Promise<void> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("CDP connection timeout"));
      }, connectTimeoutMs);
      try {
        this.ws = new WebSocket(url);
        this.ws.onopen = () => {
          clearTimeout(timer);
          resolve();
        };
        this.ws.onerror = () => {
          clearTimeout(timer);
          reject(new Error("CDP connection error"));
        };
        this.ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data as string);
            if (msg.id !== undefined && this.pending.has(msg.id)) {
              const h = this.pending.get(msg.id)!;
              this.pending.delete(msg.id);
              if (msg.error) h.reject(new Error(msg.error.message));
              else h.resolve(msg.result);
            } else if (msg.method && this.eventHandlers.has(msg.method)) {
              this.eventHandlers.get(msg.method)!(msg.params);
            }
          } catch {
            /* malformed message, ignore */
          }
        };
        this.ws.onclose = () => {
          for (const [, h] of this.pending) {
            h.reject(new Error("CDP connection closed"));
          }
          this.pending.clear();
        };
      } catch (err) {
        clearTimeout(timer);
        reject(err);
      }
    });
  }

  async send(
    method: string,
    params: Record<string, unknown> = {},
    sessionId?: string,
  ): Promise<any> {
    const id = this.nextId++;
    const msg: Record<string, unknown> = { id, method, params };
    if (sessionId) msg.sessionId = sessionId;
    this.ws!.send(JSON.stringify(msg));
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`CDP timeout: ${method}`));
      }, this.timeoutMs);
      this.pending.set(id, {
        resolve: (v: any) => {
          clearTimeout(timer);
          resolve(v);
        },
        reject: (e: any) => {
          clearTimeout(timer);
          reject(e);
        },
      });
    });
  }

  on(event: string, handler: (params: any) => void): void {
    this.eventHandlers.set(event, handler);
  }

  close(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// ══════════════════════════════════════════════════════════════════════
//  Obscura CDP extraction — primary for HTML pages
// ══════════════════════════════════════════════════════════════════════

/**
 * Fetch a URL via Obscura's CDP server using LP.getMarkdown.
 * Returns null if Obscura is not running or the page fails to load.
 */
async function tryObscura(
  url: string,
  signal?: AbortSignal,
): Promise<{ title: string; markdown: string } | null> {
  if (signal?.aborted) return null;

  const cdp = new CdpConnection(30_000);
  try {
    await cdp.connect(OBSCURA_CDP_URL, 5_000);

    const { targetId } = await cdp.send("Target.createTarget", {
      url: "about:blank",
    });
    if (!targetId) return null;

    const { sessionId } = await cdp.send("Target.attachToTarget", {
      targetId,
      flatten: true,
    });
    if (!sessionId) {
      await cdp.send("Target.closeTarget", { targetId }).catch(() => {});
      return null;
    }

    await cdp.send("Page.enable", {}, sessionId);

    // Wait for load event
    let loaded = false;
    const loadEvent = new Promise<void>((resolve) => {
      cdp.on("Page.loadEventFired", () => {
        loaded = true;
        resolve();
      });
      cdp.on("Page.frameStoppedLoading", () => {
        if (!loaded) {
          loaded = true;
          resolve();
        }
      });
    });

    await cdp.send("Page.navigate", { url }, sessionId);

    // Race: load vs abort
    await Promise.race([
      loadEvent,
      new Promise<void>((_, reject) => {
        if (signal) {
          signal.addEventListener(
            "abort",
            () => reject(new Error("Aborted")),
            { once: true },
          );
        }
      }),
    ]);

    // Get native Markdown via Obscura's custom CDP method
    const result = await cdp.send("LP.getMarkdown", {}, sessionId);
    await cdp.send("Target.closeTarget", { targetId }).catch(() => {});

    const markdown = (result?.markdown as string)?.trim();
    if (!markdown) return null;

    const titleMatch = markdown.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : "(untitled)";

    return { title, markdown };
  } catch {
    return null;
  } finally {
    cdp.close();
  }
}

// ══════════════════════════════════════════════════════════════════════
//  PDF extraction via pdftotext
// ══════════════════════════════════════════════════════════════════════

function isPdfUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return PDF_EXT_RE.test(parsed.pathname) || PDF_PATH_RE.test(parsed.pathname);
  } catch {
    return false;
  }
}

function extractPdfTitle(text: string): string {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 10);
  return lines[0] ?? "(PDF document)";
}

async function checkPdfContentType(
  url: string,
  signal?: AbortSignal,
): Promise<boolean> {
  try {
    const resp = await fetch(url, {
      method: "HEAD",
      signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; PiSummarizer/1.0; +https://github.com/lam/pi-extensions)",
      },
      redirect: "follow",
    });
    const ct = resp.headers.get("content-type") ?? "";
    return PDF_CT_RE.test(ct);
  } catch {
    return false;
  }
}

async function tryExtractPdf(
  url: string,
  signal?: AbortSignal,
): Promise<{ title: string; text: string } | null> {
  const urlLooksLikePdf = isPdfUrl(url);
  if (!urlLooksLikePdf) {
    const isPdfByContentType = await checkPdfContentType(url, signal);
    if (!isPdfByContentType) return null;
  }

  // Check pdftotext availability
  try {
    execSync("which pdftotext", { stdio: "ignore", timeout: 5_000 });
  } catch {
    return {
      title: "(PDF document)",
      text: "pdftotext not installed. Install poppler-utils to extract PDF content.",
    };
  }

  // Download PDF
  let response: Response;
  try {
    response = await fetch(url, {
      signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; PiSummarizer/1.0; +https://github.com/lam/pi-extensions)",
      },
      redirect: "follow",
    });
  } catch {
    return null;
  }

  if (!response.ok) return null;

  const reader = response.body?.getReader();
  if (!reader) return null;

  const chunks: Uint8Array[] = [];
  let totalSize = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      totalSize += value.length;
      if (totalSize > MAX_PDF_BYTES) {
        reader.cancel();
        return null;
      }
    }
  } catch {
    return null;
  }

  const pdfBuffer = Buffer.concat(chunks);
  let tmpDir: string | null = null;
  let tmpPath: string | null = null;

  try {
    tmpDir = await mkdtemp(join(tmpdir(), "pi-pdf-"));
    tmpPath = join(tmpDir, "document.pdf");
    await writeFile(tmpPath, pdfBuffer);

    const text = execSync(`pdftotext -layout "${tmpPath}" -`, {
      encoding: "utf-8",
      maxBuffer: MAX_CONTENT_CHARS * 2,
      timeout: 30_000,
      signal,
    }).trim();

    if (!text) {
      return {
        title: "(PDF document)",
        text: "PDF appears to contain no extractable text (possibly scanned).",
      };
    }

    return { title: extractPdfTitle(text), text };
  } catch {
    return null;
  } finally {
    if (tmpPath) try { await unlink(tmpPath); } catch { /* best effort */ }
    if (tmpDir) try { await rm(tmpDir, { recursive: true, force: true }); } catch { /* best effort */ }
  }
}

// ══════════════════════════════════════════════════════════════════════
//  Plain-HTTP fallback
// ══════════════════════════════════════════════════════════════════════

function extractReadableText(html: string): { title: string; text: string } {
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : "";

  let cleaned = html.replace(
    /<(script|style|svg|nav|header|footer|noscript|iframe)[^>]*>[\s\S]*?<\/\1>/gi,
    "",
  );
  cleaned = cleaned.replace(/<[^>]*>/g, " ");
  cleaned = cleaned
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&#\d+;/g, " ")
    .replace(/&[a-z]+;/g, " ");
  cleaned = cleaned
    .replace(/[\r\n]+/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { title, text: cleaned };
}

async function fetchViaHttp(
  url: string,
  signal?: AbortSignal,
): Promise<{ title: string; text: string } | { error: string }> {
  let response: Response;
  try {
    response = await fetch(url, {
      signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; PiSummarizer/1.0; +https://github.com/lam/pi-extensions)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
  } catch (err: unknown) {
    return { error: `Fetch failed: ${err instanceof Error ? err.message : String(err)}` };
  }

  if (!response.ok) {
    return { error: `HTTP ${response.status} ${response.statusText}` };
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (PDF_CT_RE.test(contentType)) {
    return { error: "PDF_CONTENT_TYPE" };
  }

  const reader = response.body?.getReader();
  if (!reader) return { error: "No response body" };

  const chunks: Uint8Array[] = [];
  let totalSize = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      totalSize += value.length;
      if (totalSize > MAX_HTTP_BODY_BYTES) {
        reader.cancel();
        break;
      }
    }
  } catch (err: unknown) {
    return { error: `Error reading body: ${err instanceof Error ? err.message : String(err)}` };
  }

  const html = new TextDecoder().decode(
    chunks.reduce(
      (acc, c) => {
        const merged = new Uint8Array(acc.length + c.length);
        merged.set(acc);
        merged.set(c, acc.length);
        return merged;
      },
      new Uint8Array(0),
    ),
  );

  const { title, text } = extractReadableText(html);
  if (!text.trim()) {
    return {
      error:
        "No readable text extracted. The page may require JavaScript — " +
        "start the Docker stack (docker compose -f search-stack/docker-compose.yml up -d) for full Obscura browser support.",
    };
  }

  return { title, text };
}

// ══════════════════════════════════════════════════════════════════════
//  Tool registration
// ══════════════════════════════════════════════════════════════════════

function formatContent(
  title: string,
  url: string,
  body: string,
  engine: string,
  length: number,
  truncated: boolean,
): string {
  return (
    `📄 **${title}**\n🔗 ${url}\n` +
    `${engine} · ${length.toLocaleString()} chars` +
    (truncated ? ` (truncated to ${MAX_CONTENT_CHARS.toLocaleString()})` : "") +
    `\n\n━━━ Content ━━━\n\n${body}`
  );
}

export default function (pi: ExtensionAPI) {
  const hasDocker =
    process.env.OBSCURA_PORT || process.env.SEARXNG_PORT;
  console.log(
    `[link-summarizer] ✓ Obscura CDP + HTTP fallback` +
      (hasDocker ? "" : " (no Docker env vars — will try CDP directly)"),
  );

  pi.registerTool({
    name: "fetch_url",
    label: "Fetch URL",
    description:
      "Fetch a URL and get its content as Markdown. " +
      "HTML pages are rendered via Obscura headless browser (CDP WebSocket, LP.getMarkdown). " +
      "Falls back to plain HTTP + text stripping when Obscura is not running. " +
      "For PDF URLs, uses pdftotext to extract text. " +
      "Obscura runs in Docker: docker compose -f search-stack/docker-compose.yml up -d",
    promptSnippet: "Fetch a URL and get its content as Markdown",
    promptGuidelines: [
      "Use fetch_url when the user shares a link they want processed.",
      "After fetching, read the returned content, summarize it, and save as a PARA document via create_para_doc.",
      "For PDF files, fetch_url automatically uses pdftotext to extract text.",
    ],
    parameters: Type.Object({
      url: Type.String({
        description: "The URL to fetch and extract content from",
      }),
    }),

    async execute(_toolCallId, params, signal, _onUpdate, _ctx) {
      const { url } = params;

      // ── 1. Validate URL ──
      let parsed: URL;
      try {
        parsed = new URL(url);
      } catch {
        return {
          content: [{ type: "text", text: `Invalid URL: ${url}` }],
          details: {},
          isError: true,
        };
      }
      if (!["http:", "https:"].includes(parsed.protocol)) {
        return {
          content: [
            {
              type: "text",
              text: `Unsupported protocol: ${parsed.protocol}. Only http and https allowed.`,
            },
          ],
          details: {},
          isError: true,
        };
      }

      // ── 2. PDF path ──
      if (isPdfUrl(url)) {
        const pdfResult = await tryExtractPdf(url, signal);
        if (pdfResult) {
          const { title, text } = pdfResult;
          const truncated = text.length > MAX_CONTENT_CHARS;
          const body = truncated
            ? text.slice(0, MAX_CONTENT_CHARS) +
              `\n\n[... content truncated to ${MAX_CONTENT_CHARS.toLocaleString()} characters ...]`
            : text;

          return {
            content: [
              {
                type: "text",
                text: formatContent(
                  title,
                  url,
                  body,
                  "📕 PDF extracted via pdftotext",
                  text.length,
                  truncated,
                ),
              },
            ],
            details: {
              engine: "pdftotext",
              title,
              url,
              extractedLength: text.length,
              truncated,
            },
          };
        }
      }

      // ── 3. Obscura CDP (primary for HTML) ──
      const obsResult = await tryObscura(url, signal);
      if (obsResult) {
        const { title, markdown } = obsResult;
        const truncated = markdown.length > MAX_CONTENT_CHARS;
        const body = truncated
          ? markdown.slice(0, MAX_CONTENT_CHARS) +
            `\n\n[... content truncated to ${MAX_CONTENT_CHARS.toLocaleString()} characters ...]`
          : markdown;

        return {
          content: [
            {
              type: "text",
              text: formatContent(
                title,
                url,
                body,
                "🔍 Obscura headless browser",
                markdown.length,
                truncated,
              ),
            },
          ],
          details: {
            engine: "obscura-cdp",
            title,
            url,
            extractedLength: markdown.length,
            truncated,
          },
        };
      }

      // ── 4. Fallback: plain HTTP ──
      const httpResult = await fetchViaHttp(url, signal);
      if ("error" in httpResult) {
        // PDF detected by Content-Type — route to pdftotext
        if (httpResult.error === "PDF_CONTENT_TYPE") {
          const pdfResult = await tryExtractPdf(url, signal);
          if (pdfResult) {
            const { title, text } = pdfResult;
            const truncated = text.length > MAX_CONTENT_CHARS;
            const body = truncated
              ? text.slice(0, MAX_CONTENT_CHARS) +
                `\n\n[... content truncated to ${MAX_CONTENT_CHARS.toLocaleString()} characters ...]`
              : text;

            return {
              content: [
                {
                  type: "text",
                  text: formatContent(
                    title,
                    url,
                    body,
                    "📕 PDF extracted via pdftotext",
                    text.length,
                    truncated,
                  ),
                },
              ],
              details: {
                engine: "pdftotext",
                title,
                url,
                extractedLength: text.length,
                truncated,
              },
            };
          }
        }

        return {
          content: [
            {
              type: "text",
              text:
                `Obscura not available and HTTP fallback failed.\n\n` +
                `🔗 ${url}\n⚠️ ${httpResult.error}` +
                `\n\n💡 Start the Docker stack: docker compose -f search-stack/docker-compose.yml up -d`,
            },
          ],
          details: { url, error: httpResult.error },
          isError: true,
        };
      }

      const { title, text } = httpResult;
      const truncated = text.length > MAX_CONTENT_CHARS;
      const body = truncated
        ? text.slice(0, MAX_CONTENT_CHARS) +
          `\n\n[... content truncated to ${MAX_CONTENT_CHARS.toLocaleString()} characters ...]`
        : text;

      return {
        content: [
          {
            type: "text",
            text: formatContent(
              title || "(no title)",
              url,
              body,
              "⚠️ HTTP fallback (Obscura not available)",
              text.length,
              truncated,
            ),
          },
        ],
        details: {
          engine: "http-fallback",
          title,
          url,
          extractedLength: text.length,
          truncated,
        },
      };
    },
  });
}
