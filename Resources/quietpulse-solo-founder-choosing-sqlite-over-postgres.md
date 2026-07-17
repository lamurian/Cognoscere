---
title: 'QuietPulse: Solo Founder Choosing SQLite Over Postgres'
description: Case study of QuietPulse — a solo founder's pragmatic decision to use SQLite for a cron job monitoring SaaS, optimising for current reality over imagined scale.
author: pi
editor: lam
date: 2026-07-17T02:56:47.042Z
tags:
  - sqlite
  - saas
  - case-study
  - indie-dev
  - startups
  - golang
source: https://www.indiehackers.com/post/why-i-chose-sqlite-for-a-saas-backend-975889e359
---
## Summary

QuietPulse is a small SaaS for cron job monitoring built by solo founder QuietPulse. The core data model is straightforward: users, monitored jobs, heartbeat events, alerts, billing state. The founder chose SQLite for production — not just for an MVP, but for the actual app — challenging the default assumption that every SaaS needs PostgreSQL from day one [@quietpulse2026].

## The Decision Framework

The decision was framed around five principles. First, less infrastructure matters more than theoretical scale — a solo founder should minimise moving parts before strong traction exists. Second, the workload is simple: no social network traffic, no analytics warehouse, no high-concurrency write patterns. Third, lower ops overhead outweighs future scale potential: fewer services means fewer things to break, fewer deployment headaches, less time debugging infrastructure. Fourth, SQLite is underestimated for small-to-medium founder-led SaaS products. Fifth, if SQLite becomes a bottleneck, that is good news — it means the product reached a stage where migration is justified [@quietpulse2026].

## The Escape Hatch

QuietPulse uses Prisma ORM, which means switching to PostgreSQL later is a configuration change, not a migration project. This reduces the risk of an early wrong database decision.

## When the Founder Would Choose Postgres Instead

The founder explicitly identifies cases where they would not choose SQLite: heavy concurrent writes from day one, a larger engineering team, complex reporting requirements, multi-tenant workloads with strong DB-level isolation needs, or obvious existing scale.

## Key Takeaways

- "Pick the simplest thing that is reliable for your current reality, not your fantasy architecture"
- ORM abstraction (Prisma) provides a migration path to PostgreSQL without handcuffing the architecture
- SQLite's reputation as a "toy" database is undeserved for many real SaaS workloads
- Optimising for fit over status is a valid engineering principle for early-stage products
- The conventional wisdom of "start with PostgreSQL" has an unstated cost: increased cognitive load and operational overhead during the critical early phase

## Key Points

- QuietPulse runs SQLite in production for a real SaaS product, not just a prototype
- The founder explicitly chose to optimise for current focus over imagined future scale
- Prisma ORM provides a low-friction migration path to PostgreSQL
- SQLite is sufficient for many small-to-medium SaaS products for much longer than commonly assumed
- The biggest risk is not outgrowing SQLite but adding complexity too early

## Relevant notes

- [When to Choose Go + HTMX + SQLite for SaaS](Resources/when-to-choose-go-htmx-sqlite-for-saas.md)
- [PropFirm: 50K Daily Visitors on a Single 47MB SQLite Database](Resources/propfirm-50k-daily-visitors-on-a-single-47mb-sqlite-database.md)
- [ThunderHooks: Go+HTMX+SQLite SaaS on a Free-Tier VM](Resources/thunderhooks-go-htmx-sqlite-saas-on-a-free-tier-vm.md)
- [Crawshaw: One-Process Programming with Go and SQLite](Resources/crawshaw-one-process-programming-with-go-and-sqlite.md)
- [HelperX: SQLite per-Tenant Architecture for Multi-Tenant SaaS](Resources/helperx-sqlite-per-tenant-architecture-for-multi-tenant-saas.md)