---
title: 'Pi Extension Authoring: Agent-Writes-Its-Own-Extensions as the Official Workflow'
description: "Pi's official authoring path is LLM-assisted: 'ask it to build one' — the agent writes its own TypeScript extensions, hot-reloaded via jiti, with governance gates (line limits, tsc, pre-commit) replacing manual review."
author: pi
editor: lam
date: 2026-08-11T20:22:35.007Z
tags:
  - pi-agent
  - extensions
  - workflow
  - automation
  - software-engineering
  - reference
---
## Summary

Pi's documented authoring workflow is LLM-assisted first. The extensions page opens with "pi can create extensions. Ask it to build one for your use case" — the user describes the capability and the agent writes the TypeScript module [@earendilworks2026]. This is the self-extending agent philosophy: Pi ships with only four built-in tools and a minimal system prompt; everything else is delegated to extensions that the agent itself creates on request [@xiaow2026].

Why this works: extensions are single TypeScript files loaded via jiti (just-in-time transpilation) with no build step, auto-discovered from `~/.pi/agent/extensions/` or `.pi/extensions/`, and hot-reloaded with `/reload`. The authoring loop is short — agent writes the file, reloads, tests, iterates. Tool schemas use TypeBox, giving type-safe validation without a compiler in the loop [@earendilworks2026].

Quality control is automated rather than human review. This knowledge base's own `.pi/extensions/AGENTS.md` governance enforces a 300-line limit, cyclomatic complexity ≤ 15, and strict TypeScript, backed by pre-commit hooks (Prettier, ESLint, `tsc --noEmit`). The SDD loop (implement_plan → execute → verify → commit_changes) gives the authoring process phase gates. Real-world evidence: the para-knowledge and web-search tools in this KB are agent-authored extensions, and the WhatsApp Kapso project documents pi autonomously setting up an extension end-to-end [Executive Summary: Harness Engineering for pi Agent Coding](Resources/executive-summary-harness-engineering-for-pi-agent-coding.md).

Human roles shift from writing code to reviewing policy: defining the capability in AGENTS.md, setting governance rules, and reviewing the agent's diff. This mirrors the arXiv authoring guidance that evaluations and review carry the weight a type system would in conventional code [@destefanis2026].

## Key Points

- Official workflow: "Ask it to build one" — LLM-assisted authoring is the documented first-class path
- jiti hot reload + TypeBox schemas make the agent-author loop frictionless (write → /reload → test)
- Governance gates (line limits, complexity, tsc, pre-commit hooks) automate quality control
- Human role is policy and review, not implementation
- Evidence: this KB's own tools and the WhatsApp Kapso project are agent-authored extensions

## Sources

[@earendilworks2026] -- Extensions, pi coding agent documentation, 2026
[@xiaow2026] -- Pi Coding Agent: Architecture, Agent Loop, Extension System and Ecosystem, 2026
[@destefanis2026] -- Authoring Agent Skills: A Software-Engineering Approach, arXiv:2607.25032, 2026

## Relevant notes

- [Authoring Best Practices: Evaluation-Driven Workflow and Mechanism Selection](Resources/authoring-best-practices-evaluation-driven-workflow-and-mechanism-selection.md)
- [Approaches to Guardrail Design in Pi Agent for LLM-Aided Software Engineering](Resources/approaches-to-guardrail-design-in-pi-agent-for-llm-aided-software-engineering.md)
- [Pi vs Goose Deterministic Workflow Control](Resources/pi-vs-goose-deterministic-workflow-control.md)
- [Goose Hook and Plugin Authoring: Manual-First, Low-Barrier Design](Resources/goose-hook-and-plugin-authoring-manual-first-low-barrier-design.md)
- [Tool Override: Wrapping Built-Ins with Guard Layers](Resources/tool-override-wrapping-built-ins-with-guard-layers.md)