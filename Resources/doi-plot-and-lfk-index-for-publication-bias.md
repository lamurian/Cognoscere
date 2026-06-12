---
title: Doi Plot and LFK Index for Publication Bias
description: Alternative graphical and quantitative method for detecting small-study effects using folded normal quantile transformation
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

The Doi plot is an alternative to the funnel plot for detecting small-study effects in meta-analysis. It replaces the funnel plot's precision axis (1/SE) with a folded normal quantile (Z-score) transformation, producing a symmetrical mountain shape rather than a funnel. Its key innovation is the built-in Luis Furuya-Kanamori (LFK) index — a numerical asymmetry metric that eliminates the need for a separate statistical test like Egger's regression [@furuyakanamori2018].

## What it represents

The Doi plot transforms each study's effect estimate into a folded normal quantile based on its rank deviation from the median effect. Under no asymmetry, the plotted points form a symmetrical mountain centred on the median. The y-axis is the folded normal quantile (Φ⁻¹[rank(zⱼ)/(n+1)]), which stretches the distribution at the tails, making asymmetry more visually apparent than in a funnel plot. The shape of the mountain directly reflects the distribution of effect sizes — a clean, narrow peak with symmetric tails suggests no small-study effects; a skewed or flattened peak suggests asymmetry [@furuyakanamori2018].

## How to interpret

The LFK index quantifies the departure from symmetry. Thresholds calibrated for prevalence outcomes: LFK < 1 indicates no asymmetry, LFK 1–2 indicates minor asymmetry, LFK > 2 indicates major asymmetry [@furuyakanamori2018]. These thresholds were developed for proportions and rates and may not generalize to SMD, log OR, or other metrics [@barker2024].

A symmetrical Doi plot with LFK < 1 suggests no strong small-study effects. Major asymmetry (LFK > 2) signals substantial asymmetry that warrants investigation. However, the same confounders that affect funnel plots — heterogeneity, chance, genuine effect-precision relationships — also affect the Doi plot. Do not equate LFK-detected asymmetry with publication bias specifically.

## How it differs from the funnel plot

The fundamental difference is the y-axis: a funnel plot uses precision (1/SE or SE), while the Doi plot uses a folded normal quantile transformation. This gives the Doi plot a qualitative advantage — asymmetry is often more visually apparent — and a quantitative one — the LFK index is built in, so no separate test is needed [@furuyakanamori2018].

The funnel plot is the universal standard required by Cochrane and PRISMA [@sterne2011]. The Doi plot performs better in prevalence meta-analyses where ceiling effects near 0 or 1 distort the funnel shape and inflate Egger's test Type I error [@barker2024]. The Doi plot is less validated for non-prevalence metrics and for meta-analyses with fewer than five studies.

Neither method distinguishes publication bias from other causes of asymmetry. Both are first-line screening diagnostics, not correction methods.

## Key Points

- Mountain-shaped plot using folded normal quantile transformation, not precision.
- Built-in LFK index quantifies asymmetry (no separate test needed).
- Better performance than funnel plot for prevalence meta-analyses (proportions, rates).
- Thresholds (1, 2) calibrated for prevalence outcomes — may not generalize.
- See also: [[funnel-plot-for-publication-bias-detection]] (standard alternative).

## Related Notes

- [[funnel-plot-for-publication-bias-detection]]
- [[funnel-plot-versus-doi-plot-comparison-of-visual-diagnostics]]
- [[executive-summary-comparing-publication-bias-detection-and-correction-methods]]