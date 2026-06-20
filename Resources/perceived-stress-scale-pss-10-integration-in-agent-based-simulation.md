---
title: Perceived Stress Scale (PSS-10) Integration in Agent-Based Simulation
description: How the PSS-10 bifactor model is implemented for empirical stress measurement, with perceived overload and controllability dimensions driving dynamic scores
author: pi
editor: lam
date: 2026-06-03T13:31:26.586Z
tags:
  - measurement
  - stress
  - simulation
  - clinical-psychology
  - psychological-assessment
---

The simulation integrates the Perceived Stress Scale-10 using a bifactor model that generates two correlated dimension scores: perceived overload and perceived controllability. This enables empirical stress measurement aligned with the validated PSS-10 psychometric structure, creating a bridge between simulated dynamics and real-world assessment instruments.

The bifactor model generates dimension scores from a multivariate normal distribution: (c_psi, o_psi) ~ N((mu_c, mu_o), Sigma) where Sigma includes variance components (sigma_c^2, sigma_o^2) and bifactor correlation rho_psi. Both scores are bounded to [0,1]. Confirmatory factor analyses consistently support a two-factor structure (perceived overload and perceived controllability) over a unidimensional model, with the bifactor correlation reflecting the shared variance between these dimensions [@liu2020]. Dimension-specific parameters control the sensitivity of each dimension to agent states and the threshold for elevation classification.

Dynamic PSS-10 scores update based on agent's current stress, resilience, and affect through a weighted integration. A momentum parameter creates temporal smoothing, preventing sudden score fluctuations. The elevation threshold classifies agents as experiencing clinically meaningful stress, enabling comparison with population norms. The original PSS validation studies established population means and standard deviations across demographic groups, providing calibration targets for simulated distributions [@cohen1983].

This integration serves dual purposes. First, it enables empirical validation by matching simulated PSS-10 distributions against epidemiological benchmarks from the research literature. Second, it creates bidirectional feedback between stress measurement and dynamics: assessment scores influence behavioral parameters (thresholds, coping probability), while agent states determine score evolution, implementing the reciprocal relationship between perceived stress and psychological functioning [@cohen1983; @harrer2018].