---
title: LLMs for Anomaly Detection and Time Series Forecasting
description: Using LLMs for anomaly detection in tabular/text data and time series forecasting tasks.
author: pi
editor: lam
date: 2026-07-29T14:45:37.230Z
tags:
  - LLM
  - machine-learning
  - anomaly-detection
  - forecasting
  - time-series
  - unsupervised-learning
  - tabular-data
---
## Summary

LLMs are increasingly applied to anomaly detection and forecasting tasks, leveraging their pretrained knowledge of patterns across domains.

Su et al. conducted a systematic literature review of LLMs for forecasting and anomaly detection, covering diverse approaches including prompt-based forecasting, fine-tuned time series models, and LLM-based feature extraction for anomaly scoring. The review highlights that LLMs can capture complex temporal dependencies and handle multi-modal data (text + numeric) in forecasting tasks [@su2024].

For tabular anomaly detection, Li et al. showed that pre-trained LLMs are zero-shot batch-level anomaly detectors. By serializing tabular rows into text and using the LLM's understanding of typical patterns, their approach detects outliers without any task-specific training. The LLM assigns higher likelihood to in-distribution rows and lower likelihood to anomalies [@li2024].

LLMs can also be used for time series forecasting through: (1) serializing time series values into text and prompting the LLM to predict the next value, (2) fine-tuning on domain-specific data with numerical outputs, and (3) using LLM embeddings as features for traditional forecasting models (ARIMA, Prophet, gradient boosting). The LLM Processes framework by Requeima et al. specifically addresses probabilistic forecasting, generating calibrated predictive distributions conditioned on natural language descriptions of the problem [@requeima2024].

## Key Points

- LLMs show zero-shot promise for batch-level anomaly detection in tabular data.
- Three approaches for time series: prompt-based, fine-tuned, and embedding-based.
- LLM Processes generate probabilistic forecasts guided by natural language priors.
- Pretrained LLMs capture domain-agnostic pattern knowledge useful for anomaly scoring.
- Combining LLM features with traditional forecasting models often outperforms either alone.

## Sources

- Su et al. (2024) — LLMs for Forecasting and Anomaly Detection: A Systematic Literature Review [@su2024]
- Li et al. (2024) — Anomaly Detection of Tabular Data Using LLMs [@li2024]
- Requeima et al. (2024) — LLM Processes: Numerical Predictive Distributions [@requeima2024]

## Relevant notes

- [Time Series Analysis: Frequentist vs Bayesian Comparison](Resources/time-series-analysis-frequentist-vs-bayesian-comparison.md)
- [LLMs for Tabular Classification and Regression](Resources/llms-for-tabular-classification-and-regression.md)
- [Time Series Analysis: Frequentist Approach](Resources/time-series-analysis-frequentist-approach.md)
- [Time Series Analysis: Bayesian Approach](Resources/time-series-analysis-bayesian-approach.md)
- [Roadmap: Learning Statistics from Scratch — Frequentist and Bayesian Perspectives](Projects/roadmap-learning-statistics-from-scratch-frequentist-and-bayesian-perspectives.md)