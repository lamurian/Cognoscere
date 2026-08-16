---
title: 'jcode Session Tools: Inventory and Usage'
description: "Complete inventory of jcode's ~30 built-in session tools (registry-verified) with usage: code/execution/retrieval/planning/collaboration categories, slash commands, CLI entry points, and tool policy controls."
author: pi
editor: lam
date: 2026-08-16T16:38:09.226Z
tags:
  - ai-agents
  - rust
  - terminal
  - cli
  - reference
  - tools
  - workflow
---
## Summary

A jcode session exposes roughly thirty built-in tools plus namespace-prefixed MCP tools, with tool schemas injected at runtime while the core prompt stays at 671 tokens. The definitive registration list lives in `crates/jcode-app-core/src/tool/mod.rs` (@huang2026a): file tools (read, write, edit, multiedit, patch, apply_patch, ls, agentgrep), execution (bash, bg, computer), retrieval (websearch — "Search the web.", webfetch — "Fetch a URL.", session_search, conversation_search, memory, skill, jcode_docs), planning and persistence (todo, goal — "Manage durable initiatives.", schedule, selfdev), collaboration (swarm, gmail), UI (open, side_panel, browser), and batching (batch); MCP servers register under mcp__server__tool names. Registered tools are sorted by name for deterministic ordering, which keeps the prompt cache warm (the same mechanism that advertises MCP tools up front from an on-disk schema cache, connecting on first call) [@huang2026; @huang2026d].

Tool access is policed at the registry: an allowlist/denylist policy (`allowed`/`disabled` sets, with `mcp` matching any mcp__* name) can block tools per session, alias resolution maps Claude-Code-style names (e.g. shell_exec → bash) to canonical ones, and a closest-name matcher suggests up to three similar tools when the model hallucinates a tool name (#104) [@huang2026a]. Prompt layering lets you steer tool use without rebuilding: `./.jcode/preferred-tools.md` and `~/.jcode/preferred-tools.md` bias which tools the model prefers, and prompt-overlay files add instructions; changing the embedded base prompt requires a selfdev rebuild since it ships via include_str! [@huang2026d].

How to use the core tools: the system prompt instructs the agent to use the todo tool extensively — it is the plan surface, with confidence ratings at assignment and completion that drive confidence stepping and the auto-poke loop [jcode Plan/Execute with TDD: Native Todo Loop, No Plan Mode](Resources/jcode-plan-execute-with-tdd-native-todo-loop-no-plan-mode.md). bash takes command, intent, timeout (ms, default 120000, cap 600000), run_in_background, notify, wake, and justification; a deterministic destructive gate denies catastrophic commands and holds risky ones for a justification the model must supply [jcode Bash Tool and the Destructive-Command Gate](Resources/jcode-bash-tool-and-the-destructive-command-gate.md). Background work uses bg: any command started with run_in_background becomes a listable, tailable, cancelable, waitable task that wakes the agent on completion or JCODE_PROGRESS checkpoints, rendered as live cards ("6/10 tests") that survive binary reloads [@huang2026]. memory exposes remember, recall, search, tag, link, and forget with scopes, provenance, and decaying confidence [jcode Semantic Memory: Vector Graph Recall Without Token Burn](Resources/jcode-semantic-memory-vector-graph-recall-without-token-burn.md), and the browser tool wraps Firefox Agent Bridge with actions open, snapshot, get_content, interactables, click, type, fill_form, select, wait, screenshot, eval, scroll, upload, press [@huang2026a].

Slash commands are the user-facing controls: /model, /effort, /login, /account, /resume, /fork, /transfer, /compact, /clear, /rewind, /todos, /commit, /commit-push, /review (one-shot review session), /test (verify a claim with layered tests), /diff, /memory, /swarm, /skills, /usage, /info, /config, /hotkeys, /update, /selfdev, /quit, plus /swarm-prompt and /alignment [@huang2026d; @huang2026a]. CLI entry points are jcode (TUI), jcode run "…" (headless, auto-poke until done), jcode --resume, jcode serve / connect, jcode login --provider, jcode provider add, jcode auth-test, jcode pair, jcode dictate, jcode browser status/setup, jcode api-bridge, and jcode selfdev --build [@huang2026d].

## Key Points

- ~30 built-in tools registered in src/tool/mod.rs, plus mcp__server__tool namespaces; schemas injected at runtime, sorted for prompt-cache stability
- Code: read, write, edit, multiedit, patch, apply_patch, ls, agentgrep (structure-aware grep with adaptive truncation)
- Execution: bash (with destructive gate), bg (background tasks with JCODE_PROGRESS live cards), computer (screen/input/keys computer use)
- Retrieval: websearch, webfetch, session_search, conversation_search, memory (remember/recall/search/tag/link/forget), skill, jcode_docs
- Planning/persistence: todo (confidence + auto-poke plan surface), goal (durable initiatives, hill-climbability scored), schedule (ambient mode), selfdev
- Collaboration/UI: swarm (spawn teammates, coordinator+workers), gmail, open, side_panel, browser (Firefox Agent Bridge, ~13 actions), batch
- Controls: allow/deny tool policy, alias resolution (shell_exec→bash), closest-name suggestions for hallucinated tool names (#104)
- Configure tool preference via ~/.jcode/preferred-tools.md and prompt overlays; embedded base prompt needs selfdev rebuild
- Slash commands and CLI entry points as listed above; permissions layered as bash gate + two-tier safety system

## Sources

[@huang2026] -- jcode — open-source AI coding agent for the terminal, jcode.sh, 2026
[@huang2026a] -- Huang, Jeremy, jcode — The most RAM efficient harness, GitHub, 2026
[@huang2026d] -- Huang, Jeremy, jcode Docs: install, providers, configuration, keybindings, jcode.sh/docs, 2026

## Relevant notes

- [jcode: Rust Terminal Coding Agent Harness](Resources/jcode-rust-terminal-coding-agent-harness.md)
- [jcode vs Goose: Harness Focus vs General-Purpose Agent](Resources/jcode-vs-goose-harness-focus-vs-general-purpose-agent.md)
- [jcode Resource Efficiency: RAM and Startup as Differentiators](Resources/jcode-resource-efficiency-ram-and-startup-as-differentiators.md)
- [jcode Plan/Execute with TDD: Native Todo Loop, No Plan Mode](Resources/jcode-plan-execute-with-tdd-native-todo-loop-no-plan-mode.md)
- [jcode Cross-Harness Session Resume: Foreign Transcript Portability](Resources/jcode-cross-harness-session-resume-foreign-transcript-portability.md)