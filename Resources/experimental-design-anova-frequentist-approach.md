---
title: 'Experimental Design & ANOVA: Frequentist Approach'
description: t-tests, ANOVA, A/B testing, power analysis, multiple comparisons from the frequentist perspective with R and Python
author: pi
editor: lam
date: 2026-06-01T21:06:38.707Z
tags:
  - roadmap
  - statistics
  - intermediate
  - frequentist
---
# Experimental Design & ANOVA: Frequentist Approach

## Overview

Frequentist experimental design and ANOVA provides a rigorous framework for comparing groups, controlling error rates, and determining sample sizes. This note covers t-tests, ANOVA, multiple comparison corrections, and power analysis, with code in **R** and **Python**.

## 1. t-Tests

### One-sample t-test
Tests whether the population mean differs from a hypothesised value:
$$t = \frac{\bar{x} - \mu_0}{s / \sqrt{n}}$$

### Two-sample t-test
Compares means of two independent groups:
$$t = \frac{\bar{x}_1 - \bar{x}_2}{\sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}}$$

### Paired t-test
Compares two measurements on the same subjects (before/after):
$$t = \frac{\bar{d}}{s_d / \sqrt{n}}$$

**R:**
```r
t.test(x, y, paired = FALSE, var.equal = FALSE)
t.test(before, after, paired = TRUE)
```

**Python:**
```python
from scipy import stats
stats.ttest_ind(x, y, equal_var=False)  # Welch's t-test
stats.ttest_rel(before, after)  # paired t-test
```

## 2. One-Way ANOVA

Tests whether means across $k$ groups are equal:

$$F = \frac{\text{Between-group variability}}{\text{Within-group variability}} = \frac{MS_{between}}{MS_{within}}$$

Under $H_0$, $F \sim F_{k-1, n-k}$.

**R:**
```r
fit <- aov(y ~ group, data = mydata)
summary(fit)  # F-statistic + p-value
TukeyHSD(fit)  # post-hoc pairwise comparisons
```

**Python:**
```python
import statsmodels.api as sm
from statsmodels.formula.api import ols
model = ols('y ~ C(group)', data=mydata).fit()
sm.stats.anova_lm(model, typ=2)
# Post-hoc
from statsmodels.stats.multicomp import pairwise_tukeyhsd
print(pairwise_tukeyhsd(mydata['y'], mydata['group']))
```

## 3. Two-Way ANOVA

Tests the effect of two factors and their interaction:
$$y_{ijk} = \mu + \alpha_i + \beta_j + (\alpha\beta)_{ij} + \varepsilon_{ijk}$$

**R:** `aov(y ~ factorA * factorB, data)` — the `*` includes main effects + interaction
**Python:** `ols('y ~ C(A) * C(B)', data).fit()` followed by `anova_lm`

## 4. A/B Testing

A/B testing is a special case of two-sample hypothesis testing:

1. **Define metrics** (conversion rate, click-through rate, etc.)
2. **Determine sample size** via power analysis before the experiment
3. **Randomise** users into control (A) and treatment (B)
4. **Test** using a two-proportion z-test or chi-square test
5. **Check assumptions** — was randomisation successful? (balance checks)

**R — A/B test:**
```r
prop.test(x = c(conversions_A, conversions_B),
          n = c(n_A, n_B))
```

**Python — A/B test:**
```python
from statsmodels.stats.proportion import proportions_ztest
z_stat, p_value = proportions_ztest(
    count=[conversions_A, conversions_B],
    nobs=[n_A, n_B]
)
```

## 5. Multiple Comparisons Problem

When testing many hypotheses simultaneously, the chance of at least one false positive increases:
- 1 test at $\alpha = 0.05$: 5% Type I error
- 10 independent tests at $\alpha = 0.05$: $1 - 0.95^{10} \approx 40\%$ chance of ≥1 false positive

### Correction Methods
| Method | Controls | Procedure |
|--------|----------|-----------|
| **Bonferroni** | Family-wise error rate (FWER) | Divide $\alpha$ by number of tests |
| **Holm-Bonferroni** | FWER | Step-down, more powerful than Bonferroni |
| **Benjamini-Hochberg** | False Discovery Rate (FDR) | Control expected proportion of false positives |
| **Tukey's HSD** | FWER (pairwise ANOVA comparisons) | Uses studentised range distribution |

**R:** `p.adjust(p_values, method = "bonferroni")` or `method = "fdr"`
**Python:** `from statsmodels.stats.multitest import multipletests`

## 6. Power Analysis

Determining required sample size **before** the experiment:

**R:**
```r
library(pwr)
pwr.t.test(d = 0.5, power = 0.8, sig.level = 0.05, type = "two.sample")
pwr.anova.test(k = 3, f = 0.25, power = 0.8, sig.level = 0.05)
```

**Python:**
```python
from statsmodels.stats.power import TTestPower, TTestIndPower
power = TTestIndPower()
power.solve_power(effect_size=0.5, power=0.8, alpha=0.05)
```

## 7. Key Assumptions of ANOVA

1. **Independence** of observations (most critical — broken by clustering/repeated measures)
2. **Normality** of residuals (robust with moderate sample sizes per CLT)
3. **Homogeneity of variance** (Levene's test; Welch's ANOVA if violated)

## References

- Montgomery, D.C. (2017). *Design and Analysis of Experiments*. 9th ed. Wiley.
- Cohen, J. (1988). *Statistical Power Analysis for the Behavioral Sciences*. 2nd ed. LEA.
- Benjamin, D.J. et al. (2018). "Redefine statistical significance." *Nature Human Behaviour*, 2(1): 6-10.

## Relevant notes

- [[experimental-design-anova-bayesian-approach]]
- [[experimental-design-anova-frequentist-vs-bayesian-comparison]]
- [[frequentist-vs-bayesian-philosophy]]
- [[linear-logistic-regression-frequentist-approach]]