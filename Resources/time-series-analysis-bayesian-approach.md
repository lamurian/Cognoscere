---
title: 'Time Series Analysis: Bayesian Approach'
description: Bayesian state-space models, dynamic linear models, Kalman filters, and Bayesian forecasting with R and Python
author: pi
editor: lam
date: 2026-06-01T21:09:35.825Z
tags:
  - roadmap
  - statistics
  - advanced
  - bayesian
---
# Time Series Analysis: Bayesian Approach

## Overview

Bayesian time series offers a flexible framework where model parameters evolve over time (dynamic models), uncertainty is fully propagated through forecasts, and prior information can stabilise estimates when data is scarce. Code in R and Python.

## 1. Dynamic Linear Models (DLMs)

DLMs are the Bayesian workhorse for time series. They consist of:

Observation equation: $y_t = F_t \theta_t + \varepsilon_t, \quad \varepsilon_t \sim N(0, V_t)$
State equation: $\theta_t = G_t \theta_{t-1} + \omega_t, \quad \omega_t \sim N(0, W_t)$

- $\theta_t$: latent state (evolves over time)
- $F_t$: design matrix (maps state to observation)
- $G_t$: state transition matrix
- $V_t, W_t$: observation and state variances

## 2. Bayesian ARIMA

Bayesian estimation of ARIMA models places priors on $\phi, \theta, \sigma^2$ and computes the posterior via MCMC.

R (brms with autocorrelation):
```r
library(brms)
fit_ar <- brm(y ~ ar(time = t, p = 2), data = data,
              prior = set_prior("normal(0, 1)", class = "ar"),
              chains = 4, iter = 2000)
summary(fit_ar)
```

Python (PyMC with AR):
```python
import pymc as pm

with pm.Model() as ar_model:
    sigma = pm.HalfCauchy('sigma', 2)
    phi = pm.Normal('phi', mu=0, sigma=0.9, shape=2)
    # AR(2) likelihood
    mu = phi[0] * y[:-2] + phi[1] * y[1:-1]
    pm.Normal('y', mu=mu, sigma=sigma, observed=y[2:])
```

## 3. State-Space Models with Kalman Filter

The Kalman filter provides exact Bayesian inference for linear Gaussian state-space models by recursively updating the posterior of $\theta_t$ as each observation arrives:

1. Predict: $p(\theta_t | y_{1:t-1})$
2. Update: $p(\theta_t | y_{1:t}) \propto p(y_t | \theta_t) p(\theta_t | y_{1:t-1})$

R (KFAS or bsts):
```r
library(bsts)
# Bayesian Structural Time Series
ss <- AddLocalLinearTrend(list(), y)
model_bsts <- bsts(y, state.specification = ss, niter = 1000)
plot(model_bsts)
```

Python (PyMC with state-space):
```python
import pymc as pm

with pm.Model() as dlm:
    # State evolution
    sigma_state = pm.HalfCauchy('sigma_state', 1)
    theta = pm.RandomWalk('theta', sigma=sigma_state, shape=n+1)
    
    # Observation
    sigma_obs = pm.HalfCauchy('sigma_obs', 1)
    pm.Normal('y', mu=theta[:-1], sigma=sigma_obs, observed=y)
    
    trace = pm.sample(2000, chains=4)
```

## 4. Forecasting with Full Uncertainty

Bayesian forecasts naturally produce predictive distributions rather than point forecasts:

$$p(y_{T+1} | y_{1:T}) = \int p(y_{T+1} | \theta) p(\theta | y_{1:T}) d\theta$$

This gives you:
- Point forecast (posterior mean or median)
- Prediction intervals (quantiles of predictive distribution)
- Probability of exceedance (e.g., $P(y_{T+1} > 0)$)

R: `predict(fit_bsts, horizon = 12)`
Python: `pm.sample_posterior_predictive(trace, model=dlm)`

## 5. Advantages of Bayesian Time Series

| Aspect | Frequentist | Bayesian |
|--------|------------|----------|
| Parameter uncertainty | Ignored in forecasts (uses MLE) | Fully propagated |
| Change points | Hard (need structural break tests) | Natural (regime-switching models) |
| Missing data | Listwise deletion or imputation | Handled via posterior |
| Multi-seasonality | Complex to specify | Easy with state-space components |
| Short series | Poor estimates from MLE | Priors stabilise |

## References

- West, M. & Harrison, J. (1997). Bayesian Forecasting and Dynamic Models. 2nd ed. Springer.
- Scott, S.L. & Varian, H.R. (2014). "Predicting the Present with Bayesian Structural Time Series." International Journal of Mathematical Modelling and Numerical Optimisation, 5(1-2): 4-23.
- Petris, G. et al. (2009). Dynamic Linear Models with R. Springer.
- Hyndman, R.J. & Athanasopoulos, G. (2021). Forecasting: Principles and Practice. 3rd ed. OTexts.

## Relevant notes

- [Time Series Analysis: Frequentist vs Bayesian Comparison](time-series-analysis-frequentist-vs-bayesian-comparison.md)
- [Time Series Analysis: Frequentist Approach](time-series-analysis-frequentist-approach.md)
- [Descriptive Statistics & Data Visualisation](descriptive-statistics-data-visualisation.md)
- [Frequentist vs Bayesian Philosophy](frequentist-vs-bayesian-philosophy.md)
