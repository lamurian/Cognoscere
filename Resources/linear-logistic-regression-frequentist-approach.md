---
title: 'Linear & Logistic Regression: Frequentist Approach'
description: OLS, GLM, logistic regression, model diagnostics, regularisation from the frequentist perspective with R and Python
author: pi
editor: lam
date: 2026-06-01T21:06:38.698Z
tags:
  - roadmap
  - statistics
  - intermediate
  - frequentist
---
# Linear & Logistic Regression: Frequentist Approach

## Overview

Regression modelling is the most widely used statistical tool. The frequentist approach estimates fixed coefficients that minimise error (OLS) or maximise likelihood (MLE), with uncertainty quantified via standard errors, confidence intervals, and hypothesis tests. Code examples in R and Python.

## 1. Ordinary Least Squares (OLS) Regression

$$y_i = \beta_0 + \beta_1 x_{i1} + \ldots + \beta_p x_{ip} + \varepsilon_i, \quad \varepsilon_i \sim N(0, \sigma^2)$$

The OLS estimator minimises $\sum (y_i - \hat{y}_i)^2$:

$$\hat{\beta}_{OLS} = (X^T X)^{-1} X^T y$$

### Key Properties
- Unbiased: $E[\hat{\beta}] = \beta$
- BLUE: Best Linear Unbiased Estimator (Gauss-Markov theorem)
- Sampling distribution: $\hat{\beta} \sim N(\beta, \sigma^2 (X^T X)^{-1})$

R:
```r
model <- lm(mpg ~ wt + hp, data = mtcars)
summary(model)  # coefficients, SEs, t-values, p-values
confint(model)  # 95% confidence intervals
```

Python:
```python
import statsmodels.api as sm
X = sm.add_constant(mtcars[['wt', 'hp']])
y = mtcars['mpg']
model = sm.OLS(y, X).fit()
print(model.summary())
print(model.conf_int())  # 95% confidence intervals
```

## 2. Model Diagnostics

| Diagnostic | What it checks | R | Python |
|-----------|---------------|----------------|----------------|
| Residuals vs Fitted | Linearity, homoscedasticity | `plot(model, which=1)` | `sm.qqplot(resids, line='s')` |
| Q-Q plot | Normality of residuals | `plot(model, which=2)` | `scipy.stats.probplot` |
| Scale-Location | Homoscedasticity | `plot(model, which=3)` | `plt.scatter(fitted, sqrt(abs(std_resids)))` |
| Cook's distance | Influential points | `plot(model, which=4)` | `statsmodels.stats.outliers_influence` |

## 3. Logistic Regression

For binary outcomes ($y \in \{0, 1\}$):

$$\log\left(\frac{p}{1-p}\right) = \beta_0 + \beta_1 x_1 + \ldots + \beta_p x_p$$

Estimated via MLE (no closed form — uses iterative reweighted least squares).

R:
```r
model_logit <- glm(am ~ wt + hp, data = mtcars, family = binomial)
summary(model_logit)
exp(coef(model_logit))  # odds ratios
```

Python:
```python
import statsmodels.formula.api as smf
model_logit = smf.logit('am ~ wt + hp', data=mtcars).fit()
print(model_logit.summary())
print(np.exp(model_logit.params))  # odds ratios
```

## 4. Regularisation (Ridge & Lasso)

When $p \gg n$ or to prevent overfitting, add a penalty:

- Ridge ($L_2$): $\hat{\beta}_{ridge} = \arg\min ||y - X\beta||^2 + \lambda||\beta||^2$
- Lasso ($L_1$): $\hat{\beta}_{lasso} = \arg\min ||y - X\beta||^2 + \lambda||\beta||_1$

R: `library(glmnet)` — `glmnet(X, y, alpha=0)` for ridge, `alpha=1` for lasso
Python: `from sklearn.linear_model import Ridge, Lasso`

## 5. Hypothesis Testing in Regression

- Overall F-test: Tests whether any predictor is significant
- Individual t-tests: Tests $H_0: \beta_j = 0$ for each coefficient
- Partial F-test: Compare nested models (with/without a set of predictors)

## References

- James, G. et al. (2021). An Introduction to Statistical Learning. 2nd ed. Springer.
- Fox, J. (2016). Applied Regression Analysis and Generalized Linear Models. 3rd ed. Sage.
- Harrell, F. (2015). Regression Modeling Strategies. 2nd ed. Springer.

## Relevant notes

- [[linear-logistic-regression-bayesian-approach]]
- [[linear-algebra-essentials-for-statistics]]
- [[regression-frequentist-vs-bayesian-comparison]]
- [[frequentist-vs-bayesian-philosophy]]