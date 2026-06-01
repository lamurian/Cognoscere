/**
 * Link Summarizer Extension
 *
 * Uses Lightpanda (headless browser in Zig) as the primary engine for HTML
 * content extraction. Lightpanda executes JavaScript (V8), renders the DOM,
 * and dumps as clean Markdown — giving consistent results across server-
 * rendered and JS-heavy SPAs.
 *
 * Falls back to simple HTTP fetch + HTML stripping when Lightpanda is not
 * installed.
 *
 * **PDF support:** Detects PDF URLs (by extension or Content-Type header)
 * and extracts text using `pdftotext` (from poppler-utils). The extracted
 * text is returned as plain Markdown.
 *
 * Designed to be used by the `summarize-link` skill:
 *
 *   fetch → read markdown → summarize → create_para_doc
 */

import { spawn, execSync } from "node:child_process";
import { writeFile, unlink, mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

// ── Constants ──────────────────────────────────────────────────────────

/** Markdown content returned by Lightpanda or the fallback is truncated to
 * this many characters to keep LLM responses manageable. */
const MAX_CONTENT_CHARS = 80_000;

/** HTTP response body limit before we give up reading (8 MB). With Lightpanda
 * we don't hit this path often, but the fallback needs it. */
const MAX_HTTP_BODY_BYTES = 8_000_000;

/** Maximum PDF file size we'll download (100 MB). */
const MAX_PDF_BYTES = 100_000_000;

/** Regex to detect PDF URLs by file extension (e.g. document.pdf). */
const PDF_EXT_RE = /\.pdf(?:[?#].*)?$/i;

/**
 * Regex to detect PDF URLs by path pattern.
 * Catches arxiv.org/pdf/... and similar knowledge-base PDF servers.
 */
const PDF_PATH_RE = /\/pdf\/[\d.]+(?:v\d+)?(?:[?#].*)?$/i;

/** Regex to detect PDF Content-Type from HTTP response headers. */
const PDF_CT_RE = /^application\/pdf/i;

// ── Lightpanda extraction ──────────────────────────────────────────────

/**
 * Try to extract page content using Lightpanda's `fetch --dump markdown`.
 *
 * Returns `null` if Lightpanda is not installed or the command fails
 * entirely, signalling the caller to fall back to plain HTTP.
 */
async function tryLightpanda(
  url: string,
  signal?: AbortSignal,
  timeoutMs = 30_000,
): Promise<{ title: string; markdown: string } | null> {
  return new Promise((resolve) => {
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
      {
        stdio: ["ignore", "pipe", "pipe"],
        signal,
        timeout: timeoutMs,
      },
    );

    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];

    child.stdout.on("data", (chunk: Buffer) => {
      stdoutChunks.push(chunk);
      // Guard against runaway output
      const total = stdoutChunks.reduce((s, c) => s + c.length, 0);
      if (total > MAX_CONTENT_CHARS * 2) {
        child.kill("SIGTERM");
      }
    });

    child.stderr.on("data", (chunk: Buffer) => {
      stderrChunks.push(chunk);
    });

    child.on("close", (code) => {
      if (code !== 0 && code !== null) {
        const stderr = Buffer.concat(stderrChunks).toString("utf-8").trim();
        console.error(`[link-summarizer] lightpanda exited code ${code}: ${stderr}`);
        resolve(null);
        return;
      }

      const markdown = Buffer.concat(stdoutChunks).toString("utf-8").trim();
      if (!markdown) {
        resolve(null);
        return;
      }

      // Extract title from the first H1 heading
      const titleMatch = markdown.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1].trim() : "(untitled)";

      resolve({ title, markdown });
    });

    child.on("error", (err: NodeJS.ErrnoException) => {
      // ENOENT means lightpanda binary not found
      if (err.code === "ENOENT") {
        resolve(null); // Fall back gracefully
      } else {
        console.error(`[link-summarizer] lightpanda spawn error:`, err.message);
        resolve(null);
      }
    });
  });
}

// ── PDF extraction via pdftotext ───────────────────────────────────────

/**
 * Check whether a URL likely points to a PDF (by extension or known pattern).
 */
function isPdfUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Check explicit .pdf extension OR path patterns like /pdf/ID
    return PDF_EXT_RE.test(parsed.pathname) || PDF_PATH_RE.test(parsed.pathname);
  } catch {
    return false;
  }
}

/**
 * Extract title from a PDF's text content by taking the first meaningful
 * line (usually the paper title on arxiv and similar).
 */
function extractPdfTitle(text: string): string {
  // Take first non-empty, non-trivial line as title
  const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 10);
  return lines[0] ?? "(PDF document)";
}

/**
 * Download a PDF and extract text using `pdftotext`.
 *
 * Returns null if the URL doesn't point to a PDF, if the download fails,
 * if pdftotext is unavailable, or if no text can be extracted.
 */
/**
 * Check if a URL likely serves a PDF by making a lightweight HEAD request.
 * Returns null on error (connection issues, etc.) — caller should fall through.
 */
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
    // HEAD request failed — can't determine; caller should fall through
    return false;
  }
}

async function tryExtractPdf(
  url: string,
  signal?: AbortSignal,
): Promise<{ title: string; text: string } | null> {
  // ── Check URL shape first (fast bail) ──
  const urlLooksLikePdf = isPdfUrl(url);
  if (!urlLooksLikePdf) {
    // Double-check via Content-Type header (catches arxiv-style /pdf/ID without .ext)
    const isPdfByContentType = await checkPdfContentType(url, signal);
    if (!isPdfByContentType) {
      return null;
    }
  }

  // ── Check pdftotext availability ──
  try {
    execSync("which pdftotext", { stdio: "ignore", timeout: 5_000 });
  } catch {
    return { title: "(PDF document)", text: "pdftotext not installed. Install poppler-utils to extract PDF content." };
  }

  // ── Download the PDF bytes ──
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
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[link-summarizer] PDF download failed: ${msg}`);
    return null;
  }

  if (!response.ok) {
    console.error(`[link-summarizer] PDF download HTTP ${response.status}`);
    return null;
  }

  // Read body as ArrayBuffer with size limit
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
        console.error(`[link-summarizer] PDF too large (>${MAX_PDF_BYTES} bytes)`);
        return null;
      }
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[link-summarizer] PDF read error: ${msg}`);
    return null;
  }

  // Combine chunks into a single Buffer
  const pdfBuffer = Buffer.concat(chunks);

  // ── Write to temp file and run pdftotext ──
  let tmpDir: string | null = null;
  let tmpPath: string | null = null;

  try {
    tmpDir = await mkdtemp(join(tmpdir(), "pi-pdf-"));
    tmpPath = join(tmpDir, "document.pdf");
    await writeFile(tmpPath, pdfBuffer);

    // pdftotext -layout preserves column layout (important for academic papers)
    const text = execSync(`pdftotext -layout "${tmpPath}" -`, {
      encoding: "utf-8",
      maxBuffer: MAX_CONTENT_CHARS * 2,
      timeout: 30_000,
      signal,
    }).trim();

    if (!text) {
      return { title: "(PDF document)", text: "PDF appears to contain no extractable text (possibly scanned)." };
    }

    const title = extractPdfTitle(text);

    return { title, text };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[link-summarizer] pdftotext failed: ${msg}`);
    return { title: "(PDF document)", text: `PDF text extraction failed: ${msg}` };
  } finally {
    // Clean up temp files and directory
    if (tmpPath) {
      try { await unlink(tmpPath); } catch { /* best effort */ }
    }
    if (tmpDir) {
      try { await rm(tmpDir, { recursive: true, force: true }); } catch { /* best effort */ }
    }
  }
}

// ── Plain-HTTP fallback ────────────────────────────────────────────────

/**
 * Strip HTML tags and return clean text.
 * Also extracts the <title> for reference.
 */
function extractReadableText(html: string): { title: string; text: string } {
  // Extract <title>
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : "";

  // Remove <script>, <style>, <svg>, <nav>, <header>, <footer> blocks
  let cleaned = html.replace(
    /<(script|style|svg|nav|header|footer|noscript|iframe)[^>]*>[\s\S]*?<\/\1>/gi,
    "",
  );

  // Remove HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, " ");

  // Decode common entities
  cleaned = cleaned
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&#\d+;/g, " ")
    .replace(/&[a-z]+;/g, " ");

  // Collapse whitespace
  cleaned = cleaned
    .replace(/[\r\n]+/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { title, text: cleaned };
}

/**
 * Fallback: fetch URL via plain HTTP and extract text with regex.
 * Returns plain text (not markdown) with the same { title, text } shape.
 */
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
    const msg = err instanceof Error ? err.message : String(err);
    return { error: `Fetch failed: ${msg}` };
  }

  if (!response.ok) {
    return {
      error: `HTTP ${response.status} ${response.statusText}`,
    };
  }

  // Check Content-Type — if it's a PDF, redirect to pdftotext path
  const contentType = response.headers.get("content-type") ?? "";
  if (PDF_CT_RE.test(contentType)) {
    return { error: "PDF_CONTENT_TYPE" };
  }

  // Read body with size limit
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
    const msg = err instanceof Error ? err.message : String(err);
    return { error: `Error reading body: ${msg}` };
  }

  const html = new TextDecoder().decode(
    chunks.reduce((acc, c) => {
      const merged = new Uint8Array(acc.length + c.length);
      merged.set(acc);
      merged.set(c, acc.length);
      return merged;
    }, new Uint8Array(0)),
  );

  const { title, text } = extractReadableText(html);
  if (!text.trim()) {
    return {
      error:
        "No readable text extracted. The page may require JavaScript — " +
        "install Lightpanda (https://github.com/lightpanda-io/browser) for full support.",
    };
  }

  return { title, text };
}

// ── Tool registration ──────────────────────────────────────────────────

export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "fetch_url",
    label: "Fetch URL",
    description:
      "Fetch a URL, render the page with a headless browser (Lightpanda), " +
      "and return the content as clean Markdown. Falls back to plain HTTP + " +
      "HTML stripping if Lightpanda is not installed. " +
      "For PDF URLs (ending in .pdf), uses pdftotext to extract text. " +
      "Use this when the user shares a link they want summarized or saved.",
    promptSnippet: "Fetch a URL and get its content as Markdown",
    promptGuidelines: [
      "Use fetch_url when the user shares a link they want processed.",
      "After fetching, read the returned content, summarize it, and save as a PARA document via create_para_doc.",
      "For PDF files (ending in .pdf), fetch_url automatically uses pdftotext to extract text.",
    ],
    parameters: Type.Object({
      url: Type.String({ description: "The URL to fetch and extract content from" }),
    }),

    async execute(_toolCallId, params, signal, _onUpdate, _ctx) {
      const { url } = params;

      // ── 1. Validate URL ────────────────────────────────────────────
      let parsed: URL;
      try {
        parsed = new URL(url);
      } catch {
        return {
          content: [{ type: "text", text: `❌ Invalid URL: ${url}` }],
          details: {},
          isError: true,
        };
      }

      if (!["http:", "https:"].includes(parsed.protocol)) {
        return {
          content: [
            {
              type: "text",
              text: `❌ Unsupported protocol: ${parsed.protocol}. Only http and https are allowed.`,
            },
          ],
          details: {},
          isError: true,
        };
      }

      // ── 2. PDF path (tried first for PDF URLs) ────────────────────
      // Lightpanda can't render PDFs, so we detect and handle them specially.
      if (isPdfUrl(url)) {
        const pdfResult = await tryExtractPdf(url, signal);

        if (pdfResult) {
          const { title, text } = pdfResult;
          const truncated = text.length > MAX_CONTENT_CHARS;
          const body = truncated
            ? text.slice(0, MAX_CONTENT_CHARS) +
              `\n\n[... content truncated to ${MAX_CONTENT_CHARS.toLocaleString()} characters ...]`
            : text;

          // Wrap extracted text in a fenced code block or markdown quote
          const contentBody = body.includes("pdftotext not installed")
            ? body  // Show the error message directly
            : body;

          return {
            content: [
              {
                type: "text",
                text:
                  `📄 **${title}**\n` +
                  `🔗 ${url}\n` +
                  `📕 PDF extracted via pdftotext · ${text.length.toLocaleString()} chars` +
                  (truncated ? ` (truncated to ${MAX_CONTENT_CHARS.toLocaleString()})` : "") +
                  `\n\n━━━ Content ━━━\n\n${contentBody}`,
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

        // PDF extraction failed entirely — fall through to general methods
        // (rare: some PDF-serving endpoints don't have .pdf in URL)
      }

      // ── 3. Lightpanda path (primary for HTML) ──────────────────────
      const lpResult = await tryLightpanda(url, signal);

      if (lpResult) {
        const { title, markdown } = lpResult;
        const truncated = markdown.length > MAX_CONTENT_CHARS;
        const body = truncated
          ? markdown.slice(0, MAX_CONTENT_CHARS) +
            `\n\n[... content truncated to ${MAX_CONTENT_CHARS.toLocaleString()} characters ...]`
          : markdown;

        return {
          content: [
            {
              type: "text",
              text:
                `📄 **${title}**\n` +
                `🔗 ${url}\n` +
                `🦎 Lightpanda · ${markdown.length.toLocaleString()} chars` +
                (truncated ? ` (truncated to ${MAX_CONTENT_CHARS.toLocaleString()})` : "") +
                `\n\n━━━ Content ━━━\n\n${body}`,
            },
          ],
          details: {
            engine: "lightpanda",
            title,
            url,
            extractedLength: markdown.length,
            truncated,
          },
        };
      }

      // ── 4. Fallback: plain HTTP ────────────────────────────────────
      const httpResult = await fetchViaHttp(url, signal);

      if ("error" in httpResult) {
        // 4a. PDF content detected by Content-Type — route to pdftotext
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
                  text:
                    `📄 **${title}**\n` +
                    `🔗 ${url}\n` +
                    `📕 PDF extracted via pdftotext · ${text.length.toLocaleString()} chars` +
                    (truncated ? ` (truncated to ${MAX_CONTENT_CHARS.toLocaleString()})` : "") +
                    `\n\n━━━ Content ━━━\n\n${body}`,
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
                `❌ Lightpanda not available or failed, and HTTP fallback also failed.\n\n` +
                `🔗 ${url}\n⚠️ ${httpResult.error}` +
                `\n\n💡 Install Lightpanda for better results: https://github.com/lightpanda-io/browser`,
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
            text:
              `📄 Page: ${title || "(no title)"}\n` +
              `🔗 ${url}\n` +
              `⚠️ HTTP fallback (Lightpanda not available) · ${text.length.toLocaleString()} chars` +
              (truncated ? ` (truncated to ${MAX_CONTENT_CHARS.toLocaleString()})` : "") +
              `\n\n━━━ Content ━━━\n\n${body}`,
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
