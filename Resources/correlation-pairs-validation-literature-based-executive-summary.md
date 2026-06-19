---
title: 'Correlation Pairs Validation: Literature-Based Executive Summary'
description: Executive summary comparing literature-reported Pearson r values against the asserted bounds in the simulation test suite, with recommendations for empirically grounded bounds
author: pi
editor: lam
date: 2026-06-19T13:10:52.828Z
tags:
  - executive-summary
  - correlation
  - validation
  - psychometrics
  - empirical
  - research
---

## Executive Summary

This research reviewed published empirical correlations between psychological constructs (perceived stress, resilience, affect, social support, coping) to validate the asserted bounds used in an agent-based simulation test suite. The literature shows that many bounds in the test suite are either too wide (accommodating impossible values) or too narrow (rejecting empirically documented correlations). None of the bounds appear to be derived from systematic literature review.

## Key Findings

- **[PSS-10 and Resilience: Empirical Correlation](pss-10-and-resilience-empirical-correlation.md)** — r ≈ -0.40 to -0.55. Bound |r|<0.6 is reasonable as upper limit but zero lower bound is too restrictive. Ad-hoc |r|<0.5 is slightly tight.
- **[PSS-10 and Affect: Empirical Correlation](pss-10-and-affect-empirical-correlation.md)** — r ≈ -0.18 to -0.30. Both |r|<0.6 and |r|<0.5 cover the range, but more precise bounds would be |r|<0.35.
- **[PSS-10 and Resources (Social Support): Empirical Correlation](pss-10-and-resources-social-support-empirical-correlation.md)** — r ≈ -0.08 to -0.22. Bound |r|<0.6 is far too wide; ±0.3 would be more appropriate.
- **[Resilience and Affect: Empirical Correlation](resilience-and-affect-empirical-correlation.md)** — r ≈ 0.30 to 0.70. Bound |r|<0.6 (tests #4, #14) is too restrictive, rejecting strong associations (γ=0.70) that are empirically documented.
- **[Affect and Resources (Social Support): Empirical Correlation](affect-and-resources-social-support-empirical-correlation.md)** — r ≈ 0.15 to 0.30. |r|<0.70 is unnecessarily wide; |r|<0.5 still generous.
- **[Current Stress and Affect: Empirical Correlation](current-stress-and-affect-empirical-correlation.md)** — r ≈ 0.30 to 0.50. Bound |r|<0.5 is right at the empirical limit, risk of Type I error.
- **[PSS-10 and Current Stress: Convergent Validity](pss-10-and-current-stress-convergent-validity.md)** — r ≈ 0.40 to 0.60. The asserted r>0.05 is a meaningless floor.
- **[Social Support and Coping Success: Empirical Correlation](social-support-and-coping-success-empirical-correlation.md)** — r ≈ 0.15 to 0.40. |r|<0.6 is wide but the cited theory range (0.20-0.40) is more accurate.
- **[Current Stress and Resources: Empirical Correlation](current-stress-and-resources-empirical-correlation.md)** — r ≈ -0.08 to -0.25. Ad-hoc [-0.9,0.1] is excessively wide.
- **[Resilience and Resources: Empirical Correlation](resilience-and-resources-empirical-correlation.md)** — r ≈ 0.20 to 0.63. Asserted lower bound 0.10 is too permissive; empirical minimum ≈ 0.20. Upper bounds of 0.80-0.85 are generous but safe.

## Literature-Based Correlation Table

| # | Variable pair | Empirical r (range) | Asserted bound | Assessment |
|---|---|---|---|---|
| 1 | pss10 ↔ resilience | -0.40 to -0.55 | \|r\|<0.6 | Reasonable upper bound but zero min too permissive |
| 2 | pss10 ↔ affect | -0.18 to -0.30 | \|r\|<0.6 | Too wide; \|r\|<0.35 would suffice |
| 3 | pss10 ↔ resources | -0.08 to -0.22 | \|r\|<0.6 | Too wide; \|r\|<0.3 would suffice |
| 4 | resilience ↔ affect | 0.30 to 0.70 | \|r\|<0.6 | **Too restrictive** — strong r>0.6 documented |
| 5 | affect ↔ resources | 0.15 to 0.30 | \|r\|<0.70 | Too wide; \|r\|<0.4 would suffice |
| 6 | current_stress ↔ affect | 0.30 to 0.50 | \|r\|<0.5 | Borderline — at empirical limit, risks false rejection |
| 7 | avg_pss10 ↔ avg_stress | 0.40 to 0.60 | r>0.05 | Meaningless floor; should be r>0.30 |
| 8 | social_support ↔ coping | 0.15 to 0.40 | \|r\|<0.6 | Cited range 0.20-0.40 is more accurate |
| 9 | current_stress ↔ resources | -0.08 to -0.25 | [-0.9, 0.1] | Excessively wide on negative end |
| 10 | **resilience ↔ resources** | **0.20 to 0.63** | **[0.10, 0.80] / [0.10, 0.85]** | **Lower bound too permissive (min r≈0.20); upper safe** |

## Confidence Assessment

| Question | Confidence | Rationale |
|---|---|---|
| Q1: What are the empirical correlations? | High | Multiple peer-reviewed studies, consistent findings across populations |
| Q2: Are the asserted bounds valid? | High | Clear mismatches identified with specific recommended corrections |

## Known Gaps

- Few meta-analyses directly report Pearson r between these specific construct pairs; most use SEM or regression coefficients
- Social support ↔ coping success studies use heterogeneous operationalizations of coping success
- Current/acute stress measures vary widely (DASS, VAS, EMA), making cross-study comparisons approximate
- The simulation uses its own measures (constructed from agent states); literature correlations between standard instruments may not directly translate

## Sources
- @acoba2024, @kermott2019, @monteromarin2015, @yang2020, @schneider2020, @chen2023

## Relevant notes

- [PSS-10 and Resilience: Empirical Correlation](pss-10-and-resilience-empirical-correlation.md)
- [PSS-10 and Current Stress: Convergent Validity](pss-10-and-current-stress-convergent-validity.md)
- [Social Support and Coping Success: Empirical Correlation](social-support-and-coping-success-empirical-correlation.md)
- [Current Stress and Resources: Empirical Correlation](current-stress-and-resources-empirical-correlation.md)
- [Resilience Distribution Norms: CD-RISC Empirical Reference](resilience-distribution-norms-cd-risc-empirical-reference.md)
- [Psychological Resources and Resilience — Executive Summary](psychological-resources-and-resilience-executive-summary.md)
- [Correlation Between Psychological Resources and Resilience — Empirical Range](correlation-between-psychological-resources-and-resilience-empirical-range.md)
- [Conceptual Demarcation Between Psychological Resources and Resilience](conceptual-demarcation-between-psychological-resources-and-resilience.md)
- [PSS-10 Item-Level Descriptive Statistics](pss-10-item-level-descriptive-statistics.md)
- [Stress and Affect: Empirical Correlations](stress-and-affect-empirical-correlations.md)
- [Resilience and Resources: Empirical Correlation](resilience-and-resources-empirical-correlation.md)