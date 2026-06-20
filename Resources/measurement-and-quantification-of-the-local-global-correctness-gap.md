---
title: Measurement and Quantification of the Local-Global Correctness Gap
description: Empirical frameworks for measuring the gap between local behavioral correctness and global architectural integrity in AI-generated code
author: pi
editor: lam
date: 2026-06-20T09:54:50.711Z
tags:
  - agent
  - architecture
  - software-engineering
  - measurement
  - code-generation
  - metrics
---
## Summary

The local-global correctness gap is now empirically measurable through multiple independent frameworks. These measurement approaches provide the foundation for quantifying the problem and tracking resolution progress.

**The NITR benchmark** (Needle in the Repo) provides the most rigorous quantification to date. Across 23 coding configurations, only 36.2% of maintainability-preserving repository edits succeeded. The hardest dimensions were Dependency Control (4.3% pass rate), Responsibility Decomposition (15.2%), and Reuse and Repo Awareness (31.9%). Critically, 13.3% of outcomes passed all functional tests yet failed the structural maintainability oracle — they were behaviorally correct but structurally wrong [@zhu2026].

**The AI-Generated Smells audit** establishes a Volume-Quality Inverse Law: code volume is a near-perfect predictor of structural degradation in agent-generated code. The study identifies a Reasoning-Complexity Trade-Off where more capable models generate increasingly bloated and coupled code. Neither functional correctness nor detailed prompting mitigates this decay [@zhu2026a]. This reframes the problem from one of code generation to one of architectural complexity management.

**The AIRA framework** (AI-Induced Risk Audit) provides a deterministic 15-check inspection system. In a matched-control replication of 1,910 files, AI-attributed code showed 0.435 high-severity findings per file versus 0.242 in human controls — a 1.80x rate. The effect was consistent across JavaScript, Python, and TypeScript, with strongest concentration in exception-handling patterns. AIRA introduces the Reward-Shaped Failure Hypothesis: AI code preserves the appearance of functionality while degrading guarantees [@parris2026].

## Key Points

- Three independent frameworks (NITR, AI-Generated Smells, AIRA) converge on the same finding: AI code systematically trades architectural quality for local correctness
- The gap is measurable: 13.3% test-passing structural failures (NITR), 1.80x high-severity findings vs human code (AIRA), and Volume-Quality Inverse Law (AI-Generated Smells)
- These measurement frameworks now enable tracking resolution progress as countermeasures are applied

## Sources

[@zhu2026] — Haichao Zhu et al., "Needle in the Repo: A Benchmark for Maintainability in AI-Generated Repository Edits", arXiv:2603.27745, 2026

[@zhu2026a] — Yuecai Zhu et al., "AI-Generated Smells: An Analysis of Code and Architecture in LLM and Agent-Driven Development", arXiv:2605.02741, 2026

[@parris2026] — William M. Parris, "AIRA: AI-Induced Risk Audit: A Structured Inspection Framework for AI-Generated Code", arXiv:2604.17587, 2026

## Relevant notes

- [Research Synthesis: Best Practice to Resolve Local vs Global Correctness in Agentic Software Engineering](Resources/research-synthesis-best-practice-to-resolve-local-vs-global-correctness-in-agentic-software-engineering.md)
- [Mechanisms of Structural Degradation in Agent-Generated Code](Resources/mechanisms-of-structural-degradation-in-agent-generated-code.md)
- [Intent Formalization for Bridging the Local-Global Correctness Gap](Resources/intent-formalization-for-bridging-the-local-global-correctness-gap.md)
- [Autonomy-Coordination Balance for Resolving Local-Global Correctness](Resources/autonomy-coordination-balance-for-resolving-local-global-correctness.md)
- [Evaluating Guardrail Effectiveness: Benchmarks and Metrics](Resources/evaluating-guardrail-effectiveness-benchmarks-and-metrics.md)