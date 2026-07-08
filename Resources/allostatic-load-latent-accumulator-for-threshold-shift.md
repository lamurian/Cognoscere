---
title: Allostatic Load Latent Accumulator for Threshold Shift
description: Cumulative allostatic load as a latent accumulator that progressively lowers stress thresholds when recovery is incomplete
author: pi
editor: lam
date: 2026-07-03T21:03:27.572Z
tags:
  - stress
  - threshold
  - mechanisms
  - simulation
  - allostatic-load
---
Allostatic load (AL) is the cumulative physiological dysregulation from repeated HPA axis and SAM system activation [@mcewen2000]. AL accumulates non-linearly with age: slow rise from 25, surging between 35-65, then plateauing. Critically, AL can be elevated even when subjective stress is well-managed (the healthy worker effect). The three-stage progression moves from frequent stressors burdening adaptive systems, to chronic activation producing failure to extinguish the stress response, to full dysregulation culminating in disease.

For simulation, AL can be modeled as a latent accumulator that increases when stress response exceeds recovery capacity and decays slowly otherwise. The effective threshold becomes eta_eff = eta_0 + eta_chi * chi - eta_zeta * zeta - alpha_AL * AL, where alpha_AL captures threshold-lowering. The current homeostatic return (lambda_resilience = 0.5) models single-cycle recovery but lacks a parameter for progressively incomplete recovery. Psychosocial resources buffer AL accumulation [@igboanugo2023], aligning with the simulation's protective factor mechanisms and providing empirical grounding for resource allocation reducing cumulative burden.

## Relevant notes

- [Challenge-Hindrance Stress Appraisal and Coping Pipeline](Resources/challenge-hindrance-stress-appraisal-and-coping-pipeline.md)
- [Resilience Dynamics and Homeostatic Regulation Parameters](Resources/resilience-dynamics-and-homeostatic-regulation-parameters.md)
- [Stress Sensitization and Inoculation Threshold Dynamics](Resources/stress-sensitization-and-inoculation-threshold-dynamics.md)
- [Mental Health ABM Parameter Index](Resources/mental-health-abm-parameter-index.md)
- [Neurobiological Pathways Linking Organisational Factors to Individual Resilience](Resources/neurobiological-pathways-linking-organisational-factors-to-individual-resilience.md)