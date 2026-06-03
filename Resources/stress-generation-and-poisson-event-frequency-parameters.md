---
title: Stress Generation and Poisson Event Frequency Parameters
description: Daily stress event frequency modeled as Poisson process with lambda=2-5 events/day; event attributes controllability and overload drawn from normal distributions
author: pi
editor: lam
date: 2026-06-03T13:10:33.568Z
tags:
  - stress
  - coping
  - simulation
  - mechanisms
  - research
---
## Summary

Daily stressful events follow a Poisson distribution in the general population, with rate parameter lambda typically between 2-5 events per day depending on population and measurement method. The max(Poisson(lambda), 1) formulation ensures at least one daily sub-event.

Stress event attributes (controllability c, overload o) represent core dimensions of the transactional model of stress [@lazarus1984]. Controllability reflects perceived manageability of the stressor (mean 0.5, SD 0.2, range [0,1]), while overload reflects demand-resource imbalance (mean 0.5, SD 0.2, range [0,1]). These follow approximately normal distributions in the general population, with individual differences accounting for variance.

Event magnitude follows exponential decay distributions, reflecting that most daily stressors are minor while major events are rare. The probability of experiencing a clinically significant stressor on any given day ranges 0.1-0.3 in community samples.

## Sources
- @lazarus1984
- @cohen1983
- @bakker2017

## Relevant notes

- [[challenge-hindrance-appraisal-framework-parameters]]
- [[neurobiological-mechanisms-of-resilience-prefrontal-amygdala-circuitry-and-hpa-axis-regulation]]
- [[affect-regulation-framework-of-psychological-resilience]]
- [[psychological-resilience-mechanisms-in-working-age-population-executive-summary]]
- [[organisational-climate-and-culture-as-resilience-modulators]]