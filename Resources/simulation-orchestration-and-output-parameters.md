---
title: Simulation Orchestration and Output Parameters
description: 'Simulation scale parameters: 20 agents base (scalable to 1000+), 100 max days, seed 42 for reproducibility, Watts-Strogatz k=4, p=0.1 for network topology'
author: pi
editor: lam
date: 2026-06-03T13:11:25.494Z
tags:
  - simulation
  - methodology
  - software
  - research
  - practical
---
## Summary

Simulation orchestration parameters define the macro-level structure of the agent-based model. Population size (NUM_AGENTS=20) enables rapid prototyping while scaling to 1000+ agents for production runs. Maximum simulation duration (MAX_DAYS=100) allows sufficient time for stress dynamics to stabilize and homeostatic mechanisms to operate.

The random seed (SEED=42) ensures complete reproducibility of simulation runs, critical for sensitivity analysis and replication studies. When set to null, stochastic variation across runs enables Monte Carlo uncertainty quantification.

Data collection operates through Mesa's DataCollector framework at both model and agent levels. Model-level reporters capture population averages (PSS-10, resilience, affect, stress prevalence) and network statistics. Agent-level reporters track individual trajectories for all state variables. Output frequency should be adjusted to minimize I/O overhead in large parameter sweeps, with only necessary flags enabled for production experiments.

## Sources
- @watts1998
- @centola2018

## Relevant notes

- [[skills-architecture-single-responsibility-restructure]]
- [[hierarchical-models-frequentist-vs-bayesian-comparison]]
- [[watts-strogatz-small-world-network-parameters-for-social-simulation]]
- [[digital-homelab-hardening-core-security-practices]]
- [[bayesian-computation-mcmc-and-modern-tools]]