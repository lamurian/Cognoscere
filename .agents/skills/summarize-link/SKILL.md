---
name: summarize-link
description: Fetches a URL shared by the user using Lightpanda (headless browser), returns clean Markdown, summarizes it, and saves the summary as a new PARA knowledge document with proper YAML frontmatter. Use when the user says "summarize this link", "save this article", or shares a URL they want processed.
---

# Summarize Link

When the user shares a link (URL) they want processed, follow this workflow.

## Prerequisites

For best results, install **Lightpanda** — a fast, lightweight headless browser written in Zig that executes JavaScript (V8) and dumps pages as clean Markdown.

```bash
# macOS
brew install lightpanda-io/browser/lightpanda

# Linux (x86_64)
curl -L -o lightpanda https://github.com/lightpanda-io/browser/releases/download/nightly/lightpanda-x86_64-linux
chmod a+x ./lightpanda
sudo mv ./lightpanda /usr/local/bin/

# Docker
docker run -d --name lightpanda -p 127.0.0.1:9222:9222 lightpanda/browser:nightly
```

Without Lightpanda, the `fetch_url` tool falls back to simple HTTP + HTML stripping, which **cannot handle JavaScript-rendered pages** (SPAs, React/Vue sites).

## Workflow

### 1. Fetch the URL content

Use the `fetch_url` tool (provided by the `link-summarizer` extension) to fetch and extract content from the link.

```
fetch_url(url: "<the URL the user shared>")
```

The tool:
- Uses **Lightpanda** by default — runs a real browser (V8 JS engine), renders the DOM, and outputs clean Markdown
- Falls back to plain HTTP + HTML stripping if Lightpanda is not installed
- Extracts the page title from the first H1 heading (or `<title>` tag in fallback mode)

It returns:
- Page title
- Clean Markdown content
- Engine used (Lightpanda or HTTP fallback)
- Character count

### 2. Read and understand the content

Read the returned Markdown. If it is very long, focus on:
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

Use `create_para_doc` to save the summary:

```
create_para_doc(
  title: "<document title>",
  content: "<markdown body with summary, key points, source link>",
  tags: ["<relevant-tag-1>", "<relevant-tag-2>"],
  area: "Resources"
)
```

- `area` should typically be `"Resources"` for general reference material
- Use `"Areas"` if it relates to an ongoing life responsibility
- Use `"Projects"` only if it directly supports an active project

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
- Offer to refine or expand sections if needed

## Example

User: "summarize this https://example.com/article-about-resilience"

Agent actions:
1. `fetch_url(url: "https://example.com/article-about-resilience")` → Lightpanda renders JS, returns clean Markdown
2. Reads the article about resilience research
3. Summarizes into a concise markdown document
4. `list_para_tags` → checks existing tags, picks `["resilience", "wellbeing", "research"]`
5. `create_para_doc(title: "Resilience Research Summary", content: "...", tags: [...], area: "Resources")`
6. Confirms with user: "Saved as Resources/resilience-research-summary.md"

## Provided tools

This skill relies on:

- `fetch_url` — custom tool from `link-summarizer` extension, uses Lightpanda (or HTTP fallback) to extract content
- `list_para_tags` — lists all existing tags (from `para-knowledge` extension)
- `create_para_doc` — creates a new PARA document (from `para-knowledge` extension)
