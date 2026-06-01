---
title: 'Experimental Design & ANOVA: Frequentist vs Bayesian Comparison'
description: Comparison of frequentist and Bayesian approaches to experimental design, hypothesis testing, and ANOVA with R and Python
author: pi
editor: lam
date: 2026-06-01T21:06:38.707Z
tags:
  - roadmap
  - statistics
  - intermediate
  - comparison
---
# Experimental Design & ANOVA: Frequentist vs Bayesian Comparison

## Overview

When designing experiments and comparing groups, both frequentist and Bayesian approaches have distinct strengths. This note provides a side-by-side comparison with practical guidance on choosing between them.

## 1. Philosophical Differences in Practice

### t-Test: Classical vs BEST

**Example:** Compare test scores of two teaching methods (n = 25 each):

**Frequentist result:** $t_{48} = 2.10, p = 0.041, d = 0.56$
- "The difference is statistically significant at $\alpha = 0.05$"
- 95% CI for difference: [0.02, 0.98]

**Bayesian result (BEST):** Posterior mean difference = 0.48, 95% CrI = [0.01, 0.95]
- $P(\mu_2 > \mu_1) = 0.977$
- "There's a 97.7% probability that method B outperforms method A"

### Multiple Comparisons

**Frequentist:** After a significant ANOVA F-test, you apply **Tukey's HSD** or **Bonferroni** correction to control FWER. The more tests, the smaller the adjusted p-values — reducing power.

**Bayesian:** No correction needed for "multiple comparisons." The Bayesian answer to the crisis is: **just model the data** — hierarchical models with partial pooling naturally handle multiple groups (Gelman et al., 2012). The posterior for each group contrast already reflects all the evidence.

## 2. Key Decision Points

### Choose Frequentist When:
- Regulatory compliance requires pre-registered analysis plan
- You need widely accepted, easily communicated p-values
- You have very large samples (asymptotics are excellent)
- The experiment is a standard design with known power properties

### Choose Bayesian When:
- You need to make decisions under uncertainty ("should we launch this feature?")
- You want to **monitor results continuously** without penalising repeated testing
- You have prior information (from previous experiments) to incorporate
- You need interpretable statements: "Probability B > A is 95%"
- Sample sizes are small or unbalanced

## 3. The Multiple Comparisons Debate

Traditional view: "Adjust p-values or you'll have too many false positives."

Bayesian view (Gelman, 2009): "The problem isn't multiple comparisons — it's that researchers ask uninteresting questions. Use multilevel models instead."

**Demonstration:** In a Bayesian hierarchical model, group estimates are **shrunk** toward the grand mean (partial pooling). This automatically reduces false positives for extreme groups while preserving power for large true effects.

## 4. Stopping Rules

- **Frequentist:** Optional stopping (peeking at data) inflates Type I error dramatically. Pre-registered sample sizes are essential.
- **Bayesian:** The likelihood principle means inference depends only on the data, not on why you stopped. You can monitor sequentially without penalty.

## 5. Code: Side-by-Side

**R — both approaches on the same data:**
```r
# Frequentist
t.test(value ~ group, data = data)

# Bayesian (BEST)
library(BayesFactor)
bf <- ttestBF(formula = value ~ group, data = data)
bf  # Bayes factor
posterior <- posterior(bf, iterations = 10000)
summary(posterior)

# Or with brms for more flexibility
library(brms)
fit <- brm(value ~ group, data = data,
           prior = c(set_prior("normal(0, 10)", class = "b"),
                     set_prior("cauchy(0, 2)", class = "sigma")),
           chains = 4, iter = 4000, refresh = 0)
```

## References

- Gelman, A., Hill, J. & Yajima, M. (2012). "Why We (Usually) Don't Have to Worry about Multiple Comparisons." *Journal of Research on Educational Effectiveness*, 5(2): 189-211.
- Kruschke, J. & Liddell, T. (2018). "The Bayesian New Statistics." *Psychonomic Bulletin & Review*, 25(1): 178-206.
- Rouder, J. et al. (2016). "Replication Bayes Factors." *Journal of Mathematical Psychology*, 72: 5-12.
- Benjamin, D.J. et al. (2018). "Redefine Statistical Significance." *Nature Human Behaviour*, 2(1): 6-10.

## Relevant notes

- [[experimental-design-anova-bayesian-approach]]
- [[experimental-design-anova-frequentist-approach]]
- [[regression-frequentist-vs-bayesian-comparison]]
- [[frequentist-vs-bayesian-philosophy]]