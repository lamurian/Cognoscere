---
title: Mesa-Based Simulation Architecture and Data Collection Framework
description: The Mesa agent-based modeling framework with dual-class architecture, Watts-Strogatz small-world network, and DataCollector for comprehensive analysis
author: pi
editor: lam
date: 2026-06-03T13:31:26.586Z
tags:
  - simulation
  - architecture
  - network
  - methodology
  - software
  - complex-systems
---

The simulation is built on Mesa, Python's agent-based modeling framework, with a dual-class architecture separating agent behaviors (ResilienceAgent) from model orchestration (ResilienceModel). Mesa provides a standardized structure for agent scheduling, environment management, and data collection, making it the most widely used ABM framework in the Python ecosystem [@masad2015; @kazil2020].

The network structure uses Watts-Strogatz small-world topology, providing realistic social connection patterns with both local clustering and short path lengths. The Watts-Strogatz model generates graphs with high clustering coefficients (typical of real social networks where friends of friends are likely connected) while maintaining low characteristic path lengths (enabling rapid information or emotion spread across the population) [@newman1999]. The topology is parameterized by mean degree WS_k (must be even) and rewiring probability WS_p in [0,1]. Initial connections are constructed as a regular ring lattice then randomly rewired.

The DataCollector replaces manual tracking systems with Mesa's standardized collection. Model-level reporters capture population metrics: average PSS-10 scores, mean resilience and affect, stress prevalence, and network characteristics. Agent-level reporters track individual trajectories for all core variables: PSS-10 scores, resilience, affect, resources, current stress, event attributes, and derived metrics like recovery potential, vulnerability index, challenge-hindrance balance, and coping success rate.

Model-level coordination manages population statistics, network adaptation tracking, and cumulative social support monitoring. The orchestration ensures temporal sequencing while maintaining computational efficiency for large simulations (1000+ agents). Output configuration supports raw time series, network snapshots, and summary statistics with configurable save flags and directory structure.