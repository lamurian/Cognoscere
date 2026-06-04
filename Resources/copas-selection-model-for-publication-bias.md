---
title: Copas Selection Model for Publication Bias
description: Sensitivity analysis method using a two-equation model to estimate the effect of selective publication on meta-analysis results
author: pi
editor: lam
date: 2026-06-04T23:22:12.908Z
tags:
  - meta-analysis
  - publication-bias
  - methodology
  - statistics
source: 'null'
---

## Summary

The Copas selection model addresses publication bias by explicitly modeling the selection process that determines which studies are published. It uses two equations: an outcome equation (standard random-effects meta-analysis) and a selection equation linking publication probability to each study's standard error (smaller, less precise studies have lower publication probability). By varying the assumed association between standard error and publication probability, the model generates a sensitivity analysis showing how the summary estimate changes under different selection scenarios [@copas1997; @copas2001].

## When to Use and When Not

Use the Copas model as a sensitivity analysis when you suspect publication bias and have a moderate to large number of studies (15–20 or more). It is especially valuable when you want to quantify how robust the meta-analytic estimate is to plausible degrees of selective publication. Do not use it with fewer than ten studies, as the model parameters become unstable and may fail to converge. Avoid it when the selection mechanism is unlikely to depend on standard error (e.g., when studies are suppressed for reasons unrelated to precision).

## How to Use and How Not

Fit the Copas model by specifying the outcome model (random effects) and the selection model (a probit model where publication probability depends on the standard error). In R, the `copas()` function in the `meta` package implements this. The model produces a bias-corrected estimate under a given selection assumption. Conduct a sensitivity analysis by varying the selection parameters (typically the parameter γ₀ and γ₁, which control the intercept and slope of the selection equation). Plot the adjusted estimate across a grid of selection severity values [@carpenter2009]. Do not run the model with default parameters only — a sensitivity grid is essential. Do not use the Copas model as a single hypothesis test for publication bias.

## How to Interpret and How Not

Examine whether the bias-corrected estimate changes meaningfully across the range of plausible selection scenarios. If the estimate remains stable, the meta-analytic result is relatively robust to publication bias. If the estimate shifts substantially (e.g., from significant to non-significant), the result is sensitive to selection and should be interpreted with caution. Do not interpret any single Copas-adjusted estimate as the true effect — the model conditions on a specific, untestable selection assumption. Do not claim that the Copas model proves the absence of publication bias. The model only adjusts for selection on standard error; other selection mechanisms (e.g., suppression based on results regardless of precision) are not captured [@shim2015].

## Mathematical Foundation

The Copas model pairs two equations. The outcome equation is the standard random-effects model:

\[\hat{\theta}_j \sim N(\theta, \tau^2 + s_j^2)\]

The selection equation models the probability that study \(j\) is observed:

\[P(\text{observed} \mid \hat{\theta}_j, s_j) = \Phi(\gamma_0 + \gamma_1 / s_j)\]

where \(\Phi\) is the standard normal CDF, and \(\gamma_1\) controls how strongly publication probability depends on precision [@copas2001]. When \(\gamma_1 > 0\), smaller studies (larger \(s_j\)) have lower publication probability. The joint likelihood integrates over the unobserved studies, and estimation proceeds via maximum likelihood. Because \(\gamma_0, \gamma_1\) are not identifiable from the observed data alone, the model is used as a sensitivity analysis: \(\gamma_0, \gamma_1\) are varied over a plausible grid, and the adjusted \(\hat{\theta}_{adj}\) is examined for sensitivity.

**Assumptions.** The selection mechanism depends only on standard error, not on the magnitude or sign of the effect size itself. The probit selection function is assumed correct. The random-effects outcome model is correctly specified. These assumptions are strong and untestable. The model is sensitive to convergence failures when the number of studies is small (< 10–15) or when selection is very weak relative to heterogeneity [@carpenter2009].

**Intended use.** The Copas model is a sensitivity analysis, not a hypothesis test. It does not produce a single corrected estimate but a range of estimates across selection scenarios. The key output is the sensitivity plot and the conclusion about whether the meta-analytic result is robust to plausible degrees of selective publication.