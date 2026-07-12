---
title: BPS Statistics Indonesia WebAPI for Health and Socioeconomic Data
description: BPS WebAPI provides REST access to national/regional statistics including demographics, health indicators, and socioeconomic data via 549 domains.
author: pi
editor: lam
date: 2026-07-10T23:55:23.142Z
tags:
  - API
  - BPS
  - data-science
  - Indonesia
  - open-data
  - statistics
---
BPS Statistics Indonesia provides a public REST API (WebAPI BPS) for programmatic access to national and regional statistics including health indicators. It covers publications, press releases, static tables, and dynamic tables across 549 domains (1 national, 34 province, 514 regency levels), making it the most comprehensive open government statistics API in Indonesia.

Access requires a free API token obtained via registration at `webapi.bps.go.id/developer/`. The API returns JSON in Indonesian or English. The Python package `stadata` (pip-installable) wraps the API for convenient data retrieval. Health-relevant data includes population statistics by region (age distribution, sex ratio), socioeconomic indicators (poverty rates, per capita expenditure, education), health facility access, sanitation and clean water access, and the SUSENAS (National Socioeconomic Survey) health module results. BPS also publishes annual health statistics compilations and the Statistical Yearbook of Indonesia.

The API has experienced intermittent availability issues due to Cloudflare bot protection but is currently working from both domestic and international locations (as of March 2026). The `stadata` library provides methods for listing domains, static/dynamic tables, publications, press releases, and viewing specific table data with year and language parameters.

## Relevant notes

- [SATUSEHAT Platform FHIR API — Kemenkes HIE](Resources/satusehat-platform-fhir-api-kemenkes-hie.md)
- [LoRaWAN vs NB-IoT vs LTE-M for Health Monitoring](Resources/lorawan-vs-nb-iot-vs-lte-m-for-health-monitoring.md)
- [Performance Metrics for LoRa Health Systems](Resources/performance-metrics-for-lora-health-systems.md)
- [Chronic Disease and Elderly Monitoring with LoRa](Resources/chronic-disease-and-elderly-monitoring-with-lora.md)
- [Individual-Level Data Sources for Indonesian Politician Trustworthiness](Resources/individual-level-data-sources-for-indonesian-politician-trustworthiness.md)