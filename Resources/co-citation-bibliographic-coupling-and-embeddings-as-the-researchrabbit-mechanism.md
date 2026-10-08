---
title: Co-Citation, Bibliographic Coupling, and Embeddings as the ResearchRabbit Mechanism
description: "ResearchRabbit's engine reduced to standard algorithms: citation neighbors, co-citation, bibliographic coupling, SPECTER2 embeddings, timeline, alerts."
author: pi
editor: lam
date: 2026-10-08T07:56:06.555Z
tags:
  - recommendation
  - embeddings
  - knowledge-graph
  - bibliometric-analysis
---
## Summary

ResearchRabbit's recommendation engine is fully reproducible with standard graph algorithms — no proprietary model required. The core loop runs over a seed set of papers: expand direct citation neighbors (who cites the seed, what the seed cites), then compute co-citation (papers frequently cited together by third parties) and bibliographic coupling (papers sharing items in their reference lists).

For semantic similarity that citation edges cannot capture, embedding-based retrieval fills the gap. SPECTER2 embeddings from Semantic Scholar encode papers using citation-informed transformers, the method introduced in the SPECTER paper [@cohan2020]. Nearest-neighbor search over these embeddings yields the "related work" list.

Two peripheral features complete the loop: a timeline view is a simple group-by-year over the neighbor set, and alerts are a cron job that re-queries each seed's citation list, diffs it against a local store, and emails new items.

## Key Points

- Direct citation neighbors, co-citation, and bibliographic coupling are the core graph algorithms.
- SPECTER2 embeddings provide citation-informed semantic similarity for "related work."
- Timeline view = group-by-year over neighbors; alerts = cron-job diff over citation lists.
- All standard techniques — the "magic" is in metadata quality, not the algorithms.

## Sources

- [@cohan2020] Cohan et al., SPECTER: Document-level Representation Learning using Citation-informed Transformers.

## Relevant notes

- [Open-Source Reference Implementations for Citation-Graph Literature Mapping](Resources/open-source-reference-implementations-for-citation-graph-literature-mapping.md)
- [Semantic Scholar Academic Graph API: Endpoints, Scale, and Access Tiers](Resources/semantic-scholar-academic-graph-api-endpoints-scale-and-access-tiers.md)
- [OpenCitations Index API v2: Citation-Graph Operations, Records, and Access](Resources/opencitations-index-api-v2-citation-graph-operations-records-and-access.md)
- [Crossref REST API: Endpoints, Metadata, and Redistribution Licensing](Resources/crossref-rest-api-endpoints-metadata-and-redistribution-licensing.md)
- [Rebuilding ResearchRabbit Locally: Architecture and MVP Path](Projects/rebuilding-researchrabbit-locally-architecture-and-mvp-path.md)