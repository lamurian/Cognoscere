---
title: When to Choose Go + HTMX + SQLite for SaaS
description: 'Decision framework for when Go+HTMX+SQLite stack suits SaaS: low-complexity CRUD, single-server, read-heavy workloads, prototyping, and indie-dev scenarios.'
author: pi
editor: lam
date: 2026-07-17T01:49:49.144Z
tags:
  - golang
  - htmx
  - sqlite
  - saas
  - architecture
  - performance
  - reference
  - best-practices
source: https://thunderhooks.com/blog/go-htmx-saas-stack
---
## Summary

The Go + HTMX + SQLite stack is a compelling choice for SaaS applications where operational simplicity, low cost, and performance for modest workloads matter more than horizontal scalability or high write concurrency. It pairs Go's single-binary deployment and fast compilation, HTMX's server-rendered interactivity without JavaScript frameworks, and SQLite's zero-configuration embedded database into a stack that eliminates entire categories of infrastructure complexity.

## When It Works Well

**Low-to-medium traffic websites.** The SQLite.org website itself handles 400K-500K HTTP requests per day with SQLite as the database engine, with load averages below 0.1 [@sqliteconsortium2025]. For most SaaS products still in the early-to-growth stage, this bandwidth is more than sufficient. The stack eliminates network round-trips between app and database, reducing read latency from ~1-3ms (typical for PostgreSQL over network) to ~0.01ms (local SQLite reads) [@carter2026].

**Read-heavy workloads (>90% reads).** Most SaaS applications are predominantly read-heavy. With WAL mode enabled, SQLite supports unlimited concurrent readers while a single writer operates, handling 100,000+ reads per second on modern NVMe hardware [@shayan2025]. This makes the stack ideal for dashboards, content management, monitoring tools, and API backends where reads dominate.

**Single-server deployments.** The stack thrives when app and database live on the same machine. There is no connection pool exhaustion, no network latency, no split-brain scenarios, no replication lag. Backups are a file copy. Deployment is a single binary plus a database file [@thunderhooksteam2026; @shayan2025]. The ThunderHooks SaaS (webhook capture, real-time streaming, uptime monitoring) runs this entire stack on a GCP e2-micro free-tier VM with zero monthly database cost [@thunderhooksteam2026].

**Database-per-tenant multi-tenancy.** For B2B SaaS with isolated tenants, SQLite per tenant provides physical data isolation, per-file backups, and instant tenant deletion (just rm the file). HelperX runs 200+ slot databases this way, each ~2.4MB after 90 days, with sub-millisecond query times and zero database management overhead [@helperx2026].

**Prototyping and indie development.** Four production SaaS products built on SQLite by a solo developer handle signups, API keys, usage tracking, and webhook captures on a single $48/month VPS. Total database ops: ~500/day against a comfortable range of ~100,000/day — operating at 0.5% capacity [@wenthe2026]. The stack eliminates frontend build tooling, database ops, and deployment complexity.

## When It Falls Short

Avoid this stack when the application requires high write concurrency (sustained >1,000 writes/second), multiple application servers writing to the same database, datasets exceeding ~1TB, or distributed transactions across services [@sqliteconsortium2025; @shayan2025; @carter2026]. Also unsuitable when complex client-side state management or offline-first requirements demand a native SPA framework rather than HTMX's server-rendered approach.

## Key Points

- Go+HTMX+SQLite excels for low-to-medium traffic, read-heavy, single-server SaaS applications
- SQLite's WAL mode enables unlimited concurrent readers and handles thousands of writes/second on modern hardware
- Database-per-tenant (one SQLite file per customer) provides physical isolation and zero-ops management
- The stack eliminates network latency, connection pooling, and database server management entirely
- Start with this stack for simplicity and low cost; migrate to PostgreSQL only when outgrown

## Relevant notes

- [SQLite Database Location in a Go+HTMX SaaS](Resources/sqlite-database-location-in-a-go-htmx-saas.md)
- [Auth Service Resource Consumption at 100k MAU: Executive Summary](Resources/auth-service-resource-consumption-at-100k-mau-executive-summary.md)
- [Cheapest Paid VPS Indonesia — Executive Summary and Recommendation for SaaS Production](Resources/cheapest-paid-vps-indonesia-executive-summary-and-recommendation-for-saas-production.md)
- [Open-Source Go Auth Services: Feature Comparison](Resources/open-source-go-auth-services-feature-comparison.md)
- [Scaling R Analytics to Production](Resources/scaling-r-analytics-to-production.md)