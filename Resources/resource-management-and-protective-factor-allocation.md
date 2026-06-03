---
title: Resource Management and Protective Factor Allocation
description: How agents manage finite psychological resources through affect-modulated regeneration and softmax-based protective factor allocation
author: pi
editor: lam
date: 2026-06-03T13:31:26.586Z
tags:
  - resources
  - protective-factors
  - simulation
  - decision-making
  - coping
  - homeostasis
---

Resources represent finite psychological and physical capacity for coping and maintaining protective factors. The resource system implements affect-modulated regeneration, consumption during coping, and bounded rational allocation across four protective factors using a softmax decision framework.

Resource regeneration follows R' = lambda_R * (R_max - R) * (1 + beta_a * max(0, A)), where positive affect accelerates recovery toward maximum capacity. This implements the broaden-and-build theory where positive emotions expand psychological resources [@fredrickson2001]. Resource consumption occurs during coping attempts at rate determined by AGENT_RESOURCE_COST.

Protective factor allocation uses a softmax decision framework: w_f = exp(e_f / beta_softmax) / sum(exp(e_k / beta_softmax)). The four protective factors are social support, family support, formal intervention, and psychological capital, each with efficacy parameter e_f. The softmax temperature beta_softmax controls rationality: low temperatures produce near-optimal allocation to the most efficacious factor; high temperatures yield near-random distribution. This bounded rationality framework from behavioral economics captures the realistic constraint that agents cannot perfectly optimize resource allocation under stress [@simon1955a], while still directing resources toward factors that have proven effective.

Each protective factor boosts resilience toward baseline at rate theta_boost: Delta_R_p = sum(w_f * e_f * (R_0 - R_t) * theta_boost). Scoping reviews of team and individual resilience identify social support, psychological capital, and formal interventions as the most consistently supported protective factors [@chapman2018]. The softmax framework bridges the gap between rational choice theory and observed decision-making under cognitive load, making it appropriate for modeling resource-constrained agents in high-stress environments.