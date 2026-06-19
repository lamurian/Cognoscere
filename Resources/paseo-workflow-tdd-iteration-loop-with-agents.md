---
title: 'Paseo Workflow: TDD Iteration Loop with Agents'
description: 'How Paseo supports test-driven development iteration: agent writes failing test, implements code, loops until all tests pass, then commits through quality gates.'
author: pi
editor: lam
date: 2026-06-13T04:01:39.054Z
tags:
  - paseo
  - orchestration
  - workflow
  - tdd
  - testing
---

## Summary

The workflow requires agents to follow TDD for each plan: write a failing test, implement code, iterate until all tests pass, then commit. The commit must pass pre-commit hooks, and the push must pass pre-push hooks. Paseo's `/paseo-loop` skill is the primary mechanism for this pattern [@paseo-skills].

## How It Maps to Paseo

**Phase 1: TDD within a worktree.** Each plan runs in an isolated worktree. The agent writes a failing test, implements code, and runs tests. If tests fail, the agent fixes code and retries. This is a natural loop that agents handle well through standard tool use (write file → run test → read output → fix).

**Phase 2: Commit gate.** Once tests pass locally, the agent commits. The pre-commit hook runs linter and static checks. If those fail, the agent must fix and re-commit. This is a sub-loop within the TDD cycle.

**Phase 3: Push gate.** After a successful commit, the agent pushes. The pre-push hook runs the full test suite. If tests fail, the agent must fix, re-commit, and re-push.

## What Paseo Provides

- **`/paseo-loop`** — Runs an agent loop until an exit condition is met. Supports `--max-iterations`, `--max-time`, worker/verifier cycles, and shell-based verification. The verifier can check test results.
- **`paseo run --output-schema`** — Structured output lets an orchestrator agent parse verification results (e.g., JSON with `criteria_met: boolean`) to decide whether to continue looping.
- **`paseo wait`** — Block until an agent finishes its current task, enabling orchestrator-led sequential TDD loops.
- **`paseo send`** — Send follow-up prompts to an agent mid-session ("fix the failing test", "run lint again").
- **MCP tools** — `create_agent`, `wait_for_agent`, `send_agent_prompt`, `get_agent_activity` let orchestrator agents manage sub-agents through the full TDD cycle programmatically.

## Agent Loop Pattern

```
/paseo-loop write a failing test for the auth endpoint,
then implement the code until all tests pass.
Verify with: npm test
Max 5 iterations.
```

After tests pass, the agent commits. If pre-commit fails:
```
paseo send <agent-id> "fix the lint errors and re-commit"
```

## Limitations

- The agent must self-correct based on test output — loop success depends on LLM reasoning quality
- Long test suites may hit `--max-time` limits on the loop
- Pre-push hook failures restart the entire TDD cycle (fix → commit → push), which can be expensive
- No built-in test deduplication — the full suite runs each iteration
- Complex multi-file TDD (e.g., adding a route, a service, and a DB migration) may exceed context windows in long loops

## Relevant Notes

- [Paseo Workflow: ADR-to-Spec-to-Plan Hierarchy](paseo-workflow-adr-to-spec-to-plan-hierarchy.md)
- [Paseo Workflow: Pre-commit and Pre-push Hooks with Agents](paseo-workflow-pre-commit-and-pre-push-hooks-with-agents.md)
- [Paseo Workflow: PR Revision Cycle with Agents](paseo-workflow-pr-revision-cycle-with-agents.md)
