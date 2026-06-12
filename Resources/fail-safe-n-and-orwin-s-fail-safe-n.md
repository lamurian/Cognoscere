---
title: Fail-Safe N and Orwin's Fail-Safe N
description: Classic but limited methods estimating how many null studies would be needed to overturn a meta-analytic conclusion
author: pi
editor: lam
date: 2026-06-04T23:22:12.913Z
tags:
  - meta-analysis
  - publication-bias
  - methodology
  - statistics
source: 'null'
---

## Summary

Rosenthal's fail-safe N estimates the number of unpublished studies with null results that would be required to reduce the overall meta-analytic p-value to non-significance (p > 0.05) [@rosenthal1979]. Orwin's fail-safe N generalises this by estimating the number of studies needed to reduce the effect size to a specified trivial value rather than to statistical non-significance [@orwin1983]. Both methods are based on the intuition that if many missing null studies would be required to change the conclusion, the result is "robust" to publication bias.

## When to Use and When Not

Fail-safe N methods were historically used as a quick check but are now widely considered inadequate and are not recommended by current Cochrane guidance. They assume that missing studies have an effect of exactly zero (Rosenthal) or a specified trivial value (Orwin) and that the observed studies are unbiased. Do not use these as primary evidence for the absence of publication bias. They persist in the literature mainly for historical reasons and because many older review checklists still list them.

## How to Use and How Not

Rosenthal's fail-safe N is computed as \(N = (\Sigma Z)^2 / Z_\alpha^2 - k\), where k is the number of studies. A common but arbitrary rule of thumb is \(N > 5k + 10\) as "tolerance level." In R, the `fsn()` function in metafor computes this. Orwin's method requires specifying a trivial effect size threshold. Do not use Rosenthal's \(5k+10\) rule as a valid or meaningful threshold — it has no statistical justification. Do not report fail-safe N without also applying modern methods.

## How to Interpret and How Not

A large fail-safe N was historically interpreted as the meta-analytic result being "robust" to publication bias. However, the assumptions underlying both methods are unrealistic: unpublished studies are assumed to have exactly null effects, but in practice they may have effects in the opposite direction or smaller non-zero effects. The methods also ignore that the observed studies themselves may be biased. Do not treat a large fail-safe N as evidence that publication bias is absent. Do not interpret the fail-safe N as an estimate of the true number of missing studies. These methods should be considered obsolete for serious publication bias assessment [@becker2005].

## Mathematical Foundation

Rosenthal's fail-safe N is derived from Stouffer's method for combining p-values. Let \(z_j = \Phi^{-1}(p_j)\) be the one-tailed z-score for study \(j\), where \(p_j\) is the one-tailed p-value. The combined Stouffer Z is \(Z_{\text{total}} = \sum z_j / \sqrt{k}\). The fail-safe N is the number of additional null studies (\(z = 0\)) needed to make \(Z_{\text{total}} < Z_\alpha\) (non-significant):

$$
N_{fs} = \frac{(\sum z_j)^2}{Z_\alpha^2} - k
$$

where \(Z_\alpha = 1.645\) for \(\alpha = 0.05\) (one-tailed) [@rosenthal1979]. Orwin's generalization replaces the significance criterion with an effect-size criterion:

$$
N_{fs} = \frac{k (\bar{\theta} - \theta_c)}{\theta_c - \theta_0}
$$

where \(\bar{\theta}\) is the meta-analytic effect, \(\theta_c\) is the criterion effect (e.g., a trivial effect), and \(\theta_0\) is the assumed effect of missing studies (typically 0) [@orwin1983].

**Assumptions.** Both methods assume that any unpublished (missing) studies have effect sizes of exactly zero (Rosenthal) or the specified null value \(\theta_0\) (Orwin). This is unrealistic — unpublished studies may have effects in the opposite direction or small non-zero effects in either direction. The methods also assume that the observed studies are an unbiased sample, which publication bias specifically denies. The \(5k + 10\) rule-of-thumb threshold for Rosenthal's N has no statistical foundation.

**Intended use.** Fail-safe N methods were historically used as a quick heuristic but are now considered inadequate by methodologists [@becker2005]. They provide no insight into the direction or magnitude of publication bias, do not adjust the summary estimate, and are easily gamed (larger meta-analyses automatically produce larger fail-safe N values regardless of bias). Do not rely on them.