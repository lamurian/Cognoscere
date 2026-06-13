---
title: 'Paseo Workflow: PR Revision Cycle with Agents'
description: 'How Paseo supports the PR revision cycle: open PR, CI/CD runs, gather comments and failed checks, orchestrate fixes, push until green, merge, and rebase.'
author: pi
editor: lam
date: 2026-06-13T04:01:39.054Z
tags:
  - paseo
  - orchestration
  - workflow
  - github
  - pr
  - cicd
---

## Summary

After TDD and quality gates pass, the agent opens a PR. CI/CD runs automated tests and review. The agent must gather all PR comments and failed checks, orchestrate revisions, push fixes, and repeat until all checks pass. Then it checks out master, pulls rebase, and creates a new branch for the next plan. Paseo's PR panel and skills support most of this cycle [@paseo-changelog].

## How It Maps to Paseo

**Phase 1: Open PR.** Paseo's git panel supports `Commit → Push → Open PR` directly from the workspace. Branch names are auto-generated from the agent's task description.

**Phase 2: CI/CD visibility.** Paseo surfaces GitHub PR check status in the sidebar and PR hover card. The agent can see which checks passed or failed. Paseo does not run CI itself — it delegates to the repository's GitHub Actions or other CI provider.

**Phase 3: Gather feedback.** v0.1.94 added: "Attach pull request comments, reviews, threads, and failed check logs to chat from the PR panel (#1400)". This is the key feature — an agent can directly ingest PR review comments and CI failure logs as chat context for revision.

**Phase 4: Orchestrate revision.** The agent receives PR feedback as context, plans fixes, and implements them in the worktree. It can use `/paseo-committee` for root cause analysis of complex failures, or `/paseo-advisor` for a second opinion on the review comments.

**Phase 5: Push and re-check.** After fixing, the agent commits (pre-commit gate), pushes (pre-push gate), and waits for CI to re-run. This repeats until all checks pass. The cycle can be wrapped in `/paseo-loop` with a verifier that checks PR status.

**Phase 6: Merge and cycle.** Once green, the agent merges the PR (supported from the checkout pane since v0.1.71). Then it checks out master, pulls rebase, and creates a new worktree for the next plan. Paseo supports auto-archive of worktrees after PR merge (v0.1.76).

## What Paseo Provides

- **PR panel** — View PR status, comments, failed checks inline
- **Attach feedback to chat** — PR comments, reviews, threads, and failed check logs attachable to agent chat (v0.1.94)
- **Git actions** — Commit, push, pull, rebase, branch switching from the workspace header
- **Merge from UI** — Merge PR directly from checkout pane (v0.1.71)
- **Auto-archive** — Worktrees auto-archive after PR merge (v0.1.76)
- **Worktree cycles** — `paseo run --worktree plan-N` creates a fresh worktree for the next plan
- **Loop pattern** — `/paseo-loop` can wrap the "check CI → fix → push → re-check" cycle

## The Revision Loop

```
/paseo-loop review the attached PR comments and failed CI logs,
fix all issues in the worktree, commit, push,
and wait for CI checks to pass or surface new failures.
Max 10 iterations.
```

## Limitations

- CI wait time is unpredictable — the loop must poll GitHub for status updates
- Complex PRs with many review comments may exceed agent context windows
- No built-in triage for distinguishing critical CI failures from flaky tests
- The "checkout master → pull rebase → new branch" transition is manual and not automated as a workflow step
- Merge conflicts during rebase require agent intervention and can break the cycle

## Relevant Notes

- [[paseo-workflow-adr-to-spec-to-plan-hierarchy]]
- [[paseo-workflow-pre-commit-and-pre-push-hooks-with-agents]]
- [[paseo-workflow-tdd-iteration-loop-with-paseo]]
- [[paseo-sh-chat-room-and-agentic-orchestration-platform]]
