/**
 * Unit tests for link-summarizer HTTP and PDF extraction helpers
 */

import { describe, it, expect } from "vitest";

// Functions under test — extracted from link-summarizer/index.ts

function isPdfUrl(url: string): boolean {
  const PDF_EXT_RE = /\.pdf(?:[?#].*)?$/i;
  const PDF_PATH_RE = /\/pdf\/[\d.]+(?:v\d+)?(?:[?#].*)?$/i;
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

describe("isPdfUrl", () => {
  it("detects .pdf extension", () => {
    expect(isPdfUrl("https://example.com/doc.pdf")).toBe(true);
    expect(isPdfUrl("https://example.com/doc.PDF")).toBe(true);
  });

  it("detects /pdf/ path pattern", () => {
    expect(isPdfUrl("https://arxiv.org/pdf/2301.12345")).toBe(true);
    expect(isPdfUrl("https://arxiv.org/pdf/2301.12345v3")).toBe(true);
  });

  it("handles query strings after .pdf", () => {
    expect(isPdfUrl("https://example.com/doc.pdf?download=1")).toBe(true);
  });

  it("returns false for non-PDF URLs", () => {
    expect(isPdfUrl("https://example.com/doc.html")).toBe(false);
    expect(isPdfUrl("https://example.com/article")).toBe(false);
  });

  it("returns false for invalid URLs", () => {
    expect(isPdfUrl("not-a-url")).toBe(false);
  });
});

describe("extractPdfTitle", () => {
  it("extracts first substantive line as title", () => {
    const text = "\n\n  The Title of the Paper  \n\nAuthors: John Doe\nAbstract: ...";
    expect(extractPdfTitle(text)).toBe("The Title of the Paper");
  });

  it("returns fallback for empty text", () => {
    expect(extractPdfTitle("")).toBe("(PDF document)");
  });

  it("skips short lines", () => {
    const text = "short\n\nProper Title Here\n\nMore content";
    expect(extractPdfTitle(text)).toBe("Proper Title Here");
  });
});

describe("extractReadableText", () => {
  it("extracts title from <title> tag", () => {
    const html = "<html><head><title>My Page</title></head><body><p>Content here</p></body></html>";
    const result = extractReadableText(html);
    expect(result.title).toBe("My Page");
  });

  it("strips script and style tags", () => {
    const html = `<html><body>
      <script>alert("evil")</script>
      <p>Real content</p>
      <style>.hidden{display:none}</style>
    </body></html>`;
    const result = extractReadableText(html);
    expect(result.text).not.toContain("alert");
    expect(result.text).not.toContain(".hidden");
    expect(result.text).toContain("Real content");
  });

  it("decodes HTML entities", () => {
    const html = "<p>AT&amp;T &lt;strong&gt;bold&lt;/strong&gt;</p>";
    const result = extractReadableText(html);
    expect(result.text).toContain("AT&T");
    expect(result.text).not.toContain("&amp;");
  });

  it("collapses whitespace", () => {
    const html = "<p>Hello    world</p><p>\n\nNew\n\npara</p>";
    const result = extractReadableText(html);
    expect(result.text).toContain("Hello world");
    expect(result.text).toContain("New");
    expect(result.text).toContain("para");
  });

  it("strips nav, header, footer tags", () => {
    const html = `<body>
      <nav>Navigation</nav>
      <header>Header</header>
      <main>Primary content</main>
      <footer>Footer</footer>
    </body>`;
    const result = extractReadableText(html);
    expect(result.text).not.toContain("Navigation");
    expect(result.text).not.toContain("Header");
    expect(result.text).not.toContain("Footer");
    expect(result.text).toContain("Primary content");
  });

  it("returns empty text for empty html", () => {
    const result = extractReadableText("<html></html>");
    expect(result.text).toBe("");
  });
});
