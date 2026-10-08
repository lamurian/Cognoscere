---
title: 'OpenCitations Index API v2: Citation-Graph Operations, Records, and Access'
description: 'OpenCitations Index API v2 for open citation edges: reference/citation endpoints, self-citation flags, 180 req/min limit, bulk dumps.'
author: pi
editor: lam
date: 2026-10-08T07:56:06.553Z
tags:
  - api
  - rest-api
  - open-data
  - bibliometric-analysis
source: https://opencitations.net/index/api/v2
---
## Summary

The OpenCitations Index REST API v2 provides open citation edges without the licensing concerns that attach to proprietary citation data [@unknown2025f]. Three core endpoints cover the graph operations a ResearchRabbit rebuild needs: `/references/{id}` returns the reference list of a work, `/citations/{id}` returns works citing it, and `/citation-count/{id}` returns the citation count. All accept DOIs, PMIDs, ISSNs, ISBNs, or OMIDs (OpenCitations Meta Identifiers).

Citation records carry self-citation flags — `author_sc` and `journal_sc` — which are directly useful for co-citation-style features that filter out self-references. Rate limits are 180 requests per minute per IP address. For large-scale local ingestion, bulk database dumps are available at download.opencitations.net, sidestepping the per-request ceiling entirely.

OpenCitations is ISC-licensed, and its infrastructure (the RAMOSE REST API manager over SPARQL endpoints) is developed in the open with a public GitHub issue tracker.

## Key Points

- `/references`, `/citations`, `/citation-count` endpoints; accepts DOI, PMID, ISSN, ISBN, OMID.
- Self-citation flags (`author_sc`, `journal_sc`) support co-citation filtering.
- 180 req/min per IP; bulk dumps at download.opencitations.net for offline ingestion.
- ISC-licensed; infrastructure (RAMOSE) developed in the open.

## Sources

- [@unknown2025f] OpenCitations Index API v2 documentation.

## Relevant notes

- [Open-Source Reference Implementations for Citation-Graph Literature Mapping](Resources/open-source-reference-implementations-for-citation-graph-literature-mapping.md)
- [Crossref REST API: Endpoints, Metadata, and Redistribution Licensing](Resources/crossref-rest-api-endpoints-metadata-and-redistribution-licensing.md)
- [OpenAlex as Primary Open Citation Graph for ResearchRabbit Rebuilds](Resources/openalex-as-primary-open-citation-graph-for-researchrabbit-rebuilds.md)
- [SATUSEHAT Platform FHIR API — Kemenkes HIE](Resources/satusehat-platform-fhir-api-kemenkes-hie.md)
- [BPS Statistics Indonesia WebAPI for Health and Socioeconomic Data](Resources/bps-statistics-indonesia-webapi-for-health-and-socioeconomic-data.md)