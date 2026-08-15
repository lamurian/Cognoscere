---
title: Removal of paseo-loop and paseo-orchestrator Skills
description: paseo-orchestrator and paseo-loop were removed from Paseo's shipped skills in 2026; heartbeats and natural-language orchestration replaced them.
author: pi
editor: lam
date: 2026-08-15T10:08:28.008Z
tags:
  - paseo
  - orchestration
  - skills
  - workflow
  - reference
---
## Summary

Two of the five commands in common Paseo documentation lists no longer exist. `/paseo-orchestrator` was renamed `/paseo-orchestrate` on April 12, 2026, then removed entirely on June 5, 2026 (commit 59b32ab3, "Remove epic orchestration skills"). `/paseo-loop` was removed on August 10, 2026 (commit 94bda1f9, PR #3053, "Remove chat rooms and agent loops before storage migration") [@mo2026a]. This is why typing them produces no autocomplete: the skills are gone from the shipped set.

The replacement for both is natural-language orchestration built on the base `/paseo` skill and the heartbeat system, rather than packaged slash-command workflows [@mo2026g].

## Key Points

- Loop replacement — heartbeats: the agent creates a cron-cadence prompt back into the same conversation. "Use Paseo to create a heartbeat every 10 minutes. Keep checking this PR, fix any new CI failures, and stop when all checks pass or after two hours." Bounded loops are expressed as plain instructions ("repeat until X, max N iterations") [@mo2026g].
- Orchestrator replacement — plain prompts in the main chat: the docs' common-workflows page gives copyable prompts for fan-out research subagents, splitting issues into worktree-isolated workspaces, implement-then-review with different models, and check/redirect/continue of subagents [@mo2026i].
- The current skills docs page lists only `/paseo`, `/paseo-handoff`, `/paseo-committee`, and `/paseo-advisor`. "Bounded loops" are referenced as a workflow pattern in the common-workflows page, but no loop skill ships [@mo2026h] [@mo2026i].
- Existing knowledge-base notes from June 2026 that describe `/paseo-loop` and `/paseo-orchestrator` as current are stale; read them with the removal dates in mind.

## Sources

- [@mo2026a] Paseo GitHub repository (git history)
- [@mo2026g] Orchestration — Paseo Docs
- [@mo2026h] Orchestration skills — Paseo Docs
- [@mo2026i] Common orchestration workflows — Paseo Docs

## Relevant notes

- [Paseo Orchestration Skills: Current Inventory and Usage](Resources/paseo-orchestration-skills-current-inventory-and-usage.md)
- [Paseo Workflow: TDD Iteration Loop with Agents](Resources/paseo-workflow-tdd-iteration-loop-with-agents.md)
- [Paseo.sh: Chat Room and Agentic Orchestration Platform](Resources/paseo-sh-chat-room-and-agentic-orchestration-platform.md)
- [Invoking Paseo Orchestration Skills in an Agent Session](Resources/invoking-paseo-orchestration-skills-in-an-agent-session.md)
- [Paseo Workflow Fit: ADR-Driven TDD Pipeline with Quality Gates — Executive Summary](Resources/paseo-workflow-fit-adr-driven-tdd-pipeline-with-quality-gates-executive-summary.md)