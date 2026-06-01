---
title: 'Model Comparison & Selection: Bayesian Approach'
description: Bayes factors, WAIC, LOO-CV, and sparse Bayesian models for model comparison with R and Python
author: pi
editor: lam
date: 2026-06-01T21:07:29.063Z
tags:
  - roadmap
  - statistics
  - intermediate
  - bayesian
---
# Model Comparison & Selection: Bayesian Approach

## Overview

Bayesian model comparison uses the same principles as frequentist approaches — balance fit and complexity — but within a probability framework. Key tools include Bayes factors, WAIC, LOO-CV, and spike-and-slab priors. Code examples in R and Python.

## 1. Bayes Factors

The Bayes factor compares the marginal likelihood of two models:

$$BF_{12} = \frac{p(y | M_1)}{p(y | M_2)} = \frac{\int p(y|\theta_1, M_1) p(\theta_1|M_1) d\theta_1}{\int p(y|\theta_2, M_2) p(\theta_2|M_2) d\theta_2}$$

This is the Bayesian alternative to likelihood ratio tests. The marginal likelihood automatically includes Occam's razor: simpler models get higher marginal likelihood when data doesn't support complexity.

| BF | Evidence |
|----|----------|
| $1$–$3$ | Anecdotal |
| $3$–$10$ | Moderate |
| $10$–$30$ | Strong |
| $> 30$ | Very strong |
| $< 1/3$ | Evidence for $M_2$ |

R (BayesFactor package):
```r
library(BayesFactor)
# t-test with Bayes factor
ttestBF(formula = value ~ group, data = data)

# Linear regression
regressionBF(mpg ~ wt + hp + am, data = mtcars, whichModels = "all")
```

Python (PyMC + arviz):
```python
import arviz as az

# Compute marginal likelihood via bridge sampling
# (PyMC has built-in support)
with model1:
    idata1 = pm.sample(2000)
    m1 = pm.compute_log_marginal_likelihood(idata1)
with model2:
    idata2 = pm.sample(2000)
    m2 = pm.compute_log_marginal_likelihood(idata2)

bf = np.exp(m1 - m2)
print(f"Bayes Factor (M1/M2): {bf:.2f}")
```

## 2. WAIC (Watanabe-Akaike Information Criterion)

$$WAIC = -2\left(\sum_i \log E[\log p(y_i|\theta)] - \sum_i \text{Var}[\log p(y_i|\theta)]\right)$$

- Fully Bayesian — uses the entire posterior, not just point estimates
- The penalty term is the effective number of parameters
- Computed automatically from MCMC samples

R (brms): `waic(fit1, fit2)` — compares WAIC between models
Python (arviz): `az.waic(trace, model)` or `az.compare(dict_of_traces)`

## 3. LOO-CV (Leave-One-Out Cross-Validation)

Bayesian LOO estimates out-of-sample predictive performance using Pareto-smoothed importance sampling (PSIS) — no need to refit the model $n$ times:

$$\text{elpd}_{LOO} = \sum_{i=1}^n \log p(y_i | y_{-i})$$

Each $p(y_i | y_{-i})$ is the posterior predictive density for observation $i$ when fitting the model to all data except $i$.

R (brms): `loo(fit1, fit2)` — includes diagnostic $\hat{k}$ (Pareto shape parameter)
- $\hat{k} < 0.5$: reliable
- $0.5 < \hat{k} < 0.7$: ok but use caution
- $\hat{k} > 0.7$: unreliable (consider reparameterisation)

Python (arviz): `az.loo(trace, model)` or `az.compare({"model1": idata1, "model2": idata2})`

## 4. Sparse Bayesian Models

For variable selection, frequentist lasso has a Bayesian interpretation: double-exponential (Laplace) prior on coefficients:

$$\beta_j \sim \text{Laplace}(0, \lambda) \quad \Rightarrow \quad \text{posterior mode} = \text{Lasso}$$

### Spike-and-Slab Priors
A more principled Bayesian variable selection approach:

$$\beta_j \sim \gamma_j \cdot N(0, \tau^2) + (1-\gamma_j) \cdot \delta_0$$
$$\gamma_j \sim \text{Bernoulli}(\pi)$$

- $\gamma_j = 1$ means variable $j$ is included ("slab")
- $\gamma_j = 0$ means variable $j$ is excluded ("spike" at 0)
- Posterior of $\gamma_j$ gives probability that variable is relevant

## 5. Practical Recommendations

| Task | Recommended Tool |
|------|-----------------|
| Compare nested models | Bayes factors (or WAIC if BF is unstable) |
| Estimate predictive performance | LOO-CV (PSIS) |
| Variable selection | Spike-and-slab or Bayesian regularised regression |
| Model averaging | Stacking of predictive distributions |
| Check if a simpler model suffices | WAIC/LOO comparison + posterior predictive checks |

## References

- Gelman, A. et al. (2014). "Understanding predictive information criteria for Bayesian models." Statistics and Computing, 24(6): 997-1016.
- Vehtari, A. et al. (2017). "Practical Bayesian model evaluation using leave-one-out cross-validation and WAIC." Statistics and Computing, 27(5): 1413-1432.
- Kass, R.E. & Raftery, A.E. (1995). "Bayes Factors." Journal of the American Statistical Association, 90(430): 773-795.
- Piironen, J. & Vehtari, A. (2017). "Comparison of Bayesian predictive methods for model selection." Statistics and Computing, 27(3): 711-735.

## Relevant notes

- [[model-comparison-frequentist-vs-bayesian-comparison]]
- [[model-comparison-selection-frequentist-approach]]
- [[linear-logistic-regression-bayesian-approach]]
- [[experimental-design-anova-frequentist-vs-bayesian-comparison]]