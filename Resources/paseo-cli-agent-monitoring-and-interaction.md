---
title: Paseo CLI Agent Monitoring and Interaction
description: 'Commands for monitoring and interacting with running Paseo agents: ls, attach, send, logs, stop, wait.'
author: pi
editor: lam
date: 2026-07-12T12:47:24.004Z
tags:
  - paseo
  - cli
  - orchestration
  - tools
  - reference
  - workflow
---
## Summary

Paseo provides CLI commands to monitor and interact with running agents after launch. These include listing active agents, attaching to live output, sending follow-up tasks, viewing logs, waiting for completion, and stopping agents [@mo2026b].

## Monitoring Commands

`paseo ls` lists all running agents in the current directory. Use `-a` to include completed and stopped agents, `-g` to scan all directories, and `--json` for structured scripting output. `paseo attach <id>` streams an agent's live output in real-time; detach with Ctrl+C without stopping the agent. `paseo logs <id>` views the full agent timeline -- add `-f` for streaming follow mode, `--tail N` to limit entries, and `--filter tools` to show only tool calls. Agent IDs can be shortened as long as they remain unambiguous [@mo2026b].

## Interaction and Lifecycle

`paseo send <id> "message"` sends follow-up tasks to a running or idle agent. Supports `--image screenshot.png` to attach screenshots for visual context and `--no-wait` to queue the task without blocking. `paseo wait <id>` blocks the terminal until the agent finishes its current task, useful in scripts for sequential orchestration (with optional `--timeout`). `paseo stop <id>` terminates an agent. `paseo agent mode <id> plan` changes the agent's operational mode, which is provider-specific [@mo2026b].

## Relevant notes

- [Paseo Architecture: Daemon-Based Cross-Device Agent Orchestration](Resources/paseo-architecture-daemon-based-cross-device-agent-orchestration.md)
- [Paseo Workflow Fit: ADR-Driven TDD Pipeline with Quality Gates — Executive Summary](Resources/paseo-workflow-fit-adr-driven-tdd-pipeline-with-quality-gates-executive-summary.md)
- [Paseo CLI Run Command Flags](Resources/paseo-cli-run-command-flags.md)
- [Paseo: Cross-Device Coding Agent Orchestration — Executive Summary](Resources/paseo-cross-device-coding-agent-orchestration-executive-summary.md)
- [Paseo CLI Provider Selection Syntax](Resources/paseo-cli-provider-selection-syntax.md)