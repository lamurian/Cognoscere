---
title: LLMs for Zero-Shot and Few-Shot Text Classification
description: Using LLMs for text classification without task-specific training via prompt engineering and in-context learning.
author: pi
editor: lam
date: 2026-07-29T14:45:37.229Z
tags:
  - LLM
  - machine-learning
  - classification
  - zero-shot
  - few-shot
  - prompt-engineering
  - in-context-learning
---
## Summary

LLMs can perform text classification without any task-specific training data through zero-shot and few-shot prompting, where the model uses its pretrained knowledge to assign labels based on natural language instructions and optional examples.

Zero-shot classification asks the LLM to assign labels using only a task description and label definitions in the prompt. This approach has proven effective in domains like legal text annotation, biomedical classification, and content moderation. Studies show that even in zero-shot setups, LLMs consistently match or outperform fine-tuned models on biomedical NLP datasets with fewer than 1,000 training examples [@ghaffarzadehesfahani2024]. The key is providing contextualized label descriptions and clear task framing.

Few-shot in-context learning (ICL) improves performance by including a small number of labeled examples in the prompt. Agarwal et al. investigated many-shot ICL with hundreds to thousands of examples, enabled by expanded context windows, and found that performance continues to improve with more examples following a sub-linear regret pattern [@agarwal2024]. For classification, this means more exemplars consistently yield better accuracy, with diminishing returns.

Fine-tuning remains the strongest approach for classification when labeled data is available. A common workflow: start with zero-shot prompting for rapid baseline, add few-shot examples if quality is insufficient, and fine-tune a smaller model (e.g., BERT, DistilBERT) when production-grade accuracy is needed. Classical baselines like logistic regression on bag-of-words features should always be run first to determine if an LLM is even needed.

## Key Points

- Zero-shot: no training examples, relies on prompt design and label descriptions.
- Few-shot ICL: performance scales sub-linearly with number of exemplars.
- Fine-tuning small models on labeled data often outperforms prompting large models.
- LLMs excel in zero-shot settings where labeled data is scarce (<1000 examples).
- Always run simple baselines (logistic regression, Naive Bayes) first.

## Sources

- Agarwal et al. (2024) — Many-Shot In-Context Learning [@agarwal2024]
- Ghaffarzadeh-Esfahani et al. (2024) — LLMs vs Classical ML (comparison on zero-shot vs fine-tuned) [@ghaffarzadehesfahani2024]

## Relevant notes

- [LLMs for Tabular Classification and Regression](Resources/llms-for-tabular-classification-and-regression.md)
- [Vision-Language Models for Object Detection and Segmentation](Resources/vision-language-models-for-object-detection-and-segmentation.md)
- [LLMs for Anomaly Detection and Time Series Forecasting](Resources/llms-for-anomaly-detection-and-time-series-forecasting.md)
- [On-Premises Constraints Favor SLMs for Clinical NLP](Resources/on-premises-constraints-favor-slms-for-clinical-nlp.md)
- [Executive Summary: SLMs for SNOMED CT Knowledge Graphs and Clinical NER](Resources/executive-summary-slms-for-snomed-ct-knowledge-graphs-and-clinical-ner.md)