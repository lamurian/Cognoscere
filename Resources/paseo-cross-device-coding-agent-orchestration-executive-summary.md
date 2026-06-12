---
title: 'Paseo: Cross-Device Coding Agent Orchestration — Executive Summary'
description: Executive synthesis of Paseo.sh architecture, comparative analysis with free open-source alternatives, and position in the 2026 agent orchestration landscape
author: pi
editor: lam
date: 2026-06-12T18:12:36.763Z
tags:
  - research
  - paseo
  - executive-summary
  - orchestration
  - comparison
---
## Executive Summary

This research examines Paseo.sh, an open-source (AGPL-3.0) orchestration layer for AI coding agents, and compares it with alternative free open-source programs in the rapidly converging 2026 agent orchestration ecosystem.

**What Paseo is.** Paseo is a daemon-based platform that runs existing coding agent CLIs (Claude Code, Codex, OpenCode, Pi, and 30+ more via ACP) as subprocesses and provides a unified interface across desktop (macOS/Linux/Windows), mobile (iOS/Android), web, and CLI. Created by solo maintainer Mo, it has 8.4k GitHub stars and is licensed under AGPL-3.0.

**Architecture.** The Paseo daemon runs on any machine (laptop, VM, dev server, Docker). Clients connect over WebSocket. This decouples agent execution from the control surface — agents run with full dev environment access on the daemon host, while users monitor and interact from any device. The relay provides end-to-end encrypted remote access. Voice processing is entirely local.

**Comparative position.** No single open-source orchestrator dominates all dimensions. Paseo leads in cross-device access (native iOS/Android apps), provider breadth (30+ vs 2-5 for most alternatives), and UI polish (split panes, per-worktree URLs, in-app browser). Claude Squad leads in minimalism (single Go binary, zero setup). Composio AO leads in autonomous CI recovery. Bernstein leads in deterministic scheduling with pre-merge verification. amux leads in unattended overnight operation with crash recovery. Kilo Code leads in IDE integration. Goose leads in general-purpose extensibility. The right choice depends on workflow modality (terminal vs IDE vs mobile), coordination depth needed (manual vs milestone gates vs spec-driven), and platform requirements (macOS-only vs cross-platform).

**Key differentiators.** Paseo's unique combination among open-source tools includes: (1) native mobile apps with full feature parity to desktop, (2) per-worktree dev server URL routing that solves port collisions, (3) on-device voice control, (4) orchestration skills injected into agent conversations (/paseo-handoff, /paseo-loop), (5) the broadest provider support through ACP catalog, and (6) a self-hosted daemon model that works in Docker, VMs, or homelab setups.

**Gaps and limitations.** Paseo lacks autonomous CI retry (Composio AO), deterministic scheduling (Bernstein), built-in pre-merge quality gates, and unattended crash recovery (amux). Its AGPL-3.0 license may be a constraint for commercial embedding. As a solo-maintainer project, maintenance velocity depends on one person.

## Key Findings

- **Paseo Architecture** — [[paseo-architecture-daemon-based-cross-device-agent-orchestration]]
- **Paseo vs Alternatives** — [[paseo-vs-alternative-free-open-source-agent-orchestrators]]
- **Orchestration Landscape 2026** — [[the-agent-orchestration-landscape-in-2026]]

## Confidence Assessment

| Question | Confidence | Rationale |
|---|---|---|
| Paseo's architecture and capabilities | High | Directly from the official website, GitHub README, docs, and hands-on comparisons. Architecture is well-documented with working examples. |
| Comparison with alternatives | High | Multiple independent comparison sources (Augment Code, amux, Paseo's own comparison page, awesome-agent-orchestrators list) converge on the same feature matrices. |
| Position in landscape | High | The three-tier framework (parallel runners → coordinated orchestrators → autonomous pipelines) is consistently described across all sources. |

## Known Gaps

- No head-to-head performance benchmarks exist (agent throughput, task completion rate, token efficiency)
- Paseo's user base scale and real-world reliability data are not publicly documented
- The AGPL-3.0 licensing implications for commercial use warrant legal review per specific use case
- No standardized taxonomy exists for classifying orchestrator tools — the three-tier model is emergent

## Relevant notes

- [[paseo-vs-alternative-free-open-source-agent-orchestrators]]
- [[paseo-architecture-daemon-based-cross-device-agent-orchestration]]
- [[the-agent-orchestration-landscape-in-2026]]
- [[state-of-the-art-in-guardrail-design-for-llm-orchestration-in-software-engineering]]
- [[architectural-patterns-for-llm-guardrail-systems-in-software-engineering]]