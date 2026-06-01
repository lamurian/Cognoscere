---
title: 'Hierarchical / Multilevel Models: Frequentist Approach'
description: Mixed-effects models, random intercepts/slopes, lme4, and variance components from the frequentist perspective
author: pi
editor: lam
date: 2026-06-01T21:08:51.276Z
tags:
  - roadmap
  - statistics
  - advanced
  - frequentist
---
# Hierarchical / Multilevel Models: Frequentist Approach

## Overview

Multilevel (hierarchical) models handle data with grouped structure — students in classrooms, patients in hospitals, repeated measures within subjects. The frequentist approach uses mixed-effects models with fixed and random effects, estimated via REML (Restricted Maximum Likelihood). Code in R and Python.

## 1. When to Use Multilevel Models

- Data has clustering or nesting (e.g., students within schools)
- Repeated measures within subjects (longitudinal data)
- Partial pooling — groups with few observations borrow strength from groups with many observations
- You want to estimate both fixed and random effects

## 2. The Mixed Model Equation

$$y = X\beta + Zb + \varepsilon$$
- $\beta$: fixed effects (population-level coefficients)
- $b$: random effects (group-level deviations), $b \sim N(0, \Sigma_b)$
- $\varepsilon$: residuals, $\varepsilon \sim N(0, \sigma^2 I)$
- $Z$: design matrix for random effects

## 3. Random Intercept Model

$$y_{ij} = \beta_0 + b_{0j} + \beta_1 x_{ij} + \varepsilon_{ij}, \quad b_{0j} \sim N(0, \tau^2)$$

- Each group $j$ has its own intercept shift $b_{0j}$
- Partial pooling: $\hat{b}_{0j}$ = $\frac{n_j/\sigma^2}{n_j/\sigma^2 + 1/\tau^2} \times \text{(group mean deviation)}$
- Groups with few observations are pulled toward the grand mean

R (lme4):
```r
library(lme4)
model_ri <- lmer(score ~ 1 + hours + (1 | school), data = data)
summary(model_ri)
ranef(model_ri)  # random intercepts
fixef(model_ri)  # fixed effects
```

Python (statsmodels):
```python
import statsmodels.api as sm
from statsmodels.formula.api import mixedlm
model_ri = mixedlm("score ~ 1 + hours", data, groups=data["school"])
result_ri = model_ri.fit()
print(result_ri.summary())
```

## 4. Random Slope Model

$$y_{ij} = \beta_0 + b_{0j} + (\beta_1 + b_{1j}) x_{ij} + \varepsilon_{ij}$$

Both intercept and slope vary by group. The random effects $[b_{0j}, b_{1j}]^T \sim N(0, \Sigma)$ where $\Sigma$ contains variance components and a possible correlation.

R: `lmer(score ~ hours + (1 + hours | school), data)`
Python: `mixedlm("score ~ hours", data, groups=data["school"], re_formula="1 + hours")`

## 5. Variance Components

| Component | Interpretation |
|-----------|---------------|
| Intraclass Correlation (ICC) | $\frac{\tau^2}{\tau^2 + \sigma^2}$ — proportion of variance explained by groups |
| Between-group variance $\tau^2$ | How much groups differ |
| Within-group variance $\sigma^2$ | How much individuals differ within groups |

R — ICC: `performance::icc(model_ri)`
Python: `result_ri.cov_re / (result_ri.cov_re + result_ri.scale)`

## 6. Likelihood Ratio Tests for Random Effects

Compare models with and without a random effect:

R: `anova(model_with_rf, model_without_rf)` — note: p-value is conservative (boundary issue)

## 7. Extensions

| Model | lme4 syntax | Description |
|-------|-------------|-------------|
| Three-level | `(1 | school / class)` | Nested groups |
| Crossed | `(1 | subject) + (1 | item)` | Not nested (e.g., subjects and items) |
| Longitudinal | `(1 + time | subject)` | Growth curves |

## References

- Gelman, A. & Hill, J. (2007). Data Analysis Using Regression and Multilevel/Hierarchical Models. Cambridge.
- Bates, D. et al. (2015). "Fitting Linear Mixed-Effects Models Using lme4." Journal of Statistical Software, 67(1): 1-48.
- Snijders, T. & Bosker, R. (2012). Multilevel Analysis. 2nd ed. Sage.

## Relevant notes

- [[hierarchical-multilevel-models-bayesian-approach]]
- [[hierarchical-models-frequentist-vs-bayesian-comparison]]
- [[experimental-design-anova-frequentist-vs-bayesian-comparison]]
- [[regression-frequentist-vs-bayesian-comparison]]