---
title: 'Executive Summary: ABM Approaches to Psychological Resilience'
description: Survey of agent-based simulation methods for modeling psychological resilience — from rule-based coping agents to LLM-powered digital clones
author: pi
editor: lam
date: 2026-06-04T11:31:02.109Z
tags:
  - resilience
  - simulation
  - agent
  - executive-summary
  - research
  - methodology
  - cognitive-modeling
---

## Executive Summary

Agent-based simulation has emerged as a powerful methodology for modeling psychological resilience, bridging the gap between short-term experimental studies and long-term correlational research. Two distinct computational approaches dominate: decision-theoretic agents with hand-crafted appraisal-coping architectures, and LLM-based generative agents that simulate lifelong trajectories through natural language reasoning.

**Core approaches.** Si (2015) [@si2015] developed domain-independent models of emotion-focused coping within the Thespian framework, using POMDP-based agents with Theory of Mind to simulate cognitive reappraisal under stress. This work replicated the Ironic Processes Theory of depression, demonstrating that reappraisal fails under high stress and limited cognitive resources. The simulation showed that for healthy populations, evaluating events against multiple goals is beneficial, while for depressed populations, narrow evaluation is more adaptive.

**LLM-based simulation.** L'Ecuyer Ming (2025) [@lecuyerming2025] introduced LALS (Large-Scale Agent-based Longitudinal Simulation), a framework using 2,500 LLM-powered agent personas cloned across a 2x2 factorial experiment to measure the lifelong impact of resilience interventions. The simulation revealed that resilience training at age 6 produced more than double the wealth impact of the same intervention at age 18, with the strongest effects for low-SES agents.

**Existing implementation.** A companion project (see [Executive Summary: Agent-Based Simulation of Psychological Resilience](executive-summary-agent-based-simulation-of-psychological-resilience.md)) implements a Mesa-based simulation of psychological resilience with six integrated mechanism groups: stress appraisal, affect dynamics, resilience homeostasis, social interaction networks, resource management, and PSS-10 empirical validation.

## Key Findings

- **Decision-theoretic agents for coping** — [[Resources/research-abm-reappraisal-coping-thespian]]
- **LLM digital clones for lifelong resilience** — [[Resources/research-abm-lals-llm-resilience]]
- **Why ABM suits resilience modeling** — [[Resources/research-abm-suitability-resilience]]
- **Validation challenges in resilience ABM** — [[Resources/research-abm-validation-resilience]]

## Confidence Assessment

| Question | Confidence | Rationale |
|---|---|---|
| Q1 (WHY): Why is ABM suitable for modeling psychological resilience? | High | Supported by multiple peer-reviewed sources and the existing implementation project |
| Q2 (HOW): How do agent architectures implement resilience mechanisms? | High | Two distinct architectures (rule-based POMDP and LLM-based) with published implementations |

## Known Gaps

- No direct comparison study between rule-based and LLM-based resilience agents exists
- The "digital clone" methodology has not been validated against real longitudinal data
- Most ABM resilience models focus on individuals rather than social-ecological systems
- Cultural and demographic heterogeneity in resilience ABMs is underexplored
- The field lacks standardised benchmarks for validating resilience simulations

## Relevant notes

- [Agent-Based Simulation for Complex Adaptive Systems — Executive Summary](agent-based-simulation-for-complex-adaptive-systems-executive-summary.md)
- [Executive Summary: Agent-Based Simulation of Psychological Resilience](executive-summary-agent-based-simulation-of-psychological-resilience.md)
- [LLM-Enhanced Agents and the Future of Agent-Based Modeling](llm-enhanced-agents-and-the-future-of-agent-based-modeling.md)
- [Affect-Regulation Framework of Psychological Resilience](affect-regulation-framework-of-psychological-resilience.md)
- [Validation and Calibration Methods for Agent-Based Models](validation-and-calibration-methods-for-agent-based-models.md)