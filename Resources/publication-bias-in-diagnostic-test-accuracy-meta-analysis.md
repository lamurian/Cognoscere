---
title: Publication Bias in Diagnostic Test Accuracy Meta-Analysis
description: Specialised methods for publication bias in DTA meta-analysis, including Deeks' test and trim-and-fill with log-DOR
author: pi
editor: lam
date: 2026-06-11T22:59:21.111Z
tags:
  - meta-analysis
  - publication-bias
  - methodology
  - statistics
  - research
---

## Summary

Publication bias assessment in diagnostic test accuracy (DTA) meta-analysis is complicated by the bivariate nature of the data — each study reports both sensitivity and specificity. Standard funnel plots and regression tests designed for univariate meta-analyses do not directly apply. Two main approaches exist: testing on a univariate summary measure, or using bivariate methods.

**Deeks' test** is the recommended approach for DTA meta-analysis. It uses the effective sample size rather than the standard error as the precision measure and regresses the diagnostic odds ratio (DOR) against a function of sample size. However, simulation studies show that Deeks' test has low power to detect publication bias in typical DTA meta-analyses with few studies [@brkner2022].

Bürkner and Doebler (2022) conducted an extensive simulation study comparing tests for DTA meta-analysis. They found that:
- **Linear regression and rank correlation tests combined with univariate measures cannot be recommended** — Type I error rates are either inflated or power is too low.
- **Trim-and-fill combined with log-DOR** had non-inflated or only slightly inflated Type I error and medium-to-high power, at least when the number of studies is large enough.
- The **MVPBT R package** provides implementations of several DTA-specific publication bias tests.

A likelihood-based sensitivity analysis for publication bias on the summary ROC has also been developed, extending the Copas framework to the bivariate DTA setting. This allows researchers to assess how sensitive the SROC curve is to selective publication.

## Key Points

- DTA publication bias assessment is complicated by the bivariate outcome (sensitivity and specificity).
- Deeks' test is the established method but has low power.
- Trim-and-fill with log-DOR is a viable alternative with better statistical properties in simulations.
- Bivariate extensions of selection models (Copas, likelihood-based) are emerging but not yet widely implemented.
- Power is typically low because DTA meta-analyses often include fewer than 10 studies.

## Related Notes

- [[executive-summary-comparing-publication-bias-detection-and-correction-methods]]
- [[trim-and-fill-for-estimating-missing-studies]]
- [[publication-bias-investigation-method-trade-offs-and-unified-workflow-guide]]