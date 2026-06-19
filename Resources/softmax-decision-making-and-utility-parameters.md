---
title: Softmax Decision-Making and Utility Parameters
description: Softmax temperature beta=1.0 controls exploration-exploitation balance in resource allocation; lower values produce deterministic choices, higher values more random allocation
author: pi
editor: lam
date: 2026-06-03T13:11:25.492Z
tags:
  - decision-making
  - simulation
  - bayesian
  - mechanisms
  - cognitive-modeling
---
## Summary

The softmax (or Boltzmann) decision rule converts utility values into choice probabilities, commonly used in reinforcement learning and cognitive models. The softmax function P(i) = exp(v_i / beta) / sum_j exp(v_j / beta) maps option values v_i to probabilities, with temperature parameter beta controlling stochasticity [@friston2016].

Temperature beta=1.0 represents moderate stochasticity—the default value in many cognitive models. As beta approaches 0, choices become deterministic (greedy selection of highest-value option). As beta increases beyond 1, choice distribution approaches uniform randomness.

In resource allocation, the softmax rule implements bounded rationality—agents probabilistically allocate resources proportional to perceived efficacy of each protective factor, without requiring perfect optimization [@hobfoll1989]. This captures realistic human decision-making under uncertainty and cognitive limitations.

## Sources
- @friston2016
- @hobfoll1989

## Relevant notes

- [Agent Architectures and Decision-Making in Agent-Based Simulation](agent-architectures-and-decision-making-in-agent-based-simulation.md)
- [Agent-Based Simulation for Complex Adaptive Systems — Executive Summary](agent-based-simulation-for-complex-adaptive-systems-executive-summary.md)
- [LLM-Enhanced Agents and the Future of Agent-Based Modeling](llm-enhanced-agents-and-the-future-of-agent-based-modeling.md)
- [Resource Conservation and Allocation Parameters](resource-conservation-and-allocation-parameters.md)
- [Protective Factor Efficacy and Allocation Parameters](protective-factor-efficacy-and-allocation-parameters.md)