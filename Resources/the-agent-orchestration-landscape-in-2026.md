---
title: The Agent Orchestration Landscape in 2026
description: 'The three-tier landscape of AI coding agent orchestration in 2026: parallel runners, coordinated orchestrators, autonomous pipelines — and where Paseo fits'
author: pi
editor: lam
date: 2026-06-13T04:03:03.185Z
tags:
  - research
  - paseo
  - landscape
  - orchestration
  - trends
---

## Summary

AI coding agent orchestration has become a recognized product category in 2026, driven by the convergence of multiple factors: Anthropic shipping Agent Teams, OpenAI launching Codex with parallel sandboxes, and the open-source community building dozens of worktree-based orchestrators. The ecosystem now spans three tiers.

**Tier 1: Parallel agent runners.** These tools launch multiple coding agents in isolated git worktrees. They solve the fundamental problem: single-agent tools assume one writer, one directory, one mental model — parallel agents clobber each other's files, fight over ports, and create irreconcilable diffs. Git worktrees became the consensus isolation primitive within about eighteen months [@augmentcode-2026]. Over 50 open-source projects now use this pattern.

**Tier 2: Orchestrators with coordination.** Beyond session management, tools like Bernstein (deterministic scheduling + Janitor verification), Composio AO (autonomous CI retry), and amux (self-healing watchdog + kanban board) add coordination layers. Microsoft Conductor (MIT, YAML workflows) and Agent Teams (Anthropic, built-in) represent the platform-vendor entry into this tier.

**Tier 3: Autonomous pipelines.** Devin (Cognition, proprietary) handles the full ticket-to-PR lifecycle autonomously with ~75% success rate. OpenAI Codex runs tasks in cloud sandboxes with enterprise infrastructure. These are the most capable but also the most expensive and lock you into specific providers.

**Paseo's position.** Paseo sits between Tier 1 and Tier 2. Its daemon model, cross-device access, and 30+ provider support make it one of the broadest Tier 1 runners. Its skills system (/paseo-handoff, /paseo-loop, /paseo-committee) provides Tier 2-style coordination patterns without deterministic scheduling. It lacks the autonomous PR handling of Composio AO or the pre-merge verification of Bernstein, but its cross-device UX and provider breadth are unmatched among open-source orchestrators.

**Key trend: convergence on worktrees.** Almost every orchestrator uses git worktrees for filesystem isolation. The differentiators are now: coordination depth (session manager vs task graph vs spec-driven), UI modality (TUI vs desktop vs web vs mobile), crash recovery (none vs watchdog vs cloud-managed), and provider support (single vs broad vs ACP).

**Unaddressed gap.** No open-source orchestrator provides spec-driven coordination — a shared living artifact that constrains what agents produce and a verifier that checks compliance before merge. Intent (closed source, macOS) addresses this with Coordinator/Implementor/Verifier agents against a living spec, but no open-source equivalent exists [@augmentcode-2026].

## Relevant notes

- [[paseo-cross-device-coding-agent-orchestration-executive-summary]]
- [[paseo-vs-alternative-free-open-source-agent-orchestrators]]
- [[paseo-architecture-daemon-based-cross-device-agent-orchestration]]
- [[evaluating-guardrail-effectiveness-benchmarks-and-metrics]]
- [[state-of-the-art-in-guardrail-design-for-llm-orchestration-in-software-engineering]]
- [[paseo-workflow-pr-revision-cycle-with-agents]]
- [[paseo-workflow-tdd-iteration-loop-with-agents]]