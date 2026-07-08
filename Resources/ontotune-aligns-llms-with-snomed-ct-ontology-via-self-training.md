---
title: OntoTune Aligns LLMs with SNOMED CT Ontology via Self-Training
description: OntoTune uses SNOMED CT ontology to align LLMs through inconsistency detection and self-training, outperforming TaxoLLaMA
author: pi
editor: lam
date: 2026-07-08T08:03:38.199Z
tags:
  - SNOMED-CT
  - ontology-alignment
  - self-training
  - LLM
  - medical-QA
---
Liu et al. proposed OntoTune, an ontology-driven self-training framework that aligns LLMs with SNOMED CT domain knowledge through in-context learning. The approach uses three ontology-aware instruction templates (diverse, conceptual, professional) to generate responses with and without ontology context. Responses showing significant inconsistency are selected as the training set. Using LLaMA-3-8B-Instruct as seed model with LoRA fine-tuning on 100K inconsistent samples per corpus type, OntoTune achieved state-of-the-art on SemEval-2018 Task 9 hypernym discovery (medical subset: 65.53 MRR vs 58.65 for TaxoLLaMA*) and medical QA (average 62.5 vs 60.2 baseline). Critically, OntoTune preserved general knowledge and safety alignment far better than direct ontology injection (TaxoLLaMA*) or large-scale corpus training — only 0.49% average decline on MMLU vs 3.20% for TaxoLLaMA*, and 92.69% vs 73.27% jailbreak safety. This demonstrates that small-scale, high-quality ontology data can reorganize LLM domain knowledge more effectively than large-scale raw corpora [@liu2025a].

## Relevant notes

- [Hyperbolic Embeddings for SNOMED CT Hierarchical Retrieval](Resources/hyperbolic-embeddings-for-snomed-ct-hierarchical-retrieval.md)
- [SNOMED CT Knowledge Graph Construction Pipeline](Resources/snomed-ct-knowledge-graph-construction-pipeline.md)
- [Bi-GRU Achieves 90% F1 for SNOMED CT Concept Annotation](Resources/bi-gru-achieves-90-f1-for-snomed-ct-concept-annotation.md)
- [Mitigating Clinical Safety Risks from LLM-Generated Health IT Code](Resources/mitigating-clinical-safety-risks-from-llm-generated-health-it-code.md)
- [MiniCPM5-1B Training: UltraData and RL+OPD Pipeline](Resources/minicpm5-1b-training-ultradata-and-rl-opd-pipeline.md)