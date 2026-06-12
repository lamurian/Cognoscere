---
title: 'Doi Plot vs Funnel Plot: Comparison for Publication Bias Detection'
description: Comparative analysis of Doi plot (with LFK index) and funnel plot (with Egger's test) for detecting publication bias in meta-analysis.
author: pi
editor: lam
date: 2026-06-12T05:40:02.574Z
tags:
  - meta-analysis
  - publication-bias
  - statistics
  - methodology
  - research
  - comparison
---

Both the funnel plot and the Doi plot are graphical tools for detecting publication bias (small-study effects) in meta-analysis. The table below compares them across key dimensions.

| Feature | Funnel Plot | Doi Plot |
|---|---|---|
| **Inventor / Year** | Light &amp; Pillemer (1984); formalised by Egger et al. (1997) | Furuya-Kanamori, Barendregt &amp; Doi (2018) [@furuyakanamori2018a] |
| **Axes** | X-axis: effect size (OR, RR, SMD, etc.). Y-axis: precision (1/SE) or standard error (inverted) | X-axis: effect size. Y-axis: folded normal quantile (Z-score from rankit transformation) |
| **Visual shape** | Symmetrical inverted funnel when no bias; asymmetry suggests bias | Two limbs emanating from a central peak; asymmetry appears as uneven limb length or area |
| **Quantitative companion** | Egger's regression test (or Begg's rank correlation, Thompson's test) | LFK index (Luis Furuya-Kanamori asymmetry index) |
| **Threshold for asymmetry** | Egger's p &lt; 0.05 (subjective visual inspection also common) | LFK index: < 1 = no asymmetry; 1-2 = minor; > 2 = major asymmetry (absolute value) |
| **Performance (sensitivity)** | Egger's test: 18.5-43.0% sensitivity in simulations (5-20 studies) [@furuyakanamori2018a] | LFK index: 71.3-72.1% sensitivity in same simulations [@furuyakanamori2018a] |
| **Performance (AUC)** | Egger's AUC: 0.58-0.75 across simulations [@furuyakanamori2018a] | LFK index AUC: 0.74-0.88 across simulations [@furuyakanamori2018a] |
| **Dependence on k (number of studies)** | Egger's test loses power with small k (&lt; 10 studies); high false positive with large k | LFK index claims k-independent performance; some recent simulations contest this [@schwarzer2024] |
| **Interpretation difficulty** | Moderate; asymmetry can be confused with heterogeneity | Steeper learning curve; requires understanding of folded normal quantile transformation |
| **Suitable effect measures** | Any common effect size (OR, RR, MD, SMD, log-OR, etc.) | Any effect size; especially useful for proportions (logit-transformed) [@shamim2023] |
| **Software implementation** | Stata (metabias, funnel), R (meta, metafor), RevMan, JASP, Jamovi | Stata (lfk), R (metasens::doiplot, JBI DoI), JASP module |
| **Primary critique** | Visual assessment is subjective; Egger's regression has low sensitivity and is k-dependent | LFK index may not reliably detect small-study effects in all scenarios; recent critique by Schwarzer et al. (2024) |
| **Best use case** | Established standard; quick visual check in well-powered meta-analyses (&ge; 10 studies) | Higher sensitivity in meta-analyses with few studies; recommended for proportion meta-analyses |

## Summary

The Doi plot and LFK index were designed to address the low sensitivity and k-dependence of the funnel plot and Egger's regression. Simulation studies from the original authors show substantially higher sensitivity (71% vs 19-43%) and AUC (0.74-0.88 vs 0.58-0.75) [@furuyakanamori2018a]. The Lancet Microbe has recommended Doi plots for prevalence (proportion) meta-analyses where funnel plots are inappropriate [@shamim2023].

However, a subsequent independent simulation by Schwarzer et al. (2024) found that the LFK index does not reliably detect small-study effects and its performance varies by setting. Both tools should be used as part of a broader sensitivity analysis rather than as sole arbiters of publication bias.

## References
