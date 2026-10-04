---
title: Incident-Data Robustness of the OWASP LLM Top 10
description: 'OWASP expert risk ranking vs 7,714-incident corpus: weak agreement (kappa ~0.20) but the expert ranking holds; the list is consensus, not frequency.'
author: pi
editor: lam
date: 2026-10-02T19:30:00.000Z
tags:
  - guardrails
  - security
  - threat-modeling
  - evaluation
  - benchmarks
---
## Summary

The OWASP Top 10 for LLM Applications ranks risks by community-expert judgment. Lambros and Wilson ask a narrower question: checked against real incidents, does that ranking hold? They assembled a corpus of 7,714 snapshotted and 6,639 labeled LLM-security incidents from CVE, GHSA, OSV, and AIAAIC, and derived an incident-based ranking with a Bayesian measurement-error model that corrects each category's raw count for classifier precision and recall [@lambros2026].

Agreement between the expert ranking and the incident-based ranking is weak: Cohen's kappa is approximately 0.20, with a 90% interval crossing zero. The 2026 candidate list nonetheless blends the two signals at fixed weights — 0.75 on the expert vote, 0.25 on the data — so the corpus corrects the consensus without overturning it. A pre-registered bake-off of four frontier classifiers returned no winner; none beat the incidence floor's balanced accuracy of 0.863, and a ground-truth check left the floor's ordering intact (Spearman rho 0.918 against held-out truth).

The paper is exploratory work by two members of the OWASP working group, not the official release, and it does not supersede the official list or process. The reading for practitioners: the Top 10 is a robust expert consensus and a shared vocabulary, not an empirical frequency ranking. Incident data and expert judgment capture different signals, and threat modeling should use both.

## Key Points

- Expert consensus and incident frequency diverge (kappa ~0.20); treat neither as ground truth.
- Incident counts are biased by reporting and classification; correction for classifier precision and recall matters.
- Classifying incidents is itself hard; no frontier classifier beat a simple incidence floor.
- Related: [[owasp-top-10-for-agentic-applications-2026]], [[evaluating-guardrail-effectiveness-benchmarks-and-metrics]].

## Sources

- [@lambros2026]
- [@openworldwideapplicationsecurityproject2026a]

## Relevant notes

- [OWASP Top 10 for Agentic Applications 2026](owasp-top-10-for-agentic-applications-2026.md)
- [Evaluating Guardrail Effectiveness: Benchmarks and Metrics](evaluating-guardrail-effectiveness-benchmarks-and-metrics.md)
- [OWASP Agent Control Standard for Runtime Enforcement](owasp-agent-control-standard-for-runtime-enforcement.md)
