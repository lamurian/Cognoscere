---
title: 'HelperX: SQLite per-Tenant Architecture for Multi-Tenant SaaS'
description: Case study of HelperX — a multi-tenant SaaS running 200+ SQLite databases per tenant with sub-millisecond queries, zero database ops, and physical data isolation.
author: pi
editor: lam
date: 2026-07-17T02:56:47.034Z
tags:
  - sqlite
  - saas
  - case-study
  - architecture
  - multi-tenancy
  - performance
  - golang
source: https://dev.to/helperx/sqlite-in-production-why-we-chose-it-over-postgres-for-a-multi-tenant-saas-44n8
---
## Summary

HelperX is a multi-tenant SaaS that manages multiple X (Twitter) accounts. Each account is an isolated "slot" with its own configuration, auth tokens, audit logs, and operational state. Rather than a shared PostgreSQL database with `WHERE slot_id = ?` on every query, HelperX chose one SQLite database per slot [@helperx2026].

## The Architecture

After a year of production with 200+ active slots, the architecture uses a global SQLite database (`global.db`) for users, plans, and billing while each slot gets its own database file (`data/slots/{slot_id}.db`). The per-slot database has three tables: config (key-value settings), audit_log (action history), and queue (pending actions).

Connection pooling is not needed — each database connection is a file handle, not a network socket. A simple `Map` caches connections. Opening a SQLite database takes microseconds.

## Performance Reality After One Year

Read performance: config lookup at 0.02ms (vs 2-5ms with PostgreSQL over network), audit log query (last 24h) at 0.3ms, dashboard aggregation at 1.2ms. Write performance: single audit log insert at 0.05ms, batch insert (100 rows) at 2.1ms.

Storage: average slot database is 2.4MB after 90 days. Global database is 1.8MB. Total for 200 slots: ~480MB. Equivalent managed PostgreSQL would cost $20-50/month and add 2-5ms latency per query. The SQLite setup costs $0.

## Migrations Across 200+ Databases

Migrations run on database open — each slot migrates independently. If a migration fails on one slot, it doesn't affect others. The same approach that would lock a shared PostgreSQL table runs harmlessly across 200 databases in under 2 seconds.

## Key Takeaways

- Physical data isolation means no cross-tenant leaks, per-file backups, and instant tenant deletion (`rm slot_abc.db`)
- WAL mode with `synchronous=NORMAL` and `busy_timeout=5000` are critical PRAGMAs
- The pattern breaks when tenants need to query each other's data, multiple processes write concurrently, or databases exceed ~10GB
- Backups are filesystem-level snapshots of the `data/` directory
- No connection pool configuration needed

## Key Points

- SQLite per tenant provides physical isolation without the operational overhead of managing separate database servers
- Per-slot migration pattern means zero downtime and zero cross-tenant impact
- One year of production with 200+ databases and zero database management overhead confirms the pattern
- The tradeoffs (no concurrent writes, no replication, no network access) are acceptable for isolated per-tenant workloads
- Total storage for 200 tenants after 90 days: ~480MB — fits on any server

## Relevant notes

- [When to Choose Go + HTMX + SQLite for SaaS](Resources/when-to-choose-go-htmx-sqlite-for-saas.md)
- [QuietPulse: Solo Founder Choosing SQLite Over Postgres](Resources/quietpulse-solo-founder-choosing-sqlite-over-postgres.md)
- [ThunderHooks: Go+HTMX+SQLite SaaS on a Free-Tier VM](Resources/thunderhooks-go-htmx-sqlite-saas-on-a-free-tier-vm.md)
- [SQLite Database Location in a Go+HTMX SaaS](Resources/sqlite-database-location-in-a-go-htmx-saas.md)
- [Crawshaw: One-Process Programming with Go and SQLite](Resources/crawshaw-one-process-programming-with-go-and-sqlite.md)