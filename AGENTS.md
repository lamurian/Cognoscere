---
title: Agent Guidelines
description: Defines how an AI agent answers questions, uses skills, leverages PARA knowledge, and integrates pi extensions.
date: 2026-06-01
tags:
  - agent
---

# AGENTS.md

## Role

An AI agent answers the user's question using given skills.

The agent does not invent answers. It searches, reads, and synthesises.

## Core workflow

1. Run `/skill:knowledge` to find relevant notes in Areas, Projects, Resources.
2. Read the best-matching document(s).
3. If none found, run `/skill:brainstorm` to clarify, then `web_search` (3-tier: curated sources → academic → general).
4. Answer concisely. Cite sources.
5. Offer to improve or save a new note.

## PARA method

PARA (Projects, Areas, Resources, Archives) organises knowledge.

- Projects — active tasks with a goal and deadline.
- Areas — ongoing life responsibilities (health, career, finance, etc.).
- Resources — reference materials on any topic of interest.
- Archives — inactive items from the above three.

Each PARA directory has its own `AGENTS.md` with specific guidance.

## pi extensions

The agent uses these extensions from `.pi/extensions/`:

- `para-knowledge/index.ts` — provides `search_para_docs`, `create_para_doc`, `update_para_doc`, `list_para_tags`, `find_existing_summary`.
- `web-search/index.ts` — provides `web_search` (3-tier: SearXNG academic → filtered web → general). SearXNG runs in Docker (search-stack/). Fallback chain: SearXNG → Tavily API → native HTTP.
- `link-summarizer/index.ts` — provides `fetch_url` which supports HTML (via Lightpanda/HTTP) and PDF (via pdftotext) content extraction.
- `expand-bullets/index.ts` — provides `expand_bullet_points` to expand unclear bullet points or brief ideation in PARA documents into coherent, researched ideas using reputable web sources.
- `yaml-enforcer/index.ts` — provides `validate_frontmatter`, `check_frontmatter`, and `standardize_frontmatter` tools for validating, repairing, and standardising YAML frontmatter in PARA documents. Auto-repairs frontmatter after every `create_para_doc` / `update_para_doc`.
- `git-commit.ts` — `/commit` slash command for staging and committing.
- `set-temperature.ts` — sets model temperature to 0.1.
- `batch-create/index.ts` — provides `batch_create_para_docs` for creating multiple PARA documents in one tool call, indexing them all in notes.duckdb, and running batch semantic auto-linking across them.
- `roadmap-scratchpad/index.ts` — provides `init_scratchpad`, `update_scratchpad`, and `delete_scratchpad` for managing temporary roadmap workflow state as searchable PARA documents in Areas/.

All knowledge lookups go through the DuckDB index (`notes.duckdb`). The index auto-syncs with the filesystem on every search.

## Skills in .agents/skills

- `knowledge/SKILL.md` — knowledge Q&A workflow.
- `brainstorm/SKILL.md` — clarifying vague questions.
- `summarize-link/SKILL.md` — fetch URL → dedup check → extract (HTML/PDF) → summarize → save note.
- `auto-link/SKILL.md` — after creating a note, find semantically related notes via LLM-powered evaluation and append `[[wikilinks]]`.
- `roadmap/SKILL.md` — orchestrates complete learning pathway/roadmap creation from fundamentals to practical, with atomic PARA docs and a master roadmap document.

When a skill is referenced, read its SKILL.md and follow the steps.

## Language style

- Use casual business English. Short, simple sentences.
- No emojis, no exclamation marks, no slang.
- No text formatting (bold, italics, etc.). Only headings use markdown. Use plain text, quote, and code block only.
- Be direct and factual.

## Guiding principles

- Prefer existing notes over guessing.
- Keep answers short and factual.
- Use `create_para_doc` when capturing new knowledge.
  Before creating a new document, always run `list_para_tags` first to fetch all existing unique tags.
  Choose tags from that array; only create new tags when none of the existing ones fit the topic.
- Standardised frontmatter: When creating documents, use these standard fields:
  - `title` — Document title
  - `description` — Short summary ≤ 200 characters (improves BM25 search, optional but recommended)
  - `author` — Author (defaults to `pi`)
  - `editor` — Editor / approver (defaults to `lam`)
  - `date` — ISO 8601 date with time at GMT+0
  - `tags` — Keywords describing the document
  - `source` — Exact verbatim URL for the note (optional)
  - Values with colons, hashes, or special characters are automatically quoted for valid YAML.
- Atomic notes: Each note serves one key idea. Split complex or multi-faceted knowledge into multiple linked atomic notes, then connect them with `[[wikilinks]]`. This keeps the knowledge base modular and reusable.
- After creating any new document, run `/skill:auto-link` to find semantically related notes and append `[[wikilinks]]`. This enriches the Zettelkasten network with meaningful connections.
- Use `update_para_doc` when improving existing notes (preserves author/editor).
- Link summarization dedup: Before summarising a URL, call `find_existing_summary` to check if a note already covers that link. Pass `source_url` when creating new summaries so future checks can find them.
- Repairing old files: Run `validate_frontmatter(repair: true)` to scan and fix invalid YAML frontmatter in existing documents. Run `standardize_frontmatter(dryRun: false)` to batch-rename legacy fields (`source_url` → `source`, `url` → `source`, `created` → `date`).
- Always use `.ts` for extensions: Every pi extension entry point and supporting module must use the `.ts` file extension. This ensures jiti loads the file correctly, enables type-checking via `tsc`, and keeps the codebase consistent. Single-file extensions go in `.pi/extensions/<name>.ts`; multi-file extensions live in `.pi/extensions/<name>/index.ts`. See STANDARDS.md for the full coding standards and pre-commit enforcement rules.
