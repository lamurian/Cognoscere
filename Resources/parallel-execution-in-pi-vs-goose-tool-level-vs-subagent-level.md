---
title: 'Parallel Execution in Pi vs Goose: Tool-Level vs Subagent-Level'
description: Pi parallelizes sibling tool calls within a single agent turn (deterministic, no extra LLM cost); Goose parallelizes whole subagents and even external ACP agents via LLM-orchestrated decomposition.
author: pi
editor: lam
date: 2026-08-11T17:08:32.161Z
tags:
  - pi-agent
  - goose
  - orchestration
  - workflow
  - comparison
---
## Summary

Pi and Goose parallelize at different levels of the stack. Pi runs sibling tool calls from one assistant message in parallel: they are preflighted sequentially, then executed concurrently, with `tool_execution_start`/`tool_execution_update`/`tool_execution_end` events interleaving across tools and `tool_result` handlers chaining in completion order. This parallelism lives inside the single-agent loop, is fully deterministic, and costs zero extra LLM calls [@earendilworks2026].

Goose parallelizes at the agent level. Subagents are independent instances spawned via natural language or recipes ("create three HTML templates in parallel"), with sequential or parallel execution semantics. An orchestration layer decomposes a task, delegates subtasks to subagents, async delegates, or external ACP providers (Claude Code, Codex, Amp), and coordinates results — including phased workflows that run reads in parallel and writes sequentially. Subagents are constrained: they cannot spawn sub-subagents, manage extensions, or touch the scheduler, and default to 25 turns with a 5-minute timeout [@goosedocs2026a; @gooseblog2026].

Implications differ sharply. Pi's tool-level parallelism is cheap, deterministic, and good for batching independent operations within one turn. Goose's subagent-level parallelism scales across independent tasks and heterogeneous agents, but the decomposition and coordination are LLM-orchestrated (inferential, not deterministic), and a failing parallel subagent silently drops its partial results while the successful ones return [@goosedocs2026a].

For multi-agent parallelism, Goose is first-class out of the box; Pi achieves it externally through RPC mode or the remote-pi mesh. Both respect dependency structure — parallel reads, sequential writes — but Pi encodes it in same-turn tool batching while Goose encodes it in workflow prompts [@gooseblog2026; @earendilworks2026].

## Key Points

- Pi: parallel sibling tool calls in one agent turn — deterministic, zero extra LLM cost
- Goose: parallel subagents and external ACP agents — LLM-orchestrated decomposition with partial-result semantics on failure
- Pi multi-agent parallelism is external (RPC, mesh); Goose ships it built-in
- Both follow parallel-reads, sequential-writes dependency discipline

## Sources

[@earendilworks2026] -- Extensions, pi coding agent documentation, 2026
[@goosedocs2026a] -- Subagents, Goose documentation, 2026
[@gooseblog2026] -- Orchestrate Complex Workflows Across Multiple Agents with Goose, 2026

## Relevant notes

- [Pi vs Goose Deterministic Workflow Control](Resources/pi-vs-goose-deterministic-workflow-control.md)
- [Pi vs Goose Extensibility: In-Process Hooks vs MCP Subprocesses](Resources/pi-vs-goose-extensibility-in-process-hooks-vs-mcp-subprocesses.md)
- [Paseo: Cross-Device Coding Agent Orchestration — Executive Summary](Resources/paseo-cross-device-coding-agent-orchestration-executive-summary.md)
- [Paseo vs Alternative Free Open Source Agent Orchestrators](Resources/paseo-vs-alternative-free-open-source-agent-orchestrators.md)
- [Multi-Agent Orchestration Patterns](Resources/multi-agent-orchestration-patterns.md)