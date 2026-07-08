---
title: Hyperbolic Embeddings for SNOMED CT Hierarchical Retrieval
description: HiT/OnT use hyperbolic space with SLM base (MiniLM) for hierarchical concept retrieval outperforming SapBERT
author: pi
editor: lam
date: 2026-07-08T08:03:22.661Z
tags:
  - small-language-model
  - SNOMED-CT
  - ontology-embedding
  - hierarchical-retrieval
  - hyperbolic-space
---
Dilworth et al. proposed an ontology embedding framework for hierarchical concept retrieval from SNOMED CT with out-of-vocabulary (OOV) queries. Their approach uses the Hierarchy Transformer (HiT) and Ontology Transformer (OnT), both built on a Sentence-BERT encoder (the all-MiniLM-L12-v2 model, a compact 33M parameter model) re-trained to embed concepts in hyperbolic (Poincaré ball) space. This preserves hierarchical relationships through geometric properties: broader concepts near the origin, specific concepts near the boundary. A depth-biased scoring function enables subsumption inference between arbitrary textual queries and SNOMED CT concepts. On three evaluation datasets (Eval-100, OET-CPP, OET-Disease), HiT and OnT consistently outperformed SBERT, SapBERT, and lexical methods, with MRR improvements of up to 28 points in multi-hop settings (d=4). Only 15.1% of real-world SNOMED CT queries have exact lexical matches, highlighting the practical importance of hierarchical retrieval for OOV queries [@dilworth2025].

## Relevant notes

- [Hyperbolic Embeddings: Foundations and Poincaré Ball Mechanism](Resources/hyperbolic-embeddings-foundations-and-poincar-ball-mechanism.md)
- [Bi-GRU Achieves 90% F1 for SNOMED CT Concept Annotation](Resources/bi-gru-achieves-90-f1-for-snomed-ct-concept-annotation.md)
- [SNOMED CT Knowledge Graph Construction Pipeline](Resources/snomed-ct-knowledge-graph-construction-pipeline.md)
- [Agent Baseline Initialization via Sigmoid and Tanh Transforms](Resources/agent-baseline-initialization-via-sigmoid-and-tanh-transforms.md)
- [Architectural Patterns for LLM-Integrated Health Informatics](Resources/architectural-patterns-for-llm-integrated-health-informatics.md)
- [Hierarchical / Multilevel Models: Bayesian Approach](Resources/hierarchical-multilevel-models-bayesian-approach.md)