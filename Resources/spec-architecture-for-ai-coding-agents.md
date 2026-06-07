---
title: Spec Architecture for AI Coding Agents
description: How to structure specification files that pi coding agents consume effectively
author: pi
editor: lam
date: 2026-06-07T18:18:52.676Z
tags:
  - agent
  - architecture
  - reference
---

## Summary

A spec for an AI coding agent is a structured document that defines the behavioural contract of software before code is written. Unlike traditional PRDs or SRS documents, agent specs must be designed for dual consumption: human review (for validation) and agent parsing (for generation). The spec is not a one-time artifact -- it evolves with the project, serving as the persistent source of truth that anchors the agent across sessions and prevents drift [@osmani2025; @pockit2025].

## The Six Core Areas

Analysis of over 2,500 agent configuration files reveals six areas the most effective specs cover [@osmani2025]:

1. **Commands.** Executable commands with full flags: `npm test`, `npm run build`, `pnpm lint`. The agent references these constantly.
2. **Testing.** Framework, test file locations, coverage expectations, and how to run specific test subsets.
3. **Project structure.** Where source code, tests, and documentation live. Explicit directory mapping prevents the agent from creating files in wrong locations.
4. **Code style.** One real code snippet showing your style beats three paragraphs describing it. Include naming conventions, formatting rules, and examples of good output.
5. **Git workflow.** Branch naming, commit message format, PR requirements.
6. **Boundaries.** What the agent should never touch: secrets, vendor directories, production configs. The single most common helpful constraint is 'never commit secrets'.

## Three-Tier Boundary System

Rather than a flat list of rules, the most effective specs use a graduated constraint system [@osmani2025]:

- **Always do:** Actions the agent takes autonomously. 'Always run tests before commits.' 'Always follow naming conventions.'
- **Ask first:** Actions requiring human approval. 'Ask before modifying database schemas.' 'Ask before adding new dependencies.'
- **Never do:** Hard stops. 'Never commit secrets.' 'Never edit node_modules/.' 'Never remove a failing test without explicit approval.'

This tiered approach acknowledges that some actions are always safe, some need oversight, and some are categorically off-limits. It gives the agent clear decision criteria rather than a confusing list of negatives.

## Spec as Living Artifact

The spec is not written once and forgotten. It evolves through a four-phase cycle: specify (high-level description from human, agent generates detailed spec), plan (technical architecture and constraints), tasks (breakdown into reviewable chunks), and implement (one task at a time). After each implementation cycle, the spec should be updated to reflect what was actually built and any design decisions discovered during coding. This bidirectional flow keeps the spec accurate and prevents the divergence between documentation and code that plagues traditional waterfall approaches [@osmani2025; @pockit2025].

## Machine-Readable Contracts

While LLMs excel at natural language, structured inputs improve reasoning performance. Include OpenAPI schemas for API contracts, JSON Schema for data validation, and Gherkin scenarios for acceptance criteria. These machine-readable specs serve as executable contracts that can be validated in CI/CD pipelines, catching drift before it reaches production [@galstian2025; @shangqi2025].

## Relevant notes

- [[spec-driven-context-driven-tdd-workflow-overview]]
- [[context-engineering-for-pi-agents]]
- [[least-obstructive-workflow-principles]]
- [[sdd-four-phase-workflow-for-pi-agents]]