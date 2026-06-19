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
- SIMULATION_NUM_AGENTS, SIMULATION_MAX_DAYS, SIMULATION_SEED: [Simulation Orchestration and Output Parameters](simulation-orchestration-and-output-parameters.md)
- NETWORK_WATTS_K, NETWORK_WATTS_P: [Watts-Strogatz Small-World Network Parameters for Social Simulation](watts-strogatz-small-world-network-parameters-for-social-simulation.md)

### Agent State and Behavior Parameters
- AGENT_INITIAL_RESILIENCE_MEAN/SD, AGENT_INITIAL_AFFECT_MEAN/SD, AGENT_INITIAL_RESOURCES_MEAN/SD: [Agent Initialization State Parameters](agent-initialization-state-parameters.md)
- AGENT_STRESS_PROBABILITY, AGENT_SUBEVENTS_PER_DAY: [Stress Generation and Poisson Event Frequency Parameters](stress-generation-and-poisson-event-frequency-parameters.md)
- AGENT_COPING_SUCCESS_RATE, AGENT_RESOURCE_COST: [Coping Decision Parameters in Stress-Coping Models](coping-decision-parameters-in-stress-coping-models.md)

### Stress Event Parameters
- STRESS_CONTROLLABILITY_MEAN/SD, STRESS_OVERLOAD_MEAN/SD: [Stress Generation and Poisson Event Frequency Parameters](stress-generation-and-poisson-event-frequency-parameters.md)
- STRESS_BETA_ALPHA, STRESS_BETA_BETA, STRESS_DECAY_RATE: [Beta Distribution Parameters for Stress Sampling](beta-distribution-parameters-for-stress-sampling.md)
- STRESS_CONTROLLABILITY_UPDATE_RATE, STRESS_OVERLOAD_UPDATE_RATE: [PSS-10 Item Parameters and Dynamic Response](pss-10-item-parameters-and-dynamic-response.md)

### Appraisal and Threshold Parameters
- APPRAISAL_OMEGA_C, APPRAISAL_OMEGA_O, APPRAISAL_BIAS, APPRAISAL_GAMMA: [Challenge-Hindrance Appraisal Framework Parameters](challenge-hindrance-appraisal-framework-parameters.md)
- THRESHOLD_BASE_THRESHOLD, THRESHOLD_CHALLENGE_SCALE, THRESHOLD_HINDRANCE_SCALE: [Stress Threshold and Appraisal Parameters](stress-threshold-and-appraisal-parameters.md)
- STRESS_ALPHA_CHALLENGE, STRESS_ALPHA_HINDRANCE, STRESS_DELTA: [Stress Threshold and Appraisal Parameters](stress-threshold-and-appraisal-parameters.md)
- THRESHOLD_STRESS_THRESHOLD, THRESHOLD_AFFECT_THRESHOLD: [Stress Threshold and Appraisal Parameters](stress-threshold-and-appraisal-parameters.md)

### Social Interaction Parameters
- INTERACTION_INFLUENCE_RATE, INTERACTION_RESILIENCE_INFLUENCE, INTERACTION_MAX_NEIGHBORS: [Social Interaction and Emotional Contagion Parameters](social-interaction-and-emotional-contagion-parameters.md)

### Affect and Resilience Dynamics Parameters
- AFFECT_PEER_INFLUENCE_RATE, AFFECT_EVENT_APPRAISAL_RATE, AFFECT_HOMEOSTATIC_RATE: [Affect Dynamics and Emotional Homeostasis Parameters](affect-dynamics-and-emotional-homeostasis-parameters.md)
- RESILIENCE_HOMEOSTATIC_RATE, RESILIENCE_COPING_SUCCESS_RATE, RESILIENCE_SOCIAL_SUPPORT_RATE: [Resilience Dynamics and Homeostatic Regulation Parameters](resilience-dynamics-and-homeostatic-regulation-parameters.md)
- RESILIENCE_OVERLOAD_THRESHOLD, N_INFLUENCING_HINDRANCE: [Resilience Dynamics and Homeostatic Regulation Parameters](resilience-dynamics-and-homeostatic-regulation-parameters.md)
- N_INFLUENCING_NEIGHBORS: [Affect Dynamics and Emotional Homeostasis Parameters](affect-dynamics-and-emotional-homeostasis-parameters.md)
- RESILIENCE_BOOST_RATE: [Protective Factor Efficacy and Allocation Parameters](protective-factor-efficacy-and-allocation-parameters.md)

### Resource Dynamics Parameters
- PROTECTIVE_*_SUPPORT, PROTECTIVE_IMPROVEMENT_RATE: [Protective Factor Efficacy and Allocation Parameters](protective-factor-efficacy-and-allocation-parameters.md)
- RESOURCE_BASE_REGENERATION, RESOURCE_ALLOCATION_COST, RESOURCE_COST_EXPONENT: [Resource Conservation and Allocation Parameters](resource-conservation-and-allocation-parameters.md)
- RESOURCE_SOCIAL_EXCHANGE_RATE, RESOURCE_EXCHANGE_THRESHOLD, RESOURCE_MAX_EXCHANGE_RATIO: [Social Interaction and Emotional Contagion Parameters](social-interaction-and-emotional-contagion-parameters.md)

### Coping Mechanism Parameters
- COPING_CHALLENGE_BONUS, COPING_HINDRANCE_PENALTY, COPING_BASE_PROBABILITY, COPING_SOCIAL_INFLUENCE: [Coping Decision Parameters in Stress-Coping Models](coping-decision-parameters-in-stress-coping-models.md)

### PSS-10 Parameters
- PSS10_ITEM_MEAN, PSS10_ITEM_SD, PSS10_LOAD_OVERLOAD, PSS10_LOAD_CONTROLLABILITY: [PSS-10 Item Parameters and Dynamic Response](pss-10-item-parameters-and-dynamic-response.md)
- PSS10_OVERLOAD_SD, PSS10_CONTROLLABILITY_SD, PSS10_BIFACTOR_COR: [PSS-10 Bifactor Measurement Parameters for Perceived Stress](pss-10-bifactor-measurement-parameters-for-perceived-stress.md)
- PSS10_THRESHOLD, PSS10_SENSITIVITY, PSS10_MOMENTUM_WEIGHT: [PSS-10 Item Parameters and Dynamic Response](pss-10-item-parameters-and-dynamic-response.md)

### Network Adaptation Parameters
- NETWORK_ADAPTATION_THRESHOLD, NETWORK_HOMOPHILY_STRENGTH, NETWORK_REWIRE_PROBABILITY: [Network Adaptation and Homophily Parameters](network-adaptation-and-homophily-parameters.md)

### Utility Parameters
- UTILITY_SOFTMAX_TEMPERATURE: [Softmax Decision-Making and Utility Parameters](softmax-decision-making-and-utility-parameters.md)

### Output Configuration
- LOG_LEVEL, OUTPUT_RESULTS_DIR, OUTPUT_RAW_DIR, OUTPUT_LOGS_DIR: [Simulation Orchestration and Output Parameters](simulation-orchestration-and-output-parameters.md)

## Usage Notes

Each parameter note contains literature-backed value ranges and justifications. For sensitivity analysis, start with default values and vary parameters with wide uncertainty ranges first: RESOURCE_BASE_REGENERATION, APPRAISAL_OMEGA weights, THRESHOLD_BASE_THRESHOLD, and NETWORK_WATTS_K.

## Relevant notes
- [Agent Architectures and Decision-Making in Agent-Based Simulation](agent-architectures-and-decision-making-in-agent-based-simulation.md)
- [Why Agent-Based Simulation Excels Over Equation-Based Approaches for Complex Adaptive Systems](why-agent-based-simulation-excels-over-equation-based-approaches-for-complex-adaptive-systems.md)
- [Spatial, Network, and Temporal Structures in Agent-Based Simulation](spatial-network-and-temporal-structures-in-agent-based-simulation.md)
- [Agent-Based Simulation for Complex Adaptive Systems — Executive Summary](agent-based-simulation-for-complex-adaptive-systems-executive-summary.md)
- [Psychological Resilience Mechanisms in Working-Age Population: Executive Summary](psychological-resilience-mechanisms-in-working-age-population-executive-summary.md)
- [The Job Demands-Resources Model and Workplace Resilience](the-job-demands-resources-model-and-workplace-resilience.md)
- [How Resilience Interventions Improve Employee Wellbeing](how-resilience-interventions-improve-employee-wellbeing.md)
- [Cost-Effective Organisation-Based Interventions for Psychological Resilience: Executive Summary](cost-effective-organisation-based-interventions-for-psychological-resilience-executive-summary.md)
- [Drivers of Cost-Effectiveness in Workplace Resilience Interventions](drivers-of-cost-effectiveness-in-workplace-resilience-interventions.md)

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