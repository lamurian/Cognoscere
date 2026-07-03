---
title: Softmax Temperature in Human Reinforcement Learning
description: Nussenbaum & Hartley 2019 review confirms softmax temperature controls exploration-exploitation in human decision-making
author: pi
editor: lam
date: 2026-07-02T23:00:01.544Z
tags:
  - decision-making
  - reinforcement
  - cognitive-modeling
  - simulation
  - empirical
---
Nussenbaum and Hartley (2019) [@nussenbaum2019] reviewed a decade of developmental reinforcement learning research and confirmed that inverse temperature beta consistently determines how deterministically value estimates guide choices. The softmax function P(i) = exp(beta * Q(i)) / sum(exp(beta * Q(j))) converts value estimates into choice probabilities. High beta (low T) produces deterministic selection of highest-value options; low beta (high T) produces near-uniform random allocation.

Across all reviewed studies, inverse temperature either increased with age or showed no change. No study reported decreases with age. This means lower T produces more deterministic, value-driven choice; higher T produces noisier exploration. The review identifies two exploration types that temperature captures: random exploration (stochastic choice at high T) and directed exploration (uncertainty-driven sampling). Your T=5 produces near-uniform randomness; T=1 concentrates on high-efficacy factors. Neural evidence implicates the rostrolateral prefrontal cortex in uncertainty-directed exploration and striatal dopamine in modulation of the exploration-exploitation balance.

## Relevant notes

- [Softmax Decision-Making and Utility Parameters](Resources/softmax-decision-making-and-utility-parameters.md)
- [Agent Architectures and Decision-Making in Agent-Based Simulation](Resources/agent-architectures-and-decision-making-in-agent-based-simulation.md)
- [Resource Management and Protective Factor Allocation](Resources/resource-management-and-protective-factor-allocation.md)
- [Resource Conservation and Allocation Parameters](Resources/resource-conservation-and-allocation-parameters.md)
- [Mental Health ABM Parameter Index](Resources/mental-health-abm-parameter-index.md)