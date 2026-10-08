---
title: 'Rebuilding ResearchRabbit Locally: Architecture and MVP Path'
description: 'Architecture and weekend MVP path for a local ResearchRabbit rebuild: DOI-based identity resolution, triple storage, pyalex prototype, React graph UI.'
author: pi
editor: lam
date: 2026-10-08T07:56:06.557Z
tags:
  - howto
  - open-source
  - python
  - knowledge-graph
source: https://openalex.org
---
## Summary

A local open-source ResearchRabbit rebuild has four layers: identity resolution, storage, graph computation, and UI. Identity resolution maps every record through DOI → OpenAlex ID or Semantic Scholar paper ID. Storage holds edges as `(citing_work, cited_work)` triples — Neo4j, DuckDB, or Postgres + pgRouting all suffice at hobby scale. The UI is React plus a graph library (react-flow, cytoscape.js, or sigma.js for large graphs).

A working MVP takes a weekend. Fetch a seed paper from OpenAlex via pyalex, pull its citing papers and reference list, and count how often pairs of its references appear together to compute co-citation [@unknown2025g]. That yields the related-work list, reference list, and citing papers — roughly 80% of ResearchRabbit's practical value.

Build on OpenAlex and Semantic Scholar identifiers rather than rolling custom dedup early. Metadata quality and deduplication, not the graph algorithms, determine whether the output is trustworthy.

## Key Points

- Four layers: identity resolution (DOI → OpenAlex/S2 IDs), triple storage, graph algorithms, React UI.
- Storage options at hobby scale: Neo4j, DuckDB, Postgres + pgRouting.
- Weekend MVP: pyalex seed → citing papers + references + co-citation counts.
- Defer custom dedup; canonical IDs carry the load.

## Sources

- [@unknown2025g] OpenAlex — An Open Catalog of the Global Research System.

## Relevant notes

- [OpenAlex as Primary Open Citation Graph for ResearchRabbit Rebuilds](Resources/openalex-as-primary-open-citation-graph-for-researchrabbit-rebuilds.md)
- [Semantic Scholar Academic Graph API: Endpoints, Scale, and Access Tiers](Resources/semantic-scholar-academic-graph-api-endpoints-scale-and-access-tiers.md)
- [Open-Source Reference Implementations for Citation-Graph Literature Mapping](Resources/open-source-reference-implementations-for-citation-graph-literature-mapping.md)
- [Identity Resolution as the Hard Problem in Scholarly Graph Rebuilds](Resources/identity-resolution-as-the-hard-problem-in-scholarly-graph-rebuilds.md)
- [OpenCitations Index API v2: Citation-Graph Operations, Records, and Access](Resources/opencitations-index-api-v2-citation-graph-operations-records-and-access.md)