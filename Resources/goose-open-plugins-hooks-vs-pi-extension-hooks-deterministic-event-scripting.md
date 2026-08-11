---
title: 'Goose Open Plugins Hooks vs Pi Extension Hooks: Deterministic Event Scripting'
description: Goose hooks are external shell scripts fired by lifecycle events (Open Plugins spec, hooks.json); Pi hooks are in-process TypeScript with mutable access to the agent loop — both deterministic, differing in expressiveness and failure semantics.
author: pi
editor: lam
date: 2026-08-11T20:07:20.391Z
tags:
  - pi-agent
  - goose
  - hooks
  - extensions
  - comparison
  - workflow
  - automation
---
## Summary

Goose's hook system (added May 2026) is deterministic and programmatic: shell commands triggered by lifecycle events, following the Open Plugins hooks specification. Hooks live in plugin directories (`~/.agents/plugins/<name>/` user scope, `<project>/.agents/plugins/<name>/` project scope) with a `hooks/hooks.json` config mapping events to commands. When an event fires, goose runs the command via `sh -c`, sets `PLUGIN_ROOT`, and pipes a JSON payload (event, session_id, tool_name, tool_input, matcher_context) to stdin. Supported events: SessionStart, SessionEnd, Stop, UserPromptSubmit, PreToolUse, PostToolUse, PostToolUseFailure, BeforeReadFile, AfterFileEdit, BeforeShellExecution, AfterShellExecution. A matcher regex per event filters on tool name, file path, or shell command [@goosedocs2026c; @gooseblog2026a].

Determinism: hooks are not subject to LLM interpretation — they run exactly when the trigger fires. Most events are observation-only, but PreToolUse and Stop can block: a PreToolUse hook denies a tool call by exiting 2 (reason from stderr) or printing `{"decision":"block","reason":"..."}` to stdout; a Stop hook can force the turn to continue (capped to prevent loops). Broken hooks fail open — goose logs and continues [@goosedocs2026c].

Pi hooks are the in-process counterpart: TypeScript handlers registered via `pi.on()` that receive typed event objects plus an ExtensionContext (sessionManager, UI, signal, model registry). They can mutate `tool_call` input, rewrite `tool_result` output, inject messages and system prompt fragments at `before_agent_start`, cancel session switches, and trigger compaction — with return values like `{block: true, reason}` or `{cancel: true}` [@earendilworks2026].

Comparison: both are deterministic and event-triggered. Goose hooks are simpler (any language, drop-in folder, JSON on stdin) and portable (Open Plugins spec shared with other agents), but less expressive: a fixed event set, regex matchers, mostly observational, fail-open. Pi hooks are more expressive (mutable inputs, result rewriting, chained middleware across extensions, full session API) but require TypeScript and pi-specific knowledge, and run synchronously in the turn loop. Goose blocks only at PreToolUse/Stop; Pi can gate at tool_call and cancel at multiple lifecycle points [@goosedocs2026c; @earendilworks2026].

## Key Points

- Goose hooks: external shell commands on lifecycle events, configured in hooks.json (Open Plugins spec), JSON payload on stdin — deterministic, never LLM-interpreted
- Only PreToolUse and Stop can block in Goose; all other events are observation-only and hooks fail open
- Pi hooks: in-process TypeScript with typed events and full ExtensionContext — mutable tool input, result rewriting, prompt injection, session cancellation
- Both deterministic; Pi more expressive, Goose simpler, language-agnostic, and spec-portable

## Sources

[@goosedocs2026c] -- Hooks, goose Documentation, 2026
[@gooseblog2026a] -- Hooks: Run Your Own Scripts on Every Goose Event, 2026
[@earendilworks2026] -- Extensions, pi coding agent documentation, 2026

## Relevant notes

- [Pi vs Goose Deterministic Workflow Control](Resources/pi-vs-goose-deterministic-workflow-control.md)
- [Pi vs Goose Extensibility: In-Process Hooks vs MCP Subprocesses](Resources/pi-vs-goose-extensibility-in-process-hooks-vs-mcp-subprocesses.md)
- [Parallel Execution in Pi vs Goose: Tool-Level vs Subagent-Level](Resources/parallel-execution-in-pi-vs-goose-tool-level-vs-subagent-level.md)
- [Paseo Workflow Fit: ADR-Driven TDD Pipeline with Quality Gates — Executive Summary](Resources/paseo-workflow-fit-adr-driven-tdd-pipeline-with-quality-gates-executive-summary.md)
- [Paseo: Cross-Device Coding Agent Orchestration — Executive Summary](Resources/paseo-cross-device-coding-agent-orchestration-executive-summary.md)