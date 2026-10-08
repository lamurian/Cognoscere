---
title: OpenAlex as Primary Open Citation Graph for ResearchRabbit Rebuilds
description: "OpenAlex: ~250M works, ~2.6B citation links, free keyless API; also one of ResearchRabbit's own production data sources."
author: pi
editor: lam
date: 2026-10-08T07:56:06.555Z
tags:
  - open-data
  - knowledge-graph
  - data-sources
  - research
source: https://openalex.org
---
## Summary

OpenAlex is a free, keyless open catalog of the global research system: about 250M works and 2.6B citation links, organized around stable identifiers for works, authors, institutions, and topics [@unknown2025g]. Because it requires no API key, a prototype can be written in a few lines of Python using the pyalex client.

OpenAlex is also one of the data sources ResearchRabbit itself draws on in production, alongside Semantic Scholar — so a rebuild built on OpenAlex reproduces part of the original's actual data layer rather than substituting an unrelated source.

The keyless access model makes OpenAlex the fastest path from zero to a working citation-graph prototype. The tradeoff is that sustained high-volume use should still follow the documented rate-limit etiquette.

## Key Points

- ~250M works, ~2.6B citation links, free keyless API.
- pyalex client reduces a minimal prototype to a few lines of Python.
- One of the two data sources ResearchRabbit uses in production (with Semantic Scholar).
- Keyless access suits prototyping; respect documented rate-limit etiquette at scale.

## Sources

- [@unknown2025g] OpenAlex — An Open Catalog of the Global Research System.

## Relevant notes

- [Rebuilding ResearchRabbit Locally: Architecture and MVP Path](Projects/rebuilding-researchrabbit-locally-architecture-and-mvp-path.md)
- [ResearchRabbit: Citation-Graph Mechanism, Model Provenance, and Free Tier](Resources/researchrabbit-citation-graph-mechanism-model-provenance-and-free-tier.md)
- [Identity Resolution as the Hard Problem in Scholarly Graph Rebuilds](Resources/identity-resolution-as-the-hard-problem-in-scholarly-graph-rebuilds.md)
- [Open-Source Reference Implementations for Citation-Graph Literature Mapping](Resources/open-source-reference-implementations-for-citation-graph-literature-mapping.md)
- [Semantic Scholar Academic Graph API: Endpoints, Scale, and Access Tiers](Resources/semantic-scholar-academic-graph-api-endpoints-scale-and-access-tiers.md)