---
title: 'Skills Architecture: Single-Responsibility Restructure'
description: Plan to refactor 6 existing + 2 new skills so each follows exactly one business rule, with clean delegation between skills.
author: pi
editor: lam
date: 2026-06-03T08:03:50.978Z
tags:
  - agent
  - architecture
  - planning
---

## Summary

Refactor the 6 existing skills and add 2 new skills so each has exactly one business rule. Skills that share a common methodology (search, document creation) delegate to dedicated skills instead of duplicating logic. Local PARA search stays a tool — it's an atomic operation with no decision branching.

## Design Principles

**One skill = one business rule.** A skill is a workflow that requires LLM decision-making (which tier? which category? how to classify?). Pure function calls with no branching stay as tools.

**Skills delegate, not duplicate.** Shared methodologies live in dedicated skills that others call via `/skill:name`.

**Tools stay lean.** `search_para_docs`, `fetch_url`, `create_para_doc`, `batch_create_para_docs` are atomic operations provided by extensions. No skill wraps them unnecessarily.

## Existing Skills (Refactored)

### brainstorm
- **Rule:** Clarify vague questions/instructions through structured dialogue.
- **Always called by other skills.** Never triggers on its own.
- **Calls:** none (terminal skill — hands off refined question back to caller).

### auto-link
- **Rule:** Find semantically related notes and append [[wikilinks]].
- **Calls:** none. Uses tools directly (`search_para_docs`, `read`, `update_para_doc`).

### knowledge
- **Rule:** Answer questions by searching existing PARA docs.
- **Workflow:** `search_para_docs` → read top match → answer with citations.
- **If no match:** call `/skill:brainstorm` → `/skill:web-search` → `/skill:create-doc` → `/skill:auto-link`.
- **Removed:** inline web search logic (delegates), inline document standards (delegates), stub expansion (out of scope).

### research
- **Rule:** Iterative academic research with WHY/HOW question decomposition, hypothesis testing, and confidence assessment.
- **Workflow:** `/skill:brainstorm` if vague → question tree → hypothesize → `/skill:web-search` (default tier=1) → extract evidence → refine → `/skill:create-doc` (atomic notes + executive summary) → `/skill:auto-link`.
- **Removed:** inline academic search logic (delegates to web-search), inline document creation (delegates to create-doc).

### roadmap
- **Rule:** Design structured learning pathways from fundamentals to practical application.
- **Workflow:** scope → steps (Layers 1–5) → guiding questions → `/skill:brainstorm` if needed → `/skill:web-search` per step → `/skill:create-doc` (atomic notes + master doc) → delete scratchpad.
- **Removed:** inline search logic (delegates to web-search), inline document creation (delegates to create-doc).

### summarize-link
- **Rule:** Fetch a URL, dedup by URL/content, and produce a concise summary.
- **Workflow:** `find_existing_summary` → `fetch_url` → summarize → `/skill:create-doc` → `/skill:auto-link`.
- **Removed:** inline document creation (delegates to create-doc).

## New Skills

### create-doc
- **Rule:** Single source of truth for document creation standards, citation workflow, and PARA classification.
- **Parameters:** title, content, tags, area, description, source, citations.
- **Workflow:** validate inputs → `list_para_tags` (reuse existing) → classify area (Resource/Area/Project) → `resolve_citation` for each source → create via `create_para_doc` or `batch_create_para_docs` → return path(s).
- **Owns:** Document Creation Standards (atomic principle, language, citation style, cross-referencing, classification, frontmatter, naming).
- **Calls:** `list_para_tags`, `create_para_doc`, `batch_create_para_docs`, `resolve_citation`.
- **Why a skill, not a tool:** The LLM makes decisions — which tags to reuse, which area fits, how to classify, how to format citations. That's a workflow, not a pure function call.

### web-search
- **Rule:** Single source of truth for search methodology — tier selection, category mapping, domain filtering, fallback chain.
- **Parameters:** query, tier (default=1), category (optional override).
- **Tier logic:**
  - **Tier 1 (default):** `scientific_publications` category via SearXNG.
  - **Tier 2:** `web` category with `site:.edu OR site:.gov` filtering. Override via `category` param (`it`, `news`).
  - **Tier 3:** `general` category (unrestricted).
- **Fallback chain:** SearXNG → Tavily → Bing RSS.
- **Calls:** `web_search` tool.
- **Why a skill, not a tool:** The LLM decides which tier to use, whether to override the category, and how to interpret results. That's a methodology, not a single function call.

## Dependency Graph

```
brainstorm ←── knowledge, research, roadmap
                (clarify vague input)

web-search ←── knowledge, research, roadmap
(tier 1-3       (each chooses tier)
 logic)

create-doc ←── knowledge, research, roadmap, summarize-link
(standards,     (all create documents)
 citation,
 classification)

auto-link ←── knowledge, research, summarize-link
(semantic       (link after creation)
 linking)

local search (tool, not skill) ←── auto-link, knowledge, roadmap
(search_para_docs)                 (each uses it with its own strategy)
```

## What Stays a Tool

| Tool | Extension | Reason |
|---|---|---|
| `search_para_docs` | para-knowledge | Atomic. No decision branching. |
| `fetch_url` | link-summarizer | Atomic. No decision branching. |
| `create_para_doc` | para-knowledge | Atomic function. The methodology is in create-doc skill. |
| `batch_create_para_docs` | batch-create | Atomic function. The methodology is in create-doc skill. |
| `find_existing_summary` | para-knowledge | Atomic. Single query. |
| `list_para_tags` | para-knowledge | Atomic. Single query. |
| `resolve_citation` | para-knowledge | Atomic. Single API call. |
| `expand_bullet_points` | expand-bullets | Atomic. Single operation. |
| `init_scratchpad` | roadmap-scratchpad | Atomic. Single operation. |
| `update_scratchpad` | roadmap-scratchpad | Atomic. Single operation. |
| `delete_scratchpad` | roadmap-scratchpad | Atomic. Single operation. |

## Migration Sequence

1. Create `create-doc` skill — extract Document Creation Standards and Citation format from `knowledge` into its own SKILL.md. Update `knowledge`, `research`, `roadmap`, `summarize-link` to delegate.

2. Create `web-search` skill — extract 3-tier logic from `knowledge` into its own SKILL.md. Update `knowledge` and `research` to delegate. `roadmap` already calls web-search via the tool pattern; redirect to the skill.

3. Strip `knowledge` — remove inline web search, document standards, citation format. Keep only Q&A from existing docs + orchestration (call brainstorm → web-search → create-doc → auto-link).

4. Strip `research` — remove inline search tier logic. Keep question tree, hypothesis, evidence, confidence. Add `/skill:web-search` with `tier=1` default.

5. Strip `roadmap` — remove inline search and document-creation instructions. Delegate both to web-search and create-doc.

6. Strip `summarize-link` — remove inline document-creation instructions. Delegate to create-doc.

7. `brainstorm` and `auto-link` — no changes needed.

## Verification

After migration, confirm:
- No skill contains another skill's business rule.
- Every call to another skill uses `/skill:name` syntax.
- No skill duplicates web-search tier logic.
- No skill duplicates document creation standards.
- Local search is only a tool, never wrapped in a skill.
