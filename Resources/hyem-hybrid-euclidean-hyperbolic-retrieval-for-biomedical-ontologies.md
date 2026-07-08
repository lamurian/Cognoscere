---
title: 'HyEm: Hybrid Euclidean-Hyperbolic Retrieval for Biomedical Ontologies'
description: HyEm bridges hyperbolic ontology embeddings with Euclidean ANN databases via origin log-mapping + query-adaptive reranking
author: pi
editor: lam
date: 2026-07-08T08:31:43.002Z
tags:
  - hyperbolic-embeddings
  - retrieval
  - biomedical-ontology
  - entity-linking
  - vector-database
  - hybrid-search
---
HyEm addresses a practical barrier: production vector databases (FAISS, Milvus) don't natively support hyperbolic distance, and hyperbolic embeddings can underperform on entity-centric queries where hierarchy is irrelevant. The solution is a lightweight retrieval layer that integrates hyperbolic ontology embeddings into existing Euclidean ANN infrastructure. HyEm learns radius-controlled hyperbolic embeddings, stores origin log-mapped vectors in standard Euclidean databases for candidate retrieval, then applies exact hyperbolic reranking. A query-adaptive gate outputs continuous mixing weights, combining Euclidean semantic similarity with hyperbolic hierarchy distance at reranking time. On biomedical ontology subsets (HPO, DO, MeSH), HyEm preserves 94-98% of Euclidean baseline performance on entity-centric queries while substantially improving hierarchy-navigation and mixed-intent queries, all while maintaining indexability at moderate oversampling [@deng2026]. This approach is directly applicable to SNOMED CT retrieval: use Euclidean ANN (FAISS) for fast candidate retrieval, then rerank by hyperbolic distance to incorporate hierarchical proximity.

## Relevant notes

- [Hyperbolic Embeddings for SNOMED CT Hierarchical Retrieval](Resources/hyperbolic-embeddings-for-snomed-ct-hierarchical-retrieval.md)
- [Executive Summary: SLMs for SNOMED CT Knowledge Graphs and Clinical NER](Resources/executive-summary-slms-for-snomed-ct-knowledge-graphs-and-clinical-ner.md)
- [Architectural Patterns for LLM-Integrated Health Informatics](Resources/architectural-patterns-for-llm-integrated-health-informatics.md)
- [Nearest Neighbor Search Algorithms for Hyperbolic Embeddings](Resources/nearest-neighbor-search-algorithms-for-hyperbolic-embeddings.md)
- [LLM Clinical Capabilities in Medicine and Health Informatics](Resources/llm-clinical-capabilities-in-medicine-and-health-informatics.md)