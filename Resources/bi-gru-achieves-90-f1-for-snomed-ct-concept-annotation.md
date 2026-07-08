---
title: Bi-GRU Achieves 90% F1 for SNOMED CT Concept Annotation
description: Lightweight Bi-GRU with SciBERT embeddings achieves 90% F1 for SNOMED CT concept annotation on MIMIC-IV
author: pi
editor: lam
date: 2026-07-08T08:03:22.661Z
tags:
  - small-language-model
  - SNOMED-CT
  - NER
  - clinical-NLP
  - bi-gru
---
Noori et al. introduced a neural sequence labeling approach using Bidirectional GRU (Bi-GRU) for automated SNOMED CT concept recognition from clinical text. Using 204 discharge summaries from MIMIC-IV segmented into overlapping 19-token chunks with contextual, syntactic, and morphological features, the model assigned IOB tags to identify concept spans. It achieved 93% precision, 89% recall, and 90% F1-score on the validation set. The lightweight RNN architecture delivered high-quality annotation at significantly lower computational cost than transformer-based models, with effective handling of ambiguous terms and misspellings. The approach demonstrates that recurrent architectures remain competitive for biomedical concept recognition while being more suitable for resource-constrained deployment [@noori2025].

## Relevant notes

- [SLMs Achieve Comparable Clinical NER at Lower Cost](Resources/slms-achieve-comparable-clinical-ner-at-lower-cost.md)
- [Efficiency Advantages of Sub-3B Language Models](Resources/efficiency-advantages-of-sub-3b-language-models.md)
- [Frameworks and Tools for LLM Guardrails](Resources/frameworks-and-tools-for-llm-guardrails.md)
- [SLM-Bench: Systematic SLM Evaluation Framework](Resources/slm-bench-systematic-slm-evaluation-framework.md)
- [LLM Performance on Clinical and Medical Tasks](Resources/llm-performance-on-clinical-and-medical-tasks.md)