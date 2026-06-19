---
title: Copas Selection Model — Mathematical Formulation and Plain-English Summary
description: Full mathematical specification of the Copas selection model with a plain-English executive summary for non-technical readers
author: pi
editor: lam
date: 2026-06-12T07:53:58.074Z
tags:
  - meta-analysis
  - publication-bias
  - methodology
  - statistics
---

## Executive Summary (plain English)

Imagine you are doing a meta-analysis of 50 studies on a treatment. You suspect some studies may be missing from your collection because they had boring or non-significant results and nobody bothered to publish them. This is publication bias.

The Copas selection model is a way to ask: **"If publication truly does favour precise, large studies over imprecise, small ones, how much would our answer change?"**

It works like a dimmer switch. You turn a dial from "no bias" to "very strong bias", and at each setting, the model recalculates the treatment effect as if that degree of bias were real. If the answer barely changes across all dial settings, your result is robust. If it flips from significant to non-significant, your result is fragile — publication bias could be driving your conclusion.

The model does not give you a single "corrected" number. It gives you a range of numbers across different bias scenarios, and it is up to you to judge whether your conclusion holds up.

You cannot use this model with fewer than 15 studies — the calculations become unstable. And it only handles one type of bias: suppression based on study size. If studies are suppressed for other reasons (e.g., a drug company burying all results), the model cannot detect or correct that.

## Mathematical formulation

### Two-equation structure

The Copas model pairs two equations linked by correlated errors. For each study i:

**Outcome equation** (standard random effects):

$$
\hat{\theta}_i = \theta + \sqrt{\tau^2 + \sigma_i^2}\; \varepsilon_i, \quad \varepsilon_i \sim N(0,1)
$$

**Selection equation** (latent variable for publication):

$$
Z_i = \gamma_0 + \frac{\gamma_1}{s_i} + \delta_i, \quad \delta_i \sim N(0,1)
$$

Study i is **observed** (published) if \(Z_i > 0\).

**Correlation between equations:**

$$
\text{corr}(\varepsilon_i, \delta_i) = \rho
$$

The correlation \(\rho\) captures publication bias. If \(\rho = 0\), publication is independent of the study's result. If \(\rho > 0\), studies with larger effects are more likely to be published, inflating the meta-analytic estimate.

### Marginal selection probability

Integrating over \(\delta_i\) gives the marginal probability that study i is published based on its precision alone:

$$
P(\text{published} \mid s_i) = \Phi\left(\gamma_0 + \frac{\gamma_1}{s_i}\right)
$$

where \(\Phi\) is the standard normal CDF. The parameter \(\gamma_1\) controls how strongly precision affects publication. When \(\gamma_1 > 0\), studies with larger standard errors (imprecise studies) have lower publication probability.

### Conditional selection probability

Given the observed effect size \(\hat{\theta}_i\), the publication probability is updated using the bivariate normal correlation:

$$
P(\text{published} \mid \hat{\theta}_i, s_i) = \Phi\left(
\frac{\gamma_0 + \gamma_1/s_i + \frac{\rho\sigma_i(\hat{\theta}_i - \theta)}{\sigma_i^2 + \tau^2}}
{\sqrt{1 - \frac{\rho^2\sigma_i^2}{\sigma_i^2 + \tau^2}}}
\right)
$$

This is the **core equation** that enables bias correction. When \(\rho > 0\), a study with an unexpectedly large effect (\(\hat{\theta}_i > \theta\)) has a higher estimated publication probability than its precision alone would predict. The model uses this to downweight studies that are "too convenient" — those that are unlikely to have been observed under the assumed selection mechanism.

### Effective correlation due to heterogeneity

Define the effective correlation between the observed outcome and the selection error:

$$
\tilde{\rho}_i = \frac{\rho\sigma_i}{\sqrt{\sigma_i^2 + \tau^2}}
$$

When heterogeneity \(\tau^2\) is large, \(\tilde{\rho}_i\) is small, meaning most of the scatter in the funnel plot is genuine variation rather than selection bias. The conditional probability then reverts toward the marginal \(\Phi(\gamma_0 + \gamma_1/s_i)\) regardless of \(\rho\).

### Joint likelihood

The likelihood for observed study i is:

$$
\mathcal{L}_i(\theta, \tau^2, \rho \mid \gamma_0, \gamma_1) = f(\hat{\theta}_i \mid \theta, \tau^2, \sigma_i^2) \times P(\text{published} \mid \hat{\theta}_i, s_i)
$$

where \(f\) is the normal density. The likelihood for unobserved (missing) studies integrates over all possible effect sizes:

$$
\mathcal{L}_{\text{missing}} = \int \bigl[1 - P(\text{published} \mid \hat{\theta}, s)\bigr] \, f(\hat{\theta} \mid \theta, \tau^2, \sigma^2) \; d\hat{\theta}
$$

The total likelihood combines both contributions and is maximised for \(\theta, \tau^2, \rho\) at each fixed (\(\gamma_0, \gamma_1\)) pair.

### Non-identifiability and the sensitivity grid

The parameters \(\gamma_0\) and \(\gamma_1\) are **not identifiable** from the observed data alone — there is no information about unpublished studies to estimate the selection equation. Instead, the model is used as a sensitivity analysis:

1. A grid of (\(\gamma_0, \gamma_1\)) pairs is specified, calibrated so that the publication probability of the **least precise study**, \(\Phi(\gamma_0 + \gamma_1/s_{\max})\), ranges from approximately 1.0 (no selection) down to about 0.3 (strong selection).

2. At each grid point, \(\theta, \tau^2, \rho\) are estimated by maximum likelihood with constraints (\(-1 < \rho < 1, \tau^2 \geq 0\)).

3. For each fitted model, the **residual selection bias test** (pval.rsb) assesses whether the remaining funnel asymmetry is more than expected by chance. A p-value \(> 0.1\) indicates the assumed selection level adequately explains the asymmetry [@carpenter2009].

4. The key output is a table showing how \(\hat{\theta}\) and its confidence interval change across the grid. The orthogonal profile line through the contour surface summarises the 2-D grid into a 1-D sensitivity path.

### Summary of parameters

| Parameter | Status | Meaning |
|-----------|--------|---------|
| \(\gamma_0\) | Fixed on grid | Intercept of selection probit. Controls baseline publication probability. |
| \(\gamma_1\) | Fixed on grid | Slope on 1/SE. Controls how strongly precision affects publication. |
| \(\theta\) | Estimated | Bias-corrected pooled treatment effect. |
| \(\tau^2\) | Estimated | Between-study heterogeneity. |
| \(\rho\) | Estimated | Correlation between outcome and selection errors. Key bias parameter. |

### Assumptions

1. Selection depends only on standard error (not on the sign or magnitude of the effect beyond \(\rho\)).
2. The probit function form is correct.
3. The random-effects outcome model is correctly specified.
4. At least 10–15 studies are needed for stable estimation [@copas2001; @carpenter2009].

Violation of any assumption can produce misleading results. The model is a sensitivity analysis, not a definitive correction.

## Related Notes

- [Copas Selection Model for Publication Bias](copas-selection-model-for-publication-bias.md) — overview and practical usage
- [Copas Selection Model — Publication Probability as a Latent Variable](copas-selection-model-publication-probability-as-a-latent-variable.md) — latent variable and non-identifiability
- [meta::copas() Step-by-Step Algorithm](meta-copas-step-by-step-algorithm.md) — how the R function fits the model
- [Interpreting summary() from meta::copas()](interpreting-summary-from-meta-copas.md) — how to read the summary output