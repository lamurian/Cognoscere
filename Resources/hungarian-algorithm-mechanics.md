---
title: Hungarian Algorithm Mechanics
description: 'How the Hungarian (Kuhn-Munkres) algorithm solves the assignment problem: cost matrix, row/column reduction, zero covering, augmenting paths, O(n^3) complexity.'
author: pi
editor: lam
date: 2026-08-14T22:50:31.844Z
tags:
  - efficient-algorithms
  - optimization
  - reference
  - fundamental
  - matching
  - assignment-problem
---
## Summary

The Hungarian algorithm (also called the Hungarian method or Kuhn-Munkres algorithm) solves the assignment problem: given n workers, n jobs, and an n x n cost matrix C where C[i][j] is the cost of assigning job j to worker i, find a one-to-one assignment minimizing total cost. Formally, it minimizes Tr(PC) over permutation matrices P [@wikipediacontributors2026b]. Harold Kuhn published it in 1955, naming it after Hungarian mathematicians Kőnig and Egerváry whose theorems underpin it; James Munkres proved in 1957 that it is strongly polynomial [@wikipediacontributors2026b].

The algorithm transforms the cost matrix through repeated row and column subtractions while preserving the optimal assignment. Subtracting a constant from any row or column shifts every candidate assignment's total cost by the same amount, so the optimal assignment is unchanged. The goal state is a matrix where a perfect assignment of zero-cost cells exists — that assignment is optimal [@wikipediacontributors2026b].

## Matrix Formalism (Munkres Steps)

1. Row reduction: subtract the row minimum from every element in each row, so each row contains at least one zero.
2. Column reduction: subtract the column minimum from every element in each column, so each column contains at least one zero.
3. Cover zeros: mark zeros as "starred" (tentative assignments, at most one per row and column) and cover all columns containing a starred zero. If n starred zeros exist, terminate — they form the optimal assignment.
4. Prime uncovered zeros. If a primed zero shares a row with a starred zero, cover that row and uncover the star's column; repeat. If a primed zero has no starred zero in its row, an augmenting path exists.
5. Augment: walk the alternating path of primed and starred zeros, unstar the starred zeros and star the primed ones, erase remaining primes, clear covers, and return to step 3.
6. Matrix update: find the smallest uncovered value, subtract it from all uncovered elements, add it to elements covered by two lines, and return to step 4 [@deepwiki2026].

Each iteration either adds a starred zero (grows the assignment) or creates new zeros via the update step. Kőnig's theorem guarantees the minimum number of lines needed to cover all zeros equals the maximum matching size, so when n lines cover the zeros the assignment is complete and optimal [@wikipediacontributors2026b].

## Complexity

The original Munkres formulation runs in O(n^4). Edmonds and Karp, and independently Tomizawa, modified it to O(n^3) using potentials [@wikipediacontributors2026b]. The O(n^3) version adds jobs one at a time and runs Dijkstra-style shortest paths with Johnson potentials — equivalent to successive shortest paths for min-cost flow [@wikipediacontributors2026b].

## Key Points

- The Hungarian algorithm finds the minimum-cost one-to-one assignment for a square cost matrix in polynomial time
- Row/column subtraction preserves the optimal assignment because it shifts all assignment totals by constants
- A zero-cost perfect assignment after reduction implies optimality (Kőnig's theorem: min vertex cover = max matching)
- Starred zeros mark tentative assignments; augmenting paths (star/prime swaps) grow the assignment one unit at a time
- Complexity: O(n^4) in the naive Munkres version, O(n^3) with dual potentials
- Named for Kőnig and Egerváry; developed by Kuhn (1955), analyzed by Munkres (1957)

## Sources

- [@wikipediacontributors2026b] Wikipedia — Hungarian algorithm (history, matrix and graph formulations, proofs)
- [@deepwiki2026] DeepWiki (logpai/AutoLog) — Hungarian algorithm implementation walkthrough (six Munkres steps)

Related: [[Resources/hnsw-hierarchical-navigable-small-world-graphs.md]] — another efficient matching/search algorithm in the same family.

## Relevant notes

- [Why the Hungarian Algorithm Is Optimal](Resources/why-the-hungarian-algorithm-is-optimal.md)
- [Hungarian Algorithm for String List Matching](Resources/hungarian-algorithm-for-string-list-matching.md)
- [HNSW: Hierarchical Navigable Small World Graphs](Resources/hnsw-hierarchical-navigable-small-world-graphs.md)
- [Nearest Neighbor Search Algorithms for Hyperbolic Embeddings](Resources/nearest-neighbor-search-algorithms-for-hyperbolic-embeddings.md)
- [Citizen Science Popularization Case Studies and Outcomes](Resources/citizen-science-popularization-case-studies-and-outcomes.md)