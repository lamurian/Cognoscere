---
title: 'Crossref REST API: Endpoints, Metadata, and Redistribution Licensing'
description: 'Crossref REST API: ~2B calls/month of non-copyrighted bibliographic metadata; safe to redistribute; edges must be computed locally.'
author: pi
editor: lam
date: 2026-10-08T07:56:06.554Z
tags:
  - rest-api
  - open-data
  - api
  - data-sources
source: https://www.crossref.org/documentation/retrieve-metadata/rest-api
---
## Summary

The Crossref REST API supplies bibliographic metadata at very high volume — roughly 2 billion calls per month — with free access and no sign-up required [@unknown2025d]. Records include abstracts, funding information, license links, and ORCID/ROR identifiers, making Crossref a practical metadata backbone for an open-source citation-graph rebuild.

The decisive advantage for redistribution is legal: almost none of Crossref's metadata is subject to copyright and may be used for any purpose, with some abstracts excepted. That makes an open-source distribution built on Crossref data legally safe in a way that scraped proprietary metadata would not be.

Crossref supplies metadata, not citation-graph edges. Co-citation and bibliographic-coupling relationships must be computed from reference lists retrieved via the API, then stored locally. High-volume callers should pass a `mailto` parameter to enter the "polite pool" and receive prioritized rate limits.

## Key Points

- ~2B calls/month, free, no sign-up; metadata includes abstracts, funding, licenses, ORCID/ROR.
- Nearly all metadata is non-copyrighted and reusable for any purpose (some abstracts excepted).
- Metadata only — citation-graph edges must be computed from retrieved reference lists.
- Pass `mailto` to join the polite pool for prioritized rate limits.

## Sources

- [@unknown2025d] Crossref REST API documentation.

## Relevant notes

- [OpenCitations Index API v2: Citation-Graph Operations, Records, and Access](Resources/opencitations-index-api-v2-citation-graph-operations-records-and-access.md)
- [Official NotebookLM REST API is enterprise only](Resources/official-notebooklm-rest-api-is-enterprise-only.md)
- [Community REST API wrappers for free NotebookLM](Resources/community-rest-api-wrappers-for-free-notebooklm.md)
- [Open-Source Reference Implementations for Citation-Graph Literature Mapping](Resources/open-source-reference-implementations-for-citation-graph-literature-mapping.md)
- [SATUSEHAT Platform FHIR API — Kemenkes HIE](Resources/satusehat-platform-fhir-api-kemenkes-hie.md)