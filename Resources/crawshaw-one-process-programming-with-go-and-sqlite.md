---
title: 'Crawshaw: One-Process Programming with Go and SQLite'
description: "Case study of David Crawshaw's one-process programming model: a single VM, a single Go binary, and SQLite handling 5-6K concurrent requests for an indie SaaS."
author: pi
editor: lam
date: 2026-07-17T02:56:47.043Z
tags:
  - golang
  - sqlite
  - case-study
  - architecture
  - performance
  - scalability
  - indie-dev
source: https://crawshaw.io/blog/one-process-programming-notes
---
## Summary

David Crawshaw, a former Google engineer, published a landmark exploration of "one-process programming" — running a complete SaaS backend as a single Go binary with SQLite on a single VM. The model eschews distributed systems entirely: 1 VM, 1 availability zone, 1 process [@crawshaw2018].

## The Architecture

The service runs on a single AWS VM with three EBS volumes: one for OS, logs, and ephemeral data; one for the primary SQLite database; one for customer sync databases. Periodic snapshot backups to S3 provide disaster recovery. The deployment script is ten lines long. Performance tuning uses pprof. On a medium VM, the system handles 5,000-6,000 concurrent requests. On the largest AWS instance, tens of thousands [@crawshaw2018].

## SQLite in the Cloud

Crawshaw uses two critical SQLite features for server-side concurrency. Shared cache mode allows one large pool of memory for the database page cache across many concurrent connections. Write-Ahead Logging (WAL) allows readers to work concurrently with the writer. He also overrides default WAL flush settings and executes flushes manually — triggering an S3 snapshot on completion.

The incremental blob API allows reading and writing fields of bytes without storing all bytes in memory simultaneously. This matters when each request may work with hundreds of megabytes while supporting tens of thousands of potential concurrent requests.

## The Scaling Argument

Crawshaw's central claim: "Don't use N computers when 1 will do." Most services fit on one computer up to a point. The best server from AWS in 2018: 128 CPU threads, 4TB RAM, 25 Gbit ethernet. If you are building a small business, most products can grow and become profitable well under this limit for years. When you hit the limit, you have revenue to hire engineers who can rewrite the service for distributed deployment.

## Key Takeaways

- One-process programming eliminates an entire class of distributed systems complexity (consensus, replication, coordination)
- SQLite's shared cache + WAL mode enables concurrent access patterns suitable for server workloads
- Nested transactions via SAVEPOINT/RELEASE enable composable, transactional code
- The session extension enables client sync: collect changes as patchsets, upload to server, apply to backup
- 5,000-6,000 concurrent requests on a medium VM proves SQLite is production-capable for real SaaS traffic
- The limiting factor is write concurrency, not read throughput

## Key Points

- A single Go binary + SQLite handles 5-6K concurrent requests on a medium VM
- Deployment: one ten-line script, no container orchestration needed
- Backup: EBS snapshots + custom SQLite WAL flush triggering S3 upload
- Session extension enables client-side sync: changeset patchsets uploaded to server
- SAVEPOINT/RELEASE pattern provides composable nested SQL transactions in Go
- When you outgrow one VM, you have revenue to hire and rewrite
- This 2018 model anticipated the 2025-2026 SQLite renaissance by 7+ years

## Relevant notes

- [ThunderHooks: Go+HTMX+SQLite SaaS on a Free-Tier VM](Resources/thunderhooks-go-htmx-sqlite-saas-on-a-free-tier-vm.md)
- [When to Choose Go + HTMX + SQLite for SaaS](Resources/when-to-choose-go-htmx-sqlite-for-saas.md)
- [QuietPulse: Solo Founder Choosing SQLite Over Postgres](Resources/quietpulse-solo-founder-choosing-sqlite-over-postgres.md)
- [PropFirm: 50K Daily Visitors on a Single 47MB SQLite Database](Resources/propfirm-50k-daily-visitors-on-a-single-47mb-sqlite-database.md)
- [Congo: Go+HTMX+LibSQL Framework for Boring Production](Resources/congo-go-htmx-libsql-framework-for-boring-production.md)