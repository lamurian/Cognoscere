---
title: 'Authoring Best Practices: Evaluation-Driven Workflow and Mechanism Selection'
description: 'The software-engineering view of authoring agent mechanisms: write behavioral evaluations first, iterate with two model instances, and pick skills vs hooks vs tools by who decides the run and what guarantee it provides — applied to Pi and Goose.'
author: pi
editor: lam
date: 2026-08-11T20:22:35.012Z
tags:
  - pi-agent
  - goose
  - extensions
  - hooks
  - best-practices
  - comparison
  - software-engineering
---
## Summary

Authoring guidance for agent capabilities converges on a software-engineering approach: a skill or hook is a software artefact with an interface (its description/config) and an implementation (body/script), subject to single responsibility, low coupling, and token economy. The strongest principle: when a requirement must hold every time, encode it as a hook (runtime-decided, deterministic, can block); when it depends on judgement, use a skill (model-decided, advisory). "A standing instruction in a skill body, however firmly worded, is something the model may read, defer, or skip" [@destefanis2026].

The recommended authoring process is evaluation-driven: write representative test tasks before the mechanism exists, measure the baseline without it, write the minimum instructions needed to pass, and iterate. Use two model instances — one to draft and refine, a fresh one with only the mechanism loaded to test whether it triggers and is followed. For code-like mechanisms (Pi extensions, Goose MCP servers), ordinary testing applies; for skills/hooks, use behavioural evaluation with pass rates and rubrics [@destefanis2026].

Applied to Pi: the evaluation-driven loop is largely built-in. The agent authors the extension, /reload makes it live, governance gates (line limits, tsc, pre-commit) provide computational validation, and the SDD phase tools give plan-first structure. Human review is diff-level policy review [@earendilworks2026; Pi Extension Authoring: Agent-Writes-Its-Own-Extensions as the Official Workflow](Resources/pi-extension-authoring-agent-writes-its-own-extensions-as-the-official-workflow.md).

Applied to Goose: hooks are the right mechanism whenever a guarantee matters (block a dangerous command, format after every edit) — deterministic and runtime-gated, matching the arXiv rule exactly. Recipes and skills are the advisory layer (model-decided), and MCP servers are the tool surface. The manual authoring tutorial already follows good practice: input validation (SSRF protection), error handling, and MCP Inspector testing before integration [@goosedocs2026f; @goosedocs2026c].

## Key Points

- Choose mechanisms by two questions: who decides it runs (runtime/user/model) and what guarantee it provides (advisory/blocking)
- Evaluation-driven authoring: write evals first, measure baseline, iterate with a fresh test instance
- Pi: agent-author loop with automated governance gates replaces manual review
- Goose: hooks for guarantees, recipes/skills for judgement, MCP servers as tool surface — manual authoring with Inspector testing
- Third-party skills/plugins are software dependencies: inspect before use

## Sources

[@destefanis2026] -- Authoring Agent Skills: A Software-Engineering Approach, arXiv:2607.25032, 2026
[@earendilworks2026] -- Extensions, pi coding agent documentation, 2026
[@goosedocs2026f] -- Building Custom Extensions, goose Documentation, 2026
[@goosedocs2026c] -- Hooks, goose Documentation, 2026

## Relevant notes

- [Pi vs Goose Deterministic Workflow Control](Resources/pi-vs-goose-deterministic-workflow-control.md)
- [Goose Hook and Plugin Authoring: Manual-First, Low-Barrier Design](Resources/goose-hook-and-plugin-authoring-manual-first-low-barrier-design.md)
- [Goose Open Plugins Hooks vs Pi Extension Hooks: Deterministic Event Scripting](Resources/goose-open-plugins-hooks-vs-pi-extension-hooks-deterministic-event-scripting.md)
- [Pi Extension Authoring: Agent-Writes-Its-Own-Extensions as the Official Workflow](Resources/pi-extension-authoring-agent-writes-its-own-extensions-as-the-official-workflow.md)
- [Pi vs Goose Extensibility: In-Process Hooks vs MCP Subprocesses](Resources/pi-vs-goose-extensibility-in-process-hooks-vs-mcp-subprocesses.md)