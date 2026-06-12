---
title: Layered Guardrail Architecture with Pi Extensions
description: 'Five-layer defense-in-depth guardrail architecture using pi extensions: tool interception, tool override, session governance, system policy, and human-in-the-loop'
author: pi
editor: lam
date: 2026-06-12T18:04:13.816Z
tags:
  - guardrails
  - pi-agent
  - architecture
  - safety
  - software-engineering
---
## Summary

Pi's extension architecture enables a layered guardrail design that mirrors the academic state of the art: multiple independent guard layers at the tool, session, and system levels compose into a defense-in-depth posture.

**Layer 1: Tool-level interception.** `on("tool_call")` hooks provide input validation, permission gating, and path protection. Multiple extensions chain naturally, enabling separation of concerns: one extension checks paths, another checks command patterns, a third logs decisions.

**Layer 2: Tool-level override.** Full tool replacement with sandboxed, audited, or remote-routed implementations. This layer handles execution isolation (sandbox), audit trails (tool-override), and operational constraints (timeouts, resource limits).

**Layer 3: Session-level governance.** Lifecycle hooks enforce policies that span individual turns: read-only mode via `setActiveTools`, model switching via `setModel`, and compaction preservation via `session_before_compact`. The `confirm-destructive.ts` pattern prevents session-level accidents.

**Layer 4: System-level policy.** Three-tier configuration (defaults ← global ← project) provides declarative policy enforcement without code changes. The sandbox extension's JSON config files are a template: extensions can define policy schemas that operators edit directly. The `settings.json` enable/disable toggles control which guardrails are active.

**Layer 5: Human-in-the-loop.** Pi's `ctx.ui.confirm()`, `ctx.ui.select()`, and `ctx.ui.custom()` provide interactive approval gates. The permission-gate pattern shows conditional gating: dangerous operations require human confirmation in TUI mode but are blocked by default in non-interactive modes. This implements the HITL pattern from guardrail research [@navneet2025].

**Composition principle.** Each layer should fail independently. If tool-level interception is bypassed (e.g., a bug in the pattern matcher), the session-level `agent_end` check should catch the violation. If session-level checks fail, the OS sandbox provides a final barrier. This aligns with the "no free lunch" principle — no single layer is perfect, but together they cover each other's blind spots [@kumar2025].

## Relevant notes

- [[approaches-to-guardrail-design-in-pi-agent-for-llm-aided-software-engineering]]
- [[sandboxing-and-execution-isolation-in-pi-agent]]
- [[tool-call-interception-runtime-gating-in-pi-agent]]
- [[tool-override-wrapping-built-ins-with-guard-layers]]
- [[session-lifecycle-guards-in-pi-agent]]