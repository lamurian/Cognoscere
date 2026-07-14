---
title: 'MAD-Based Outlier Detection: Thresholds and Modified Z-Score'
description: Modified Z-score using MAD, recommended thresholds from Iglewicz & Hoaglin (3.5), Leys et al. (3 MAD), and Feature-engine (3.29 MAD).
author: pi
editor: lam
date: 2026-07-14T15:01:48.742Z
tags:
  - statistics
  - data-science
  - methodology
---
The modified Z-score replaces the mean and standard deviation with robust counterparts: M_i = 0.6745 * (x_i - median(x)) / MAD. The constant 0.6745 (equal to 1/1.4826) standardises the MAD to the same scale as the standard deviation under normality. Iglewicz and Hoaglin (1993) recommend that observations with |M_i| > 3.5 be labeled as potential outliers, corresponding to approximately median plus or minus 3.5 scaled MAD units [@leys2019]. This threshold is the most widely cited rule in the robust statistics literature.

Leys et al. (2013) recommend a simpler formulation: flag values beyond median plus or minus 3 MAD (using the raw, unscaled MAD). This is equivalent to checking whether |x_i - median(x)| > 3 * MAD. Under normality, this threshold corresponds to approximately median plus or minus 3 * 0.6745 sigma = plus or minus 2.02 sigma, capturing roughly 95.7% of data -- a more liberal criterion than the Iglewicz-Hoaglin rule [@leys2013].

In machine learning winsorization, Feature-engine's Winsorizer uses a default MAD multiplier of 3.29, intended to approximate three standard deviations for normal data. When using scaled MAD (MAD * 1.4826), 3.29 translates to approximately 2.22 sigma, but when using raw MAD the threshold is 3.29 * MAD_raw. Practitioners should choose between these thresholds based on context: 3 MAD is more conservative (flags fewer values), while 2.5 MAD is more aggressive (flags more values) [@leys2019]. For pre-registered confirmatory analysis, Leys et al. (2019) recommend pre-specifying both the detection method and threshold to avoid p-hacking.

## Relevant notes

- [Winsorization Methods and Applications in Machine Learning](Resources/winsorization-methods-and-applications-in-machine-learning.md)
- [Winsorization: Definition and Origin](Resources/winsorization-definition-and-origin.md)
- [Winsorization vs Trimming](Resources/winsorization-vs-trimming.md)
- [Doi Plot and LFK Index for Publication Bias](Resources/doi-plot-and-lfk-index-for-publication-bias.md)
- [Descriptive Statistics & Data Visualisation](Resources/descriptive-statistics-data-visualisation.md)