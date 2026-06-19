---
title: LLM Clinical Capabilities in Medicine and Health Informatics
description: Overview of LLM capabilities relevant to clinical and biomedical informatics tasks including knowledge reasoning, information extraction, multilingual processing, and patient interaction.
author: pi
editor: lam
date: 2026-06-19T23:00:18.960Z
tags:
  - LLM
  - healthcare
  - medical-informatics
  - digital-health
  - clinical-psychology
  - AI
---

Large language models have demonstrated remarkable capabilities across a wide range of clinical and biomedical tasks, as documented in systematic reviews covering over 1,600 papers [@yu2024]. These capabilities can be grouped into four main categories.

**Clinical knowledge and reasoning.** LLMs such as GPT-4 have achieved passing scores on the United States Medical Licensing Exam (USMLE) without specialised training [@kung2023]. They encode substantial clinical knowledge, matching expert-level performance on medical question-answering benchmarks [@singhal2023]. More advanced reasoning techniques including chain-of-thought prompting and self-consistency further improve diagnostic accuracy [@mansoor2025].

**Information extraction and document analysis.** LLMs excel at extracting structured information from unstructured clinical notes, radiology reports, and electronic health records. They perform named entity recognition for medications, diagnoses, and procedures, relation extraction, and text classification with high accuracy. Models fine-tuned on biomedical corpora (BioBERT, ClinicalBERT, BlueBERT) achieve state-of-the-art performance on these tasks [@yu2024; @karabacak2023].

**Multilingual and multimodal capabilities.** LLMs now process clinical text in multiple languages and integrate imaging, audio, and genomic data. Multimodal models combine vision transformers with language models for medical report generation and image captioning, showing promise for radiology, pathology, and dermatology [@yu2024].

**Patient interaction and education.** LLM-powered chatbots provide personalised health information, assist with triage, and support mental health interventions. Studies show AI-generated health messages are comparable to human-written ones in sentiment, reading ease, and semantic content, though accuracy and completeness remain concerns [@yu2024; @karabacak2023].