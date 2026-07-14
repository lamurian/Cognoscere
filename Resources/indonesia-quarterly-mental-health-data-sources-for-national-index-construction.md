---
title: Indonesia Quarterly Mental Health Data Sources for National Index Construction
description: Composite approach combining annual surveys, continuous global surveys, and digital proxies for quarterly mental health index in Indonesia.
author: pi
editor: lam
date: 2026-07-14T15:12:36.640Z
tags:
  - Indonesia
  - mental-health
  - data-sources
  - public-health
  - index
  - open-data
---

An Indonesia Mental Health Index (IMHI) with quarterly update capability must use a multi-source composite because no single public data source simultaneously meets all criteria: open access, quarterly frequency, national representativeness, mental-health specificity, and Indonesia coverage. The recommended architecture mirrors the ONS England Health Index mixed-frequency approach [@frenisterrantino2022], combining annual longitudinal surveys, continuous global surveys, high-frequency digital proxies, and administrative data.

**Annual anchor: Global Flourishing Study (GFS).** The GFS by Harvard/Baylor/Gallup collects annual data across 22 countries including Indonesia, with open access via the Center for Open Science (cos.io/gfs). It measures six flourishing dimensions including mental and physical health. Indonesia scored 8.47/10, ranked #1 of 23 countries. Wave 1-2 data are public; Wave 3 requires preregistration until April 2027 [@vanderweele2025].

**Continuous survey: Sapien Labs Global Mind Project.** Collects MHQ (Mental Health Quotient) assessments continuously across 130+ countries, with 2M+ profiles and 2,000+ new responses daily (sapienlabs.org). Covers cognitive, emotional, and social functioning. Data free to academic/nonprofit researchers via the Researcher Hub. If Indonesia sample size is adequate, this enables quarterly interpolation between annual GFS waves.

**Annual prevalence benchmark: SKI (Survei Kesehatan Indonesia).** The annual successor to Riskesdas by BKPK Kemenkes, first conducted in 2023. Includes mental health module. The 2023 wave found ~2% of Indonesians aged 15+ experiencing mental health challenges [@disviana2024]. Reports at kemkes.go.id. Provides prevalence calibration for the index.

**Quarterly treatment severity signal: SATUSEHAT.** Kemenkes national health data ecosystem aggregating EMRs from healthcare facilities with public dashboards at satusehat.kemkes.go.id/data. ICD-10 coded mental disorder data (F00-F99) is available. Analysis by Kemenkes DTO showed schizophrenia (32.01%), anxiety disorders (20.93%), depressive episodes (10.19%), and bipolar disorder (4.63%) as the top diagnoses [@disviana2024]. Updated continuously as facilities submit data.

**High-frequency digital proxy: Google Trends.** Provides daily/weekly relative search volume (0-100) for Indonesia at trends.google.com. Trackable keywords: 'depresi', 'psikolog', 'kesehatan mental', 'bunuh diri'. A 2023 Indonesian study confirmed correspondence between search volumes and survey-measured mental health prevalence [@wijaya2023]. Unofficial APIs (pytrends, gtrendsR) enable programmatic access.

**Semi-annual socioeconomic context: Susenas by BPS.** Two annual rounds: March KOR (345K households, national/kabupaten level) and September MSBP (76K households, rotating modules, provincial level). BPS WebAPI (webapi.bps.go.id) provides REST access to tabulations. Health statistics are compiled annually in the BPS Statistik Kesehatan publication.

**Supplementary treatment proxy: BPJS Kesehatan.** Data portal at data.bpjs-kesehatan.go.id provides JKN sample datasets including a mental health context-specific set (Data Sampel 2025). Includes membership demographics, utilization rates, and claims distribution.

**Historical baseline: UMD/Meta CTIS (2020-2022).** The COVID-19 Trends and Impact Survey collected daily PHQ-2 (depression) and GAD-2 (anxiety) data from Facebook users in Indonesia until June 2022. Data archived at Illinois Data Bank and ICPSR. No current successor from UMD/Meta was identified. Useful for pre/post pandemic comparison.

**Composite estimation method.** Use GFS annual flourishing (mental health domain) as the index anchor. Calibrate with SKI prevalence estimates. Interpolate quarterly using Sapien Labs continuous data and Google Trends search indices as high-frequency signals. Contextualize with SATUSEHAT severity trends and Susenas socioeconomic stratification. This mixed-frequency nowcasting approach follows established composite index methodology [@frenisterrantino2022].

**Caveats.** GFS is limited to 22 countries with no sub-national breakdown for Indonesia. Sapien Labs and Google Trends capture internet-enabled populations, introducing digital/urban bias. SATUSEHAT only covers facility-treated cases (severe spectrum). SKI is annual with no public microdata API. Susenas mental health module availability varies by year. No single source currently provides quarterly, nationally representative, mental-health-specific data for Indonesia -- the composite approach is necessary.