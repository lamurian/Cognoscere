---
title: 'Congo: Go+HTMX+LibSQL Framework for Boring Production'
description: Case study of Congo — a Go web framework built on HTMX, SQLite via LibSQL, and the philosophy that boring, proven technology wins in production.
author: pi
editor: lam
date: 2026-07-17T02:56:47.043Z
tags:
  - golang
  - htmx
  - sqlite
  - case-study
  - architecture
  - framework
  - performance
source: https://news.congo.gg/posts/why-go-htmx-and-sqlite
---
## Summary

Congo is a Go web framework that makes deliberate technology bets: Go compiles to a single binary with no runtime or VM, HTMX provides server-rendered interactivity without a JavaScript build pipeline, and SQLite via LibSQL provides embedded database with optional remote replication [@mccutcheon2026].

## The Stack Philosophy

Congo's philosophy is that technology choices should be boring, proven, and small. Go is 15 years old, SQLite is 25 years old, HTML is 30 years old. The framework picks technology that will still work in 10 years — not technology that is exciting this month. This aligns with the broader shift toward minimal stacks for production systems where operational simplicity matters more than novelty [@mccutcheon2026].

## LibSQL for Production

Congo uses LibSQL for production, which adds remote replication to SQLite. The key pattern: local reads at nanosecond speed, writes go to a primary server. The application starts with an in-memory database for development, switches to a file for local production, switches to a remote replica for distributed systems — same code, same ORM, same API. This progressive deployment model is a significant architectural advantage over traditional client-server databases [@mccutcheon2026].

## HTMX and React Islands

Congo acknowledges that some features need rich interactivity (code editors, drag-and-drop, charts). For those cases, it supports React island components that mount into server-rendered pages. This hybrid approach gets the benefits of both server-rendered simplicity and client-side power without committing fully to either paradigm.

## Key Takeaways

- LibSQL solves SQLite's replication and network access limitations while preserving schema compatibility
- Progressive deployment: in-memory → local file → remote replica without code changes
- HTMX handles 90% of web app interactivity; reserved React islands handle the remaining 10%
- The "boring technology" thesis argues that operational longevity is more valuable than cutting-edge features
- DaisyUI components on Tailwind provide semantic naming (``btn btn-primary``) for faster development

## Key Points

- Congo proves that a production framework can be built entirely on Go + HTMX + SQLite
- LibSQL's embedded replicas solve the read latency problem: local reads at 0.01ms with remote write durability
- React islands for complex interactivity avoid HTMX's complexity ceiling without full SPA commitment
- The framework embeds all templates and static files into the binary via Go's `embed` package
- CLI (`congo init`) extracts the framework source into a new project for offline bootstrapping
- Congo's philosophy directly challenges the assumption that modern SaaS needs a SPA framework and a separate database server

## Relevant notes

- [ThunderHooks: Go+HTMX+SQLite SaaS on a Free-Tier VM](Resources/thunderhooks-go-htmx-sqlite-saas-on-a-free-tier-vm.md)
- [When to Choose Go + HTMX + SQLite for SaaS](Resources/when-to-choose-go-htmx-sqlite-for-saas.md)
- [SQLite Database Location in a Go+HTMX SaaS](Resources/sqlite-database-location-in-a-go-htmx-saas.md)
- [QuietPulse: Solo Founder Choosing SQLite Over Postgres](Resources/quietpulse-solo-founder-choosing-sqlite-over-postgres.md)
- [HelperX: SQLite per-Tenant Architecture for Multi-Tenant SaaS](Resources/helperx-sqlite-per-tenant-architecture-for-multi-tenant-saas.md)