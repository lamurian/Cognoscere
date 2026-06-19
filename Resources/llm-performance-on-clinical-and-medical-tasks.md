---
title: LLM Performance on Clinical and Medical Tasks
description: 'Evidence review of LLM performance on medical tasks: licensing exams, clinical decision support, workflow automation, and identified gaps.'
author: pi
editor: lam
date: 2026-06-19T23:00:18.961Z
tags:
  - LLM
  - healthcare
  - clinical-psychology
  - evaluation
  - benchmarks
  - AI
---

A substantial body of evidence now exists on LLM performance across medical tasks, with results that are promising but uneven across domains.

**Licensing examinations and knowledge benchmarks.** GPT-4 achieves scores above the passing threshold on the USMLE across all three sections without specialised training [@kung2023]. Similar results have been demonstrated on neurology board examinations and the Japanese National Examination for Pharmacists. These results suggest LLMs encode broad medical knowledge, though exam performance does not guarantee clinical safety [@yu2024].

**Clinical decision support and diagnosis.** Systematic reviews show LLMs can match or exceed human diagnostic accuracy in specific domains: dermatology classification, radiology report interpretation, and triage recommendations. However, performance varies significantly by specialty and task complexity. LLMs with RAG augmentation outperform base models on domain-specific queries [@mansoor2025].

**Clinical workflow automation.** LLMs demonstrate strong performance on clinical text summarisation, reducing documentation burden. Studies report that LLM-generated clinical summaries are time-accurate in 70-90% of cases, but hallucination rates in summarisation tasks remain a safety concern. A framework for assessing clinical safety of LLM text summarisation has been proposed [@yu2024].

**Gaps and limitations.** While LLMs excel at knowledge recall and text generation, they struggle with tasks requiring causal reasoning, temporal reasoning, and handling of rare presentations. Their performance degrades on low-resource languages and underrepresented populations. Most published studies evaluate LLMs on curated datasets rather than real clinical workflows [@yu2024].

**Confidence assessment.** The evidence for LLM clinical performance is moderate overall. Many studies are preprints or small-scale evaluations. Large-scale randomised controlled trials of LLM-assisted vs. unassisted clinical decision-making are still scarce. The field would benefit from standardised evaluation frameworks and regulatory-grade validation protocols.