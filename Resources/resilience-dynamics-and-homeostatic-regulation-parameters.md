---
title: Resilience Dynamics and Homeostatic Regulation Parameters
description: Resilience dynamics combine homeostatic return (lambda=0.5), challenge-hindrance effects, protective factor boosts (theta=0.1), social support (0.08), and overload detection
author: pi
editor: lam
date: 2026-06-03T13:10:50.920Z
tags:
  - resilience
  - homeostasis
  - clinical-psychology
  - neurobiology
  - mechanisms
  - simulation
---
## Summary

Resilience (R in [0,1]) represents an agent's capacity to adapt and recover from stress. The homeostatic model posits resilience naturally decays toward baseline at rate lambda_resilience=0.5 [@shively2020], while various mechanisms produce deviations.

Resilience increases from successful coping (rate=0.1) where challenge events build psychological strength. Social support interactions boost resilience (rate=0.08) through supportive exchanges with neighbors. Protective factors (social support, family support, formal intervention, psychological capital) each provide efficacy-modulated boosts toward baseline resilience at rate theta_boost=0.1.

Overload detection occurs when consecutive hindrance events exceed threshold (default 3), triggering resilience depletion. This reflects the allostatic load concept where chronic stress exposure progressively degrades adaptive capacity [@friston2016]. Resilience dynamics follow R_{t+1} = R_t + Delta_R_chi_zeta + Delta_R_p + Delta_R_o + Delta_R_s + lambda_R * (R_0 - R_t).

## Sources
- @shively2020
- @friston2016
- @lazarus1984

## Relevant notes

- [[affect-dynamics-and-emotional-homeostasis-parameters]]
- [[organisational-level-factors-as-modulators-of-individual-resilience-mechanisms-executive-summary]]
- [[neurobiological-pathways-linking-organisational-factors-to-individual-resilience]]
- [[positive-interpretation-bias-and-emotion-regulation-as-cognitive-mechanisms-of-resilience]]
- [[agent-based-simulation-for-complex-adaptive-systems-executive-summary]]