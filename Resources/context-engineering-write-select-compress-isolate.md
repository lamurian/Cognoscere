---
title: 'Context Engineering: Write, Select, Compress, Isolate'
description: 'Four strategies for managing agent context: write outside window, select into window, compress window content, isolate across windows'
author: pi
editor: lam
date: 2026-07-20T23:44:40.062Z
tags:
  - agent
  - context
  - architecture
  - optimization
  - reference
---
## Summary

Context engineering is the art and science of filling the LLM context window with just the right information at each step of an agent's trajectory. The four strategies are Write, Select, Compress, and Isolate [@martin2025].

**Write** saves information outside the context window for later retrieval. Scratchpads let agents take notes during a task (Anthropic's multi-agent researcher saves plans to Memory to survive context truncation). Memories persist across sessions, with products like ChatGPT, Cursor, and Windsurf auto-generating long-term memories from user-agent interactions [@martin2025].

**Select** pulls relevant information into the context window when needed. This covers RAG for knowledge retrieval, memory selection (episodic, procedural, semantic), and tool selection via retrieval-augmented tool descriptions. Code agents use CLAUDE.md or rules files for procedural memory. Embedding and knowledge graph indexing assist semantic memory selection [@martin2025].

**Compress** retains only the tokens required for the task. Summarization (like Claude Code's auto-compact at 95% context window) distills the full trajectory. Cognition uses a fine-tuned model for this step. Trimming uses heuristics like removing older messages or applying trained context pruners [@martin2025].

**Isolate** splits context across sub-agents or environments. Each sub-agent has its own system prompt, tools, and context window, reducing individual window pressure. HuggingFace's CodeAgent runs code in a sandbox where intermediate results stay outside the LLM context, isolating token-heavy objects like images in environment variables rather than the prompt [@martin2025].

## Key Points

- These four strategies compose: write what you don't need now, select what you need later, compress what stays, isolate what grows large.
- Context poisoning, distraction, confusion, and clash are failure modes that these strategies mitigate [@martin2025].
- In pi, the existing skill architecture already implements isolation (each skill has its own context via SKILL.md), while AGENTS.md progressive disclosure implements selection.

## Sources

[@martin2025] -- Lance Martin, "Context Engineering for Agents", rlancemartin.github.io, 2025
[Executive Summary: Harness Engineering for pi Agent Coding](Resources/executive-summary-harness-engineering-for-pi-agent-coding.md)

## Relevant notes

- [Multi-Agent Orchestration Patterns](Resources/multi-agent-orchestration-patterns.md)
- [Local vs Global Correctness in AI-Generated Code](Resources/local-vs-global-correctness-in-ai-generated-code.md)
- [Spec-Driven Context-Driven TDD Workflow for AI Coding Agents](Resources/spec-driven-context-driven-tdd-workflow-for-ai-coding-agents.md)
- [Session Lifecycle Guards in Pi Agent](Resources/session-lifecycle-guards-in-pi-agent.md)
- [Context Engineering for pi Agents](Resources/context-engineering-for-pi-agents.md)