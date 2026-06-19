---
title: 'Tool Call Interception: Runtime Gating in Pi Agent'
description: "Using pi's on(\"tool_call\") hook for runtime gating: permission gates, protected paths, input transformation, multi-factor blocking"
author: pi
editor: lam
date: 2026-06-12T18:04:13.813Z
tags:
  - guardrails
  - pi-agent
  - extensions
  - safety
  - software-engineering
---
## Summary

Pi's extension system provides an `on("tool_call")` lifecycle hook that fires before every tool execution. This is the primary mechanism for runtime guardrail enforcement — extensions can inspect, block, modify, or log any tool call before it reaches the LLM or external systems.

**Permission gating pattern.** The simplest guard is a permission gate that prompts for confirmation before dangerous operations. The `permission-gate.ts` example checks bash commands against dangerous patterns (`rm -rf`, `sudo`, `chmod 777`) and blocks them in non-interactive mode or requests user confirmation in TUI mode. The gate returns `{ block: true, reason: "..." }` to abort execution, or `undefined` to allow it through [@pi-extensions].

**Protected paths pattern.** The `protected-paths.ts` example prevents writes and edits to sensitive files (.env, .git/, node_modules/). It intercepts `write` and `edit` tool calls, checks the target path against a blocklist, and returns a block decision. This prevents accidental or malicious modification of critical project files.

**Input transformation.** Beyond blocking, the `tool_call` hook can modify event input before execution. For example, an extension could sanitize file paths, redact sensitive patterns from command arguments, or downgrade operation permissions — all without replacing the underlying tool implementation.

**Multi-factor gating.** Multiple extensions can each register `tool_call` handlers. Pi chains them in load order; if any returns a block decision, the tool call is aborted. This enables defense-in-depth: a sandbox extension can block at OS level while a policy extension blocks at the semantic level.

**Key consideration.** `tool_call` hooks run synchronously in the agent's turn loop. Expensive checks (network calls, heavy classification) should be avoided or cached, as they extend the tool's execution time. For async-heavy validation, consider tool override instead.

## Relevant notes

- [Approaches to Guardrail Design in Pi Agent for LLM-Aided Software Engineering](approaches-to-guardrail-design-in-pi-agent-for-llm-aided-software-engineering.md)
- [Layered Guardrail Architecture with Pi Extensions](layered-guardrail-architecture-with-pi-extensions.md)
- [Tool Override: Wrapping Built-Ins with Guard Layers](tool-override-wrapping-built-ins-with-guard-layers.md)
- [Sandboxing and Execution Isolation in Pi Agent](sandboxing-and-execution-isolation-in-pi-agent.md)
- [Session Lifecycle Guards in Pi Agent](session-lifecycle-guards-in-pi-agent.md)