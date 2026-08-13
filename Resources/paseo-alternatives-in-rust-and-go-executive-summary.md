---
title: Paseo Alternatives in Rust and Go — Executive Summary
description: 'Comparative analysis of Rust/Go-built ADE servers vs Paseo: Kandev and Composio AO (Go) lead; Rust has no mature cross-device server yet'
author: pi
editor: lam
date: 2026-08-12T23:16:52.877Z
tags:
  - comparison
  - executive-summary
  - orchestration
  - paseo
  - golang
  - rust
  - open-source
  - research
  - ai-agents
  - self-hosting
  - tools
---
## Summary

Paseo is a Node/TypeScript daemon-based orchestrator for coding agents. A language-filtered screening of 40+ repositories shows the Rust-or-Go alternative niche splits sharply: Go has mature server-shaped ADEs, while Rust has polished agent harnesses and terminal ADEs but no mature self-hosted cross-device server yet.

**Go — the practical choice.** Kandev [@kdlbs2026] is the closest match to Paseo's model: a Go backend with a server-first web UI reachable from any device including your phone, self-hosted over Tailscale or any VPN, git-worktree isolation, 19+ agents via ACP, remote runtimes (local, Docker, SSH, cloud), and no telemetry. Composio AO [@untrivialai2026] (Go backend, Apache-2.0, 9.5k stars) is the most mature option: a desktop app plus local daemon that runs 26 agents in parallel worktrees and autonomously handles CI failures, merge conflicts, and review comments — but it is desktop-centric rather than phone/browser-first. Claude Squad (Go, single binary, terminal-only) remains the minimal option, already compared in [Paseo vs Alternative Free Open Source Agent Orchestrators](paseo-vs-alternative-free-open-source-agent-orchestrators.md). Steve Yegge's VC [@yegge2026] (Go, MIT) is an AI-supervised issue-workflow colony with a REPL and SQLite tracker, oriented to single machines. myclaude [@stellarlinkco2026] (AGPL-3.0) is Go tooling wrapped around Claude Code skills — a workflow layer, not a server.

**Rust — harnesses and terminals, not servers yet.** Warp [@warpdotdev2025] is the biggest Rust ADE (64k stars, AGPL-3.0 with MIT UI framework) but it is a desktop terminal client, not a self-hostable daemon. Grok Build [@xaiorg2026] (Rust, Apache-2.0, 24.8k stars) is a first-class agent harness with headless CI mode and ACP — it is the agent, not the ADE. golutra [@golutra2026] (Rust via Tauri, BSL 1.1) is a desktop multi-agent workspace whose mobile remote control and cross-device migration remain on the roadmap. animus-cli [@launchappdev2026] (100% Rust, ELv2) is a daemon-based orchestrator with YAML workflows, MCP integration, and web UI/GraphQL transport plugins, but it is early-stage (38 stars) and ELv2 prohibits providing it as a hosted service.

**Verdict.** For a Go server that mirrors Paseo's cross-device model today, Kandev is the top pick; Composio AO adds autonomous pipeline depth if desktop control is acceptable. For Rust, no equivalent exists yet — the realistic paths are early-stage software (animus), a desktop client (Warp, golutra), or a mixed-language stack: a Go orchestrator (Kandev) running a Rust agent (Grok Build). ADEs are provider-agnostic, so language mixing is seamless.

## Key Points

- Kandev (Go, AGPL-3.0): server-first web UI, phone access, self-hosted, remote runtimes, 19+ ACP agents — closest Paseo equivalent
- Composio AO (Go, Apache-2.0, 9.5k stars): mature desktop + daemon, autonomous CI/PR handling, 26 agents
- Claude Squad (Go): single binary, terminal-only, minimal — see existing comparison note
- VC (Go, MIT): AI-supervised issue colony, REPL + SQLite tracker, single-machine oriented
- myclaude (Go tooling + Claude Code skills, AGPL-3.0): workflow layer, not a server
- Warp (Rust, 64k stars): terminal-born ADE, AGPL client, SaaS-backed, not self-hostable
- Grok Build (Rust, 24.8k stars): agent harness with headless CI and ACP — the agent, not the ADE
- golutra (Rust/Tauri, BSL 1.1): desktop workspace; mobile remote on roadmap
- animus-cli (Rust, ELv2): daemon + web UI plugins; early-stage, hosted-service restriction
- Mixed-language stack is viable: Go server (Kandev) + Rust agent (Grok Build)
- Go options ship as native binaries (brew, scoop, AppImage), removing Paseo's npm/Node dependency

## Sources

- [@kdlbs2026] Kandev GitHub repository
- [@untrivialai2026] Composio Agent Orchestrator GitHub repository
- [@warpdotdev2025] Warp GitHub repository
- [@xaiorg2026] Grok Build GitHub repository
- [@golutra2026] golutra GitHub repository
- [@launchappdev2026] Animus CLI GitHub repository
- [@yegge2026] VC GitHub repository
- [@stellarlinkco2026] MyClaude GitHub repository

## Relevant notes

- [Paseo: Cross-Device Coding Agent Orchestration — Executive Summary](Resources/paseo-cross-device-coding-agent-orchestration-executive-summary.md)
- [Paseo vs Alternative Free Open Source Agent Orchestrators](Resources/paseo-vs-alternative-free-open-source-agent-orchestrators.md)
- [Kandev: Go Server-First ADE with Phone Access](Resources/kandev-go-server-first-ade-with-phone-access.md)
- [The Agent Orchestration Landscape in 2026](Resources/the-agent-orchestration-landscape-in-2026.md)
- [Paseo Architecture: Daemon-Based Cross-Device Agent Orchestration](Resources/paseo-architecture-daemon-based-cross-device-agent-orchestration.md)