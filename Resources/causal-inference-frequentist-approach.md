---
title: 'Causal Inference: Frequentist Approach'
description: DAGs, do-calculus, propensity scores, instrumental variables, and randomised experiments from the frequentist perspective
author: pi
editor: lam
date: 2026-06-01T21:08:51.291Z
tags:
  - roadmap
  - statistics
  - advanced
  - frequentist
---
# Causal Inference: Frequentist Approach

## Overview

Causal inference goes beyond association to answer what-if questions: "What would happen if we changed X?" The frequentist approach uses potential outcomes and structural causal models, with tools like propensity scores, instrumental variables, and difference-in-differences. Code in R and Python.

## 1. The Fundamental Problem of Causal Inference

For each unit, we observe only one potential outcome:
- $Y_i(1)$ = outcome if treated
- $Y_i(0)$ = outcome if control
- Observed: $Y_i = T_i \cdot Y_i(1) + (1-T_i) \cdot Y_i(0)$
- Missing: the counterfactual $Y_i(1-T_i)$

The Average Treatment Effect (ATE) is $E[Y(1) - Y(0)]$, but we can never observe both for the same unit.

## 2. Directed Acyclic Graphs (DAGs)

DAGs encode causal assumptions about the data-generating process:

- Nodes = variables
- Edges = direct causal effects
- Key insight: Which variables to adjust for to identify causal effects

### Types of Confounding Structures
| Structure | Description | Need to adjust for? |
|-----------|-------------|---------------------|
| Confounder | $X \leftarrow Z \rightarrow Y$ | Yes (blocks backdoor path) |
| Mediator | $X \rightarrow M \rightarrow Y$ | No (blocks part of causal effect) |
| Collider | $X \rightarrow Z \leftarrow Y$ | No (opens spurious path) |
| Instrument | $Z \rightarrow X \rightarrow Y$ (no direct $Z \rightarrow Y$) | Special IV methods |

## 3. Propensity Score Methods

The propensity score $e(x) = P(T=1|X=x)$ is the probability of treatment given covariates.

### Steps
1. Estimate $e(x)$ via logistic regression
2. Match treated and control units with similar propensity scores
3. Analyse matched samples

R:
```r
library(MatchIt)
match <- matchit(treated ~ age + gender + income, data = data,
                 method = "nearest", ratio = 1)
matched_data <- match.data(match)
# Now estimate treatment effect
lm(outcome ~ treated, data = matched_data, weights = weights)
```

Python:
```python
from sklearn.linear_model import LogisticRegression
from causalinference import CausalModel

model = CausalModel(Y, T, X)
model.est_via_matching()
print(model.estimates)
```

## 4. Instrumental Variables (IV)

When there's unmeasured confounding, IV uses a variable $Z$ that:
1. Affects the treatment $X$ (relevance)
2. Has no direct effect on $Y$ except through $X$ (exclusion)
3. Is random conditional on covariates (exchangeability)

R: `library(AER); ivreg(y ~ x | z, data)`
Python: `from linearmodels.iv import IV2SLS`

## 5. Difference-in-Differences (DiD)

For panel data with a treatment that occurs at a specific time:

$$Y_{it} = \alpha + \beta \cdot Treated_i \cdot Post_t + \gamma_i + \lambda_t + \varepsilon_{it}$$

R: `lm(y ~ treated * post + factor(unit) + factor(time), data)`
Python: `from linearmodels.panel import PanelOLS`

## 6. Randomised Experiments (Gold Standard)

Randomisation ensures (in expectation) that treatment and control groups are exchangeable — any difference in outcomes is due to treatment.

- ATE = $E[Y|T=1] - E[Y|T=0]$
- Analysed with t-test or regression with treatment indicator
- Block randomisation, stratification, and cluster randomisation for practical designs

## References

- Imbens, G. & Rubin, D. (2015). Causal Inference for Statistics, Social, and Biomedical Sciences. Cambridge.
- Hernán, M.A. & Robins, J.M. (2020). Causal Inference: What If. Chapman & Hall/CRC.
- Pearl, J. (2009). Causality: Models, Reasoning, and Inference. 2nd ed. Cambridge.

## Relevant notes

- [[causal-inference-bayesian-approach]]
- [[descriptive-statistics-data-visualisation]]
- [[model-comparison-frequentist-vs-bayesian-comparison]]
- [[frequentist-vs-bayesian-philosophy]]