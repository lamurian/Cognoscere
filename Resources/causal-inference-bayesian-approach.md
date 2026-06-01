---
title: 'Causal Inference: Bayesian Approach'
description: Bayesian causal networks, Bayesian treatment effect estimation, and probabilistic causal inference with R and Python
author: pi
editor: lam
date: 2026-06-01T21:08:51.292Z
tags:
  - roadmap
  - statistics
  - advanced
  - bayesian
---
# Causal Inference: Bayesian Approach

## Overview

Bayesian causal inference brings the full posterior machinery to causal questions. Instead of point estimates of treatment effects, we get **posterior distributions** over causal effects. This handles uncertainty propagation, prior information, and complex causal structures naturally. Code in **R** and **Python**.

## 1. Bayesian Treatment Effect Estimation

### Bayesian ATE

$$P(\text{ATE} | y, T, X) = P(E[Y(1)] - E[Y(0)] | y, T, X)$$

Using Bayesian regression with treatment indicator:

**R (brms):**
```r
library(brms)
fit_causal <- brm(Y ~ T + X1 + X2, data = data,
                  prior = c(set_prior("normal(0, 5)", class = "b")),
                  chains = 4, iter = 2000)
# Posterior of treatment effect
post <- as_draws_df(fit_causal)
quantile(post$b_T, c(0.025, 0.5, 0.975))  # ATE with 95% CrI
mean(post$b_T > 0)  # probability treatment > control
```

**Python (PyMC):**
```python
import pymc as pm

with pm.Model() as causal_model:
    beta0 = pm.Normal('beta0', 0, 10)
    beta_t = pm.Normal('beta_t', 0, 5)  # treatment effect
    beta_x = pm.Normal('beta_x', 0, 5, shape=X.shape[1])
    sigma = pm.HalfCauchy('sigma', 2)
    mu = beta0 + beta_t * T + pm.math.dot(X, beta_x)
    pm.Normal('y', mu=mu, sigma=sigma, observed=Y)
    trace = pm.sample(2000, chains=4)
    
# Posterior of ATE
ate = trace.posterior['beta_t'].values.flatten()
print(np.quantile(ate, [0.025, 0.5, 0.975]))
```

## 2. Bayesian Causal Networks (BCNs)

BCNs model the full joint distribution over all variables using DAG structure and local probability distributions. Advantages:
- **Uncertainty** over graph structure (model averaging)
- **Combining** observational data with prior knowledge
- **Handling missing data** naturally via posterior imputation

**R (bnlearn + catnet for Bayesian networks):**
```r
library(bnlearn)
# Score-based structure learning
dag <- hc(data, score = "bic-cg")
fitted <- bn.fit(dag, data)  # MLE or Bayesian fit
# Inference with Bayes
cpquery(fitted, event = (Y == "high"), evidence = (T == "treated"))
```

## 3. Bayesian Propensity Scores

Instead of a point estimate for propensity scores, get a **posterior distribution**:

**R:**
```r
library(brms)
# Model propensity score
prop_model <- brm(T ~ X1 + X2, data = data, family = bernoulli(),
                  chains = 4, iter = 2000)
# Extract posterior predictions for propensity scores
prop_scores <- posterior_epred(prop_model)
# Each row = one posterior draw of propensity scores
```

## 4. Bayesian Causal Forests (BCF)

BCF (Hahn, Murray & Carvalho, 2020) is a Bayesian non-parametric method for heterogeneous treatment effects:

- Uses **regularised priors** to separate prognostic effects from treatment effects
- Automatically handles **weak confounding**
- Provides **posterior intervals** for CATE (Conditional ATE)

## 5. Sensitivity Analysis

A key practical advantage of Bayesian causal inference: you can quantify **sensitivity to unmeasured confounding** by placing priors on the confounding strength:

**Approach:**
1. Assume an unmeasured confounder $U$ with influence on $T$ and $Y$
2. Place prior on its effect sizes (e.g., $\delta_T \sim N(0, 1)$, $\delta_Y \sim N(0, 1)$)
3. Estimate ATE **conditional** on $U$ — see how posterior changes

## 6. When Bayesian Causal Inference Excels

| Scenario | Reason |
|----------|--------|
| **Small samples** | Weakly informative priors stabilise estimates |
| **Complex causal graphs** | MCMC handles non-linear dependencies |
| **Structural uncertainty** | Bayesian model averaging over graphs |
| **Probabilistic queries** | $P(\text{causal effect} > 0 | \text{data})$ |
| **Sequential treatments** | Natural for dynamic treatment regimes |

## References

- Hahn, P.R., Murray, J.S. & Carvalho, C.M. (2020). "Bayesian Regression Tree Models for Causal Inference." *Bayesian Analysis*, 15(3): 965-996.
- Pearl, J. (2009). *Causality*. 2nd ed. Cambridge.
- Imbens, G. & Rubin, D. (2015). *Causal Inference*. Cambridge.

## Relevant notes

- [[causal-inference-frequentist-approach]]
- [[descriptive-statistics-data-visualisation]]
- [[model-comparison-frequentist-vs-bayesian-comparison]]
- [[frequentist-vs-bayesian-philosophy]]