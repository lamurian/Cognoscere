---
title: Why the Hungarian Algorithm Is Optimal
description: "The primal-dual proof of Hungarian optimality: dual potentials, tight edges, augmenting paths, Kőnig's theorem, and equivalence to successive shortest paths."
author: pi
editor: lam
date: 2026-08-14T22:50:31.851Z
tags:
  - theory
  - fundamental
  - efficient-algorithms
  - matching
  - assignment-problem
---
## Summary

The Hungarian algorithm is not heuristic — it is a primal-dual algorithm whose optimality is provable. In the bipartite graph view, workers and jobs form the two vertex sets and each edge (i, j) has cost c(i, j). A potential y assigns real numbers to vertices such that y(i) + y(j) <= c(i, j) for every edge. The value of any perfect matching is at least the value of any potential (the sum of y over all vertices), because each matched edge costs at least the sum of its endpoint potentials [@wikipediacontributors2026b].

The algorithm maintains a matching and a potential simultaneously. An edge is "tight" when y(i) + y(j) = c(i, j). If a perfect matching exists using only tight edges, its cost equals the potential value, which lower-bounds every matching — so it is optimal [@wikipediacontributors2026b].

## Augmenting Paths

Each iteration either finds an augmenting path in the tight-edge subgraph (increasing matching size by 1, per Berge's lemma) or tightens at least one new edge by adjusting potentials. The potential update sets Delta = min{c(i,j) - y(i) - y(j) : i in Z∩S, j in T∖Z}, the smallest slack across the reachable-set cut, increases y on reachable workers, and decreases y on reachable jobs. This guarantees progress: either the matching grows or a new tight edge appears [@wikipediacontributors2026b].

## Kőnig's Theorem

The matrix-form covering step is justified by Kőnig's theorem: in a bipartite graph, the minimum number of lines (vertex cover) equals the maximum matching size. When the minimum number of lines covering all zeros equals n, a perfect zero-cost assignment exists — and by the potential argument it is optimal [@wikipediacontributors2026b]. The full matrix mechanics are covered in [[Resources/hungarian-algorithm-mechanics.md]].

## Equivalence to Min-Cost Flow

The Hungarian algorithm is equivalent to the successive shortest path algorithm for min-cost flow, using Johnson's reweighting technique. This perspective yields the O(n^3) variant: add jobs one at a time, running Dijkstra with potentials to find the shortest augmenting path to an unmatched worker [@wikipediacontributors2026b]. See [[Resources/hungarian-algorithm-for-string-list-matching.md]] for the practical string-matching application.

## Key Points

- Primal-dual structure: the matching (primal) and potentials (dual) are maintained together
- Any matching costs at least any potential's value; equality on tight edges proves optimality
- Berge's lemma: a matching is maximal iff no augmenting path exists
- The Delta update tightens at least one new edge or grows the matching, guaranteeing termination
- Kőnig's theorem links matrix covering to maximum matching: n lines cover all zeros iff an optimal assignment exists
- The algorithm is successive shortest paths for min-cost flow with Johnson potentials, giving O(n^3)

## Sources

- [@wikipediacontributors2026b] Wikipedia — Hungarian algorithm (potentials, tight edges, proof of progress, min-cost flow connection)

## Relevant notes

- [Hungarian Algorithm Mechanics](Resources/hungarian-algorithm-mechanics.md)
- [Hungarian Algorithm for String List Matching](Resources/hungarian-algorithm-for-string-list-matching.md)
- [HNSW: Hierarchical Navigable Small World Graphs](Resources/hnsw-hierarchical-navigable-small-world-graphs.md)
- [Nearest Neighbor Search Algorithms for Hyperbolic Embeddings](Resources/nearest-neighbor-search-algorithms-for-hyperbolic-embeddings.md)
- [Bayesian Computation: MCMC and Modern Tools](Resources/bayesian-computation-mcmc-and-modern-tools.md)