---
title: 'Causal Inference: Frequentist vs Bayesian Comparison'
description: Comparing frequentist and Bayesian approaches to causal inference with practical guidance
author: pi
editor: lam
date: 2026-06-01T21:09:35.814Z
tags:
  - roadmap
  - statistics
  - advanced
  - comparison
---
# Causal Inference: Frequentist vs Bayesian Comparison

## Overview

Causal inference is one of the most active areas where frequentist and Bayesian approaches have distinct strengths. This note compares them side-by-side.

## 1. Core Differences

| Aspect | Frequentist | Bayesian |
|--------|------------|----------|
| Causal effect | Unknown fixed quantity | Random variable with posterior |
| Uncertainty | Sampling distribution | Posterior distribution |
| Graphs | Use DAGs to identify adjustment sets | BCNs with uncertainty over structure |
| Propensity scores | Point estimate (logistic regression) | Posterior distribution |
| Unmeasured confounding | Sensitivity analysis (bounds) | Prior on confounding strength |

## 2. Practical Guidance

### Choose Frequentist When:
- You have a large, well-designed randomised experiment (simple analysis is fine)
- You need well-established methodology for regulatory settings
- You're implementing DiD, IV, or RDD (these are well-studied in frequentist literature)
- You want to check robustness with multiple specification tests

### Choose Bayesian When:
- You have complex causal structures (many variables, DAG uncertainty)
- You need to incorporate prior experimental evidence
- You want direct probability statements ("92% probability of positive effect")
- You're working with small samples (priors regularise estimates)
- You need individual-level treatment effects (CATE) with full uncertainty

## 3. The Best of Both Worlds

Many modern causal inference methods are pragmatic: use Bayesian computation (MCMC) with frequentist evaluation (coverage, Type I error). The Target Trial Emulation framework (Hernán & Robins) is essentially a design-based approach that works with either estimation framework.

## References

- Imbens, G. & Rubin, D. (2015). Causal Inference. Cambridge.
- Hernán, M.A. & Robins, J.M. (2020). Causal Inference: What If. CRC.
- Pearl, J. (2009). Causality. 2nd ed. Cambridge.

## Relevant notes

- [Time Series Analysis: Frequentist vs Bayesian Comparison](time-series-analysis-frequentist-vs-bayesian-comparison.md)
- [Causal Inference: Frequentist Approach](causal-inference-frequentist-approach.md)
- [Model Comparison: Frequentist vs Bayesian Comparison](model-comparison-frequentist-vs-bayesian-comparison.md)
- [Descriptive Statistics & Data Visualisation](descriptive-statistics-data-visualisation.md)