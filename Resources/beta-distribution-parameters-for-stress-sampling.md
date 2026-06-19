---
title: Beta Distribution Parameters for Stress Sampling
description: Beta distribution parameters alpha=2.0, beta=2.0 produce symmetric unimodal stress sampling in [0,1]; stress decay rate delta=0.05 per day for daily stress reduction
author: pi
editor: lam
date: 2026-06-03T13:11:25.493Z
tags:
  - stress
  - statistics
  - simulation
  - methodology
  - fundamental
---
## Summary

The Beta distribution is used for stress value sampling due to its bounded support [0,1] and flexible shapes. With parameters alpha=2.0 and beta=2.0, the Beta distribution is symmetric and unimodal with mean 0.5 and variance 1/36 [@lazarus1984].

This parameterization produces stress values concentrated around 0.5 with natural variation, appropriate for modeling daily stress levels in community populations. The symmetry reflects equal probability of above-average and below-average stress days.

Stress decay rate delta=0.05 applies exponential decay S_{t+1} = S_t * (1 - delta) each day, representing natural stress dissipation when no new stressors occur. This gives a half-life of approximately 14 days for stress to return to baseline without additional events, consistent with empirical observations of stress episode duration.

## Sources
- @lazarus1984
- @cohen1983

## Relevant notes

- [Bayesian Inference](bayesian-inference.md)
- [Linear Algebra Essentials for Statistics](linear-algebra-essentials-for-statistics.md)
- [Frequentist vs Bayesian Philosophy](frequentist-vs-bayesian-philosophy.md)
- [Simulation Orchestration and Output Parameters](simulation-orchestration-and-output-parameters.md)
- [Regression: Frequentist vs Bayesian Comparison](regression-frequentist-vs-bayesian-comparison.md)