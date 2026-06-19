---
title: Bayesian Approaches to Publication Bias
description: Robust Bayesian Copas and RoBMA frameworks that address normality assumptions and model-uncertainty via Bayesian model averaging
author: pi
editor: lam
date: 2026-06-11T22:59:21.109Z
tags:
  - meta-analysis
  - publication-bias
  - methodology
  - statistics
  - bayesian
  - research
---

## Summary

Bayesian methods offer a flexible framework for publication bias assessment that addresses several limitations of frequentist approaches. Bai, Lin, Boland, and Chen (2021) developed the **Robust Bayesian Copas selection model**, which relaxes the normality assumption for study-specific random effects. Using heavy-tailed distributions (e.g., t-distributions), the model is less sensitive to outliers and non-normal heterogeneity. It also introduces a new measure based on Hellinger distance to quantify the magnitude of publication bias, which naturally incorporates estimation uncertainty through the posterior distribution [@bai2020]. The method is implemented in the R package `RobustBayesianCopas`.

A broader Bayesian framework is **RoBMA** (Robust Bayesian Meta-Analysis), implemented in the R package `RoBMA`. RoBMA averages over multiple models that differ in their assumptions about publication bias (no bias, selection models, PET-PEESE, etc.), weighting each by its posterior probability. This model-averaging approach avoids the need to select a single correction method and naturally incorporates model uncertainty [@barto2025]. The RoBMA framework also includes the **Z-curve plot**, a visual diagnostic that overlays model-implied posterior predictive distributions on observed z-statistics to assess model fit.

Key advantages of Bayesian approaches:
- They incorporate parameter uncertainty naturally through posterior distributions.
- Model averaging (e.g., RoBMA) avoids the binary choice between competing methods.
- Heavy-tailed random-effects distributions (Robust Bayesian Copas) handle outliers better than normal assumptions.
- Quantification of bias magnitude (Hellinger distance, expected discovery rate, false discovery risk) is more informative than a binary bias/no-bias decision.

## Key Points

- Robust Bayesian Copas relaxes the normality assumption and provides a Hellinger-distance measure of bias magnitude.
- RoBMA averages across models with different bias assumptions, avoiding method-selection uncertainty.
- Bayesian approaches naturally incorporate estimation uncertainty and provide probabilistic interpretations.
- Both methods are available in R packages (`RobustBayesianCopas`, `RoBMA`).

## Related Notes

- [Copas Selection Model for Publication Bias](copas-selection-model-for-publication-bias.md)
- [Z-Curve Plot: A Visual Diagnostic for Publication Bias](z-curve-plot-a-visual-diagnostic-for-publication-bias.md)
- [Comparative Performance of Publication Bias Correction Methods](comparative-performance-of-publication-bias-correction-methods.md)
- [Publication Bias Investigation: Method Trade-Offs and Unified Workflow Guide](publication-bias-investigation-method-trade-offs-and-unified-workflow-guide.md)