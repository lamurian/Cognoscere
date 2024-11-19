---
author: Lam
date: 2024-11-17T13:28:35+01:00
title: LLM in literature summarization and systematic literature review
tags:
- ISPOR
- conference
- workshop
- LLM
- literature-review
---

- Information extraction task:
  - Named entity recognition (NER): Recognize terminologies as entities
  - Relation extraction (RE): Extract modifiers/context of the entities
  - Concept normalization (CN): Link entities to a concept in an ontology
- Problem with machine learning and deep learning approach is we need to do a lot of annotation
- BioClinicalBert performs better than GPT without fine-tuning in performing NER tasks
- Fine-tuned LLAMA2 performs bettern than BioClinicalBert in performing NER tasks
- LLAMA2 also has better generalizability compared to BioClinicalBert
- BioClinicalBert is 15x faster compared to LLAMA2 in performing NER tasks
- In GPT:
  - One-shot prompt vastly improves the performance compared to zero-shot prompt
  - Multi-shot prompt slightly improves the performance compared to one-shot prompt, yet the cost is n-times higher
  - Conclusion: One-shot prompt is generally more recommended, unless we can reduce the cost in multi-shot prompt

# Relevant notes

- [rethink-biomedical-literature-review-using-LLM](Resources/rethink-biomedical-literature-review-using-LLM.md) 
- [LLM-for-systematic-literature-review](Resources/LLM-for-systematic-literature-review.md) 
- [HTA-perspective-of-LLM-in-HEOR](Resources/HTA-perspective-of-LLM-in-HEOR.md) 
- [navigating-LLM-for-HEOR](Resources/navigating-LLM-for-HEOR.md) 
