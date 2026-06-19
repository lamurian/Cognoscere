---
title: Spec-Driven Context-Driven TDD Workflow for AI Coding Agents
description: Overview of combining Spec-Driven Development, Context-Driven Development, and TDD into a unified workflow for pi coding agents
author: pi
editor: lam
date: 2026-06-07T18:18:52.669Z
tags:
  - agent
  - fundamental
  - reference
---

## Summary

Spec-Driven Development (SDD), Context-Driven Development (CDD), and Test-Driven Development (TDD) each address a distinct failure mode of AI-generated code. SDD constrains what the agent builds via structured specification files. CDD controls how the agent interprets the project through progressive context files (AGENTS.md, CLAUDE.md, per-directory rules). TDD verifies that what the agent built actually works through automated test assertions. Alone, each has a gap: SDD lacks runtime verification, TDD lacks a shared contract for multi-file generation, and CDD lacks enforceable acceptance criteria. Combined, they form a three-layer constraint system that replaces vibe coding with engineering discipline [@osmani2025; @shangqi2025].

## The Three-Layer Constraint System

**Layer 1: Context Engineering (CDD).** The agent's permanent context files define project conventions, architecture rules, coding style, and boundaries. Files like AGENTS.md and per-directory rules are the 'operating system' the agent runs on. They persist across sessions and prevent context collapse -- the problem where each new agent session starts from zero and produces code that follows the model's training defaults instead of the project's established patterns. Context engineering is distinct from prompt engineering: prompt engineering optimises human-LLM interaction, while context engineering optimises agent-LLM interaction by curating the large context windows agents need to complete tasks [@shangqi2025].

**Layer 2: Specification Architecture (SDD).** Spec files define the behavioural contract before any code is written. They cover the 'what' and 'why' -- user stories, acceptance criteria, API contracts, data models -- without dictating implementation details. Effective specs are structured documents covering six core areas: commands, testing, project structure, code style, git workflow, and boundaries. They use a three-tier boundary system: actions the agent should always do, actions requiring human approval, and hard stops [@osmani2025].

**Layer 3: Test-Driven Verification (TDD).** Tests act as executable specifications. Each test defines one unit of expected behaviour; the agent's job is to write the minimum code that makes it pass. This enforces Red-Green-Refactor at the prompt level: write the failing test first (Red), let the agent implement (Green), then refactor with the spec as safety net. The test suite becomes the automated verifier that catches drift, regression, and hallucination [@galstian2025; @tweag2025].

## How the Layers Interlock

SDD provides the contract, CDD provides the context, and TDD provides the verification. When an agent generates code: the spec constrains what to build, the context files constrain how to build it, and the tests verify it was built correctly. This prevents four failure modes: context collapse (CDD prevents), spec drift (TDD catches), architectural drift (CDD prevents), and test inversion where AI writes tautological tests that mirror implementation rather than requirements (TDD with human-written tests first prevents). The AI agent operates within these three constraints, not outside them.

## Relevant notes

- [Spec Architecture for AI Coding Agents](spec-architecture-for-ai-coding-agents.md)
- [Context Engineering for pi Agents](context-engineering-for-pi-agents.md)
- [TDD with AI Coding Agents](tdd-with-ai-coding-agents.md)
- [Least-Obstructive Workflow Principles](least-obstructive-workflow-principles.md)
- [Multi-Agent Orchestration Patterns](multi-agent-orchestration-patterns.md)
- [SDD Four-Phase Workflow for pi Agents](../Projects/sdd-four-phase-workflow-for-pi-agents.md)
- [Skills Architecture: Single-Responsibility Restructure](../Projects/skills-architecture-single-responsibility-restructure.md) -- concrete implementation of single-responsibility agent design in the pi ecosystem