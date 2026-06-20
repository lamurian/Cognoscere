---
title: 'Executive Summary: Architectural Integrity in Agent-Driven Coding'
description: Synthesis of local vs global correctness problem, semantic drift from agent-amplified technical debt, and formal models as enforceable architectural contracts
author: pi
editor: lam
date: 2026-06-20T09:45:05.213Z
tags:
  - executive-summary
  - agent
  - architecture
  - software-engineering
  - code-generation
  - fundamental
  - reference
---

## Summary

Agent-assisted coding enables rapid development by delegating code generation and fixes to AI agents. However, this creates a critical problem: gradual loss of understanding and misalignment with the system's intended architecture over time. Even when each incremental change is locally valid and passes tests, the overall system's global semantics and architectural invariants can erode unnoticed. Recent empirical research confirms that 13.3% of AI-generated repository edits pass all functional tests yet fail structural maintainability oracles, and the hardest pressures are architectural rather than local [@zhu2026].

The core tension is between local correctness (each module behaves correctly according to its immediate tests) and global architectural alignment (the entire system maintains consistent semantics and preserves intended design principles across boundaries). AI agents excel at maintaining local correctness but struggle to preserve global invariants. This results in subtle semantic drift, silently violated architectural invariants, and accumulating inconsistencies that degrade system integrity over time.

## The Proposed Solution

The most promising approach combines three elements. First, prose specifications for exploration and conceptual clarity. Second, formal models (e.g., using the Lean theorem prover) that encode key architectural invariants as compilable, enforceable contracts. Third, integration of formal model checks into CI pipelines, making architectural violations compile errors that agents and developers must fix before proceeding.

## Connected Atomic Notes

- [Local vs Global Correctness in AI-Generated Code](Resources/local-vs-global-correctness-in-ai-generated-code.md) — the core problem defined
- [Semantic Drift from Agent-Amplified Technical Debt](Resources/semantic-drift-from-agent-amplified-technical-debt.md) — how drift accumulates over time
- [Temporal Point-Interval Distinction as Architectural Invariant](Resources/temporal-point-interval-distinction-as-architectural-invariant.md) — a concrete illustrative example
- [Formal Models as Compilable Architectural Contracts](Resources/formal-models-as-compilable-architectural-contracts.md) — using theorem provers for enforcement
- [Spec-Driven Agentic Development with Formal Verification](Resources/spec-driven-agentic-development-with-formal-verification.md) — the evolved workflow

## Sources

[@zhu2026] — Haichao Zhu, Qian Zhang, Jiyuan Wang, Zhaorui Yang, Yuxin Qiu, "Needle in the Repo: A Benchmark for Maintainability in AI-Generated Repository Edits", arXiv:2603.27745, 2026