---
title: End-to-End Comparative Statistical Analysis
description: 'Capstone project: analyse a real dataset using both frequentist and Bayesian methods, then compare findings with R and Python'
author: pi
editor: lam
date: 2026-06-01T21:10:09.908Z
tags:
  - roadmap
  - statistics
  - capstone
  - practical
---
# End-to-End Comparative Statistical Analysis

## Overview

This capstone project synthesises everything from the roadmap. You'll take a real dataset, analyse it using **both frequentist and Bayesian methods**, and compare the results. The goal is not just to apply techniques, but to understand **what each framework reveals** and **how they complement each other**. Code examples in both **R** and **Python**.

## 1. Dataset Suggestions

| Dataset | Domain | Best for | Location |
|---------|--------|----------|----------|
| **mtcars** | Automotive | Simple regression comparison (built-in R/Python) | Built into R/statsmodels |
| **Boston Housing** | Real estate | Multiple regression, model selection | sklearn.datasets |
| **Wage data (ISLR)** | Labour economics | Logistic regression, model comparison | ISLR package / ISLP data |
| **UC Berkeley Admissions** | Education | Simpson's paradox, causal inference | ggplot2::diamonds analogue |
| **CO₂ data** | Climate | Time series forecasting | datasets::co2 or Mauna Loa data |
| **Tip data** | Restaurant | GLM, ANOVA | seaborn/py dataset |
| **Penguins** | Biology | ANOVA, logistic regression | palmerpenguins / seaborn |

## 2. Suggested Analysis Workflow

### Phase 1: Exploratory Data Analysis
```r
# R
library(tidyverse); library(GGally)
data <- palmerpenguins::penguins
skimr::skim(data)  # summary statistics
ggplot(data, aes(x = bill_length_mm, y = bill_depth_mm, color = species)) +
  geom_point() + geom_smooth(method = "lm")
```

```python
import seaborn as sns; import pandas as pd
import matplotlib.pyplot as plt
data = sns.load_dataset("penguins")
print(data.describe())
sns.pairplot(data, hue="species")
```

### Phase 2: Frequentist Analysis
```r
# R — linear model
fit_freq <- lm(bill_depth_mm ~ bill_length_mm * species, data = data)
summary(fit_freq)
anova(fit_freq)
plot(fit_freq)  # diagnostics
```

```python
import statsmodels.api as sm
X = sm.add_constant(pd.get_dummies(data[['bill_length_mm', 'species']], drop_first=True))
fit_freq = sm.OLS(data['bill_depth_mm'].dropna(), X.dropna()).fit()
print(fit_freq.summary())
```

### Phase 3: Bayesian Analysis
```r
# R — brms
library(brms)
fit_bayes <- brm(bill_depth_mm ~ bill_length_mm * species,
                 data = data, chains = 4, iter = 2000,
                 prior = c(set_prior("normal(0, 5)", class = "b"),
                           set_prior("cauchy(0, 2)", class = "sigma")),
                 refresh = 0)
summary(fit_bayes)
conditional_effects(fit_bayes) |> plot()
```

```python
import pymc as pm
import pandas as pd

# Prepare data (one-hot encoding, etc.)
with pm.Model() as bayes_model:
    beta0 = pm.Normal('beta0', 0, 5)
    beta1 = pm.Normal('beta1', 0, 5)
    # ... more coefficients
    sigma = pm.HalfCauchy('sigma', 2)
    mu = beta0 + beta1 * bill_length + ...
    pm.Normal('y', mu=mu, sigma=sigma, observed=bill_depth)
    trace = pm.sample(2000, chains=4, progressbar=False)
    
pm.summary(trace)
```

### Phase 4: Comparison
| Aspect | Frequentist | Bayesian |
|--------|------------|----------|
| Coefficient for bill_length | -0.08 (p<0.001) | -0.08, 95% CrI [-0.10, -0.06] |
| Interaction significance | F=12.3, p=0.001 | $P(\beta_{interaction} > 0) = 0.998$ |
| R² / $R^2$ | 0.78 | Posterior $R^2$: 0.76 [0.72, 0.80] |
| Prediction for new point | 15.2 ± 1.1 (SE) | 15.1 [13.8, 16.5] (PI) |

### Phase 5: Write-up
- What do both frameworks agree on? (robust findings)
- Where do they differ? (sensitivity to priors, asymptotic approximations)
- What additional insight does each provide?

## 3. Going Further

- Add **hierarchical structure** (e.g., random intercept by island)
- Perform **model comparison** (AIC vs WAIC)
- Try **causal inference** (DAG for penguin species differences)
- Add **time series** if data has temporal structure

## References

- Horst, A.M. et al. (2020). "palmerpenguins: Palmer Archipelago (Antarctica) Penguin Data." R package.
- James, G. et al. (2021). *An Introduction to Statistical Learning*. 2nd ed. Springer.

## Relevant notes

- [[synthesis-reporting-communicating-statistical-findings]]
- [[AGENTS]]
- [[model-comparison-selection-bayesian-approach]]
- [[frequentist-vs-bayesian-philosophy]]