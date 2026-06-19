---
title: 'Paseo Architecture: Daemon-Based Cross-Device Agent Orchestration'
description: "Paseo's daemon-based architecture: separates agent execution from UI, multi-provider via native adapters and ACP catalog, cross-device access"
author: pi
editor: lam
date: 2026-06-13T04:03:03.184Z
tags:
  - research
  - paseo
  - architecture
  - orchestration
  - llm-agents
---

Paseo (paseo.sh) is an open-source (AGPL-3.0) orchestration layer for AI coding agents, built around a daemon-based architecture that separates agent execution from the user interface. Created by solo maintainer Mo, it started as a push-to-talk voice interface for Claude Code and evolved into a full cross-device orchestration platform.

**Daemon model.** The Paseo daemon runs as a background process on any machine (laptop, VM, dev server, Docker). Desktop, web, mobile (iOS/Android), and CLI clients all connect to it over WebSocket. This decouples where agents run from where the user controls them — agents execute on the daemon host with full dev environment access, while the user can monitor and interact from any device.

**Provider architecture.** Paseo does not ship its own coding agent. It launches and supervises existing CLI tools as subprocesses. It has two tiers of provider support: native adapters for Claude Code, Codex, OpenCode, and Pi (with mode metadata and voice support), and an ACP (Agent Client Protocol) catalog for 30+ additional agents including Cursor, Gemini CLI, GitHub Copilot, Hermes, Kimi, and Qwen Code. Custom providers can wrap any CLI agent [@paseo-providers].

**Key features.** Split panes and tabs (⌘D vertical, ⌘⇧D horizontal) with terminal, diff viewer, and in-app browser side by side. Per-worktree dev server URLs that eliminate port conflicts when multiple agents run dev servers simultaneously. Built-in GitHub workflow handling (commit, push, PR, checks, reviews, merge). Fully local voice stack (speech-to-text and text-to-speech on-device). End-to-end encrypted relay for remote access without exposing the daemon port directly [@paseo-website].

**Skills system.** Paseo provides orchestration skills injected into agent conversations: `/paseo-handoff` to pass work between agents with full context, `/paseo-loop` for Ralph-loop style retry-until-done patterns, `/paseo-advisor` for second opinions without delegating work, and `/paseo-committee` for multi-agent root cause analysis [@paseo-github].

**Privacy model.** No telemetry, no tracking, no forced logins. Code never leaves the user's machine — agents talk directly to their own model APIs. The relay is end-to-end encrypted. Voice processing is local-first.

## Relevant notes

- [Paseo: Cross-Device Coding Agent Orchestration — Executive Summary](paseo-cross-device-coding-agent-orchestration-executive-summary.md)
- [Paseo vs Alternative Free Open Source Agent Orchestrators](paseo-vs-alternative-free-open-source-agent-orchestrators.md)
- [The Agent Orchestration Landscape in 2026](the-agent-orchestration-landscape-in-2026.md)
- [State of the Art in Guardrail Design for LLM Orchestration in Software Engineering](state-of-the-art-in-guardrail-design-for-llm-orchestration-in-software-engineering.md)
- [Architectural Patterns for LLM Guardrail Systems in Software Engineering](architectural-patterns-for-llm-guardrail-systems-in-software-engineering.md)
- [Paseo Workflow: ADR-to-Spec-to-Plan Hierarchy](paseo-workflow-adr-to-spec-to-plan-hierarchy.md)
- [Paseo Workflow: Pre-commit and Pre-push Hooks with Agents](paseo-workflow-pre-commit-and-pre-push-hooks-with-agents.md)
- [Paseo Workflow: TDD Iteration Loop with Agents](paseo-workflow-tdd-iteration-loop-with-agents.md)
- [Paseo Workflow: PR Revision Cycle with Agents](paseo-workflow-pr-revision-cycle-with-agents.md)
- [Paseo Workflow Fit: ADR-Driven TDD Pipeline with Quality Gates — Executive Summary](paseo-workflow-fit-adr-driven-tdd-pipeline-with-quality-gates-executive-summary.md)