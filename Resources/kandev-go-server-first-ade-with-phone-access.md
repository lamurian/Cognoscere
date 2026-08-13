---
title: 'Kandev: Go Server-First ADE with Phone Access'
description: 'Kandev: Go-backend, server-first ADE with phone/browser access, remote runtimes (Docker/SSH/cloud), 19+ ACP agents, kanban workflows, AGPL-3.0'
author: pi
editor: lam
date: 2026-08-12T23:16:52.881Z
tags:
  - golang
  - self-hosting
  - orchestration
  - agent
  - open-source
  - server
  - ai-agents
  - mobile
  - tools
  - paseo
---
## Summary

Kandev is an open-source (AGPL-3.0) agentic development environment with a Go backend, React/Vite web frontend, and optional Tauri desktop shell. Its defining trait is a server-first architecture: the core app runs as a server you can access from any device, including your phone, typically through Tailscale or any VPN [@kdlbs2026]. This makes it the closest Go-language equivalent to Paseo's daemon-plus-clients model.

**Architecture.** The `apps/backend` Go service is the orchestrator: agent lifecycle, worktree management, and a WebSocket gateway. `apps/web` is a Vite/React SPA with real-time subscriptions; `apps/desktop` is a Tauri shell; `apps/cli` is an npx launcher. Agents run in isolated git worktrees, one per task. Kandev supports 19+ agents through ACP (Claude Code, Codex, Copilot, Gemini, Amp, Auggie, OpenCode, Cursor, Devin, Qwen, Pi, Kiro, Grok, Hermes, and more), plus CLI passthrough to any agent's native TUI [@kdlbs2026].

**Remote execution.** Executors run agents as local processes, in isolated Docker containers, over SSH on remote servers, or in cloud executors (sprites.dev). Each executor type supports profiles with prepare scripts, environment variables, and credentials. This extends Paseo's "agents run on the daemon host" model to arbitrary remote hosts [@kdlbs2026].

**Workflow layer.** Kanban and pipeline views with drag-and-drop columns; agentic multi-step workflows that mix agents per step (Claude Opus to plan, Copilot Sonnet to implement, Codex to review); sub-tasks that resume from a parent session; multi-repository tasks with one worktree per repo and per-repo PRs; task-agent MCP so agents can create sub-tasks; external MCP over streamable HTTP/SSE [@kdlbs2026].

**Fit vs Paseo.** Shared traits: self-hosted server, cross-device access, worktree isolation, multi-provider support, in-app browser preview, chat-plus-terminal control. Kandev adds kanban task management, review-first workflow gates, and remote runtimes (SSH/Docker/cloud) that Paseo lacks. Paseo adds native iOS/Android apps and an encrypted relay for remote access without a VPN. Kandev installs as native bundles (brew, scoop, AppImage) with no Node.js requirement; Paseo requires npm. Both are AGPL-3.0.

**Limitations.** Younger project (598 stars); browser-based mobile experience rather than native apps; no relay service; the "Office mode" autonomy layer is still feature-flagged [@kdlbs2026].

## Key Points

- Go backend, React frontend, Tauri desktop shell, AGPL-3.0, no telemetry
- Server-first: web UI reachable from any device including phone; Tailscale/VPN recommended
- Executors: local process, Docker, SSH, cloud (sprites.dev) — remote agent execution out of the box
- 19+ agents via ACP; CLI passthrough for native TUIs; worktree isolation per task
- Kanban + pipeline views, review gates, multi-repo tasks, sub-tasks, MCP over HTTP/SSE
- Native installs (brew/scoop/AppImage) — no Node dependency
- Gaps vs Paseo: no native mobile apps, no relay service, younger project
- Top Go pick for replacing Paseo's cross-device ADE role

## Sources

- [@kdlbs2026] Kandev GitHub repository
- [Paseo: Cross-Device Coding Agent Orchestration — Executive Summary](paseo-cross-device-coding-agent-orchestration-executive-summary.md)

## Relevant notes

- [Paseo Alternatives in Rust and Go — Executive Summary](Resources/paseo-alternatives-in-rust-and-go-executive-summary.md)
- [Paseo vs Alternative Free Open Source Agent Orchestrators](Resources/paseo-vs-alternative-free-open-source-agent-orchestrators.md)
- [Paseo: Cross-Device Coding Agent Orchestration — Executive Summary](Resources/paseo-cross-device-coding-agent-orchestration-executive-summary.md)
- [Paseo Architecture: Daemon-Based Cross-Device Agent Orchestration](Resources/paseo-architecture-daemon-based-cross-device-agent-orchestration.md)
- [Paseo.sh: Chat Room and Agentic Orchestration Platform](Resources/paseo-sh-chat-room-and-agentic-orchestration-platform.md)