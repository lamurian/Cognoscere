---
title: 'Roadmap: Learning Statistics from Scratch — Frequentist and Bayesian Perspectives'
description: Master roadmap for learning statistics from scratch with both frequentist and Bayesian perspectives over 6 months. All code in R and Python.
author: pi
editor: lam
date: 2026-06-01T21:11:02.203Z
tags:
  - roadmap
  - statistics
  - index
---

# Roadmap: Learning Statistics from Scratch — Frequentist and Bayesian Perspectives

## Overview

This roadmap guides you from **high-school mathematics** to **confident applied statistician** in **6 months**, covering the full spectrum of statistical reasoning from both **frequentist** and **Bayesian** perspectives. You'll learn not just one framework, but both — understanding their philosophical foundations, practical trade-offs, and when to use each.

Every topic includes code examples in **both R and Python**, so you can follow along in whichever language you prefer (or both).

**Who this is for:** Self-taught learners with high-school math background who have some exposure to R and data analysis but want systematic, dual-perspective training.

**Estimated time:** ~6 months (24–26 weeks) at 8–12 hours per week.

**Prerequisites:** High-school algebra, basic familiarity with R or Python, curiosity about uncertainty.

## Tools and Setup

| Tool | Language | Purpose |
|------|----------|---------|
| **R + RStudio** | R | Statistical computing, brms, lme4, forecast |
| **Python + Jupyter** | Python | PyMC, statsmodels, sklearn, scipy |
| **Quarto** | Both | Reproducible reports in R and/or Python |
| **Stan / cmdstanr** | R interface | Gold-standard Bayesian computation (HMC) |
| **Git** | — | Version control for your analysis projects |

Installation guides:
- R: https://cran.r-project.org + https://posit.co/download/rstudio-desktop/
- Python: https://www.anaconda.com/download (includes Jupyter)
- Stan: https://mc-stan.org/users/interfaces/cmdstanr

## How to Use This Roadmap

1. **Go sequentially** — Each milestone builds on the previous one
2. **Code everything** — Type out every R and Python example, don't copy-paste
3. **Do the checkpoints** — Each milestone has a concrete deliverable
4. **Use both frameworks** — For every analysis, ask: \"What would the frequentist say? What would the Bayesian say?\"
5. **Revisit milestones** — When you reach the capstone, you'll want to revisit earlier topics

---

## Milestone 1: Foundations of Mathematics & Probability

> **Epic:** Master the essential math, descriptive tools, and probability theory that underpin all statistical inference.

**Estimated effort:** 4 weeks (Weeks 1–4)
**Checkpoint:** Solve 20 probability problems from Stat 110; write a descriptive summary of a dataset of your choice in both R and Python.

### Steps

1. **[[fundamental-mathematics-for-statistics]]** — Calculus basics (derivatives, integrals, optimisation), Kolmogorov's probability axioms, combinatorics, set theory, Bayes' theorem
2. **[[descriptive-statistics-data-visualisation]]** — Measures of central tendency and dispersion, histograms, box plots, Q-Q plots, skewness, kurtosis. R: `ggplot2`; Python: `seaborn` + `matplotlib`
3. **[[linear-algebra-essentials-for-statistics]]** — Vectors, matrices, dot products, matrix multiplication, eigenvalues, Cholesky decomposition. The hidden workhorse of all statistics.
4. **[[probability-distributions-random-variables]]** — Discrete (Bernoulli, Binomial, Poisson) and continuous (Normal, Beta, Gamma, t) distributions, PDF/PMF/CDF, Law of Large Numbers, Central Limit Theorem, conjugate prior relationships

### Guiding questions
- What calculus concepts are essential for understanding MLE and Bayesian posterior computation?
- How do frequentist and Bayesian approaches differ in describing data and uncertainty?
- What linear algebra is needed for OLS (normal equations) and Bayesian regression (covariance structures)?
- How does the CLT justify frequentist inference, and how do conjugate priors connect distributions in Bayesian analysis?

### Key resources
- **Stat 110 (Harvard)** — free YouTube lectures by Joe Blitzstein
- **\"Seeing Theory\"** — interactive probability visualisations (seeing-theory.brown.edu)
- **Khan Academy** — Calculus and Linear Algebra refresher
- **R for Data Science** (r4ds.had.co.nz) — data visualisation and wrangling

---

## Milestone 2: Core Inference Frameworks

> **Epic:** Understand both frequentist and Bayesian inference — their mechanics, interpretations, and philosophical foundations.

**Estimated effort:** 4 weeks (Weeks 5–8)
**Checkpoint:** Take a simple dataset, compute both a frequentist 95% CI and a Bayesian 95% CrI for the mean. Explain the difference in plain language.

### Steps

1. **[[frequentist-inference]]** — Maximum Likelihood Estimation (MLE), hypothesis testing (Neyman-Pearson), p-values, confidence intervals, Type I/II errors, power analysis. R: `t.test`, `pwr`; Python: `scipy.stats`, `statsmodels`
2. **[[bayesian-inference]]** — Bayes' theorem, prior/likelihood/posterior, conjugate priors (Beta-Binomial, Normal-Normal), credible intervals, MAP estimation. R: `brms`; Python: `PyMC`
3. **[[frequentist-vs-bayesian-philosophy]]** — Epistemic vs aleatory uncertainty, interpretations of probability, the subjectivity/objectivity debate, the Fisher-Neyman-Pearson historical split, modern pragmatic reconciliation

### Guiding questions
- How does the Neyman-Pearson framework formalise hypothesis testing, and what do p-values actually mean?
- How does Bayes' theorem turn prior beliefs into posterior knowledge?
- What are the core philosophical differences, and when is each framework appropriate?

### Key resources
- **\"Statistical Inference\"** (Casella & Berger) — the canonical frequentist text
- **\"Bayesian Data Analysis\"** (Gelman et al., 3rd ed.) — free PDF, the Bayesian bible
- **ASA Statement on p-Values** (Wasserstein & Lazar, 2016)

---

## Milestone 3: Regression & Bayesian Computation

> **Epic:** Apply regression models in both paradigms and learn the computational tools that make Bayesian analysis practical.

**Estimated effort:** 4 weeks (Weeks 9–12)
**Checkpoint:** Fit a linear regression to a real dataset using OLS (R: `lm`, Python: `statsmodels`) and Bayesian (R: `brms`, Python: `PyMC`). Compare and interpret the coefficients.

### Steps

1. **[[linear-logistic-regression-frequentist-approach]]** — OLS estimation, normal equations, model diagnostics, logistic regression, regularisation (ridge/lasso via glmnet)
2. **[[linear-logistic-regression-bayesian-approach]]** — Priors on coefficients, posterior inference, shrinkage (Bayesian = ridge), posterior predictive checks, Bayesian logistic regression
3. **[[regression-frequentist-vs-bayesian-comparison]]** — When they agree (flat priors → OLS equivalent), when they diverge (small n, informative priors, prediction intervals)
4. **[[bayesian-computation-mcmc-and-modern-tools]]** — Why MCMC is needed, Metropolis-Hastings, Gibbs sampling, Hamiltonian Monte Carlo (HMC) + NUTS, convergence diagnostics (R-hat, ESS, trace plots), Stan, PyMC, brms

### Guiding questions
- How is linear regression estimated differently under OLS vs Bayesian posterior sampling?
- How do MCMC algorithms work, and what do convergence diagnostics tell us?
- How do coefficients and uncertainty estimates differ between the two approaches?

### Key resources
- **\"An Introduction to Statistical Learning\"** (ISLR/ISLP) — regression foundations, free PDF
- **\"Statistical Rethinking\"** (McElreath) — Bayesian regression from the ground up, YouTube lectures
- **Stan documentation** (mc-stan.org) — best HMC implementation
- **PyMC examples gallery** (pymc.io)

---

## Milestone 4: Experimental Design & Model Selection

> **Epic:** Design experiments, compare groups, and select models using criteria from both frameworks.

**Estimated effort:** 3 weeks (Weeks 13–15)
**Checkpoint:** Design an A/B test, compute both a frequentist power analysis and a Bayesian posterior probability of treatment > control.

### Steps

1. **[[experimental-design-anova-frequentist-approach]]** — t-tests (one, two, paired), one/two-way ANOVA, A/B testing, multiple comparisons (Bonferroni, Tukey, FDR), power analysis
2. **[[experimental-design-anova-bayesian-approach]]** — BEST (Bayesian Estimation Supersedes the t-Test), Bayesian ANOVA, Bayesian A/B testing (Beta-Binomial), Bayesian power analysis via simulation
3. **[[experimental-design-anova-frequentist-vs-bayesian-comparison]]** — Stopping rules, multiple comparisons debate, intuitive interpretation of results
4. **[[model-comparison-selection-frequentist-approach]]** — Likelihood ratio tests, AIC, BIC, k-fold cross-validation, pitfalls of stepwise selection
5. **[[model-comparison-selection-bayesian-approach]]** — Bayes factors, WAIC, LOO-CV (PSIS), spike-and-slab priors, Bayesian model averaging
6. **[[model-comparison-frequentist-vs-bayesian-comparison]]** — When AIC ≈ LOO, when Bayes factors differ from BIC, practical decision flowchart

### Guiding questions
- How do classical t-tests/ANOVA differ from Bayesian alternatives (BEST, Bayesian ANOVA)?
- How do AIC/BIC compare to Bayes factors and WAIC for model selection?
- Do we really need to correct for multiple comparisons in Bayesian analysis?

### Key resources
- **\"Design and Analysis of Experiments\"** (Montgomery, 9th ed.)
- **\"Doing Bayesian Data Analysis\"** (Kruschke, 2nd ed.) — BEST, Bayesian ANOVA
- **Vehtari et al. (2017)** — Practical Bayesian model evaluation using LOO-CV
- **Gelman et al. (2012)** — \"Why we (usually) don't have to worry about multiple comparisons\"

---

## Milestone 5: Advanced Models — Hierarchical & Non-parametric

> **Epic:** Handle grouped data with multilevel models and flexible non-parametric methods.

**Estimated effort:** 4 weeks (Weeks 16–19)
**Checkpoint:** Fit a random-intercept model to grouped data in both frameworks (lme4 vs brms). Implement a bootstrap confidence interval and compare with a Gaussian process regression.

### Steps

1. **[[hierarchical-multilevel-models-frequentist-approach]]** — Mixed-effects models, random intercepts/slopes, REML estimation, ICC, lme4 syntax for nested and crossed structures
2. **[[hierarchical-multilevel-models-bayesian-approach]]** — Bayesian hierarchical models, non-centred parameterisation, partial pooling, brms + PyMC for multilevel data
3. **[[hierarchical-models-frequentist-vs-bayesian-comparison]]** — Boundary variance estimates, small number of groups, complex random effect correlations
4. **[[non-parametric-semi-parametric-methods]]** — Bootstrap (frequentist), permutation tests, kernel density estimation, Gaussian processes (Bayesian non-parametric regression), Dirichlet processes (infinite mixtures)

### Guiding questions
- How do mixed-effects models (lme4) relate to hierarchical Bayesian models (brms)?
- What is partial pooling and when does it matter?
- When should we use bootstrap vs Bayesian non-parametric methods?

### Key resources
- **\"Data Analysis Using Regression and Multilevel/Hierarchical Models\"** (Gelman & Hill)
- **\"Multilevel Analysis\"** (Snijders & Bosker, 2nd ed.)
- **\"Gaussian Processes for Machine Learning\"** (Rasmussen & Williams) — free PDF
- **Efron & Tibshirani (1993)** — *An Introduction to the Bootstrap*

---

## Milestone 6: Advanced Models — Causal Inference & Time Series

> **Epic:** Answer causal questions and model temporal data from both perspectives.

**Estimated effort:** 4 weeks (Weeks 20–23)
**Checkpoint:** Draw a DAG for a causal question, estimate a treatment effect with propensity scores and with Bayesian regression. Fit an ARIMA model and a Bayesian structural time series model to the same data. Compare.

### Steps

1. **[[causal-inference-frequentist-approach]]** — Potential outcomes framework, DAGs, backdoor criterion, propensity score matching, instrumental variables, difference-in-differences, randomised experiments
2. **[[causal-inference-bayesian-approach]]** — Bayesian treatment effect estimation, Bayesian causal networks, Bayesian propensity scores, Bayesian additive regression trees (BART), sensitivity analysis for unmeasured confounding
3. **[[causal-inference-frequentist-vs-bayesian-comparison]]** — When each excels, combining design-based and model-based approaches
4. **[[time-series-analysis-frequentist-approach]]** — Stationarity, ACF/PACF, ARIMA/SARIMA, VAR, GARCH, forecasting evaluation (MSE, MAE, MAPE)
5. **[[time-series-analysis-bayesian-approach]]** — Dynamic linear models, state-space models, Kalman filter, Bayesian structural time series (BSTS/CausalImpact), change point detection
6. **[[time-series-analysis-frequentist-vs-bayesian-comparison]]** — Prediction intervals, short series, multi-seasonality, missing data handling

### Guiding questions
- How do frequentist (DAGs, do-calculus, propensity scores) and Bayesian (causal networks) approaches to causality differ?
- What assumptions are required for causal claims in each framework?
- How are time series modelled with ARIMA vs state-space/DLM approaches?

### Key resources
- **\"Causal Inference: What If\"** (Hernán & Robins) — free PDF, the modern causal inference textbook
- **\"Causality\"** (Pearl, 2nd ed.)
- **\"Forecasting: Principles and Practice\"** (Hyndman & Athanasopoulos, 3rd ed.) — free online
- **\"Bayesian Forecasting and Dynamic Models\"** (West & Harrison, 2nd ed.)
- **CausalImpact R package** — Bayesian causal impact evaluation

---

## Milestone 7: Capstone Project & Synthesis

> **Epic:** Apply everything to a real dataset and learn to communicate statistical findings effectively.

**Estimated effort:** 3 weeks (Weeks 24–26)
**Checkpoint:** A complete reproducible report (Quarto or Jupyter) analysing a real dataset from both perspectives.

### Steps

1. **[[end-to-end-comparative-statistical-analysis]]** — Choose a dataset (penguins, wage data, housing, etc.), EDA in both R and Python, fit frequentist and Bayesian models, systematically compare results, identify robust findings and divergences
2. **[[synthesis-reporting-communicating-statistical-findings]]** — Best practices for reporting frequentist vs Bayesian results, the ASA guidelines, reproducible research (Quarto/Jupyter), decision framework for choosing methods, common pitfalls

### Capstone project ideas
| Dataset | Domain | What to analyse |
|---------|--------|-----------------|
| **palmerpenguins** | Biology | Species differences via ANOVA + Bayesian ANOVA |
| **California housing** | Economics | Multiple regression + Bayesian linear regression |
| **CO₂ (Mauna Loa)** | Climate | Time series forecasting (ARIMA vs BSTS) |
| **Lalonde (NSW)** | Labour | Causal treatment effect (propensity score vs Bayesian) |
| **UCI Wine Quality** | Chemistry | Model selection + regularisation (lasso vs spike-and-slab) |

### Guiding questions
- What does each framework reveal that the other doesn't?
- When they agree, what does that tell us? When they diverge, why?
- How do we communicate results from both frameworks to a non-technical audience?

### Key resources
- **Quarto** (quarto.org) — publish reproducible documents in R, Python, Julia
- **Kaggle** (kaggle.com) — datasets and competition notebooks
- **\"The New Statistics\"** (Cumming, 2014) — estimation-based reporting

---

## Full Step List

| # | Step | Category |
|---|------|----------|
| 1 | Fundamental Mathematics for Statistics | Fundamental |
| 2 | Descriptive Statistics & Data Visualisation | Fundamental |
| 3 | Linear Algebra Essentials | Fundamental |
| 4 | Probability Distributions & Random Variables | Fundamental |
| 5 | Frequentist Inference | Core Theory |
| 6 | Bayesian Inference | Core Theory |
| 7 | Frequentist vs Bayesian Philosophy | Core Theory |
| 8 | Regression: Frequentist | Intermediate |
| 9 | Regression: Bayesian | Intermediate |
| 10 | Regression: Comparison | Intermediate |
| 11 | Bayesian Computation (MCMC) | Intermediate |
| 12 | Experimental Design & ANOVA: Frequentist | Intermediate |
| 13 | Experimental Design & ANOVA: Bayesian | Intermediate |
| 14 | Experimental Design: Comparison | Intermediate |
| 15 | Model Comparison: Frequentist | Intermediate |
| 16 | Model Comparison: Bayesian | Intermediate |
| 17 | Model Comparison: Comparison | Intermediate |
| 18 | Hierarchical Models: Frequentist | Advanced |
| 19 | Hierarchical Models: Bayesian | Advanced |
| 20 | Hierarchical Models: Comparison | Advanced |
| 21 | Non-parametric & Semi-parametric Methods | Advanced |
| 22 | Causal Inference: Frequentist | Advanced |
| 23 | Causal Inference: Bayesian | Advanced |
| 24 | Causal Inference: Comparison | Advanced |
| 25 | Time Series: Frequentist | Advanced |
| 26 | Time Series: Bayesian | Advanced |
| 27 | Time Series: Comparison | Advanced |
| 28 | End-to-End Comparative Analysis | Capstone |
| 29 | Synthesis & Reporting | Capstone |

---

## Acknowledgements

This roadmap synthesises knowledge from the following key resources:
- **Statistical Rethinking** (McElreath) — for Bayesian-first statistical thinking
- **An Introduction to Statistical Learning** (James, Witten, Hastie, Tibshirani) — for applied frequentist learning
- **Bayesian Data Analysis** (Gelman et al.) — for principled Bayesian inference
- **Doing Bayesian Data Analysis** (Kruschke) — for Bayesian experimental design
- **Forecasting: Principles and Practice** (Hyndman & Athanasopoulos) — for time series
- **Causal Inference: What If** (Hernán & Robins) — for modern causal thinking

## Relevant notes

- [[fundamental-mathematics-for-statistics]] — Calculus and probability prerequisites
- [[frequentist-inference]] — Core frequentist inference methodology
- [[bayesian-inference]] — Core Bayesian inference methodology
- [[frequentist-vs-bayesian-philosophy]] — Philosophical foundations comparing both frameworks
- [[bayesian-computation-mcmc-and-modern-tools]] — Practical MCMC and Bayesian computation
- [[end-to-end-comparative-statistical-analysis]] — Capstone project applying both frameworks
- [[synthesis-reporting-communicating-statistical-findings]] — Communicating results from both perspectives
