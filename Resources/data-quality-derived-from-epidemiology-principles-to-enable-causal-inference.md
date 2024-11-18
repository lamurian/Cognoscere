---
author: Lam
date: 2024-11-18T13:47:19+01:00
title: Data quality derived from epidemiology principles to enable causal inference
tags:
- ISPOR
- conference
- cohort
---

# Motivation

- Data quality is the foundation of every research
- Every decision maker wants the best evidence possible

# Obstacle to causal inference

- Selection bias
- Information bias, due to misclassification of:
  - Outcome
  - Exposure
  - Confounder
- Confounding
- Error mechanism due to measurement characteristics:
  - Measurement characteristics: Sn, Sp, PPV, NPV
  - Data completeness
  - Mean square difference

# Validation pipeline for quantitative bias analysis

- [Get population of interest](Resources/fit-for-purpose-data-phenotyping-standards-and-processes.md), then do these steps in parallel:
  - Implement LLM zero-shot phenotyping
  - Claim profile review by expert
- NLP-supported EHR review by expert $\to$ Stratified batch sampling
- Automated performance reporting, keep in mind that:
  - Outcome with 100% specificity has unbiased estimates even if sensitivity is low
  - PPV is related to specificity, though also influenced by prevalence

# Relevant notes

- [leveraging-claims-data-for-clinical-event-identification-and-validation](Resources/leveraging-claims-data-for-clinical-event-identification-and-validation.md) 
- [fit-for-purpose-data-phenotyping-standards-and-processes](Resources/fit-for-purpose-data-phenotyping-standards-and-processes.md) 
