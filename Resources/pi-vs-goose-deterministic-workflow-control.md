---
title: Pi vs Goose Deterministic Workflow Control
description: Pi enforces determinism with executable code (SDD phase tools, runtime tool gating, computational guard hooks); Goose relies on declarative artifacts (YAML recipes, permission modes, scheduler) the LLM interprets at execution time.
author: pi
editor: lam
date: 2026-08-11T20:07:40.165Z
tags:
  - pi-agent
  - goose
  - workflow
  - automation
  - comparison
  - guardrails
  - software-engineering
---

## Summary

Deterministic workflow support is where Pi and Goose diverge most. Pi's mechanisms are executable: the SDD phase gate (`implement_plan` returns implementation instructions, `complete_implementation` closes the phase), `pi.setActiveTools()` restricts tool availability per phase, `tool_call` hooks act as computational guards (path checks, permission gates written in code, not prompts), and `ctx.waitForIdle()` / `ctx.compact()` give extensions session-level control. RPC mode (JSONL over stdio) lets external orchestrators like Paseo script pi deterministically [@earendilworks2026].

Goose splits determinism into two layers. Declarative: recipes are YAML files packaging extensions, prompts, parameters (typed, with defaults), and instructions into reusable workflows; a scheduler runs tasks on a cron-like cadence; permission modes (manual, smart, autonomous) and per-tool rules gate tool approval. Programmatic: Open Plugins hooks run shell scripts on lifecycle events (PreToolUse, PostToolUse, AfterFileEdit, UserPromptSubmit, SessionStart/End) with JSON payloads on stdin — deterministic, never LLM-interpreted, with blocking limited to PreToolUse and Stop and fail-open failure semantics [@goosedocs2026b; @goosedocs2026; @goosedocs2026a; @goosedocs2026c].

The core difference: Pi's determinism is code-enforced in-process with hard guarantees (block, modify, gate) and mutable access to the agent loop, holding regardless of model behavior. Goose's determinism is split: recipes and permission rules are structured context the model follows (not programs), while hooks are external programs that observe and can block at a few points but fail open. Both keep the LLM in the loop, but Pi's enforcement points are hooks and phase tools inside the runtime, Goose's are YAML templates plus out-of-process shell scripts [@earendilworks2026; @goosedocs2026b; @goosedocs2026c].

Practical consequence: plan-first, verify-then-commit discipline is native to Pi through the SDD phase tools, whereas Goose approximates phased workflows with natural-language prompts (research → build → verify) that the model interprets on the fly; Goose's deterministic layer is best used for observation, notification, formatting, and coarse blocking rather than phase enforcement [@gooseblog2026; @gooseblog2026a]. For teams that want hard workflow guarantees, Pi's in-process hooks and phase tools are the stronger mechanism; for teams that want portable workflow templates plus scriptable observation, Goose recipes plus hooks win.

## Key Points

- Pi: SDD phase tools, `setActiveTools` gating, computational `tool_call` hooks, RPC mode — enforcement is executable code in-process
- Goose: YAML recipes, permission modes, scheduler (declarative, LLM-interpreted) plus Open Plugins hooks (programmatic shell scripts, deterministic, fail-open)
- Goose hooks block only at PreToolUse and Stop; Pi can gate and mutate at many lifecycle points
- SDD phase gating is native to Pi; Goose approximates it with phased workflow prompts
- Related: [[goose-open-plugins-hooks-vs-pi-extension-hooks-deterministic-event-scripting]]

## Sources

[@earendilworks2026] -- Extensions, pi coding agent documentation, 2026
[@earendilworks2026a] -- Skills, pi coding agent documentation, 2026
[@goosedocs2026] -- Extensions, Goose documentation, 2026
[@goosedocs2026b] -- Recipes, Goose documentation, 2026
[@goosedocs2026c] -- Hooks, goose Documentation, 2026
[@gooseblog2026] -- Orchestrate Complex Workflows Across Multiple Agents with Goose, 2026
[@gooseblog2026a] -- Hooks: Run Your Own Scripts on Every Goose Event, 2026