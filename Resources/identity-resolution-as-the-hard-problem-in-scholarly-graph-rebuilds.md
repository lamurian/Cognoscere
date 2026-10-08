---
title: Identity Resolution as the Hard Problem in Scholarly Graph Rebuilds
description: Identity resolution — DOI mapping, preprint dedup, author disambiguation — is the real bottleneck in scholarly graph rebuilds, not the algorithms.
author: pi
editor: lam
date: 2026-10-08T07:56:06.556Z
tags:
  - entity-linking
  - data-quality
  - data-sources
---
## Summary

The graph algorithms in a ResearchRabbit rebuild are never the bottleneck — metadata quality and deduplication are. The genuinely hard problem is identity resolution: mapping every record through canonical identifiers (DOI → OpenAlex ID or Semantic Scholar paper ID) and deduplicating preprint↔published versions of the same work.

Author disambiguation compounds the problem. The same researcher may appear under variant names, merged profiles, or ORCID-less records across sources. Rolling custom entity resolution early is a common and expensive mistake.

The practical strategy is to lean on identifiers that already exist. OpenAlex and Semantic Scholar have solved entity resolution at scale; build on their IDs and treat custom dedup as a later optimization applied only where the canonical sources conflict.

## Key Points

- Bottleneck is metadata quality and dedup, not graph algorithms.
- Map everything through DOI → OpenAlex ID / S2 paper ID.
- Deduplicate preprint↔published versions; disambiguate authors across sources.
- Lean on existing open IDs; custom entity resolution is a later optimization.

## Sources

- [@unknown2025g] OpenAlex — An Open Catalog of the Global Research System.
- [@unknown2025c] Semantic Scholar Academic Graph API.

## Relevant notes

- [Rebuilding ResearchRabbit Locally: Architecture and MVP Path](Projects/rebuilding-researchrabbit-locally-architecture-and-mvp-path.md)
- [Open-Source Reference Implementations for Citation-Graph Literature Mapping](Resources/open-source-reference-implementations-for-citation-graph-literature-mapping.md)
- [OpenAlex as Primary Open Citation Graph for ResearchRabbit Rebuilds](Resources/openalex-as-primary-open-citation-graph-for-researchrabbit-rebuilds.md)
- [ResearchRabbit: Citation-Graph Mechanism, Model Provenance, and Free Tier](Resources/researchrabbit-citation-graph-mechanism-model-provenance-and-free-tier.md)
- [Crossref REST API: Endpoints, Metadata, and Redistribution Licensing](Resources/crossref-rest-api-endpoints-metadata-and-redistribution-licensing.md)