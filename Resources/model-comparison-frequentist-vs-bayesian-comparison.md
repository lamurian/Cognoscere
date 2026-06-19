---
title: 'Model Comparison: Frequentist vs Bayesian Comparison'
description: How to choose between frequentist and Bayesian model comparison approaches with R and Python
author: pi
editor: lam
date: 2026-06-01T21:07:29.064Z
tags:
  - roadmap
  - statistics
  - intermediate
  - comparison
---
# Model Comparison: Frequentist vs Bayesian Comparison

## Overview

Choosing between AIC/BIC and Bayes Factors/WAIC is a practical question every statistician faces. This note compares the underlying philosophies, practical trade-offs, and provides guidance on selecting the right approach.

## 1. Conceptual Differences

| Aspect | Frequentist | Bayesian |
|--------|------------|----------|
| AIC | Minimises KL divergence (predictive) | Equivalent to LOO-CV asymptotically (Stone, 1977) |
| BIC | Approximates Bayes factor for certain priors (but with $\log n$ penalty) | Not a coherent Bayesian criterion despite the name |
| Bayes factor | Not defined (parameters aren't random) | Coherent betting ratio between models |
| LOO-CV | Point estimate of out-of-sample error (needs bootstrap for uncertainty) | Full posterior distribution of elpd via PSIS |
| Model averaging | Ad-hoc (AIC weights, bootstrap) | Natural (Bayesian model averaging via posterior model probabilities) |

## 2. When They Agree

For large $n$ and well-specified models:
- BIC approximation to Bayes factor improves
- AIC and LOO-CV converge
- Both frameworks select the same model

## 3. When They Diverge

### Small to moderate $n$
Bayes factors and WAIC tend to be more conservative (favour simpler models) than AIC, because they use the full posterior rather than a point estimate.

### Model misspecification
- Frequentist criteria assume the true model is in the candidate set (or at least approximately)
- Bayesian methods are more robust because they integrate over parameter uncertainty

### Variable selection
- Frequentist lasso: single set of selected variables (depends on $\lambda$)
- Bayesian spike-and-slab: probability distribution over variable sets — richer information

## 4. Practical Decision Flowchart

```
What's your goal?
│
├─ Prediction accuracy?
│   ├─ Frequentist → CV + AIC (fast, well-understood)
│   └─ Bayesian → LOO-CV (WAIC is approximation, LOO is gold standard)
│
├─ Identify which model generated the data?
│   ├─ Frequentist → BIC (consistent selector)
│   └─ Bayesian → Bayes factors (principled, but sensitive to priors)
│
├─ Variable selection?
│   ├─ Frequentist → Lasso/glmnet (fast, scalable)
│   └─ Bayesian → Spike-and-slab / regularised horseshoe (rich inference)
│
└─ Testing a specific hypothesis?
    ├─ Frequentist → LRT (nested) or score test
    └─ Bayesian → Bayes factor (can compare non-nested models too)
```

## 5. Code: Side-by-Side Comparison

R — comparing three regression models:
```r
m1 <- lm(mpg ~ wt, data = mtcars)
m2 <- lm(mpg ~ wt + hp, data = mtcars)
m3 <- lm(mpg ~ wt * hp, data = mtcars)

# Frequentist
AIC(m1, m2, m3)   # lower = better
BIC(m1, m2, m3)   # lower = better
anova(m1, m2, m3)  # LRT for nested

# Bayesian
library(brms)
bfit1 <- brm(mpg ~ wt, data = mtcars, refresh = 0)
bfit2 <- brm(mpg ~ wt + hp, data = mtcars, refresh = 0)
bfit3 <- brm(mpg ~ wt * hp, data = mtcars, refresh = 0)
loo_compare(loo(bfit1), loo(bfit2), loo(bfit3))
waic(bfit1, bfit2, bfit3)
```

## 6. Summary

| Criterion | Model comparison type | Uncertainty measure | Sensitivity |
|-----------|----------------------|-------------------|-------------|
| AIC | Point estimate | None (or bootstrap) | Low sensitivity to priors |
| BIC | Point estimate | None | Low sensitivity |
| LRT | Nested hypothesis test | p-value | Depends on $n$ |
| Bayes factor | Full distribution | Evidence ratio | Sensitive to prior on parameters |
| WAIC | Point + SE | Effective parameters | Moderate |
| LOO-CV | Point + SE | $\hat{k}$ diagnostic | Robust (when $\hat{k} < 0.7$) |

## References

- Burnham, K.P. & Anderson, D.R. (2002). Model Selection and Multimodel Inference. 2nd ed. Springer.
- Gelman, A. et al. (2014). "Understanding predictive information criteria." Statistics and Computing, 24(6): 997-1016.
- Vehtari, A. et al. (2017). "Practical Bayesian model evaluation." Statistics and Computing, 27(5): 1413-1432.

## Relevant notes

- [Experimental Design & ANOVA: Frequentist vs Bayesian Comparison](experimental-design-anova-frequentist-vs-bayesian-comparison.md)
- [Regression: Frequentist vs Bayesian Comparison](regression-frequentist-vs-bayesian-comparison.md)
- [Frequentist vs Bayesian Philosophy](frequentist-vs-bayesian-philosophy.md)
- [Model Comparison & Selection: Bayesian Approach](model-comparison-selection-bayesian-approach.md)