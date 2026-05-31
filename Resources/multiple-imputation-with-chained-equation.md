---
author: Lam
date: 2026-01-21T11:09:00+01:00
title: Multiple imputation with chained equation
---

- MICE: Multiple Imputation with Chained Equation
- Understand the cause of missing data $\to$ Not all can be imputed with MICE:
  - MCAR
  - MAR: Missingness depends on the observed data; and it can be adequately imputed with MICE
  - MNAR: Missingness depends on unobserved data; might complicate the imputation process
- Missing indicator analysis: One-hot encoding on missing values, then use this variable in the model $\to$ Significance might indicate MAR
- During imputation, first step is to subset the data based on the categorical dependent variable $\to$ This is to prevent the independent variables from each group interfering with one another
