---
title: Resource Base Regeneration Rate Empirical Validation
description: Empirical validation showing resource regeneration 0.50/day exceeds the 0.20-0.30/day range from COR recovery literature
author: pi
editor: lam
date: 2026-08-27T13:40:45.128Z
tags:
  - simulation
  - resources
  - empirical
  - conservation-of-resources
  - recovery
---

## Summary

The resource base regeneration rate of 0.50/day in .env.example is outside the empirically supported range of 0.20-0.30/day. This discrepancy requires correction.

COR theory [@hobfoll2001] and recovery experience literature provide the empirical basis. Zohar et al. [@zohar2003] found psychological resources recover to baseline within 2-3 hours of non-work activities (evening recovery). Sonnentag & Fritz [@sonnentag2007] identified psychological detachment as requiring 2-3 hours daily for full resource regeneration.

The PARA knowledge base documents: daily resource_base_regeneration ~0.2-0.3 on [0,1] over a waking period is consistent with evening recovery literature, meaning ~20-30% of depleted resources are restored per day of normal activity (no additional acute stress). Higher regeneration rates (~0.4-0.6) apply during weekends.

The .env.example value of 0.50 corresponds to weekend-level recovery, not typical weekday recovery. For a general population simulation, 0.25/day (the value in the Resource Conservation and Allocation Parameters note) is the most defensible default.

The affect-modulated regeneration formula R' = lambda_R * (R_max - R) * (1 + beta_a * max(0, A)) means the effective rate depends on current affect. At neutral affect (A=0), the rate equals lambda_R. At positive affect (A>0), the rate is boosted. This means lambda_R=0.25 with positive affect modulation can reach 0.35-0.40 on good days, which is realistic.

## Key Points

- .env.example value: 0.50/day — **outside empirical range**
- Empirical range: 0.20-0.30/day (COR recovery literature) [@zohar2003; @sonnentag2007]
- Recommended value: 0.25/day (consistent with weekday evening recovery)
- Weekend recovery: 0.40-0.60/day (higher, but not the default scenario)
- Affect modulation: positive affect boosts effective rate by 20-50%
- COR loss asymmetry: loss spirals reduce resources at 5-15%/month without recovery [@hobfoll2001]

## Sources

- [@hobfoll2001] — COR theory loss asymmetry
- [@zohar2003] — evening recovery: resources restore in 2-3 hours
- [@sonnentag2007] — psychological detachment recovery experiences
- [@hobfoll2002] — resource caravans and adaptation