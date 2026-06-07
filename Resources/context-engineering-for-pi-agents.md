---
title: Context Engineering for pi Agents
description: How context engineering differs from prompt engineering and how to structure progressive context files for AI coding agents
author: pi
editor: lam
date: 2026-06-07T18:18:52.678Z
tags:
  - agent
  - architecture
  - reference
  - software
---

## Summary

Context engineering is the practice of curating information that AI agents consume to complete tasks. It is distinct from prompt engineering: prompt engineering optimises human-LLM interaction in a single turn, while context engineering optimises agent-LLM interaction across long-running sessions with large context windows. Coding agents require substantially more context than chat interfaces -- project conventions, architecture rules, dependency graphs, file structures -- and the quality of that context directly determines output quality [@shangqi2025].

## Progressive Disclosure Architecture

The core principle of context engineering is progressive disclosure: give the agent the minimum context needed for the current task, with references to deeper information available on demand. This mirrors the UX principle that good software reveals complexity gradually. The root context file (AGENTS.md or CLAUDE.md) should be a concise briefing under 300 lines that covers what the agent does, available commands, and references to deeper documentation files. The agent reads the root file, then loads referenced documents when working on relevant areas [@pockit2025].

## Directory-Scoped Context

Many AI tools support per-directory rules. Use these for domain-specific constraints that apply only when the agent works in that part of the codebase. For example: a services directory rule stating that every service method must be async, services receive dependencies through constructor injection, and services must not import from the API layer (preventing circular dependencies). Per-directory rules are the agent equivalent of access control -- they scope what the agent knows and can do based on where it's working [@pockit2025].

## Preventing Context Collapse

Context collapse occurs when an agent session starts from zero, and the agent generates code based on its training data's default patterns rather than the project's established ones. A project using camelCase everywhere gets snake_case in new files. Zod validation gets replaced with manual if-checks. Custom error classes get replaced with generic Error throws. The fix is persistent context files that survive across sessions and tell every agent session how to behave. The AGENTS.md file is the anchor that prevents context collapse -- it transforms each new agent session from an amnesiac stranger into a team member who remembers the project conventions [@pockit2025].

## Reference Documents for Deep Context

The root context file should route, not dump. Include a 'Reference Documents' section listing where to find architecture decisions, API design conventions, database schema, and feature specs. The agent progressively loads these on demand. This keeps the active context window focused while making the full knowledge base available when specific tasks require it. Tools like MCP (Model Context Protocol) servers can provide real-time documentation context, and knowledge graphs built from code structure analyses supplement static context files [@shangqi2025; @pockit2025].

## Relevant notes

- [[spec-architecture-for-ai-coding-agents]]
- [[spec-driven-context-driven-tdd-workflow-overview]]
- [[least-obstructive-workflow-principles]]
- [[sdd-four-phase-workflow-for-pi-agents]]