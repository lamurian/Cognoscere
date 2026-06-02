/**
 * Link Summarizer Extension
 *
 * Uses Obscura (headless browser, CDP WebSocket protocol) as the primary
 * engine for HTML content extraction. Falls back to simple HTTP fetch +
 * text stripping when Obscura is not running.
 *
 * PDF support: Detects PDF URLs and extracts text using pdftotext.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { tryObscura } from "./cdp.js";
import { tryExtractPdf, isPdfUrl } from "./pdf.js";
import { fetchViaHttp } from "./http.js";

const MAX_CONTENT_CHARS = 80_000;

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

function truncate(text: string): { body: string; truncated: boolean } {
  if (text.length <= MAX_CONTENT_CHARS) return { body: text, truncated: false };
  return {
    body:
      text.slice(0, MAX_CONTENT_CHARS) +
      `\n\n[... content truncated to ${MAX_CONTENT_CHARS.toLocaleString()} characters ...]`,
    truncated: true,
  };
}

async function handlePdf(url: string, signal?: AbortSignal) {
  const result = await tryExtractPdf(url, signal);
  if (!result) return null;
  const { title, text } = result;
  const { body, truncated } = truncate(text);
  return {
    content: [
      {
        type: "text" as const,
        text: formatContent(
          title,
          url,
          body,
          "PDF extracted via pdftotext",
          text.length,
          truncated,
        ),
      },
    ],
    details: { engine: "pdftotext", title, url, extractedLength: text.length, truncated },
  };
}

async function handleHtml(url: string, signal?: AbortSignal) {
  const obsResult = await tryObscura(url, signal);
  if (obsResult) {
    const { title, markdown } = obsResult;
    const { body, truncated } = truncate(markdown);
    return {
      content: [
        {
          type: "text" as const,
          text: formatContent(
            title,
            url,
            body,
            "Obscura headless browser",
            markdown.length,
            truncated,
          ),
        },
      ],
      details: { engine: "obscura-cdp", title, url, extractedLength: markdown.length, truncated },
    };
  }

  const httpResult = await fetchViaHttp(url, signal);
  if ("error" in httpResult) {
    if (httpResult.error === "PDF_CONTENT_TYPE") {
      const pdfResult = await tryExtractPdf(url, signal);
      if (pdfResult) {
        const { title, text } = pdfResult;
        const { body, truncated } = truncate(text);
        return {
          content: [
            {
              type: "text" as const,
              text: formatContent(
                title,
                url,
                body,
                "PDF extracted via pdftotext",
                text.length,
                truncated,
              ),
            },
          ],
          details: { engine: "pdftotext", title, url, extractedLength: text.length, truncated },
        };
      }
    }
    return {
      content: [
        {
          type: "text" as const,
          text: `Obscura not available and HTTP fallback failed.\n\n🔗 ${url}\n⚠️ ${httpResult.error}`,
        },
      ],
      details: { url, error: httpResult.error },
      isError: true,
    };
  }

  const { title, text } = httpResult;
  const { body, truncated } = truncate(text);
  return {
    content: [
      {
        type: "text" as const,
        text: formatContent(
          title || "(no title)",
          url,
          body,
          "HTTP fallback (Obscura not available)",
          text.length,
          truncated,
        ),
      },
    ],
    details: { engine: "http-fallback", title, url, extractedLength: text.length, truncated },
  };
}

export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "fetch_url",
    label: "Fetch URL",
    description: "Fetch a URL and get its content as Markdown.",
    promptSnippet: "Fetch a URL and get its content as Markdown",
    parameters: Type.Object({
      url: Type.String({ description: "The URL to fetch and extract content from" }),
    }),

    async execute(_toolCallId, params, signal, _onUpdate, _ctx) {
      const { url } = params;

      let parsed: URL;
      try {
        parsed = new URL(url);
      } catch {
        return {
          content: [{ type: "text" as const, text: `Invalid URL: ${url}` }],
          details: {},
          isError: true,
        };
      }
      if (!["http:", "https:"].includes(parsed.protocol)) {
        return {
          content: [{ type: "text" as const, text: `Unsupported protocol: ${parsed.protocol}` }],
          details: {},
          isError: true,
        };
      }

      if (isPdfUrl(url)) {
        const pdfResult = await handlePdf(url, signal);
        if (pdfResult) return pdfResult;
      }

      return (await handleHtml(url, signal))!;
    },
  });
}
