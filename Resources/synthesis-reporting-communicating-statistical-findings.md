---
title: 'Synthesis & Reporting: Communicating Statistical Findings'
description: How to communicate statistical results, write reports, choose between frequentist and Bayesian frameworks, and present findings
author: pi
editor: lam
date: 2026-06-01T21:10:09.910Z
tags:
  - roadmap
  - statistics
  - capstone
  - practical
---
# Synthesis & Reporting: Communicating Statistical Findings

## Overview

The final step in any analysis is communication. This note covers how to present results from both frequentist and Bayesian perspectives, write reproducible reports, and make framework choices transparent to stakeholders.

## 1. Reporting Frequentist Results

### Best Practices (ASA Guidelines, Wasserstein et al., 2019)

1. Don't stop at p < 0.05 — report effect sizes and confidence intervals
2. Avoid dichotomous language ("significant" vs "not significant")
3. Report p-values as continuous measures of evidence (p = 0.031, not p < 0.05)
4. Always report uncertainty with confidence intervals

Example — good reporting:
> "The treatment group had higher outcomes than the control group ($M_{diff} = 2.3$, 95% CI [0.8, 3.8], $t_{48} = 2.10$, $p = 0.041$). The effect size was moderate ($d = 0.56$)."

## 2. Reporting Bayesian Results

### Best Practices (Kruschke, 2014; Gelman et al., 2013)

1. Report posterior mean and 95% credible intervals
2. Report probability of direction — $P(\beta > 0 | data)$
3. Show posterior distributions — not just summaries
4. Report prior sensitivity — how results change with different priors

Example — good reporting:
> "The treatment effect had a posterior mean of 2.3 (95% CrI [0.6, 4.0]). There is a 97.7% probability that the treatment effect is positive. This result is robust to reasonable changes in the prior."

## 3. Reporting Both Approaches Together

When presenting both frequentist and Bayesian results, structure around questions, not frameworks:

| Question | Frequentist answer | Bayesian answer |
|----------|-------------------|----------------|
| Is there an effect? | p = 0.04 | $P(\beta > 0 \mid data) = 97.7\%$ |
| How large? | $\hat{\beta} = 2.3$ [0.4, 4.2] | $E[\beta \mid data] = 2.3$ [0.6, 4.0] |
| Should we act? | "Significant at $\alpha = 0.05$" | "97.7% probability of positive effect" |
| How confident? | 95% CI = [0.4, 4.2] | 95% CrI = [0.6, 4.0] |

## 4. Reproducibility

### Tools for Reproducible Analysis

| Tool | Language | Key features |
|------|----------|-------------|
| R Markdown / Quarto | R (also Python) | Dynamic documents, LaTeX, code execution |
| Jupyter Notebooks | Python | Interactive, visual, shareable |
| targets (R) / Make | Both | Pipeline orchestration, caching |
| Docker / renv | Both | Environment reproducibility |

Quarto example (R + Python in one doc):
```
---
title: "Comparative Analysis"
format: html
---

```{r}
#| label: freq-analysis
library(brms)
fit <- brm(mpg ~ wt, data = mtcars)
```

```{python}
#| label: py-analysis
import pymc as pm
# ...
```
```

## 5. Choosing Your Framework

### Decision Tree

```
Do you need to make a single yes/no decision?
├─ Yes → Consider both (if they agree, decision is robust)
└─ No → Use the framework that best communicates your uncertainty

Is your audience familiar with Bayesian concepts?
├─ Yes → Bayesian (more intuitive interpretation)
└─ No → Frequentist or show both side-by-side

Do you have strong prior information?
├─ Yes → Bayesian (incorporates it formally)
└─ Yes, but need frequentist → Use pilot study or pre-registration
```

## 6. Common Pitfalls to Avoid

| Pitfall | How to avoid |
|---------|-------------|
| p-hacking / cherry-picking | Pre-register analysis plan |
| Overinterpreting p > 0.05 | Report CIs, effect sizes |
| Ignoring prior sensitivity | Run sensitivity analysis |
| Dichotomous thinking | Present continuous measures of evidence |
| Ignoring model assumptions | Check diagnostics (both frameworks) |
| Overclaiming causality | Be explicit about assumptions (DAGs!) |

## 7. Final Synthesis: Key Takeaways

1. Both frameworks are valid — they answer different questions
2. Frequentist excels for objective, standardised inference with known frequentist properties
3. Bayesian excels for incorporating prior knowledge, direct probability statements, and complex models
4. Use both when possible — convergence = robust result; divergence = investigate further
5. Choose tools that fit the question, not the other way around
6. Always report uncertainty — a number without uncertainty is not a statistical result
7. Reproducibility is non-negotiable (use Quarto, Jupyter, or similar)

## References

- Wasserstein, R.L., Schirm, A.L. & Lazar, N.A. (2019). "Moving to a World Beyond 'p < 0.05'." The American Statistician, 73(S1): 1-19.
- Kruschke, J. (2014). Doing Bayesian Data Analysis. 2nd ed. Academic Press.
- Gelman, A. et al. (2013). Bayesian Data Analysis. 3rd ed. CRC Press.
- Peng, R.D. (2011). "Reproducible Research in Computational Science." Science, 334(6060): 1226-1227.
- McElreath, R. (2020). Statistical Rethinking. 2nd ed. CRC Press (Chapter 1: The Golem of Prague).

## Relevant notes

- [[end-to-end-comparative-statistical-analysis]]
- [[model-comparison-selection-bayesian-approach]]
- [[model-comparison-frequentist-vs-bayesian-comparison]]
- [[frequentist-vs-bayesian-philosophy]]