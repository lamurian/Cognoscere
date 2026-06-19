---
title: 'Research Executive Summary: Approaches to Publication Bias in Meta-Analysis'
description: Synthesis of 12+ existing notes and 6 new research notes covering detection, correction, Bayesian approaches, and special contexts for publication bias
author: pi
editor: lam
date: 2026-06-11T23:00:57.001Z
tags:
  - meta-analysis
  - publication-bias
  - methodology
  - statistics
  - executive-summary
  - research
---

## Executive Summary

This research synthesis covers the full landscape of publication bias methods in meta-analysis, integrating 12+ existing documents with 6 new research notes that fill key gaps. Publication bias methods fall into three tiers: **visual diagnostics** (funnel plot, Doi plot, Z-curve plot), **detection tests** (Egger, Harbord, Begg, p-curve), and **sensitivity adjustments** (PET-PEESE, Copas, selection models, trim-and-fill, limit meta-analysis). No single method is sufficient — each embeds strong, untestable assumptions about the selection process. Best practice uses at least one method from each tier and presents all adjusted estimates alongside the naive summary [@sterne2011; @carpenter2009].

Recent simulation evidence confirms that **Copas and PET-PEESE are the least biased correction methods** for continuous outcomes, with PET-PEESE preferred in practice due to fewer convergence issues [@almalik2024]. However, the Copas model is **not robust against misspecification of the selection mechanism** — when the true publication process differs from the standard-error-based assumption, Copas-adjusted estimates can be as biased as naive ones [@almalik2020]. This limitation is not unique to Copas: all correction methods condition on untestable selection assumptions.

Emerging methods address several gaps. **Bayesian approaches** (Robust Bayesian Copas, RoBMA) relax normality assumptions, provide natural uncertainty quantification, and use model averaging to avoid method-selection bias [@bai2020; @barto2025]. The **Z-curve plot** offers a new visual diagnostic that directly assesses model misfit due to publication bias by comparing observed and model-implied z-statistic distributions [@barto2025]. For **network meta-analysis**, comparison-adjusted funnel plots remain standard, while new inverse-probability-weighting methods using clinical trial registries provide more rigorous adjustments [@huang2024]. For **diagnostic test accuracy meta-analysis**, trim-and-fill with log-DOR outperforms Deeks' test in simulations [@brkner2022].

## Key Findings

- **Comparative performance** — Copas and PET-PEESE are least biased; PET-PEESE preferred for robustness — [Comparative Performance of Publication Bias Correction Methods](comparative-performance-of-publication-bias-correction-methods.md)
- **Copas limitations** — Not robust when selection mechanism differs from SE-based assumption — [Copas Method Sensitivity to Selection Mechanisms](copas-method-sensitivity-to-selection-mechanisms.md)
- **Bayesian methods** — Robust Bayesian Copas and RoBMA address normality assumptions and model uncertainty — [Bayesian Approaches to Publication Bias](bayesian-approaches-to-publication-bias.md)
- **Z-curve plot** — New visual diagnostic overlaying model-implied vs observed z-statistics, with EDR, FDR, and N-missing summaries — [Z-Curve Plot: A Visual Diagnostic for Publication Bias](z-curve-plot-a-visual-diagnostic-for-publication-bias.md)
- **NMA bias assessment** — Comparison-adjusted funnel plots and IPW using trial registries — [Publication Bias in Network Meta-Analysis](publication-bias-in-network-meta-analysis.md)
- **DTA bias assessment** — Trim-and-fill with log-DOR preferred; Deeks' test has low power — [Publication Bias in Diagnostic Test Accuracy Meta-Analysis](publication-bias-in-diagnostic-test-accuracy-meta-analysis.md)

## Confidence Assessment

| Question | Confidence | Rationale |
|---|---|---|
| Q1 (WHY): Why do different methods produce divergent estimates? | High | Multiple simulation studies with consistent findings across independent teams. The core reason — each method embeds different untestable assumptions — is well-established. |
| Q2 (HOW): How should researchers select and combine methods? | High | Consistent recommendations from Cochrane, PRISMA, and methodological literature. The multi-tier workflow (visual → detection → sensitivity) is validated across reviews. |

## Known Gaps

- **Empirical validation** — There is limited evidence from prospective studies that bias-adjusted estimates are closer to the truth than naive estimates. Most evidence comes from simulations, not real-world validation.
- **Machine learning approaches** — ML-based methods for detecting or correcting publication bias are nascent. No established method yet exists.
- **Three-level and multivariate meta-analysis** — Publication bias methods for complex dependence structures (e.g., dependent effect sizes within studies) are underdeveloped.
- **Individual participant data (IPD)** — How to assess publication bias when the meta-analysis uses IPD rather than aggregate data is largely unexplored.
- **Publication bias in qualitative and mixed-methods reviews** — The framework for assessing selective reporting in non-quantitative syntheses is not well-defined.
- **Automated, integrated workflows** — While individual methods have R implementations, there is no widely adopted integrated pipeline that runs the full multi-method workflow and produces a structured sensitivity report.

## Related Notes

- [Executive Summary: Comparing Publication Bias Detection and Correction Methods](executive-summary-comparing-publication-bias-detection-and-correction-methods.md)
- [Publication Bias Investigation: Method Trade-Offs and Unified Workflow Guide](publication-bias-investigation-method-trade-offs-and-unified-workflow-guide.md)
- [Copas Selection Model for Publication Bias](copas-selection-model-for-publication-bias.md)
- [PET-PEESE for Publication Bias Correction](pet-peese-for-publication-bias-correction.md)
- [Funnel Plot for Publication Bias Detection](funnel-plot-for-publication-bias-detection.md)
- [Egger's Regression Test for Funnel Plot Asymmetry](egger-s-regression-test-for-funnel-plot-asymmetry.md)
- [Selection Models: Hedges and Vevea-Hedges Weight-Function Approach](selection-models-hedges-and-vevea-hedges-weight-function-approach.md)
- [P-Curve and P-Uniform* for Detecting Evidential Value](p-curve-and-p-uniform-for-detecting-evidential-value.md)