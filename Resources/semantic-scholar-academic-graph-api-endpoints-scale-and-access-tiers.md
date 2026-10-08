---
title: 'Semantic Scholar Academic Graph API: Endpoints, Scale, and Access Tiers'
description: 'S2AG API as the closest ResearchRabbit graph-engine replacement: 214M papers, Recommendations service, SPECTER2 embeddings, rate tiers, bulk dataset.'
author: pi
editor: lam
date: 2026-10-08T07:56:06.552Z
tags:
  - api
  - knowledge-graph
  - data-sources
  - research
source: https://www.semanticscholar.org/product/api
---
## Summary

The Semantic Scholar Academic Graph (S2AG) API is the closest single replacement for ResearchRabbit's proprietary graph engine. It covers 214M papers, 2.49B citations, and 79M authors, and ships a dedicated Recommendations service that returns papers similar to a given input — the direct stand-in for ResearchRabbit's "more like this" feature [@unknown2025c].

For similarity search beyond the Recommendations endpoint, the API exposes SPECTER2 embeddings, the current generation of the citation-informed document encoder [@cohan2020]. Most endpoints are unauthenticated, but anonymous traffic shares a rate limit of roughly 1000 requests per second across all users. Registering a free API key starts at 1 request per second and unlocks higher tiers.

For a fully offline rebuild, the bulk S2AG dataset can be ingested into a local graph database instead of hitting the live API. That trades freshness for independence from rate limits and network availability.

## Key Points

- Closest single graph-engine replacement: 214M papers, 2.49B citations, 79M authors.
- Recommendations service + SPECTER2 embeddings cover the "more like this" use case.
- Unauthenticated endpoints share ~1000 req/s; an API key starts at 1 req/s with higher tiers.
- Bulk S2AG dataset enables fully offline ingestion into a local graph database.

## Sources

- [@unknown2025c] Semantic Scholar Academic Graph API product page.
- [@cohan2020] Cohan et al., SPECTER: Document-level Representation Learning using Citation-informed Transformers.

## Relevant notes

- [OpenAlex as Primary Open Citation Graph for ResearchRabbit Rebuilds](Resources/openalex-as-primary-open-citation-graph-for-researchrabbit-rebuilds.md)
- [Open-Source Reference Implementations for Citation-Graph Literature Mapping](Resources/open-source-reference-implementations-for-citation-graph-literature-mapping.md)
- [ResearchRabbit: Citation-Graph Mechanism, Model Provenance, and Free Tier](Resources/researchrabbit-citation-graph-mechanism-model-provenance-and-free-tier.md)
- [Identity Resolution as the Hard Problem in Scholarly Graph Rebuilds](Resources/identity-resolution-as-the-hard-problem-in-scholarly-graph-rebuilds.md)
- [Rebuilding ResearchRabbit Locally: Architecture and MVP Path](Projects/rebuilding-researchrabbit-locally-architecture-and-mvp-path.md)