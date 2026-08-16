---
title: 'jcode Plan/Execute with TDD: Native Todo Loop, No Plan Mode'
description: 'How jcode runs a plan/execute + TDD loop without a plan mode: todo tool with confidence ratings, hill-climbability scoring, auto-poke, background test tasks, and /test verification.'
author: pi
editor: lam
date: 2026-08-16T13:50:36.826Z
tags:
  - ai-agents
  - rust
  - tdd
  - testing
  - workflow
  - planning
---
## Summary

jcode has no dedicated plan mode or /plan command like Claude Code's Plan Mode. Instead, planning and execution are enforced by native harness mechanics. The plan surface is the todo tool: every task item carries a confidence rating assigned when the todo is created and updated when it is marked done, and /todos renders the list as a card in the chat [@huang2026d]. Goal quality is scored too: every agent goal gets a hill-climbability rating of 0-100 for how quantifiable and iterable its progress is, and a low score pushes the harness to reframe the goal into a verifiable objective with a harness that measures it [@huang2026]. For TDD, a failing test is the canonical hill-climbable objective — measurable, iterable, and verifiable.

Execution is the auto-poke loop. jcode checks the todo list at the end of every turn; incomplete todos trigger an automatic poke back to work instead of accepting an early victory, with transient errors retried and non-retryable errors stopping the loop. The same mechanism drives headless runs, so `jcode run` keeps iterating on a task across turns until the work is actually finished [@huang2026]. Test runs use the bash tool's background mode: `run_in_background` turns a suite into a tracked task the agent can list, tail, inspect, cancel, or wait on, and wait blocks until the task finishes or hits its next JCODE_PROGRESS checkpoint, so the agent wakes on events rather than polling. Progress renders as live cards showing counts like "6/10 tests" [@huang2026].

Verification is confidence stepping: when a confidence rating spikes sharply between assignment and completion, jcode forces the agent back to check its work instead of accepting the claim. Measured on Terminal-Bench 2.1, the extra checking pays — timed trials that finish in time pass more often (92% vs 88%) [@huang2026]. The /test slash command launches a one-shot session to "verify a claim with layered tests" and /review a one-shot review session; strict todo status validation (v0.75.2) keeps the state machine honest [@huang2026d]. This maps cleanly onto red-green-refactor: red is a failing test recorded as a todo with honest low confidence, green is implementation until the suite passes (each passing test steps confidence up), and refactor runs with the tests as safety net, optionally through a /review pass. This is a metric-driven rather than document-driven loop, in contrast to the spec-heavy SDD workflow [Spec-Driven Context-Driven TDD Workflow for AI Coding Agents](Resources/spec-driven-context-driven-tdd-workflow-for-ai-coding-agents.md) — and it scales horizontally, since each extra session costs only ~10 MB PSS, so one TDD loop per module in parallel is the natural jcode pattern [@huang2026a].

## Key Points

- No /plan mode: the todo tool (/todos) is the plan surface, with confidence ratings at assignment and completion
- Hill-climbability scoring (0-100 per goal) forces vague goals to be reframed as measurable objectives; a failing test is the natural metric
- Auto-poke: incomplete todos at turn end trigger automatic return to work; headless `jcode run` iterates until done
- Background tasks: run_in_background + wait on JCODE_PROGRESS checkpoints; live progress cards (e.g. 6/10 tests); timeout promotes to background instead of killing
- Confidence stepping: large assignment-to-completion spikes force re-check; 92% vs 88% pass rate on timed Terminal-Bench trials
- /test (verify a claim with layered tests) and /review one-shot sessions; strict todo status validation since v0.75.2
- TDD mapping: Red = failing-test todo, Green = suite passes and confidence steps, Refactor = tests as net plus /review
- Horizontal scaling: ~10 MB PSS per additional session enables a parallel TDD loop per module

## Sources

[@huang2026] -- jcode — open-source AI coding agent for the terminal, jcode.sh, 2026
[@huang2026a] -- Huang, Jeremy, jcode — The most RAM efficient harness, GitHub, 2026
[@huang2026d] -- Huang, Jeremy, jcode Docs: install, providers, configuration, keybindings, jcode.sh/docs, 2026

## Relevant notes

- [jcode vs pi: Efficiency and Philosophy](Resources/jcode-vs-pi-efficiency-and-philosophy.md)
- [Paseo Workflow: ADR-to-Spec-to-Plan Hierarchy](Resources/paseo-workflow-adr-to-spec-to-plan-hierarchy.md)
- [Paseo Workflow Fit: ADR-Driven TDD Pipeline with Quality Gates — Executive Summary](Resources/paseo-workflow-fit-adr-driven-tdd-pipeline-with-quality-gates-executive-summary.md)
- [Paseo Workflow: TDD Iteration Loop with Agents](Resources/paseo-workflow-tdd-iteration-loop-with-agents.md)
- [Paseo Architecture: Daemon-Based Cross-Device Agent Orchestration](Resources/paseo-architecture-daemon-based-cross-device-agent-orchestration.md)