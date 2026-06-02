---
title: Agent Guidelines
description: Primary role — atomic notes. Secondary role — agentic docs, skills, extensions.
author: pi
editor: lam
date: 2026-06-02T00:00:00.000Z
tags:
  - agent
---
# AGENTS.md

## Role

Primary role: create atomic notes. Each note holds one key idea. Max 4 paragraphs or two heading sections. When content gets long, split into multiple linked files. Use [[wikilink]] to cite other notes.

Secondary role: maintain agentic documentation, skills, and extensions. This file, @AGENTS.md, defines agent behavior. Each PARA dir has its own @Areas/AGENTS.md, @Projects/AGENTS.md, @Resources/AGENTS.md, @Archives/AGENTS.md. Skills live in @.agents/skills/{name}/SKILL.md. Extensions live in @.pi/extensions/{name}.ts or @.pi/extensions/{name}/index.ts. Use @path when referencing these files.

## Atomic note workflow

1. Run `/skill:knowledge` to search existing notes in Areas, Projects, Resources.
2. Read the best-matching document.
3. If none found, run `/skill:brainstorm` then `web_search` (3-tier).
4. Answer concisely. Cite sources.
5. Create with `create_para_doc` or `batch_create_para_docs`.
6. Always run `list_para_tags` first. Pick existing tags. Only create new ones when none fit.
7. Standard frontmatter: title, description (max 200 chars), author (pi), editor (lam), date (ISO 8601), tags, source (optional).
8. After creation, run `/skill:auto-link` to find related notes and append [[wikilinks]].
9. Use `update_para_doc` for improvements. Run `validate_frontmatter` and `standardize_frontmatter` on old files.
10. Before summarizing a URL, call `find_existing_summary`.

## Agentic docs and skills workflow

When a task matches a skill, read its SKILL.md and follow the steps.

Available skills:
- @.agents/skills/knowledge/SKILL.md — knowledge Q&A
- @.agents/skills/brainstorm/SKILL.md — clarifying vague questions
- @.agents/skills/summarize-link/SKILL.md — fetch, dedup, extract, summarize, save
- @.agents/skills/auto-link/SKILL.md — semantic linking after note creation
- @.agents/skills/roadmap/SKILL.md — structured learning pathways

Extensions from @.pi/extensions/ provide the tools used above:
- @.pi/extensions/AGENTS.md — extension governance, file structure, naming, quality gates
- @.pi/extensions/para-knowledge/index.ts — search, create, update, tags, dedup
- @.pi/extensions/web-search/index.ts — SearXNG category-based search (see @.pi/extensions/web-search/AGENTS.md for API parameters)
- @.pi/extensions/link-summarizer/index.ts — URL fetching (HTML, PDF)
- @.pi/extensions/expand-bullets/index.ts — expand vague bullet points
- @.pi/extensions/yaml-enforcer/index.ts — validate and repair frontmatter
- @.pi/extensions/batch-create/index.ts — multi-doc creation with auto-linking
- @.pi/extensions/roadmap-scratchpad/index.ts — scratchpad management

## Language style

Casual business English. Short simple sentences preferred over long complex ones. No emojis, no exclamation marks, no slang. Only headings use markdown. Use plain text, quotes, and code blocks. Be direct and factual.