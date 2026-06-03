---
title: Mental Health ABM Parameter Index
description: Index document linking all atomic parameter notes for the agent-based mental health simulation. Maps configuration variables to literature-backed parameter notes."
author: pi
editor: lam
date: 2026-06-03T13:11:44.086Z
tags:
  - simulation
  - index
  - research
  - core-theory
  - complex-systems
---

## Summary

This index catalogs all configurable parameters in the agent-based mental health simulation, linking each to its atomic documentation note and primary sources. Parameter values are grounded in empirical literature where available and calibrated for initial sensitivity analysis.

## Parameter Note Map

### Simulation and Network Parameters
- SIMULATION_NUM_AGENTS, SIMULATION_MAX_DAYS, SIMULATION_SEED: [[simulation-orchestration-and-output-parameters]]
- NETWORK_WATTS_K, NETWORK_WATTS_P: [[watts-strogatz-small-world-network-parameters-for-social-simulation]]

### Agent State and Behavior Parameters
- AGENT_INITIAL_RESILIENCE_MEAN/SD, AGENT_INITIAL_AFFECT_MEAN/SD, AGENT_INITIAL_RESOURCES_MEAN/SD: [[agent-initialization-state-parameters]]
- AGENT_STRESS_PROBABILITY, AGENT_SUBEVENTS_PER_DAY: [[stress-generation-and-poisson-event-frequency-parameters]]
- AGENT_COPING_SUCCESS_RATE, AGENT_RESOURCE_COST: [[coping-decision-parameters-in-stress-coping-models]]

### Stress Event Parameters
- STRESS_CONTROLLABILITY_MEAN/SD, STRESS_OVERLOAD_MEAN/SD: [[stress-generation-and-poisson-event-frequency-parameters]]
- STRESS_BETA_ALPHA, STRESS_BETA_BETA, STRESS_DECAY_RATE: [[beta-distribution-parameters-for-stress-sampling]]
- STRESS_CONTROLLABILITY_UPDATE_RATE, STRESS_OVERLOAD_UPDATE_RATE: [[pss-10-item-parameters-and-dynamic-response]]

### Appraisal and Threshold Parameters
- APPRAISAL_OMEGA_C, APPRAISAL_OMEGA_O, APPRAISAL_BIAS, APPRAISAL_GAMMA: [[challenge-hindrance-appraisal-framework-parameters]]
- THRESHOLD_BASE_THRESHOLD, THRESHOLD_CHALLENGE_SCALE, THRESHOLD_HINDRANCE_SCALE: [[stress-threshold-and-appraisal-parameters]]
- STRESS_ALPHA_CHALLENGE, STRESS_ALPHA_HINDRANCE, STRESS_DELTA: [[stress-threshold-and-appraisal-parameters]]
- THRESHOLD_STRESS_THRESHOLD, THRESHOLD_AFFECT_THRESHOLD: [[stress-threshold-and-appraisal-parameters]]

### Social Interaction Parameters
- INTERACTION_INFLUENCE_RATE, INTERACTION_RESILIENCE_INFLUENCE, INTERACTION_MAX_NEIGHBORS: [[social-interaction-and-emotional-contagion-parameters]]

### Affect and Resilience Dynamics Parameters
- AFFECT_PEER_INFLUENCE_RATE, AFFECT_EVENT_APPRAISAL_RATE, AFFECT_HOMEOSTATIC_RATE: [[affect-dynamics-and-emotional-homeostasis-parameters]]
- RESILIENCE_HOMEOSTATIC_RATE, RESILIENCE_COPING_SUCCESS_RATE, RESILIENCE_SOCIAL_SUPPORT_RATE: [[resilience-dynamics-and-homeostatic-regulation-parameters]]
- RESILIENCE_OVERLOAD_THRESHOLD, N_INFLUENCING_HINDRANCE: [[resilience-dynamics-and-homeostatic-regulation-parameters]]
- N_INFLUENCING_NEIGHBORS: [[affect-dynamics-and-emotional-homeostasis-parameters]]
- RESILIENCE_BOOST_RATE: [[protective-factor-efficacy-and-allocation-parameters]]

### Resource Dynamics Parameters
- PROTECTIVE_*_SUPPORT, PROTECTIVE_IMPROVEMENT_RATE: [[protective-factor-efficacy-and-allocation-parameters]]
- RESOURCE_BASE_REGENERATION, RESOURCE_ALLOCATION_COST, RESOURCE_COST_EXPONENT: [[resource-conservation-and-allocation-parameters]]
- RESOURCE_SOCIAL_EXCHANGE_RATE, RESOURCE_EXCHANGE_THRESHOLD, RESOURCE_MAX_EXCHANGE_RATIO: [[social-interaction-and-emotional-contagion-parameters]]

### Coping Mechanism Parameters
- COPING_CHALLENGE_BONUS, COPING_HINDRANCE_PENALTY, COPING_BASE_PROBABILITY, COPING_SOCIAL_INFLUENCE: [[coping-decision-parameters-in-stress-coping-models]]

### PSS-10 Parameters
- PSS10_ITEM_MEAN, PSS10_ITEM_SD, PSS10_LOAD_OVERLOAD, PSS10_LOAD_CONTROLLABILITY: [[pss-10-item-parameters-and-dynamic-response]]
- PSS10_OVERLOAD_SD, PSS10_CONTROLLABILITY_SD, PSS10_BIFACTOR_COR: [[pss-10-bifactor-measurement-parameters-for-perceived-stress]]
- PSS10_THRESHOLD, PSS10_SENSITIVITY, PSS10_MOMENTUM_WEIGHT: [[pss-10-item-parameters-and-dynamic-response]]

### Network Adaptation Parameters
- NETWORK_ADAPTATION_THRESHOLD, NETWORK_HOMOPHILY_STRENGTH, NETWORK_REWIRE_PROBABILITY: [[network-adaptation-and-homophily-parameters]]

### Utility Parameters
- UTILITY_SOFTMAX_TEMPERATURE: [[softmax-decision-making-and-utility-parameters]]

### Output Configuration
- LOG_LEVEL, OUTPUT_RESULTS_DIR, OUTPUT_RAW_DIR, OUTPUT_LOGS_DIR: [[simulation-orchestration-and-output-parameters]]

## Usage Notes

Each parameter note contains literature-backed value ranges and justifications. For sensitivity analysis, start with default values and vary parameters with wide uncertainty ranges first: RESOURCE_BASE_REGENERATION, APPRAISAL_OMEGA weights, THRESHOLD_BASE_THRESHOLD, and NETWORK_WATTS_K.

## Relevant notes
- [[agent-architectures-and-decision-making-in-agent-based-simulation]]
- [[why-agent-based-simulation-excels-over-equation-based-approaches-for-complex-adaptive-systems]]
- [[spatial-network-and-temporal-structures-in-agent-based-simulation]]
- [[agent-based-simulation-for-complex-adaptive-systems-executive-summary]]
- [[psychological-resilience-mechanisms-in-working-age-population-executive-summary]]
- [[the-job-demands-resources-model-and-workplace-resilience]]
- [[how-resilience-interventions-improve-employee-wellbeing]]
- [[cost-effective-organisation-based-interventions-for-psychological-resilience-executive-summary]]
- [[drivers-of-cost-effectiveness-in-workplace-resilience-interventions]]

## Sources
- @cohen1983
- @watts1998
- @cavanaugh2000
- @lazarus1984
- @hobfoll1989
- @friston2016
- @reis2017
- @centola2018
- @bakker2017
- @podsakoff2023
- @liu2020
- @shively2020
- @barbosaleiker2012