---
title: 'Resource Distribution Norms: COR Theory Empirical Reference'
description: Empirical data on resource distributions from Conservation of Resources theory for simulation parameter calibration
author: pi
editor: lam
date: 2026-06-16T15:41:31.785Z
tags:
  - psychology
  - resources
  - empirical
  - reference
  - positive-psychology
---
Conservation of Resources (COR) theory (Hobfoll 1989, 2001) [@hobfoll2002] predicts resources are right-skewed in the general population: most individuals have moderate resources, a long tail of low-resource individuals exist, and few have very high resources. This reflects resource caravans and resource inequality documented in population surveys.

Empirically, socioeconomic resource distributions (income, wealth) follow log-normal or Pareto distributions across populations, consistent with right-skew. Psychological resources (self-efficacy, optimism, hope) measured via PsyCap scales show distributions closer to normal but with negative skew (most people report moderately high levels). Liu et al. (2020) [@liu2020] found the Perceived Self-Efficacy subscale of PSS-10 (reverse-scored) item means of 1.82-2.22 SD 0.78-0.92 on a 0-4 scale in Chinese adolescents (N=1,574).

For simulation: a right-skewed distribution (log-normal with meanlog ~ -0.3 to -0.1, sdlog ~ 0.4-0.6) or a sigmoid-transformed normal with positive offset produces empirically defensible resource distributions. The COR literature emphasises that resource loss is disproportionately more salient than resource gain (loss spiral asymmetry), which has implications for regeneration rates in dynamic models [@hobfoll2001].

## Sources
- [@hobfoll2001] Hobfoll, S. E. (2001). The influence of culture, community, and the nested-self in the stress process: Advancing conservation of resources theory. Applied Psychology, 50(3), 337-421.
- [@hobfoll2002] Hobfoll, S. E. (2002). Social and psychological resources and adaptation. Review of General Psychology, 6(4), 307-324.
- [@liu2020] Liu, X., Zhao, Y., Li, J., Dai, J., Wang, X., & Wang, S. (2020). Factor structure of the 10-item Perceived Stress Scale and measurement invariance across genders among Chinese adolescents. Frontiers in Psychology, 11, 537.
- Luthans, F., Youssef-Morgan, C. M., & Avolio, B. J. (2017). Psychological capital and beyond. Oxford University Press.

## Existing Notes
- [[psychological-resources-definition-and-core-constructs]]
- [[psychological-resources-and-resilience-executive-summary]]

## Relevant notes

- [[affect-distribution-norms-panas-empirical-reference]]
- [[resource-regeneration-rates-cor-recovery-reference]]
- [[psychological-resources-and-resilience-executive-summary]]
- [[resilience-distribution-norms-cd-risc-empirical-reference]]
- [[correlation-between-psychological-resources-and-resilience-empirical-range]]