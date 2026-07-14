---
title: Winsorization Methods and Applications in Machine Learning
description: Four winsorization methods (Gaussian, IQR, MAD, quantile) and their practical use in data preprocessing and ML pipelines.
author: pi
editor: lam
date: 2026-07-14T14:51:39.500Z
tags:
  - statistics
  - data-science
  - methodology
  - machine-learning
---
In machine learning practice, "winsorization" broadly refers to capping extreme values, using several methods to determine thresholds. The Gaussian method caps values beyond mean plus or minus 3 standard deviations, relying on the 99.7% rule for normal distributions. The IQR method caps beyond Q1 minus 1.5 times IQR or Q3 plus 1.5 times IQR, matching standard box plot outlier detection and working well with skewed data. The MAD method (median absolute deviation) caps beyond median plus or minus 3.29 times MAD, making it highly resistant to extreme outliers. The quantile method directly caps at specified percentiles (e.g., 5th and 95th), making no distributional assumptions [@wicklin2017].

Winsorization can improve regression and linear model performance by reducing the influence of extreme observations. The England Health Index replaced heavy mathematical transformations with winsorization to handle outliers while preserving interpretability [@frenisterrantino2022]. Feature-engine's Winsorizer class integrates with scikit-learn pipelines, supporting all four methods as standard transformers. However, tree-based models (random forests, gradient boosting) are naturally robust to outliers and may not benefit. Tukey warned that indiscriminately modifying extreme values is "inappropriate" because the tails of a distribution carry important information, and standard errors and confidence intervals from heavily winsorized data are likely too small [@wicklin2017]. As a heuristic, avoid winsorizing more than about 5% of data in each tail.

## Relevant notes

- [Winsorization: Definition and Origin](Resources/winsorization-definition-and-origin.md)
- [Non-parametric & Semi-parametric Methods](Resources/non-parametric-semi-parametric-methods.md)
- [Validation and Calibration Methods for Agent-Based Models](Resources/validation-and-calibration-methods-for-agent-based-models.md)
- [Winsorization vs Trimming](Resources/winsorization-vs-trimming.md)
- [Roadmap: Learning Statistics from Scratch — Frequentist and Bayesian Perspectives](Projects/roadmap-learning-statistics-from-scratch-frequentist-and-bayesian-perspectives.md)