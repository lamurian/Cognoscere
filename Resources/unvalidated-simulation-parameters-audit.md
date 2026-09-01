---
title: Unvalidated Simulation Parameters Audit
description: 'Audit of unvalidated simulation parameters: PSS-10 dynamic, resource exchange, network thresholds, and all ASSUMPTION_* constants'
author: pi
editor: lam
date: 2026-08-27T13:40:45.130Z
tags:
  - simulation
  - validation
  - parameters
  - methodology
  - uncertainty
---

## Summary

Several simulation parameters lack direct empirical validation from scientific publications. These fall into three categories: model-specific tuning constants, arbitrary defaults, and novel mechanism parameters without prior literature.

**PSS-10 dynamic parameters (model-specific):** PSS10_SCALE=6.0, PSS10_NOISE_SD=2.0, PSS10_SKEW_A=3.0, PSS10_BIAS_SD=1.0, PSS10_RESILIENCE_COUPLING=3.5, PSS10_STRESS_DAMPENING=1.0, PSS10_SENSITIVITY=0.5, PSS10_MOMENTUM_WEIGHT=0.3. These control how PSS-10 scores update dynamically from agent states. The sensitivity and momentum values (0.5, 0.3) have directional support from the rumination and stress perception literature, but specific values are calibrated for the model, not directly measured.

**Resource exchange parameters (model-internal):** RESOURCE_SOCIAL_EXCHANGE_RATE=0.5, RESOURCE_EXCHANGE_THRESHOLD=0.2, RESOURCE_MAX_EXCHANGE_RATIO=0.5. These control resource sharing between agents during social interactions. No direct empirical measurement exists for these specific quantities; they are calibrated to produce reasonable social support dynamics.

**Network and neighborhood parameters:** N_INFLUENCING_HINDRANCE=3 (consecutive hindrances for overload detection), NETWORK_ADAPTATION_THRESHOLD=3. These are model-specific thresholds without direct empirical grounding.

**Protective factor parameters:** PROTECTIVE_IMPROVEMENT_RATE=0.5 (how quickly allocated resources translate to protective effects). No direct empirical measurement.

**Stress learning rates:** STRESS_CONTROLLABILITY_UPDATE_RATE=0.05, STRESS_OVERLOAD_UPDATE_RATE=0.05. These control how stress dimensions update from events. The direction is validated (stress perception adjusts with experience) but magnitudes are assumed.

All 56+ ASSUMPTION_* parameters are model-internal tuning constants without scientific publication backing.

## Key Points

- 8 PSS-10 dynamic parameters: model-specific, no direct empirical values
- 3 resource exchange parameters: calibrated, not measured
- 2 network threshold parameters: model-specific
- 1 protective improvement rate: arbitrary default
- 2 stress learning rates: direction validated, magnitude assumed
- 56+ ASSUMPTION_* parameters: all unvalidated model constants
- Recommendation: sensitivity analysis across plausible ranges for all unvalidated parameters

## Sources

- [@hobfoll1989] — COR theory (directional support for resource dynamics)
- [@centola2018] — emotional contagion (directional support for social influence)