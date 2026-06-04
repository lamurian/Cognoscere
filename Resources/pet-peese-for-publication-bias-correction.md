---
title: PET-PEESE for Publication Bias Correction
description: Precision-effect test and precision-effect estimate with standard error for detecting and correcting publication bias in meta-analysis
author: pi
editor: lam
date: 2026-06-04T23:22:12.907Z
tags:
  - meta-analysis
  - publication-bias
  - methodology
  - statistics
source: 'null'
---

## Summary

PET-PEESE is a two-step meta-regression approach that both detects and adjusts for publication bias. PET (Precision-Effect Test) regresses the effect size on its standard error; if the intercept is non-significant, PEESE (Precision-Effect Estimate with Standard Error) regresses the effect on its variance (standard error squared). The intercept from the chosen model serves as the bias-corrected effect estimate [@stanley2014; @stanley2017]. The logic is that if small studies with high SE are preferentially published when they show large effects, the relationship between SE and effect size can be extrapolated to SE = 0 (a hypothetical infinitely large study).

## When to Use and When Not

Use PET-PEESE as a sensitivity analysis after detecting funnel plot asymmetry, especially when the meta-analysis contains at least 10–20 studies. It performs well for standardized mean differences and log-transformed effect sizes. Do not use it with very few studies (fewer than 10), when all studies have similar standard errors, when heterogeneity is very large relative to sampling error, or with rare-event binary data. Simulation studies show PET-PEESE has inflated Type I error when the true effect is zero and studies are few [@stanley2017].

## How to Use and How Not

Fit a meta-regression with effect size as the dependent variable and standard error as the predictor, using inverse-variance weights. If the SE coefficient is non-significant, re-fit with SE-squared as the predictor. The intercept in both models is the bias-corrected estimate. In R (metafor), use `rma(yi, vi, mods = ~sqrt(vi))` for PET and `rma(yi, vi, mods = ~vi)` for PEESE. Do not use the conditional PET→PEESE decision rule as a significance filter to decide whether publication bias exists — this inflates Type I error. Do not apply PET-PEESE to untransformed odds ratios or risk ratios.

## How to Interpret and How Not

The PET or PEESE intercept is the estimated effect when sampling error is zero — that is, the effect a study with infinite precision would report. If the adjusted estimate is substantially smaller than the naive random-effects summary, upward publication bias is suspected. A meaningful difference (e.g., the naive estimate is significant but the adjusted estimate is near zero) suggests that the apparent effect may be an artifact of selective reporting. Do not treat the PET-PEESE estimate as a truly unbiased effect — extrapolation to SE = 0 relies on a linear (or quadratic) assumption that may not hold. The method corrects for selection on statistical significance but is sensitive to model misspecification [@stanley2017; @barto2022].

## Mathematical Foundation

PET-PEESE arises from the meta-regression framework. Let \(\hat{\theta}_j\) be the effect estimate with standard error \(s_j\). PET fits the weighted regression

\[\hat{\theta}_j = \beta_0 + \beta_1 s_j + \varepsilon_j\]

with inverse-variance weights \(w_j = 1/s_j^2\). The intercept \(\beta_0\) is the precision-effect estimate — the predicted effect when \(s_j = 0\) (a hypothetical study of infinite precision). If publication bias operates through selection on significance, small studies with large \(s_j\) need larger effects to reach significance, inducing a positive correlation between \(\hat{\theta}_j\) and \(s_j\). Extrapolating to \(s_j = 0\) removes this bias under the assumption that \(E[\hat{\theta}_j | s_j] = \theta + \beta_1 s_j\). PEESE replaces \(s_j\) with \(s_j^2\) because when selection is on statistical significance, the expected bias is proportional to the variance rather than the SE [@stanley2014].

**Assumptions.** The key assumption is that the relationship between effect size and SE (or SE²) is correctly specified as linear. Violations include: non-linear relationships, extreme heterogeneity (inflating standard errors of the regression coefficients), and near-zero true effects (causing the conditional PET→PEESE decision rule to inflate Type I error) [@stanley2017]. The method requires at least 10–20 studies and appreciable variation in SE for stable extrapolation. It performs poorly with rare-event binary data and untransformed odds ratios.

**Intended use.** PET-PEESE is a bias-correction method, not merely a detection test. Its output is an adjusted estimate of the effect size, not a p-value for asymmetry. The conditional decision rule (use PEESE if PET intercept is non-significant) should not be treated as a significance test for publication bias. The adjusted estimate should be reported alongside the naive random-effects estimate as part of a sensitivity analysis.