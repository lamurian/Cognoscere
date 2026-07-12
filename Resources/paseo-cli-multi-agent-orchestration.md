---
title: Paseo CLI Multi-Agent Orchestration
description: How orchestrator agents use paseo CLI to spawn sub-agents, delegate tasks, and coordinate multi-agent workflows.
author: pi
editor: lam
date: 2026-07-12T12:47:50.455Z
tags:
  - paseo
  - cli
  - orchestration
  - tools
  - reference
  - workflow
  - llm-agents
---
Paseo's CLI is designed to be used by agents themselves, not just humans. An orchestrator agent can spawn sub-agents for parallel work and coordinate their results. The pattern uses `paseo run --detach --name <id>` to launch a sub-agent in the background, `paseo wait <id>` to block until it finishes, and `paseo logs <id> --tail 5` to inspect results. A simple implement-and-verify loop uses `paseo run --provider codex "make the tests pass"` for implementation followed by `paseo run --provider claude --output-schema schema.json "verify criteria"` for verification, with the output piped through `jq` to check boolean criteria [@mo2026b]. Combined with `/paseo-handoff` for task handoffs with full context and `/paseo-loop` for retry-until-done patterns, this enables hierarchical task decomposition where a lead agent breaks down work, delegates to specialists, and synthesizes results.

## Relevant notes

- [Paseo Architecture: Daemon-Based Cross-Device Agent Orchestration](Resources/paseo-architecture-daemon-based-cross-device-agent-orchestration.md)
- [Paseo.sh: Chat Room and Agentic Orchestration Platform](Resources/paseo-sh-chat-room-and-agentic-orchestration-platform.md)
- [Paseo CLI Run Command Flags](Resources/paseo-cli-run-command-flags.md)
- [Paseo vs Alternative Free Open Source Agent Orchestrators](Resources/paseo-vs-alternative-free-open-source-agent-orchestrators.md)
- [Paseo CLI Agent Monitoring and Interaction](Resources/paseo-cli-agent-monitoring-and-interaction.md)