---
title: Resource Conservation and Allocation Parameters
description: 'Resource dynamics follow Conservation of Resources theory: base regeneration rate 0.25/day, allocation cost 0.15, convex cost exponent 1.5, softmax temperature 1.0'
author: pi
editor: lam
date: 2026-06-03T13:10:50.920Z
tags:
  - resources
  - coping
  - behavioral
  - economics
  - simulation
  - mechanisms
---
## Summary

Conservation of Resources (COR) theory [@hobfoll1989] posits that individuals strive to protect and accumulate resources. Resources in [0,1] represent psychological capacity for coping, regenerating at rate lambda_R=0.25/day with affect modulation.

Resource allocation across protective factors uses a softmax decision framework. The allocation weight w_f = exp(e_f / beta_softmax) / sum(exp(e_k / beta_softmax)) converts protective factor efficacies into normalized allocation proportions. Softmax temperature beta=1.0 balances exploration vs. exploitation in allocation—lower values produce more deterministic allocation to high-efficacy factors, higher values produce more uniform distribution.

Resource costs follow convex cost function: cost = R_allocation_cost * allocation^R_cost_exponent where allocation_cost=0.15 and cost_exponent=1.5. This captures diminishing returns where allocating more resources becomes increasingly expensive, consistent with resource depletion models [@hobfoll1989].

## Sources
- @hobfoll1989
- @lazarus1984

## Relevant notes

- [[theoretical-frameworks-for-organisational-individual-resilience-interaction]]
- [[agent-based-simulation-for-complex-adaptive-systems-executive-summary]]
- [[psychological-resilience-mechanisms-in-working-age-population-executive-summary]]
- [[agent-architectures-and-decision-making-in-agent-based-simulation]]
- [[coping-decision-parameters-in-stress-coping-models]]