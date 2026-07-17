---
title: localStorage vs IndexedDB vs SQLite WASM for Browser Storage in SaaS
description: 'Comprehensive comparison of localStorage, IndexedDB, and client-side SQLite (WASM+OPFS) for browser-side local storage in SaaS: pros, cons, indications, and contraindications.'
author: pi
editor: lam
date: 2026-07-17T02:27:00.252Z
tags:
  - sqlite
  - indexeddb
  - localstorage
  - browser
  - offline
  - architecture
  - saas
  - reference
  - comparison
  - performance
---
## Summary

For a SaaS application that needs local storage in the browser, three primary options exist, ordered by increasing capability and complexity: localStorage, IndexedDB, and SQLite via WebAssembly (WASM+OPFS). Each has distinct capacity limits, query capabilities, persistence guarantees, and performance characteristics. The right choice depends on data volume, query complexity needs, offline requirements, and target browser support.

## Comparison Overview

| Dimension | localStorage | IndexedDB | SQLite WASM + OPFS |
|---|---|---|---|
| Capacity | ~5-10 MB | Up to ~80% of disk | Up to ~80% of disk (via OPFS) |
| API style | Synchronous, string-only | Async, event/Promise-based | Sync (in Worker), SQL queries |
| Query power | None (filter in JS) | Index lookups, range scans | Full SQL: JOINs, GROUP BY, FTS, window functions |
| Data types | Strings only | Any JS object, Blob, ArrayBuffer | SQL types + JSON via text column |
| Persistence | Automatic, persistent | Automatic, persistent | Via OPFS (requires Worker), or manual serialization |
| Initialization | Instant | ~46ms open DB | ~500ms WASM compile + Worker startup |
| Read latency (single) | ~0.005ms | ~0.1ms | ~0.45ms (memory) / ~3ms (persisted) |
| Write latency (single) | ~0.017ms | ~0.17ms | ~0.17ms (memory) / ~3ms (persisted) |
| Bulk write (200 items) | ~5.8ms | ~13.4ms | ~19ms (memory) / ~37ms (persisted) |
| Browser support | All | All modern | Chrome 108+, Safari 16.4+, Firefox 111+ |
| Multi-tab sync | Storage event | Manual (BroadcastChannel) | Manual (BroadcastChannel) |
| Worker support | No | Yes | Yes (required for OPFS sync handles) |

Benchmark data from RxDB performance tests on Chrome 128 [@rxdb2024].

## localStorage

### Pros
- Simplest API in the browser — `setItem`/`getItem`, zero setup
- Fastest single read/write latency (~0.005-0.017ms)
- Instant initialization, no async setup needed
- Built-in cross-tab change notification via `storage` event
- Universal browser support

### Cons
- Strict 5-10 MB capacity cap
- Synchronous API blocks the main thread
- Strings only — every object requires `JSON.stringify`/`parse`
- No query capability — every read deserializes the entire dataset
- Cannot be used in Web Workers [@recca2026]

### Indications
- Small configuration values, user preferences, theme toggles
- Session tokens or lightweight flags (under ~100KB)
- Feature flag cache for non-critical UI toggles
- Any data where total size stays well under 5 MB [@recca2026; @godwin2025]

### Contraindications
- Any user-generated content, documents, or records
- Offline-first app data that must survive session boundaries
- Datasets requiring queries, filters, or aggregations
- Data exceeding 1 MB — performance degrades due to full serialization per read
- Binary data such as images or uploads

## IndexedDB

### Pros
- Large capacity (up to 80% of disk, gigabytes possible)
- Asynchronous, non-blocking API
- Native support for JavaScript objects, Blobs, and ArrayBuffers
- Indexes and range scans for efficient data access
- ACID-compliant transactions
- Built into every modern browser — no extra dependency
- Works in Web Workers [@duran2026; @godwin2025]

### Cons
- Verbose, callback-heavy native API (mitigated by wrappers like `idb`)
- No JOINs, aggregation, GROUP BY, or full-text search — complex queries require JS iteration
- Schema changes require careful versioned migrations in `onupgradeneeded`
- Transaction model has pitfalls: auto-commits on idle, async gaps can silently fail writes
- Cross-tab change detection requires manual BroadcastChannel or SharedWorker
- Performance varies significantly between browsers (Safari is notably slower for blob storage) [@duran2026]
- Bulk write is ~2-3x slower than localStorage for small datasets [@rxdb2024]

### Indications
- Primary browser database for conventional offline-first apps
- Storing user-generated content, documents, and records
- Large object sets that need index-based lookups
- Offline data caches that sync with a server
- Binary data storage (photos, files) alongside metadata
- Cross-session persistence for complex application state [@godwin2025]

### Contraindications
- Complex relational queries with JOINs and aggregations
- Full-text search across document collections
- Simple key-value data under 5 MB (localStorage is simpler and faster)
- Applications where complex SQL queries are a core feature
- Simple preferences or tokens that localStorage can handle

## SQLite WASM + OPFS

### Pros
- Full SQL query capability: JOINs, GROUP BY, aggregations, window functions, subqueries
- Built-in full-text search via FTS5
- In-memory queries run at WASM speed — aggregate queries can be 100x faster than IndexedDB equivalent
- ACID-compliant atomic transactions
- SQLite file format is portable and well-understood
- Growing ecosystem: wa-sqlite, official sqlite-wasm, PowerSync, SQLocal
- Privacy-friendly: data stays on device, no server required for reads [@duran2026; @recca2026]

### Cons
- ~500ms initialization time (WASM download, compile, Worker startup)
- Requires dedicated Web Worker for synchronous OPFS access — adds architectural complexity
- ~400KB gzipped bundle size
- Limited browser support: Chrome 108+, Safari 16.4+, Firefox 111+
- OPFS has quirks: Safari incognito does not support OPFS, Safari has 7-day eviction policy
- Manual persistence management: either serialize to/from IndexedDB (sql.js pattern) or use OPFS (requires Worker)
- Cross-tab concurrency is complex — most VFS implementations support only single-connection access
- Aggregate query results must be converted from WASM-side representation to JS objects, which adds overhead for large result sets [@recca2026; @kistner2025]

### Indications
- Complex client-side analytics or reporting that needs SQL queries
- Local-first apps with offline support and background sync
- Applications requiring full-text search on the client
- Mobile field apps (e.g., inspection tools, inventory) where complex queries run on device
- Privacy-sensitive apps where data should never leave the device unencrypted
- Migrating existing SQLite-powered desktop/mobile apps to the web [@duran2026; @pawar2026]

### Contraindications
- Simple key-value storage under 5 MB (overkill)
- Target audience uses older browsers (Safari <16.4, older Chrome/Firefox)
- App initialization time is critical and 500ms overhead is unacceptable
- Bundle size is constrained and 400KB addition is too costly
- Simple CRUD with IndexedDB-level queries suffices
- No offline or complex query needs

## Decision Framework

```
Q1: Total data < 5 MB AND simple key-value pairs?
  → YES → localStorage
  → NO  → Q2

Q2: Need SQL queries (JOINs, GROUP BY, FTS)?
  → YES → SQLite WASM + OPFS
  → NO  → Q3

Q3: Target browsers include Safari <16.4 or need instant init?
  → YES → IndexedDB
  → NO  → SQLite WASM + OPFS (if complex queries needed)
        → IndexedDB (if simple queries suffice)

Q4: Working with binary data (Blobs, images)?
  → Use OPFS directly for files, IndexedDB or SQLite for metadata

Best practice: use the simplest option that meets your needs. 
Most SaaS apps should start with IndexedDB and upgrade to SQLite WASM 
only when query complexity demands it [@recca2026; @duran2026].
```

## Key Points

- **localStorage**: simple, fast for small data (<5MB, key-value), synchronous, blocks main thread. Use for preferences and tokens only.
- **IndexedDB**: the workhorse browser database. Large capacity, async, indexes, transactions. Best default for most SaaS offline storage needs.
- **SQLite WASM + OPFS**: full SQL database in the browser. Powerful queries, FTS5, fast aggregation. Adds complexity (~500ms init, Worker required, limited browser support). Best for local-first apps that need real relational queries.
- Use OPFS directly for binary files (images, uploads) regardless of database choice — store metadata in IndexedDB or SQLite, blobs in OPFS [@duran2026].
- Safari's 7-day eviction policy is the most restrictive storage limitation across browsers — test thoroughly on iOS.
- For persistent SQLite across sessions with broad browser support, use sql.js + IndexedDB as the storage backend — the most compatible approach as of mid-2026 [@recca2026].

## Sources

- [@rxdb2024] RxDB — detailed benchmark comparison across all browser storage APIs
- [@recca2026] Browser storage comparison: sql.js vs IndexedDB vs localStorage
- [@duran2026] Browser Storage APIs: OPFS, IndexedDB, and SQLite-over-WASM — production architecture with benchmarks
- [@godwin2025] LogRocket — offline-first frontend apps patterns
- [@kistner2025] PowerSync — comprehensive SQLite persistence on the web
- [@pawar2026] Smashing Magazine — local-first architecture guide
- [@sqliteconsortium2025] SQLite.org — Appropriate Uses For SQLite

## Relevant notes

- [When to Use Client-Side SQLite with a Go Backend-for-Frontend](Resources/when-to-use-client-side-sqlite-with-a-go-backend-for-frontend.md)
- [SQLite Database Location in a Go+HTMX SaaS](Resources/sqlite-database-location-in-a-go-htmx-saas.md)
- [When to Choose Go + HTMX + SQLite for SaaS](Resources/when-to-choose-go-htmx-sqlite-for-saas.md)
- [Account Recovery Patterns for Consumer E2EE SaaS](Resources/account-recovery-patterns-for-consumer-e2ee-saas.md)
- [Auth Service Resource Consumption at 100k MAU: Executive Summary](Resources/auth-service-resource-consumption-at-100k-mau-executive-summary.md)