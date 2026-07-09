---
title: 'HNSW: Hierarchical Navigable Small World Graphs'
description: A graph-based approximate nearest neighbor search algorithm using hierarchical navigable small world graphs
author: pi
editor: lam
date: 2026-07-08T09:03:58.636Z
tags:
  - nearest-neighbor-search
  - ANN
  - similarity-search
  - efficient-algorithms
---
## Summary

HNSW (Hierarchical Navigable Small World) is a graph-based algorithm for approximate K-nearest neighbor search that achieves logarithmic time complexity. Developed by Malkov and Yashunin, it builds a multi-layer structure of navigable small world graphs where elements in higher layers are exponentially sparser, enabling search that starts at the top layer with long-range connections and refines downward [@malkov2016].

The algorithm incrementally builds a hierarchical structure of proximity graphs for nested subsets of stored elements. Each element is assigned a maximum layer selected randomly with an exponentially decaying probability distribution, analogous to skip lists. This produces graphs where links are separated by characteristic distance scales. Search begins at the coarsest layer where long jumps across the vector space are possible, then descends layer by layer to refine the search neighborhood. HNSW is fully graph-based, requires no additional search structures, and employs a heuristic for selecting proximity graph neighbors that significantly improves performance at high recall and on highly clustered data [@malkov2016].

HNSW is a de facto standard in vector search: integrated into FAISS as a core index, used by Milvus, and serving as a benchmark for new ANN algorithms [@douze2024; @wang2021].

## Relevant notes

- [FAISS: Library for Efficient Similarity Search](Resources/faiss-library-for-efficient-similarity-search.md)
- [Nearest Neighbor Search Algorithms for Hyperbolic Embeddings](Resources/nearest-neighbor-search-algorithms-for-hyperbolic-embeddings.md)
- [Hyperbolic Embeddings for NER and Entity Linking](Resources/hyperbolic-embeddings-for-ner-and-entity-linking.md)
- [HyEm: Hybrid Euclidean-Hyperbolic Retrieval for Biomedical Ontologies](Resources/hyem-hybrid-euclidean-hyperbolic-retrieval-for-biomedical-ontologies.md)
- [Subsumption-Aware Search via Radial Hyperbolic Encoding](Resources/subsumption-aware-search-via-radial-hyperbolic-encoding.md)