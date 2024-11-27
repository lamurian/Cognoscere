---
author: Lam
date: 2024-11-27T11:07:33+01:00
title: Introduction to linear regression
source:
- https://qingys.quarto.pub/introduction-to-linear-regression
tags:
- statistics
- mathematics
- model
---

# Basic concept of linear regression

$$
y_i = \beta_0 + \beta_i x_i + \epsilon_i
$$

- $\epsilon$ is the residual, *viz.* the variance we can't explain in the model
- The residual or error term is also termed as a nuisance parameter
- Error term has a feedback to the parameters we are estimating
- Assumptions on the error term:
  - $\epsilon_i \sim N(0, \sigma^2)$ $\to$ This is the most common assumption, i.e. the normality assumption
  - $E(\epsilon_i | x) = 0$ and $Var(\epsilon_i) = \sigma^2 < \infty$ $\to$ This is homogeneous variance assumption
  - $E(\epsilon_i | x) = 0$ and $Var(\epsilon_i) < \infty$
  - $E(\epsilon_i | x) \neq 0$

# Modelling the error term

- Model the first assumption using maximum likelihood estimation $\to$ Assume normality and homogeneous variance
- Model the second assumption using least square estimation $\to$ Assume only homogeneous variance
- Model the third assumption using empirical risk minimization estimation $\to$ Assume neither normality nor variance; this is the essence of machine learning
- Alternatively, we can model the third assumption using moment condition model $\to$ This is the essence of generalized estimation equation (GEE)
- It is recommended to use moment conditional model with sandwich variance estimation

# Shifts in modern statistics

- From a full parametric model to a semi-parametric model or a misspecified model
- From the true value to the pseudo-true value
- Quantify the uncertainty based on the pseudo-true value
