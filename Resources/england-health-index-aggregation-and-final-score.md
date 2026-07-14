---
title: 'England Health Index: Aggregation and Final Score'
description: How the England Health Index aggregates indicators into subdomain, domain, and overall composite scores.
author: pi
editor: lam
date: 2026-07-14T14:03:23.226Z
tags:
  - health
  - index
  - methodology
  - statistics
  - uk
  - measurement
  - composite-indicator
---
The England Health Index uses a hierarchical arithmetic aggregation formula. At each level, the aggregate score is the weighted arithmetic mean of its components. Starting from normalized indicator values (h_cit = 100 + 10*z_cit), indicators within each subdomain are aggregated using factor-analysis weights: SubdomainScore = sum(w_i * h_i) where w_i are the normalized first-factor loadings. Subdomains within domains use equal weights: DomainScore = (1/n_subdomains) * sum(SubdomainScores). The overall Health Index combines the three domain scores also with equal weights: OverallScore = (1/3) * (PeopleScore + LivesScore + PlacesScore) [@frenisterrantino2022].

Geographic aggregation from UTLA to regional and national levels uses population-weighting. The index is calculated for each year independently but maintains comparability by anchoring normalization parameters (means, standard deviations) to the 2015 baseline year. This means changes over time reflect genuine health improvements or deteriorations rather than shifts in the reference distribution. The index produces a single comparable score for each UTLA, each of 9 English regions, and England overall [@frenisterrantino2022].

Sensitivity analysis using Monte Carlo simulation over 10,000 iterations tested alternative choices for winsorization thresholds, normalization methods (z-score vs min-max), and weighting schemes (equal, PCA, optimized). The analysis found that weighting was the largest source of ranking uncertainty, particularly for mid-ranked UTLAs, while top and bottom rankings remained stable. The assessment recommended geometric mean aggregation for future versions to penalize unbalanced domain performance [@frenisterrantino2022].

## Relevant notes

- [The UK England Health Index Case Study](Resources/the-uk-england-health-index-case-study.md)
- [National Health Index Research Synthesis](Resources/national-health-index-research-synthesis.md)
- [England Health Index: Overview and Architecture](Resources/england-health-index-overview-and-architecture.md)
- [Composite Index Construction Methodology for Health Indices](Resources/composite-index-construction-methodology-for-health-indices.md)
- [Recommended Approach for a National Health Index](Resources/recommended-approach-for-a-national-health-index.md)