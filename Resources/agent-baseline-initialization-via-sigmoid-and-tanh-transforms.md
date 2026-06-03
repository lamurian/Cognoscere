---
title: Agent Baseline Initialization via Sigmoid and Tanh Transforms
description: How agents are initialized with baseline resilience, affect, and resources using sigmoid/tanh transformations of normal random variables
author: pi
editor: lam
date: 2026-06-03T13:31:11.632Z
tags:
  - simulation
  - agent
  - fundamental
  - methodology
  - statistics
---

Each agent in the resilience simulation is initialized with baseline values representing natural equilibrium points. These baselines are computed by transforming normal random variables through sigmoid and hyperbolic tangent functions, ensuring proper statistical distributions across the population while maintaining seeded reproducibility via SIMULATION_SEED.

Resilience baseline uses the sigmoid transformation: R_0 = sigma((X - mu_R0) / sigma_R0), where X ~ N(mu, sigma^2). This maps the normal variable to the unit interval [0,1]. With default parameters (mu=0, sigma=1), the sigmoid produces values concentrated near 0.5, reflecting that most individuals cluster around moderate resilience levels with fewer at the extremes. The sigmoid function is a standard choice for mapping continuous variables to probability spaces in computational psychometrics because of its S-shaped compression properties [@su2020].

Affect baseline uses the hyperbolic tangent: A_0 = tanh((X - mu_A0) / sigma_A0), mapping to [-1,1]. The tanh function produces values concentrated near 0, representing neutral affect as the population central tendency. Resources follow the sigmoid transformation like resilience, mapping to [0,1].

These transformations implement homeostatic setpoint theory, where each agent has a stable reference state to which dynamics return after perturbation. The allostatic self-efficacy framework formalizes this as a hierarchical Bayesian inference loop: the brain maintains prior beliefs about interoceptive states (setpoints), and deviations generate prediction errors that drive regulatory action [@stephan2016; @petzschner2017]. Seeded random number generation (SIMULATION_SEED) ensures identical initial populations across runs for reproducibility.