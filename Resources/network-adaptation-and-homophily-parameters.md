---
title: Network Adaptation and Homophily Parameters
description: Network adaptation triggers after 3 stress breaches; homophily strength 0.7 balances similarity vs support effectiveness; rewire probability 0.01 per interaction
author: pi
editor: lam
date: 2026-06-03T13:11:25.488Z
tags:
  - network
  - simulation
  - emergence
  - complex-systems
  - mechanisms
---
## Summary

Network adaptation allows agents to modify their social connections in response to chronic stress. Adaptation triggers when stress breach count c_breach >= adaptation_threshold (eta_adapt=3), where c_breach tracks the cumulative count of perceived stress exceeding effective threshold [@centola2018].

Connection preferences use similarity function s_ij = 1 - (|A_i - A_j| + |R_i - R_j|)/2, measuring emotional proximity between agents in affect (A) and resilience (R) space. Connection retention probability p_keep = s_ij * delta_homophily + e_s * (1 - delta_homophily) balances homophily (delta_homophily=0.7) against support effectiveness.

The high homophily weight (0.7) reflects empirical findings that individuals preferentially maintain connections with similar others. Rewiring probability 0.01 per interaction represents gradual network restructuring, with agents disconnecting from unsupportive ties and connecting to more supportive or similar agents.

## Sources
- @centola2018
- @watts1998

## Relevant notes

- [Agent-Based Simulation for Complex Adaptive Systems — Executive Summary](agent-based-simulation-for-complex-adaptive-systems-executive-summary.md)
- [Agent Architectures and Decision-Making in Agent-Based Simulation](agent-architectures-and-decision-making-in-agent-based-simulation.md)
- [Watts-Strogatz Small-World Network Parameters for Social Simulation](watts-strogatz-small-world-network-parameters-for-social-simulation.md)
- [Simulation Orchestration and Output Parameters](simulation-orchestration-and-output-parameters.md)
- [Spatial, Network, and Temporal Structures in Agent-Based Simulation](spatial-network-and-temporal-structures-in-agent-based-simulation.md)