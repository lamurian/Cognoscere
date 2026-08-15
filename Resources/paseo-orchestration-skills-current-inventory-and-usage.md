---
title: 'Paseo Orchestration Skills: Current Inventory and Usage'
description: 'The current Paseo skill set (August 2026): /paseo reference plus handoff, committee, advisor — what each does and example invocations.'
author: pi
editor: lam
date: 2026-08-15T10:08:28.002Z
tags:
  - paseo
  - orchestration
  - skills
  - multi-agent
  - reference
---
## Summary

Paseo ships orchestration skills that package common multi-agent workflows as slash commands for coding agents. The current release (main branch, August 2026) ships six skills in the repo's `skills/` directory: `/paseo` (foundational reference), `/paseo-help`, `/paseo-plugin`, `/paseo-handoff`, `/paseo-committee`, and `/paseo-advisor` [@mo2026h] [@mo2026a]. Only handoff, committee, and advisor are user-invocable workflow skills. `/paseo` is a reference skill that the others depend on and is not typically invoked directly by users.

These skills are agent skills, not Paseo app commands. They are injected into the coding agent's conversation (Claude Code, Codex, etc.) so the agent knows how to spawn, coordinate, and manage other agents through Paseo tools and the CLI [@mo2026h].

## Key Points

- `/paseo-handoff` (Task Handoff): hands the current task to another agent with full context. The receiving agent starts with zero context, so the handoff prompt is a self-contained briefing covering task, context, relevant files, current state, what was tried, decisions, acceptance criteria, and constraints. Provider comes from orchestration preferences (`~/.paseo/orchestration-preferences.json`) unless the user names one. Supports worktree-isolated workspaces [@mo2026h].
- `/paseo-committee` (Committee Planning): forms two high-reasoning agents to do root cause analysis and produce a plan. Use it when stuck, looping, tunnel-visioning, or facing a hard planning problem. Committee members are analysis-only — they do not edit, create, or delete files. The orchestrating agent synthesizes their plans, implements, then sends the diff back for review [@mo2026h].
- `/paseo-advisor` (Advisor): spins up a single agent as a second opinion on the current task. Use it when you say "advisor", "second opinion", "what does X think". The advisor prompt is analysis-only and ends with a no-edits instruction; the advisor gives a judgment, the user decides what to do [@mo2026h].
- `/paseo` (Paseo Reference): the foundational skill teaching agents to create agents, send prompts, and manage workspace isolation via Paseo tools and the CLI. Other skills depend on it [@mo2026h].
- Example invocations from the docs: `/paseo-handoff hand off the auth fix to codex in a worktree-isolated workspace`, `/paseo-committee why are the websocket connections dropping under load?`, `/paseo-advisor --provider claude/opus what is the UX risk in this flow?` [@mo2026h].

## Sources

- [@mo2026h] Orchestration skills — Paseo Docs
- [@mo2026a] Paseo GitHub repository

## Relevant notes

- [Removal of paseo-loop and paseo-orchestrator Skills](Resources/removal-of-paseo-loop-and-paseo-orchestrator-skills.md)
- [Paseo.sh: Chat Room and Agentic Orchestration Platform](Resources/paseo-sh-chat-room-and-agentic-orchestration-platform.md)
- [Paseo Subagent Management Architecture](Resources/paseo-subagent-management-architecture.md)
- [Invoking Paseo Orchestration Skills in an Agent Session](Resources/invoking-paseo-orchestration-skills-in-an-agent-session.md)
- [Paseo Architecture: Daemon-Based Cross-Device Agent Orchestration](Resources/paseo-architecture-daemon-based-cross-device-agent-orchestration.md)