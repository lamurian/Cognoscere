---
title: 'Paseo Workflow Fit: ADR-Driven TDD Pipeline with Quality Gates — Executive Summary'
description: Executive synthesis of how well paseo.sh supports a structured ADR → spec → plan workflow with pre-commit/pre-push hooks, TDD iteration, PR review cycles, and CI/CD.
author: pi
editor: lam
date: 2026-06-13T04:17:43.328Z
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

This research evaluates how well paseo.sh fits a structured multi-step workflow given that Pi agent handles the ADR/spec/plan hierarchy and pre-commit/pre-push hook retry. The question is: with those layers managed elsewhere, which parts of the pipeline can Paseo automate? The assessment draws on Paseo's official documentation, changelog, CLI reference, MCP tools, and orchestration skills as of June 2026 [@paseo-website] [@paseo-docs-skills] [@paseo-changelog].

## Assumed Division of Labor

| Layer | Handled By |
|---|---|
| ADR → spec → plan hierarchy (1:N:M) | Pi agent extension |
| Pre-commit hook retry (fix → re-commit) | Pi agent |
| Pre-push hook retry (fix → re-push) | Pi agent |

Everything else is in scope for Paseo automation.

## What Paseo Automates

**Step 1: Environment setup per worktree.** `paseo.json` with `worktree.setup` runs `npm ci` and installs hook infrastructure automatically when Paseo creates a worktree. The agent doesn't need to remember — it just happens.

**Step 2: TDD per plan.** Paseo creates an isolated git worktree for each plan (`paseo run --worktree plan-auth-flow "..."`). The agent writes tests and implements code. `/paseo-loop` wraps the test-fix-retry cycle with a verifier that checks `npm test` output. No other orchestrator gives you this isolated-per-plan execution model out of the box.

**Step 3: Commit and push.** Paseo's git panel handles `commit` and `push` as UI actions or CLI commands. The Pi agent handles retry if hooks fail. But Paseo provides the git operations and surfaces the hook failure output to the agent in chat.

**Step 4: Open PR.** Built into Paseo's git panel — `commit → push → open PR` is a single workflow. Branch names and PR titles are auto-generated from the agent's task description. No `gh` CLI wrangling needed.

**Step 5: CI/CD visibility.** Paseo surfaces GitHub PR check status in the sidebar and hover card. The agent can see pass/fail for every check without leaving the workspace.

**Step 6: Gather PR comments and failed checks.** This is Paseo's strongest differentiator. v0.1.94 added: "Attach pull request comments, reviews, threads, and failed check logs to chat from the PR panel" (#1400). One click feeds all PR feedback directly into the agent's context as chat messages. No manual copy-paste.

**Step 7: Orchestrate revision.** With feedback attached to chat, the agent revises the worktree code. `/paseo-committee` can do root cause analysis on complex failures. `/paseo-advisor` provides second opinions on review comments.

**Step 8: Push and iterate until green.** Wrap the revision cycle in `/paseo-loop` with `--sleep 10m` to poll CI status every 10 minutes. The loop checks GitHub check status, and if any check failed, it gathers the new failure logs (via the PR panel attachment feature), revises, pushes, and waits another 10 minutes. Stops when all checks pass.

**Step 9: Merge PR.** Paseo's checkout pane has a merge button (v0.1.71). After merge, auto-archive cleans up the worktree (v0.1.76).

**Step 10: Branch cycling (checkout master → pull rebase → new branch).** This can be automated — not as a single button, but through agent instructions using Paseo CLI and MCP tools:

```
# After PR merge and auto-archive:
git checkout main
git pull --rebase
paseo run --worktree plan-next "implement the next plan from spec-042"
```

An orchestrator agent can execute this sequence using Paseo's MCP tools (`list_worktrees`, `archive_worktree`, `create_worktree`, `send_agent_prompt`). The source checkout's git state is accessible because Paseo worktrees share the same underlying repository. This is not a built-in "cycle" command, but it's a straightforward script an agent can run.

## End-to-End Automated Pipeline

With Pi handling hierarchy + hook retry and Paseo handling everything else, the pipeline looks like this:

```
Pi: ADR → spec1, spec2, spec3
  Paseo: for each spec → for each plan →
    paseo.json setup (npm ci, hooks)         ← automated
    /paseo-loop TDD (test → code → pass)      ← automated
    git commit → pre-commit (Pi retry)        ← Paseo git + Pi retry
    git push → pre-push (Pi retry)            ← Paseo git + Pi retry
    open PR on GitHub                         ← automated
    CI runs (GitHub Actions)                  ← external
    /paseo-loop CI poll every 10m             ← automated
      attach PR comments + logs (v0.1.94)     ← automated
      /paseo-committee RCA                    ← automated
      revise worktree                         ← automated
      commit + push → hooks (Pi retry)        ← Paseo git + Pi retry
      wait 10m, re-check CI                   ← automated
    merge PR                                  ← automated
    auto-archive worktree                     ← automated
    branch cycle: main → rebase → new branch  ← agent-scripted
```

## Paseo's Unique Value Add

| Capability | What Paseo Provides | Alternative Without Paseo |
|---|---|---|
| Per-plan isolation | Git worktree per plan, no file conflicts | Manual git worktree or single directory |
| CI polling + retry | `/paseo-loop --sleep 10m` with verifier | Custom bash script polling `gh` |
| PR feedback ingestion | One-click attach comments + logs to chat (v0.1.94) | Manual copy-paste or `gh` API |
| Multi-provider routing | Claude for planning, Codex for coding, different agents per phase | Single provider only |
| Cross-device monitoring | Check pipeline from phone, merge from mobile | Must be at desk |
| Per-worktree dev URLs | Each plan gets unique `http://plan--project.localhost:6767` | Port conflicts |
| Unified workspace | Git, diff, terminal, PR, browser in one panel | Separate windows/tools |

## Confidence Assessment

| Question | Confidence | Rationale |
|---|---|---|
| Can Paseo automate TDD per plan via worktrees? | High | Core documented feature, `/paseo-loop` directly supports this |
| Can Paseo poll CI every 10 minutes and stop on green? | High | `/paseo-loop --sleep 10m` with `--max-iterations` — verifier checks GitHub status |
| Can Paseo attach PR comments + logs to agent chat? | High | v0.1.94 changelog explicitly documents this (#1400) |
| Can Paseo automate the branch cycling sequence? | Moderate | Possible via agent using CLI/MCP tools, but no single "cycle" command exists |
| Can Paseo replace Pi for hook retry or hierarchy? | N/A | Those are explicitly handled by Pi, not in scope |

## Relevant notes

- [Paseo Workflow: ADR-to-Spec-to-Plan Hierarchy](paseo-workflow-adr-to-spec-to-plan-hierarchy.md)
- [Paseo Workflow: Pre-commit and Pre-push Hooks with Agents](paseo-workflow-pre-commit-and-pre-push-hooks-with-agents.md)
- [Paseo Workflow: TDD Iteration Loop with Agents](paseo-workflow-tdd-iteration-loop-with-agents.md)
- [Paseo Workflow: PR Revision Cycle with Agents](paseo-workflow-pr-revision-cycle-with-agents.md)
- [Paseo.sh: Chat Room and Agentic Orchestration Platform](paseo-sh-chat-room-and-agentic-orchestration-platform.md)
- [The Agent Orchestration Landscape in 2026](the-agent-orchestration-landscape-in-2026.md)
