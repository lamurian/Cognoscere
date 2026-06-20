---
title: 'Research Synthesis: Best Practice to Resolve Local vs Global Correctness in Agentic Software Engineering'
description: Executive synthesis of all research findings on the local-global correctness discrepancy, its mechanisms, measurement, and resolution strategies
author: pi
editor: lam
date: 2026-06-20T09:54:50.722Z
tags:
  - agent
  - architecture
  - software-engineering
  - executive-summary
  - code-generation
  - formal-methods
  - research
---
## Summary

This research investigated the discrepancy between local correctness (each module passes its tests) and global architectural alignment (the entire system preserves intended semantics) in agentic software engineering. The investigation covered five WHY questions and three HOW questions.

## Findings

**WHY: Why the discrepancy matters (Confidence: HIGH).** Three independent empirical frameworks converge on the same conclusion: AI-generated code systematically trades architectural quality for local correctness. The NITR benchmark found 13.3% of edits pass tests but fail structural oracles [@zhu2026]. The AIRA replication found 1.80x more high-severity structural findings in AI vs human code [@parris2026]. The AI-Generated Smells audit establishes a Volume-Quality Inverse Law where code volume predicts structural degradation [@zhu2026a]. These findings are supported by 2-3 peer-reviewed sources each.

**HOW: How to resolve the gap (Confidence: MODERATE-HIGH).** The most promising resolution combines intent formalization with practical agent-accessible verification. Intent formalization translates informal user intent into checkable specifications across a spectrum of rigor [@lahiri2026]. The FM-Tools infrastructure makes over 60 verifiers accessible to AI agents through skills, enabling autonomous data-driven tool selection [@beyer2026]. The three-tier spec-driven workflow (prose specs, formal models, constrained agents) provides an architectural pattern for deployment. However, the central challenge of specification validation remains open: there is no automated oracle for whether a spec matches user intent.

**Mechanisms (Confidence: MODERATE).** The Reward-Shaped Failure Hypothesis explains why RLHF-trained models produce fail-soft code. The Volume-Quality Inverse Law shows architectural decay scales with agent capability. Architectural debt amplification (code debt, process debt, architectural debt) causes compounding degradation [@ahmad2025].

**Autonomy-Coordination Balance (Confidence: MODERATE).** The intent formalization spectrum enables graduated constraint matching risk to rigor. Agent skills for FM-Tools preserve autonomy while adding verification capability. However, no open-source orchestration tool provides spec-driven pre-merge verification, representing a gap.

## Research Roadmap

- **Tool gap:** Build open-source spec-driven verifier pattern for pre-merge compliance checking
- **Validation gap:** Develop semi-automated metrics for specification quality assessment
- **Scale gap:** Extend verification approaches from single-file benchmarks to repository-scale
- **Compositionality gap:** Verify that verified components compose correctly without re-verifying everything

## Sources

[@zhu2026] — Haichao Zhu et al., "Needle in the Repo", arXiv:2603.27745, 2026

[@zhu2026a] — Yuecai Zhu et al., "AI-Generated Smells", arXiv:2605.02741, 2026

[@parris2026] — William M. Parris, "AIRA", arXiv:2604.17587, 2026

[@lahiri2026] — Shuvendu K. Lahiri, "Intent Formalization", arXiv:2603.17150, 2026

[@beyer2026] — Dirk Beyer et al., "FM Meets AI", ISoLA 2026

[@ahmad2025] — Noman Ahmad et al., "Architectural Degradation", arXiv:2507.14547, 2025

## Relevant notes

- [Intent Formalization for Bridging the Local-Global Correctness Gap](Resources/intent-formalization-for-bridging-the-local-global-correctness-gap.md)
- [Executive Summary: Architectural Integrity in Agent-Driven Coding](Resources/executive-summary-architectural-integrity-in-agent-driven-coding.md)
- [Autonomy-Coordination Balance for Resolving Local-Global Correctness](Resources/autonomy-coordination-balance-for-resolving-local-global-correctness.md)
- [Local vs Global Correctness in AI-Generated Code](Resources/local-vs-global-correctness-in-ai-generated-code.md)
- [Issues, Opportunities, and Best Practices for LLMs in Healthcare and Medical Informatics](Resources/issues-opportunities-and-best-practices-for-llms-in-healthcare-and-medical-informatics.md)