---
title: Social Interaction and Emotional Contagion Parameters
description: 'Social interaction parameters: peer influence rate 0.05-0.1, resilience influence 0.05, max neighbors 10, support effectiveness integrates neighbor resilience and affect'
author: pi
editor: lam
date: 2026-06-03T13:11:07.308Z
tags:
  - social-support
  - network
  - emotion-regulation
  - simulation
  - mechanisms
  - complex-systems
---
## Summary

Social interactions between neighboring agents enable emotional contagion and mutual support. The mutual influence mechanism computes affect change as Delta_A_i = alpha_p * (A_j - A_i) with asymmetric weighting for negative differences (1.5x versus 1.0x), reflecting stronger contagion for negative affect [@centola2018].

Peer influence rate (alpha_p=0.1) determines convergence speed between interacting agents' emotional states. Resilience influence during interactions operates at rate 0.05, transferring resilience resources between connected agents. The support effectiveness function e_s = (Resilience_j + (1+A_j)/2)/2 + 0.2 captures how neighbor characteristics determine support quality.

Resource exchange during interactions follows exchange_rate=0.5, with minimum threshold 0.2 to prevent trivial exchanges, and max exchange ratio 0.5 to limit single-interaction transfers. Social support exchange detection requires meaningful improvements exceeding threshold 0.05 across any state variable.

## Sources
- @centola2018
- @hobfoll1989
- @lazarus1984

## Relevant notes

- [[resilience-as-a-dynamic-multimodal-process-integration-across-mechanisms]]
- [[agent-based-simulation-for-complex-adaptive-systems-executive-summary]]
- [[affect-dynamics-and-emotional-homeostasis-parameters]]
- [[organisational-level-factors-as-modulators-of-individual-resilience-mechanisms-executive-summary]]
- [[theoretical-frameworks-for-organisational-individual-resilience-interaction]]