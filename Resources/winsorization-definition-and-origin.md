---
title: 'Winsorization: Definition and Origin'
description: Definition, origin, and basic mechanics of winsorization, a robust technique for handling outliers by capping extreme values.
author: pi
editor: lam
date: 2026-07-14T14:51:39.500Z
tags:
  - statistics
  - data-science
  - methodology
---
Winsorization (or winsorizing) is a statistical transformation that limits extreme values to reduce the effect of possibly spurious outliers [@wicklin2017]. Named after biostatistician Charles P. Winsor (1895-1951), the technique replaces extreme values with specified percentiles rather than removing them. Its effect is equivalent to clipping in signal processing.

The standard definition requires symmetric replacement: the k smallest values are replaced by the (k+1)st smallest, and the k largest by the (k+1)st largest [@wicklin2017]. In 90% winsorization, all data below the 5th percentile is set to the 5th percentile value, and data above the 95th percentile to the 95th percentile value. This preserves the total number of observations while reducing the influence of extremes on the mean and standard deviation.

Winsorization was developed to "robustify" the sample mean, which is sensitive to extreme values. For symmetric populations, the winsorized mean is a robust unbiased estimate of the population mean. The technique emerged from the robust statistics tradition championed by John Tukey, who noted that classical statistics break down under even modest outlier contamination [@wicklin2017]. Key points: replaces extremes rather than deleting them; defined symmetrically to avoid bias; preserves sample size N; also called capping in machine learning contexts.

## Relevant notes

- [National Health Index Research Synthesis](Resources/national-health-index-research-synthesis.md)
- [Recommended Approach for a National Health Index](Resources/recommended-approach-for-a-national-health-index.md)
- [The UK England Health Index Case Study](Resources/the-uk-england-health-index-case-study.md)
- [England Health Index: Normalization and Weighting](Resources/england-health-index-normalization-and-weighting.md)
- [Validation Challenges for Agent-Based Resilience Models](Resources/validation-challenges-for-agent-based-resilience-models.md)