---
title: Zitadel Resource Consumption at 100k MAU
description: Estimated CPU, RAM, and storage requirements for self-hosted Zitadel at 100,000 monthly active users.
author: pi
editor: lam
date: 2026-07-10T23:19:53.300Z
tags:
  - authentication
  - golang
  - zitadel
  - open-source
  - performance
  - self-hosting
  - security
---
Zitadel is a Go-based identity platform built on an event-sourced architecture with PostgreSQL persistence. The event store is the core differentiator for resource consumption — every mutation is written as an immutable event, which increases storage I/O compared to CRUD-based systems but enables comprehensive audit trails without additional logging infrastructure. At idle, Zitadel consumes approximately 100-200 MB RAM with the Go runtime and cache warmup [@caosag2026].

At 100,000 MAU, Zitadel requires an estimated 2-4 vCPUs and 4-8 GB RAM. The event-sourced architecture adds ~30% storage overhead compared to CRUD systems because every state change is recorded as an event rather than in-place updates. However, this provides a complete audit trail out of the box without separate logging infrastructure. The gRPC API layer (HTTP/2 required) handles concurrent connections efficiently through Go's goroutine model. Password hashing (Zitadel uses bcrypt/argon2) is the primary CPU consumer during login peaks. At 100k MAU with ~12-15 logins/second peak, allocate 2 vCPU for hashing and 1 vCPU for API + event processing [@danian2026]. Zitadel's cache (Infinispan-compatible, in-memory) for sessions and realm data requires approximately 1-2 GB additional RAM.

Storage estimates: PostgreSQL database with event store requires approximately 100-200 MB base + ~50 MB per 10k users + ~100 MB per 10k sessions + event log storage (estimated 2-5 GB at 100k MAU with 90-day retention). Total storage recommendation: 40-80 GB NVMe SSD. A 4 vCPU / 8 GB RAM / 80 GB NVMe VPS (e.g., Hetzner CAX21 at ~EUR 11/month) is recommended for production at 100k MAU with headroom for traffic spikes. Zitadel supports horizontal scaling by adding read replicas for the PostgreSQL event store, though a single node handles 100k MAU comfortably [@caosag2026].

## Relevant notes

- [Casdoor Resource Consumption at 100k MAU](Resources/casdoor-resource-consumption-at-100k-mau.md)
- [SuperTokens Resource Consumption at 100k MAU](Resources/supertokens-resource-consumption-at-100k-mau.md)
- [Open-Source Go Auth Services: Feature Comparison](Resources/open-source-go-auth-services-feature-comparison.md)
- [SuperTokens: Open-Source Authentication Architecture](Resources/supertokens-open-source-authentication-architecture.md)
- [How SSH Works: Protocol, Key Exchange, and Authentication](Resources/how-ssh-works-protocol-key-exchange-and-authentication.md)