---
title: Session Lifecycle Guards in Pi Agent
description: 'Using pi session lifecycle hooks for guard enforcement: session-scoped policies, per-turn governance, compaction preservation, post-hoc detection'
author: pi
editor: lam
date: 2026-06-12T18:04:13.815Z
tags:
  - guardrails
  - pi-agent
  - lifecycle
  - safety
  - software-engineering
---
## Summary

Pi's session lifecycle hooks provide guard points before and after key transitions: session start, agent start, session switch, session fork, compaction, and shutdown. These allow extensions to enforce policies that span across individual tool calls.

**Session-scoped policies.** The `session_start` hook initializes guardrail state (sandbox config, policy files, logging). The `session_shutdown` hook provides cleanup (flush logs, close connections). The `session_before_switch` and `session_before_fork` hooks — demonstrated in `confirm-destructive.ts` — prevent accidental data loss by prompting before destructive session operations, returning `{ cancel: true }` to abort [@pi-extensions].

**Per-turn governance.** The `before_agent_start` hook fires before each LLM turn. This is where extensions inject turn-specific system prompt fragments (e.g., "You are in read-only mode — do not write files"), set tool availability via `pi.setActiveTools()`, or switch models for specific tasks. The `agent_end` hook fires after completion, useful for post-hoc validation: checking that generated code compiles, tests pass, or no secrets were leaked.

**Compaction guards.** The `session_before_compact` hook, shown in `custom-compaction.ts`, allows extensions to insert custom summary instructions into the compaction process. This can preserve guardrail-relevant context (e.g., "Remember that .env files are protected") that would otherwise be lost during summarization.

**Prompt customization.** The `prompt-customizer.ts` example uses `before_agent_start` with `systemPromptOptions` to add context-aware tool guidance. Guardrail extensions can use this to dynamically adjust tool descriptions and guidelines based on project state — for example, adding "This project has active sandboxing" to the bash tool's guidelines.

**Write-back propagation.** The `agent_end` hook combined with `sendUserMessage` enables guardrails that detect violations after the fact and inject corrective instructions (e.g., "You just modified a protected file — please revert the change"). This "detect-and-correct" pattern complements the "prevent-and-block" pattern of `tool_call` guards.

## Relevant notes

- [[approaches-to-guardrail-design-in-pi-agent-for-llm-aided-software-engineering]]
- [[layered-guardrail-architecture-with-pi-extensions]]
- [[tool-override-wrapping-built-ins-with-guard-layers]]
- [[tool-call-interception-runtime-gating-in-pi-agent]]
- [[sandboxing-and-execution-isolation-in-pi-agent]]