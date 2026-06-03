---
title: PSS-10 Item Parameters and Dynamic Response
description: PSS-10 item means (1.5-2.4), SDs (0.8-1.3), overload/controllability loadings, bifactor SD=1.0, correlation rho=-0.3, threshold=27, sensitivity=0.5, momentum=0.3
author: pi
editor: lam
date: 2026-06-03T13:11:07.316Z
tags:
  - psychological-assessment
  - stress
  - clinical-psychology
  - measurement
  - simulation
  - research
---
## Summary

The PSS-10 integration provides validated stress measurement within the simulation. Item-level parameters from normative data show per-item means ranging 1.5-2.4 and SDs 0.8-1.3 [@liu2020]. Factor loadings differentiate overload items (items 1,2,3,6,9,10) from controllability items (items 4,5,7,8).

Bifactor dimension generation uses multivariate normal distribution with dimension SDs of 1.0 and bifactor correlation rho_psi=-0.3, representing the inverse relationship between perceived overload and perceived controllability [@reis2017]. The PSS-10 clinical threshold of 27 (out of 40 raw score) distinguishes clinically significant stress.

Dynamic response parameters include sensitivity=0.5 (how quickly perceived stress responds to events) and momentum_weight=0.3 (autocorrelation in stress perception reflecting rumination). These parameters update controllability and overload dimensions at rate 0.05 per event, enabling gradual learning of stress patterns.

## Sources
- @cohen1983
- @liu2020
- @reis2017
- @barbosaleiker2012

## Relevant notes

- [[pss-10-bifactor-measurement-parameters-for-perceived-stress]]
- [[mmpi-2-and-sexual-orientation-measurement-limitations-and-accuracy]]
- [[affect-regulation-framework-of-psychological-resilience]]
- [[limitations-and-contradictions-in-research-on-organisational-factors-and-resilience]]
- [[agent-architectures-and-decision-making-in-agent-based-simulation]]