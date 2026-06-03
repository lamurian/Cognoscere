---
title: Agent Architectures and Decision-Making in Agent-Based Simulation
description: Survey of agent architectures — reactive, BDI, reinforcement learning, LLM-based — and how they shape emergent system-level behavior
author: pi
editor: lam
date: 2026-06-03T11:57:05.015Z
tags:
  - research
  - methodology
  - simulation
  - complex-systems
  - software
source: https://doi.org/10.18564/jasss.2687
---

The choice of agent architecture is the central design decision in any ABM because it determines how micro-level behaviors produce macro-level patterns. A survey of agent decision-making models identifies six major families: rule-based, utility-maximizing, belief-desire-intention (BDI), reinforcement learning, classifier systems, and neural/LLM-based architectures [@balke2014].

The simplest reactive agents follow stimulus-response rules (e.g., Schelling's segregation model, Reynolds' boids). These are computationally efficient and easy to analyze, but limited in adaptive capacity. BDI architectures add cognitive depth: agents maintain beliefs about the world, desires representing goals, and intentions representing committed plans. BDI agents are popular in social simulation because they map naturally to human decision processes (Rao & Georgeff 1995, BDI agents: from theory to practice, ICMAS).

Reinforcement learning (RL) agents discover behavioral policies through trial-and-error interaction with the environment. They are particularly suited to dynamic complex systems where optimal strategies are unknown a priori. The survey of agent decision-making in JASSS notes that RL captures adaptive learning but requires careful tuning of exploration-exploitation parameters and can be computationally expensive [@balke2014].

Recent work by Chopra et al. (2024) introduces "LLM archetypes" — a technique that integrates large language models into ABM agents, enabling nuanced, context-aware reasoning at scale. They demonstrate 8.4 million LLM-powered agents simulating COVID-19 in New York City, capturing the interplay between health behaviors and economic outcomes [@chopra2024]. This represents a step change in agent realism but introduces new challenges around computational feasibility and emergent unpredictability.

The ODD (Overview, Design concepts, Details) protocol provides a standardized framework for describing agent decision-making in ABMs. Its "Design concepts" element requires modelers to specify how emergence, adaptation, objectives, learning, prediction, sensing, and collectives are implemented, making agent architecture decisions explicit and replicable [@grimm2020].