---
title: 'Jaccard Similarity: Definition and Properties'
description: 'The Jaccard index measures set overlap as intersection over union: formula, bounds, Jaccard distance as a metric, weighted variant, and relation to the simple matching coefficient.'
author: pi
editor: lam
date: 2026-08-14T23:02:28.295Z
tags:
  - similarity-search
  - statistics
  - fundamental
  - reference
  - theory
---
## Summary

The Jaccard index (also called Jaccard similarity, intersection over union, or IoU) measures the similarity of two sets as the size of their intersection divided by the size of their union: J(A,B) = |A ∩ B| / |A ∪ B| = |A ∩ B| / (|A| + |B| − |A ∩ B|) [@wikipediacontributors2026c]. It is bounded between 0 and 1: J = 0 when the sets are disjoint, J = 1 when they are identical. It can be read as the fraction of distinct elements across both sets that they share.

The concept was first introduced by Grove Karl Gilbert in 1884 as the "ratio of verification" for geological prediction evaluation, developed independently by Paul Jaccard in 1901 (as the coefficient de communaute), and formulated again by Taffee Tanimoto in 1958 — hence the alternative name Tanimoto index [@wikipediacontributors2026c]. In computer vision the identical ratio is called intersection over union (IoU) and is the standard metric for object detection and image segmentation evaluation [@wikipediacontributors2026c].

## Jaccard Distance

The complementary Jaccard distance is dJ(A,B) = 1 − J(A,B) = |A △ B| / |A ∪ B|, where A △ B is the symmetric difference (elements in either set but not both) [@wikipediacontributors2026c]. Jaccard distance is a proper metric on finite sets — it satisfies the triangle inequality — which makes it usable for clustering and multidimensional scaling of sample sets [@wikipediacontributors2026c].

## Properties and Variants

For binary attributes (presence/absence data), Jaccard equals M11 / (M11 + M10 + M01), counting only mutual presences. Unlike the simple matching coefficient (SMC), it ignores shared absences (M00). This makes Jaccard appropriate for sparse asymmetric data — e.g., comparing two shopping baskets out of 1000 products: salt+pepper vs salt+sugar gives J = 1/3, whereas SMC returns 0.998 [@wikipediacontributors2026c]. For symmetric dummy variables (gender encoded 0/1) SMC is preferable.

The weighted Jaccard index (Ruzicka similarity) extends the measure to non-negative real vectors: JW(x,y) = Σ min(xi,yi) / Σ max(xi,yi), computed in O(n), or O(k) when iterating only non-zero entries of sparse vectors [@wikipediacontributors2026c]. A multiset (bag) variant exists but caps at 1/2 as maximum [@wikipediacontributors2026c]. In confusion-matrix form the Jaccard index is TP / (TP + FP + FN) [@wikipediacontributors2026c].

## Scaling to Large Datasets

The MinHash min-wise independent permutations locality-sensitive hashing scheme estimates the Jaccard index from constant-sized signatures of each set, enabling near-duplicate detection at web scale [@wikipediacontributors2026c]. The Sørensen-Dice coefficient is related: D = 2J/(1+J) and J = D/(2−D) [@wikipediacontributors2026c].

## Key Points

- J(A,B) = |A ∩ B| / |A ∪ B|, bounded in [0,1]; 0 for disjoint sets, 1 for identical sets
- Jaccard distance 1 − J is a proper metric (satisfies triangle inequality), usable for clustering
- Ignores shared absences, unlike the simple matching coefficient — suited to sparse presence/absence data
- Weighted Jaccard (Ruzicka similarity) extends to non-negative vectors: Σmin/Σmax, O(n) or O(k) sparse
- History: Gilbert (1884), Jaccard (1901), Tanimoto (1958); called IoU in computer vision
- MinHash + LSH approximate Jaccard at scale with constant-size signatures

## Sources

- [@wikipediacontributors2026c] Wikipedia — Jaccard index (definition, properties, history, variants)

Related: [[Resources/hungarian-algorithm-for-string-list-matching.md]] — Jaccard as a pairwise string measure in assignment problems.

## Relevant notes

- [Jaccard Similarity for Strings: Tokenization and Shingling](Resources/jaccard-similarity-for-strings-tokenization-and-shingling.md)
- [Hungarian Algorithm for String List Matching](Resources/hungarian-algorithm-for-string-list-matching.md)
- [FAISS: Library for Efficient Similarity Search](Resources/faiss-library-for-efficient-similarity-search.md)
- [Nearest Neighbor Search Algorithms for Hyperbolic Embeddings](Resources/nearest-neighbor-search-algorithms-for-hyperbolic-embeddings.md)
- [Semantic Caching for Agent Workloads](Resources/semantic-caching-for-agent-workloads.md)