---
title: Autonomy-Coordination Balance for Resolving Local-Global Correctness
description: How structured workflows and orchestration patterns balance local agent autonomy with global architectural coordination
author: pi
editor: lam
date: 2026-06-20T09:54:50.721Z
tags:
  - agent
  - architecture
  - software-engineering
  - orchestration
  - workflow
  - methodology
---
## Summary

Resolving the local-global gap requires a calibrated balance between agent autonomy (for productivity) and global coordination (for correctness). Three complementary patterns have emerged.

**Spec-driven three-tier architecture** provides the most complete resolution. Tier 1 (prose specifications) defines what and why. Tier 2 (formal model of architectural invariants) encodes enforceable contracts. Tier 3 (AI agents with constrained generation) implements within the constraints. The formal model, not the agent, holds the ultimate contract of system behavior [Spec-Driven Agentic Development with Formal Verification](Resources/spec-driven-agentic-development-with-formal-verification.md).

**Intent formalization spectrum** enables graduated autonomy. Lightweight tests provide minimal guardrails for low-risk code. Full functional specifications with formal verification constrain agents tightly for safety-critical paths. Domain-specific languages eliminate ambiguity entirely by synthesizing correct code from verified specs [@lahiri2026]. The key insight is matching constraint rigor to consequence severity.

**Agent skill-based tool integration** preserves autonomy while adding formal verification as an accessible capability. Rather than constraining the agent, skills like FM-Tools equip the agent with verification tools it can invoke autonomously. The agent selects and runs verifiers based on competition data, interprets results, and adjusts its output accordingly — without manual setup or formal-methods expertise [@beyer2026].

**The orchestration gap.** Current open-source orchestration tools lack spec-driven coordination — a shared living artifact that constrains what agents produce before generation, plus a verifier that checks compliance before merge. No open-source equivalent of Intent's Coordinator/Implementor/Verifier pattern exists [The Agent Orchestration Landscape in 2026](Resources/the-agent-orchestration-landscape-in-2026.md).

## Key Points

- The solution is not max autonomy or max constraint, but calibrated balance via the intent formalization spectrum
- Three patterns exist: spec-driven three-tier architecture (external constraint), intent formalization spectrum (graduated constraint), and agent skill-based FM tool access (self-directed verification)
- The orchestration community has a gap: no open-source spec-driven verifier pattern for pre-merge compliance checking

## Sources

[@lahiri2026] — Shuvendu K. Lahiri, "Intent Formalization: A Grand Challenge for Reliable Coding in the Age of AI Agents", arXiv:2603.17150, 2026

[@beyer2026] — Dirk Beyer et al., "FM Meets AI: Equipping AI Agents with Formal-Methods Tools", ISoLA 2026

[Spec-Driven Agentic Development with Formal Verification](Resources/spec-driven-agentic-development-with-formal-verification.md) — existing note on three-tier workflow

[The Agent Orchestration Landscape in 2026](Resources/the-agent-orchestration-landscape-in-2026.md) — existing note on orchestration gaps

## Relevant notes

- [Research Synthesis: Best Practice to Resolve Local vs Global Correctness in Agentic Software Engineering](Resources/research-synthesis-best-practice-to-resolve-local-vs-global-correctness-in-agentic-software-engineering.md)
- [Intent Formalization for Bridging the Local-Global Correctness Gap](Resources/intent-formalization-for-bridging-the-local-global-correctness-gap.md)
- [Executive Summary: Harness Engineering for pi Agent Coding](Resources/executive-summary-harness-engineering-for-pi-agent-coding.md)
- [Measurement and Quantification of the Local-Global Correctness Gap](Resources/measurement-and-quantification-of-the-local-global-correctness-gap.md)
- [Least-Obstructive Workflow Principles](Resources/least-obstructive-workflow-principles.md)