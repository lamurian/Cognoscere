---
author: Lam
date: 2024-11-27T13:01:57+01:00
title: Elaborate introduction to linear regression
source:
- https://qingys.quarto.pub/introduction-to-linear-regression
- https://chatgpt.com/share/67470960-1578-8006-88b8-40e837805880
tags:
- statistics
- mathematics
- model
---

# Basic Concept of Linear Regression

Linear regression is a fundamental statistical technique used to model the relationship between a dependent variable $y_i$ and an independent variable $x_i$. The relationship is expressed as:

$$
y_i = \beta_0 + \beta_i \cdot x_i + \epsilon_i
$$

- Key Components:
  - $\beta_0$: The intercept of the regression line, representing the value of $y_i$ when $x_i = 0$.
  - $\beta_i$: The slope coefficient, quantifying the change in $y_i$ for a one-unit change in $x_i$.
  - $\epsilon_i$: The residual (or error term), which captures the variability in $y_i$ that is not explained by the linear relationship with $x_i$.

# The Role of the Residual ($\epsilon_i$):

1. Definition: Residuals account for the deviation of observed data from the model-predicted values. They represent the "noise" or unexplained variance.
2. Feedback Effect: Since residuals capture unexplained variance, they influence the estimation of the model parameters ($\beta_0$ and $\beta_i$).
3. Assumptions: Assumptions about the residuals are crucial for making valid statistical inferences.

# Common Assumptions on the Error Term ($\epsilon_i$):

1. Normality ($\epsilon_i \sim N(0, \sigma^2)$): 
   - The most common assumption, implying residuals are normally distributed with a mean of 0 and variance $\sigma^2$.
2. Homoscedasticity ($Var(\epsilon_i) = \sigma^2 < \infty$): 
   - Residuals have constant variance regardless of the value of $x_i$.
3. Unbiasedness ($E(\epsilon_i | x) = 0$): 
   - The expected value of the residual, conditional on $x_i$, is zero. This ensures the model provides unbiased estimates.
4. Violations:
   - $E(\epsilon_i | x) \neq 0$: Suggests model misspecification or omitted variable bias, where the residuals systematically depend on $x_i$.

---

# Modelling the Error Term

The error term ($\epsilon_i$) can be modeled under different assumptions depending on the context and objectives of the analysis:

1. Maximum Likelihood Estimation (MLE):
   - Assumes normality and homoscedasticity ($\epsilon_i \sim N(0, \sigma^2)$).
   - Uses the likelihood function to estimate parameters that maximize the probability of observing the data.

2. Least Squares Estimation (LSE):
   - Relaxes the normality assumption and assumes only homoscedasticity ($Var(\epsilon_i) = \sigma^2$).
   - Minimizes the sum of squared residuals to find parameter estimates.

3. Empirical Risk Minimization (ERM):
   - Makes no assumptions about the distribution or variance of the error term.
   - Focuses on minimizing a predefined loss function. This forms the basis of many machine learning algorithms.

4. Moment Condition Models:
   - Also known as generalized estimation equations (GEE).
   - Relies on assumptions about the relationships (moments) between variables rather than the full distribution of errors.
   - Sandwich variance estimation is recommended for robust standard error calculation under these conditions.

---

# Shifts in Modern Statistics

In recent decades, there have been significant shifts in statistical modeling, reflecting changes in data complexity and analysis goals:

1. From Parametric to Semi-Parametric or Misspecified Models:
   - Parametric models assume a fully specified form for the data distribution (e.g., normal distribution for errors).
   - Semi-parametric models relax some of these assumptions, focusing on flexible relationships between variables.
   - Misspecified models accept that the assumed model may not perfectly describe the data but can still provide useful approximations.

2. From True to Pseudo-True Values:
   - The true value refers to the actual parameter value in the underlying data-generating process.
   - The pseudo-true value is the parameter value estimated under a misspecified model. It minimizes the discrepancy between the model and the data.

3. Uncertainty Quantification:
   - Modern methods quantify uncertainty around pseudo-true values rather than assuming perfect model specification.
   - This involves robust estimation techniques to account for potential violations of classical assumptions.

---

# Takeaways

This text provides a roadmap from classical regression modeling to modern statistical methods. It highlights the evolution of error modeling techniques, the increasing reliance on robust and flexible assumptions, and the philosophical shift towards accepting misspecification in complex data contexts. Understanding these concepts is critical for applying appropriate techniques in both traditional and machine learning frameworks.

# Relevant notes

- [introduction-to-linear-regression](Resources/introduction-to-linear-regression.md) 
