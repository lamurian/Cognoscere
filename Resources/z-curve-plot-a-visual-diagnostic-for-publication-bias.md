---
title: 'Z-Curve Plot: A Visual Diagnostic for Publication Bias'
description: New visual diagnostic overlaying model-implied on observed z-statistics to assess publication bias model fit, from Bartoš and Schimmack (2025)
author: pi
editor: lam
date: 2026-06-11T22:59:21.110Z
tags:
  - meta-analysis
  - publication-bias
  - methodology
  - statistics
  - research
---

## Summary

The Z-curve plot, proposed by Bartoš and Schimmack (2025), is a new visual diagnostic that overlays the model-implied posterior predictive distribution of z-statistics on the observed distribution. This enables direct comparison across candidate meta-analytic models — random-effects, selection models, PET-PEESE, and RoBMA — within a single plot. Models that approximate the data well show minimal discrepancy between observed and predicted z-distributions, while poor-fitting models show pronounced discrepancies [@barto2025].

Key features of the Z-curve plot:
- **Discontinuities** at significance thresholds (z = 1.96, z = 2.58) or at zero provide visual evidence of publication bias.
- Models that account for bias (e.g., selection models, RoBMA) will track these discontinuities in the observed distribution, while models that ignore bias will show systematic misfit.
- The method extrapolates bias-adjusted models to the absence of publication bias to obtain a posterior predictive distribution under no bias.
- Three summary metrics are derived: the **expected discovery rate (EDR)**, the **false discovery risk (FDR)**, and the **expected number of missing studies (N missing)**.

The Z-curve plot addresses a gap in existing visual diagnostics. While the funnel plot is the universal first-line visual, it detects small-study effects rather than publication bias specifically. The Z-curve plot directly assesses model misfit due to publication bias and provides a principled basis for comparing competing models. It is implemented in the `RoBMA` R package.

## Key Points

- Z-curve plot overlays model-implied vs observed z-statistic distributions for visual model-fit assessment.
- Discontinuities at significance thresholds reveal publication bias.
- Provides three interpretable summaries: EDR, FDR, and expected missing studies.
- Addresses a gap — existing funnel plots detect small-study effects, not publication bias per se.
- Implemented in the RoBMA R package.

## Related Notes

- [[bayesian-approaches-to-publication-bias]]
- [[funnel-plot-for-publication-bias-detection]]
- [[doi-plot-and-lfk-index-for-publication-bias]]
- [[p-curve-and-p-uniform-for-detecting-evidential-value]]