---
title: Descriptive Statistics & Data Visualisation
description: Measures of central tendency, dispersion, distribution visualisation with R and Python code
author: pi
editor: lam
date: 2026-06-01T21:04:48.592Z
tags:
  - roadmap
  - statistics
  - fundamental
---
# Descriptive Statistics & Data Visualisation

## Overview

Descriptive statistics summarise and describe the main features of a dataset. Both frequentist and Bayesian approaches use the same descriptive tools — the difference emerges in how they infer beyond the data. This note covers key numerical summaries and visualisation techniques, with code in R and Python.

## 1. Measures of Central Tendency

| Measure | Definition | When to use |
|---------|-----------|-------------|
| Mean ($\bar{x}$) | $\bar{x} = \frac{1}{n}\sum_{i=1}^n x_i$ | Symmetric distributions, no outliers |
| Median | Middle value when sorted | Skewed distributions, outliers present |
| Mode | Most frequent value | Categorical or multimodal data |

R:
```r
x <- c(1, 2, 2, 3, 10)
mean(x)                    # 3.6
median(x)                  # 2
names(which.max(table(x))) # "2"
```

Python:
```python
import numpy as np
from scipy import stats
x = np.array([1, 2, 2, 3, 10])
np.mean(x)                 # 3.6
np.median(x)               # 2.0
stats.mode(x, keepdims=True).mode  # 2
```

## 2. Measures of Dispersion

| Measure | Formula | Purpose |
|---------|---------|---------|
| Variance | $s^2 = \frac{1}{n-1}\sum (x_i - \bar{x})^2$ | Spread around mean (n-1 for sample) |
| Standard Deviation | $s = \sqrt{s^2}$ | Same units as data |
| IQR | $Q_3 - Q_1$ | Robust spread, not affected by outliers |
| Range | $\max - \min$ | Full spread, very sensitive to outliers |

## 3. Distribution Shape

- Skewness — asymmetry. Positive = right tail longer, Negative = left tail longer
- Kurtosis — tail heaviness. High kurtosis = more outliers
- A Normal distribution has skewness = 0 and kurtosis = 3

R:
```r
library(moments)
skewness(x)  # positive means right-skewed
kurtosis(x)  # >3 means heavy tails
```

Python:
```python
from scipy.stats import skew, kurtosis
skew(x)      # positive = right-skewed
kurtosis(x, fisher=True)  # >0 means heavy tails (excess kurtosis)
```

## 4. Key Visualisations

### Histogram
Shows the frequency distribution of a continuous variable.

R: `hist(x, breaks = 30, col = "steelblue")`
Python: `plt.hist(x, bins=30, color='steelblue', edgecolor='black')`

### Box Plot
Shows median, IQR (box), and outliers (points beyond 1.5×IQR).

R: `boxplot(x, ylab = "Value")`
Python: `plt.boxplot(x)`

### Q-Q Plot (Quantile-Quantile)
Compares observed quantiles to theoretical normal quantiles. Deviations from the diagonal indicate non-normality.

R: `qqnorm(x); qqline(x)`
Python: `stats.probplot(x, dist="norm", plot=plt)`

### Scatter Plot
Shows relationship between two continuous variables.

R: `plot(x, y, col = "steelblue", pch = 19)`
Python: `plt.scatter(x, y, color='steelblue')`

## 5. The Frequentist vs Bayesian Perspective on Description

- Frequentist: Descriptive statistics are "just the data" — the parameters are fixed unknown constants. The sample mean $\bar{x}$ is an unbiased estimator of the population mean $\mu$.
- Bayesian: The data are fixed (observed), and our uncertainty about parameters is expressed as a probability distribution. A Bayesian might report the posterior mean and 95% credible interval.

> Key insight: Both agree on how to describe data (means, variances, plots). They diverge on how to interpret uncertainty about the underlying parameters that generated the data.

## Resources

- R for Data Science by Wickham & Grolemund (free online: https://r4ds.had.co.nz)
- Python for Data Analysis by Wes McKinney
- ggplot2 (R) and seaborn (Python) for advanced visualisation

## References

- Tukey, J.W. (1977). Exploratory Data Analysis. Addison-Wesley.
- Wickham, H. (2016). ggplot2: Elegant Graphics for Data Analysis. Springer.

## Relevant notes

- [Fundamental Mathematics for Statistics](fundamental-mathematics-for-statistics.md)
- [Linear Algebra Essentials for Statistics](linear-algebra-essentials-for-statistics.md)
- [Frequentist Inference](frequentist-inference.md)
- [Frequentist vs Bayesian Philosophy](frequentist-vs-bayesian-philosophy.md)