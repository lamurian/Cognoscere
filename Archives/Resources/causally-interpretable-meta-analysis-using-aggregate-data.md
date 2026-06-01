---
author: Lam
date: 2025-03-26T11:06:10+01:00
title: Causally interpretable meta-analysis using aggregate data
---

- Problem with meta-analysis: Trials' population differs from the target population
- Solution:
  - Assume the trials' populations are similar as the target population.
  - Directly estimate treatment effects from the target population $\to$ This may subject to confounding issues.
  - Current topic: Transport treatment effects from trials to the target population.
- Causal estimand in a target population:
  - No unmeasured confounding, positivity, consistency
  - Transportability
  - Population overlap between trials and target population 
- Standard meta-analysis faces challenges, thus it is intransportable:
  - Ecological bias by ignoring within-trial heterogeneity
  - Large variance due to similar trial-level covariates
  - Non-collapsibility when using non-linear link function
- Key assumptions:
  - Shared conditional average treatment effect (CATE) across trials and target population
  - Population overlap between trials and target population
- With this approach, we can transport the trials findings to the target population by enumerating all available confounders in the target population
