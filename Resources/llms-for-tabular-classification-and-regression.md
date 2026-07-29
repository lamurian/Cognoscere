---
title: LLMs for Tabular Classification and Regression
description: 'Techniques for using LLMs for classification and regression on tabular/structured data: prompting, fine-tuning, embedding extraction.'
author: pi
editor: lam
date: 2026-07-29T14:45:37.227Z
tags:
  - LLM
  - machine-learning
  - regression
  - classification
  - tabular-data
  - fine-tuning
  - prompt-engineering
---
## Summary

Large language models (LLMs) can be applied to traditional ML tasks like classification and regression on tabular data through three main approaches: prompt-based inference, fine-tuning for numerical/textual output, and embedding extraction combined with classical ML models [@tang2024].

Prompt-based regression treats the numeric prediction as a language generation problem. Tasks are framed as "predict the next value" using few-shot examples in the prompt. Work by Requeima et al. introduces LLM Processes, which elicit coherent numerical predictive distributions from LLMs through careful prompting, achieving competitive results in forecasting and multi-dimensional regression [@requeima2024]. Lukasik et al. show that regression-aware inference methods outperform standard sampling for scoring tasks by accounting for the model's output distribution [@lukasik2024].

For fine-tuning, Gardner et al. present TabuLa-8B, a Llama 3-8B model fine-tuned for tabular data prediction using a novel packing and attention scheme. Their model achieves zero-shot accuracy over 15 percentage points higher than random guessing on unseen tables, outperforming XGBoost and TabPFN in few-shot settings [@gardner2024]. Ghaffarzadeh-Esfahani et al. compared LLMs vs. classical ML for COVID-19 mortality prediction and found that while XGBoost and random forest achieved F1 scores of 0.87, fine-tuning Mistral-7b with QLoRA improved its recall from 1% to 79% with an F1 of 0.74, substantially bridging the gap [@ghaffarzadehesfahani2024].

Embedding extraction from LLMs offers a third path: convert tabular or text data into dense vector representations, then feed these to traditional regressors (XGBoost, SVR, linear regression). Tang et al. demonstrate that LLM embeddings preserve Lipschitz continuity over the feature space, which partially explains their strong performance on high-dimensional regression tasks, and surprisingly find that larger model size does not always improve regression accuracy [@tang2024].

## Key Points

- Three main approaches: prompt-based, fine-tuning, and embedding extraction.
- Prompt-based works well for zero/few-shot settings but requires careful prompt design.
- Fine-tuning significantly closes the gap with classical ML for tabular tasks.
- LLM embeddings + classical regressors provide a flexible, interpretable pipeline.
- Temperature should be set to 0 and post-processing applied for numeric outputs.
- Classical ML (XGBoost, RF) still outperforms LLMs on high-dimensional tabular data.

## Sources

- Gardner et al. (2024) — TabuLa-8B: Large Scale Transfer Learning for Tabular Data via Language Modeling [@gardner2024]
- Ghaffarzadeh-Esfahani et al. (2024) — LLMs vs Classical ML for COVID-19 Mortality Prediction [@ghaffarzadehesfahani2024]
- Tang et al. (2024) — Understanding LLM Embeddings for Regression [@tang2024]
- Requeima et al. (2024) — LLM Processes: Numerical Predictive Distributions Conditioned on Natural Language [@requeima2024]
- Lukasik et al. (2024) — Regression Aware Inference with LLMs [@lukasik2024]

## Relevant notes

- [LLMs for Zero-Shot and Few-Shot Text Classification](Resources/llms-for-zero-shot-and-few-shot-text-classification.md)
- [LLMs for Anomaly Detection and Time Series Forecasting](Resources/llms-for-anomaly-detection-and-time-series-forecasting.md)
- [LLM Embeddings for Clustering and Semantic Grouping](Resources/llm-embeddings-for-clustering-and-semantic-grouping.md)
- [Vision-Language Models for Object Detection and Segmentation](Resources/vision-language-models-for-object-detection-and-segmentation.md)
- [Mitigating Clinical Safety Risks from LLM-Generated Health IT Code](Resources/mitigating-clinical-safety-risks-from-llm-generated-health-it-code.md)