---
title: 'jcode Cross-Harness Session Resume: Foreign Transcript Portability'
description: jcode /resume imports sessions from Claude Code, Codex, opencode, and pi by reading their on-disk session stores and reconstructing context in its TUI.
author: pi
editor: lam
date: 2026-08-16T00:54:43.205Z
tags:
  - ai-agents
  - rust
  - session
  - portability
  - cli
---
## Summary

jcode's `/resume` (or `jcode --resume <name>`) can pick up conversations saved by other terminal harnesses — Claude Code, Codex, opencode, and pi — and continue them inside jcode's TUI [@huang2026a]. The practical framing from the maintainer and reviewers: a crashed harness, or a harness evaluation, no longer costs you the conversation. Institutions that document this: the jcode README shows a `/Resume` flow for Codex sessions and states "Session resume is supported for codex, claude code, opencode, and pi" [@huang2026a]; independent reviews repeat the claim [@grigio2026; @agentosguide2026].

Mechanically, each harness persists sessions to disk in its own format, and jcode reads those stores and reconstructs the conversation context. pi stores session trees under `~/.pi/agent/sessions`; Claude Code stores JSONL transcripts under `~/.claude/projects`; Codex stores rollout event logs under `~/.codex/sessions` [@podvirnyi2026]. The existence of an independent bridge tool (agent-session-bridge) that converts between these same three stores confirms the formats are parseable and that cross-harness resume is a real, practiced pattern rather than vaporware — the bridge does for pi/Claude Code/Codex natively what jcode does internally for all four [@podvirnyi2026].

What this means in practice: history and in-flight decisions are portable. A team evaluating jcode against pi can start in pi, switch to jcode, and carry the decisions and context across; a session that died mid-task in another harness can be resurrected in jcode. It also signals jcode's stance that the ecosystem is additive rather than competitive — import is the default posture, not lock-in [@grigio2026].

Caveat: the resume feature is a maintainer claim documented primarily in the README and secondary reviews; the exact fidelity of pi-session reconstruction (pi's session-tree branching has no exact analog in jcode's flat sessions) is not publicly documented in detail.

## Key Points

- `/resume` imports sessions from Claude Code, Codex, opencode, and pi into jcode's TUI
- Each harness stores sessions differently: pi session trees in `~/.pi/agent/sessions`, Claude Code JSONL in `~/.claude/projects`, Codex rollout logs in `~/.codex/sessions`
- jcode reads the foreign stores and reconstructs conversation context to continue the thread
- Independent bridge tools (agent-session-bridge) convert between the same stores, confirming the pattern
- Value: crashed sessions recoverable; evaluating harnesses does not abandon history; ecosystem treated as additive
- pi's own portability is outward (RPC mode for orchestrators like Paseo); jcode's is inward (imports other tools' histories)

## Sources

[@huang2026a] -- Huang, Jeremy, jcode — The most RAM efficient harness, GitHub, 2026
[@grigio2026] -- Grigio, Federico, jcode: The Coding Agent That Raises the Skill Ceiling, vs opencode and pi, 2026
[@agentosguide2026] -- Agent OS Guide, jcode — The Most RAM-Efficient AI Coding Agent, 2026
[@podvirnyi2026] -- Podvirnyi, Bohdan, Agent Session Bridge, GitHub, 2026

## Relevant notes

- [jcode vs pi: Efficiency and Philosophy](Resources/jcode-vs-pi-efficiency-and-philosophy.md)
- [jcode: Rust Terminal Coding Agent Harness](Resources/jcode-rust-terminal-coding-agent-harness.md)
- [jcode Resource Efficiency: RAM and Startup as Differentiators](Resources/jcode-resource-efficiency-ram-and-startup-as-differentiators.md)
- [jcode vs Goose: Harness Focus vs General-Purpose Agent](Resources/jcode-vs-goose-harness-focus-vs-general-purpose-agent.md)
- [jcode Self-Dev Mode: Agent Rebuilds Its Own Binary](Resources/jcode-self-dev-mode-agent-rebuilds-its-own-binary.md)