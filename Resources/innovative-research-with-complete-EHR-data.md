---
author: Lam
date: 2024-11-18T15:19:26+01:00
title: Innovative research with complete EHR data
source:
- https://arxiv.org/pdf/2301.09767
tags:
- ISPOR
- conference
- RWD
- EHR
---

- Main challenge: Structure and normalize all data
  - Semi-structured data
    - Diagnosis
    - Procedure
    - Medication
    - Labs
    - Immunizations
    - Implanted/Explanted devices
    - Pharmacy
  - Unstructured data:
    - Clinical notes
    - Images
- Pipeline for standardizing and normalizing the data:
  - Obtain the medical records
  - Run a language model^[https://www.truveta.com/truveta-data/truveta-language-model/]:
    - Create a concept code
    - Generate the confidence score
  - Results with high confidence $\to$ Appended to the medical records
  - Results with low confidence $\to$ Evaluated by health informaticians $\to$ Appended to the medical records
  - Finally: Reuse as an input for the language model
