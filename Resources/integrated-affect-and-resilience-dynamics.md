---
title: Integrated Affect and Resilience Dynamics
description: The core differential equations governing how affect and resilience evolve through peer influence, event appraisal, homeostasis, and protective factors
author: pi
editor: lam
date: 2026-06-03T13:31:11.635Z
tags:
  - affect
  - resilience
  - homeostasis
  - simulation
  - mechanisms
  - emotion-regulation
---

Affect and resilience dynamics form the core of the simulation's psychological engine. Both variables evolve through multiple additive components with a homeostatic pull toward baseline, implementing a coupled dynamical system grounded in computational psychiatry.

Affect (A in [-1,1]) updates as A_{t+1} = A_t + Delta_A_p + Delta_A_e + Delta_A_h. Peer influence Delta_A_p averages affect differences with up to k_influence neighbors at rate alpha_p. Event appraisal effects Delta_A_e use daily challenge/hindrance averages: alpha_e * bar_chi_d * (1 - A_t) - alpha_e * bar_zeta_d * max(0.1, A_t + 1). Homeostasis Delta_A_h = lambda_affect * (A_0 - A_t) implements exponential decay toward baseline. Clark et al. [@clark2018] formalize mood as a slow-adapting prior that biases moment-to-moment emotional responses toward the agent's baseline, providing a computational account of why affect homeostasis emerges.

Resilience (R in [0,1]) updates as R_{t+1} = R_t + Delta_R_chizeta + Delta_R_p + Delta_R_o + Delta_R_s + lambda_resilience * (R_0 - R_t). Challenge-hindrance effects Delta_R_chizeta depend on coping outcomes. Protective factor boosts Delta_R_p = sum(e_f * (R_0 - R_t) * theta_boost) for f in {social, family, intervention, cap}. Overload effects Delta_R_o deplete resilience under chronic hindrance. Social support Delta_R_s transfers resilience from neighbors. Homeostatic return lambda_resilience * (R_0 - R_t) pulls toward baseline at rate lambda.

This architecture mirrors the Free Energy Principle where biological systems minimize variational free energy by maintaining states near homeostatic setpoints, with allostatic regulation actively adjusting setpoints based on predicted demands [@seth2016; @stephan2016]. The coupling between affect and resilience creates realistic dynamics where emotional states influence and are influenced by adaptive capacity, consistent with the allostatic triage model where energy resources are dynamically reallocated under stress [@petzschner2017].