---
title: Harbord and Macaskill Tests for Binary Outcome Meta-Analysis
description: Modified regression tests for funnel plot asymmetry designed specifically for binary outcomes with odds ratios and risk ratios
author: pi
editor: lam
date: 2026-06-04T23:22:12.914Z
tags:
  - meta-analysis
  - publication-bias
  - methodology
  - statistics
source: 'null'
---

## Summary

Harbord's test and Macaskill's test are modifications of Egger's regression test designed for binary outcome data. The standard Egger test has inflated Type I error when applied to odds ratios because the log odds ratio and its variance are correlated under the null. Harbord's test uses a modified score statistic, while Macaskill's test uses sample size as the predictor instead of precision [@harbord2006; @macaskill2001]. Peters' test provides a further refinement using the inverse of total sample size.

## When to Use and When Not

Use Harbord's test when the meta-analysis involves binary outcomes with odds ratios or risk ratios and you have at least 10 studies. It is the recommended test for binary outcome data in Cochrane reviews. Macaskill's test can be used as a complement. Do not use the standard Egger test with odds ratios without these modifications, especially when the overall effect is large or the outcome is common [@harbord2006]. Do not use Harbord's test when studies have zero events in one treatment arm, as the score statistic becomes undefined.

## How to Use and How Not

In Stata, `metabias, method(harbord)` or `method(macaskill)`. In R (metafor), Harbord's test is not directly implemented but can be approximated through `regtest()` with appropriate modifications. The test uses the efficient score and the score variance rather than the log OR and its variance. Peters' test replaces the predictor with \(1 / n\), where n is the total sample size. Do not apply these tests to continuous outcomes — they are designed specifically for binary data. Do not mix odds-ratio and risk-ratio metrics in the same test.

## How to Interpret and How Not

A significant Harbord or Macaskill test indicates asymmetry in the funnel plot consistent with small-study effects. The interpretation follows the same logic as Egger's test: asymmetry may reflect publication bias, heterogeneity, or genuine effect-size–sample-size relationships. Do not interpret a non-significant Harbord test as proof that publication bias is absent for binary outcomes. Do not use these tests to quantify the magnitude of bias — they are detection-only methods. Always report the test alongside the funnel plot and a sensitivity analysis (e.g., trim and fill or PET-PEESE).

## Mathematical Foundation

For binary outcomes, each study \(j\) provides a \(2 \times 2\) table of counts: \(a_j, b_j\) (treatment), \(c_j, d_j\) (control), with total \(n_j = a_j + b_j + c_j + d_j\). Let \(T_j = a_j + c_j\) be the total events and \(N_j = a_j + b_j\) the treated subjects. Harbord's test replaces the log odds ratio \(\log(OR_j)\) and its variance with the efficient score \(S_j = a_j - N_j T_j / n_j\) and its variance \(V_j = N_j (1 - N_j/n_j) T_j (n_j - T_j) / [n_j (n_j - 1)]\). The regression is

$$
S_j / V_j = \beta_0 + \beta_1 / \sqrt{V_j} + \varepsilon_j
$$

where the intercept \(\beta_0\) tests asymmetry [@harbord2006]. Macaskill's test uses total sample size \(-\), fitting

$$
\log(OR_j) = \beta_0 + \beta_1 n_j + \varepsilon_j
$$

with weights proportional to study size [@macaskill2001]. Peters' test [@peters2008] uses \(1/n_j\) as the predictor instead of \(n_j\).

**Assumptions.** All three tests are designed specifically for binary outcomes. Harbord's test avoids the correlation between \(\log(OR_j)\) and its variance that plagues Egger's test, but it becomes undefined when any cell count is zero. Macaskill's test is less sensitive to this but has lower power and assumes a linear relationship between log OR and sample size. All three assume at least 10 studies and reasonably large cell counts. They do not adjust the summary estimate — they are detection-only tools.

**Intended use.** These tests fill the gap left by Egger's test for binary outcomes. Use Harbord's test as the primary detection test when \(OR\) or \(RR\) is the metric. Use Macaskill's test as a supplementary check. Do not apply them to continuous outcomes. If asymmetry is detected, follow up with bias-correction methods appropriate for binary outcomes (e.g., PET-PEESE on the log OR scale, or selection models).