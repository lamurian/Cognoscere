---
title: MiniCPM5-1B Benchmark Performance vs Sub-2B Competitors
description: 'MiniCPM5-1B achieves SOTA among sub-2B models: AA Index 17.9, leaderboard avg 42.57'
author: pi
editor: lam
date: 2026-07-07T23:27:16.728Z
tags:
  - llm
  - benchmarks
  - performance
  - small-language-model
---
MiniCPM5-1B achieves state-of-the-art performance among sub-2B open-source language models. On the Artificial Analysis Intelligence Index it scores 17.9, the highest for any open model under 2B parameters -- 7.4 points ahead of Qwen3.5-0.8B (10.5) and 1.6 points ahead of Qwen3.5-2B (16.3) at half the parameter count [@artificialanalysis2026]. On the OpenBMB public leaderboard it averages 42.57 across 7 benchmark categories (reasoning, knowledge, code, instruction-following, math, logic, agentic), surpassing 35.61 among strong sub-2B models [@minicpm2026].

**Coding advantage.** On LCB-v6@avg3 (coding benchmark), MiniCPM5-1B scores 33.52 versus Qwen3.5-0.8B's 5.33 -- a 6.3x advantage with only 25% more parameters. Its advantage is most visible in agentic tool use, code generation, and competition math [@minicpm2026]. The model supports 128K token context with 1.08B dense parameters and is released under Apache 2.0.

**Honest calibration.** MiniCPM5-1B scores AA-Omniscience -1 (best in its size class) by abstaining from questions it cannot answer confidently, avoiding the hallucination penalties that pull sub-2B peers down to -70 to -89 (Qwen3.5-0.8B: -89, MiniCPM-V 4.6: -85) [@artificialanalysis2026].

## Relevant notes

- [LLM Performance on Clinical and Medical Tasks](Resources/llm-performance-on-clinical-and-medical-tasks.md)
- [Efficiency Advantages of Sub-3B Language Models](Resources/efficiency-advantages-of-sub-3b-language-models.md)
- [MiniCPM5-1B Training: UltraData and RL+OPD Pipeline](Resources/minicpm5-1b-training-ultradata-and-rl-opd-pipeline.md)
- [LLM Clinical Capabilities in Medicine and Health Informatics](Resources/llm-clinical-capabilities-in-medicine-and-health-informatics.md)
- [Evaluating Guardrail Effectiveness: Benchmarks and Metrics](Resources/evaluating-guardrail-effectiveness-benchmarks-and-metrics.md)