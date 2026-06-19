---
title: Probability Distributions & Random Variables
description: Discrete and continuous distributions, PDF/PMF/CDF, joint/marginal/conditional, LLN, CLT with R and Python
author: pi
editor: lam
date: 2026-06-01T21:04:48.595Z
tags:
  - roadmap
  - statistics
  - core-theory
  - fundamental
---
# Probability Distributions & Random Variables

## Overview

Random variables are the bridge between raw data and statistical models. Understanding distributions — their properties, shapes, and relationships — is essential for both frequentist and Bayesian inference. This note covers discrete and continuous distributions, the Law of Large Numbers, and the Central Limit Theorem.

## 1. Random Variables

A random variable $X$ is a function that maps outcomes of a random process to numbers.

- Discrete: Countable outcomes (e.g., number of heads in 10 coin flips)
- Continuous: Uncountably infinite outcomes (e.g., height, temperature)

### Key Functions
| Function | Description |
|----------|-------------|
| PMF $p(x)$ | Probability Mass Function — $P(X = x)$ for discrete variables |
| PDF $f(x)$ | Probability Density Function — area under curve = probability |
| CDF $F(x)$ | Cumulative Distribution Function — $P(X \leq x)$ |

## 2. Important Discrete Distributions

### Bernoulli($p$)
- Single trial with success probability $p$
- $P(X=1) = p$, $P(X=0) = 1-p$
- $E[X] = p$, $\text{Var}(X) = p(1-p)$

### Binomial($n, p$)
- Sum of $n$ independent Bernoulli($p$) trials
- $P(X=k) = {n \choose k} p^k (1-p)^{n-k}$
- $E[X] = np$, $\text{Var}(X) = np(1-p)$

R: `dbinom(k, n, p)`, `pbinom(k, n, p)`, `rbinom(N, n, p)`
Python: `scipy.stats.binom.pmf(k, n, p)`, `scipy.stats.binom.cdf(k, n, p)`

### Poisson($\lambda$)
- Counts of rare events in a fixed interval
- $P(X=k) = \frac{\lambda^k e^{-\lambda}}{k!}$
- $E[X] = \text{Var}(X) = \lambda$

### Geometric($p$)
- Number of trials until first success
- $P(X=k) = (1-p)^{k-1} p$

## 3. Important Continuous Distributions

### Normal($\mu, \sigma^2$)
- The "bell curve" — central to frequentist statistics (CLT) and widely used in Bayesian analysis
- PDF: $f(x) = \frac{1}{\sigma\sqrt{2\pi}} \exp\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)$
- 68-95-99.7 rule for $\pm 1, 2, 3$ standard deviations

R: `dnorm(x, mu, sigma)`, `pnorm(q, mu, sigma)`, `rnorm(N, mu, sigma)`
Python: `scipy.stats.norm.pdf(x, mu, sigma)`, `scipy.stats.norm.cdf(q, mu, sigma)`

### Beta($\alpha, \beta$)
- Defined on [0,1] — the conjugate prior for Binomial likelihood in Bayesian analysis
- $E[X] = \frac{\alpha}{\alpha + \beta}$, $\text{Var}(X) = \frac{\alpha\beta}{(\alpha+\beta)^2(\alpha+\beta+1)}$
- Special cases: $\text{Beta}(1,1) = \text{Uniform}(0,1)$ (uninformative prior)

### Gamma($k, \theta$) and Inverse Gamma
- Gamma is the conjugate prior for Poisson rate $\lambda$
- Inverse Gamma is the conjugate prior for variance $\sigma^2$ in normal models

### t-distribution($\nu$)
- Heavier tails than normal — robust to outliers
- As $\nu \to \infty$, t-distribution $\to$ Normal
- Used extensively in frequentist hypothesis testing (t-tests)

## 4. Joint, Marginal, and Conditional Distributions

For two random variables $X$ and $Y$:

- Joint: $f_{X,Y}(x,y)$ — probability of both occurring together
- Marginal: $f_X(x) = \int f_{X,Y}(x,y) dy$ — summing/integrating over Y
- Conditional: $f_{Y|X}(y|x) = \frac{f_{X,Y}(x,y)}{f_X(x)}$ — distribution of Y given X

> Bayesian perspective: The posterior is a conditional distribution: $p(\theta|x) = \frac{p(x|\theta)p(\theta)}{p(x)}$

## 5. Law of Large Numbers (LLN)

As sample size $n \to \infty$, the sample mean $\bar{X}_n$ converges to the population mean $\mu$.

- Weak LLN: $\bar{X}_n \xrightarrow{p} \mu$ (converges in probability)
- Strong LLN: $\bar{X}_n \xrightarrow{a.s.} \mu$ (converges almost surely)

The LLN justifies why frequentist estimators become more precise with larger samples — and why Bayesian posteriors concentrate around the true value.

## 6. Central Limit Theorem (CLT)

For any distribution with mean $\mu$ and finite variance $\sigma^2$, the sample mean (properly scaled) converges to a normal distribution:

$$\frac{\bar{X}_n - \mu}{\sigma/\sqrt{n}} \xrightarrow{d} N(0, 1)$$

The CLT justifies:
- Frequentist: Normal approximations for confidence intervals and hypothesis tests
- Bayesian: For large samples, the posterior distribution approaches a normal distribution (Bernstein-von Mises theorem)

R — demonstrating CLT:
```r
# Exponential population (very non-normal)
means <- replicate(10000, mean(rexp(30, rate = 1)))
hist(means, breaks = 50, col = "steelblue", main = "CLT demo")
```

Python — demonstrating CLT:
```python
import numpy as np
import matplotlib.pyplot as plt
means = [np.mean(np.random.exponential(scale=1, size=30)) for _ in range(10000)]
plt.hist(means, bins=50, color='steelblue', edgecolor='black')
```

## 7. Conjugate Priors (Bayesian Connection)

Conjugate priors lead to posteriors in the same distribution family:

| Likelihood | Conjugate Prior | Posterior |
|-----------|-----------------|-----------|
| Binomial($n, \theta$) | Beta($\alpha, \beta$) | Beta($\alpha + k, \beta + n - k$) |
| Poisson($\lambda$) | Gamma($a, b$) | Gamma($a + \sum x_i, b + n$) |
| Normal($\mu, \sigma^2$), known $\sigma^2$ | Normal($\mu_0, \tau^2$) | Normal($\frac{\mu_0/\tau^2 + n\bar{x}/\sigma^2}{1/\tau^2 + n/\sigma^2}$, $\ldots$) |
| Normal($\mu, \sigma^2$), known $\mu$ | Inverse-Gamma($a, b$) | Inverse-Gamma($a + n/2, b + \frac{1}{2}\sum(x_i-\mu)^2$) |

## Resources

- Stat 110 (Harvard) — Probability by Blitzstein (free on YouTube)
- "Introduction to Probability" by Bertsekas & Tsitsiklis (MIT)
- Seeing Theory — interactive probability visualisations (https://seeing-theory.brown.edu)

## References

- Casella, G. & Berger, R. (2002). Statistical Inference. 2nd ed. Duxbury.
- Blitzstein, J. & Hwang, J. (2019). Introduction to Probability. CRC Press.

## Relevant notes

- [Fundamental Mathematics for Statistics](fundamental-mathematics-for-statistics.md)
- [Frequentist vs Bayesian Philosophy](frequentist-vs-bayesian-philosophy.md)
- [Bayesian Inference](bayesian-inference.md)
- [Frequentist Inference](frequentist-inference.md)