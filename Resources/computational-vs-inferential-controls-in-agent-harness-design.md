---
title: Computational vs Inferential Controls in Agent Harness Design
description: Classifying harness controls by compute cost guides design decisions for pi agent efficiency
author: pi
editor: lam
date: 2026-07-20T23:47:24.346Z
tags:
  - agent
  - architecture
  - optimization
  - efficiency
  - reference
---
## Summary

Agent harness controls can be classified as computational (deterministic, fast, CPU-bound) or inferential (semantic, slower, GPU-bound). This classification guides which controls run on every step and which are reserved for deeper checks. Computational controls cost near-zero per invocation. Inferential controls consume at least one LLM call and should be minimized [@bockeler2026].

In the pi ecosystem, the distinction maps to: computational controls include `validate_frontmatter` (YAML parsing), pre-commit hooks (tsc --noEmit, ESLint), tool schema validation (TypeBox), and tag matching (exact string comparison). Inferential controls include `auto-link` semantic matching, `expand_bullet_points` research, and LLM-as-judge quality reviews [Executive Summary: Harness Engineering for pi Agent Coding](Resources/executive-summary-harness-engineering-for-pi-agent-coding.md).

## Key Points

- **Shift left to computational**: Whenever possible, replace inferential controls with computational alternatives. A regex-based frontmatter check costs near-zero; an LLM-based quality review costs tokens.
- **Guard insertion point matters**: Computational controls should gate entry into inferential ones. For example, validate YAML syntax (computational) before running semantic analysis (inferential) on the content.
- **Pi's existing architecture** already applies this: `validate_frontmatter` runs computationally, while `auto-link` runs inferentially only after document creation. The pre-commit hooks are entirely computational.
- **The No Free Lunch tradeoff** applies: computational controls are fast but can miss semantic issues; inferential controls catch deeper problems but cost more. The optimal design uses computational for high-frequency guards and inferential for verification of critical outputs [The No Free Lunch Tradeoff in Guardrail Design](Resources/the-no-free-lunch-tradeoff-in-guardrail-design.md).
- **Pareto principle**: 80% of quality issues can be caught by 20% of controls if the right computational checks are chosen first (schema validation, lint errors, boundary violations).

## Sources

[@bockeler2026] -- Birgitta Bockeler, "Harness Engineering for Coding Agent Users", martinfowler.com, 2026
[Executive Summary: Harness Engineering for pi Agent Coding](Resources/executive-summary-harness-engineering-for-pi-agent-coding.md)
[The No Free Lunch Tradeoff in Guardrail Design](Resources/the-no-free-lunch-tradeoff-in-guardrail-design.md)

## Relevant notes

- [Pi Agent Efficiency: Practical Optimization Techniques](Resources/pi-agent-efficiency-practical-optimization-techniques.md)
- [Executive Summary: Harness Engineering for pi Agent Coding](Resources/executive-summary-harness-engineering-for-pi-agent-coding.md)
- [Local vs Global Correctness in AI-Generated Code](Resources/local-vs-global-correctness-in-ai-generated-code.md)
- [Formal Models as Compilable Architectural Contracts](Resources/formal-models-as-compilable-architectural-contracts.md)
- [Spec-Driven Agentic Development with Formal Verification](Resources/spec-driven-agentic-development-with-formal-verification.md)