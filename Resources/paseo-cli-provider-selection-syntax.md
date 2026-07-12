---
title: Paseo CLI Provider Selection Syntax
description: How paseo run --provider syntax selects which agent provider and model to launch.
author: pi
editor: lam
date: 2026-07-12T12:46:34.001Z
tags:
  - paseo
  - cli
  - orchestration
  - tools
  - reference
---
## Summary

The `paseo run --provider` flag selects which coding agent provider to launch. It takes a provider ID optionally followed by `/model-id`. This is the primary mechanism for multi-provider orchestration from the terminal [@mo2026a; @mo2026b].

## Provider IDs and Model Selection

Built-in provider IDs are `claude`, `codex`, `copilot`, `opencode`, `pi`, and `omp` (Oh My Pi, disabled by default). Custom providers defined in `~/.paseo/config.json` use whatever ID you assign. The model suffix after `/` is optional -- `--provider claude/opus-4.6` pins Opus 4.6, while `--provider pi` uses pi's default model. When no `--provider` is given, Paseo uses the first available provider [@mo2026].

Paseo launches each provider's native CLI as a subprocess rather than shipping its own agent. It auto-discovers installed CLIs on startup. Custom ACP (Agent Client Protocol) agents are referenced by their config.json provider ID with `extends: "acp"` [@mo2026c]. The full list of 30+ supported agents is maintained at paseo.sh/agents [@mo2026d].

## Relevant notes

- [Paseo.sh: Chat Room and Agentic Orchestration Platform](Resources/paseo-sh-chat-room-and-agentic-orchestration-platform.md)
- [Paseo Architecture: Daemon-Based Cross-Device Agent Orchestration](Resources/paseo-architecture-daemon-based-cross-device-agent-orchestration.md)
- [Paseo Workflow Fit: ADR-Driven TDD Pipeline with Quality Gates — Executive Summary](Resources/paseo-workflow-fit-adr-driven-tdd-pipeline-with-quality-gates-executive-summary.md)
- [Paseo vs Alternative Free Open Source Agent Orchestrators](Resources/paseo-vs-alternative-free-open-source-agent-orchestrators.md)
- [Paseo: Cross-Device Coding Agent Orchestration — Executive Summary](Resources/paseo-cross-device-coding-agent-orchestration-executive-summary.md)