---
title: 'Linear & Logistic Regression: Bayesian Approach'
description: Bayesian linear regression, priors on coefficients, posterior inference, prediction with R and Python using brms and PyMC
author: pi
editor: lam
date: 2026-06-01T21:06:38.705Z
tags:
  - roadmap
  - statistics
  - intermediate
  - bayesian
---
# Linear & Logistic Regression: Bayesian Approach

## Overview

Bayesian regression places prior distributions on the regression coefficients and estimates the posterior distribution of coefficients given the data. This provides full uncertainty quantification, natural regularisation through priors, and straightforward prediction intervals. Code examples in R and Python.

## 1. Bayesian Linear Regression

### Model
$$y_i \sim N(\beta_0 + \beta_1 x_{i1} + \ldots + \beta_p x_{ip}, \, \sigma^2)$$
$$\beta_j \sim N(0, \tau^2) \quad \text{(prior)}$$
$$\sigma \sim \text{Half-Cauchy}(0, 2) \quad \text{(prior on scale)}$$

The posterior $p(\beta, \sigma | y, X)$ is proportional to the likelihood $\times$ prior, and is typically sampled via MCMC.

R (using brms):
```r
library(brms)
model_bayes <- brm(mpg ~ wt + hp, data = mtcars,
                   prior = c(set_prior("normal(0, 5)", class = "b"),
                             set_prior("cauchy(0, 2)", class = "sigma")),
                   chains = 4, iter = 2000, seed = 42)
summary(model_bayes)
plot(model_bayes)  # trace plots, posterior densities
```

Python (using PyMC):
```python
import pymc as pm
import numpy as np

with pm.Model() as bayes_lm:
    # Priors
    beta0 = pm.Normal('beta0', mu=0, sigma=10)
    beta1 = pm.Normal('beta1', mu=0, sigma=5)
    beta2 = pm.Normal('beta2', mu=0, sigma=5)
    sigma = pm.HalfCauchy('sigma', beta=2)
    
    # Linear model
    mu = beta0 + beta1 * X[:, 1] + beta2 * X[:, 2]
    
    # Likelihood
    y_obs = pm.Normal('y_obs', mu=mu, sigma=sigma, observed=y)
    
    # Sample
    trace = pm.sample(2000, chains=4, return_inferencedata=True)
    
print(pm.summary(trace))
```

## 2. Interpreting Bayesian Coefficients

- Posterior mean — point estimate (like OLS but shrunk towards prior)
- Posterior SD — uncertainty (like SE but includes prior uncertainty)
- 95% credible interval — "95% probability the coefficient lies in this range"
- Posterior probability of direction — $P(\beta > 0 | data)$

### Shrinkage
With a normal prior $\beta_j \sim N(0, \tau^2)$, Bayesian estimates are shrunk towards zero. This is the Bayesian analogue of ridge regression — in fact, the posterior mode under a normal prior equals the ridge estimate.

## 3. Bayesian Logistic Regression

R (brms):
```r
model_logit_bayes <- brm(am ~ wt + hp, data = mtcars,
                         family = bernoulli(),
                         prior = set_prior("normal(0, 3)", class = "b"),
                         chains = 4, iter = 2000)
```

Python (PyMC):
```python
with pm.Model() as bayes_logit:
    beta0 = pm.Normal('beta0', 0, 5)
    beta1 = pm.Normal('beta1', 0, 3)
    beta2 = pm.Normal('beta2', 0, 3)
    logit_p = beta0 + beta1 * X[:, 1] + beta2 * X[:, 2]
    p = pm.math.invlogit(logit_p)
    y_obs = pm.Bernoulli('y_obs', p=p, observed=y)
    trace = pm.sample(2000)
```

## 4. Posterior Predictive Checks

After fitting, we can simulate new data from the posterior to check if the model reproduces observed patterns:

R: `pp_check(model_bayes, ndraws = 100)`
Python: `pm.sample_posterior_predictive(trace, model=bayes_lm)`

## 5. Advantages Over OLS

- Automatic regularisation — priors prevent overfitting, especially with many predictors
- Full uncertainty — prediction intervals naturally include parameter and sampling uncertainty
- Handles small data — weakly informative priors stabilise estimates when $n$ is small
- Model comparison — use WAIC or LOO for out-of-sample predictive performance

## References

- McElreath, R. (2020). Statistical Rethinking. 2nd ed. CRC Press.
- Gelman, A. et al. (2013). Bayesian Data Analysis. 3rd ed. CRC Press.
- Bürkner, P.C. (2017). "brms: An R Package for Bayesian Multilevel Models." Journal of Statistical Software, 80(1): 1-28.
- Salvatier, J. et al. (2016). "PyMC 3: Bayesian Stochastic Modelling in Python." PeerJ Computer Science, 2: e55.

## Relevant notes

- [Linear & Logistic Regression: Frequentist Approach](linear-logistic-regression-frequentist-approach.md)
- [Linear Algebra Essentials for Statistics](linear-algebra-essentials-for-statistics.md)
- [Regression: Frequentist vs Bayesian Comparison](regression-frequentist-vs-bayesian-comparison.md)
- [Frequentist vs Bayesian Philosophy](frequentist-vs-bayesian-philosophy.md)