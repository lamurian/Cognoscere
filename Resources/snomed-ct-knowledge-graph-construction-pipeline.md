---
title: SNOMED CT Knowledge Graph Construction Pipeline
description: Liu et al. built SNOMED CT KG in Neo4j with 58 core concept types for structured clinical data and diagnostic reasoning
author: pi
editor: lam
date: 2026-07-08T08:03:22.662Z
tags:
  - SNOMED-CT
  - knowledge-graph
  - Neo4j
  - clinical-NLP
  - healthcare-IT
---
Liu et al. presented a knowledge-driven framework integrating SNOMED CT with Neo4j to construct a structured medical knowledge graph. Clinical entities (diseases, symptoms, medications) are represented as nodes; semantic relationships (caused by, treats, belongs to) as edges mapped from formal SNOMED CT relationship concepts. The pipeline processes SNOMED CT RF2 data via Snowstorm API, with concurrent parsing and batch committing to Neo4j. After preprocessing 58 core diagnostic concept types from over 300,000 entries, the graph contains 58 concept node types and 1,194 distinct relationship types. The knowledge graph supports multi-hop reasoning — inferring chains like Streptococcal infection → Pharyngitis → Elevated C-reactive protein → Penicillin. These pathways are embedded into JSON-formatted instruction-tuning datasets to fine-tune LLMs (e.g., DeepSeek-R1, Ollama-70B), improving clinical logic consistency in AI-generated diagnoses. Expert evaluation showed the knowledge-enhanced ESFT model achieved the highest completeness and accuracy scores (4.8/5) [@liu2025].

## Relevant notes

- [Bi-GRU Achieves 90% F1 for SNOMED CT Concept Annotation](Resources/bi-gru-achieves-90-f1-for-snomed-ct-concept-annotation.md)
- [Issues, Opportunities, and Best Practices for LLMs in Healthcare and Medical Informatics](Resources/issues-opportunities-and-best-practices-for-llms-in-healthcare-and-medical-informatics.md)
- [Context Engineering for pi Agents](Resources/context-engineering-for-pi-agents.md)
- [Causal Inference: Bayesian Approach](Resources/causal-inference-bayesian-approach.md)
- [LLM Clinical Capabilities in Medicine and Health Informatics](Resources/llm-clinical-capabilities-in-medicine-and-health-informatics.md)