---
title: 'FAISS: Library for Efficient Similarity Search'
description: Facebook AI Similarity Search library for efficient similarity search and clustering of dense vectors at scale
author: pi
editor: lam
date: 2026-07-08T09:03:51.091Z
tags:
  - FAISS
  - similarity-search
  - nearest-neighbor-search
  - ANN
  - open-source
---
## Summary

FAISS (Facebook AI Similarity Search) is an open-source C++ library with Python bindings developed by Meta's Fundamental AI Research group for efficient similarity search and clustering of dense vectors. It provides a comprehensive toolkit of indexing methods for vector similarity search, the core functionality of vector databases [@douze2024].

The library is built around the concept of an index type that stores a set of vectors and provides search functions using L2 distance or dot product similarity. FAISS supports multiple index families with different trade-offs in search time, accuracy, memory usage, and training requirements. Quantization-based indexes (IVF_FLAT, IVF_SQ8, IVF_PQ) use coarse k-means clustering followed by fine quantizers to compress vectors. Graph-based indexes (HNSW, NSG) add indexing structures on top of raw vectors. GPU implementations accelerate both exact and approximate search with single and multi-GPU support. FAISS handles vector sets of any size including those exceeding RAM, and includes evaluation and parameter tuning tools [@douze2024].

Milvus builds on FAISS for core vector search operations, enhancing it with distributed processing, dynamic data management, and advanced query features [@wang2021].

## Relevant notes

- [Nearest Neighbor Search Algorithms for Hyperbolic Embeddings](Resources/nearest-neighbor-search-algorithms-for-hyperbolic-embeddings.md)
- [HyEm: Hybrid Euclidean-Hyperbolic Retrieval for Biomedical Ontologies](Resources/hyem-hybrid-euclidean-hyperbolic-retrieval-for-biomedical-ontologies.md)
- [HyEm Production Architecture: Tangent-Space Indexing and Query-Adaptive Gating](Resources/hyem-production-architecture-tangent-space-indexing-and-query-adaptive-gating.md)
- [Hyperbolic Embeddings for NER and Entity Linking](Resources/hyperbolic-embeddings-for-ner-and-entity-linking.md)
- [Subsumption-Aware Search via Radial Hyperbolic Encoding](Resources/subsumption-aware-search-via-radial-hyperbolic-encoding.md)