---
title: Watts-Strogatz Small-World Network Parameters for Social Simulation
description: 'Literature-based parameter ranges for Watts-Strogatz small-world topology in ABM: k=4-6 nearest neighbors, p=0.1-0.3 rewiring probability'
author: pi
editor: lam
date: 2026-06-03T13:10:33.565Z
tags:
  - network
  - simulation
  - core-theory
  - fundamental
  - complex-systems
  - emergence
---
## Summary

The Watts-Strogatz small-world network model generates graphs with high clustering and short path lengths, matching properties observed in social networks [@watts1998]. Two key parameters control topology: k (each node connects to k nearest neighbors in a ring lattice) and p (rewiring probability, where 0 produces a regular lattice and 1 a random graph).

The original Watts-Strogatz formulation found small-world properties emerge for 0.01 < p < 0.1. Social simulation studies commonly use k=4-6 for mean degree and p=0.1-0.3 to maintain clustered social structure while enabling realistic path lengths [@watts1998]. The network transitions from ordered (p=0) to random (p=1) with small-world regime in between.

In agent-based models of health behavior, small-world networks with mean degree 4-8 and rewiring probability 0.05-0.2 reproduce empirical social network characteristics including homophily and transitivity. The choice of k depends on desired network density and computational constraints, with k=4 being a common minimum for connectedness.

## Sources
- @watts1998
- @centola2018

## Relevant notes

- [Agent Architectures and Decision-Making in Agent-Based Simulation](agent-architectures-and-decision-making-in-agent-based-simulation.md)
- [Agent-Based Simulation for Complex Adaptive Systems — Executive Summary](agent-based-simulation-for-complex-adaptive-systems-executive-summary.md)
- [Spatial, Network, and Temporal Structures in Agent-Based Simulation](spatial-network-and-temporal-structures-in-agent-based-simulation.md)
- [Frequentist vs Bayesian Philosophy](frequentist-vs-bayesian-philosophy.md)
- [Why Agent-Based Simulation Excels Over Equation-Based Approaches for Complex Adaptive Systems](why-agent-based-simulation-excels-over-equation-based-approaches-for-complex-adaptive-systems.md)