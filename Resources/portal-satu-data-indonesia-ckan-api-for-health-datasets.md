---
title: Portal Satu Data Indonesia CKAN API for Health Datasets
description: Indonesia's central open data portal with 584K+ datasets including health, accessed via CKAN API at data.go.id/api/3/action/.
author: pi
editor: lam
date: 2026-07-10T23:55:23.143Z
tags:
  - API
  - Bappenas
  - CKAN
  - data.go.id
  - Indonesia
  - open-data
---
Portal Satu Data Indonesia (data.go.id), managed by Bappenas, is the central Indonesian open data portal with 584,000+ datasets across all sectors. It implements the CKAN API standard, enabling programmatic dataset discovery and download via methods like `package_search`, `package_show`, and `resource_search`.

The CKAN API base URL is `https://data.go.id/api/3/action/`. Health datasets can be queried with `package_search?q=kesehatan` to find datasets on stunting prevalence, immunisation coverage (HB0, BCG, DPT, polio, measles), maternal and child health, anaemia screening, puskesmas/hospital statistics, COVID-19 case data, nutrition status, and family planning. Data formats include CSV, XLSX, PDF, and JSON, with access levels ranging from Terbuka (Open) to Terbatas (Restricted). Regional portals using the same CKAN pattern include Satu Data Jakarta (data.jakarta.go.id), Open Data Jabar (opendata.jabarprov.go.id), and Open Data Jatim (data.jatimprov.go.id), each containing local health datasets. The portal is listed as stable and working in community monitoring of Indonesian government APIs.

## Relevant notes

- [BPJS Kesehatan Data Portal for JKN Research Datasets](Resources/bpjs-kesehatan-data-portal-for-jkn-research-datasets.md)
- [Individual-Level Data Sources for Indonesian Politician Trustworthiness](Resources/individual-level-data-sources-for-indonesian-politician-trustworthiness.md)
- [BPS Statistics Indonesia WebAPI for Health and Socioeconomic Data](Resources/bps-statistics-indonesia-webapi-for-health-and-socioeconomic-data.md)
- [SATUSEHAT Platform FHIR API — Kemenkes HIE](Resources/satusehat-platform-fhir-api-kemenkes-hie.md)
- [Survey-Based Data Sources for Political Trust Measurement](Resources/survey-based-data-sources-for-political-trust-measurement.md)