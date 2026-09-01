---
title: Appraisal Gamma Parameter Below Empirical Range
description: 'Analysis of appraisal gamma=3.0 vs recommended 4-6: both defensible, 3.0 produces graded appraisal consistent with empirical overlap'
author: pi
editor: lam
date: 2026-08-27T13:40:45.129Z
tags:
  - simulation
  - appraisal
  - stress
  - challenge-hindrance
  - sigmoid
---

## Summary

The appraisal sigmoid steepness parameter gamma=3.0 in .env.example is below the empirically recommended range of 4-6. The PARA knowledge base documents that gamma should be calibrated so the proportion of challenge appraisals at moderate controllability (~0.5) and overload (~0.5) yields ~50% challenge, consistent with population averages.

At gamma=3.0 with omega_c=1.0, omega_o=1.0, bias=0.0: for c=0.5, o=0.5, the appraisal score z = 1.0*0.5 - 1.0*0.5 + 0.0 = 0.0. Then chi = sigmoid(3.0 * 0.0) = sigmoid(0) = 0.50. This produces exactly 50% challenge at the midpoint, which is correct.

At gamma=6.0 (the PARA recommended value): chi = sigmoid(6.0 * 0.0) = 0.50. Same result at the midpoint.

The difference emerges away from the midpoint. At c=0.6, o=0.4 (mildly controllable): z=0.2. gamma=3.0 gives chi=sigmoid(0.6)=0.65; gamma=6.0 gives chi=sigmoid(1.2)=0.77. The higher gamma produces more decisive classification — events further from the midpoint are more clearly challenge or hindrance.

The CHSF literature [@cavanaugh2000; @podsakoff2007] suggests challenge/hindrance appraisals are moderately but not perfectly separable (r ~0.3-0.4 between them). gamma=3.0 produces graded appraisal consistent with this overlap. gamma=6.0 produces near-binary classification, which may overstate the clarity of challenge/hindrance distinction.

## Key Points

- .env value: gamma=3.0 — below PARA recommended 4-6 range
- At midpoint (c=0.5, o=0.5): both gamma=3 and gamma=6 produce 50% challenge
- Away from midpoint: gamma=6 produces more decisive classification
- gamma=3.0 produces graded appraisal — consistent with empirical overlap (r~0.3-0.4)
- gamma=6.0 produces near-binary classification — may overstate distinction
- Both are defensible; gamma=3.0 is more conservative

## Sources

- [@cavanaugh2000] — challenge-hindrance framework
- [@podsakoff2007] — meta-analytic CHSF evidence