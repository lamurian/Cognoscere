---
title: Agent Initialization State Parameters
description: 'Agent initialization: resilience ~ N(mu=0, sigma=1) sigmoid-transformed; affect ~ N(mu=0, sigma=1) tanh-transformed; resources ~ N(mu=0, sigma=1) sigmoid-transformed'
author: pi
editor: lam
date: 2026-06-03T13:11:07.314Z
tags:
  - simulation
  - statistics
  - methodology
  - fundamental
  - research
---
## Summary

Agent initialization parameters define baseline distributions for core state variables using mathematical transformations of normal random variables X ~ N(mu, sigma^2).

Resilience (Resilience_0 = sigmoid((X - mu_R0)/sigma_R0)) maps a normal variable to [0,1] via sigmoid transformation. Affect (A_0 = tanh((X - mu_A0)/sigma_A0)) maps to [-1,1] via hyperbolic tangent. Resources (R_0 = sigmoid((X - mu_R0)/sigma_R0)) maps to [0,1] via sigmoid.

Default means of 0.0 and SDs of 1.0 produce approximately uniform distributions in the transformed spaces. The sigmoid transformation concentrates values near 0.5 for resilience/resources, while tanh concentrates near 0 for affect, reflecting typical population distributions.

This initialization assigns each agent a stable baseline (setpoint) that homeostatic mechanisms pull toward. The seeding mechanism (SIMULATION_SEED=42) ensures reproducibility by controlling the random number generator [@shively2020].

## Sources
- @shively2020
- @friston2016

## Relevant notes

- [Agent-Based Simulation for Complex Adaptive Systems — Executive Summary](agent-based-simulation-for-complex-adaptive-systems-executive-summary.md)
- [Spatial, Network, and Temporal Structures in Agent-Based Simulation](spatial-network-and-temporal-structures-in-agent-based-simulation.md)
- [Agent Architectures and Decision-Making in Agent-Based Simulation](agent-architectures-and-decision-making-in-agent-based-simulation.md)
- [Watts-Strogatz Small-World Network Parameters for Social Simulation](watts-strogatz-small-world-network-parameters-for-social-simulation.md)
- [Resources — Agent Guidelines](AGENTS.md)