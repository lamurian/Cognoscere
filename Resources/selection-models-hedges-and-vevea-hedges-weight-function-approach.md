---
title: 'Selection Models: Hedges and Vevea-Hedges Weight-Function Approach'
description: Parametric selection models that use weight functions to model publication probability as a function of p-value intervals
author: pi
editor: lam
date: 2026-06-04T23:22:12.911Z
tags:
  - meta-analysis
  - publication-bias
  - methodology
  - statistics
source: 'null'
---

## Summary

Selection models for publication bias, introduced by Hedges [@hedges1984] and extended by Vevea and Hedges [@vevea1995; @vevea2005], model the probability that a study is observed as a function of its p-value. The key idea is that studies with statistically significant results are more likely to be published. A weight function, usually defined over p-value intervals (e.g., p < 0.01, 0.01–0.05, 0.05–0.10, > 0.10), captures this selection process. The model estimates both the adjusted effect and the selection weights simultaneously, providing a bias-corrected estimate under the assumed selection mechanism.

## When to Use and When Not

Use selection models when you have a clear hypothesis about the selection mechanism (e.g., significant results more likely published) and at least 15–20 studies to estimate the weight parameters. They are most useful as sensitivity analyses alongside other methods. Do not use with fewer than 10–15 studies, as the weight-function parameters will be poorly estimated. Avoid models with too many weight intervals relative to the number of studies, as this overfits and produces unstable estimates.

## How to Use and How Not

In R, the `selmodel()` function in metafor fits various selection models, including step-function weights. Specify the cut-points for p-value intervals (e.g., `c(0.01, 0.05, 0.10)`). A likelihood ratio test compares the selection model to the no-selection model. Use a moderate number of cut-points (3–5) — too few may miss the selection pattern, too many cause convergence failures. Do not choose cut-points post-hoc based on the data. Do not interpret the likelihood ratio test as a definitive test for publication bias — it tests whether the assumed weight-function form improves fit, not whether bias exists.

## How to Interpret and How Not

Compare the adjusted effect estimate from the selection model to the naive meta-analytic estimate. If the adjusted estimate is attenuated, this is consistent with publication bias inflating the original estimate. The estimated weights indicate how much more likely significant studies are to be published than non-significant ones. Do not treat the adjusted estimate from a single weight-function specification as the true effect. Selection models identify the data most consistent with the assumed weights, but the true selection process is unknown. Do not use selection models that assume the weights are known with certainty — the Vevea-Hedges sensitivity analysis should always be presented [@vevea2005].

## Mathematical Foundation

Let \(\hat{\theta}_j\) be the effect estimate with variance \(s_j^2\), and let \(p_j\) be its two-tailed p-value. The selection model specifies the likelihood of observing study \(j\) conditional on its effect as proportional to a weight function \(\omega(p_j)\):

\[L(\theta, \tau^2, \omega) = \prod_{j=1}^k \frac{f(\hat{\theta}_j \mid \theta, \tau^2 + s_j^2) \, \omega(p_j)}{\int f(t \mid \theta, \tau^2 + s_j^2) \, \omega(p(t)) \, dt}\]

where \(f\) is the normal density [@hedges1984]. The denominator ensures the likelihood integrates to one over the observable range. The weight function \(\omega(p)\) is typically specified as a step-function over \(m\) p-value intervals (e.g., \([0, 0.01], [0.01, 0.05], [0.05, 0.10], [0.10, 1]\)), with \(\omega_1 = 1\) fixed for identification and \(\omega_2, \ldots, \omega_m\) estimated. A likelihood ratio test compares the selection model (\(\omega_j \neq 1\)) to the no-selection model (\(\omega_j = 1\) for all \(j\)). Vevea and Hedges [@vevea2005] extended this to a sensitivity analysis where plausible weight-function shapes are pre-specified rather than estimated, avoiding the instability of estimating many parameters from limited data.

**Assumptions.** Selection is assumed to depend only on the p-value and not on the direction or magnitude of the effect beyond its significance level. The weight function must be correctly specified (both the number of intervals and their cut-points). The model requires at least 15–20 studies for stable estimation of even 3–4 weight parameters. Too many intervals cause convergence failures; too few miss important selection patterns. The likelihood ratio test has limited power to detect selection when the weight function is misspecified [@vevea2005].

**Intended use.** Selection models are for sensitivity analysis, not definitive correction. The adjusted estimate under any single weight-function specification is conditional on untestable assumptions about the selection process. Report estimates across multiple plausible weight-function shapes and compare them to the naive estimate. The Vevea-Hedges sensitivity approach (pre-specified weights) is often more practical than freely estimated weights for smaller meta-analyses.