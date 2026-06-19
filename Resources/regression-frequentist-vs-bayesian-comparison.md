---
title: 'Regression: Frequentist vs Bayesian Comparison'
description: Side-by-side comparison of frequentist and Bayesian regression approaches with R and Python examples
author: pi
editor: lam
date: 2026-06-01T21:06:38.706Z
tags:
  - roadmap
  - statistics
  - intermediate
  - comparison
---
# Regression: Frequentist vs Bayesian Comparison

## Overview

This note compares frequentist (OLS/GLM) and Bayesian regression approaches, highlighting when they agree, when they diverge, and how to choose between them. Includes R and Python code contrasting both methods on the same dataset.

## 1. Same Model, Different Philosophy

Both approaches use the same linear model $y = X\beta + \varepsilon$. They differ in:

| Aspect | Frequentist | Bayesian |
|--------|------------|----------|
| Coefficients | Fixed, unknown constants | Random variables with distributions |
| Uncertainty | Sampling distribution of $\hat{\beta}$ | Posterior $p(\beta|y,X)$ |
| Interpretation | "If repeated..." 95% CI | "95% probability" credible interval |
| Regularisation | Ridge/Lasso penalty | Informative/normal priors (shrinkage) |
| Prior info | Not formalised | Explicit in prior distribution |

## 2. When They Agree

With flat/improper priors ($\beta_j \sim \text{Uniform}(-\infty, \infty)$), the Bayesian posterior mean equals the OLS estimate:

$$E[\beta|y,X] = (X^T X)^{-1} X^T y = \hat{\beta}_{OLS}$$

And the posterior credible interval equals the frequentist confidence interval.

## 3. When They Diverge

### Small samples
With $n < p$ (more predictors than observations), OLS breaks down (singular matrix). Bayesian regression with priors still works.

R — OLS fails, Bayesian works:
```r
# Simulate data with n < p
set.seed(42)
n <- 10; p <- 15
X <- matrix(rnorm(n * p), n, p)
y <- rnorm(n)

# OLS fails
# lm(y ~ X)  # Error!

# Bayesian works (with regularising priors)
library(brms)
data <- data.frame(y = y, X)
model_bayes <- brm(y ~ ., data = data,
                   prior = set_prior("normal(0, 1)", class = "b"),
                   chains = 2, iter = 1000, refresh = 0)
```

### With informative priors
If you have strong external information (previous studies, expert knowledge), Bayesian regression incorporates it naturally. Frequentist methods would need to use the prior information informally (e.g., study design, pilot data).

### Prediction intervals
- Frequentist: $\hat{y}_0 \pm t_{n-p, \alpha/2} \cdot \hat{\sigma} \sqrt{x_0^T (X^T X)^{-1} x_0 + 1}$
- Bayesian: Sample from $p(\tilde{y}|y) = \int p(\tilde{y}|\beta,\sigma) p(\beta,\sigma|y) d\beta d\sigma$ — naturally propagates all uncertainty

## 4. Practical Recommendations

| Scenario | Recommendation |
|----------|---------------|
| $n \gg p$, strong theory | Both work well — frequentist is simpler |
| $n$ small or $p$ large | Bayesian with regularising priors |
| Need direct probability statements | Bayesian (credible intervals) |
| Regulatory/clinical context | Frequentist (established methodology) |
| Exploratory with many models | Frequentist (faster computation) |
| Complex hierarchical structure | Bayesian (natural partial pooling) |

## 5. Code Comparison on Same Dataset

R — side-by-side:
```r
library(broom)

# Frequentist
fit_freq <- lm(mpg ~ wt + hp, mtcars)
tidy(fit_freq)  # coefficients + p-values
glance(fit_freq)  # R-squared, AIC, etc.

# Bayesian
fit_bayes <- brm(mpg ~ wt + hp, mtcars,
                 prior = set_prior("normal(0, 10)", class = "b"),
                 chains = 4, iter = 2000, refresh = 0)
fixef(fit_bayes)  # coefficients + CIs
```

Python — side-by-side:
```python
import statsmodels.api as sm
import pymc as pm

# Frequentist
X = sm.add_constant(mtcars[['wt','hp']])
freq_model = sm.OLS(mtcars['mpg'], X).fit()
print(freq_model.summary())

# Bayesian
with pm.Model() as bayes_model:
    beta = pm.Normal('beta', mu=0, sigma=10, shape=X.shape[1])
    sigma = pm.HalfCauchy('sigma', 2)
    mu = pm.math.dot(X, beta)
    pm.Normal('y', mu=mu, sigma=sigma, observed=mtcars['mpg'])
    trace = pm.sample(2000, chains=4, progressbar=False)
pm.summary(trace)
```

## References

- Gelman, A. & Hill, J. (2007). Data Analysis Using Regression and Multilevel/Hierarchical Models. Cambridge.
- James, G. et al. (2021). An Introduction to Statistical Learning. 2nd ed. Springer.
- McElreath, R. (2020). Statistical Rethinking. 2nd ed. CRC Press.

## Relevant notes

- [Frequentist vs Bayesian Philosophy](frequentist-vs-bayesian-philosophy.md)
- [Experimental Design & ANOVA: Frequentist vs Bayesian Comparison](experimental-design-anova-frequentist-vs-bayesian-comparison.md)
- [Linear Algebra Essentials for Statistics](linear-algebra-essentials-for-statistics.md)
- [Linear & Logistic Regression: Bayesian Approach](linear-logistic-regression-bayesian-approach.md)