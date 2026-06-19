---
title: 'Daily Stress Event Norms: Experience Sampling Reference'
description: Empirical parameters for daily stressor frequency, controllability, and overload from daily diary studies
author: pi
editor: lam
date: 2026-06-16T15:41:31.789Z
tags:
  - psychology
  - stress
  - empirical
  - reference
---
Experience sampling and daily diary studies provide the empirical basis for stress event parameters in simulation. The National Study of Daily Experiences (NSDE), part of MIDUS, is the largest reference (Almeida et al. 2002) [@almeida2002]. Across 8 daily diaries with N=1,031 adults, 40% of days included at least one stressor. The average frequency was ~0.6-0.8 stressors per day. Younger adults report higher frequency than older adults.

Stressor characteristics: primary dimensions for appraisal are controllability and overload. Bolger & Schilling (1991) [@bolger1991] found that daily stressors are typically moderate on controllability (mean ~3-4 on 1-7 scale, SD ~1.5-2) and moderate on overload/intensity (mean ~3-4 on 1-7, SD ~1.5-2). The distribution of controllability is approximately normal, while overload is slightly right-skewed (more low-overload events).

By context: interpersonal stressors are most common (~40-50% of daily stressors), followed by work/achievement (~25-30%), and network stressors (~15-20%). These proportions are relatively stable across general population samples.

For simulation: stress event controllability ~0.4-0.6 (SD ~0.2-0.3) and overload ~0.4-0.6 (SD ~0.2-0.3) on [0,1] scale are supported. Daily stressor frequency ~0.3-0.8 events per day for general population. Events are moderately autocorrelated (residual r ~0.2-0.3 across days), consistent with stress generation processes.

## Sources
- [@almeida2002] Almeida, D. M., Wethington, E., & Kessler, R. C. (2002). The daily inventory of stressful events: An interview-based approach for measuring daily stressors. Assessment, 9(1), 41-55.
- [@bolger1991] Bolger, N., & Schilling, E. A. (1991). Personality and the problems of everyday life: The role of neuroticism in exposure and reactivity to daily stressors. Journal of Personality, 59(3), 355-386.
- Bolger, N., Davis, A., & Rafaeli, E. (2003). Diary methods: Capturing life as it is lived. Annual Review of Psychology, 54, 579-616.

## Relevant notes

- [Resource Regeneration Rates: COR Recovery Reference](resource-regeneration-rates-cor-recovery-reference.md)
- [PSS-10 Item-Level Descriptive Statistics](pss-10-item-level-descriptive-statistics.md)
- [Affect Distribution Norms: PANAS Empirical Reference](affect-distribution-norms-panas-empirical-reference.md)
- [Social Interaction Frequency: Diary Study Reference](social-interaction-frequency-diary-study-reference.md)
- [Resilience Distribution Norms: CD-RISC Empirical Reference](resilience-distribution-norms-cd-risc-empirical-reference.md)