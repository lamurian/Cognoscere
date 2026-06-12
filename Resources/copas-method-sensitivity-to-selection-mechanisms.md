---
title: Copas Method Sensitivity to Selection Mechanisms
description: Evidence that the Copas model is not robust when the true selection mechanism differs from its standard-error-based assumption
author: pi
editor: lam
date: 2026-06-11T22:59:21.108Z
tags:
  - meta-analysis
  - publication-bias
  - methodology
  - statistics
  - research
---

## Summary

The Copas selection model conditions on a specific assumed mechanism for publication bias: that selection depends only on each study's standard error (precision). Almalik, Zhan, and van den Heuvel (2020) showed through simulations that the Copas method is **not robust against other realistic selection mechanisms**. When the true publication process differs from what the model assumes — for example, selection based on the direction or magnitude of the effect size rather than precision — the Copas-adjusted estimate can be as biased as, or more biased than, the naive estimate [@almalik2020].

This finding has important implications. In practice, the true publication mechanism is typically unknown. A researcher cannot know whether the Copas assumption (selection on standard error) matches the real-world process that generated the observed set of studies. The Almalik et al. simulations show that Copas performs well when its assumption holds, but performance degrades substantially when the mechanism shifts — for instance, to selection based on statistical significance rather than precision.

This limitation is not unique to Copas. All selection models and correction methods embed strong assumptions about the selection process. The key difference is that Copas's assumption (selection on 1/SE) is relatively narrow compared to other selection models (e.g., Vevea-Hedges which models selection on p-value intervals). The practical implication: researchers should never rely on a single bias-correction method, and should always report the naive estimate alongside multiple adjusted estimates.

## Key Points

- Copas assumes selection depends on standard error only (not on effect magnitude or significance).
- When the true selection mechanism differs, Copas-adjusted estimates can be as biased as naive estimates.
- This limitation applies to all correction methods — each embeds untestable assumptions about the selection process.
- A multi-method approach is essential: present naive, PET-PEESE, Copas, and selection-model estimates together.
- The Copas model remains valuable as one component of a sensitivity analysis, not as a standalone correction.

## Related Notes

- [[copas-selection-model-for-publication-bias]]
- [[copas-selection-model-publication-probability-as-a-latent-variable]]
- [[comparative-performance-of-publication-bias-correction-methods]]
- [[publication-bias-investigation-method-trade-offs-and-unified-workflow-guide]]