---
name: knowledge
description: Answers questions by first searching PARA-organized markdown files (Areas, Projects, Resources). If no document matches, clarifies via brainstorm, searches the web from reputable sources (.edu, .ac.*, .gov, .go.*, universities), then creates a new document with proper YAML frontmatter.
---

# Knowledge Agent

When the user asks a question about a topic, follow this workflow.

## Workflow

### 1. Search existing documents
Use the `search_para_docs` tool to find markdown files in `Areas/`, `Projects/`, `Resources/` that match via tags and content.

### 2. If matching documents exist
- `read` the most relevant document(s)
- Answer the user using the content
- **Cite every claim using markdown footnotes** pointing to the document(s) you read (see [Citation format](#citation-format) below)
- Present any points for improvement
- If user confirms, use `update_para_doc` to apply improvements and renew frontmatter (`date` updated, `author: pi`, `editor: lam` preserved)

### 3. If no documents match
- Inform the user that no document covers this topic yet
- Invoke `/skill:brainstorm` to clarify and refine the question
- Use `fetch_reputable_web` to search `.edu`, `.ac.*`, `.gov`, `.go.*`, and university websites
- Summarise findings to the user
- **Cite every web result using markdown footnotes** (see [Citation format](#citation-format) below)
- Use `create_para_doc` to save a new document with frontmatter: `author: pi`, `date`, `editor: lam`, `title`, `tags`

## Citation format

When drafting a response from either PARA documents or web results, use **markdown footnotes** to cite every source.

### Rules

- **One citation = one key idea.** Each footnote reference (`[^1]`, `[^2]`, …) represents a single key idea. That idea becomes the building block of a sentence or paragraph.
- **Granularity:** Place the footnote reference at the end of a **sentence** when the claim is specific to that sentence, or at the end of a **paragraph** when the entire paragraph draws from the same source.
- **Footnote listing** at the bottom of the response:
  - PARA doc: `[Doc Title](relative/path.md)`
  - Web result: `[Page Title](url) — brief excerpt`
- **Every factual claim must trace back to a footnote.** If you synthesise multiple sources, each gets its own footnote reference.

### Example

> The PARA method organises knowledge into four categories: Projects, Areas, Resources, and Archives.[^1] Projects are active tasks with a goal and deadline.[^1]
>
> Areas are ongoing life responsibilities without a fixed endpoint, such as health or finance.[^2]

[^1]: [AGENTS.md](../AGENTS.md) — Core workflow / PARA method section.
[^2]: [AGENTS.md](../AGENTS.md) — PARA method, Areas description.

## Tools provided by para-knowledge extension

See [extension reference](../../../.pi/extensions/para-knowledge/index.ts) for tool details.

- `search_para_docs` — search by tags and content in Areas/Projects/Resources
- `fetch_reputable_web` — web search filtered to reputable domains
- `create_para_doc` — create new file with YAML frontmatter
- `update_para_doc` — update file and renew frontmatter
