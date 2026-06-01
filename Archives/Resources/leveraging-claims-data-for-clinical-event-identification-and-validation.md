---
author: Lam
date: 2024-11-18T14:03:30+01:00
title: Leveraging claims data for clinical event identification and validation
tags:
- ISPOR
- conference
- cohort
---

# Evaluate outcome validity

- Asses data for [fitness-for-purpose](Resources/fit-for-purpose-data-phenotyping-standards-and-processes.md) 
  - Examine the full dataset:
    - Time frame
    - Population
    - Coverage
    - Gender distribution
    - Region distribution
    - Claims type
  - Identify cohort inclusion/exclusion criteria
  - Estimate the cohort sample size
  - Observe treatment pattern within the study population
- Identify outcomes
  - Measure pre-specified outcomes of interest
  - Use machine-learning driven subgroups + LLMs to find unconsidered outcomes:
    - Cluster the cohort based on their characteristics
    - Use LLM to identify outcome patterns in the subgroups
  - Create data-driven outcome stratifications with machine learning
- Validate observed outcomes
  - Use claims histories
  - Rationale: FDA expects validation approaches for study variables
  - Steps:
    - Select several entries at random
    - Validate the outcome to claims histories

# Relevant notes

- [data-quality-derived-from-epidemiology-principles-to-enable-causal-inference](Resources/data-quality-derived-from-epidemiology-principles-to-enable-causal-inference.md) 
- [fit-for-purpose-data-phenotyping-standards-and-processes](Resources/fit-for-purpose-data-phenotyping-standards-and-processes.md) 
