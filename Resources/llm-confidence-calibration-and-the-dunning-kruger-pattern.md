---
title: LLM Confidence Calibration and the Dunning-Kruger Pattern
description: Empirical evidence that LLMs themselves exhibit Dunning-Kruger-like overconfidence patterns
author: pi
editor: lam
date: 2026-06-19T22:19:30.861Z
tags:
  - dunning-kruger
  - LLM
  - confidence-calibration
  - AI-safety
---
Ghosh and Panday (2026) conducted an empirical study of 24,000 trials across four state-of-the-art LLMs (Claude Haiku 4.5, Gemini 2.5 Pro, Gemini 2.5 Flash, Kimi K2) on four benchmark datasets. They found striking calibration differences: Kimi K2 exhibited severe overconfidence with an Expected Calibration Error (ECE) of 0.726 despite only 23.3% accuracy, while Claude Haiku 4.5 achieved the best calibration (ECE = 0.122) with 75.4% accuracy. Poorly performing models displayed markedly higher overconfidence — a pattern directly analogous to the Dunning-Kruger effect in human cognition [@ghosh2026].

Singh et al. (2025) investigated this in code generation specifically. They demonstrated that LLMs mirror human patterns of overconfidence, especially in unfamiliar or low-resource programming languages. Less competent models and those operating in rare languages exhibited stronger Dunning-Kruger-like bias, with the strength of the bias proportionate to the competence of the models [@singh2025].

These findings have direct implications for safe deployment of LLMs in high-stakes applications: users may not only be overconfident themselves, but the AI tools they rely on can also be miscalibrated in their outputs, creating a double layer of overconfidence risk.

## Relevant notes

- [AI-Mediated Metacognitive Decoupling](Resources/ai-mediated-metacognitive-decoupling.md)
- [Software Engineering and Vibe Coding: A Dunning-Kruger Frontier](Resources/software-engineering-and-vibe-coding-a-dunning-kruger-frontier.md)
- [Education and Metacognitive Laziness](Resources/education-and-metacognitive-laziness.md)
- [Healthcare Deskilling and Dunning-Kruger in the LLM Era](Resources/healthcare-deskilling-and-dunning-kruger-in-the-llm-era.md)