---
title: 'Tool Override: Wrapping Built-Ins with Guard Layers'
description: "Overriding pi's built-in tools with guard layers: audit logging, operations injection, remote routing, and the tradeoff vs tool_call interception"
author: pi
editor: lam
date: 2026-06-12T18:04:13.814Z
tags:
  - guardrails
  - pi-agent
  - extensions
  - safety
  - software-engineering
---
## Summary

Pi extensions can register tools with the same name as built-in tools (`read`, `bash`, `edit`, `write`, `grep`, `find`, `ls`), replacing them with guarded implementations. This is a more powerful pattern than `tool_call` interception because the extension gains full control over the entire execution lifecycle.

**Audit logging pattern.** The `tool-override.ts` example overrides `read` to log every file access to a persistent audit log, block sensitive paths (.env, secrets, SSH keys), and delegate allowed reads to the original implementation. The override preserves built-in rendering (syntax highlighting, line numbers) by omitting `renderCall` and `renderResult`, so the UI remains unchanged [@pi-extensions].

**Operations injection.** For `bash`, pi's `createBashTool` accepts a `spawnHook` that can adjust command, cwd, or environment variables before execution. This enables prefix injection (e.g., source a profile, add timeouts, set resource limits) without reimplementing the shell backend [@pi-sdk].

**Remote execution routing.** Tool operations interfaces (`ReadOperations`, `WriteOperations`, `EditOperations`, `BashOperations`, etc.) allow delegation to remote systems. Extensions can create tool instances that execute commands on SSH targets, containers, or sandbox environments while keeping the same tool name and API contract [@pi-extensions].

**UI transparency.** Override tools inherit built-in rendering by default. The LLM sees the same tool interface; only the implementation changes. This makes guard layers transparent to both the user and the model — no changes to prompts or workflows required.

**Tradeoff.** Tool override is all-or-nothing per tool name. If multiple extensions register the same override, only one wins (last registered, or first in case of collision). For compositional guards (e.g., both logging and path blocking), use the `tool_call` event instead, which chains naturally.

## Relevant notes

- [[sandboxing-and-execution-isolation-in-pi-agent]]
- [[approaches-to-guardrail-design-in-pi-agent-for-llm-aided-software-engineering]]
- [[tool-call-interception-runtime-gating-in-pi-agent]]
- [[layered-guardrail-architecture-with-pi-extensions]]
- [[session-lifecycle-guards-in-pi-agent]]