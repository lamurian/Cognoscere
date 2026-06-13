---
title: 'Paseo.sh: Chat Room and Agentic Orchestration Platform'
description: Overview of paseo.sh chat room system and how it enables multi-agent orchestration via async coordination, @mentions, team orchestration skills, and persistent message rooms.
author: pi
editor: lam
date: 2026-06-13T03:37:00.911Z
tags:
  - orchestration
  - paseo
  - open-source
  - tools
  - workflow
  - llm-agents
  - architecture
source: https://paseo.sh/
---

## Overview

Paseo is a free, open-source (AGPL-3.0) orchestration platform for AI coding agents built by solo maintainer Mo. It provides a unified interface for running Claude Code, Codex, Copilot, OpenCode, Pi, Gemini CLI, Cursor CLI, and 34+ other coding agents from desktop, mobile, web, or CLI. The project has ~8,500 stars on GitHub and is hosted at [paseo.sh](https://paseo.sh) [@getpaseo/paseo](https://github.com/getpaseo/paseo).

## Architecture

Paseo runs a local daemon that manages agent process lifecycles, permissions, and timeline events. Clients connect over WebSocket. Remote access is supported through an optional end-to-end encrypted relay or direct connections via Tailscale, Cloudflare Tunnel, etc. Paseo does not ship its own agent harness — it launches each provider's native CLI as a subprocess, so existing subscriptions, skills, configs, and MCP servers remain intact.

## Chat Room System

The CLI includes chat commands for asynchronous agent coordination through persistent chat rooms [@paseo-chat](https://skills.rest/skill/paseo-chat):

- `paseo chat create <name> --purpose "<description>"` creates a named room with a stated purpose
- `paseo chat post <room> "<message>"` posts a message, optionally with `--reply-to <msg-id>` for threading
- `paseo chat post <room> "@<agent-id> <message>"` mentions a specific agent; `@everyone` broadcasts to the room
- `paseo chat read <room>` reads messages with filtering by agent, limit, or time range
- `paseo chat wait <room>` blocks until new messages arrive

These chat rooms are persistent — messages remain as an audit trail of agent decisions and coordination history.

## How Chat Rooms Enable Agentic Orchestration

Paseo's chat rooms serve as the substrate for multi-agent orchestration in several ways:

**Asynchronous coordination.** Agents post updates and leave messages without blocking each other. This decouples agent workflows — one agent can complete a task, post results to a room, and move on while other agents consume those results when ready.

**Agent-to-agent messaging.** @mentions route messages to specific agents or broadcast to the entire team. The daemon routes system messages and chat mentions to all intended recipients consistently.

**Team orchestration via /paseo-orchestrator.** This skill builds and manages a team of agents coordinating through a shared chat room. The user describes the work, the orchestrator sets up roles, launches agents, and coordinates through chat. A heartbeat schedule periodically checks progress and posts status updates to the room.

**Integrated orchestration skills.** Paseo ships several skills that leverage the chat/agent management layer:

- `/paseo-handoff` — hands off a task to another agent with full context (task, files, state, acceptance criteria) in a self-contained briefing
- `/paseo-loop` — runs a worker/verifier cycle with optional shell checks, max iterations, and time limits
- `/paseo-committee` — forms two high-reasoning agents for root cause analysis and planning without editing files
- `/paseo-advisor` — spins up a single agent for a second opinion without delegating work
- `/paseo-orchestrator` — full team setup with role assignment, agent launch, and chat-based coordination

**Scheduled and looped coordination.** The schedule system (`paseo schedule`) supports cron and interval-based execution, enabling recurring agent tasks. Combined with chat rooms, agents can be scheduled to post status updates, run health checks, or perform maintenance and report results back to the team room.

## Privacy and Data Flow

Paseo has no telemetry or tracking. Voice processing is local by default (ONNX models on CPU). The relay is end-to-end encrypted — Paseo cannot read traffic. Agents run on the user's own machines and talk directly to their respective provider APIs.

## How It Compares

Paseo is branch-oriented (agents work in isolated git worktrees) and multi-provider, distinguishing it from task-oriented alternatives like AgentsRoom. Its chat room layer is a distinguishing feature — most agent orchestration tools lack persistent asynchronous coordination channels between agents, relying instead on sequential handoffs or shared file systems.

## Relevant notes

- [[paseo-architecture-daemon-based-cross-device-agent-orchestration]]
- [[paseo-cross-device-coding-agent-orchestration-executive-summary]]
- [[paseo-vs-alternative-free-open-source-agent-orchestrators]]
- [[the-agent-orchestration-landscape-in-2026]]