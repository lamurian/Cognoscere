---
title: SLMs Achieve Comparable Clinical NER at Lower Cost
description: TransformerCRF matches fine-tuned BERT for clinical NER with 40% fewer parameters per Belkadi et al.
author: pi
editor: lam
date: 2026-07-08T08:03:07.032Z
tags:
  - small-language-model
  - clinical-NLP
  - NER
  - efficiency
---
Belkadi et al. compared a TransformerCRF trained from scratch against fine-tuned BERT, BioBERT, and ClinicalBERT on the n2c2-2018 clinical NER task. The TransformerCRF had 39.80% fewer trainable parameters than BERT-CRF, yet achieved macro F1 of 0.787 vs 0.837 for the best PLM-CRF. Weighted F1 showed only a 0.75 point gap (96.84% vs 97.59%). Efficient training via down-sampling reduced data volume by 66% with only 0.02 points F1 drop, proving lightweight models can deliver competitive clinical NER at much lower computational cost [@belkadi2022].

## Relevant notes

- [Efficiency Advantages of Sub-3B Language Models](Resources/efficiency-advantages-of-sub-3b-language-models.md)
- [SLM-Bench: Systematic SLM Evaluation Framework](Resources/slm-bench-systematic-slm-evaluation-framework.md)
- [Executive Summary: MiniCPM5-1B Performance and SLM State of the Art](Resources/executive-summary-minicpm5-1b-performance-and-slm-state-of-the-art.md)
- [LLM Clinical Capabilities in Medicine and Health Informatics](Resources/llm-clinical-capabilities-in-medicine-and-health-informatics.md)
- [Hydropower Generation](Resources/hydropower-generation.md)