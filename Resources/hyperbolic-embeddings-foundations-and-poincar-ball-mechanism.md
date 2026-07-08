---
title: 'Hyperbolic Embeddings: Foundations and Poincaré Ball Mechanism'
description: Hyperbolic embeddings map data into negatively curved space; Poincaré ball enables low-dimensional hierarchy capture via exponential volume growth
author: pi
editor: lam
date: 2026-07-08T08:22:22.196Z
tags:
  - hyperbolic-embeddings
  - representation-learning
  - hyperbolic-space
  - poincare-ball
  - hierarchical-data
---
Hyperbolic embeddings map symbolic data (words, graph nodes, concepts) into hyperbolic space — a Riemannian manifold with constant negative curvature. Unlike Euclidean space, hyperbolic volume grows **exponentially** with radius, matching the exponential node growth of trees: a tree with branching factor b has (b+1)b^(l-1) nodes at level l. In Euclidean space, circle circumference grows as 2πr (linear), but in hyperbolic space it grows as 2π sinh(r) ~ e^r (exponential). This means a 2D hyperbolic plane can embed arbitrarily complex trees with minimal distortion, while Euclidean space would require prohibitively high dimensionality [@nickel2017].

The Poincaré ball model B^d = {x in R^d : ||x|| < 1} implements this via the distance function: d(u,v) = arcosh(1 + 2||u-v||² / ((1-||u||²)(1-||v||²))). This function has a crucial self-organizing property: points near the origin (root nodes) have small distances to most other nodes, while points near the boundary (leaf nodes, ||x|| → 1) have exponentially growing distances between them. The norm captures hierarchy level; angular proximity captures similarity. Both are learned simultaneously without explicit hierarchical supervision [@nickel2017].

Training uses Riemannian Stochastic Gradient Descent (RSGD) with gradient rescaling. The update rule $θ_{t+1} = proj(θ_t - η_t · ((1-||θ_t||²)²/4) · ∇_E)$ constrains embeddings to stay within the unit ball while adapting update speed based on hierarchical position. Ganea et al. extended this with entailment cones — nested geodesically convex cones in the Poincaré ball that model hierarchical relations as partial orders, where a child's cone is contained within its parent's cone, providing a principled geometric framework for directed acyclic graphs [@ganea2018].

## Relevant notes

- [Hyperbolic Embeddings for SNOMED CT Hierarchical Retrieval](Resources/hyperbolic-embeddings-for-snomed-ct-hierarchical-retrieval.md)
- [Executive Summary: SLMs for SNOMED CT Knowledge Graphs and Clinical NER](Resources/executive-summary-slms-for-snomed-ct-knowledge-graphs-and-clinical-ner.md)
- [Agent Baseline Initialization via Sigmoid and Tanh Transforms](Resources/agent-baseline-initialization-via-sigmoid-and-tanh-transforms.md)
- [Agent Initialization State Parameters](Resources/agent-initialization-state-parameters.md)
- [Developmental Milestones at 21 Months](Resources/developmental-milestones-at-21-months.md)
