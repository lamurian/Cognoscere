---
title: Begg and Mazumdar's Rank Correlation Test
description: Nonparametric test for publication bias using Kendall's tau between standardized effect size and variance
author: pi
editor: lam
date: 2026-06-04T23:22:12.910Z
tags:
  - meta-analysis
  - publication-bias
  - methodology
  - statistics
source: 'null'
---

## Summary

Begg and Mazumdar's rank correlation test assesses funnel plot asymmetry by computing Kendall's tau rank correlation between the standardized effect size and its sampling variance [@begg1994]. If publication bias is present, small studies with large sampling variances tend to report larger effects, producing a positive correlation. The test is nonparametric and does not assume normally distributed effects.

## When to Use and When Not

Use Begg's test as a supplementary, nonparametric check alongside Egger's regression test. It can be useful when the normality assumptions of Egger's test are in doubt. Do not use it as the primary test for publication bias, as it has substantially lower statistical power than Egger's test, especially with small meta-analyses [@sterne2001]. Avoid it when many studies have identical effect sizes or variances, as ties reduce the reliability of Kendall's tau. With fewer than 10–15 studies, the test has very limited power.

## How to Use and How Not

In Stata, use `metabias, method(begg)`. In R (metafor), use `ranktest(res)`. The test standardizes each effect size by subtracting the fixed-effects weighted mean, then computes Kendall's tau between the standardized residuals and their variances or standard errors. Do not use the test as a basis for adjusting or correcting the meta-analytic estimate — it is a detection tool only. Do not use the simple (unstandardized) version, which does not account for the fact that studies come from different populations.

## How to Interpret and How Not

A significant positive Kendall's tau suggests that smaller studies tend to report larger effects, consistent with publication bias or small-study effects. A non-significant result does not rule out publication bias, given the test's low power. Do not equate statistical significance (or non-significance) with the presence (or absence) of publication bias. The test quantifies association, not causation. Do not report Begg's test p-value without also reporting the funnel plot and Egger's test, as the combination provides a more complete picture.

## Mathematical Foundation

Let \(\hat{\theta}_j\) be the effect estimate with variance \(s_j^2\). The test first computes the fixed-effects weighted mean \(\bar{\theta}_w = \sum w_j \hat{\theta}_j / \sum w_j\) where \(w_j = 1/s_j^2\). Each study is assigned a standardized residual \(r_j = (\hat{\theta}_j - \bar{\theta}_w) / s_j\). Kendall's rank correlation coefficient \(\tau\) is then computed between \(r_j\) and \(s_j^2\) (or \(s_j\)):

\[\tau = \frac{2}{n(n-1)} \sum_{i < j} \text{sgn}(r_i - r_j) \cdot \text{sgn}(s_i^2 - s_j^2)\]

Under the null hypothesis of no association between effect size and sampling variance, \(\tau\) is approximately normal with mean zero and variance \(2(2n+5) / [9n(n-1)]\) [@begg1994]. A positive \(\tau\) indicates that smaller studies (larger variance) tend to produce larger effects.

**Assumptions.** The test is nonparametric and does not assume normality of the effect distribution, making it more robust than Egger's regression in that regard. However, it shares a critical limitation: a significant correlation between effect size and variance does not distinguish publication bias from heterogeneity, chance, or genuine effect-size–precision relationships. The test has substantially lower power than Egger's regression across most realistic scenarios, especially when the meta-analysis contains fewer than 20 studies [@sterne2001]. Ties in the rank ordering (identical effect sizes or variances) reduce the effective sample size and can bias the test.

**Intended use.** Begg's test is a supplementary detection tool with no correction component. It should never be used as the sole test for publication bias. Its primary value is as a robustness check when the normality assumptions of Egger's test are questionable — if both tests agree, the evidence for asymmetry is stronger; if they disagree, the divergence itself warrants investigation.