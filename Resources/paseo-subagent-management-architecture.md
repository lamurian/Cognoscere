---
title: Paseo Subagent Management Architecture
description: How Paseo daemon and CLI manage subagent spawning, coordination, monitoring, and lifecycle via detached runs, chat rooms, and orchestration skills.
author: pi
editor: lam
date: 2026-08-15T09:54:19.220Z
tags:
  - paseo
  - orchestration
  - subagent
  - multi-agent
  - cli
---
## Summary

Paseo manages subagents through a daemon-based architecture where the CLI acts as both human interface and programmatic API for agent-to-agent orchestration. Subagents are spawned as background processes via `paseo run --detach`, coordinated through persistent chat rooms with mention syntax, and monitored via dedicated CLI commands. The system separates agent execution (on daemon host) from control (any client device), enabling hierarchical delegation where orchestrator agents spawn specialist subagents, wait for results, and synthesize outcomes.

## Key Points

### Subagent Spawning
- **Detached execution**: `paseo run --detach --name <id> --provider <provider> "task"` launches a subagent in background, returning immediately with an agent ID
- **Worktree isolation**: `--worktree <name>` creates isolated git worktrees on separate branches for parallel development without file conflicts
- **Provider flexibility**: Supports 35+ providers (Claude Code, Codex, OpenCode, Pi, Cursor, Copilot, Gemini CLI, etc.) via native adapters or ACP catalog
- **Structured output**: `--output-schema <schema.json>` constrains subagent output to JSON for programmatic consumption

### Coordination Mechanisms
- **Persistent chat rooms**: `paseo chat create/post/read/wait` provides async message passing between agents with full audit trail
- **Mention routing**: `` `@<agent-id>` `` targets specific agents; `` `@everyone` `` broadcasts to room
- **Orchestration skills** (injected into agent conversations):
  - `/paseo-handoff` — passes task with full context (files, state, acceptance criteria) to another agent
  - `/paseo-loop` — worker/verifier retry cycles with shell checks and iteration limits
  - `/paseo-committee` — two high-reasoning agents for root cause analysis without file edits
  - `/paseo-advisor` — single agent second opinion without delegation
  - `/paseo-orchestrator` — full team setup with role assignment and chat-based coordination

### Monitoring and Control
- **`paseo ls`** — lists running agents (`-a` for all, `-g` global, `--json` for scripting)
- **`paseo attach <id>`** — streams live output (Ctrl+C detaches without stopping)
- **`paseo logs <id>`** — full timeline with `-f` follow, `--tail N`, `--filter tools`
- **`paseo send <id> "msg"`** — queues follow-up tasks to running/idle agents (`--image`, `--no-wait`)
- **`paseo wait <id>`** — blocks until completion (supports `--timeout` for scripts)
- **`paseo stop <id>`** — terminates agent
- **`paseo agent mode <id> plan`** — changes operational mode (provider-specific)

### Architecture Principles
- **Daemon separation**: Agents execute on daemon host with full dev environment; users control from any device (desktop, web, mobile, CLI) via WebSocket
- **No proprietary agent**: Paseo launches existing CLI tools as subprocesses — preserves subscriptions, skills, configs, MCP servers
- **Privacy-first**: No telemetry, local-first voice (ONNX), E2E encrypted relay, code never leaves user's machine

## Sources

- [Paseo CLI Multi-Agent Orchestration](Resources/paseo-cli-multi-agent-orchestration.md)
- [Paseo Architecture: Daemon-Based Cross-Device Agent Orchestration](Resources/paseo-architecture-daemon-based-cross-device-agent-orchestration.md)
- [Paseo.sh: Chat Room and Agentic Orchestration Platform](Resources/paseo-sh-chat-room-and-agentic-orchestration-platform.md)
- [Paseo CLI Agent Monitoring and Interaction](Resources/paseo-cli-agent-monitoring-and-interaction.md)
- [Paseo CLI Run Command Flags](Resources/paseo-cli-run-command-flags.md)

## Relevant notes

- [Paseo vs Alternative Free Open Source Agent Orchestrators](Resources/paseo-vs-alternative-free-open-source-agent-orchestrators.md)
- [Parallel Execution in Pi vs Goose: Tool-Level vs Subagent-Level](Resources/parallel-execution-in-pi-vs-goose-tool-level-vs-subagent-level.md)
- [Paseo.sh: Chat Room and Agentic Orchestration Platform](Resources/paseo-sh-chat-room-and-agentic-orchestration-platform.md)
- [Paseo Architecture: Daemon-Based Cross-Device Agent Orchestration](Resources/paseo-architecture-daemon-based-cross-device-agent-orchestration.md)
- [Paseo CLI Multi-Agent Orchestration](Resources/paseo-cli-multi-agent-orchestration.md)