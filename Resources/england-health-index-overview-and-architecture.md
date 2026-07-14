---
title: 'England Health Index: Overview and Architecture'
description: High-level structure and purpose of the ONS England Health Index composite indicator.
author: pi
editor: lam
date: 2026-07-14T14:02:36.933Z
tags:
  - health
  - index
  - methodology
  - public-health
  - uk
  - measurement
---
The England Health Index is a composite indicator developed by the UK Office for National Statistics (ONS) to quantify population health across 149 Upper Tier Local Authorities (UTLAs), later expanded to 307 Lower Tier Local Authorities. It tracks changes in health over time and enables comparison between different geographical areas, serving as a tool for policy implementation and assessment [@frenisterrantino2022].

The Index expands the WHO definition of health to include health determinants, structured across three main domains. **Healthy People** captures health outcomes (mortality, physical conditions, mental health, wellbeing). **Healthy Lives** captures health-related behaviours and risk factors (smoking, alcohol, physical activity, unemployment, education). **Healthy Places** captures wider environmental and social determinants (green space, air pollution, housing, services, crime). These three domains contain 17 subdomains and 58 indicators in total [@frenisterrantino2022].

The index follows the COIN guidance from the European Joint Research Centre with these steps: data imputation for missing values, data transformation and normalization, subdomain weight computation via factor analysis, and arithmetic aggregation with equal weights across subdomains and domains. The index value for each UTLA is calculated annually from 2015 onwards, normalized to a baseline value of 100 for 2015 [@frenisterrantino2022].

## Relevant notes

- [The UK England Health Index Case Study](Resources/the-uk-england-health-index-case-study.md)
- [National Health Index Research Synthesis](Resources/national-health-index-research-synthesis.md)
- [Cross-Country Comparability Requirements for Health Indices](Resources/cross-country-comparability-requirements-for-health-indices.md)
- [Recommended Approach for a National Health Index](Resources/recommended-approach-for-a-national-health-index.md)
- [Limitations of Life Expectancy for Population Health Assessment](Resources/limitations-of-life-expectancy-for-population-health-assessment.md)