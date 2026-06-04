---
title: 'Executive Summary: Comparing Publication Bias Detection and Correction Methods'
description: Comparison of funnel plot, Doi plot, Egger, PET-PEESE, Copas, trim and fill, selection models, p-curve, Harbord test, and fail-safe N for meta-analysis
author: pi
editor: lam
date: 2026-06-04T23:22:57.771Z
tags:
  - meta-analysis
  - publication-bias
  - methodology
  - statistics
  - executive-summary
---

## Summary

This briefing compares twelve methods for detecting and correcting publication bias in meta-analysis. Methods fall into three categories: visual diagnostics, significance tests, and sensitivity adjustments. No single method is sufficient — best practice uses at least one from each category.

## Visual Diagnostics

**Funnel plot** is the universal first-line visual tool. Cheap, intuitive, but purely subjective. Cochrane and PRISMA require it. **Doi plot (LFK index)** is a newer alternative that provides an objective asymmetry metric. It outperforms the funnel plot in prevalence meta-analyses but is less validated for other metrics. Both detect small-study effects, not publication bias specifically.

## Significance (Detection) Tests

**Egger's regression test** is the standard statistical complement to the funnel plot. It has modest power with fewer than 20 studies. For binary outcomes with odds ratios, use **Harbord's test** instead (lower Type I error). **Begg's rank correlation test** is nonparametric but has even lower power — use it only as a supplement. **P-curve** tests for evidential value rather than asymmetry and is useful when you suspect p-hacking. All detection tests share the same limitation: a non-significant result does not rule out publication bias.

## Sensitivity Adjustments

**PET-PEESE** is the most practical bias-correction method for continuous outcomes. It regresses effect on SE (or SE²) to extrapolate to an infinite study. It requires 10+ studies and performs well for SMD and log-transformed effects. **Rücker's limit meta-analysis** is a good alternative when heterogeneity is present — it uses a more sophisticated likelihood framework and out-performs trim and fill. **Trim and fill** is widely used but outdated: it performs poorly under heterogeneity and imputes studies on possibly the wrong side.

**Copas selection model** is the most principled sensitivity analysis, explicitly modeling the selection process. It requires 15+ studies and a grid of selection assumptions. It does not produce a single corrected estimate but a range of estimates under different scenarios. **Vevea-Hedges selection models** offer a similar sensitivity framework using weight functions based on p-value intervals. Both selection-model approaches are computationally more demanding but provide deeper insight than simpler corrections.

## Methods to Avoid

**Fail-safe N (Rosenthal, Orwin)** is widely considered obsolete. Its assumptions are unrealistic and its thresholds arbitrary. Do not rely on it.

## Recommendations

For a typical meta-analysis: (1) start with a **funnel plot** and **Egger's test** (or Harbord for binary outcomes); (2) if asymmetry is detected or suspected, apply **PET-PEESE** for continuous outcomes or **Rücker's limit meta-analysis**; (3) complement with a **Copas selection model** sensitivity analysis if you have 15+ studies; (4) report the naive estimate alongside all adjusted estimates. Avoid declaring "no publication bias" from any single test. Use this multi-method workflow to assess sensitivity, not to prove absence of bias [@sterne2011; @barto2022; @simonsohn2014b].

## Related Notes

- [[funnel-plot-for-publication-bias-detection]]
- [[doi-plot-and-lfk-index-for-publication-bias]]
- [[eggers-regression-test-for-funnel-plot-asymmetry]]
- [[pet-peese-for-publication-bias-correction]]
- [[copas-selection-model-for-publication-bias]]
- [[trim-and-fill-for-estimating-missing-studies]]
- [[begg-and-mazumdars-rank-correlation-test]]
- [[selection-models-hedges-and-vevea-hedges-weight-function-approach]]
- [[p-curve-and-p-uniformstar-for-detecting-evidential-value]]
- [[fail-safe-n-and-orwins-fail-safe-n]]
- [[r-cker-s-limit-meta-analysis-for-small-study-effects]]
- [[harbord-and-macaskill-tests-for-binary-outcome-meta-analysis]]
- [[synthesis-reporting-communicating-statistical-findings]]
- [[limitations-and-contradictions-in-research-on-organisational-factors-and-resilience]]
- [[roadmap-learning-statistics-from-scratch-frequentist-and-bayesian-perspectives]]