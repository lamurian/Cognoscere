---
title: Funnel Plot for Publication Bias Detection
description: Visual diagnostic for small-study effects and publication bias in meta-analysis using scatter plot of effect vs precision
author: pi
editor: lam
date: 2026-06-12T05:03:13.890Z
tags:
  - meta-analysis
  - publication-bias
  - methodology
  - statistics
source: 'null'
---

## Summary

The funnel plot is a scatter plot of each study's effect size (x-axis) against its standard error (y-axis, inverted so precision increases upward). In the absence of publication bias and heterogeneity, the plot resembles a symmetrical inverted funnel: larger, more precise studies cluster near the summary effect, while smaller, less precise studies scatter widely around it. Asymmetry suggests small-study effects, which may indicate publication bias but can also stem from heterogeneity, chance, or a genuine relationship between effect size and study size [@sterne2011].

## What it represents

The funnel plot represents the relationship between a study's effect estimate and its precision. Under the random-effects model, standardized deviates should be approximately N(0,1) and independent of precision. If this holds, the scatter should be symmetric around the summary effect. Studies with smaller standard errors (more precise) should be closer to the summary effect; studies with larger standard errors (less precise) should scatter more widely. Any systematic deviation from this pattern — asymmetry — signals that something besides random sampling variation is affecting the relationship between effect size and precision [@sterne2001].

## How to interpret

A roughly symmetrical funnel suggests no strong evidence of small-study effects. Marked asymmetry, especially a missing lower-left corner (where non-significant small studies would fall), raises concern for publication bias. However, asymmetry has several possible causes: publication bias, true between-study heterogeneity, poor study quality in small studies, or the choice of effect size metric [@sterne2001]. Contour-enhanced funnel plots shade regions of statistical significance to help distinguish these causes — if missing studies fall in non-significant regions, publication bias is more plausible [@peters2008].

A non-symmetric funnel does not prove publication bias. A symmetric funnel does not rule it out. The funnel plot is a visual diagnostic, not a statistical test. Always complement it with a formal detection test (Egger's regression, Harbord's test) and a sensitivity analysis (PET-PEESE, Copas model).

## How it differs from the Doi plot

The funnel plot plots precision (1/SE or SE) on the y-axis and has no built-in quantitative asymmetry metric. Asymmetry is judged visually or via a separate test (Egger's regression). The Doi plot replaces the precision axis with a folded normal quantile transformation, producing a symmetrical mountain shape rather than a funnel. Its key advantage is the built-in LFK index — a numerical asymmetry measure that eliminates the need for a separate statistical test [@furuyakanamori2018].

The funnel plot is the universal standard required by Cochrane and PRISMA [@sterne2011]. The Doi plot performs better in prevalence meta-analyses where ceiling effects and non-normal distributions distort the funnel shape [@barker2024]. Neither method distinguishes publication bias from other causes of asymmetry. Both are first-line screening tools, not bias-correction methods.

## Key Points

- Scatter plot of effect size vs precision (inverted SE). Symmetric under no bias or heterogeneity.
- Asymmetry can indicate publication bias, but also heterogeneity, confounding, or metric choice.
- Always complement with a formal test. Use contour-enhanced versions to distinguish causes.
- Cochrane and PRISMA require it. Use with 10+ studies minimum.
- See also: [[doi-plot-and-lfk-index-for-publication-bias]] (alternative with built-in asymmetry metric).

## Related Notes

- [[egger-s-regression-test-for-funnel-plot-asymmetry]]
- [[doi-plot-and-lfk-index-for-publication-bias]]
- [[funnel-plot-versus-doi-plot-comparison-of-visual-diagnostics]]
- [[executive-summary-comparing-publication-bias-detection-and-correction-methods]]