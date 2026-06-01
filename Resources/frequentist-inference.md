---
title: Frequentist Inference
description: MLE, hypothesis testing, p-values, confidence intervals, Type I/II errors, power analysis with R and Python
author: pi
editor: lam
date: 2026-06-01T21:04:48.596Z
tags:
  - roadmap
  - statistics
  - core-theory
  - frequentist
---
# Frequentist Inference

## Overview

Frequentist inference treats probability as the long-run frequency of events in repeated sampling. Parameters are fixed, unknown constants. All uncertainty comes from sampling variability — if we repeated the experiment many times, how would our estimates behave? This note covers the core tools of frequentist inference.

## 1. The Frequentist Philosophy

- Probability = long-run relative frequency of an event in infinite repetitions
- Parameters ($\theta$) are fixed, unknown constants — not random variables
- Data ($X$) are random — a new sample would give different results
- Uncertainty is expressed through sampling distributions of estimators

## 2. Point Estimation & Maximum Likelihood (MLE)

Maximum Likelihood Estimation finds the parameter values that make the observed data most probable:

$$\hat{\theta}_{MLE} = \arg\max_\theta \prod_{i=1}^n f(x_i | \theta)$$

Equivalently, maximise the log-likelihood: $\ell(\theta) = \sum_{i=1}^n \log f(x_i | \theta)$

### MLE Properties (asymptotic)
1. Consistency: $\hat{\theta}_{MLE} \xrightarrow{p} \theta_{true}$ as $n \to \infty$
2. Asymptotic Normality: $\hat{\theta}_{MLE} \sim N(\theta, I(\theta)^{-1})$
3. Efficiency: No consistent estimator has lower asymptotic variance

R — MLE for Normal mean:
```r
x <- rnorm(100, mean = 5, sd = 2)
neg_log_lik <- function(mu) -sum(dnorm(x, mean = mu, sd = 2, log = TRUE))
fit <- optimize(neg_log_lik, interval = c(-10, 10))
fit$minimum  # MLE estimate of mu
```

Python — MLE for Normal mean:
```python
import numpy as np
from scipy.optimize import minimize
x = np.random.normal(5, 2, 100)
def neg_log_lik(mu):
    return -np.sum(np.log(np.exp(-0.5 * ((x - mu) / 2)**2) / (2 * np.sqrt(2 * np.pi))))
result = minimize(neg_log_lik, x0=0, method='Brent')
result.x[0]  # MLE estimate
```

## 3. Hypothesis Testing (Neyman-Pearson Framework)

### Setup
- Null hypothesis $H_0$: A default claim (e.g., $\mu = 0$)
- Alternative hypothesis $H_1$: What we want to evidence (e.g., $\mu \neq 0$)
- Test statistic $T$: A function of the data
- Rejection region: Values of $T$ that lead to rejecting $H_0$

### Error Types
| | Fail to reject $H_0$ | Reject $H_0$ |
|---|---|---|
| $H_0$ true | Correct ($1-\alpha$) | Type I error ($\alpha$) |
| $H_1$ true | Type II error ($\beta$) | Correct ($1-\beta$ = Power) |

### p-values

The p-value is the probability of observing a test statistic as extreme as (or more extreme than) the one observed, assuming $H_0$ is true.

> Common misinterpretation: The p-value is NOT the probability that $H_0$ is true. That's a Bayesian question requiring a prior.

R — one-sample t-test:
```r
t.test(x, mu = 5)  # tests H0: mu = 5
```

Python — one-sample t-test:
```python
from scipy import stats
stats.ttest_1samp(x, popmean=5)
```

## 4. Confidence Intervals

A $100(1-\alpha)\%$ confidence interval for $\theta$ is an interval $[L, U]$ such that:

$$P(L \leq \theta \leq U) = 1 - \alpha$$

Interpretation: If we repeated the experiment many times and computed a CI each time, $100(1-\alpha)\%$ of those intervals would contain the true parameter.

> Note: The parameter is fixed. The interval is random. You cannot say "there is a 95% probability that $\theta$ is in this interval" — that's a Bayesian credible interval.

## 5. Power Analysis

Power = $1 - \beta$ = probability of correctly rejecting $H_0$ when $H_1$ is true.

Factors affecting power:
- Effect size (larger = more power)
- Sample size (larger = more power)
- Significance level $\alpha$ (higher $\alpha$ = more power, but more Type I errors)
- Variability (lower variance = more power)

R — power analysis:
```r
library(pwr)
pwr.t.test(n = 30, d = 0.5, sig.level = 0.05, type = "two.sample")
```

Python — power analysis:
```python
from statsmodels.stats.power import TTestPower
power = TTestPower()
print(power.solve_power(nobs=30, effect_size=0.5, alpha=0.05))
```

## 6. Common Frequentist Tests

| Test | Use | R Function | Python Function |
|------|-----|-----------|-----------------|
| One-sample t-test | Compare mean to a value | `t.test(x, mu=0)` | `scipy.stats.ttest_1samp(x, 0)` |
| Two-sample t-test | Compare two group means | `t.test(x, y)` | `scipy.stats.ttest_ind(x, y)` |
| Paired t-test | Before/after comparisons | `t.test(x, y, paired=TRUE)` | `scipy.stats.ttest_rel(x, y)` |
| Chi-square test | Test independence in tables | `chisq.test(table)` | `scipy.stats.chi2_contingency(table)` |
| ANOVA | Compare >2 group means | `aov(y ~ group)` | `statsmodels.formula.api.ols` |
| Wilcoxon test | Non-parametric group comparison | `wilcox.test(x, y)` | `scipy.stats.ranksums(x, y)` |

## 7. Limitations of Frequentist Inference

- p-values are widely misinterpreted (even by scientists)
- No natural way to incorporate prior information
- Results depend on the stopping rule (optional stopping inflates Type I error)
- Confidence intervals are not probability statements about the parameter
- Cannot answer: "What's the probability that $H_1$ is true given the data?"

## References

- Casella, G. & Berger, R. (2002). Statistical Inference. 2nd ed. Duxbury.
- Lehmann, E.L. & Romano, J.P. (2005). Testing Statistical Hypotheses. 3rd ed. Springer.
- Wasserstein, R.L. & Lazar, N.A. (2016). "The ASA Statement on p-Values." The American Statistician, 70(2): 129-133.
- Cumming, G. (2014). "The New Statistics: Why and How." Psychological Science, 25(1): 7-29.

## Relevant notes

- [[fundamental-mathematics-for-statistics]]
- [[frequentist-vs-bayesian-philosophy]]
- [[probability-distributions-random-variables]]
- [[bayesian-inference]]