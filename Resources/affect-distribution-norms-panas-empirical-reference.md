---
title: 'Affect Distribution Norms: PANAS Empirical Reference'
description: Empirical means and SDs for positive and negative affect from PANAS validation studies for simulation calibration
author: pi
editor: lam
date: 2026-06-16T15:41:31.787Z
tags:
  - psychology
  - affect
  - empirical
  - reference
---
The Positive and Negative Affect Schedule (PANAS, Watson, Clark & Tellegen 1988) [@watson1988] is the standard instrument for measuring affect. On the 1-5 scale (1=very slightly, 5=extremely), normative means for general adult samples are: Positive Affect (PA) ~3.0-3.5 (SD ~0.7-0.8), Negative Affect (NA) ~1.5-2.0 (SD ~0.6-0.8). The original validation (N=660, undergraduate sample) reported PA mean = 3.14 (SD=0.68) and NA mean = 1.85 (SD=0.68) for the generalised temporal instruction (past few weeks). Time frames matter: state PANAS (momentary) produces modestly lower means than trait PANAS.

For mapping to a unified [-1,1] affect continuum: a linear mapping from the 1-5 PANAS scale to [-1,1] would centre near 0 for NA (since 1.5-2.0 on 1-5 maps to approximately -0.75 to -0.5 on [-1,1]) and near 0 to 0.5 for PA (3.0-3.5 maps to approximately 0 to 0.25). A bipolar valence scale typically centres near zero with slight positive skew (most people report slightly positive affect).

For simulation: population affect valence can be modelled as a normal distribution with mean ~0.1-0.2, SD ~0.3-0.4 on [-1,1], consistent with the mild positivity bias documented in affect research (Diener & Diener 1996). The correlation between perceived stress and affect is r approximately -0.35 to -0.50 for a unified valence scale [@acoba2024].

## Sources
- [@watson1988] Watson, D., Clark, L. A., & Tellegen, A. (1988). Development and validation of brief measures of positive and negative affect: The PANAS scales. Journal of Personality and Social Psychology, 54(6), 1063-1070.
- [@acoba2024] Acoba, E. F. (2024). Social support, perceived stress, and positive affect in a Filipino adult sample. Current Psychology, 43, 4230-4241.
- Diener, E., & Diener, C. (1996). Most people are happy. Psychological Science, 7(3), 181-185.

## Existing Notes
- [[stress-and-affect-empirical-correlations]]
- [[pss-10-item-level-descriptive-statistics]]

## Relevant notes

- [[stress-and-affect-empirical-correlations]]
- [[challenge-hindrance-appraisal-distributions-empirical-reference]]
- [[resource-distribution-norms-cor-theory-empirical-reference]]
- [[pss-10-item-level-descriptive-statistics]]
- [[resilience-distribution-norms-cd-risc-empirical-reference]]