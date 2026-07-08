---
title: Subsumption-Aware Search via Radial Hyperbolic Encoding
description: Hyperbolic space encodes is-a hierarchy via radial coordinates, enabling subsumption inference through depth-biased scoring, hyperbolic reranking, and candidate pooling.
author: pi
editor: lam
date: 2026-07-08T08:54:02.454Z
tags:
  - hyperbolic-embeddings
  - subsumption
  - ontology-retrieval
  - SNOMED-CT
  - hierarchical-search
  - entity-linking
---
The Poincaré ball naturally encodes subsumption through radial coordinates: general concepts (e.g., "disease") sit near the origin with small norm; specific concepts (e.g., "type 2 diabetes mellitus") sit near the boundary with large norm. Parent-child relationships correspond to radial alignment — a parent always has smaller norm than its child. Synonymy corresponds to angular proximity. This means hyperbolic distance d_H(q,v) implicitly encodes whether v is a subsumer, descendant, or sibling of q without explicit ontology traversal [@nickel2017; @dilworth2025].

Three implementation strategies exist. First, depth-biased scoring (HiT/OnT) uses s(C ⊑ D) = -[d_κ(x_C, x_D) + λ(||x_D||_κ - ||x_C||_κ)] to explicitly penalize candidates deeper than the query, ensuring only true subsumers are retrieved. This achieves MRR improvements up to 28 points over SapBERT on SNOMED CT [@dilworth2025]. Second, HyEm reranks candidates by exact hyperbolic distance — ancestors sit closer to the origin and naturally rank higher. The soft mixing gate handles mixed-intent queries by blending Euclidean similarity [@deng2026]. Third, candidate pooling (Euclidean ANN + hyperbolic ANN candidates) is critical: on HPO-5k, pooling improved Q-H Parent Hits@10 from 0.048 (hyperbolic-only) to 0.234 (+388%) [@deng2026].

For SNOMED CT NER: a text mention is embedded into hyperbolic space via the adapter, tangent-space ANN retrieves top-L concept candidates, hyperbolic reranking computes exact d_H, and soft mixing blends with Euclidean similarity. The ranking places exact synonyms (angular) and subsumers (radial) higher automatically, without explicit ontology traversal [@deng2026].

## Relevant notes

- [Hyperbolic Embeddings for NER and Entity Linking](Resources/hyperbolic-embeddings-for-ner-and-entity-linking.md)
- [HyEm: Hybrid Euclidean-Hyperbolic Retrieval for Biomedical Ontologies](Resources/hyem-hybrid-euclidean-hyperbolic-retrieval-for-biomedical-ontologies.md)
- [Hyperbolic Embeddings for SNOMED CT Hierarchical Retrieval](Resources/hyperbolic-embeddings-for-snomed-ct-hierarchical-retrieval.md)
- [Executive Summary: SLMs for SNOMED CT Knowledge Graphs and Clinical NER](Resources/executive-summary-slms-for-snomed-ct-knowledge-graphs-and-clinical-ner.md)
- [HyEm Production Architecture: Tangent-Space Indexing and Query-Adaptive Gating](Resources/hyem-production-architecture-tangent-space-indexing-and-query-adaptive-gating.md)