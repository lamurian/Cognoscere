---
title: 'LALS: LLM-Based Digital Clone Simulation for Lifelong Resilience'
description: L'Ecuyer Ming (2025) introduced LALS framework using 2,500 LLM-powered agent personas with digital clone methodology for multi-decade resilience intervention counterfactuals
author: pi
editor: lam
date: 2026-06-04T11:31:26.045Z
tags:
  - agent
  - simulation
  - resilience
  - intervention
  - methodology
  - cognitive-modeling
  - behavioral
  - human-capital
source: https://arxiv.org/abs/2512.18803
---

L'Ecuyer Ming (2025) [@lecuyerming2025] introduced LALS (Large-Scale Agent-based Longitudinal Simulation), a framework that uses LLM-based agents and a "digital clone" design to simulate multi-decade counterfactual life trajectories for causal inference about psychological interventions. The methodology represents a paradigm shift from rule-based agents to generative agents grounded in a curated scientific corpus.

**Methodology.** 2,500 unique agent personas were generated from a Persona Matrix sampling SES (Low/Middle/High), Big 5 personality (OCEAN), working memory percentile, trait resilience percentile, and demographics. Each persona was cloned 4 times across a 2x2 factorial design (Resilience Operating System vs Sham, Age 6 vs Age 18), creating 10,000 agents. The ROS intervention appended cognitive reframing instructions (CBT-based) to the agent's system prompt. Agent behavior was grounded in a RAG pipeline over 3,917 peer-reviewed articles linking non-cognitive skills to longitudinal outcomes.

**Results.** The intervention at age 6 increased accumulated wealth by 43% vs control, while the same intervention at age 18 increased wealth by ~20%. Mortality risk was reduced by 30% (HR=0.70, p<0.001). Subjective well-being showed a +0.29 Z-score improvement for age 6 ROS vs -0.21 for sham. The intervention disproportionately benefited low-SES agents, closing 70% of the mortality gap between low and high SES. Agents with low cognitive ability showed the greatest marginal benefit.

**Key innovation.** The digital clone design eliminates inter-individual variance, enabling precise within-persona causal inference that is impossible in real-world studies. Each agent serves as its own counterfactual, moving beyond group-level averages to individual-level treatment effects.

**Limitations.** The "model of the mean" problem means LLM agents simulate archetypal behavior and likely overestimate effect sizes by under-representing idiosyncratic noise. The simulation lacks genuine biological mechanisms (HPA axis, genetics). Cultural fidelity is limited — LLMs project culturally dominant scripts, making demographic heterogeneity findings tentative.

**Relevance.** LALS positions ABM as a "computational wind tunnel" for social science — a hypothesis generation engine, not a predictive oracle. It complements traditional longitudinal studies by testing interventions that are infeasible in real-world RCTs due to cost, timeline, or ethical constraints.

## Relevant notes

- [[llm-enhanced-agents-and-the-future-of-agent-based-modeling]]
- [[agent-architectures-and-decision-making-in-agent-based-simulation]]
- [[agent-baseline-initialization-via-sigmoid-and-tanh-transforms]]
- [[executive-summary-agent-based-simulation-of-psychological-resilience]]
- [[psychological-resilience-mechanisms-in-working-age-population-executive-summary]]