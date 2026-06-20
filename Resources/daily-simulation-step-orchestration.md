---
title: Daily Simulation Step Orchestration
description: 'The temporal sequence of each simulation day: Poisson subevent generation, stress processing, social interaction, state updates, and daily reset'
author: pi
editor: lam
date: 2026-06-03T13:31:26.587Z
tags:
  - simulation
  - methodology
  - mechanisms
  - architecture
  - complex-systems
---

Each simulation day follows a structured sequence that integrates all mechanism groups in proper temporal order. The daily loop is the fundamental time step, processing both stress events and social interactions using Poisson sampling for subevent generation.

The day begins with initialization: capturing pre-update affect and resilience values, obtaining neighbor emotional states for social computation, and resetting daily accumulators. Subevent count is drawn from a Poisson distribution: n_s ~ max(Poisson(lambda_s), 1), ensuring at least one event per day. Poisson processes are standard for modeling discrete event occurrences in continuous time, providing a principled way to generate variable daily stressor counts [@newman1999].

Each subevent randomly selects between a stress event and a social interaction. Stress events follow the appraisal pipeline: generate event attributes (controllability, overload), compute challenge/hindrance appraisal, evaluate threshold, determine coping success, and apply state updates. Social interactions process mutual influence between neighboring agent pairs, computing affect changes with negativity bias amplification.

Daily integration normalizes challenge and hindrance values by event count: bar_chi_d = (1/n_e) * sum(chi_i), bar_zeta_d = (1/n_e) * sum(zeta_i). These daily averages then feed into the dynamics update equations. Homeostatic adjustment applies natural pull toward baseline equilibrium for affect and resilience, while stress decays exponentially: S_{t+1} = S_t * (1 - delta_stress). This temporal structure mirrors the Ecological Momentary Assessment paradigm used in clinical research, where daily fluctuations in stress and affect are captured through repeated sampling [@cohen1983].

The day concludes with reset procedures: clearing subevent tracking variables, storing daily summaries for the data collector, and preparing for the next timestep. This structured sequence ensures proper mechanism integration while maintaining computational efficiency for large-scale simulations.