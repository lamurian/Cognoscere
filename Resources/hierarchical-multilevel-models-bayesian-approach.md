---
title: 'Hierarchical / Multilevel Models: Bayesian Approach'
description: Bayesian hierarchical models, partial pooling, multilevel modelling with brms and PyMC with R and Python
author: pi
editor: lam
date: 2026-06-01T21:08:51.288Z
tags:
  - roadmap
  - statistics
  - advanced
  - bayesian
---
# Hierarchical / Multilevel Models: Bayesian Approach

## Overview

Bayesian hierarchical models treat every level of the hierarchy as a random variable with its own distribution. This provides a coherent framework for partial pooling, uncertainty propagation, and flexible model structures. Code in R and Python.

## 1. The Bayesian Hierarchical Model

$$y_{ij} \sim N(\mu_j, \sigma^2)$$
$$\mu_j \sim N(\gamma_0 + \gamma_1 x_{ij}, \tau^2)$$
$$\gamma_0, \gamma_1 \sim N(0, 10)$$
$$\sigma, \tau \sim \text{Half-Cauchy}(0, 2)$$

Each level has its own prior, creating a borrowing of strength: groups with small $n$ are pulled toward the population mean (partial pooling).

## 2. Advantages Over Frequentist Mixed Models

| Aspect | Frequentist (lme4) | Bayesian (brms/PyMC) |
|--------|-------------------|---------------------|
| Uncertainty | Wald intervals (normal approx) | Full posterior (any shape) |
| Complex structures | Convergence issues | MCMC handles complex hierarchies |
| Small clusters | Boundary estimates ($\tau^2 \approx 0$) | Shrinkage via prior |
| Group-level predictions | BLUPs (point estimates) | Full posterior for each $b_j$ |
| Model comparison | LRT (boundary problem) | WAIC/LOO (no boundary issue) |

## 3. Random Intercept Model — Bayesian

R (brms):
```r
library(brms)
fit_hierarchical <- brm(score ~ 1 + hours + (1 | school),
                        data = data,
                        prior = c(set_prior("normal(0, 5)", class = "b"),
                                  set_prior("cauchy(0, 2)", class = "sd"),
                                  set_prior("cauchy(0, 2)", class = "sigma")),
                        chains = 4, iter = 2000)
summary(fit_hierarchical)
ranef(fit_hierarchical)  # posterior means of random intercepts
```

Python (PyMC):
```python
import pymc as pm

with pm.Model() as hierarchical:
    # Hyper-priors (population level)
    gamma0 = pm.Normal('gamma0', 0, 10)
    gamma1 = pm.Normal('gamma1', 0, 5)
    tau = pm.HalfCauchy('tau', 2)
    
    # Group-level random effects
    b0 = pm.Normal('b0', mu=0, sigma=tau, shape=n_schools)
    sigma = pm.HalfCauchy('sigma', 2)
    
    # Linear predictor
    mu = gamma0 + b0[school_idx] + gamma1 * hours
    
    # Likelihood
    pm.Normal('y', mu=mu, sigma=sigma, observed=score)
    
    trace = pm.sample(2000, chains=4)
```

## 4. Partial Pooling — Visualised

Partial pooling shrinks group estimates toward the grand mean. The amount of shrinkage depends on:
- Group sample size $n_j$ (small $n$ = more shrinkage)
- Between-group variance $\tau^2$ (small $\tau$ = more shrinkage)
- Within-group variance $\sigma^2$ (large $\sigma$ = more shrinkage)

$$\text{Shrinkage factor} = \frac{\tau^2}{\tau^2 + \sigma^2 / n_j}$$

## 5. Model Comparison for Hierarchical Models

R (brms):
```r
# Compare random intercept vs random slope
fit_ri <- brm(score ~ hours + (1 | school), data, ...)
fit_rs <- brm(score ~ hours + (1 + hours | school), data, ...)
loo(fit_ri, fit_rs)  # which structure fits better?
```

Python (arviz): `az.compare({"ri": trace_ri, "rs": trace_rs})`

## 6. Practical Tips

- Centring predictors helps with MCMC convergence in hierarchical models
- Non-centred parameterisation ($z \sim N(0,1)$ then $b = \tau \cdot z$) improves sampling efficiency
- Use weakly informative priors on variance components: $\tau \sim \text{Half-Cauchy}(0, 2)$ or $\text{Exponential}(1)$
- Check R-hat for all group-level parameters (they can be slow to converge)

## References

- McElreath, R. (2020). Statistical Rethinking. 2nd ed. Chapters 12-14.
- Gelman, A. & Hill, J. (2007). Data Analysis Using Regression and Multilevel/Hierarchical Models. Cambridge.
- Bürkner, P.C. (2017). "brms: An R Package for Bayesian Multilevel Models." Journal of Statistical Software, 80(1): 1-28.

## Relevant notes

- [[hierarchical-multilevel-models-frequentist-approach]]
- [[hierarchical-models-frequentist-vs-bayesian-comparison]]
- [[experimental-design-anova-frequentist-vs-bayesian-comparison]]
- [[regression-frequentist-vs-bayesian-comparison]]