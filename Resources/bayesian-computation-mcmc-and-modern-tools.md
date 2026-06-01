---
title: 'Bayesian Computation: MCMC and Modern Tools'
description: MCMC algorithms (Metropolis-Hastings, Gibbs, HMC), convergence diagnostics, PyMC and Stan with R and Python
author: pi
editor: lam
date: 2026-06-01T21:06:38.706Z
tags:
  - roadmap
  - statistics
  - intermediate
  - bayesian
---
# Bayesian Computation: MCMC and Modern Tools

## Overview

For most real-world Bayesian models, the posterior $p(\theta|x)$ has no closed form. **Markov Chain Monte Carlo (MCMC)** methods allow us to sample from the posterior, turning integration into simulation. This note covers the key algorithms and tools.

## 1. Why MCMC?

The posterior involves a potentially high-dimensional integral:

$$p(\theta|x) = \frac{p(x|\theta)p(\theta)}{\int p(x|\theta)p(\theta) d\theta}$$

The denominator (marginal likelihood) is intractable for most models. MCMC constructs a Markov chain whose **stationary distribution** is the posterior — so after convergence, samples are draws from the posterior.

## 2. Metropolis-Hastings Algorithm

Simplest MCMC algorithm:

1. Start at $\theta^{(0)}$
2. Propose a new value $\theta^*$ from a **proposal distribution** $J(\theta^*|\theta^{(t)})$
3. Compute acceptance ratio: $r = \frac{p(\theta^*|x) J(\theta^{(t)}|\theta^*)}{p(\theta^{(t)}|x) J(\theta^*|\theta^{(t)})}$
4. Accept $\theta^*$ with probability $\min(1, r)$; otherwise stay at $\theta^{(t)}$

**R — simple Metropolis for Normal posterior:**
```r
set.seed(42)
x <- rnorm(100, 5, 2)
mu_prior <- 0; sigma_prior <- 10

metropolis_mu <- function(x, n_iter = 10000, proposal_sd = 0.5) {
  mu <- numeric(n_iter)
  mu[1] <- 0
  for (t in 2:n_iter) {
    mu_star <- rnorm(1, mu[t-1], proposal_sd)
    log_r <- sum(dnorm(x, mu_star, 2, log = TRUE)) +
             dnorm(mu_star, mu_prior, sigma_prior, log = TRUE) -
             sum(dnorm(x, mu[t-1], 2, log = TRUE)) -
             dnorm(mu[t-1], mu_prior, sigma_prior, log = TRUE)
    if (log(runif(1)) < log_r) mu[t] <- mu_star else mu[t] <- mu[t-1]
  }
  mu
}
post_samples <- metropolis_mu(x)
```

## 3. Gibbs Sampling

When a parameter's **full conditional** $p(\theta_j | \theta_{-j}, x)$ has a known form (often due to conjugate priors), we can sample from it directly — no accept/reject step needed.

Gibbs cycles through each parameter, sampling from its full conditional given current values of all other parameters. This is especially efficient for hierarchical models.

## 4. Hamiltonian Monte Carlo (HMC)

HMC uses **gradient information** to propose efficient moves, avoiding the random walk behaviour of Metropolis-Hastings. It introduces auxiliary momentum variables and simulates Hamiltonian dynamics.

**Key benefit:** Much better scaling to high-dimensional parameter spaces. This is the algorithm behind **Stan**, which is the gold standard for Bayesian computation.

## 5. Modern MCMC Tools

### Stan
- Uses HMC with a variant called **NUTS** (No-U-Turn Sampler)
- Automatic tuning of step size and trajectory length
- Interfaces: R (rstan, cmdstanr, brms), Python (pystan, cmdstanpy)
- **R:** `library(rstan); sampling(stan_model, data, chains=4, iter=2000)`
- **Python:** `stan = cmdstanpy.CmdStanModel(stan_file='model.stan'); stan.sample(data)`

### PyMC
- Python-native Bayesian computation with multiple samplers
- Supports NUTS (HMC), Metropolis, Slice sampling
- Automatic variational inference option

**Python — PyMC with NUTS:**
```python
import pymc as pm

with pm.Model() as model:
    mu = pm.Normal('mu', 0, 10)
    sigma = pm.HalfCauchy('sigma', 2)
    obs = pm.Normal('obs', mu=mu, sigma=sigma, observed=x)
    trace = pm.sample(2000, tune=1000, cores=4, nuts_sampler='nutpie')
    # nutpie is a fast NUTS implementation
```

### brms (R)
- High-level interface to Stan: write `brm(y ~ x, data)` and it generates Stan code
- Same syntax as lme4 for mixed models
- Supports a wide range of likelihoods and priors

## 6. Convergence Diagnostics

| Diagnostic | What it checks | Threshold |
|-----------|---------------|-----------|
| **Trace plot** | Chain mixing visually | Should look like "hairy caterpillar" |
| **R-hat** ($\hat{R}$) | Between/within chain variance | $< 1.01$ |
| **ESS** (Effective Sample Size) | Number of independent samples | At least 100 per parameter |
| **Autocorrelation** | Dependence between successive samples | Should drop to near 0 |

**R — diagnostics:**
```r
library(bayesplot)
mcmc_trace(fit_bayes, pars = c("b_wt", "b_hp"))
rhat(fit_bayes)
neff_ratio(fit_bayes)
```

**Python — diagnostics:**
```python
import arviz as az
az.plot_trace(trace)
print(az.rhat(trace))
print(az.ess(trace))
```

## 7. Practical Tips

- **Always run multiple chains** (4 is standard) with different starting values
- **Discard warmup/burn-in** (first ~50% of iterations)
- **Thin if necessary** to reduce memory, but usually not needed with NUTS
- If $\hat{R} > 1.01$, run more iterations or reparameterise
- **Weakly informative priors** help HMC explore efficiently

## References

- Betancourt, M. (2017). "A Conceptual Introduction to Hamiltonian Monte Carlo." *arXiv:1701.02434*.
- Gelman, A. et al. (2013). *Bayesian Data Analysis*. 3rd ed. Chapter 11-12.
- McElreath, R. (2020). *Statistical Rethinking*. 2nd ed. Chapters 8-9.
- Carpenter, B. et al. (2017). "Stan: A Probabilistic Programming Language." *Journal of Statistical Software*, 76(1): 1-32.

## Relevant notes

- [[frequentist-vs-bayesian-philosophy]]
- [[linear-algebra-essentials-for-statistics]]
- [[descriptive-statistics-data-visualisation]]
- [[bayesian-inference]]