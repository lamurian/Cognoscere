---
title: Hungarian Algorithm for String List Matching
description: 'Using the Hungarian algorithm to evaluate matches between two string lists: pairwise similarity matrix, similarity-to-cost conversion, padding, and threshold-gated classification.'
author: pi
editor: lam
date: 2026-08-14T22:50:31.849Z
tags:
  - string-matching
  - similarity-search
  - efficient-algorithms
  - matching
  - optimization
---
## Summary

To evaluate matches between two arrays of strings, frame the problem as an assignment problem. Build an N x M matrix where cell (i, j) holds the similarity between string i in list A and string j in list B, computed with any pairwise string similarity measure — Levenshtein distance, longest common subsequence (LCS), n-gram overlap, Jaccard index, or edit-distance comparators. The Hungarian algorithm then finds the one-to-one pairing that maximizes total similarity (or minimizes total distance) across all pairs [@awslabs2025; @kim2017].

The pipeline has three phases: pairwise similarity computation, Hungarian assignment, and threshold-gated classification. Stickler (AWS Labs), which uses this to compare structured model lists in LLM evaluation, computes a similarity score for every ground-truth/prediction combination, runs the Hungarian assignment in O(n^3) to maximize total similarity, then classifies each matched pair against a match threshold [@awslabs2025]. The core mechanics of the assignment step are described in [[Resources/hungarian-algorithm-mechanics.md]].

## Cost Matrix Construction

The Hungarian algorithm minimizes cost, so similarity scores must be converted. AutoLog converts a profit matrix to cost with cost[i][j] = maxWeightPlusOne - similarity[i][j], where maxWeightPlusOne is the largest matrix value plus one [@deepwiki2026]. Because the algorithm requires a square matrix, rectangular inputs are padded: padded cells get the highest cost in minimization mode so they are never selected, or contribute zero profit after flipping in maximization mode [@deepwiki2026]. When lists differ in length, extra items simply remain unmatched after padding [@awslabs2025].

## Threshold-Gated Classification

After assignment, each pair is classified: similarity >= match_threshold counts as a true positive (TP), below threshold as a false detection (FD); unmatched ground-truth items are false negatives (FN) and unmatched predictions are false alarms (FA) [@awslabs2025]. In Stickler's transaction example, a 3x3 similarity matrix produced the assignment GT[0]→Pred[0] (0.860), GT[1]→Pred[1] (0.572), GT[2]→Pred[2] (0.124); with threshold 0.8 the result was TP=1, FD=2, FN=0, FA=0 [@awslabs2025].

## Application: Binary Program Similarity

Kim et al. apply the same pattern to measure binary function similarity: extract n-gram sets from the instruction sequences of two functions, build a matrix of LCS lengths between every pair of n-grams, and run the Hungarian algorithm to select the indices whose sum is maximal without reusing rows or columns [@kim2017]. They then analyze the slope of matched indices (y = x alignment) to suppress false positives: consecutive matched indices with slope 1 indicate the functions are likely identical [@kim2017].

## Key Points

- String list matching is an assignment problem: pairwise similarity matrix plus Hungarian assignment
- Any pairwise string measure works: Levenshtein, LCS, n-gram overlap, Jaccard
- Convert similarity to cost (cost = max - similarity) because the Hungarian algorithm minimizes
- Pad rectangular matrices to square; padded cells are never selected in minimization mode
- Unequal list lengths leave extra items unmatched after the assignment
- Threshold-gate matched pairs into TP/FD and unmatched items into FN/FA for evaluation metrics

## Sources

- [@awslabs2025] AWS Labs Stickler — Hungarian matching for list-of-structured-model evaluation
- [@deepwiki2026] DeepWiki (logpai/AutoLog) — cost matrix transformation details
- [@kim2017] Kim, Choi, Cho (NDSS 2017) — binary program similarity via n-grams, LCS, and Hungarian

## Relevant notes

- [Why the Hungarian Algorithm Is Optimal](Resources/why-the-hungarian-algorithm-is-optimal.md)
- [Hungarian Algorithm Mechanics](Resources/hungarian-algorithm-mechanics.md)
- [HNSW: Hierarchical Navigable Small World Graphs](Resources/hnsw-hierarchical-navigable-small-world-graphs.md)
- [Hyperbolic Embeddings for NER and Entity Linking](Resources/hyperbolic-embeddings-for-ner-and-entity-linking.md)
- [Nearest Neighbor Search Algorithms for Hyperbolic Embeddings](Resources/nearest-neighbor-search-algorithms-for-hyperbolic-embeddings.md)