---
title: Citizen Science Definition Methodology and Defensibility
description: Covers citizen science definition, typology (contributory/collaborative/co-created), workflow, quality control mechanisms, epistemic justification, and notable successes (eBird, Galaxy Zoo, Foldit).
author: pi
editor: lam
date: 2026-08-01T23:05:29.937Z
tags:
  - citizen-science
  - participatory-methods
  - biodiversity
  - conservation
  - ecology
  - monitoring
  - data-quality
  - community
---
## Summary

Citizen science (CS) refers to intentional collaborations in which members of the public engage in the process of research to generate new science-based knowledge [@shirk2012]. The term encompasses two major traditions: a natural-science tradition focused on large-scale data collection and classification (originating with Bonney et al. at Cornell Lab of Ornithology), and a social-science tradition emphasizing democratic participation in science policy and decision-making (following Irwin 1995) [@kullenberg2016]. A scientometric analysis of 1,935 Web of Science articles identifies three main research strands adopting CS: biology/conservation/ecology (largest, using CS for data collection), geographic information science (volunteered geographic information), and social sciences/epidemiology (participation in environmental health) [@kullenberg2016].

## Key Points

### Definition and Typology

Shirk et al. [@shirk2012] propose **Public Participation in Scientific Research (PPSR)** as an overarching term and define five project models based on degree of public participation in the research process:

1. **Contractual** — Communities commission professional researchers to investigate a specific question
2. **Contributory** — Scientists design projects; public primarily contributes data (e.g., eBird, Galaxy Zoo)
3. **Collaborative** — Scientists design projects; public contributes data and helps refine design, analyze data, disseminate findings
4. **Co-created** — Scientists and public jointly design projects; public actively involved in most/all research stages
5. **Collegial** — Non-credentialed individuals conduct research independently (e.g., amateur astronomers)

The three central models (contributory, collaborative, co-created) form a continuum of participation depth. Project outcomes correlate with both degree of participation and quality of participation (how well goals align with public interests) [@shirk2012].

### How It Works: Workflow and Mechanisms

**Project design and volunteer recruitment**: Successful projects match protocols to existing community practices (e.g., eBird's checklist format mirrors birding norms) and build tools that serve participant interests (personal lists, visualizations) [@wood2011]. Digital platforms (Zooniverse, eBird) enable massive scale — Galaxy Zoo achieved 70,000 classifications/hour at peak [@masters2019].

**Training and protocols**: Training ranges from minimal (simple classification tasks) to extensive (water quality monitoring). eBird uses flexible entry to onboard casual users, then incentivizes transition to rigorous protocols through educational tools and visualizations that reward complete checklists [@wood2011].

**Data collection and aggregation**: Contributory projects (Galaxy Zoo) use median votes per image (40 classifiers/galaxy) with weighting schemes to remove inconsistent users [@masters2019]. eBird uses effort-based protocols (date, location, duration, distance, completeness) to enable statistical modeling [@wood2011].

**Quality assurance mechanisms**:
- **Expert verification**: eBird's 450+ regional editors review flagged records (>3.5M reviewed) [@wood2011]
- **Statistical filtering**: Automated outlier filters based on regional/seasonal maxima; Bayesian models prioritize complex cases for human review (Galaxy Zoo's Enhanced Workflow) [@masters2019; @wood2011]
- **Consensus/redundancy**: Multiple independent classifications per task; agreement metrics weight reliable contributors
- **Calibration tasks**: Embedded known-standard items to assess participant accuracy
- **Spatio-temporal modeling**: STEM models relate observations to environmental covariates to predict at unsampled locations/times [@wood2011]

### Epistemic Defensibility

**Peer-reviewed output**: Galaxy Zoo classifications used in >1,000 papers (60+ by core team, 12 with >100 citations) [@masters2019]. eBird data underpins >100 terrestrial bird distribution models and conservation planning [@wood2011]. Foldit players solved a retroviral protease structure published in *Nature Structural & Molecular Biology* [@kullenberg2016].

**Validation studies**: Comparative studies show volunteer data can match or exceed professional data quality when protocols are well-designed. The "many eyes" principle and statistical aggregation compensate for individual errors [@shirk2012; @wood2011].

**Bias correction**: Statistical approaches address spatial/temporal sampling bias (e.g., STEM models, occupancy-detection models), observer heterogeneity (weighting schemes), and detection probability [@wood2011; @masters2019].

**Ethical frameworks**: Issues of data ownership, credit, and visibility are addressed through authorship policies (Foldit players as group authors), acknowledgment standards, and open data licenses [@kullenberg2016]. The ECSA Ten Principles of Citizen Science provide ethical guidance.

### Notable Successes

| Project | Domain | Model | Key Achievement |
|---------|--------|-------|-----------------|
| **eBird** | Ornithology | Contributory | 1.7M+ checklists/year from 210+ countries; STEM models for 100+ species [@wood2011] |
| **Galaxy Zoo** | Astronomy | Contributory | >1M galaxy morphologies; >1,000 papers; discovered "green pea" galaxies, Hanny's Voorwerp [@masters2019] |
| **Foldit** | Structural biology | Collaborative/Co-created | De novo protein design; solved retroviral protease structure [@kullenberg2016] |
| **Zooniverse platform** | Multi-domain | Contributory | 1.7M+ volunteers; 200+ projects; Project Builder enables researcher-led creation [@masters2019] |

## Sources

- @shirk2012 — PPSR framework, typology, design principles
- @masters2019 — Galaxy Zoo case study, methodology, outcomes
- @kullenberg2016 — Scientometric meta-analysis, field mapping, project outputs
- @bonney2009 — Foundational definition, expanding science knowledge/literacy
- @wood2011 — eBird workflow, quality control, statistical modeling, global network

## Relevant notes

- [Dr. Caroline Figueroa — TU Delft: Digital Health Equity PI for MSCA Hosting](Resources/dr-caroline-figueroa-tu-delft-digital-health-equity-pi-for-msca-hosting.md)
- [Dr. Ruth Peters — VU Amsterdam: Indonesia-Focused Global Health PI for MSCA Hosting](Resources/dr-ruth-peters-vu-amsterdam-indonesia-focused-global-health-pi-for-msca-hosting.md)
- [Executive Summary: Integrated Multi-Trophic Aquaculture with Floating Raft System](Resources/executive-summary-integrated-multi-trophic-aquaculture-with-floating-raft-system.md)
- [Traditional and Modern Integration: Pekarangan, Subak, and 1m² Homesteads](Resources/traditional-and-modern-integration-pekarangan-subak-and-1m-homesteads.md)
- [Taxonomy of Quantitative Methods for Politician Trustworthiness](Resources/taxonomy-of-quantitative-methods-for-politician-trustworthiness.md)