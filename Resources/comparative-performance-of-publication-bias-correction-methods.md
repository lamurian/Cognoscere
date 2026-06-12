---
title: Comparative Performance of Publication Bias Correction Methods
description: Simulation evidence comparing PET-PEESE, Copas, p-uniform, trim-and-fill, and limit meta-analysis across scenarios
author: pi
editor: lam
date: 2026-06-11T22:59:21.107Z
tags:
  - meta-analysis
  - publication-bias
  - methodology
  - statistics
  - research
---

## Summary

Simulation studies comparing publication bias correction methods have produced a clear hierarchy of performance. For continuous outcomes, Almalik (2024) compared five methods — Copas, PET-PEESE, p-uniform, trim-and-fill, and limit meta-analysis — and found that **Copas and PET-PEESE were the least biased**. However, the Copas model suffers from convergence issues common to likelihood-based methods, while PET-PEESE is more robust under heteroscedasticity, making it the preferred technique for many applications [@almalik2024].

Other major simulation findings include:

- **PET-PEESE** performs well for SMD and log-transformed effects but has inflated Type I error when the true effect is zero. It requires 10–20 studies and assumes a linear or quadratic relationship between effect and standard error [@sterne2011].
- **Copas selection model** provides a principled sensitivity analysis but is computationally demanding and requires 15–20+ studies. Its performance depends heavily on the assumed selection mechanism [@almalik2024].
- **Trim-and-fill** performs poorly under heterogeneity and may impute missing studies on the wrong side of the funnel. It is widely available but should not be relied on as a primary correction method [@carpenter2009].
- **P-uniform** (and p-uniform*) has good performance for detecting evidential value but requires multiple significant studies and cannot estimate the overall effect when the null is true.
- **Rücker's limit meta-analysis** handles heterogeneity better than trim-and-fill but assumes a linear effect-variance relationship.

## Key Points

- Copas and PET-PEESE are the least biased correction methods for continuous outcomes in simulation studies.
- PET-PEESE is preferred in practice due to its robustness and fewer convergence issues.
- No single method dominates across all scenarios — selection of the correction method should be guided by the outcome type, number of studies, and expected heterogeneity.
- All correction methods condition on untestable assumptions about the selection mechanism, so they should be used as sensitivity analyses, not point estimators.

## Related Notes

- [[copas-selection-model-for-publication-bias]]
- [[pet-peese-for-publication-bias-correction]]
- [[p-curve-and-p-uniform-for-detecting-evidential-value]]
- [[r-cker-s-limit-meta-analysis-for-small-study-effects]]
- [[copas-method-sensitivity-to-selection-mechanisms]]