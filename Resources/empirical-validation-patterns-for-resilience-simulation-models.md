---
title: Empirical Validation Patterns for Resilience Simulation Models
description: 'Empirical benchmarks for validating resilience simulation models: mortality, wealth, and disease associations.'
author: pi
editor: lam
date: 2026-09-02T02:28:25.926Z
tags:
  - resilience
  - validation
  - methodology
  - simulation
  - empirical
---
## Summary

Validating computational models of psychological resilience requires matching simulated outputs against established empirical patterns. The literature identifies several benchmark associations that simulation models should reproduce to demonstrate construct validity.

The strongest validation benchmark comes from meta-analytic epidemiological evidence: positive psychological well-being, including resilience, is associated with a 13% reduction in mortality risk per standard deviation (Chida and Steptoe 2008). LALS reproduced this exact effect size (HR=0.87) at baseline, providing face validity for its internal dynamics [@lecuyerming2025].

Additional empirical benchmarks include: a 10-15% increase in lifetime earnings per SD of non-cognitive skills (Heckman and Kautz 2012), 11-15% longer lifespan associated with optimism (Lee et al. 2019), and medium-to-large effect sizes (d=0.5-0.8) for resilience training programs on psychological outcomes (Joyce et al. 2018). The LALS simulation produced a 24% wealth increase per SD resilience, which exceeds the 10% earnings benchmark but is plausible given compounding effects over 47 years.

Pattern-oriented modeling (POM) at multiple levels provides the strongest validation framework for resilience ABMs: individual trajectories should match longitudinal panel data patterns, population distributions should match epidemiological benchmarks, and network structures should match social support research findings.

## Key Points

- Primary validation benchmark: 13% mortality risk reduction per SD of positive psychological well-being (meta-analytic evidence)
- LALS successfully reproduced this benchmark, with HR=0.87 for baseline resilience-mortality association
- Secondary benchmarks include wealth accumulation, disease incidence, and functional outcomes (walking speed)
- Pattern-oriented modeling at multiple levels (individual, population, network) provides the most robust validation approach
- The field lacks standardized benchmark scenarios comparable to those in climate science or epidemiology

## Sources

@lecuyerming2025

## Relevant notes

- [LALS Framework for Simulating Resilience Intervention Lifelong Impact](Resources/lals-framework-for-simulating-resilience-intervention-lifelong-impact.md)
- [Validation Challenges for Agent-Based Resilience Models](Resources/validation-challenges-for-agent-based-resilience-models.md)
- [Limitations and Future Directions for Validated Resilience Simulation](Resources/limitations-and-future-directions-for-validated-resilience-simulation.md)
- [Executive Summary: ABM Approaches to Psychological Resilience](Resources/executive-summary-abm-approaches-to-psychological-resilience.md)
- [Resilience Distribution: Simulated vs Empirical](Resources/resilience-distribution-simulated-vs-empirical.md)