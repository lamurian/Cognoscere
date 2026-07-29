---
title: Vision-Language Models for Object Detection and Segmentation
description: Using vision-language models (VLMs) and LLMs for object detection, segmentation, and open-vocabulary visual recognition.
author: pi
editor: lam
date: 2026-07-29T14:45:37.230Z
tags:
  - LLM
  - machine-learning
  - object-detection
  - computer-vision
  - vision-language-model
  - segmentation
  - open-vocabulary
---
## Summary

Vision-language models (VLMs) extend LLMs to the visual domain, enabling object detection and segmentation beyond the closed-set assumption of traditional detectors. These models can recognize objects described in natural language without being trained on specific categories.

Wang et al. introduced VisionLLM, an LLM-based framework that treats images as a foreign language and aligns vision-centric tasks with language tasks using language instructions. VisionLLM achieved over 60% mAP on COCO object detection using a generalist framework, on par with detection-specific models [@wang2023]. This demonstrated that LLMs can serve as open-ended decoders for vision tasks, supporting both fine-grained object-level and coarse-grained task-level customization through language instructions.

Feng et al. conducted a comprehensive review of VLM-based detection and segmentation across eight detection scenarios (closed-set, domain adaptation, crowded objects) and eight segmentation scenarios (few-shot, open-world, small object). Their evaluation examined three fine-tuning granularities: zero prediction, visual fine-tuning, and text prompt, revealing how different architectures perform across different task characteristics [@feng2025].

Open-vocabulary object detectors (OVDs) like Grounding DINO use vision-language alignment to detect objects from arbitrary text prompts. These models combine a text encoder (typically from CLIP or BERT) with a visual backbone. The key innovation is learning a joint embedding space where visual features and textual descriptions can be compared directly, allowing detection of categories never seen during training.

## Key Points

- VLMs enable open-vocabulary detection: recognize objects from natural language descriptions.
- VisionLLM achieves 60%+ mAP on COCO as a generalist model [@wang2023].
- Three approaches: zero-shot prompting, visual fine-tuning, text prompt tuning.
- Performance varies across scenarios: strong on open-vocabulary, variable on crowded/small objects.
- Grounding DINO and GLIP are popular OVD frameworks combining text encoders with visual backbones.

## Sources

- Wang et al. (2023) — VisionLLM: Large Language Model is also an Open-Ended Decoder [@wang2023]
- Feng et al. (2025) — VLM for Object Detection and Segmentation: A Review and Evaluation [@feng2025]

## Relevant notes

- [LLMs for Anomaly Detection and Time Series Forecasting](Resources/llms-for-anomaly-detection-and-time-series-forecasting.md)
- [Milvus: Cloud-Native Vector Database](Resources/milvus-cloud-native-vector-database.md)
- [LLM Clinical Capabilities in Medicine and Health Informatics](Resources/llm-clinical-capabilities-in-medicine-and-health-informatics.md)
- [Developmental Milestones at 5.5 Years](Resources/developmental-milestones-at-5-5-years.md)
- [Agent Architectures and Decision-Making in Agent-Based Simulation](Resources/agent-architectures-and-decision-making-in-agent-based-simulation.md)