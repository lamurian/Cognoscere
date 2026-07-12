---
title: Paseo CLI Run Command Flags
description: The paseo run command syntax and its key flags for launching agents in worktrees, background, or for structured output.
author: pi
editor: lam
date: 2026-07-12T12:47:14.947Z
tags:
  - paseo
  - cli
  - orchestration
  - tools
  - reference
---
## Summary

The `paseo run` command is the primary entry point for launching coding agents. It supports flags for isolated worktrees, background execution, and structured output. By default it runs in the foreground and waits for completion [@mo2026b].

## Flags and Usage

`paseo run --worktree <name>` creates an isolated git worktree on its own branch, enabling parallel feature development without file conflicts. `paseo run --detach` starts the agent in the background and returns immediately, useful for long-running tasks or multi-agent workflows. `paseo run --output-schema <schema.json>` constrains the agent to return structured JSON matching the provided schema, useful for scripting and data extraction. All three flags can be combined with `--provider` to select a specific agent provider. Agent IDs are short hex strings that can be abbreviated as long as they remain unambiguous [@mo2026b].

## Relevant notes

- [Paseo CLI Provider Selection Syntax](Resources/paseo-cli-provider-selection-syntax.md)
- [Paseo Workflow Fit: ADR-Driven TDD Pipeline with Quality Gates — Executive Summary](Resources/paseo-workflow-fit-adr-driven-tdd-pipeline-with-quality-gates-executive-summary.md)
- [Paseo.sh: Chat Room and Agentic Orchestration Platform](Resources/paseo-sh-chat-room-and-agentic-orchestration-platform.md)
- [Paseo Architecture: Daemon-Based Cross-Device Agent Orchestration](Resources/paseo-architecture-daemon-based-cross-device-agent-orchestration.md)
- [Paseo vs Alternative Free Open Source Agent Orchestrators](Resources/paseo-vs-alternative-free-open-source-agent-orchestrators.md)