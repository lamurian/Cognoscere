---
title: Indonesian Government APIs Compendium for Health Research
description: Community-maintained GitHub repo documenting 57 Indonesian gov APIs including health sources, with status monitoring and Python examples.
author: pi
editor: lam
date: 2026-07-10T23:55:23.143Z
tags:
  - API
  - data-sources
  - Indonesia
  - open-data
  - reference
  - research
---
The community-maintained GitHub repository `suryast/indonesia-gov-apis` documents 57 Indonesian government data portals and APIs, including several health-relevant sources. It categorises sources into tiers by accessibility: Tier 1 (Open APIs — 12 sources including Portal Satu Data, BPS, BMKG, Bank Indonesia), Tier 4 (Ministry-specific data — 8 sources including Kemenkes Health with SATUSEHAT, SISDMK health workforce data), Tier 7 (Civil Society — LAPOR! public complaints, InaRisk disaster risk), and Tier 8 (new additions including SATUSEHAT, BPJPH Halal API).

The repository includes daily status monitoring of all portals from Sydney (AU) and Jakarta (ID), tracking uptime, geo-blocking, and Cloudflare challenges. As of the latest check, 22 portals were fully working, 6 geo-blocked, and 16 had dead DNS. Practical gotchas documented include IP blocking of datacenter IPs (AWS, GCP, DO), government preference for Excel/PDF formats, CSRF token requirements for BPOM, and the standard CKAN API pattern working across data.go.id, Jakarta, Jabar, Jatim, Surabaya, and Bandung portals.

This repo serves as a practical reference for researchers building production applications against Indonesian government health data sources, providing working Python examples and known workarounds for common access issues.

## Relevant notes

- [Portal Satu Data Indonesia CKAN API for Health Datasets](Resources/portal-satu-data-indonesia-ckan-api-for-health-datasets.md)
- [BPS Statistics Indonesia WebAPI for Health and Socioeconomic Data](Resources/bps-statistics-indonesia-webapi-for-health-and-socioeconomic-data.md)
- [SATUSEHAT Platform FHIR API — Kemenkes HIE](Resources/satusehat-platform-fhir-api-kemenkes-hie.md)
- [BPJS Kesehatan Data Portal for JKN Research Datasets](Resources/bpjs-kesehatan-data-portal-for-jkn-research-datasets.md)
- [Individual-Level Data Sources for Indonesian Politician Trustworthiness](Resources/individual-level-data-sources-for-indonesian-politician-trustworthiness.md)