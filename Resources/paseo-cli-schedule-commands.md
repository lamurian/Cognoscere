---
title: Paseo CLI Schedule Commands
description: How to schedule recurring agent tasks using paseo schedule with cron and interval syntax.
author: pi
editor: lam
date: 2026-07-12T12:47:44.181Z
tags:
  - paseo
  - cli
  - orchestration
  - tools
  - reference
  - scheduling
---
Paseo supports recurring agent execution through its schedule system. `paseo schedule create --every 30m --cwd ~/dev/my-app "continue the refactor"` runs an agent on a 30-minute interval. The `--every` flag accepts duration strings like `30m`, `1h`, or `6h`. For more precise timing, cron expressions are supported. `paseo schedule ls` lists all active schedules. `paseo schedule pause <id>` pauses a schedule without removing it. Scheduled agents run in the specified working directory and maintain their own agent lifecycle -- each scheduled execution is a fresh agent session. This is useful for recurring maintenance tasks, status checks, or incremental work on long-running projects [@mo2026b].

## Relevant notes

- [Paseo.sh: Chat Room and Agentic Orchestration Platform](Resources/paseo-sh-chat-room-and-agentic-orchestration-platform.md)
- [Paseo CLI Agent Monitoring and Interaction](Resources/paseo-cli-agent-monitoring-and-interaction.md)
- [Paseo vs Alternative Free Open Source Agent Orchestrators](Resources/paseo-vs-alternative-free-open-source-agent-orchestrators.md)
- [Paseo CLI Run Command Flags](Resources/paseo-cli-run-command-flags.md)
- [Paseo CLI Remote Daemon Access](Resources/paseo-cli-remote-daemon-access.md)