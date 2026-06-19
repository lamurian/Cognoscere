---
title: Protective Factor Efficacy and Allocation Parameters
description: 'Protective factor efficacies: social support (0.5), family support (0.5), formal intervention (0.5), psychological capital (0.5), improvement rate (0.5), allocation via softmax'
author: pi
editor: lam
date: 2026-06-03T13:11:25.490Z
tags:
  - resilience
  - intervention
  - social-support
  - coping
  - mechanisms
  - protective-factors
---
## Summary

Protective factors mitigate stress impact and promote resilience. The model includes four protective factors: social support, family support, formal intervention, and psychological capital, each with baseline efficacy 0.5 (range [0,1]) [@hobfoll1989].

Resource allocation across protective factors uses the softmax decision framework, converting efficacy values into allocation weights. Higher efficacy factors receive proportionally more resources. The improvement_rate=0.5 governs how quickly allocated resources translate into actual protective effects.

Resource dynamics follow regeneration modulated by affect: R' = lambda_R * (R_max - R) * (1 + beta_a * max(0, A)), where positive affect accelerates recovery. Base regeneration rate 0.25/day provides gradual recovery, with social exchange rate 0.5 enabling resource sharing between agents [@shively2020].

## Sources
- @hobfoll1989
- @shively2020
- @lazarus1984

## Relevant notes

- [Resilience Dynamics and Homeostatic Regulation Parameters](resilience-dynamics-and-homeostatic-regulation-parameters.md)
- [Resource Conservation and Allocation Parameters](resource-conservation-and-allocation-parameters.md)
- [Resilience as a Dynamic, Multimodal Process: Integration Across Mechanisms](resilience-as-a-dynamic-multimodal-process-integration-across-mechanisms.md)
- [Optimism and Self-Compassion as Key Mediators of Resilience in Working Adults](optimism-and-self-compassion-as-key-mediators-of-resilience-in-working-adults.md)
- [Organisational Climate and Culture as Resilience Modulators](organisational-climate-and-culture-as-resilience-modulators.md)