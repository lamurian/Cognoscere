---
title: Neuroticism as Diathesis-Stress Threshold Modulator
description: 'Neuroticism modulates stress thresholds: high N + stress sensitizes, low N + stress inoculates — should be a simulation parameter'
author: pi
editor: lam
date: 2026-07-03T21:01:40.993Z
tags:
  - stress
  - threshold
  - individual-differences
  - mechanisms
  - simulation
---
Neuroticism is the primary individual-difference variable modulating stress thresholds in the diathesis-stress framework. Allen et al. [@allen2021] showed that neuroticism interacts with pretreatment life events to predict antidepressant response: high neuroticism plus stress reduced response probability by ~20% (OR = 0.62), while low-neuroticism individuals showed the opposite — pretreatment stress predicted better outcomes, consistent with stress inoculation. Conscientiousness independently buffered against independent stressors (beta = 1.16, OR = 3.20).

These findings show that individual differences determine whether stress exposure sensitizes or inoculates. For simulation, a neuroticism trait parameter should modulate baseline threshold eta_0, sensitization rate gamma_sens, and inoculation rate gamma_inoc. High-neuroticism agents start with lower eta_0 and larger gamma_sens; low-neuroticism agents start with higher eta_0 and larger gamma_inoc. The current sigmoid/tanh agent initialization can capture this variation if neuroticism is explicitly added to the baseline state vector.

## Relevant notes

- [Social Interaction and Emotional Contagion Parameters](Resources/social-interaction-and-emotional-contagion-parameters.md)
- [Resilience Dynamics and Homeostatic Regulation Parameters](Resources/resilience-dynamics-and-homeostatic-regulation-parameters.md)
- [Why Agent-Based Simulation Suits Psychological Resilience Modeling](Resources/why-agent-based-simulation-suits-psychological-resilience-modeling.md)
- [Mental Health ABM Parameter Index](Resources/mental-health-abm-parameter-index.md)
- [Challenge-Hindrance Stress Appraisal and Coping Pipeline](Resources/challenge-hindrance-stress-appraisal-and-coping-pipeline.md)