---
title: 'Research Synthesis: LLM Impact on Healthcare and Software Engineering'
description: Executive summary synthesising research on LLM impact at the intersection of healthcare, software engineering, and medical informatics.
author: pi
editor: lam
date: 2026-06-19T23:00:38.393Z
tags:
  - LLM
  - healthcare
  - software-engineering
  - medical-informatics
  - digital-health
  - research
  - executive-summary
  - AI
  - review
---

Executive summary of the systematic research on LLM impact at the intersection of healthcare and software engineering.

## Executive Summary

Large language models are reshaping both healthcare delivery and the software engineering practices used to build digital health systems. At their intersection in medical informatics and digital health, three themes emerge: (1) LLMs offer transformative potential for clinical workflow automation, knowledge democratisation, and accelerated health IT development; (2) deployment is constrained by serious risks including hallucination, bias, privacy vulnerabilities, and regulatory gaps that are amplified in high-stakes clinical contexts; (3) the most promising path forward combines RAG-based architectures with human-in-the-loop oversight, domain-specific fine-tuning, and proactive regulatory alignment.

The evidence base — drawn from over 1,600 papers reviewed in comprehensive surveys [@yu2024], clinical evaluation studies [@kung2023; @singhal2023], and software engineering vision papers [@terragni2025] — supports moderate confidence in the core claims while identifying significant gaps in real-world clinical validation.

## Key Findings

- **[LLM Clinical Capabilities]** — [[research-llm-clinical-capabilities]]
- **[Failure Modes and Risks]** — [[research-llm-healthcare-failure-modes]]
- **[Clinical Performance Evidence]** — [[research-llm-clinical-performance-evidence]]
- **[Architectural Patterns for Health Informatics]** — [[research-llm-architecture-rag-fine-tuning]]
- **[Regulatory Frameworks]** — [[research-llm-regulatory-frameworks]]
- **[Software Engineering for Digital Health]** — [[research-llm-se-digital-health]]
- **[Issues, Opportunities, Best Practices]** — [[research-llm-healthcare-issues-opportunities]]

## Confidence Assessment

| Question | Confidence | Rationale |
|---|---|---|
| Q1 (WHY): Why do LLMs present distinct opportunities and risks in healthcare? | Moderate | Multiple systematic reviews confirm opportunities and risks, but few large-scale clinical trials. Confidence is moderate because most evidence comes from benchmark evaluations rather than real clinical deployments. |
| Q2 (HOW): How can LLMs be integrated safely into digital health software? | Moderate | RAG and human-in-the-loop patterns have strong theoretical support and early positive results. However, best practices are still emergent and regulatory frameworks are immature. |

## Known Gaps

1. Scarcity of large-scale randomised controlled trials evaluating LLM-assisted clinical workflows vs. standard care
2. No comprehensive regulatory framework for generative AI as medical devices
3. Limited research on long-term effects of LLM use on clinical skill retention
4. Insufficient adversarial testing methodologies specific to medical LLMs
5. Lack of standardised benchmarks for clinical safety (as opposed to accuracy)
6. Under-explored intersection: how LLM-generated health IT code affects downstream clinical safety