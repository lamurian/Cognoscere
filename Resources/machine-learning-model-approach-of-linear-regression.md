---
author: Lam
date: 2024-12-04T11:42:22+01:00
title: Machine learning model approach of linear regression
source:
- https://qingys.quarto.pub/introduction-to-linear-regression/#machine-learning
tags:
- statistics
- mathematics
- model
---

- In real-world cases, linear models usually contain the exposure and covariates
- This complex relationship is not adequately captured by the [classical approach](Resources/introduction-to-linear-regression.md) 
- Regression with residual:
  - Option 1:
    - Fit a machine learning model with DV ~ covariates
    - Calculate the residual
    - Fit a univariate linear regression model with residual ~ exposure
  - Option 2:
    - Fit a machine learning model with exposure ~ covariates
    - Calculate the residual
    - Fit a univariate linear regression model with Y ~ residual
- Regression with double residuals, i.e. debiased machine learning
  - Fit a machine learning model with DV ~ covariates
  - Fit a machine learning model with exposure ~ covariates
  - Extract residual_DV and residual_exposure
  - Fit a univariate linear regression model with residual_DV ~ residual_exposure

# Take-home notes

- Regression with residual performs better than standard linear regression
- Changing the machine learning model with classical statistical model results in worse performance
- Debiased machine learning (DML) is more preferred than regression with single residual
