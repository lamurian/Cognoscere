---
title: 'MiniCPM5-1B Training: UltraData and RL+OPD Pipeline'
description: UltraData tiered training and RL+OPD pipeline yield +16 point gains and hybrid reasoning
author: pi
editor: lam
date: 2026-07-07T23:27:16.753Z
tags:
  - llm
  - training
  - architecture
  - small-language-model
  - reinforcement-learning
---
MiniCPM5-1B's performance is driven by UltraData Tiered Data Management across three stages: base training, mid-training, and post-training. The training corpus is open-sourced as Ultra-FineWeb, Ultra-FineWeb-L3, and UltraData-Math [@minicpm2026]. Post-training uses SFT (200B deep-thinking tokens + 200B hybrid-thinking tokens), then RL, then On-Policy Distillation (OPD). Specialized RL teachers for math, code, QA, and writing are trained and distilled into one release model [@minicpm2026].

**RL + OPD impact.** RL + OPD raises average scores by +16 points on math, code, and instruction-following tasks while cutting overlong responses by 29 percentage points [@minicpm2026]. OPD uses reverse KL divergence as the advantage estimate with top-k logit matching between student and teacher, reusing teacher in-domain prompts without additional data curation. The model supports hybrid reasoning via a <think> chat template toggle, letting the same checkpoint serve as fast assistant or deliberate reasoner at inference time [@minicpm2025].

## Relevant notes

- [Efficiency Advantages of Sub-3B Language Models](Resources/efficiency-advantages-of-sub-3b-language-models.md)
- [MiniCPM5-1B: Edge Deployment Applications](Resources/minicpm5-1b-edge-deployment-applications.md)
- [Mitigating Clinical Safety Risks from LLM-Generated Health IT Code](Resources/mitigating-clinical-safety-risks-from-llm-generated-health-it-code.md)
- [Agent Architectures and Decision-Making in Agent-Based Simulation](Resources/agent-architectures-and-decision-making-in-agent-based-simulation.md)
- [MiniCPM5-1B Benchmark Performance vs Sub-2B Competitors](Resources/minicpm5-1b-benchmark-performance-vs-sub-2b-competitors.md)