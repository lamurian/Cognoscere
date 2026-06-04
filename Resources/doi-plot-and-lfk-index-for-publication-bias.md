---
title: Doi Plot and LFK Index for Publication Bias
description: Alternative graphical and quantitative method for detecting small-study effects using folded normal quantile transformation
author: pi
editor: lam
date: 2026-06-04T23:22:12.905Z
tags:
  - meta-analysis
  - publication-bias
  - methodology
  - statistics
source: 'null'
---

## Summary

The Doi plot replaces the traditional funnel plot's precision axis with a folded normal quantile (Z-score) transformation, producing a symmetrical "mountain" shape rather than a funnel. The Luis Furuya-Kanamori (LFK) index quantifies the asymmetry numerically. Unlike the funnel plot, which relies on visual assessment or separate statistical tests, the Doi plot integrates a quantitative asymmetry metric directly [@furuyakanamori2018].

## When to Use and When Not

Use the Doi plot as an alternative or complement to the funnel plot, particularly in prevalence meta-analyses where the funnel plot performs poorly due to ceiling effects and non-normal distributions [@barker2024]. It is also useful when the outcome metric is a proportion or rate. Do not use it with very few studies (fewer than five), as the LFK index becomes unreliable. The method has not been validated for all effect size metrics, so exercise caution with standardized mean differences or log odds ratios outside of prevalence settings.

## How to Use and How Not

Plot the effect size on the x-axis and the folded normal quantile (Z-score from the median effect) on the y-axis. The LFK index is the difference between two asymmetry components — values below 1 indicate no asymmetry, 1 to 2 indicate minor asymmetry, and above 2 indicate major asymmetry [@furuyakanamori2018]. In R, the `meta` and `metafor` packages now support Doi plots via the `doiplot()` function. Do not apply the default LFK thresholds (1, 2) to all outcome types without calibration — simulation evidence shows that thresholds may vary by metric and number of studies.

## How to Interpret and How Not

A symmetrical Doi plot with LFK index below 1 suggests no small-study effects. Minor asymmetry (LFK 1–2) warrants caution. Major asymmetry (LFK > 2) indicates substantial small-study effects. However, the same confounders that affect funnel plots — heterogeneity, chance, and genuine effect-size–precision relationships — also affect the Doi plot [@barker2024]. Do not equate LFK-detected asymmetry with publication bias specifically. The Doi plot does not adjust for bias; it only signals that further investigation is needed.

## Mathematical Foundation

Let \(\hat{\theta}_j\) be the effect estimate from study \(j\). The Doi plot first computes the median effect \(\tilde{\theta} = \text{median}(\hat{\theta}_j)\). Each study is assigned a Z-score \(z_j = (\hat{\theta}_j - \tilde{\theta}) / s_\theta\), where \(s_\theta\) is the standard deviation of the effect estimates. The folded normal quantile is then \(q_j = \Phi^{-1}[\text{rank}(z_j) / (n+1)]\), where \(\Phi^{-1}\) is the inverse standard normal CDF. The plot displays \(\hat{\theta}_j\) on the x-axis and \(q_j\) on the y-axis, producing a symmetrical mountain shape under no bias. The LFK index quantifies departure from symmetry as the difference between two area components: LFK = \(\sum_{z_j > 0} |z_j| - \sum_{z_j < 0} |z_j|\), scaled by the number of studies [@furuyakanamori2018].

**Assumptions.** The method assumes a unimodal, approximately symmetric distribution of effect sizes. Its thresholds (LFK < 1, 1–2, > 2) were calibrated for prevalence outcome metrics (proportions, rates) and may not generalize to standardized mean differences, log odds ratios, or other metrics [@barker2024]. It further assumes the median is a reasonable central estimator and that effect-size ranking is meaningful when studies vary in precision.

**Intended use.** The Doi plot serves the same first-line screening role as the funnel plot but adds a built-in quantitative asymmetry metric (LFK index), eliminating the need for a separate statistical test. It is not a bias-correction method and does not adjust the summary estimate.