---
title: Intent Formalization for Bridging the Local-Global Correctness Gap
description: How intent formalization — translating informal user intent into checkable formal specifications — resolves the local-global correctness gap
author: pi
editor: lam
date: 2026-06-20T09:54:50.720Z
tags:
  - agent
  - architecture
  - software-engineering
  - formal-methods
  - methodology
  - reference
---
## Summary

Intent formalization is the translation of informal user intent into a set of checkable formal specifications. It addresses the root cause of the local-global gap: agents cannot preserve what they cannot check. By providing explicit, machine-verifiable contracts, formalization constrains agents before they act (feedforward control) and catches violations after they act (feedback control) [@lahiri2026].

**The intent formalization spectrum** ranges from lightweight tests (disambiguating likely misinterpretations) through full functional specifications (formal verification) to domain-specific languages (synthesizing correct code automatically). The central bottleneck is validating specifications — since there is no oracle for specification correctness other than the user, semi-automated metrics are needed to assess specification quality through lightweight user interaction and proxy artifacts like tests [@lahiri2026].

**Practical integration with AI agents** is now achievable through agent skills that expose formal-methods tools. The FM-Tools Catalog and FM-Weck infrastructure provides AI agents with access to over 60 verifiers and 20 test generators, containerized for isolated execution. Agent skills enable data-driven tool selection based on SV-COMP and Test-Comp competition results, without manual setup or formal-methods expertise [@beyer2026].

**Formal models as compilable architectural contracts** extend this approach. Architectural invariants — such as type distinctions, boundary ownership, and dependency constraints — can be encoded as Lean 4 types and propositions. Integration into CI pipelines makes violations compile errors, forcing both agents and developers to align implementation with the formal specification [Formal Models as Compilable Architectural Contracts](Resources/formal-models-as-compilable-architectural-contracts.md).

## Key Points

- Intent formalization resolves the gap by making architectural intent checkable, not just describable
- The spectrum of formalization allows matching rigor to reliability needs: lightweight tests for most code, full formal verification for safety-critical paths
- Agent skills for FM-Tools and theorem provers (Lean 4) make formal methods practically accessible to AI coding agents
- The central research challenge remains specification validation: ensuring the formalized intent matches actual user intent

## Sources

[@lahiri2026] — Shuvendu K. Lahiri, "Intent Formalization: A Grand Challenge for Reliable Coding in the Age of AI Agents", arXiv:2603.17150, 2026

[@beyer2026] — Dirk Beyer et al., "FM Meets AI: Equipping AI Agents with Formal-Methods Tools", ISoLA 2026

[Formal Models as Compilable Architectural Contracts](Resources/formal-models-as-compilable-architectural-contracts.md) — existing atomic note on Lean 4 architectural contracts

## Relevant notes

- [Autonomy-Coordination Balance for Resolving Local-Global Correctness](Resources/autonomy-coordination-balance-for-resolving-local-global-correctness.md)
- [Research Synthesis: Best Practice to Resolve Local vs Global Correctness in Agentic Software Engineering](Resources/research-synthesis-best-practice-to-resolve-local-vs-global-correctness-in-agentic-software-engineering.md)
- [Local vs Global Correctness in AI-Generated Code](Resources/local-vs-global-correctness-in-ai-generated-code.md)
- [Spec-Driven Agentic Development with Formal Verification](Resources/spec-driven-agentic-development-with-formal-verification.md)
- [Executive Summary: Architectural Integrity in Agent-Driven Coding](Resources/executive-summary-architectural-integrity-in-agent-driven-coding.md)