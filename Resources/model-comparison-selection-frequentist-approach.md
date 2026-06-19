---
title: 'Model Comparison & Selection: Frequentist Approach'
description: AIC, BIC, likelihood ratio tests, cross-validation, and regularisation for model selection from the frequentist perspective
author: pi
editor: lam
date: 2026-06-01T21:07:29.047Z
tags:
  - roadmap
  - statistics
  - intermediate
  - frequentist
---
# Model Comparison & Selection: Frequentist Approach

## Overview

Frequentist model selection involves choosing between competing models using criteria that balance goodness of fit with model complexity to avoid overfitting. This note covers likelihood ratio tests, AIC, BIC, cross-validation, and regularisation, with code in R and Python.

## 1. Likelihood Ratio Test (LRT)

For nested models (Model A is a special case of Model B):

$$\Lambda = -2 \log\left(\frac{L(\text{simple model})}{L(\text{complex model})}\right) \sim \chi^2_{df_2 - df_1}$$

R:
```r
fit_simple <- lm(mpg ~ wt, data = mtcars)
fit_complex <- lm(mpg ~ wt + hp + am, data = mtcars)
anova(fit_simple, fit_complex)  # LRT for nested models
```

Python:
```python
import statsmodels.api as sm
fit_simple = sm.OLS(y, sm.add_constant(X_simple)).fit()
fit_complex = sm.OLS(y, sm.add_constant(X_complex)).fit()
sm.stats.anova_lm(fit_simple, fit_complex)
```

## 2. AIC (Akaike Information Criterion)

$$AIC = -2\log(L) + 2k$$
- $k$ = number of parameters
- Lower AIC = better model (after complexity penalty)
- Based on information theory — minimises KL divergence
- AIC differences $\Delta > 2$ are considered meaningful
- AIC weights: $w_i = \frac{\exp(-\frac{1}{2}\Delta_i)}{\sum_j \exp(-\frac{1}{2}\Delta_j)}$ — interpretable as probability that model $i$ is best

R: `AIC(fit_complex)` or `stepAIC(fit_complex)` for stepwise selection
Python: `fit_complex.aic` after fitting with statsmodels

## 3. BIC (Bayesian Information Criterion)

$$BIC = -2\log(L) + k\log(n)$$
- Penalises complexity more strongly than AIC (uses $\log(n)$ instead of 2)
- For $n > 8$, BIC penalty $> 2$, so BIC prefers simpler models than AIC
- Consistent: with $n \to \infty$, BIC selects the true model if it's in the candidate set

R: `BIC(fit_complex)`
Python: `fit_complex.bic`

## 4. Cross-Validation (CV)

### k-Fold Cross-Validation
1. Split data into $k$ folds (typically 5 or 10)
2. Train model on $k-1$ folds, predict on held-out fold
3. Repeat for all $k$ folds, average prediction error

R:
```r
library(boot)
cost <- function(y, yhat) mean((y - yhat)^2)
cv.glm(data, glm_model, cost = cost, K = 5)$delta
```

Python:
```python
from sklearn.model_selection import cross_val_score
from sklearn.linear_model import LinearRegression
scores = cross_val_score(LinearRegression(), X, y, cv=5, scoring='neg_mean_squared_error')
-np.mean(scores)  # CV MSE
```

## 5. Which Criterion to Use?

| Criterion | Goal | Best for |
|-----------|------|----------|
| LRT | Compare nested models | Hypothesis testing of specific parameters |
| AIC | Minimise prediction error | Prediction-focused modelling |
| BIC | Identify true model | Explanation-focused modelling (large $n$) |
| k-fold CV | Estimate out-of-sample error | Model selection, any scenario |
| Adjusted $R^2$ | Population $R^2$ | Simple linear models |

## 6. Caution: Stepwise Selection

Automated stepwise AIC/BIC selection is not recommended (it overfits, invalidates p-values, and yields unstable models). Better approaches:
- Use lasso for automatic shrinkage + selection (coherent framework)
- Use all-subsets with a validation set
- Use domain knowledge to select models

## References

- Burnham, K.P. & Anderson, D.R. (2002). Model Selection and Multimodel Inference. 2nd ed. Springer.
- Hastie, T., Tibshirani, R. & Friedman, J. (2009). The Elements of Statistical Learning. 2nd ed. Springer.
- James, G. et al. (2021). An Introduction to Statistical Learning. 2nd ed. Springer.

## Relevant notes

- [Model Comparison & Selection: Bayesian Approach](model-comparison-selection-bayesian-approach.md)
- [Model Comparison: Frequentist vs Bayesian Comparison](model-comparison-frequentist-vs-bayesian-comparison.md)
- [Experimental Design & ANOVA: Frequentist Approach](experimental-design-anova-frequentist-approach.md)
- [Linear & Logistic Regression: Bayesian Approach](linear-logistic-regression-bayesian-approach.md)