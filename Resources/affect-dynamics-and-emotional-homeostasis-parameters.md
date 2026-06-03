---
title: Affect Dynamics and Emotional Homeostasis Parameters
description: Affect dynamics integrate peer influence (alpha_p=0.1), event appraisal rate (alpha_e=0.15), and homeostatic return (lambda=0.5) toward baseline setpoint
author: pi
editor: lam
date: 2026-06-03T13:10:50.920Z
tags:
  - affect
  - emotion-regulation
  - homeostasis
  - neurobiology
  - mechanisms
  - simulation
---
## Summary

Affect dynamics in agent-based models integrate three components: peer influence from neighbors, event appraisal from daily stress processing, and homeostatic return to baseline setpoint.

Peer influence rate (alpha_p=0.1) reflects emotional contagion strength, where agent affect shifts toward neighborhood mean. Empirical studies of social networks find affect convergence rates of 0.05-0.15 per interaction, with stronger effects for negative emotions [@centola2018]. The asymmetric influence (negative differences weighted 1.5x) captures the negativity bias in emotional contagion.

Event appraisal rate (alpha_e=0.15) determines how much daily challenge/hindrance experiences shift baseline affect. Challenge events increase positive affect proportionally, while hindrance events decrease it. Homeostatic rate (lambda_affect=0.5) controls return speed toward baseline setpoint (A_0), reflecting the well-established set-point theory of affect where individuals maintain stable emotional baselines over time.

## Sources
- @centola2018
- @lazarus1984
- @friston2016

## Relevant notes

- [[resilience-as-a-dynamic-multimodal-process-integration-across-mechanisms]]
- [[psychological-resilience-mechanisms-in-working-age-population-executive-summary]]
- [[affect-regulation-framework-of-psychological-resilience]]
- [[positive-interpretation-bias-and-emotion-regulation-as-cognitive-mechanisms-of-resilience]]
- [[neurobiological-mechanisms-of-resilience-prefrontal-amygdala-circuitry-and-hpa-axis-regulation]]