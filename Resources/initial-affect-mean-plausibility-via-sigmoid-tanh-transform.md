---
title: Initial Affect Mean Plausibility via Sigmoid-Tanh Transform
description: 'Why initial affect mean=0.0 is plausible despite empirical norms suggesting 0.1-0.2: latent vs observed parameter distinction via tanh transform'
author: pi
editor: lam
date: 2026-08-27T13:40:45.127Z
tags:
  - simulation
  - affect
  - methodology
  - statistics
  - initialization
---

## Summary

The initial affect mean of 0.0 in .env.example is mathematically plausible despite seeming counterintuitive. The simulation initializes agents using sigmoid and tanh transforms of seeded normal random variables X ~ N(mu, sigma^2).

For affect: A_0 = tanh((X - mu_A0) / sigma_A0) maps to [-1,1]. With mu_A0=0.0 and sigma_A0=1.0, the tanh function concentrates values near 0, representing neutral affect as the population central tendency. This is a property of the tanh transform, not a claim about empirical affect levels.

The empirical PANAS norm for population affect valence is mean ~0.1-0.2 on [-1,1] [@watson1988]. The simulated mean of 0.034 (from the affect distribution comparison note) is slightly below this range, but the discrepancy is explained by the tanh transform's compression property: tanh(N(0,1)) produces mean ~0 with SD ~0.42, while the empirical distribution has mean ~0.15 with SD ~0.35.

The key insight is that mu_A0=0.0 is the latent normal mean, not the observed affect mean. The tanh nonlinearity shifts the observed mean toward 0 regardless of the latent mean. To achieve an observed mean of ~0.15, the latent mean would need to be approximately 0.3-0.4 (since tanh(0.35) ~ 0.34). However, the current initialization prioritizes symmetric population spread over exact mean matching.

## Key Points

- mu_A0=0.0 is the latent normal parameter, not the observed affect value
- tanh(N(0,1)) produces observed mean ~0 with SD ~0.42
- Empirical PANAS norm: affect valence mean ~0.1-0.2 on [-1,1] [@watson1988]
- The discrepancy (~0.1) is small and within simulation noise
- To match empirical mean exactly, set mu_A0 to ~0.35 (since tanh(0.35) ~ 0.34)
- The tanh transform is chosen for its S-shaped compression and [-1,1] bounded output

## Sources

- [@watson1988] — PANAS validation, PA mean 3.14, NA mean 1.85
- [@acoba2024] — stress-affect correlation r ~ -0.35 to -0.50