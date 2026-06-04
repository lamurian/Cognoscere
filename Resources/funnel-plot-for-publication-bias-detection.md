---
title: Funnel Plot for Publication Bias Detection
description: Visual diagnostic for small-study effects and publication bias in meta-analysis using scatter plot of effect vs precision
author: pi
editor: lam
date: 2026-06-04T23:23:06.657Z
tags:
  - meta-analysis
  - publication-bias
  - methodology
  - statistics
source: 'null'
---

## Summary

The funnel plot is a scatter plot of each study's effect size (x-axis) against its precision (1/standard error, y-axis) or standard error (inverted y-axis). In the absence of publication bias and heterogeneity, the plot resembles a symmetrical inverted funnel: larger, more precise studies cluster near the summary effect, while smaller, less precise studies scatter more widely around it. Asymmetry suggests small-study effects, which may indicate publication bias but can also stem from heterogeneity, chance, or a genuine relationship between effect size and study size.

## When to Use and When Not

Use the funnel plot as a first-line visual diagnostic in any meta-analysis with at least ten studies [@sterne2011]. Cochrane and PRISMA guidelines recommend its routine inclusion. Do not use it with fewer than ten studies, as asymmetry cannot be reliably distinguished from random scatter. Avoid over-reliance when heterogeneity is very high, as asymmetry may reflect true effect-size heterogeneity rather than bias. The plot is also uninformative when all studies have similar precision.

## How to Use and How Not

Plot the effect size measure (Hedges' g, log odds ratio, etc.) on the x-axis and the standard error on the y-axis, inverted so that precision increases upward. Add pseudo-95% confidence intervals around the summary effect line. Use contour-enhanced funnel plots that shade regions of statistical significance to help distinguish publication bias from other causes of asymmetry [@peters2008]. Do not use the raw odds ratio or risk ratio on the x-axis without log transformation, as this distorts symmetry. Do not draw causal conclusions about publication bias from the plot alone.

## How to Interpret and How Not

A roughly symmetrical funnel suggests no strong evidence of small-study effects. Marked asymmetry, especially with a missing lower-left corner (where non-significant small studies would fall), raises concern for publication bias. However, asymmetry can also arise from true heterogeneity, poor study quality in small studies, or the choice of effect size metric [@sterne2001]. Do not interpret symmetry as definitive proof of no publication bias. Do not use visual inspection alone for decisions about bias adjustment — combine with statistical tests such as Egger's regression test [@egger1997].

## Mathematical Foundation

The funnel plot is not based on a formal statistical model — it is a visual heuristic. Let \(\hat{\theta}_j\) be the effect estimate from study \(j\) with standard error \(s_j\). Under the standard random-effects model \(\hat{\theta}_j \sim N(\theta, \tau^2 + s_j^2)\), the standardized deviate \(z_j = (\hat{\theta}_j - \hat{\theta}_{REML}) / \sqrt{\widehat{\text{Var}}(\hat{\theta}_j)}\) should be approximately \(N(0,1)\) and independent of \(s_j\). This implies that when plotting \(\hat{\theta}_j\) against \(1/s_j\) (precision) or \(s_j\) (inverted), the scatter should be symmetric around the summary effect. The pseudo-95% confidence interval lines are drawn at \(\hat{\theta}_{REML} \pm 1.96 / \sqrt{\tilde{s}_j}\) for each precision value \(\tilde{s}_j = 1/s_j\).

**Assumptions.** The validity of the funnel plot as a bias diagnostic rests on three untestable assumptions: (1) no correlation between true effect size and study precision; (2) between-study heterogeneity is correctly modeled; (3) effect estimates are normally distributed around the true effect. Violation of any of these can produce asymmetry indistinguishable from publication bias [@sterne2001]. Contour-enhanced funnel plots (shading regions of statistical significance at \(p < 0.01, 0.05, 0.10\)) help distinguish whether asymmetry is driven by selective publication (missing studies in non-significant regions) versus other causes [@peters2008].

**Intended use.** The funnel plot is a purely visual diagnostic. It is not a hypothesis test, does not produce a p-value, and does not adjust the summary estimate. Its role is to flag potential small-study effects for further investigation using formal tests and sensitivity analyses.

## Relevant Notes

- [[eggers-regression-test-for-funnel-plot-asymmetry]]
- [[doi-plot-and-lfk-index-for-publication-bias]]
- [[executive-summary-comparing-publication-bias-detection-and-correction-methods]]
- [[synthesis-reporting-communicating-statistical-findings]]
- [[limitations-and-contradictions-in-research-on-organisational-factors-and-resilience]]