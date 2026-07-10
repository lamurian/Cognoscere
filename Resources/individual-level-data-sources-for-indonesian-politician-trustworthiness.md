---
title: Individual-Level Data Sources for Indonesian Politician Trustworthiness
description: 'Publicly available datasets tracking individual Indonesian politicians: wealth declarations (LHKPN/Kawalharta), election records (KPU/Perludem), corruption cases (ICW/KPK), and parliamentary monitoring — access, granularity, and reliability.'
author: pi
editor: lam
date: 2026-07-10T20:21:59.673Z
tags:
  - indonesia
  - corruption
  - data-sources
  - political-trust
  - trustworthiness
  - governance
---
## Summary

Measuring trustworthiness of individual Indonesian politicians requires assembling data from multiple sources. Four source categories offer individual-level data that can be used as direct or proxy indicators. No single platform provides an aggregated trustworthiness score.

**Wealth transparency: Kawalharta and LHKPN.** Kawalharta.com aggregates LHKPN (State Officials' Wealth Report) data published by the KPK, covering 24,988 officials with IDR 240.3 trillion in tracked assets (30,061 reports processed). Users can search by name or institution, view wealth change history, and rank officials by net worth. Raw data is self-reported (KPK verification is limited) but submitted under oath. Use: track unusual wealth growth as a trustworthiness red flag. Access: free at kawalharta.com or elhkpn.kpk.go.id; no API.

**Election and candidate data: KPU Open Data and Perludem.** The KPU Open Data Portal (opendata.kpu.go.id) provides 159+ datasets covering candidates, elected officials, party affiliations, and vote counts at national, provincial, and regency levels. The Indonesia Election Archive [@agustyati2025] extends this with longitudinal candidate data (2014-2024) including names, gender, and results at provincial/district granularity. Perludem provides an Election API for programmatic access. Use: identify elected officials, map party affiliations, verify electoral records. Access: free at opendata.kpu.go.id; IEA at OSF.io (DOI 10.17605/OSF.IO/HJQZD).

**Corruption case tracking: ICW and KPK.** Indonesia Corruption Watch (icw.or.id) publishes investigations naming individual politicians in corruption, money laundering, and procurement fraud cases. ICW's 2023 report documented 791 corruption cases and 1,695 suspects. KPK's database (kpk.go.id) lists corruption defendants including legislators, ministers, and regional heads. A corruption charge or conviction is the strongest negative trustworthiness signal. Access: ICW reports at antikorupsi.org; KPK cases at kpk.go.id; no structured API. Parliament monitoring via data.dpr.go.id (23 datasets on members, legislation, budgeting) and ipc.or.id provides proxies for engagement and accountability.

**Synthesis.** No ready-made individual trustworthiness score exists. The most robust approach composites across sources: LHKPN wealth trends (unexplained growth = negative), KPK/ICW case involvement (strongest negative signal), legislative attendance and voting records, and election incumbency patterns. All sources are free, institutionally governed, and identify politicians by name for cross-referencing.

## Relevant notes

- [Expert-Based Governance Datasets for Politician Trustworthiness](Resources/expert-based-governance-datasets-for-politician-trustworthiness.md)
- [Taxonomy of Quantitative Methods for Politician Trustworthiness](Resources/taxonomy-of-quantitative-methods-for-politician-trustworthiness.md)
- [Survey-Based Data Sources for Political Trust Measurement](Resources/survey-based-data-sources-for-political-trust-measurement.md)
- [Corruption Indicators: Soeharto vs Prabowo Indonesia](Resources/corruption-indicators-soeharto-vs-prabowo-indonesia.md)
- [Political System and Governance: Soeharto vs Prabowo Indonesia](Resources/political-system-and-governance-soeharto-vs-prabowo-indonesia.md)