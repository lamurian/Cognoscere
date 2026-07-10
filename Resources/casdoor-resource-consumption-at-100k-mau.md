---
title: Casdoor Resource Consumption at 100k MAU
description: Estimated CPU, RAM, and storage requirements for self-hosted Casdoor at 100,000 monthly active users.
author: pi
editor: lam
date: 2026-07-10T23:19:53.276Z
tags:
  - authentication
  - golang
  - casdoor
  - open-source
  - performance
  - self-hosting
  - security
---
Casdoor is a Go-based (99.1%) IAM platform with a single-binary architecture, making it one of the most resource-efficient open-source auth services. At idle, Casdoor consumes approximately 100 MB RAM with minimal CPU usage. The Go runtime's goroutine-based concurrency model handles thousands of simultaneous auth requests efficiently without the per-thread overhead of Java-based alternatives [@casbin2026].

At 100,000 MAU with typical login patterns (5-10% daily active users, average 2-3 logins per session per day), Casdoor requires an estimated 1-2 vCPUs and 2-4 GB RAM. This estimate is derived from the Go runtime's memory profile (~100 MB baseline + ~50 MB per 10k active sessions + ~30 MB for Casbin policy evaluation cache). CPU is primarily consumed during password hashing (bcrypt/argon2 via Casdoor's provider abstraction), WebAuthn assertion verification, and OAuth token签发. A 2 vCPU configuration handles approximately 50-80 password-based logins/second, which exceeds the ~12-15 logins/second peak at 100k MAU [@danian2026].

Storage requirements depend on the database backend. With PostgreSQL or MySQL, user records consume approximately 500 bytes per user (~50 MB for 100k users). Session tokens, audit logs, and Casbin policy storage add roughly 200-500 MB depending on retention policy. For production at 100k MAU, allocate at least 20 GB NVMe SSD for the database, primarily for write-ahead log performance and index storage. Casdoor supports connection pooling and query caching to minimize database load. A single 2 vCPU / 4 GB RAM / 40 GB NVMe VPS (e.g., Hetzner CAX11 at EUR 5.99/month) comfortably hosts Casdoor with PostgreSQL for 100k MAU [@danian2026].

## Relevant notes

- [Zitadel Resource Consumption at 100k MAU](Resources/zitadel-resource-consumption-at-100k-mau.md)
- [SuperTokens Resource Consumption at 100k MAU](Resources/supertokens-resource-consumption-at-100k-mau.md)
- [Open-Source Go Auth Services: Feature Comparison](Resources/open-source-go-auth-services-feature-comparison.md)
- [SuperTokens: Open-Source Authentication Architecture](Resources/supertokens-open-source-authentication-architecture.md)
- [How SSH Works: Protocol, Key Exchange, and Authentication](Resources/how-ssh-works-protocol-key-exchange-and-authentication.md)