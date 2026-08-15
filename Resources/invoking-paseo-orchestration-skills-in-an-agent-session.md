---
title: Invoking Paseo Orchestration Skills in an Agent Session
description: 'Why /paseo-* slash commands show no autocomplete: they are agent skills, not app commands — install, enable Paseo tools, and type in the agent composer.'
author: pi
editor: lam
date: 2026-08-15T10:08:28.006Z
tags:
  - paseo
  - orchestration
  - skills
  - howto
  - troubleshooting
---
## Summary

The `/paseo-*` slash commands are agent skills, not Paseo app commands. They live in the coding agent's own chat: you type them into the composer where you talk to Claude Code, Codex, or another provider, and that agent's skill system resolves them. Typing them into Paseo's own UI (menus, search bars, command palette) does nothing — no such commands exist there. This is the most common reason "nothing pops up" [@mo2026h].

Two prerequisites gate the commands. The skills must be installed for the agent, and the agent must have Paseo tools enabled. Without either, the agent has no `/paseo-*` command to offer [@mo2026h] [@mo2026g].

## Key Points

- Installation: Desktop app Settings → Integrations → Install, or manual `npx skills add getpaseo/paseo`, which installs to `~/.agents/skills/` and sets up symlinks for each agent [@mo2026h].
- Enable Paseo tools: Settings → your host → Agents → toggle "Enable Paseo tools". Start a new agent, or reload an existing one, so it receives the tools [@mo2026g].
- Autocomplete depends on the agent provider's skill system. Claude Code and Codex show slash-command suggestions when the skill is installed and marked user-invocable (paseo-handoff's SKILL.md declares `user-invocable: true`). Providers without skill support will not suggest anything, and a fresh session may be required for skills to load.
- The desktop app keeps bundled skills up to date on startup. If auto-update fails, use Settings → Integrations → Update or re-run the manual install command [@mo2026h].
- Natural language works without naming any command: "Stay as the orchestrator. Use Paseo to find my available Codex models, then create a worktree-isolated workspace, then launch a GPT-5.6 subagent there. Ask it to implement the parser change and report back here." The agent uses the tools underneath [@mo2026g] [@mo2026i].

## Sources

- [@mo2026h] Orchestration skills — Paseo Docs
- [@mo2026g] Orchestration — Paseo Docs
- [@mo2026i] Common orchestration workflows — Paseo Docs

## Relevant notes

- [Paseo Orchestration Skills: Current Inventory and Usage](Resources/paseo-orchestration-skills-current-inventory-and-usage.md)
- [Paseo.sh: Chat Room and Agentic Orchestration Platform](Resources/paseo-sh-chat-room-and-agentic-orchestration-platform.md)
- [Removal of paseo-loop and paseo-orchestrator Skills](Resources/removal-of-paseo-loop-and-paseo-orchestrator-skills.md)
- [Paseo Subagent Management Architecture](Resources/paseo-subagent-management-architecture.md)
- [Paseo Pi Provider Failure Root Causes](Resources/paseo-pi-provider-failure-root-causes.md)