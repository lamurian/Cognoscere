---
title: Stress Threshold and Appraisal Parameters
description: 'Stress threshold parameters: base threshold 0.5, challenge scale 0.15 (protective), hindrance scale 0.25 (vulnerability), alpha_challenge=0.8, alpha_hindrance=1.2, delta=0.2'
author: pi
editor: lam
date: 2026-06-03T13:11:07.312Z
tags:
  - stress
  - appraisal
  - threshold
  - mechanisms
  - simulation
  - coping
---
## Summary

The stress threshold system determines when an agent transitions into a stressed state. Effective threshold eta_eff = eta_0 + eta_chi * chi - eta_zeta * zeta combines base threshold (eta_0=0.5) with challenge (eta_chi=0.15) and hindrance (eta_zeta=0.25) adjustments [@cavanaugh2000].

Challenge appraisal increases the effective threshold (protective effect), making agents more resilient to subsequent stressors. Hindrance appraisal decreases the threshold (vulnerability effect), increasing stress susceptibility. The asymmetry (hindrance scale > challenge scale) reflects stronger negative impact, consistent with negativity bias in stress literature [@podsakoff2023].

Appraised stress computation uses alpha parameters: alpha_challenge=0.8 reduces stress for challenge-appraised events, alpha_hindrance=1.2 amplifies stress for hindrance events, and delta=0.2 provides the transition bandwidth. The secondary threshold system uses stress_threshold=0.7 and affect_threshold=0.3 for detecting stressed states based on combined stress and affect indicators.

## Sources
- @cavanaugh2000
- @podsakoff2023
- @lazarus1984

## Relevant notes

- [[coping-decision-parameters-in-stress-coping-models]]
- [[resilience-dynamics-and-homeostatic-regulation-parameters]]
- [[pss-10-item-parameters-and-dynamic-response]]
- [[challenge-hindrance-appraisal-framework-parameters]]
- [[psychological-resilience-mechanisms-in-working-age-population-executive-summary]]