---
title: 'Paseo Workflow: ADR-to-Spec-to-Plan Hierarchy'
description: How Paseo maps to the ADR → Specification → Plan (1:N:M) hierarchical workflow. No native hierarchy support; managed via external docs and worktree assignment.
author: pi
editor: lam
date: 2026-06-13T04:01:12.114Z
tags:
  - paseo
  - orchestration
  - architecture
  - workflow
  - adr
---

## Summary

The user workflow begins with an ADR (Architecture Decision Record) that generates multiple specifications, each of which generates multiple plans. Paseo provides no native hierarchy for this relationship — it has no concept of ADR, spec, or plan as first-class objects [@paseo-website].

## How It Maps

The hierarchy is managed through external tooling that Paseo agents interact with:

- **ADR** — A markdown document in the repository (e.g., `docs/adr/042-auth-strategy.md`). ADR skill files can generate these. Paseo agents can read and reference ADRs as context for downstream work.
- **Specification** — A more detailed document derived from the ADR. Multiple specs per ADR are stored as separate markdown files. Paseo agents consume specs via file context or chat attachments.
- **Plan** — Each plan maps to a Paseo worktree (`paseo run --worktree plan-auth-flow`). Multiple plans per spec means multiple parallel worktrees, each with its own agent running in an isolated branch.

## What Works Well

- Worktree isolation ensures each plan executes independently without file conflicts
- ADRs and specs can be attached as agent prompt context
- The worktree-per-plan mapping is natural and aligns with Paseo's branch-oriented design

## What Requires Custom Setup

- Enforcing the 1:N:M cardinality constraint requires external validation (e.g., a script or CI check)
- No built-in linking between ADR → spec → plan in Paseo's UI
- Traceability depends on naming conventions (e.g., worktree names referencing spec and ADR IDs)

## Relevant Notes

- [[paseo-sh-chat-room-and-agentic-orchestration-platform]]
- [[paseo-workflow-precommit-prepush-hooks-with-paseo-agents]]
- [[paseo-workflow-tdd-iteration-loop-with-paseo]]
- [[paseo-workflow-pr-revision-cycle-with-paseo]]
