---
title: Winsorization Thresholds and Rule-of-Thumb Guidelines
description: 'Practical guidelines for choosing winsorization thresholds: distribution shape considerations, MAD vs IQR vs Gaussian, and cautions.'
author: pi
editor: lam
date: 2026-07-14T15:01:48.742Z
tags:
  - statistics
  - data-science
  - methodology
  - machine-learning
---
There is no universally correct winsorization threshold -- the choice depends on distribution shape, sample size, and analytical goals. The following rules of thumb help guide the decision.

For approximately normal data, the Gaussian method (mean plus or minus 3 SD) captures 99.7% of data, capping about 0.3% in each tail. The MAD-equivalent threshold using scaled MAD is median plus or minus 3.29 * MAD_scaled (or plus or minus 4.45 * MAD_raw). For symmetric but heavy-tailed distributions, the IQR method with a 1.5 multiplier is standard, capping values beyond Q1 minus 1.5 IQR or Q3 plus 1.5 IQR. For highly skewed distributions, the quantile method (e.g., capping at the 1st and 99th percentiles) avoids distributional assumptions entirely [@wicklin2017].

Leys et al. (2019) recommend the MAD method as the default for univariate outlier detection due to its 0.5 breakdown point, with a threshold of 3 MAD (moderate) or 2.5 MAD (aggressive). The Iglewicz-Hoaglin modified Z-score threshold of 3.5 is recommended when a more conservative criterion is desired. A common heuristic is to cap no more than 5% of data in each tail; if more than 5% are flagged, the distribution may be genuinely heavy-tailed and winsorization may be inappropriate [@wicklin2017].

For machine learning pipelines, tree-based models (random forests, gradient boosting) are naturally robust to outliers and rarely benefit from winsorization. For linear models, start with a moderate threshold (3 MAD or 99th percentile) and compare model performance across a sensitivity range. Tukey warned that indiscriminate winsorization invalidates standard errors and confidence intervals, as the tails of a distribution carry meaningful information about variability [@wicklin2017]. Always report both the method and threshold used.

## Relevant notes

- [Winsorization Methods and Applications in Machine Learning](Resources/winsorization-methods-and-applications-in-machine-learning.md)
- [MAD-Based Outlier Detection: Thresholds and Modified Z-Score](Resources/mad-based-outlier-detection-thresholds-and-modified-z-score.md)
- [Winsorization: Definition and Origin](Resources/winsorization-definition-and-origin.md)
- [Winsorization vs Trimming](Resources/winsorization-vs-trimming.md)
- [Fail-Safe N and Orwin's Fail-Safe N](Resources/fail-safe-n-and-orwin-s-fail-safe-n.md)