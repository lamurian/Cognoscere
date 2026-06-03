---
title: Coping Decision Parameters in Stress-Coping Models
description: Coping probability integrates base rate (0.5), challenge bonus (0.2), hindrance penalty (0.3), and social influence (0.1) from transactional stress theory
author: pi
editor: lam
date: 2026-06-03T13:10:50.919Z
tags:
  - coping
  - stress
  - mechanisms
  - simulation
  - emotion-regulation
  - behavioral
---
## Summary

Coping decisions in the transactional stress model involve primary appraisal (event significance) and secondary appraisal (coping resources available) [@lazarus1984]. The probability of successful coping integrates multiple factors through the function p_coping = p_b + theta_cope_challenge * chi - theta_cope_hindrance * zeta + delta_cope_soc * mean(neighbor affect).

Base coping probability (p_b=0.5) reflects the empirical finding that individuals successfully cope with approximately half of daily stressors. Challenge appraisal increases coping probability (theta_cope_challenge=0.2), while hindrance appraisal decreases it (theta_cope_hindrance=0.3). Social influence from neighbors' positive affect provides additional coping resources (delta_cope_soc=0.1).

The asymmetric effect (hindrance penalty > challenge bonus) reflects the well-established negativity bias in stress processing where negative events produce stronger psychological responses than equivalent positive events [@bakker2017]. Coping success rate of 0.5 represents a balanced starting point for community samples.

## Sources
- @lazarus1984
- @cavanaugh2000
- @bakker2017

## Relevant notes

- [[affect-regulation-framework-of-psychological-resilience]]
- [[neurobiological-mechanisms-of-resilience-prefrontal-amygdala-circuitry-and-hpa-axis-regulation]]
- [[resilience-as-a-dynamic-multimodal-process-integration-across-mechanisms]]
- [[psychological-resilience-mechanisms-in-working-age-population-executive-summary]]
- [[agent-architectures-and-decision-making-in-agent-based-simulation]]