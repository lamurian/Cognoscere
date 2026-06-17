---
title: 'Resilience Distribution Norms: CD-RISC Empirical Reference'
description: Empirical means and SDs for psychological resilience from CD-RISC validation studies for simulation calibration
author: pi
editor: lam
date: 2026-06-16T15:41:31.781Z
tags:
  - psychology
  - resilience
  - empirical
  - reference
---
The Connor-Davidson Resilience Scale (CD-RISC) provides the primary empirical reference for calibrating resilience distributions in simulations. The original 25-item CD-RISC uses a 0-100 scale (Connor & Davidson 2003) [@connor2003]. The general population (N=577) mean was 80.4 (SD=12.8), corresponding to ~0.80 on a [0,1] scale after linear mapping. Primary care outpatients (N=139) scored 71.8 (SD=18.4), and psychiatric outpatients (N=43) scored 62.9 (SD=17.0).

The 10-item CD-RISC (Campbell-Sills & Stein 2007) [@campbellsills2007] uses a 0-40 scale (0-4 per item). Community sample mean was 29.4 (SD=5.8), corresponding to ~0.74 on [0,1]. Population resilience is negatively skewed (upper tail compressed), meaning most people cluster above the midpoint. Males typically score slightly higher than females (d ~0.26) [@nartovabochaver2021].

For simulation: a population mean of ~0.7-0.8 on [0,1] with slight left skew is empirically supported. A sigmoid transform from a latent normal with mean~0.8-1.0 and SD~0.7-0.9 on the logit scale produces the correct empirical shape. The CD-RISC-10 total score was 2.48 (SD=0.67) per item on the 0-4 scale from a Russian youth sample of 689 respondents [@nartovabochaver2021].

## Sources
- [@connor2003] Connor, K. M., & Davidson, J. R. T. (2003). Development of a new resilience scale: The Connor-Davidson Resilience Scale (CD-RISC). Depression and Anxiety, 18(2), 76-82.
- [@campbellsills2007] Campbell-Sills, L., & Stein, M. B. (2007). Psychometric analysis and refinement of the Connor-Davidson resilience scale (CD-RISC). Journal of Traumatic Stress, 20(6), 1019-1028.
- [@nartovabochaver2021] Nartova-Bochaver, S., Korneev, A., & Bochaver, K. (2021). Validation of the 10-Item Connor-Davidson Resilience Scale: The case of Russian youth. Frontiers in Psychiatry, 12, 611026.

## Existing Notes
- [[pss-10-and-resilience-meta-analytic-correlation]]
- [[psychological-resources-definition-and-core-constructs]]

## Relevant notes

- [[resource-distribution-norms-cor-theory-empirical-reference]]
- [[resilience-and-psychological-resources-empirical-correlations]]
- [[pss-10-and-resilience-meta-analytic-correlation]]
- [[affect-distribution-norms-panas-empirical-reference]]
- [[correlation-between-psychological-resources-and-resilience-empirical-range]]