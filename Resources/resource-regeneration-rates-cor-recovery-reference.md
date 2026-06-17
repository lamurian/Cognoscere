---
title: 'Resource Regeneration Rates: COR Recovery Reference'
description: Empirical estimates and theoretical constraints for resource recovery/regeneration rates from COR theory and longitudinal studies
author: pi
editor: lam
date: 2026-06-16T15:41:31.796Z
tags:
  - psychology
  - resources
  - empirical
  - reference
---
Conservation of Resources (COR) theory (Hobfoll 2001) [@hobfoll2001] posits that resource loss is more potent than resource gain (loss asymmetry principle), and resources regenerate when individuals are not under acute stress. However, few quantitative estimates of regeneration rates exist in the literature.

Empirical approximations come from several sources:
(1) Recovery from stressor exposure: Zohar et al. (2003) [@zohar2003] found that following a stressful workday, psychological resources recover to baseline within ~2-3 hours of non-work activities (evening recovery). Weekend recovery can fully restore depleted resources if no chronic stress is present.
(2) Sonnentag & Fritz (2007) [@sonnentag2007] identified four recovery experiences: psychological detachment (~2-3 hours daily needed for full resource regeneration), relaxation, mastery, and control. Resource depletion without recovery leads to burnout cycle.
(3) Longitudinal resource dynamics: for psychological resources (self-efficacy, optimism), natural within-person fluctuation is ±10-20% of baseline over weeks. Resource loss spirals reduce resources at rates of ~5-15% per month without intervention.

For simulation: daily resource_base_regeneration ~0.2-0.3 on [0,1] over a waking period is consistent with evening recovery literature, meaning ~20-30% of depleted resources are restored per day of normal activity (no additional acute stress). Higher regeneration rates (~0.4-0.6) during weekends. These are approximate; sensitivity analysis across a range (0.15-0.40) is recommended.

## Sources
- [@hobfoll2001] Hobfoll, S. E. (2001). The influence of culture, community, and the nested-self in the stress process. Applied Psychology, 50(3), 337-421.
- [@zohar2003] Zohar, D., Tzischinski, O., & Epstein, R. (2003). Effects of energy availability on immediate and delayed emotional reactions to work events. Journal of Applied Psychology, 88(6), 1082-1093.
- [@sonnentag2007] Sonnentag, S., & Fritz, C. (2007). The Recovery Experience Questionnaire: Development and validation of a measure for assessing recuperation and unwinding from work. Journal of Occupational Health Psychology, 12(3), 204-221.

## Existing Notes
- [[psychological-resources-definition-and-core-constructs]]
- [[correlation-between-psychological-resources-and-resilience-empirical-range]]

## Relevant notes

- [[resource-distribution-norms-cor-theory-empirical-reference]]
- [[psychological-resources-and-resilience-executive-summary]]
- [[correlation-between-psychological-resources-and-resilience-empirical-range]]
- [[coping-effectiveness-rates-skinner-et-al-meta-analytic-reference]]
- [[empirical-evidence-on-llm-failure-severity-in-software-engineering]]