---
title: Herza Cloud VPS — User Sentiment and Reviews
description: Real-world user reviews, community sentiment, and pain points for Herza Cloud VPS Indonesia
author: pi
editor: lam
date: 2026-06-10T16:50:55.294Z
tags:
  - vps
  - cloud-computing
  - self-hosting
  - indonesia
  - budget
  - user-sentiment
  - review
---

## Overview

Herza Cloud (PT Herza Digital Indonesia) is an Indonesian cloud and hosting provider operating since 2019 with data centers across Jakarta, Depok, and Surabaya. User sentiment is mixed — the provider has a niche following for specific use cases (MikroTik, VPN tunneling, forex VPS) but receives less attention for general-purpose VPS hosting. Based on reviews from hostings.info, diskusiwebhosting forum threads, and jokowa.id monitoring.

## What Users Love

**Geographic diversity** is Herza's strongest selling point. Users appreciate having 6 availability zones in Indonesia (4 in Jakarta, 1 in Depok, 1 in Surabaya) plus international regions. This is unique among budget Indonesia VPS providers.

**DDoS protection at the physical layer** (via RETN Singapore, not GRE tunnel) is valued by users who need anti-DDoS for gaming or high-traffic services.

**MikroTik CHR support** is a specific niche where Herza is well-regarded. Users deploying router OS instances on VPS report good performance. One forum user noted: "saat mendeploy vps mikrotik di herza kami tidak mengalami masalah apapun."

**Tier-4 data center option** (DCI Bekasi) is appreciated by users who need maximum uptime guarantees.

## The Major Pain Points

**1. Older Hardware.** The VPS nodes use Intel Xeon E5-2697 v2 processors from 2013. Users running modern workloads report significantly lower performance compared to providers using Xeon Platinum or AMD EPYC.

**2. SATA SSD, Not NVMe.** The budget plans use SATA SSD storage, not NVMe. Users with database-heavy applications report I/O bottlenecks.

**3. Mixed Support Quality.** Forum discussions on diskusiwebhosting reveal inconsistent support experiences. Some users report helpful technical assistance, while others describe slow resolution times.

**4. Provider Backup Disputes.** A forum thread discussed backup responsibility — Herza's position is that backups are the client's responsibility for unmanaged VPS, which is standard but some users expected provider-managed backups.

**5. Limited Community and Reviews.** Herza has fewer independent reviews and benchmarks compared to Biznet Gio, DomaiNesia, or Nevacloud. The hostings.info score is neutral.

## Sentiment by Platform

- **Hostings.info:** Neutral rating. Test results show average uptime and speed. No standout performance metrics.
- **DiskusiWebHosting (forum):** Mixed. Lengthy discussion threads with both positive and negative experiences. Backup responsibility and support quality are recurring topics.
- **Jokowa.id monitoring:** 19-month monitoring period (2023-2024). Results showed acceptable uptime but nothing exceptional.
- **VPSISP (Chinese review site):** Technical benchmark showed moderate performance. Suitable for general purposes but not performance-critical workloads.

## Estimated Score Breakdown

| Category | Score |
|----------|-------|
| Performance | 6.0/10 |
| Network Quality | 7.0/10 |
| Ease of Use | 6.5/10 |
| Pricing/Value | 7.0/10 |
| Features | 7.5/10 |
| Support | 6.0/10 |
| Reliability | 6.5/10 |

## Common Praise Themes

- "Multiple data center zones across Indonesia."
- "Physical-layer DDoS protection."
- "Good for MikroTik CHR and VPN."
- "Tier-4 data center option available."

## Common Complaint Themes

- "Old CPU (2013-era Xeon E5)."
- "SATA SSD is slow for modern applications."
- "Support quality is inconsistent."
- "Fewer independent reviews than competitors."

## Verdict

Herza Cloud fills specific niches (MikroTik, anti-DDoS, multi-zone deployments) but does not lead in general-purpose VPS value. The 2013-era processors and SATA SSD make it a poor choice for performance-sensitive workloads. The multi-zone availability is genuinely unique and valuable for specific HA architectures. For general-purpose VPS, DomaiNesia or Nevacloud offer better performance at similar prices.

## Relevant notes

- [[herza-cloud-vps-indonesia-budget-vps-with-multiple-data-center-zones]]
- [[cheapest-paid-vps-indonesia-executive-summary-and-recommendation-for-saas-production]]