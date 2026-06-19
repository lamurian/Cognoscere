---
title: Decision-Theoretic Agents for Cognitive Reappraisal and Coping
description: Si (2015) developed Thespian agent architecture for simulating emotion-focused coping strategies, replicating the Ironic Processes Theory of depression
author: pi
editor: lam
date: 2026-06-04T11:31:26.045Z
tags:
  - agent
  - simulation
  - coping
  - emotion-regulation
  - cognitive-modeling
  - decision-making
  - clinical-psychology
  - stress
---

Si (2015) [@si2015] developed computational models of emotion-focused coping within the Thespian multi-agent framework, a decision-theoretic architecture based on POMDP agents with Theory of Mind. The work is the first computational demonstration of how reappraisal-based emotion regulation can fail under high stress and limited cognitive resources, directly supporting the Ironic Processes Theory of depression [@si2015].

**Architecture.** Thespian agents are goal-based decision-theoretic agents whose goals are encoded as reward functions over state features. Appraisal uses five variables (motivational relevance, motivational congruence, accountability, control, novelty) evaluated from the agent's decision-making process. Emotion-focused coping strategies are mapped to domain-independent operations: shift responsibility (attributing blame), wishful thinking (changing mental model probabilities), distancing (reducing goal importance), positive reinterpretation (increasing goal importance), and reappraisal (evaluating previously ignored events).

**Reappraisal experiment.** The agent was initialized with 50 goals of ascending importance. A simulated stressful event negatively impacted the most important goal at three levels (light, moderate, high stress). During reappraisal, a random event/thought affected a subset of goals (breadth = 1, 3, or 5). Results showed that under high stress, evaluating events against 5 goals yielded ~60% recovery within 10 attempts, while single-goal evaluation yielded <10% success. For depressed agents (80% negative memory recall), reappraisal almost always failed regardless of strategy.

**Key finding for intervention design.** For healthy populations, evaluating events against multiple goals is beneficial. For depressed populations, narrow evaluation against a single goal is more adaptive — consistent with clinical observations that depressed individuals benefit more from specific, focused cognitive strategies than from broad reinterpretation. This demonstrates how ABM can generate testable hypotheses about coping strategies.

**Relevance.** The Thespian framework represents the first generation of ABM approaches to psychological resilience: hand-crafted, theory-driven agents with explicit cognitive architectures. It connects appraisal theory [@lazarus1984] with computational decision-making and remains relevant for modeling stress-coping dynamics at the individual level.

## Relevant notes

- [Coping Decision Parameters in Stress-Coping Models](coping-decision-parameters-in-stress-coping-models.md)
- [Positive Interpretation Bias and Emotion Regulation as Cognitive Mechanisms of Resilience](positive-interpretation-bias-and-emotion-regulation-as-cognitive-mechanisms-of-resilience.md)
- [Challenge-Hindrance Stress Appraisal and Coping Pipeline](challenge-hindrance-stress-appraisal-and-coping-pipeline.md)
- [Stress Threshold and Appraisal Parameters](stress-threshold-and-appraisal-parameters.md)
- [Affect-Regulation Framework of Psychological Resilience](affect-regulation-framework-of-psychological-resilience.md)
- [Agent Architectures and Decision-Making in Agent-Based Simulation](agent-architectures-and-decision-making-in-agent-based-simulation.md)