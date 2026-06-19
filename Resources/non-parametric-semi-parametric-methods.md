---
title: Non-parametric & Semi-parametric Methods
description: Bootstrap, permutation tests, kernel density estimation, Gaussian processes, and Dirichlet processes with R and Python
author: pi
editor: lam
date: 2026-06-01T21:08:51.290Z
tags:
  - roadmap
  - statistics
  - advanced
---
# Non-parametric & Semi-parametric Methods

## Overview

Non-parametric methods make fewer assumptions about the data-generating process. They're useful when parametric assumptions fail, when you have complex data structures, or when you want distribution-free inference. This note covers the most important non-parametric methods from both frequentist and Bayesian perspectives, with R and Python.

## 1. Bootstrap (Frequentist)

The bootstrap resamples the data with replacement to estimate the sampling distribution of any statistic:

Algorithm:
1. For $b = 1$ to $B$ (e.g., $B = 10000$):
   - Draw $n$ observations with replacement from original data
   - Compute the statistic of interest $\hat{\theta}^{(b)}$
2. Use the empirical distribution of $\hat{\theta}^{(1)}, ..., \hat{\theta}^{(B)}$ for inference

R:
```r
library(boot)
mean_fun <- function(data, idx) mean(data[idx])
boot_result <- boot(data, mean_fun, R = 10000)
boot.ci(boot_result, type = "perc")  # percentile CI
```

Python:
```python
from scipy.stats import bootstrap
import numpy as np
res = bootstrap((data,), np.mean, n_resamples=10000, method='percentile')
print(res.confidence_interval)
```

### Bootstrap for Regression
R: `library(car); Boot(lm(y ~ x, data), R = 2000)`
Python: `from sklearn.utils import resample`

## 2. Permutation Tests

A non-parametric alternative to t-tests and ANOVA. Under $H_0$ (no group difference), the group labels are exchangeable.

Algorithm:
1. Compute observed test statistic $T_{obs}$ (e.g., difference in means)
2. For $b = 1$ to $B$: randomly shuffle group labels, recompute $T^{(b)}$
3. p-value = $\frac{1}{B} \sum I(|T^{(b)}| \geq |T_{obs}|)$

R: `library(coin); independence_test(y ~ group, data)`
Python: `from mlxtend.evaluate import permutation_test`

## 3. Kernel Density Estimation (KDE)

Estimate the PDF without assuming a parametric form:

$$\hat{f}(x) = \frac{1}{nh} \sum_{i=1}^n K\left(\frac{x - x_i}{h}\right)$$

$K$ is a kernel (e.g., Gaussian), $h$ is the bandwidth (smoothing parameter).

R: `density(x, kernel = "gaussian", bw = "SJ")`
Python: `scipy.stats.gaussian_kde(x)` or `sklearn.neighbors.KernelDensity`

## 4. Gaussian Processes (Bayesian Non-parametric)

GPs place a prior over functions directly:

$$f(x) \sim GP(m(x), k(x, x'))$$

- $m(x)$: mean function (often 0)
- $k(x, x')$: covariance/kernel function (e.g., RBF, Matern)
- Key insight: Instead of learning parameters of a fixed functional form, the data determines the function shape through the kernel

R:
```r
library(kernlab)
gp <- gausspr(x, y, kernel = "rbfdot", variance.model = TRUE)
```

Python:
```python
from sklearn.gaussian_process import GaussianProcessRegressor
from sklearn.gaussian_process.kernels import RBF, WhiteKernel
kernel = RBF(length_scale=1.0) + WhiteKernel(noise_level=1.0)
gp = GaussianProcessRegressor(kernel=kernel, n_restarts_optimizer=10)
gp.fit(X, y)
```

## 5. Dirichlet Processes (Bayesian Non-parametric)

DPs are distributions over distributions — they can handle an infinite number of mixture components:

$$G \sim DP(\alpha, G_0)$$
- $\alpha$: concentration parameter (higher = more components)
- $G_0$: base distribution (expected shape)

Use case: Discovering the number of clusters from data without fixing $k$ in advance.

Python (PyMC):
```python
import pymc as pm

with pm.Model() as dpmm:
    alpha = pm.Gamma('alpha', 1, 1)
    # Dirichlet process mixture
    pm.DirichletMultinomial('z', a=alpha/n_clusters, n=n, shape=n)
    ...
```

## 6. Comparison: Bootstrap vs Bayesian Non-parametric

| Method | Perspective | What it does | Best for |
|--------|-------------|--------------|---------|
| Bootstrap | Frequentist | Resample data | Uncertainty estimation, no assumptions |
| Permutation test | Frequentist | Shuffle labels | Hypothesis testing, no distributional assumptions |
| KDE | Frequentist | Smooth density | Visualising distributions |
| Gaussian Process | Bayesian | Prior over functions | Regression, spatial data, small $n$, interpolation |
| Dirichlet Process | Bayesian | Infinite mixtures | Clustering with unknown $k$, density estimation |

## References

- Efron, B. & Tibshirani, R. (1993). An Introduction to the Bootstrap. Chapman & Hall.
- Rasmussen, C.E. & Williams, C.K.I. (2006). Gaussian Processes for Machine Learning. MIT Press.
- Teh, Y.W. (2010). "Dirichlet Processes." Encyclopedia of Machine Learning. Springer.

## Relevant notes

- [Fundamental Mathematics for Statistics](fundamental-mathematics-for-statistics.md)
- [Descriptive Statistics & Data Visualisation](descriptive-statistics-data-visualisation.md)
- [Linear Algebra Essentials for Statistics](linear-algebra-essentials-for-statistics.md)
- [Causal Inference: Bayesian Approach](causal-inference-bayesian-approach.md)