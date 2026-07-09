---
title: 'Milvus: Cloud-Native Vector Database'
description: Open-source cloud-native vector database for scalable vector ANN search powering AI applications
author: pi
editor: lam
date: 2026-07-08T09:04:04.994Z
tags:
  - vector-database
  - ANN
  - similarity-search
  - FAISS
  - open-source
  - distributed
---
## Summary

Milvus is a high-performance, cloud-native vector database designed for managing and searching large-scale vector embeddings at billions of vectors. Created by Zilliz and incubated under the LF AI & Data Foundation (Apache 2.0), Milvus separates storage and compute in a fully distributed architecture that scales horizontally on Kubernetes [@wang2021].

Milvus adopts a four-layer architecture: access layer (stateless proxies for connection handling), coordinator layer (metadata and scheduling), worker layer (query, data, and index nodes that scale independently), and storage layer (object storage, log brokers, metadata stores). Data is organized into 512MB segments, each with its own index, enabling parallel search and efficient mutation via an LSM-tree structure with snapshot isolation. Built on FAISS for core vector operations, Milvus supports heterogeneous computing (CPU SIMD/AVX512, GPU/CUDA with multi-GPU), multiple index types (HNSW, IVF, FLAT, DiskANN, SCANN, binary), metadata pre-filtering, hybrid dense-sparse search with BM25, tunable consistency levels, and multi-tenancy. It integrates with LangChain, LlamaIndex, and OpenAI, and offers SDKs in Python, Java, Go, C++ and RESTful APIs with three deployment modes: Lite, Standalone, and Distributed (K8s) [@wang2021].

## Relevant notes

- [FAISS: Library for Efficient Similarity Search](Resources/faiss-library-for-efficient-similarity-search.md)
- [HyEm: Hybrid Euclidean-Hyperbolic Retrieval for Biomedical Ontologies](Resources/hyem-hybrid-euclidean-hyperbolic-retrieval-for-biomedical-ontologies.md)
- [HyEm Production Architecture: Tangent-Space Indexing and Query-Adaptive Gating](Resources/hyem-production-architecture-tangent-space-indexing-and-query-adaptive-gating.md)
- [HNSW: Hierarchical Navigable Small World Graphs](Resources/hnsw-hierarchical-navigable-small-world-graphs.md)
- [Hyperbolic Embeddings for NER and Entity Linking](Resources/hyperbolic-embeddings-for-ner-and-entity-linking.md)