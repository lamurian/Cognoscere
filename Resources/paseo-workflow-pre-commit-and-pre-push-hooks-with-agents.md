---
title: 'Paseo Workflow: Pre-commit and Pre-push Hooks with Agents'
description: How paseo.sh agents interact with pre-commit and pre-push hooks. Git hooks block agent commits/pushes; agents must detect failures, fix, and retry.
author: pi
editor: lam
date: 2026-06-13T04:01:12.114Z
tags:
  - paseo
  - orchestration
  - workflow
  - quality
  - git
  - hooks
---

## Summary

The workflow requires pre-commit hooks (linter, static analysis) and pre-push hooks (automated tests) as quality gates. Paseo does not manage git hooks directly — hooks live in the repository's `.git/hooks/` or are managed by tools like `husky` or `pre-commit`. Agents interact with these hooks through normal git operations [@paseo-docs-cli].

## How It Works

When a Paseo agent runs `git commit` inside a worktree, the pre-commit hook executes. If it fails (lint error, formatting issue), git aborts the commit. The agent must:

1. Detect the failure (non-zero exit from the commit command)
2. Read the hook output to understand what failed
3. Fix the issues (auto-fix lint, reformat code, etc.)
4. Re-stage and retry the commit
5. Repeat until the pre-commit hook passes

Similarly, `git push` triggers pre-push hooks. If tests fail, the agent must fix and retry the push cycle.

## What Paseo Provides

- **Worktree setup scripts** (`paseo.json` with `worktree.setup`) can install hook infrastructure: `npm install husky`, `pre-commit install`, etc.
- **Agent visibility into failures** — agents see the stderr from failed git commands in their chat output
- **Loop pattern** — `/paseo-loop` can wrap the commit/push cycle with retry logic, though the agent must self-correct based on hook output
- **Terminal capture** — `capture_terminal` via MCP lets orchestrator agents inspect hook output from sub-agents

## Limitations

- No built-in retry-on-hook-failure mechanism in Paseo itself
- Agent must parse hook error output and self-correct, which depends on the LLM's reasoning ability
- Pre-push hooks that run long test suites can time out agent sessions if `--wait-timeout` isn't set appropriately
- Complex hook chains (linter → type checker → tests) may require multiple fix-retry cycles

## Best Practices

- Set `paseo run --wait-timeout 30m` for pushes that run full test suites
- Include hook documentation in agent prompts so the agent knows what to expect
- Use `paseo.json` setup to install hooks automatically in worktrees
- Consider a verifier agent (`/paseo-advisor`) to check code quality before the commit attempt

## Relevant Notes

- [Paseo Workflow: ADR-to-Spec-to-Plan Hierarchy](paseo-workflow-adr-to-spec-to-plan-hierarchy.md)
- [Paseo Workflow: TDD Iteration Loop with Agents](paseo-workflow-tdd-iteration-loop-with-agents.md)
- [Paseo Workflow: PR Revision Cycle with Agents](paseo-workflow-pr-revision-cycle-with-agents.md)
