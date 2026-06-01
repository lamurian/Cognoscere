---
title: Bayesian Inference
description: Bayes' theorem, prior/likelihood/posterior, conjugate priors, credible intervals, MAP estimation with R and Python
author: pi
editor: lam
date: 2026-06-01T21:04:48.596Z
tags:
  - roadmap
  - statistics
  - core-theory
  - bayesian
---
# Bayesian Inference

## Overview

Bayesian inference treats probability as a **degree of belief** that gets updated with evidence. Parameters are random variables with probability distributions. We start with a **prior** before seeing data, then use **Bayes' theorem** to compute the **posterior** after seeing data. This note covers the core concepts.

## 1. The Bayesian Philosophy

- **Probability** = degree of belief, subjective but constrained by axioms
- **Parameters** ($\theta$) are random variables — we express uncertainty through distributions
- **Data** ($x$) are fixed — we condition on what we observed
- **Uncertainty** is expressed through the posterior distribution $p(\theta|x)$

## 2. Bayes' Theorem

$$p(\theta | x) = \frac{p(x | \theta) p(\theta)}{p(x)} = \frac{p(x | \theta) p(\theta)}{\int p(x | \theta) p(\theta) d\theta}$$

| Term | Name | Meaning |
|------|------|---------|
| $p(\theta)$ | **Prior** | Belief about $\theta$ before seeing data |
| $p(x|\theta)$ | **Likelihood** | Probability of data given $\theta$ |
| $p(\theta|x)$ | **Posterior** | Updated belief about $\theta$ after data |
| $p(x)$ | **Marginal Likelihood / Evidence** | Normalising constant (often intractable) |

### The Posterior is Proportional

$$p(\theta|x) \propto p(x|\theta) p(\theta)$$

The denominator $p(x)$ is a constant (doesn't depend on $\theta$), so for optimisation or sampling, we often work with the unnormalised posterior.

## 3. Conjugate Priors

A prior is **conjugate** for a likelihood if the posterior is in the same distribution family as the prior.

### Beta-Binomial (coin flipping)

**R:**
```r
# Prior: Beta(2, 2) — weakly informative, peaked at 0.5
# Data: 8 heads out of 10 flips
alpha_prior <- 2; beta_prior <- 2
alpha_post <- alpha_prior + 8; beta_post <- beta_prior + 2

# Posterior: Beta(10, 4)
curve(dbeta(x, alpha_post, beta_post), from = 0, to = 1,
      col = "steelblue", lwd = 2, ylab = "Density",
      main = "Posterior: Beta(10, 4)")
curve(dbeta(x, alpha_prior, beta_prior), add = TRUE, lty = 2)
legend("topleft", c("Posterior", "Prior"), lty = c(1, 2), col = c("steelblue", "black"))
```

**Python:**
```python
import numpy as np
from scipy import stats
import matplotlib.pyplot as plt

alpha_prior, beta_prior = 2, 2
heads, flips = 8, 10
alpha_post = alpha_prior + heads
beta_post = beta_prior + flips - heads

theta = np.linspace(0, 1, 100)
plt.plot(theta, stats.beta.pdf(theta, alpha_post, beta_post), 'steelblue', lw=2, label='Posterior')
plt.plot(theta, stats.beta.pdf(theta, alpha_prior, beta_prior), 'k--', label='Prior')
plt.legend()
```

### Normal-Normal (known variance)

$$\text{Prior: } \mu \sim N(\mu_0, \tau^2) \quad \text{Likelihood: } x_i \sim N(\mu, \sigma^2)$$

$$\text{Posterior: } \mu|x \sim N\left(\frac{\mu_0/\tau^2 + n\bar{x}/\sigma^2}{1/\tau^2 + n/\sigma^2},\; \frac{1}{1/\tau^2 + n/\sigma^2}\right)$$

The posterior mean is a **weighted average** of the prior mean and the sample mean, weighted by their precisions ($1/\text{variance}$).

## 4. Point Estimates from the Posterior

| Estimator | Definition | Use case |
|-----------|-----------|----------|
| **Posterior Mean** | $E[\theta|x] = \int \theta p(\theta|x) d\theta$ | Default, minimises squared error loss |
| **Posterior Median** | 50th percentile | Robust to skewed posteriors |
| **Posterior Mode (MAP)** | $\arg\max_\theta p(\theta|x)$ | Like MLE with prior penalty, easy to compute |

**MAP estimation with a Normal prior on $\mu$** is equivalent to **ridge regression** for coefficients.

## 5. Credible Intervals

A $95\%$ **credible interval** $[a, b]$ satisfies:

$$P(a \leq \theta \leq b \,|\, x) = 0.95$$

> **Direct interpretation:** "There's a 95% probability that $\theta$ lies in this interval." This is the intuitive interpretation that confidence intervals **cannot** provide.

**R — credible interval from posterior samples:**
```r
posterior_samples <- rbeta(10000, alpha_post, beta_post)
quantile(posterior_samples, c(0.025, 0.975))
```

**Python — credible interval:**
```python
posterior_samples = np.random.beta(alpha_post, beta_post, 10000)
np.quantile(posterior_samples, [0.025, 0.975])
```

## 6. The Prior Matters

Choosing priors is both the strength and the challenge of Bayesian analysis:

| Prior Type | Description | Example |
|-----------|-------------|---------|
| **Flat/Uniform** | "Let the data speak" — often gives same result as MLE | $\mu \sim \text{Uniform}(-\infty, \infty)$ |
| **Weakly Informative** | Adds mild regularisation, helps convergence | $\mu \sim N(0, 10)$, $\sigma \sim \text{Half-Cauchy}(0, 2)$ |
| **Informative** | Strong prior based on previous studies | $\mu \sim N(0.5, 0.1)$ (very confident about location) |
| **Conjugate** | Computational convenience | Beta for Binomial, Normal for Normal, etc. |

**Key principle:** The prior should be **defensible** — justify it with prior research, expert knowledge, or use weakly informative defaults.

## 7. Bayesian vs Frequentist at a Glance

| Aspect | Frequentist | Bayesian |
|--------|------------|----------|
| Probability | Long-run frequency | Degree of belief |
| Parameters | Fixed, unknown | Random variables |
| Inference | Sampling distribution of estimator | Posterior distribution |
| Prior information | Not used explicitly | Encoded in prior |
| Interpretation | "If repeated..." | Direct probability statements |
| Computation | Often closed-form | Often requires MCMC |

## Resources

- **Statistical Rethinking** by Richard McElreath (book + YouTube lectures)
- **Bayesian Data Analysis** by Gelman et al. (3rd ed., free PDF)
- **Bayes Rules!** by Johnson, Ott & Dogucu (free online)

## References

- Gelman, A. et al. (2013). *Bayesian Data Analysis*. 3rd ed. CRC Press.
- McElreath, R. (2020). *Statistical Rethinking*. 2nd ed. CRC Press.
- Kruschke, J. (2014). *Doing Bayesian Data Analysis*. 2nd ed. Academic Press.

## Relevant notes

- [[fundamental-mathematics-for-statistics]]
- [[frequentist-vs-bayesian-philosophy]]
- [[probability-distributions-random-variables]]
- [[frequentist-inference]]