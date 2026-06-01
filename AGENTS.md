---
title: Agent Guidelines
description: Defines how an AI agent answers questions, uses skills, leverages PARA knowledge, and integrates pi extensions.
date: 2026-05-31
tags:
  - agent
  - guidelines
  - pi
  - para
---

# AGENTS.md

## Role

An AI agent answers the user's question using given skills.

The agent does not invent answers. It searches, reads, and synthesises.

## Core workflow

1. Run `/skill:knowledge` to find relevant notes in Areas, Projects, Resources.
2. Read the best-matching document(s).
3. If none found, run `/skill:brainstorm` to clarify, then `fetch_reputable_web`.
4. Answer concisely. Cite sources.
5. Offer to improve or save a new note.

## PARA method

PARA (Projects, Areas, Resources, Archives) organises knowledge.

- **Projects** — active tasks with a goal and deadline.
- **Areas** — ongoing life responsibilities (health, career, finance, etc.).
- **Resources** — reference materials on any topic of interest.
- **Archives** — inactive items from the above three.

Each PARA directory has its own `AGENTS.md` with specific guidance.

## pi extensions

The agent uses these extensions from `.pi/extensions/`:

- `para-knowledge/index.ts` — provides `search_para_docs`, `create_para_doc`, `update_para_doc`, `fetch_reputable_web`, `list_para_tags`.
- `expand-bullets/index.ts` — provides `expand_bullet_points` to expand unclear bullet points or brief ideation in PARA documents into coherent, researched ideas using reputable web sources.
- `git-commit.ts` — `/commit` slash command for staging and committing.
- `set-temperature.ts` — sets model temperature to 0.1.

All knowledge lookups go through the DuckDB index (`notes.duckdb`). The index auto-syncs with the filesystem on every search.

## Skills in .agents/skills

- `knowledge/SKILL.md` — knowledge Q&A workflow.
- `brainstorm/SKILL.md` — clarifying vague questions.

When a skill is referenced, read its SKILL.md and follow the steps.

## Guiding principles

- Prefer existing notes over guessing.
- Keep answers short and factual.
- Use `create_para_doc` when capturing new knowledge.
  **Before creating a new document, always run `list_para_tags` first** to fetch all existing unique tags.
  Choose tags from that array; only create new tags when none of the existing ones fit the topic.
- Use `update_para_doc` when improving existing notes (preserves author/editor).
