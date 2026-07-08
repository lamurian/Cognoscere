---
title: 'HyEm Production Architecture: Tangent-Space Indexing and Query-Adaptive Gating'
description: HyEm bridges hyperbolic embeddings with Euclidean ANN via tangent-space indexing, radius budget, and query-adaptive gating for production deployment.
author: pi
editor: lam
date: 2026-07-08T08:54:02.453Z
tags:
  - hyperbolic-embeddings
  - production
  - vector-database
  - ANN
  - FAISS
  - hybrid-search
  - indexability
---
Production vector databases (FAISS, Milvus) do not natively support hyperbolic distance. HyEm solves this via tangent-space indexing: hyperbolic entity embeddings x_v are mapped to tangent vectors u_v = log_0(x_v), stored in a standard Euclidean ANN index. At query time, the text query passes through a lightweight linear adapter into tangent space, candidates are retrieved via Euclidean ANN, then exact hyperbolic distance reranks the top-L results. A bi-Lipschitz bound guarantees distortion is bounded by κ(R) = sinh(R)/R, and the radius budget R is a first-class hyperparameter — it controls the capacity-indexability trade-off. For SNOMED CT depths (~20 levels), R ≈ 3.0 at d=32, firmly in the safe regime where κ(R) < 10 [@deng2026].

The query-adaptive soft mixing gate α(q) = σ(w^T e_q + b) interpolates between Euclidean semantic similarity and hyperbolic hierarchy distance at reranking: score(v|q) = α(q)·(-d_H) + (1-α(q))·cos(e_q, e_v). When α→0 the system behaves as a pure Euclidean retriever (safe for entity lookups); when α→1 it acts as a hierarchy-aware hyperbolic retriever. The gate is trained on automatically-labeled ontology template queries, requiring no manual annotation. This preserves 94-98% of pure Euclidean entity-centric performance while substantially improving hierarchy-navigation queries — a trade-off ratio often exceeding 100:1 [@deng2026].

## Relevant notes

- [HyEm: Hybrid Euclidean-Hyperbolic Retrieval for Biomedical Ontologies](Resources/hyem-hybrid-euclidean-hyperbolic-retrieval-for-biomedical-ontologies.md)
- [Hyperbolic Embeddings for NER and Entity Linking](Resources/hyperbolic-embeddings-for-ner-and-entity-linking.md)
- [Nearest Neighbor Search Algorithms for Hyperbolic Embeddings](Resources/nearest-neighbor-search-algorithms-for-hyperbolic-embeddings.md)
- [Hyperbolic Embeddings: Foundations and Poincaré Ball Mechanism](Resources/hyperbolic-embeddings-foundations-and-poincar-ball-mechanism.md)
- [Hyperbolic Embeddings for SNOMED CT Hierarchical Retrieval](Resources/hyperbolic-embeddings-for-snomed-ct-hierarchical-retrieval.md)