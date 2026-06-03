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
- **Inspect for unclear bullet points or brief ideation** — If the document contains stub-like bullet lists, keyword-only sections (e.g. "Associated Codes" or "Keywords"), or other brief ideation that lacks explanation, use `expand_bullet_points` to search reputable web sources and expand each bullet into a coherent paragraph.
- Answer the user using the content
- **Cite every claim using Pandoc-style citation keys** pointing to `@ref.bib` (see [Citation format](#citation-format))
- Present any points for improvement
- If user confirms, use `update_para_doc` to apply improvements and renew frontmatter (`date` updated, `author: pi`, `editor: lam` preserved)
- If creating a new document from synthesis, follow the [Document Creation Standards](#document-creation-standards)

### 3. If no documents match
- Inform the user that no document covers this topic yet
- Invoke `/skill:brainstorm` to clarify and refine the question
- Use `web_search` (3-tier: SearXNG category-based search) to find authoritative information
   - Tier 1: `scientific_publications` category (academic papers, research)
   - Tier 2: `web` category with `site:.edu OR site:.gov`; override via `category` param
   - Tier 3: `general` category (unrestricted)
   - Optional `category`: `"it"` for tech/software, `"news"` for news queries
- Summarise findings to the user
- **For each source you decide to cite, call `resolve_citation` first** (see [Citation format](#citation-format) for the full workflow)
- Before creating a new document, **always run `list_para_tags` first** to see all existing unique tags.
  Choose tags from that array; only create new tags when none of the existing ones fit the topic.
- Create the document following the [Document Creation Standards](#document-creation-standards)
- **Then, run `/skill:auto-link`** to find semantically related notes and append `[[wikilinks]]` to the new note (see [Auto-link skill](../../.agents/skills/auto-link/SKILL.md))

## Document Creation Standards

This section defines how every PARA document in this knowledge base should be authored. All skills that create documents — knowledge, research, roadmap, summarize-link, and any future skill — must follow these standards.

### Atomic principle

Each note holds exactly one key idea. When content grows beyond a single idea, split it into multiple linked notes and use `[[wikilinks]]` to connect them.

Guidelines:
- Max 4 paragraphs per note, or two heading sections (not counting the frontmatter-led summary section)
- If a note exceeds 100 lines (including frontmatter), split it
- One note = one concept, one finding, one technique, one reference

### Language

Use **casual business English** as defined in the root `@AGENTS.md`:
- Short simple sentences over long complex ones
- No emojis, no exclamation marks, no slang
- Only headings use markdown formatting
- Use plain text, quotes, and code blocks
- Be direct and factual

### Citation style

External sources are cited using **Pandoc-style citation keys** referencing `@ref.bib`. See [Citation format](#citation-format) for the full workflow.

| Syntax | Example |
|---|---|
| `[@citekey]` — parenthetical | `Dopamine depletion impairs effort-cost computation [@kucsko2013].` |
| `@citekey` — narrative | `Kucsko et al. @kucsko2013 demonstrated that...` |
| Multiple sources | `Multiple studies confirm this [@kucsko2013; @daw2006].` |

For each source you decide to cite, call `resolve_citation(source, [title, authors, year])` before writing the document. The tool returns a unique citekey and appends the BibTeX entry to `@ref.bib`.

### Cross-referencing

Use `[[wikilink]]` to reference other notes in the knowledge base:
- `[[note-title]]` links to `Resources/note-title.md` (or whichever area it lives in)
- The auto-link skill (run after document creation) appends relevant `[[wikilinks]]` automatically
- Use wikilinks for prerequisite notes, related concepts, and further reading

### Classification

Choose the PARA area based on content type:

| Content type | Area | Example tags |
|---|---|---|
| General reference, concepts, theory | `"Resources"` | `"reference"`, `"fundamental"` |
| Active skill development, ongoing responsibility | `"Areas"` | `"health"`, `"finance"`, `"learning"` |
| Practical work, exercises, deliverables | `"Projects"` | `"practical"`, `"capstone"` |

Tags should be existing ones from `list_para_tags` where possible. Only create new tags when none of the existing ones fit.

### Frontmatter

The `create_para_doc` and `batch_create_para_docs` tools auto-generate the YAML frontmatter. The agent provides:
- `title` — descriptive, searchable title
- `tags` — from `list_para_tags` (reuse existing, create new only when necessary)
- `area` — `"Resources"`, `"Areas"`, or `"Projects"`
- `description` — short summary ≤ 200 characters, enriches BM25 search
- `source` — original URL if the document summarises an external source

The tools auto-set: `author: pi`, `editor: lam`, `date` (current timestamp).

### Naming

Filenames are auto-generated from the title via kebab-case slugification. Keep titles concise so slugs stay readable.

### Document body structure

For reference and summary documents, use this as a template:

```markdown
## Summary
[2-4 paragraphs synthesising the key idea]

## Key Points
- Point one
- Point two
- ...

## Sources
- [[wikilink to related existing note]]
- [@citekey] from ref.bib
```

Research atomic notes can use a leaner structure — just the key idea in 2-4 paragraphs with inline citations.

## Citation format

All citations use **BibTeX** stored in `@ref.bib` (project root) and referenced inline with **Pandoc-style citation keys**.

### Overview

1. When you find a relevant source during web search, decide whether to cite it.
2. Call `resolve_citation` with the source URL or DOI.
   - If it's a DOI or DOI URL, citation.js auto-fetches the metadata.
   - If it's a general web page (blog, news), provide `title`, `authors` (array of `"Last, First"`), and `year` as fallback.
3. The tool returns a unique citekey (e.g. `kucsko2013`). It handles dedup — if the same DOI or URL was cited before, it returns the existing citekey.
4. Use the citekey in your response and in any created documents.

### Inline citation syntax

Use Pandoc-style citation keys in the text:

| Syntax | Example |
|---|---|
| `[@citekey]` — parenthetical | `Dopamine depletion impairs effort-cost computation [@kucsko2013].` |
| `@citekey` — narrative | `Kucsko et al. @kucsko2013 demonstrated that...` |
| Multiple sources | `Multiple studies confirm this [@kucsko2013; @daw2006].` |

### Rules

- **Every factual claim from a web source must trace back to a citekey.** Run `resolve_citation` for each source you use.
- **Citekey format:** `{lastname}{year}` (lowercase, no special chars), e.g. `kucsko2013`. If collisions occur, the tool appends `a`, `b`, `c`... (e.g. `kucsko2013a`, `kucsko2013b`).
- **Dedup:** The tool checks DuckDB by DOI first, then by URL. You never create duplicate entries.
- **Existing notes**: If citing a PARA document that already exists, just use the document's path — no need to create a BibTeX entry for it. Only web sources get BibTeX entries.
- **`@ref.bib` is the single source of truth.** The DuckDB `citations` table is synced from it. If you manually edit `ref.bib`, the sync happens on the next `syncIndex` call.

### Workflow per source

```
Find relevant source → Decide to cite
  → Call resolve_citation(source, [title, authors, year])
  → Tool returns citekey + BibTeX entry (or existing if dup)
  → Insert @citekey in your response text
  → (If creating a document) include @citekey in the body
```

### Example

> The PARA method organises knowledge into four categories: Projects, Areas, Resources, and Archives [@paraMethod].
>
> Dopamine depletion in the ventral striatum reduces willingness to exert effort for reward [@salamone2007].
>
> This aligns with the broader literature on effort-based decision making [@salamone2007; @kucsko2013].

## Tools provided by para-knowledge extension

See [extension reference](../../../.pi/extensions/para-knowledge/index.ts) for tool details.

- `search_para_docs` — search by tags and content in Areas/Projects/Resources
- `list_para_tags` — list all unique tags across all indexed documents (run before `create_para_doc` to reuse existing tags)
- `expand_bullet_points` — expand unclear bullet points into coherent researched paragraphs using reputable web sources (provided by `expand-bullets/index.ts`)
- `web_search` — SearXNG category-based search (3-tier) with optional category override.
  See [web-search extension](../../../.pi/extensions/web-search/index.ts) and
  [API parameters](../../../.pi/extensions/web-search/AGENTS.md).
  - Tier 1: `scientific_publications` category (academic)
  - Tier 2: `web` category with `site:.edu OR site:.gov`; override via `category` param
  - Tier 3: `general` category (unrestricted)
  - Optional `category` parameter: `"it"` for tech/software, `"news"` for news
  Runs via Docker (search-stack/docker-compose.yml). Fallback: Tavily → native HTTP.
- `create_para_doc` — create new file with YAML frontmatter
- `update_para_doc` — update file and renew frontmatter
- `resolve_citation` — parse a URL/DOI via citation.js, generate a unique citekey, dedup against DuckDB, and append to @ref.bib if new
