---
title: 'Funnel Plot Versus Doi Plot: Comparison of Visual Diagnostics'
description: 'Side-by-side comparison of funnel plot and Doi plot: structural differences, when each is preferred, and shared limitations'
author: pi
editor: lam
date: 2026-06-12T05:03:29.483Z
tags:
  - meta-analysis
  - publication-bias
  - methodology
  - statistics
---

## Summary

The funnel plot and the Doi plot are both first-line visual diagnostics for detecting small-study effects in meta-analysis. They detect the same phenomenon (asymmetry between effect size and precision) but use different transformations and provide different outputs. Neither distinguishes publication bias from other causes of asymmetry. Both require complementary detection tests and sensitivity analyses [@sterne2011; @furuyakanamori2018].

## Structural differences

| Feature | Funnel Plot | Doi Plot |
|---------|-------------|----------|
| Y-axis | Precision (1/SE) or standard error (inverted) | Folded normal quantile (Z-score transformation) |
| Shape under no asymmetry | Inverted, symmetrical funnel | Symmetrical mountain peak |
| Built-in asymmetry metric | None | LFK index (Luis Furuya-Kanamori) |
| Thresholds for concern | Subjective visual judgement | LFK < 1: none; 1–2: minor; > 2: major |
| Separate test needed | Yes — Egger, Harbord, Begg | No — LFK is the test |
| Best-performing domain | General meta-analysis (SMD, log OR, RR) | Prevalence meta-analysis (proportions, rates) |
| Minimum studies | 10 | 5 (but 10+ recommended) |

## When each is preferred

The **funnel plot** is the universal standard. Cochrane and PRISMA require it. It is well-validated across all effect size metrics (SMD, log OR, RR, RD, incidence rate ratios). Contour-enhanced versions help distinguish publication bias from other asymmetry causes by shading significance regions [@peters2008]. Use the funnel plot as the default visual diagnostic in any meta-analysis with 10+ studies.

The **Doi plot** is preferred for prevalence meta-analyses (single proportions or rates). Standard funnel plots and Egger's test perform poorly in this setting because ceiling effects near 0% or 100% induce artificial asymmetry and inflate Type I error rates. The Doi plot's folded normal transformation and the LFK index were specifically calibrated for prevalence outcomes and outperform the funnel plot + Egger combination in this domain [@barker2024].

## Common limitations shared by both

- Neither method distinguishes publication bias from heterogeneity, chance, or genuine effect-precision relationships.
- Both are **screening diagnostics**, not correction methods. They do not adjust the summary estimate.
- Both can miss bias that affects all studies equally (e.g., a constant inflation across all studies, or suppression of entire research programmes).
- Both are unreliable with very few studies (< 5–10).
- Asymmetry in either plot should trigger further investigation using regression tests and sensitivity analyses (PET-PEESE, Copas, selection models).

## Both are part of a multi-method workflow

In the recommended publication bias investigation workflow, use the funnel plot as the primary visual (required for reporting) and the Doi plot as a complementary diagnostic with a built-in quantitative benchmark. If both suggest asymmetry, proceed to regression tests (Egger/Harbord) and sensitivity corrections (PET-PEESE/Copas). If they disagree, investigate why — the cause may be the metric or the number of studies [@barker2024].

## Related Notes

- [Funnel Plot for Publication Bias Detection](funnel-plot-for-publication-bias-detection.md)
- [Doi Plot and LFK Index for Publication Bias](doi-plot-and-lfk-index-for-publication-bias.md)
- [Egger's Regression Test for Funnel Plot Asymmetry](egger-s-regression-test-for-funnel-plot-asymmetry.md)
- [Executive Summary: Comparing Publication Bias Detection and Correction Methods](executive-summary-comparing-publication-bias-detection-and-correction-methods.md)
- [Publication Bias Investigation: Method Trade-Offs and Unified Workflow Guide](publication-bias-investigation-method-trade-offs-and-unified-workflow-guide.md)