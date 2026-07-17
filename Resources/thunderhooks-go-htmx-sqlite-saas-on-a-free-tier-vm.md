---
title: 'ThunderHooks: Go+HTMX+SQLite SaaS on a Free-Tier VM'
description: Case study of ThunderHooks — a SaaS for webhook capture, uptime monitoring, and status pages built with Go, HTMX, Alpine.js, and SQLite on a GCP e2-micro free-tier VM.
author: pi
editor: lam
date: 2026-07-17T02:56:47.033Z
tags:
  - golang
  - htmx
  - sqlite
  - saas
  - case-study
  - architecture
  - performance
  - indie-dev
source: https://thunderhooks.com/blog/go-htmx-saas-stack
---
## Summary

ThunderHooks is a SaaS platform for webhook capture, real-time streaming, uptime monitoring, heartbeat checks, API testing, and public status pages. It runs entirely on Go, HTMX, Alpine.js, and SQLite — deployed as a single binary on a GCP e2-micro free-tier VM with zero monthly database cost [@thunderhooksteam2026].

## Stack and Architecture

The backend uses Go 1.24 with the Echo framework, compiled to a single binary with no runtime dependencies. Templ provides type-safe HTML components that compile to Go functions — a compile-time failure if you pass the wrong type. HTMX handles all AJAX interactions via HTML attributes (no JavaScript framework). Alpine.js manages the small pockets of client-side state (toggle menus, modals). SQLite via Turso serves as the database [@thunderhooksteam2026].

Total frontend JavaScript written by hand: 212 lines. That includes CSRF token injection, toast notifications, and SSE connection management. The dashboard loads in under 200ms and weighs less than most React app's JavaScript bundle alone.

## Performance and Scalability

ThunderHooks runs on a GCP e2-micro free-tier VM — 2 vCPU (burst), 1 GB RAM. The database is a single SQLite file that backs up via file copy. Real-time features use Server-Sent Events (native browser API, no WebSocket complexity).

Beyond the free-tier VM, the stack can scale vertically to larger instances. SQLite can handle 400K-500K HTTP requests per day (as proven by SQLite.org itself) with load averages below 0.1. For most SaaS products in early-to-growth stages, this is more than sufficient.

## Key Takeaways

- Zero database infrastructure cost — no separate DB server, no connection pooling, no network latency
- 212 lines of JavaScript total for a full SaaS product
- Templ provides compile-time safety for HTML templates
- SSE over WebSockets for real-time features reduces complexity
- Single binary deployment eliminates configuration drift
- The complexity ceiling is real: once you need multi-server writes or complex client-side state, HTMX hits limits

## Key Points

- ThunderHooks proves a commercially viable SaaS can run on a free GCP e2-micro VM with SQLite
- Templ + HTMX eliminates the frontend build pipeline entirely
- SSE is simpler than WebSockets for real-time SaaS features
- Per-request CSP nonce is practical with server-rendered Templ components
- The stack is ideal for monitoring, dashboard, and CRUD-heavy SaaS products
- Migrating to PostgreSQL later is possible when the stack is outgrown

## Relevant notes

- [When to Choose Go + HTMX + SQLite for SaaS](Resources/when-to-choose-go-htmx-sqlite-for-saas.md)
- [Crawshaw: One-Process Programming with Go and SQLite](Resources/crawshaw-one-process-programming-with-go-and-sqlite.md)
- [Congo: Go+HTMX+LibSQL Framework for Boring Production](Resources/congo-go-htmx-libsql-framework-for-boring-production.md)
- [QuietPulse: Solo Founder Choosing SQLite Over Postgres](Resources/quietpulse-solo-founder-choosing-sqlite-over-postgres.md)
- [SQLite Database Location in a Go+HTMX SaaS](Resources/sqlite-database-location-in-a-go-htmx-saas.md)