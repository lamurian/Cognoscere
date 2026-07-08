---
title: Nearest Neighbor Search Algorithms for Hyperbolic Embeddings
description: Three provably efficient algorithms for kNN in hyperbolic space using Euclidean NNS oracles via ball recentering and shell partitioning
author: pi
editor: lam
date: 2026-07-08T08:31:43.002Z
tags:
  - hyperbolic-embeddings
  - nearest-neighbor-search
  - similarity-search
  - poincare-ball
  - efficient-algorithms
---
Wu and Charikar developed the first theoretically-grounded algorithms for nearest neighbor search in hyperbolic embeddings. Their key insight is that hyperbolic balls in the Poincaré ball model are equivalent to Euclidean balls with different centers — meaning standard Euclidean NNS algorithms can be leveraged as black-box oracles for hyperbolic search [@wu2020].

**Three algorithms are proposed.** (1) Recentering-HyperbolicNN exploits the ball equivalence property: it iteratively finds the Euclidean center of the hyperbolic ball around query q, calls a Euclidean NNS oracle, and recenters until no closer point is found. If the Euclidean nearest neighbor is the k-th hyperbolic nearest neighbor, it terminates in at most k+1 oracle calls. On a 10-dim WordNet embedding with 82K points, it averaged only 2.3 oracle calls per query. (2) Binary-Search-HyperbolicNN performs binary search on the hyperbolic radius r, using the Euclidean oracle to test whether a ball of radius r is non-empty. It achieves provable c-approximation guarantees. (3) Spherical-Shell-HyperbolicNN partitions data by Euclidean norm (annuli), runs approximate NNS within each shell, and returns the best result. It works with approximate Euclidean oracles (e.g., LSH) and provides √w(1+ε)-approximation where w controls shell width. On 100-dim embeddings with 63K points, it achieved 90% recall at 1000 samples, significantly outperforming graph-based Vamana [@wu2020].

## Relevant notes

- [Hyperbolic Embeddings: Foundations and Poincaré Ball Mechanism](Resources/hyperbolic-embeddings-foundations-and-poincar-ball-mechanism.md)
- [Hyperbolic Embeddings for SNOMED CT Hierarchical Retrieval](Resources/hyperbolic-embeddings-for-snomed-ct-hierarchical-retrieval.md)
- [Executive Summary: SLMs for SNOMED CT Knowledge Graphs and Clinical NER](Resources/executive-summary-slms-for-snomed-ct-knowledge-graphs-and-clinical-ner.md)
- [Watts-Strogatz Small-World Network Parameters for Social Simulation](Resources/watts-strogatz-small-world-network-parameters-for-social-simulation.md)
- [Skills Architecture: Single-Responsibility Restructure](Projects/skills-architecture-single-responsibility-restructure.md)