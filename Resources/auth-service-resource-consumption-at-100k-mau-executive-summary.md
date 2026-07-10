---
title: 'Auth Service Resource Consumption at 100k MAU: Executive Summary'
description: Executive summary comparing Casdoor, Zitadel, and SuperTokens resource consumption at 100,000 MAU with deployment recommendation.
author: pi
editor: lam
date: 2026-07-10T23:20:21.790Z
tags:
  - authentication
  - executive-summary
  - comparison
  - performance
  - self-hosting
  - golang
  - java
  - supertokens
  - casdoor
  - zitadel
---
## Resource Comparison at 100k MAU

This executive summary compares estimated resource consumption for self-hosted Casdoor, Zitadel, and SuperTokens at 100k MAU. All three support passwordless login, passkey/WebAuthn, M2M auth, and multi-role RBAC. Data synthesizes official documentation, community benchmarks, and architectural analysis [@danian2026; @casbin2026; @caosag2026; @supertokensinc2026]. At this scale, all three run comfortably on a single Hetzner CAX-series VPS (EUR 6-20/month), dramatically cheaper than managed alternatives (Auth0 $700-900+/month, Okta $3,000+/month) [@danian2026].

| Resource | Casdoor | Zitadel | SuperTokens |
|---|---|---|---|
| Language | Go (99.1%) | Go (75.8%) | Java Core + SDK |
| Architecture | Single service | Single service (event-sourced) | 3-tier (Core + SDK + DB) |
| vCPU | 1-2 | 2-4 | 2-4 (Core) + 2 (DB) |
| RAM | 2-4 GB | 4-8 GB | 2-4 GB (Core) + 4 GB (DB) |
| Storage | 20-40 GB NVMe | 40-80 GB NVMe | 20-40 GB NVMe |
| Idle RAM | ~100 MB | ~100-200 MB | ~500 MB (Core JVM) |
| Monthly VPS Cost | ~EUR 6 | ~EUR 11 | ~EUR 15-20 |
| Horizontal Scaling | DB replicas | Event store replicas | Stateless Core (easiest) |
| DB | MySQL/PG/SQLite/SQL Server | PostgreSQL 14+ | PostgreSQL 13+ |
| License | Apache 2.0 | AGPL-3.0 | Apache 2.0 |

Casdoor is the most resource-efficient. Its single Go binary with Casbin runs on 2 vCPU / 4 GB RAM at 100k MAU. At ~EUR 6/month on Hetzner CAX11, it is the cheapest. Its RBAC (ACL, RBAC, ABAC via Casbin) requires learning Casbin's policy language, but the resource footprint is the leanest among all three [@casbin2026]. Zitadel requires more resources due to its event-sourced architecture, which adds ~30% storage overhead for immutable event logs but provides a comprehensive, API-accessible audit trail without separate infrastructure. It needs 4 vCPU / 8 GB RAM for headroom at 100k MAU (~EUR 11/month). Native unlimited multi-tenancy makes it the strongest for B2B SaaS. The AGPL-3.0 license requires consideration if modifications are distributed as a service [@caosag2026]. SuperTokens has a split cost profile: the Backend SDK adds ~10-20 MB per app instance, while the Java Core requires 2-4 vCPU / 2-4 GB RAM plus a separate 2 vCPU / 4 GB PostgreSQL instance (~EUR 15-20/month total). Most request paths never touch Core — session verification happens entirely in the SDK — so CPU scales with login volume, not total MAU. The rotating refresh tokens with theft detection are a unique security advantage [@supertokensinc2026].

Recommendation: choose **Casdoor** for minimal infrastructure cost if you are comfortable with Casbin policies. Choose **Zitadel** for native multi-tenancy and built-in audit trails for compliance. Choose **SuperTokens** if rotating refresh tokens with theft detection are critical and you already run a Node.js/Python/Go backend where SDK integration is natural.

## Relevant notes

- [Casdoor Resource Consumption at 100k MAU](Resources/casdoor-resource-consumption-at-100k-mau.md)
- [SuperTokens Resource Consumption at 100k MAU](Resources/supertokens-resource-consumption-at-100k-mau.md)
- [Zitadel Resource Consumption at 100k MAU](Resources/zitadel-resource-consumption-at-100k-mau.md)
- [Open-Source Go Auth Services: Feature Comparison](Resources/open-source-go-auth-services-feature-comparison.md)
- [SuperTokens: Open-Source Authentication Architecture](Resources/supertokens-open-source-authentication-architecture.md)