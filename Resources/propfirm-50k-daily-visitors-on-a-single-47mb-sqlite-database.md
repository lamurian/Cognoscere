---
title: 'PropFirm: 50K Daily Visitors on a Single 47MB SQLite Database'
description: Case study of PropFirm — a trading comparison site handling 50K+ daily visitors with a single 47MB SQLite database, 98/2 read-write ratio, sub-millisecond queries.
author: pi
editor: lam
date: 2026-07-17T02:56:47.044Z
tags:
  - sqlite
  - case-study
  - performance
  - scalability
  - saas
  - benchmarks
source: https://daily.dev/blog/sqlite-production-guide-when-how-to-use-beyond-prototyping
---
## Summary

PropFirm is a trading comparison website built by indie developer Pieter Levels (known for his portfolio of solo-built SaaS products). Within three months of launch, it achieved 50,000+ daily visitors using a single SQLite .db file stored on disk — with no external database process, no connection pooling, and no database server management [@carter2026; @pockit2026].

## The Numbers

The database is 47MB in size with a 98/2 read-write ratio. With WAL mode and memory mapping enabled, the database delivers sub-millisecond query times despite serving 50K daily visitors. This performance is consistent with SQLite's documented capabilities on modern NVMe hardware: 100,000+ reads per second and 10,000-50,000 writes per second in WAL mode [@carter2026].

## Context: Pieter Levels' Approach

Levels is known for running multiple production SaaS products on a single $48/month VPS. His stack involves SQLite for each product's database, handling signups, API keys, usage tracking, and webhook captures. His total database operations across all four products: ~500/day against a comfortable range of ~100,000/day — operating at 0.5% capacity [@carter2026].

This is a recurring pattern in the indie SaaS world: a solo developer's total traffic across all products fits comfortably within what a single SQLite database can handle, with 99.5% headroom.

## Key Takeaways

- 50K daily visitors on a 47MB SQLite database is a real-world existence proof against "SQLite isn't for production"
- Read-heavy workloads (98/2 ratio) are SQLite's sweet spot
- The database file fits entirely in RAM cache on any modern server
- No separate database server means zero database ops cost
- Multiple SaaS products from one solo developer collectively use 0.5% of SQLite's capacity
- The SQLite.org website handles 400K-500K requests/day — SQLite's upper ceiling is far above what most SaaS products need

## Key Points

- PropFirm demonstrates SQLite can handle 50,000+ daily active visitors with sub-millisecond queries
- A 47MB database is trivially cacheable in server RAM
- Pieter Levels runs multiple SQLite-backed SaaS products on a single $48/month VPS at 0.5% capacity
- The read-heavy SaaS profile is far more common than write-heavy profiles
- When you outgrow SQLite (typically at 1TB+ or multi-server writes), PostgreSQL migration is a well-understood path
- Many SaaS products never reach SQLite's scaling limits before reaching product-market fit

## Relevant notes

- [ThunderHooks: Go+HTMX+SQLite SaaS on a Free-Tier VM](Resources/thunderhooks-go-htmx-sqlite-saas-on-a-free-tier-vm.md)
- [Crawshaw: One-Process Programming with Go and SQLite](Resources/crawshaw-one-process-programming-with-go-and-sqlite.md)
- [When to Choose Go + HTMX + SQLite for SaaS](Resources/when-to-choose-go-htmx-sqlite-for-saas.md)
- [HelperX: SQLite per-Tenant Architecture for Multi-Tenant SaaS](Resources/helperx-sqlite-per-tenant-architecture-for-multi-tenant-saas.md)
- [QuietPulse: Solo Founder Choosing SQLite Over Postgres](Resources/quietpulse-solo-founder-choosing-sqlite-over-postgres.md)