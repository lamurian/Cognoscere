---
title: 'Paseo Workflow Fit: ADR-Driven TDD Pipeline with Quality Gates — Executive Summary'
description: Executive synthesis of how well paseo.sh supports a structured ADR → spec → plan workflow with pre-commit/pre-push hooks, TDD iteration, PR review cycles, and CI/CD.
author: pi
editor: lam
date: 2026-06-13T04:02:05.232Z
tags:
  - paseo
  - orchestration
  - executive-summary
  - workflow
  - tdd
  - github
  - cicd
  - adr
---

## Executive Summary

This research evaluates how well paseo.sh fits a structured multi-step workflow: ADR → specification → plan hierarchy, pre-commit and pre-push quality gates, test-driven development per plan, PR-based CI/CD with review cycles, and automated branch cycling. The assessment draws on Paseo's official documentation, changelog, CLI reference, MCP tools, and orchestration skills as of June 2026 [@paseo-website] [@paseo-docs-skills] [@paseo-changelog].

## Overall Fit: Strong with Custom Wiring

Paseo's worktree-per-agent model, git integration, and PR panel provide a strong foundation. No step in the workflow is impossible, but several steps require custom agent prompting or scripting rather than being built-in behaviors.

## Step-by-Step Assessment

| Workflow Step | Paseo Fit | Notes |
|---|---|---|
| ADR → Spec → Plan (1:N:M) | Partial | No native hierarchy. ADRs/specs are files; plans are worktrees. Cardinality and traceability are convention-based. |
| Pre-commit hooks (lint, static check) | Functional | Git hooks block commits naturally. Agent must detect failure, self-correct, retry. No built-in hook retry. |
| Pre-push hooks (tests) | Functional | Same as pre-commit. Long test suites need generous `--wait-timeout`. |
| TDD iteration per plan | Strong | `/paseo-loop` with worker/verifier maps directly. `--output-schema` enables structured verdicts. |
| Open PR per plan | Strong | Built-in git panel: commit → push → PR. Branch names auto-generated. |
| CI/CD visibility | Strong | PR check status in sidebar and hover card. Paseo delegates CI to GitHub Actions. |
| Gather PR comments + failed checks | Strong (v0.1.94+) | Attach PR comments, reviews, threads, and failed check logs to agent chat (#1400). |
| Orchestrate revision from feedback | Strong | Feedback attached as agent context. `/paseo-committee` for RCA. `/paseo-advisor` for second opinions. |
| Push → re-check → iterate | Functional | Wrap in `/paseo-loop` with CI status polling. CI wait time is unpredictable. |
| Merge → master → rebase → new branch | Partial | Merge and auto-archive supported. The "checkout master → pull rebase → new worktree" transition is manual. |

## Key Strengths

- **Worktree isolation** is the right primitive for per-plan execution — agents never clobber each other
- **PR panel with feedback attachment** (v0.1.94) directly addresses the gather-comments-and-revise cycle
- **`/paseo-loop` and MCP tools** enable the TDD and CI revision loops with structured verification
- **`paseo.json` setup scripts** can install hook infrastructure and dependencies in fresh worktrees
- **Multi-provider flexibility** lets you use different agents for different phases (Claude for planning, Codex for implementation)
- **Cross-device access** lets you monitor the pipeline from mobile while it runs autonomously

## Key Gaps

1. **No native hierarchy for ADR/spec/plan.** The 1:N:M relationship must be enforced through naming conventions or external scripts. No traceability links in Paseo's UI.
2. **No built-in retry for hook failures.** Pre-commit and pre-push failures depend on the agent's ability to self-correct from error output. This is LLM-dependent and not guaranteed.
3. **No CI polling primitive.** The PR revision loop relies on `/paseo-loop` polling GitHub status, which is inefficient for long CI runs.
4. **Manual branch cycling.** "Master → rebase → new branch" requires explicit agent instructions rather than being an automated workflow transition.
5. **Context window pressure.** Long revision cycles with many PR comments and CI logs may exceed agent context limits.

## Recommendations

- Use `paseo.json` setup scripts to install hooks and dependencies in worktrees automatically
- Structure ADR/spec/plan as markdown files with a consistent naming convention (e.g., `adr-042/`, `spec-042-auth/`, `plan-042-auth-flow/`)
- Set `--wait-timeout` generously on push operations that trigger test suites
- Use `/paseo-loop` for TDD and CI revision loops with `--max-iterations` to prevent infinite loops
- Consider an orchestrator agent that manages the workflow from ADR to merge, spawning sub-agents for each phase via MCP tools
- The v0.1.94 PR feedback attachment feature is critical — ensure agents are configured with "Inject Paseo tools" enabled

## Confidence Assessment

| Question | Confidence | Rationale |
|---|---|---|
| Does Paseo support worktree isolation per plan? | High | Core documented feature with CLI and MCP support |
| Does Paseo surface PR feedback to agents? | High | v0.1.94 changelog explicitly documents this |
| Can Paseo loop on CI status? | Moderate | Possible via `/paseo-loop` polling GitHub, but no native CI event system |
| Does Paseo manage ADR/spec/plan hierarchy? | Low | No evidence of hierarchy primitives in any documentation |

## Relevant Notes

- [[paseo-workflow-adr-to-spec-to-plan-hierarchy]]
- [[paseo-workflow-pre-commit-and-pre-push-hooks-with-agents]]
- [[paseo-workflow-tdd-iteration-loop-with-agents]]
- [[paseo-workflow-pr-revision-cycle-with-agents]]
- [[paseo-sh-chat-room-and-agentic-orchestration-platform]]
- [[the-agent-orchestration-landscape-in-2026]]
