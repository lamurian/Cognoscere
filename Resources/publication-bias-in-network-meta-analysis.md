---
title: Publication Bias in Network Meta-Analysis
description: Publication bias assessment in network meta-analysis, including comparison-adjusted funnel plots and IPW approaches using trial registries
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

Network meta-analysis (NMA) faces additional challenges for publication bias assessment because bias can affect different treatment comparisons within the network differently. The primary visual tool is the **comparison-adjusted funnel plot**, which plots the difference between each study's effect estimate and the NMA estimate for that comparison against a measure of precision. Asymmetry suggests that small-study effects may differ across comparisons, potentially indicating publication bias or other biases [@sterne2011].

More recent methodological developments include an **inverse probability weighting (IPW) approach** using clinical trial registries. Huang, Zhou, and Hattori (2024) proposed a flexible IPW framework along with several t-type selection functions to handle publication bias in the NMA context. By incorporating additional information from unpublished studies identified through clinical trial registries, their method obtains more accurate estimates, higher coverage probabilities, and improved ranking of interventions compared to standard NMA [@huang2024].

Key points for NMA publication bias assessment:
- Comparison-adjusted funnel plots are the standard visual tool but can only detect certain patterns of bias.
- Standard pairwise methods (Egger, PET-PEESE) can be applied to each comparison individually, but this does not account for the network structure.
- Trial registry data provides a powerful additional source of information because it reveals studies that were conducted but never published.
- The IPW framework offers a principled way to incorporate registry data into the NMA estimation.

## Key Points

- Comparison-adjusted funnel plots are the standard visual tool for NMA publication bias.
- Recent IPW methods use clinical trial registries to adjust for bias in NMA.
- NMA bias assessment is more complex than pairwise meta-analysis because bias can affect different comparisons asymmetrically.
- Researchers should supplement comparison-adjusted funnel plots with sensitivity analyses using registry-based adjustments where possible.

## Related Notes

- [[executive-summary-comparing-publication-bias-detection-and-correction-methods]]
- [[funnel-plot-for-publication-bias-detection]]
- [[publication-bias-investigation-method-trade-offs-and-unified-workflow-guide]]