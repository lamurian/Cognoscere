---
title: P-Curve and P-Uniform* for Detecting Evidential Value
description: Methods based on the distribution of significant p-values to assess evidential value and estimate bias-corrected effects
author: pi
editor: lam
date: 2026-06-04T23:22:12.912Z
tags:
  - meta-analysis
  - publication-bias
  - methodology
  - statistics
source: 'null'
---

## Summary

P-curve analyzes the distribution of statistically significant p-values (p < 0.05) to assess whether a set of findings contains genuine evidential value. If studies have true non-zero effects, the p-curve should be right-skewed (more p-values near 0.01 than near 0.04). A flat p-curve suggests p-hacking or selective reporting, while a left-skewed p-curve indicates severe problems [@simonsohn2014a; @simonsohn2014b]. P-uniform* extends this logic to estimate the underlying effect size by fitting a model to the p-value distribution of significant results [@vanasseldonk2016].

## When to Use and When Not

Use p-curve when the null hypothesis is likely false and you want to assess whether the significant results reflect real effects or are artifacts of bias. P-uniform* provides a bias-corrected effect estimate. Do not use p-curve when most or all studies have very high power, as the p-curve then appears flat regardless of evidential value. Do not use it when only a few studies report significant results (fewer than 4–5 significant p-values). P-curve cannot distinguish between no effect and no evidential value when the null is true [@simonsohn2014b].

## How to Use and How Not

Collect the exact p-values (not just "p < 0.05") from significant results. Use the online p-curve app or the R package `pcurve`. P-uniform* is implemented in the `puniform` R package. Report both the p-curve test for right-skewness (evidence for evidential value) and the test for flatness (absence of evidential value). Do not include non-significant p-values in the p-curve analysis. Do not p-curve results that come from different analyses within the same study (use one p-value per study). Do not round p-values to thresholds (e.g., use 0.049, not "< 0.05").

## How to Interpret and How Not

A significantly right-skewed p-curve indicates that the set of significant findings contains evidential value. A flat p-curve suggests that the significant results could be entirely due to selective reporting or p-hacking. P-curve does not estimate the overall meta-analytic effect — it only tests evidential value. P-uniform* provides an effect estimate, but it is conditional on the assumption that selection operates only on significant p-values. Do not interpret p-curve's "evidential value" as proof of no publication bias — publication bias can still exist alongside evidential value. Do not use p-curve results to rank or compare individual studies.

## Mathematical Foundation

Let \(p_j\) be the two-tailed p-value from study \(j\), and consider only the subset where \(p_j < 0.05\). Under the null hypothesis that the true effect is zero, significant p-values follow a uniform distribution on \([0, 0.05]\). Under the alternative that a true non-zero effect exists, the distribution of significant p-values is right-skewed: more p-values near 0.01 than near 0.04. The degree of right-skewness depends on statistical power. P-curve tests this by computing a binomial test on whether p-values fall below 0.025 versus above (within the significant range) [@simonsohn2014a]. The p-curve app reports both a test for right-skewness (evidential value exists) and a test for flatness (evidential value is inadequate to account for the observed p-values even if the null were true).

P-uniform* [@vanasseldonk2016] provides a bias-corrected effect estimate by assuming that the p-values of significant studies follow a truncated distribution. The likelihood for the effect size \(\theta\) is

\[L(\theta \mid \text{data}) = \prod_{j: p_j < 0.05} \frac{f(\hat{\theta}_j \mid \theta, s_j^2)}{F(1.96 - \theta/s_j) - F(-1.96 - \theta/s_j)}\]

where \(F\) is the standard normal CDF. The denominator conditions on significance, making this a truncated-normal likelihood. P-uniform* estimates \(\theta\) by maximizing this conditional likelihood.

**Assumptions.** P-curve assumes that all p-values are independent, that each study contributes exactly one p-value (the primary test of the hypothesis), and that the null hypothesis is false (swing). When studies have very high power, the p-curve appears flat regardless of evidential value, making the test uninformative [@simonsohn2014b]. P-uniform* assumes the truncated-normal model is correct and that selection operates only through the significance filter, not through more complex mechanisms.

**Intended use.** P-curve is a diagnostic for evidential value, not a general test for publication bias. A right-skewed p-curve indicates that significant results contain real signal, but publication bias can still coexist with evidential value. P-uniform* provides a bias-corrected estimate but is conditional on strong assumptions about the selection mechanism. Both methods are best used as supplementary analyses alongside funnel-plot-based methods.