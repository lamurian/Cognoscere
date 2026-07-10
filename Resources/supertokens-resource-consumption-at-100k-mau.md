---
title: SuperTokens Resource Consumption at 100k MAU
description: Estimated CPU, RAM, and storage requirements for self-hosted SuperTokens at 100,000 monthly active users.
author: pi
editor: lam
date: 2026-07-10T23:19:53.301Z
tags:
  - authentication
  - java
  - supertokens
  - open-source
  - performance
  - self-hosting
  - security
---
SuperTokens has a three-tier architecture with different resource profiles per tier. The Backend SDK (Node.js, Python, or Go) runs in your application process and verifies access tokens locally using cached JWKS signing keys — this is the key scaling advantage: session verification requires zero Core contact and scales linearly with application instances. The Core (Java with embedded Tomcat) handles authentication business logic: password hashing, JWT signing, session persistence, and token rotation. PostgreSQL is the sole supported database [@supertokensinc2026].

At 100,000 MAU, the Backend SDK adds negligible overhead (~10-20 MB per application instance) since token verification is a simple JWT validation with cached keys. The Core is the resource-intensive component. For 100k MAU with typical patterns, allocate 2-4 vCPUs and 2-4 GB RAM for the Core container. The Java runtime has a baseline ~300 MB heap + ~200 MB non-heap overhead. Password hashing (bcrypt) scales linearly with login volume — at 100k MAU with ~12-15 logins/second peak, 2 vCPU dedicated to hashing is sufficient. The Core is stateless, so horizontal scaling behind a load balancer is straightforward for higher loads. SuperTokens recommends PostgreSQL with at least 2 vCPU and 4 GB RAM for the database tier at this scale [@supertokensinc2026].

Storage: PostgreSQL user records at ~500 bytes/user (50 MB for 100k users) + session tokens (~200 bytes/session, estimated 200 MB for active sessions) + refresh token metadata + audit logs. Total database storage: 5-10 GB. Self-hosted option is free with unlimited users. SuperTokens' managed cloud pricing for 100k MAU is $99-299/month (startup discounts available). For self-hosting, a 2 vCPU / 4 GB RAM setup for Core + a 2 vCPU / 4 GB / 40 GB NVMe PostgreSQL instance (total ~EUR 15-20/month on Hetzner) comfortably handles 100k MAU. The architecture's key advantage: most requests never touch Core, so CPU scales primarily with login/refresh volume rather than total MAU [@danian2026].

## Relevant notes

- [SuperTokens: Open-Source Authentication Architecture](Resources/supertokens-open-source-authentication-architecture.md)
- [Casdoor Resource Consumption at 100k MAU](Resources/casdoor-resource-consumption-at-100k-mau.md)
- [Zitadel Resource Consumption at 100k MAU](Resources/zitadel-resource-consumption-at-100k-mau.md)
- [How SSH Works: Protocol, Key Exchange, and Authentication](Resources/how-ssh-works-protocol-key-exchange-and-authentication.md)
- [Open-Source Go Auth Services: Feature Comparison](Resources/open-source-go-auth-services-feature-comparison.md)