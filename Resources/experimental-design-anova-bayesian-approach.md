---
title: 'Experimental Design & ANOVA: Bayesian Approach'
description: Bayesian t-tests, Bayesian ANOVA, BEST, and hierarchical experimental design with R and Python
author: pi
editor: lam
date: 2026-06-01T21:06:38.707Z
tags:
  - roadmap
  - statistics
  - intermediate
  - bayesian
---
# Experimental Design & ANOVA: Bayesian Approach

## Overview

Bayesian approaches to experimental design and ANOVA provide direct probability statements about group differences, natural handling of unequal variances, and intuitive interpretation of results. This note covers Bayesian t-tests (BEST), Bayesian ANOVA, and their advantages over classical methods.

## 1. The Bayesian Two-Sample t-Test (BEST)

The Bayesian Estimation Supersedes the t-Test (BEST) approach (Kruschke, 2013) estimates the full posterior for both group means, standard deviations, and normality:

$$y_i \sim N(\mu_1, \sigma_1) \;\text{or}\; N(\mu_2, \sigma_2)$$
$$\mu_j \sim N(\mu_{prior}, \sigma_{prior})$$
$$\sigma_j \sim \text{Half-Cauchy}(\beta)$$
$$\nu \sim \text{Gamma}(2, 0.1) \quad \text{(normality parameter)}$$

R (brms):
```r
library(brms)
data <- data.frame(value = c(control, treatment),
                   group = rep(c("control", "treatment"),
                               each = c(length(control), length(treatment))))
fit_best <- brm(value ~ group, data = data,
                prior = c(set_prior("normal(0, 10)", class = "Intercept"),
                          set_prior("normal(0, 10)", class = "b"),
                          set_prior("cauchy(0, 2)", class = "sigma")),
                chains = 4, iter = 4000)
# Posterior of group difference
posterior <- as_draws_df(fit_best)
diff <- posterior$b_gtreatment
quantile(diff, c(0.025, 0.5, 0.975))
mean(diff > 0)  # probability treatment > control
```

Python (PyMC):
```python
import pymc as pm

with pm.Model() as best_model:
    mu1 = pm.Normal('mu1', mu=0, sigma=10)
    mu2 = pm.Normal('mu2', mu=0, sigma=10)
    sigma1 = pm.HalfCauchy('sigma1', beta=2)
    sigma2 = pm.HalfCauchy('sigma2', beta=2)
    nu = pm.Gamma('nu', alpha=2, beta=0.1)
    
    # Student's t (robust to outliers)
    pm.StudentT('control', mu=mu1, sigma=sigma1, nu=nu, observed=control)
    pm.StudentT('treatment', mu=mu2, sigma=sigma2, nu=nu, observed=treatment)
    
    # Effect size
    diff = pm.Deterministic('diff', mu2 - mu1)
    effect_size = pm.Deterministic('effect_size', (mu2 - mu1) / pm.math.sqrt((sigma1**2 + sigma2**2)/2))
    
    trace = pm.sample(4000, chains=4)
    
print(trace.posterior['diff'].mean().values)
print((trace.posterior['diff'] > 0).mean().values)  # Pr(treatment > control)
```

## 2. Bayesian ANOVA

### One-Way Bayesian ANOVA
Instead of an F-test, fit a model with group-level intercepts and compare groups via posterior distributions:

R (brms):
```r
fit_bayes_anova <- brm(y ~ group, data = mydata,
                       prior = set_prior("normal(0, 10)", class = "b"),
                       chains = 4, iter = 2000)
# Compare groups via contrasts
hypothesis(fit_bayes_anova, "groupB - groupA > 0")
hypothesis(fit_bayes_anova, "groupC - groupA = 0")
```

Python (PyMC):
```python
with pm.Model() as bayes_anova:
    mu0 = pm.Normal('mu0', 0, 10)  # baseline
    alpha = pm.Normal('alpha', 0, 5, shape=k_groups)  # group offsets
    sigma = pm.HalfCauchy('sigma', 2)
    mu = mu0 + alpha[group_idx]
    pm.Normal('y', mu=mu, sigma=sigma, observed=y)
    trace = pm.sample(2000)
```

### Advantages of Bayesian ANOVA
| Aspect | Frequentist ANOVA | Bayesian ANOVA |
|--------|------------------|----------------|
| Result | F-statistic + p-value | Full posterior for all group means |
| Pairwise comparisons | Requires corrections (Tukey, Bonferroni) | Direct from posterior contrasts |
| Unequal variances | Problematic (Welch's ANOVA needed) | Handled naturally (estimate per-group $\sigma_j$) |
| Interpretation | "Significant" vs "not significant" | "Probability group B > group A is 94%" |
| Small samples | Low power, assumptions matter | Robust with weakly informative priors |

## 3. A/B Testing — Bayesian Approach

Bayesian A/B testing avoids many problems of frequentist approaches:
- No need to pre-specify sample size (can monitor with Bayesian stopping rules)
- Results are intuitive: "Probability B > A is X%"
- Can incorporate prior information from previous experiments

R:
```r
# Beta-Binomial A/B test
prior_a <- prior_b <- c(1, 1)  # Uniform prior
post_a <- prior_a + c(conversions_A, n_A - conversions_A)
post_b <- prior_b + c(conversions_B, n_B - conversions_B)

# Simulate difference
sim_a <- rbeta(10000, post_a[1], post_a[2])
sim_b <- rbeta(10000, post_b[1], post_b[2])
mean(sim_b > sim_a)  # probability B > A
```

## 4. Power Analysis — Bayesian

Bayesian power analysis simulates data under hypothetical true effects, fits models, and checks if the posterior would detect the effect:

R (brms with simulated data):
```r
# True effect = 0.5, n = 30 per group
sim_and_fit <- function(n, true_effect) {
  control <- rnorm(n, 0, 1)
  treatment <- rnorm(n, true_effect, 1)
  data <- data.frame(y = c(control, treatment),
                     group = rep(0:1, each = n))
  fit <- brm(y ~ group, data = data, refresh = 0, chains = 2, iter = 1000)
  post <- as_draws_df(fit)
  mean(post$b_group > 0) > 0.95  # power = probability of detecting effect
}
replicate(100, sim_and_fit(30, 0.5)) |> mean()  # estimated power
```

## References

- Kruschke, J. (2013). "Bayesian Estimation Supersedes the t-Test." Journal of Experimental Psychology: General, 142(2): 573-603.
- Kruschke, J. (2014). Doing Bayesian Data Analysis. 2nd ed. Academic Press.
- Gelman, A. et al. (2013). Bayesian Data Analysis. 3rd ed. Chapters 21-22.

## Relevant notes

- [[experimental-design-anova-frequentist-approach]]
- [[experimental-design-anova-frequentist-vs-bayesian-comparison]]
- [[frequentist-vs-bayesian-philosophy]]
- [[linear-logistic-regression-bayesian-approach]]