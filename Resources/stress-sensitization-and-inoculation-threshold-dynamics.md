---
title: Stress Sensitization and Inoculation Threshold Dynamics
description: 'Two opposing mechanisms dynamically shift stress thresholds: sensitization lowers after severe stress, inoculation raises after manageable stress'
author: pi
editor: lam
date: 2026-07-03T21:03:27.571Z
tags:
  - stress
  - threshold
  - mechanisms
  - simulation
---
Stress sensitization lowers the threshold for future stress responding after severe or uncontrolled stress exposure. The kindling hypothesis [@post1992] posits that initial episodes require major life stressors, but after sensitization, progressively milder stressors trigger responses through HPA axis hyperreactivity and amygdala sensitization [@mcewen2000]. The simulation's overload detection (3 consecutive hindrance events triggering depletion) captures this coarsely, but a continuous threshold degradation term would better represent graded sensitization.

Stress inoculation (steeling) raises thresholds after moderate manageable stress [@dienstbier1989]. Manageable challenge stressors enhance coping efficacy and physiological regulation, producing higher future thresholds. This aligns with the challenge appraisal pathway where successful coping builds resilience and raises eta_eff. The simulation should parameterize both sensitization rate (gamma_sens, threshold downshift after hindrance/failure) and inoculation rate (gamma_inoc, threshold upshift after challenge/success) as individual-difference parameters [@monroe2005].

## Relevant notes

- [Neuroticism as Diathesis-Stress Threshold Modulator](Resources/neuroticism-as-diathesis-stress-threshold-modulator.md)
- [Mental Health ABM Parameter Index](Resources/mental-health-abm-parameter-index.md)
- [Stress Threshold and Appraisal Parameters](Resources/stress-threshold-and-appraisal-parameters.md)
- [Perceived Stress Scale (PSS-10) Integration in Agent-Based Simulation](Resources/perceived-stress-scale-pss-10-integration-in-agent-based-simulation.md)
- [PSS-10 Item Parameters and Dynamic Response](Resources/pss-10-item-parameters-and-dynamic-response.md)