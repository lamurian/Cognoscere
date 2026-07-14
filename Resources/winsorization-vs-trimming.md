---
title: Winsorization vs Trimming
description: Key differences between winsorization (capping) and trimming (deleting) extreme values, and when each is appropriate.
author: pi
editor: lam
date: 2026-07-14T14:51:39.500Z
tags:
  - statistics
  - data-science
  - methodology
---
Winsorization and trimming are two distinct approaches to handling extreme values, often confused. In a trimmed estimator, extreme values are discarded; in a winsorized estimator, they are replaced by specified percentile values [@wicklin2017].

The trimmed mean discards the k smallest and k largest values, computing the mean of the remaining N minus 2k values. Extreme values have zero effect on the trimmed estimate. The winsorized mean replaces extremes with the nearest non-extreme values and computes the mean of all N modified values. Extremes still have reduced influence -- they are pulled to the threshold rather than eliminated [@wicklin2017]. The 90% winsorized mean can be expressed as a weighted average: 0.05 times the 5th percentile, 0.9 times the 10% trimmed mean, and 0.05 times the 95th percentile.

Preserving sample size is the key advantage of winsorization over trimming. In multivariate analyses, missing values from trimming can break covariance structures and model fitting. Winsorization keeps observations intact, which is especially valuable for small datasets. However, trimming provides a cleaner estimate of central tendency when the goal is to completely eliminate any influence from the tails [@wicklin2017].

## Relevant notes

- [Winsorization: Definition and Origin](Resources/winsorization-definition-and-origin.md)
- [Publication Bias in Diagnostic Test Accuracy Meta-Analysis](Resources/publication-bias-in-diagnostic-test-accuracy-meta-analysis.md)
- [The UK England Health Index Case Study](Resources/the-uk-england-health-index-case-study.md)
- [Research Executive Summary: Approaches to Publication Bias in Meta-Analysis](Resources/research-executive-summary-approaches-to-publication-bias-in-meta-analysis.md)
- [England Health Index: Aggregation and Final Score](Resources/england-health-index-aggregation-and-final-score.md)