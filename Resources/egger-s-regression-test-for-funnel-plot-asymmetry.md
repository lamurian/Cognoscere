---
title: Egger's Regression Test for Funnel Plot Asymmetry
description: Statistical test for detecting small-study effects in meta-analysis by regressing standard normal deviates on precision
author: pi
editor: lam
date: 2026-06-04T23:22:12.906Z
tags:
  - meta-analysis
  - publication-bias
  - methodology
  - statistics
source: 'null'
---

## Summary

Egger's regression test evaluates funnel plot asymmetry by fitting a linear regression of the standard normal deviate (effect size divided by its standard error) on precision (inverse of the standard error). The intercept of this regression quantifies asymmetry: a significant intercept indicates that small studies produce systematically different effects than large studies [@egger1997]. It has become the most widely used statistical test for publication bias in meta-analysis.

## When to Use and When Not

Use Egger's test as a first-line statistical complement to the funnel plot when the meta-analysis includes at least ten studies [@sterne2011]. It is recommended by Cochrane. Do not use it with fewer than ten studies, as statistical power is very low. For binary outcomes with large effect sizes or odds ratios as the metric, use the Harbord modification or arcsine-based alternatives instead of standard Egger [@harbord2006]. Do not use it when heterogeneity is extreme, as the regression may falsely detect asymmetry.

## How to Use and How Not

In most meta-analysis software (metafor, meta in R; Stata's metabias), Egger's test is implemented as `metabias(metaobj, method = "linreg")` or `regtest()` in metafor. The test regresses \(z_j = y_j / s_j\) on \(w_j = 1/s_j\), where \(y_j\) is the effect and \(s_j\) its standard error. Use a significance threshold of p < 0.10 (recommended by Cochrane for its modest power). Do not use the unweighted version as default — weighted regression is standard. Do not run Egger's test without first examining the funnel plot, as outliers and influential studies can drive the test result.

## How to Interpret and How Not

A significant Egger intercept (p < 0.10) suggests funnel plot asymmetry consistent with small-study effects or publication bias. The intercept's magnitude indicates the degree of asymmetry but not the size of the bias in the summary effect. Do not interpret a non-significant result as proof of no publication bias — the test has low power with fewer than 20 studies [@sterne2001]. A significant Egger test does not identify which mechanism caused the asymmetry. Always report the intercept estimate and its confidence interval alongside the p-value.

## Mathematical Foundation

Let \(\hat{\theta}_j\) be the effect estimate and \(s_j\) its standard error. Egger's test fits the weighted linear regression

\[z_j = \beta_0 + \beta_1 w_j + \varepsilon_j, \qquad \varepsilon_j \sim N(0, \sigma^2 w_j^{-1})\]

where \(z_j = \hat{\theta}_j / s_j\) is the standard normal deviate and \(w_j = 1/s_j\) is precision [@egger1997]. Under the null hypothesis of no small-study effects, the regression line passes through the origin (\(\beta_0 = 0\)), meaning that when precision is zero (a study of infinite variance), the standardized effect is zero. A non-zero intercept signals that the relationship between effect size and precision is asymmetric. The regression is weighted by \(w_j\) (or \(w_j^2\), depending on implementation) to account for heteroscedasticity.

**Assumptions.** The test assumes a linear relationship between \(z_j\) and \(w_j\), normally distributed effects, and homoscedastic residuals. These assumptions break down when: (1) the outcome is a binary measure with large effects (the log-odds-ratio and its variance are correlated under the null, inflating Type I error) [@harbord2006]; (2) heterogeneity is extreme, causing the regression to detect asymmetry that reflects heterogeneity rather than bias; (3) fewer than 10 studies are available, giving very low power [@sterne2011]. A significance threshold of \(\alpha = 0.10\) is recommended to compensate for low power.

**Intended use.** Egger's test is a detection-only tool. It tests whether asymmetry exists but does not quantify the magnitude of bias in the summary effect or provide a corrected estimate. It should always be reported alongside the funnel plot and followed by sensitivity analyses (PET-PEESE, Copas, or trim and fill) if asymmetry is detected.