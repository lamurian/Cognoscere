---
title: Trim and Fill for Estimating Missing Studies
description: Nonparametric method for estimating and adjusting for missing studies in meta-analysis due to publication bias
author: pi
editor: lam
date: 2026-06-04T23:22:12.909Z
tags:
  - meta-analysis
  - publication-bias
  - methodology
  - statistics
source: 'null'
---

## Summary

Trim and fill is a nonparametric sensitivity analysis that estimates the number of studies missing from a meta-analysis due to publication bias and imputes their effects to produce an adjusted summary estimate [@duval2000a; @duval2000b]. The method first "trims" the outlying studies on the asymmetric side of the funnel plot, estimates the true center of the funnel, and then "fills" imputed studies on the opposite side to restore symmetry. The adjusted overall effect is computed from both observed and imputed studies.

## When to Use and When Not

Use trim and fill as a secondary sensitivity analysis after detecting funnel plot asymmetry. It is widely available and easy to apply, making it a common complement to Egger's test. Do not use it as the primary method for detecting publication bias. Avoid it when heterogeneity is substantial, as simulation studies show it performs poorly under high heterogeneity [@terrin2003]. Do not use it when all studies have similar precision (no variation to estimate missingness). The method is not recommended when the meta-analysis includes fewer than five studies.

## How to Use and How Not

In R (metafor), use `trimfill(res)` on the fitted model. The default estimator for the number of missing studies is R0, though some implementations default to L0 — prefer R0 as L0 tends to overestimate missingness [@duval2000b]. The method works with both fixed-effects and random-effects models. Do not rely on the default estimator without checking which one your software uses. Do not use trim-and-fill results to decide between fixed-effects and random-effects models. Do not combine trim-and-fill with the L0 estimator in small meta-analyses.

## How to Interpret and How Not

The trim-and-fill adjusted estimate shows what the summary effect would be if the funnel were symmetric. If the adjusted estimate is substantially smaller than the original, the result is sensitive to potential publication bias. The number of imputed studies (k₀) is an estimate of missing studies, not a precise count. Do not interpret the imputed number of studies as the actual number of unpublished studies — this is a common misinterpretation. Do not treat the adjusted estimate as a definitive bias-corrected value; it still depends on the strong assumption that asymmetry should be fully corrected by symmetry restoration. Trim and fill can impute studies on the wrong side if the asymmetry is caused by factors other than publication bias [@terrin2003].

## Mathematical Foundation

Let \(k\) be the number of observed studies with effects \(\hat{\theta}_1, \ldots, \hat{\theta}_k\). Trim and fill operates in three steps. First, rank the studies by their deviation from the summary effect on the asymmetric side. Trim the most extreme \(k_0\) studies and recompute the summary effect \(\hat{\theta}_{trim}\) from the remaining \(k - k_0\) studies. Second, estimate \(k_0\) — the number of missing studies — using either the R0 estimator (based on the count of extreme studies) or the L0 estimator (based on run-length of asymmetry). The R0 estimator counts the number of studies whose deviation exceeds the \(100(1-\alpha)\%\) percentile under symmetry; L0 counts studies in the longest run on the asymmetric side until a reversal occurs [@duval2000b]. Third, impute \(k_0\) mirror-image studies on the opposite side of the funnel and recompute the summary estimate \(\hat{\theta}_{TF}\) from the full set of \(k + k_0\) studies.

**Assumptions.** The method assumes that any funnel asymmetry is entirely due to publication bias — that the observed effects plus the imputed mirror-image studies would together be symmetric around the true effect. This is a strong assumption: asymmetry caused by heterogeneity, variable study quality, or genuine effect-size–precision relationships will lead to imputation on the wrong side, producing a more biased estimate than the original [@terrin2003]. The R0 estimator is preferred over L0 because L0 tends to overestimate \(k_0\) in small meta-analyses.

**Intended use.** Trim and fill is a sensitivity analysis — the adjusted estimate shows what the summary would be if the funnel were symmetric. It should never be the primary method for detecting or correcting publication bias. The number of imputed studies (\(k_0\)) is not an estimate of the true number of unpublished studies.