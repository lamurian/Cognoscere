---
title: Spec-Driven Agentic Development with Formal Verification
description: The evolved workflow combining prose specifications, formal models, and AI agents for architectural integrity at scale
author: pi
editor: lam
date: 2026-06-20T09:45:05.215Z
tags:
  - agent
  - architecture
  - software-engineering
  - code-generation
  - methodology
  - workflow
  - reference
---

## Summary

Spec-driven agentic development with formal verification is a three-tier workflow that addresses the architectural integrity problem while preserving agent productivity. It combines the strengths of prose specifications (exploration and clarity), formal models (compile-time enforcement), and AI agents (implementation speed). The formal model acts as the ultimate contract outside the agent, preserving truth beyond generated code.

## The Three Tiers

**Tier 1: Prose Specifications.** These define the "what" and "why" — user stories, acceptance criteria, API contracts, and data models. They are optimized for human review and agent consumption. Following the principles in [Spec Architecture for AI Coding Agents](Resources/spec-architecture-for-ai-coding-agents.md), they use the three-tier boundary system (Always do / Ask first / Never do) and cover six core areas: commands, testing, project structure, code style, git workflow, and boundaries.

**Tier 2: Formal Model of Architectural Invariants.** A compilable model (e.g., in Lean 4) encodes the system's key architectural invariants: type distinctions that must be preserved, relation semantics that must be respected, boundary ownership rules, and dependency constraints. This model is part of the codebase and the build pipeline. Any violation produces a compile error, catching architectural drift before it reaches production [Formal Models as Compilable Architectural Contracts](Resources/formal-models-as-compilable-architectural-contracts.md).

**Tier 3: AI Agents with Constrained Generation.** Agents generate implementation code within the constraints defined by Tiers 1 and 2. The formal model is the ultimate source of truth — the agent cannot override it. This prevents the failure mode documented in [Failure Modes in LLM-Driven Software Engineering](Resources/failure-modes-in-llm-driven-software-engineering.md) where agents "satisfy local tests while violating global system intent."

## Workflow Evolution

The key insight is that the formal model, not the agent, holds the contract of system behavior. This shifts the developer's role from reviewing implementation details to defining high-level contracts and architectural invariants. The agent handles implementation but must respect the formal constraints. The CI pipeline enforces this through automated model checks. This approach reduces cognitive load and prevents semantic decay while leveraging agents' productivity [Executive Summary: Harness Engineering for pi Agent Coding](Resources/executive-summary-harness-engineering-for-pi-agent-coding.md).

## Sources

[@zhu2026] — Haichao Zhu, Qian Zhang, Jiyuan Wang, Zhaorui Yang, Yuxin Qiu, "Needle in the Repo: A Benchmark for Maintainability in AI-Generated Repository Edits", arXiv:2603.27745, 2026