---
name: summarize-link
description: Fetches a URL shared by the user, checks if a summary already exists (by URL or content similarity), extracts content (HTML via Lightpanda, PDF via pdftotext), summarizes it, and saves as a new PARA knowledge document with source_url tracking. Use when the user says "summarize this link", "save this article", or shares a URL they want processed.
---

# Summarize Link

When the user shares a link (URL) they want processed, follow this workflow.

## Prerequisites

- **Lightpanda** — for JavaScript-rendered HTML pages (SPAs, React/Vue).
  Install: `brew install lightpanda-io/browser/lightpanda` (macOS) or see [lightpanda.io](https://github.com/lightpanda-io/browser).
- **pdftotext** (poppler-utils) — for PDF extraction.
  Install: `apt install poppler-utils` (Debian/Ubuntu) or `brew install poppler` (macOS).

Without Lightpanda, `fetch_url` falls back to simple HTTP + HTML stripping, which **cannot handle JavaScript-rendered pages**.

## Workflow

### 0. Check for existing summary (dedup)

**Before fetching**, call `find_existing_summary` to see if a document with the same URL already exists:

```
find_existing_summary(url: "<the URL>")
```

This tool:
- Queries the DuckDB index for documents whose `source_url` field matches the given URL exactly
- If no exact match is found and the tool has access to extracted content (from a previous attempt or from context), it also computes **Jaccard similarity** (word trigrams) against existing documents
- If an existing summary is found (exact URL match or >90% content similarity), it returns the document title and path

**If found:** Inform the user that the link is already summarised. Do **not** re-summarise. Read the existing document if the user wants details.

**If not found:** Proceed to step 1.

### 1. Fetch the URL content

Use the `fetch_url` tool (provided by the `link-summarizer` extension) to fetch and extract content from the link.

```
fetch_url(url: "<the URL the user shared>")
```

The tool:
- **PDFs:** Detects `.pdf` URLs and extracts text using `pdftotext -layout` (great for academic papers)
- **HTML:** Uses **Lightpanda** by default — runs a real browser (V8 JS engine), renders the DOM, and outputs clean Markdown
- **Fallback:** Plain HTTP + HTML stripping if Lightpanda is not installed
- Extracts the page title from the first H1 heading (or `<title>` tag in fallback mode)

It returns:
- Page title
- Clean Markdown content (or extracted text for PDFs)
- Engine used (Lightpanda, pdftotext, or HTTP fallback)
- Character count

### 2. Read and understand the content

Read the returned Markdown/text. If it is very long, focus on:
- The main topic and purpose of the page
- Key arguments, findings, or information
- Structure (headings, sections, lists)
- Any data, statistics, or references

### 3. Summarize

Write a concise summary in your own words. The summary should include:

- **Title** — A clear, descriptive title for the document
- **Source** — The original URL and page title
- **Summary** — 2–5 paragraphs capturing the essence of the content
- **Key points** — Bullet list of the most important takeaways
- **Relevance** — Why this might be useful or interesting

### 4. Create a new PARA document

**Before creating a new document, always run `list_para_tags` first** to fetch all existing unique tags. Choose tags from that array; only create new tags when none of the existing ones fit the topic.

Use `create_para_doc` to save the summary, passing the original URL as `source_url`:

```
create_para_doc(
  title: "<document title>",
  content: "<markdown body with summary, key points, source link>",
  tags: ["<relevant-tag-1>", "<relevant-tag-2>"],
  area: "Resources",
  source_url: "<original URL>"
)
```

- `area` should typically be `"Resources"` for general reference material
- Use `"Areas"` if it relates to an ongoing life responsibility
- Use `"Projects"` only if it directly supports an active project
- `source_url` is stored in the frontmatter and in the DuckDB index, enabling future dedup checks

Recommended document structure inside `content`:

```markdown
## Source
- **Title:** [Original Page Title]
- **URL:** [Original URL]

## Summary
[2–5 paragraph summary of the content]

## Key Points
- Key takeaway one
- Key takeaway two
- ...

## Relevance
Why this content matters or how it might be useful.
```

### 5. Confirm with the user

After creating the document, tell the user:
- The document title and path
- A brief note on what was saved
- The source URL (so they know it's tracked for dedup)
- Offer to refine or expand sections if needed

## Example

User: "summarize this https://arxiv.org/pdf/2604.25850"

Agent actions:
1. `find_existing_summary(url: "https://arxiv.org/pdf/2604.25850")` → no existing summary found
2. `fetch_url(url: "https://arxiv.org/pdf/2604.25850")` → detects PDF, extracts text via pdftotext
3. Reads the paper content
4. Summarizes into a concise markdown document
5. `list_para_tags` → checks existing tags, picks `["ai", "research", "paper"]`
6. `create_para_doc(title: "Paper Summary: ...", content: "...", tags: [...], area: "Resources", source_url: "https://arxiv.org/pdf/2604.25850")`
7. Confirms with user: "Saved as Resources/paper-summary-....md (source tracked)"

## Provided tools

This skill relies on:

- `find_existing_summary` — checks DuckDB for existing summary by URL + content similarity (from `para-knowledge` extension)
- `fetch_url` — custom tool from `link-summarizer` extension, supports HTML (via Lightpanda/HTTP) and PDF (via pdftotext)
- `list_para_tags` — lists all existing tags (from `para-knowledge` extension)
- `create_para_doc` — creates a new PARA document with optional `source_url` (from `para-knowledge` extension)
