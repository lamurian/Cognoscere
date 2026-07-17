---
title: SQLite Database Location in a Go+HTMX SaaS
description: Clarifies SQLite is stored server-side as a local file managed by the Go process, not client-side. Mentions client-side SQLite via WASM as a separate pattern.
author: pi
editor: lam
date: 2026-07-17T01:49:49.145Z
tags:
  - sqlite
  - golang
  - architecture
  - deployment
  - infrastructure
  - server
  - reference
source: https://sqlite.org/whentouse.html
---
## Summary

In a Go + HTMX SaaS architecture, the SQLite database is always stored server-side — on the same machine where the Go application process runs. The database is a single `.db` file on the server's local filesystem, managed directly by the Go process via an embedded SQLite library (e.g., `modernc.org/sqlite` for pure Go, or `mattn/go-sqlite3` via CGO). This is fundamentally different from client-server databases (PostgreSQL, MySQL) where a separate server process manages the data and the application connects over the network.

## Server-Side Only

SQLite is an embedded, in-process database engine. It is not a standalone server. When your Go application opens a SQLite database, it reads and writes directly to a file on disk using OS-level file I/O. There is no network listener, no TCP port, no separate database process [@sqliteconsortium2025]. The Go binary and the SQLite database file live side-by-side on the same server.

In practice, the database file is placed in a persistent data directory mounted to the server:

```
/app/
├── go-app-binary       # compiled Go application
├── data/
│   └── app.db          # SQLite database file
└── config/
    └── config.yaml
```

In Docker deployments, this is typically handled via a mounted volume:

```yaml
services:
  app:
    build: .
    volumes:
      - ./data:/app/data
```

The Go process opens the database on startup and performs CRUD operations through the SQLite library directly — no network calls, no connection pooling, sub-millisecond reads [@thunderhooksteam2026; @helperx2026].

## Not Client-Side

The browser does not access the SQLite file. The browser communicates with the Go server via HTTP requests. HTMX sends AJAX-style requests from the browser to the server; the server queries SQLite on the server's filesystem, renders HTML (or partials), and sends the response back to the browser. The browser never touches the database file.

```
[Browser/HTMX] ←→ HTTP/SSE ←→ [Go Server + SQLite .db file]
                                         (same server, local file)
```

This is critical to understand: SQLite in a Go+HTMX SaaS is not "client-side" in the traditional web sense. It is server-side embedded storage, not a client-side cache or a browser-side database (like IndexedDB or OPFS-backed SQLite via WebAssembly).

## The WebAssembly Exception

There is a separate pattern where SQLite runs in the browser via WebAssembly (`sql.js` or `wa-sqlite`). This is a fundamentally different architecture: the database file lives entirely in the browser's memory (potentially backed by the Origin Private File System for persistence). This pattern is used for local-first applications and offline tools, not for multi-user SaaS. In the standard Go+HTMX SaaS model, the database is always server-side.

## Key Points

- SQLite database file lives on the server's local filesystem alongside the Go binary
- Go process embeds SQLite as a library, accessing the database via direct file I/O
- Browser never accesses the database file — communication is via HTTP/SSE with the Go server
- No separate database server process, no network port, no connection pooling needed
- Client-side SQLite (via WASM in browser) is a different architectural pattern for local-first apps, not multi-user SaaS

## Relevant notes

- [When to Choose Go + HTMX + SQLite for SaaS](Resources/when-to-choose-go-htmx-sqlite-for-saas.md)
- [Auth Service Resource Consumption at 100k MAU: Executive Summary](Resources/auth-service-resource-consumption-at-100k-mau-executive-summary.md)
- [Pi-Hole Hardware Planning and Resource Allocation](Resources/pi-hole-hardware-planning-and-resource-allocation.md)
- [Cheapest Paid VPS Indonesia — Executive Summary and Recommendation for SaaS Production](Resources/cheapest-paid-vps-indonesia-executive-summary-and-recommendation-for-saas-production.md)
- [Nevacloud Nevalite NVMe VPS — Cheapest Indonesia-Based VPS](Resources/nevacloud-nevalite-nvme-vps-cheapest-indonesia-based-vps.md)