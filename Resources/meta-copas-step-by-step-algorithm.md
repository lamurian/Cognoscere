---
title: meta::copas() Step-by-Step Algorithm
description: Eight-step walkthrough of how meta::copas() fits the Copas selection model from grid construction to summary table
author: pi
editor: lam
date: 2026-06-11T20:59:35.330Z
tags:
  - meta-analysis
  - publication-bias
  - methodology
  - statistics
  - software
---

## Summary

The R function `meta::copas()` implements the Copas selection model as a sensitivity analysis over a grid of selection parameters. It works through eight sequential steps [@carpenter2009].

## Step 1 — Accept a fitted meta-analysis object

The function takes a `metabin()` or `metacont()` object containing study-level effect estimates θ̂ᵢ, standard errors sᵢ, and the random-effects estimate. These define the outcome model.

## Step 2 — Build the (γ₀, γ₁) sensitivity grid

The function constructs a grid (default 400 points) of (γ₀, γ₁) pairs. These are calibrated so that the marginal publication probability of the study with the largest standard error, Φ(γ₀ + γ₁/s_max), ranges from approximately 1.0 (no selection) down to about 0.3 (strong selection). Users can override the range via `gamma0.range` and `gamma1.range`.

## Step 3 — Maximise the likelihood at each grid point

For each (γ₀, γ₁) pair, the function estimates θ, τ², and ρ by maximising the joint likelihood of the observed studies. Optimisation uses L-BFGS-B with constraints (−1 < ρ < 1, τ² ≥ 0). Transformations of ρ and τ² are applied internally to improve numerical stability [@carpenter2009].

## Step 4 — Build the contour plot of θ̂ across the grid

The fitted θ̂ values are plotted as a contour map with γ₀ on the x-axis and γ₁ on the y-axis. Each contour line connects (γ₀, γ₁) pairs that yield the same bias-corrected estimate.

## Step 5 — Find the orthogonal profile line

When contours are roughly parallel (which happens in ~80% of meta-analyses), many (γ₀, γ₁) pairs produce the same θ̂. The algorithm finds the line orthogonal to the contours — the one-dimensional path through selection space along which θ̂ changes most rapidly. This line picks a unique representative trajectory.

## Step 6 — Compute summary quantities at each intersection

At each intersection point along the orthogonal line (marked 'o' on the contour plot), the function calculates:
- The bias-corrected θ̂ and its 95% Wald confidence interval
- publprob = Φ(γ₀ + γ₁/s_max), the publication probability of the least precise study
- pval.rsb — a p-value testing whether residual funnel asymmetry remains after accounting for this degree of selection
- N.unpubl — the estimated number of missing (unpublished) studies at this selection level

## Step 7 — Draw the summary panels

The `plot()` function shows four panels: the funnel plot (top-left), the contour plot (top-right), the treatment estimate vs. publprob (bottom-left), and the residual selection bias p-value vs. publprob (bottom-right). A horizontal reference line at p = 0.1 on the bottom-right panel marks the threshold for plausible selection scenarios.

## Step 8 — Print the summary table

The `summary()` function prints a table with one row per orthogonal-line intersection, showing publprob, the bias-corrected estimate with CI, pval.treat, pval.rsb, and N.unpubl. The bottom rows show the random-effects estimate (for reference) and the Copas-adjusted estimate at the most extreme selection level.

## Key Points

- The (γ₀, γ₁) grid is not estimated — it is specified to span from no selection to strong selection.
- At each grid point, the function estimates θ, τ², and ρ by MLE.
- The orthogonal profile line summarises the 2-D contour surface into a 1-D sensitivity path.
- The summary table and plots allow the analyst to judge whether the result is robust to plausible degrees of selection.

## Related Notes

- [Copas Selection Model for Publication Bias](copas-selection-model-for-publication-bias.md) — overview of the Copas model
- [Copas Selection Model — Publication Probability as a Latent Variable](copas-selection-model-publication-probability-as-a-latent-variable.md) — latent variable and non-identifiability
- [Interpreting summary() from meta::copas()](interpreting-summary-from-meta-copas.md) — how to read the summary output