---
title: Hyperbolic Embeddings for NER and Entity Linking
description: Hyperbolic embeddings enable hierarchy-aware entity linking via subsumption-aware nearest concept search, using HyEm for production deployment
author: pi
editor: lam
date: 2026-07-08T08:31:57.724Z
tags:
  - hyperbolic-embeddings
  - NER
  - entity-linking
  - SNOMED-CT
  - named-entity-recognition
  - hierarchical-retrieval
---
Hyperbolic embeddings are used in NER and entity linking through two complementary strategies. For entity linking, the standard pipeline embeds both mention text and ontology concepts into the Poincaré ball, then searches for the nearest concept via hyperbolic distance. The hyperbolic geometry provides a natural bias: concepts higher in the hierarchy (e.g., "disease") sit near the origin and serve as broad anchors, while specific concepts cluster near the boundary. This enables subsumption-aware linking — a mention of "heart attack" can be linked to "myocardial infarction" (its SNOMED CT equivalent) even without exact lexical match, because the hyperbolic space encodes synonymy through angular proximity and hierarchy through radial distance [@dilworth2025].

For practical retrieval in production, HyEm demonstrates that hyperbolic ontology embeddings can be integrated into standard Euclidean ANN infrastructure: origin log-mapping converts hyperbolic points to Euclidean vectors for fast candidate retrieval, then exact hyperbolic reranking refines results. A query-adaptive gate decides when to prioritize Euclidean semantic similarity vs. hyperbolic hierarchy distance, achieving 94-98% of pure Euclidean performance on entity queries while substantially improving hierarchy-aware retrieval on biomedical ontologies [@deng2026].

The core advantage for NER specifically is that hyperbolic space naturally handles nested and hierarchical entity types. When entity types themselves have taxonomic structure (e.g., "procedure" ⊃ "surgical procedure" ⊃ "cardiac surgery"), hyperbolic embeddings preserve these distances, enabling more precise boundary detection and type classification compared to flat Euclidean representations. The recentering NNS algorithms from Wu & Charikar provide the theoretical foundation for efficient search through concept embeddings during NER inference [@wu2020].

## Relevant notes

- [Executive Summary: SLMs for SNOMED CT Knowledge Graphs and Clinical NER](Resources/executive-summary-slms-for-snomed-ct-knowledge-graphs-and-clinical-ner.md)
- [HyEm: Hybrid Euclidean-Hyperbolic Retrieval for Biomedical Ontologies](Resources/hyem-hybrid-euclidean-hyperbolic-retrieval-for-biomedical-ontologies.md)
- [Hyperbolic Embeddings for SNOMED CT Hierarchical Retrieval](Resources/hyperbolic-embeddings-for-snomed-ct-hierarchical-retrieval.md)
- [Bi-GRU Achieves 90% F1 for SNOMED CT Concept Annotation](Resources/bi-gru-achieves-90-f1-for-snomed-ct-concept-annotation.md)
- [SNOMED CT Knowledge Graph Construction Pipeline](Resources/snomed-ct-knowledge-graph-construction-pipeline.md)