---
title: Copas Selection Model — Publication Probability as a Latent Variable
description: Explains the latent binary DV, non-identifiability of gamma parameters, and bivariate normal structure in the Copas selection model
author: pi
editor: lam
date: 2026-06-11T20:59:35.326Z
tags:
  - meta-analysis
  - publication-bias
  - methodology
  - statistics
---

## Summary

The Copas selection model specifies a probit equation for the probability that a study is published:

P(published | s_j) = Φ(γ₀ + γ₁ / s_j)

The dependent variable in this probit is a **latent binary variable** — published (1) or unpublished (0). The key difficulty is that we only ever observe the "1" outcomes (the studies that made it into our meta-analysis). We have no dataset of unpublished studies with their standard errors and effect sizes. This makes γ₀ and γ₁ **non-identifiable** from the data alone [@copas2001].

The model resolves this through a selection-model framework with a bivariate normal structure. For each study i, the outcome and selection equations share correlated errors:

Outcome: θ̂ᵢ = θ + √(τ² + σ²ᵢ) εᵢ
Selection: Zᵢ = γ₀ + γ₁/sᵢ + δᵢ, study published if Zᵢ > 0
(εᵢ, δᵢ) ~ BVN(0, 0, 1, 1, ρ)

The correlation ρ is the key parameter governing publication bias. If ρ = 0, publication is independent of the effect size — no bias. If ρ > 0, studies with larger effects are more likely to be published, biasing the meta-analytic estimate. The joint likelihood for observed studies involves the **conditional** probability of publication given the observed effect size:

P(published | θ̂ᵢ, sᵢ) = Φ( (γ₀ + γ₁/sᵢ + ρ σᵢ (θ̂ᵢ − θ)/(σ²ᵢ + τ²)) / √(1 − ρ² σ²ᵢ/(σ²ᵢ + τ²)) ) [@carpenter2009]

Unobserved (missing) studies are integrated out of the likelihood analytically. Because γ₀ and γ₁ are not identifiable, they are not estimated — they are fixed over a grid by the analyst, and the model estimates θ, τ², and ρ conditional on each (γ₀, γ₁) pair. This is why the Copas model is a sensitivity analysis, not a point estimator.

## Key Points

- The probit dependent variable (published/unpublished) is a latent construct. We only observe the "published" state for studies in the meta-analysis.
- γ₀ and γ₁ are non-identifiable. They are fixed by the analyst to define selection scenarios, not estimated from data.
- The correlation ρ between outcome and selection errors captures the extent of publication bias. ρ is estimated from the data.
- The conditional probability of publication (Equation 4 in Carpenter et al.) depends on ρ and the observed effect size, not just the marginal probit.
- The model's output is a range of bias-corrected estimates across a grid of (γ₀, γ₁) values, not a single corrected estimate.

## Related Notes

- [[copas-selection-model-for-publication-bias]] — overview of the Copas model
- [[meta-copas-step-by-step-algorithm]] — how the R function fits the model
- [[interpreting-summary-from-meta-copas]] — how to read the summary output