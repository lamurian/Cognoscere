---
title: 'UK Mental Health Measurement: England Health Index Subdomain'
description: How mental health is measured as a subdomain (Pe.5) within the ONS England Health Index.
author: pi
editor: lam
date: 2026-07-14T14:13:27.258Z
tags:
  - health
  - index
  - mental-health
  - methodology
  - uk
  - measurement
  - public-health
---
The UK does not publish a standalone National Mental Health Index. The most authoritative composite measurement of mental health at national level is the **Mental Health subdomain (Pe.5)** within the ONS England Health Index Healthy People domain. Pe.5 uses three indicators: suicide rates (age-standardised), depression prevalence, and self-harm prevalence. These are distinct from the Personal Well-being subdomain (Pe.4), which measures life satisfaction, worthwhileness, happiness, and anxiety [@frenisterrantino2022].

Data sources include ONS mortality registration data for suicides, the Quality and Outcomes Framework (QOF) from GP practices for depression diagnosis prevalence, and NHS hospital episode statistics for self-harm. Indicators are expressed as rates per 100,000 population or as percentages. In the data transformation step, each indicator is checked for skewness and kurtosis, with transformations applied where needed to achieve absolute skewness under 2 and kurtosis under 3.5 [@frenisterrantino2022].

The subdomain score is calculated by normalizing each indicator to a z-score anchored to the 2015 baseline year, then aggregating via time-series factor analysis weights within the subdomain. Pe.5 is one of five equally-weighted subdomains within the Healthy People domain, alongside Mortality (Pe.1), Physical health conditions (Pe.2), Difficulties in daily life (Pe.3), and Personal well-being (Pe.4) [@frenisterrantino2022].

## Relevant notes

- [The UK England Health Index Case Study](Resources/the-uk-england-health-index-case-study.md)
- [England Health Index: Overview and Architecture](Resources/england-health-index-overview-and-architecture.md)
- [England Health Index: Healthy People Domain](Resources/england-health-index-healthy-people-domain.md)
- [England Health Index: Healthy Lives Domain](Resources/england-health-index-healthy-lives-domain.md)
- [England Health Index: Healthy Places Domain](Resources/england-health-index-healthy-places-domain.md)