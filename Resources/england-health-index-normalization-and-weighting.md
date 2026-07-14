---
title: 'England Health Index: Normalization and Weighting'
description: How the England Health Index normalizes indicators and assigns weights across domains and subdomains.
author: pi
editor: lam
date: 2026-07-14T14:03:13.436Z
tags:
  - health
  - index
  - methodology
  - statistics
  - uk
  - measurement
  - composite-indicator
---
The England Health Index applies a multi-step normalization and weighting process. **Data imputation** handles missing values: indicators absent for a given year are imputed as constant from the closest available year; interim missing years are imputed as the average of surrounding years. **Data transformation** minimizes skewness and kurtosis: for each indicator, the transformation (log, square root, or none) that achieves absolute skewness below 2 and kurtosis below 3.5 is selected. 40 of 58 indicators required transformation, with 18 log-transformed. Later versions replaced heavy transformations with winsorization [@frenisterrantino2022].

**Normalization** uses population-weighted z-scores anchored to the 2015 baseline year. For each indicator i, the z-score is calculated as z_cit = (-1)^delta_i * (y_cit - mu_i) / sigma_i, where delta_i indicates direction (0 for positive, 1 for negative health orientation), and mu_i and sigma_i are the population-weighted mean and standard deviation in the baseline year. These z-scores are then translated to a scale where H = 100 + 10*z, so a score of 100 means the area matches the national baseline average [@frenisterrantino2022].

**Weighting** uses time-series factor analysis at the subdomain level. For each subdomain, a single-factor model is fitted across all years jointly using maximum likelihood estimation. The first factor loadings (absolute values) become indicator weights, scaled to sum to 1 within each subdomain. This approach accounts for correlations between indicators within the same subdomain, preventing double-counting. Subdomains and domains receive equal weights (weighted arithmetic mean) [@frenisterrantino2022].

## Relevant notes

- [The UK England Health Index Case Study](Resources/the-uk-england-health-index-case-study.md)
- [England Health Index: Overview and Architecture](Resources/england-health-index-overview-and-architecture.md)
- [Composite Index Construction Methodology for Health Indices](Resources/composite-index-construction-methodology-for-health-indices.md)
- [National Health Index Research Synthesis](Resources/national-health-index-research-synthesis.md)
- [Recommended Approach for a National Health Index](Resources/recommended-approach-for-a-national-health-index.md)