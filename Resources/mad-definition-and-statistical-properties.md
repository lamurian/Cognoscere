---
title: 'MAD: Definition and Statistical Properties'
description: Definition, formula, consistency constant, and breakdown point of Median Absolute Deviation (MAD) as a robust scale estimator.
author: pi
editor: lam
date: 2026-07-14T15:01:48.742Z
tags:
  - statistics
  - data-science
  - methodology
---
The Median Absolute Deviation (MAD) is a robust measure of statistical dispersion, defined as the median of the absolute deviations from the data's median: MAD = median(|x_i - median(x)|) [@leys2013]. Unlike the standard deviation, which is based on deviations from the mean, the MAD uses the median as the central reference, making it highly resistant to outliers. For a dataset {2, 3, 4, 5, 100}, the median is 4, absolute deviations are {2, 1, 0, 1, 96}, and the MAD is 1 -- barely affected by the extreme value 100.

To make the MAD a consistent estimator of the population standard deviation under normality, it is scaled by a constant: MAD_scaled = 1.4826 * MAD. Under a normal distribution, E[MAD] = sigma / 1.4826, so multiplying by 1.4826 yields an asymptotically unbiased estimate of sigma [@leys2013]. The reciprocal of this constant, 0.6745, appears in the modified Z-score formula used for outlier detection.

The MAD has a breakdown point of 0.5 -- the highest possible for any scale estimator. This means that nearly 50% of the data can be replaced with arbitrarily extreme values without corrupting the MAD estimate. In contrast, the standard deviation has a breakdown point of 0: a single outlier can inflate it arbitrarily [@leys2013]. This makes the MAD the preferred scale estimator when outliers are suspected, especially in small samples where a single extreme value dominates the variance estimate. The MAD is also simple to compute and interpret, requiring only sorting and median-finding rather than moment calculations.

## Relevant notes

- [MAD-Based Outlier Detection: Thresholds and Modified Z-Score](Resources/mad-based-outlier-detection-thresholds-and-modified-z-score.md)
- [Winsorization Methods and Applications in Machine Learning](Resources/winsorization-methods-and-applications-in-machine-learning.md)
- [Winsorization: Definition and Origin](Resources/winsorization-definition-and-origin.md)
- [Frequentist vs Bayesian Philosophy](Resources/frequentist-vs-bayesian-philosophy.md)
- [Linear Algebra Essentials for Statistics](Resources/linear-algebra-essentials-for-statistics.md)