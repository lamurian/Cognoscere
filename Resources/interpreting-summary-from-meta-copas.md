---
title: Interpreting summary() from meta::copas()
description: Step-by-step guide to reading the summary() table from meta::copas(), including column definitions and a decision framework
author: pi
editor: lam
date: 2026-06-11T20:59:35.332Z
tags:
  - meta-analysis
  - publication-bias
  - methodology
  - statistics
  - software
---

## Summary

The `summary()` function from `meta::copas()` produces a table that is the primary output for interpreting a Copas selection model analysis. Each row corresponds to a different degree of selection severity, and the table must be read from top to bottom to assess sensitivity to publication bias [@carpenter2009].

## Column definitions

| Column | Meaning |
|--------|--------|
| publprob | The marginal probability of publishing the study with the largest standard error (least precise study). Lower values = stronger selection. |
| OR (or RR, MD, etc.) | The bias-corrected treatment estimate at that selection level. |
| 95%-CI | Confidence interval for the bias-corrected estimate. |
| pval.treat | P-value testing H₀: treatment effect = 0 at that selection level. |
| pval.rsb | P-value for residual selection bias. Tests whether funnel asymmetry remains unexplained after accounting for this degree of selection. |
| N.unpubl | Approximate number of studies the model estimates are missing (unpublished) at this selection level. |

## Step-by-step reading procedure

**Step 1 — Start at the top row (publprob = 1.00).** This row assumes no selection bias. Its estimate should approximately match the random-effects estimate. Check pval.rsb: if it is < 0.1, the funnel has significant asymmetry that the model has not yet explained.

**Step 2 — Move down the table as publprob decreases.** At each row, selection becomes stronger (imprecise studies are less likely to be published). Watch how the estimate shifts and whether the CI changes.

**Step 3 — Find the first row where pval.rsb > 0.1.** Carpenter et al. recommend 0.1 (not 0.05) as the threshold. At this point, the model has explained the funnel asymmetry to an acceptable degree — remaining asymmetry is consistent with chance. This row and rows near it are the most plausible selection scenarios.

**Step 4 — Examine the bias-corrected estimate at plausible rows.** Look at whether the estimate has shifted meaningfully from the top row. A shift from significant to non-significant, or a clinically important change in magnitude, indicates sensitivity to selection.

**Step 5 — Compare the range across all plausible rows.** Do not pick a single row as "the answer." The model is a sensitivity analysis, not a point estimator. Report the range of estimates across plausible selection scenarios.

## Example

```
publprob OR     95%-CI       pval.treat pval.rsb N.unpubl
1.00     0.50   [0.32;0.76]  0.001      0.006     0
0.82     0.55   [0.35;0.86]  0.009      0.007     1
0.67     0.61   [0.39;0.93]  0.023      0.012     2
0.55     0.67   [0.46;0.98]  0.037      0.021     4
0.45     0.74   [0.54;1.02]  0.065      0.046     6
0.37     0.83   [0.61;1.15]  0.265      0.246     9

Copas model (adj) 0.83 [0.61;1.15] 0.265 0.246 9
Random effects    0.49 [0.32;0.74] 0.001
```

At publprob = 1.00, pval.rsb = 0.006 (< 0.1) — the funnel has unexplained asymmetry. Reading downward, the estimate shifts from OR = 0.50 (significant) toward 1.0. At publprob = 0.37, pval.rsb = 0.246 (> 0.1) — the model has explained the asymmetry. At this level, OR = 0.83 with CI crossing 1.0 (non-significant). The meta-analytic result is **not robust** to publication bias.

## Decision framework

1. Is pval.rsb < 0.1 at publprob = 1.0? If no, little evidence of funnel asymmetry.
2. Does the estimate shift meaningfully as publprob decreases? If stable, the result is robust.
3. Is there a publprob level where pval.rsb > 0.1? If yes, those estimates are the plausible range. If no, the model cannot explain the asymmetry with selection on standard error alone.
4. Synthesise: is the original conclusion robust to plausible selection?

## Common pitfalls

- Do not report the last row (Copas model adj) as a single corrected estimate. It is the most extreme selection scenario in the grid, not a unique corrected value.
- Do not use pval.rsb > 0.05 as the threshold. Use 0.1.
- Do not interpret pval.rsb as a test of whether publication bias exists. It tests whether residual asymmetry remains at a given selection level.
- Do not run the model with fewer than 10 studies. The grid may be unstable.
- Do not ignore the contour plot from plot(). If contours are not roughly parallel, the summary table is unreliable.

## Related Notes

- [[copas-selection-model-for-publication-bias]] — overview of the Copas model
- [[copas-selection-model-publication-probability-as-a-latent-variable]] — latent variable and non-identifiability
- [[meta-copas-step-by-step-algorithm]] — how the R function fits the model