---
title: 'Executive Summary: Harness Engineering for pi Agent Coding'
description: Executive synthesis of harness engineering discipline — feedforward/feedback controls, context engineering, and the pi agent ecosystem harness layers
author: pi
editor: lam
date: 2026-06-07T18:27:43.004Z
tags:
  - executive-summary
  - agent
  - engineering
  - infrastructure
  - methodology
  - reference
---

## Executive Summary

Harness engineering is the discipline of designing the full operating environment around AI coding agents [@bckeler2026; @lopopolo2026]. It is the practice that sits above prompt engineering (optimising a single instruction) and context engineering (curating tokens across a context window). Harness engineering addresses the entire agent lifecycle: what context is injected before generation, what feedback loops catch errors during execution, and what infrastructure enforces quality after the agent finishes. The core equation is Agent = Model + Harness [@trivedy2026]. The model contains the intelligence; the harness makes that intelligence useful in a specific project context.

For the pi ecosystem, harness engineering is the meta-practice that governs how we build and maintain the agentic infrastructure: context files (AGENTS.md), skills (SKILL.md), extensions (TypeScript tools), spec files, CI/CD gates, and the feedback loops that connect them. This document synthesises the key concepts and maps them to concrete practices in the pi knowledge management workflow.

## The Three Engineering Layers

**Prompt Engineering** optimises wording for a single LLM interaction. It answers "what should I say?" It is bounded by one turn. Example: crafting the exact wording for a `create_para_doc` call.

**Context Engineering** curates the full token set across turns within one context window [@anthropicappliedai2025]. It answers "what information should the agent see?" It manages system prompts, tools, message history, and external data. Example: organising AGENTS.md with progressive disclosure, keeping the root file under 300 lines and referencing deeper docs on demand.

**Harness Engineering** operates outside the context window. It orchestrates tool dispatch, context resets, structured handoff artifacts, phase gates, and cross-session persistence [@shah2026]. It answers "what system makes the agent reliable across sessions?" Example: designing the skill architecture where `create-doc`, `web-search`, and `research` delegate to each other through `/skill:name` calls, with `auto-link` as a verification step after document creation.

## Feedforward and Feedback Controls

Harness engineering is usefully framed through control theory [@bckeler2026]:

**Feedforward controls** anticipate the agent's behaviour and steer it before it acts. These include AGENTS.md rules, skill definitions, spec files, and tool contracts. They increase the probability that the agent produces good results on the first attempt. In pi, feedforward includes: the AGENTS.md file that tells the agent its primary role is atomic notes, the skill SKILL.md files that define workflows step-by-step, and the extension documentation that defines tool parameters.

**Feedback controls** observe after the agent acts and help it self-correct. These include linter output, test failures, compaction summaries, and auto-link verification. The most effective feedback signals are optimised for LLM consumption -- a lint error saying "use logger.info instead of console.log" enables autonomous fixing. In pi, feedback includes: `validate_frontmatter` checking YAML correctness, `auto-link` appending wikilinks and reporting connections, and `resolve_citation` returning the citekey for dedup verification.

Both directions are necessary. Feedforward-only encodes rules but never learns whether they worked. Feedback-only produces an agent that repeats the same mistakes until corrected.

## The Five Infrastructure Layers of an Agent Harness

Synthesising from [@bckeler2026; @trivedy2026; @harnessengineeringteam2026], five infrastructure layers determine harness effectiveness:

1. **Context Management.** How instructions, project state, and historical decisions are assembled and prioritised. In pi: the AGENTS.md progressive disclosure architecture, per-directory rules, skill frontmatter for just-in-time loading.
2. **Error Recovery.** How failures are detected, categorised, retried, or escalated. In pi: the `find_existing_summary` dedup check before re-summarising, the `resolve_citation` dedup guard, compaction strategies for long sessions.
3. **Tool Integration.** How commands, APIs, and permissions are exposed with clear contracts. In pi: the TypeScript extension system with strict types, the `.pi/extensions/AGENTS.md` governance rules (max 300 lines, cyclomatic complexity ≤ 15, strict TypeScript), tool descriptions optimised for LLM consumption.
4. **Observability.** How logs, intermediate outputs, and decision traces are captured. In pi: the notes.duckdb index that tracks all PARA documents, the scratchpad system that persists roadmap state across sessions.
5. **Testing.** How harness changes and agent outputs are verified before release. In pi: the pre-commit hook (Prettier, ESLint, tsc --noEmit, line count check), the `validate_frontmatter` and `standardize_frontmatter` tools for document quality gates.

## Computational vs Inferential Controls [@bckeler2026]

Controls in any layer can be computational (deterministic, fast, CPU-bound) or inferential (semantic, slower, GPU-bound). Computational controls run on every change alongside the agent. Inferential controls are reserved for deeper checks.

| Dimension | Computational Example (pi) | Inferential Example (pi) |
|---|---|---|
| Feedforward | Extension tool schemas (TypeBox), AGENTS.md rules | Skill SKILL.md workflow descriptions, spec documents |
| Feedback | `validate_frontmatter`, pre-commit hooks, `tsc --noEmit` | `auto-link` semantic matching, LLM-as-judge for note quality |

## The Plan-Execute-Verify (PEV) Loop

The PEV pattern is a three-phase agent architecture that separates planning from execution and enforces verification as a structured feedback loop [@shah2026]. Instead of asking the LLM to solve a multi-step problem in one pass, PEV instructs the agent to: (1) decompose the goal into an explicit plan, (2) execute against that plan with bounded scope, (3) verify the output against both the plan and external quality criteria.

In pi, the research skill follows PEV naturally: Plan (decompose into WHY/HOW question tree and hypothesise), Execute (`web_search` tier 1 for each question, `fetch_url` for evidence extraction), Verify (check completion criteria, update hypothesis, assess confidence). The SDD four-phase workflow is another PEV instantiation: Requirements (Plan), Design + Tasks (Execute), Implementation + Integration Verification (Verify).

## Measuring Harness Effectiveness [@shah2026]

Key metrics for harness maturity in the pi ecosystem:

| Metric | What It Measures | pi Application |
|---|---|---|
| Task Resolution Rate | Percentage of tasks resolved correctly | BM25 search precision, citation dedup rate |
| Rework Rate | Code or documents discarded/rewritten within a window | Document update frequency, `update_para_doc` call rate |
| Verification Tax | Time auditing agent output vs. time spent generating | Time from `batch_create_para_docs` to auto-link completion |
| Constraint Effect | Improvement from constraining agent environment | AGENTS.md rule compliance rate, tag reuse rate |
| Defect Escape Rate | Quality issues reaching the user | Frontmatter validation failures, broken wikilinks |

## Harnessability of the pi Codebase [@bckeler2026]

The pi knowledge base is naturally harnessable because of several ambient affordances:

- **Structured frontmatter** (YAML with required fields) provides deterministic parsing and validation
- **Atomic note principle** (one key idea per file) keeps context windows focused
- **DuckDB index** (`notes.duckdb`) enables fast BM25 search across all documents
- **Tag system** with 154 existing tags enforces discoverability and prevents tag proliferation
- **Extension governance** (300-line limit, strict TypeScript, complexity ≤ 15) ensures deterministic tool behaviour
- **Skill architecture** with single-responsibility design enables clean delegation chains

These properties make the pi codebase more governable than an unstructured collection of files. The harness is strongest where it can build on existing structure.

## Practical Steps for the pi Workflow

1. **Start with feedforward.** The AGENTS.md file is the highest-ROI harness investment. Keep the root file under 300 lines with progressive disclosure to deeper docs. Add per-directory rules for domain-specific constraints (e.g., services layer rules for extension files).

2. **Enforce three-tier boundaries** in AGENTS.md [@osmani2025]: Always do (run `list_para_tags` before creating, use `batch_create_para_docs` for 3+ documents), Ask first (before modifying existing skills or extensions), Never do (never edit `ref.bib` directly, never commit secrets).

3. **Close the feedback loop.** After every document creation, run `auto-link` (included in batch creation). After every update, run `validate_frontmatter`. This creates structured error signals the agent can act on without human intervention.

4. **Design for progressive disclosure.** Root context (AGENTS.md) should route, not dump. Skills load on-demand via `/skill:name`. Per-directory rules scope context to where the agent is working. This prevents context rot and keeps the agent's attention budget focused [@anthropicappliedai2025].

5. **Iterate the harness, not just the prompts.** When an agent makes a mistake repeatedly, fix the harness, not the instruction. If the agent consistently picks wrong tags, add a rule to AGENTS.md. If it creates documents with bad frontmatter, run `validate_frontmatter` automatically after creation. The harness is a cybernetic governor that improves over time [@bckeler2026].

6. **Adopt the SDD four-phase loop** for complex features: Requirements (what are we building), Design (how will we build it), Tasks (what steps in what order), Implementation (build and verify one step at a time). This transforms unstructured generation into engineering discipline [@pockit2025].

## Sources

- [[spec-driven-context-driven-tdd-workflow-for-ai-coding-agents]]
- [[context-engineering-for-pi-agents]]
- [[spec-architecture-for-ai-coding-agents]]
- [[least-obstructive-workflow-principles]]
- [[multi-agent-orchestration-patterns]]
- [[tdd-with-ai-coding-agents]]
- [[sdd-four-phase-workflow-for-pi-agents]]
- [[skills-architecture-single-responsibility-restructure]]
- [@bckeler2026] -- Birgitta Bockeler, "Harness Engineering for Coding Agent Users", martinfowler.com, 2026
- [@lopopolo2026] -- Ryan Lopopolo/OpenAI, "Harness Engineering", openai.com, 2026
- [@trivedy2026] -- Vivek Trivedy, "The Anatomy of an Agent Harness", langchain.com, 2026
- [@anthropicappliedai2025] -- Anthropic Applied AI, "Effective Context Engineering for AI Agents", anthropic.com, 2025
- [@shah2026] -- Molisha Shah, "Harness Engineering for AI Coding Agents", augmentcode.com, 2026
- [@harnessengineeringteam2026] -- "What Is Harness Engineering? A Complete Guide", harness-engineering.net, 2026
- [@osmani2025] -- Addy Osmani, "How to Write a Good Spec for AI Agents", addyosmani.com, 2025
- [@pockit2025] -- "Specification-Driven Development: Complete Guide", pockit.tools, 2025