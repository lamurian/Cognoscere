---
title: When to Use Client-Side SQLite with a Go Backend-for-Frontend
description: Decision framework for client-side SQLite (WASM+OPFS in browser) paired with a thin Go BFF server for auth, sync, and server-side operations.
author: pi
editor: lam
date: 2026-07-17T02:14:57.581Z
tags:
  - sqlite
  - golang
  - architecture
  - local-first
  - offline
  - browser
  - wasm
  - saas
  - reference
---
## Summary

Client-side SQLite runs the SQLite database engine inside the browser via WebAssembly, with data persisted to the Origin Private File System (OPFS) or IndexedDB. In this architecture, a lightweight Go server acts as a Backend-for-Frontend (BFF) handling authentication, background sync, and operations that require server authority. The Go server is not the primary data store — the client's local SQLite database is.

This is a fundamentally different pattern from server-side SQLite (where the database file lives on the server alongside the Go app). Here, each browser holds its own replica of the data and syncs changes asynchronously with the server [@pawar2026; @kistner2025].

## When to Consider Client-Side SQLite + Go BFF

**Local-first applications.** When the user's device should hold the primary copy of their data. Reads hit the local database instantly (sub-millisecond). Writes are local. The server is a sync peer, not a gatekeeper. This architecture eliminates loading spinners and enables instant UI updates [@pawar2026].

**Offline-critical workflows.** Field data collection, project management tools used on construction sites, note-taking, document editing. The app must work fully without internet. When the network returns, changes sync in the background. Client-side SQLite persists via OPFS across browser sessions and survives tab closures [@steiner2023].

**User-generated data with real-time collaboration.** Note-taking, document editing, task boards, design tools. Each user edits their local replica; CRDT-based sync (via libraries like Yjs) merges concurrent edits. The Go BFF handles conflict resolution at the application level and relays changes between peers [@pawar2026].

**Single-user SaaS with cloud backup.** Applications where one user owns all their data but needs cloud backup and cross-device access. The Go BFF provides authentication, encrypted sync, and a server-side backup while the client-side SQLite handles all reads and writes.

**Privacy-sensitive applications.** Data never leaves the user's device unencrypted. The Go BFF stores only encrypted blobs it cannot read. End-to-end encryption is naturally compatible with local-first architecture since the client controls the data before sync [@pawar2026].

**Reducing server infrastructure costs.** When the goal is to minimize server-side database costs. Since the Go BFF does not serve read queries (reads are local), server resource requirements drop dramatically. The Go BFF needs only enough capacity for auth, sync coordination, and any server-side computation.

## How It Works

The Go BFF in this architecture is intentionally thin:

```
[Browser A: SQLite WASM + OPFS]  ←↔→  [Go BFF Server]  ←↔→  [Browser B: SQLite WASM + OPFS]
      ↑ local reads/writes                   ↑ sync layer                   ↑ local reads/writes
```

The Go BFF typically handles:
- **Authentication** — JWT/OAuth, session management
- **Sync coordination** — receiving mutation batches from clients, applying them to an authoritative store (often PostgreSQL or SQLite on the server), and propagating changes to other connected clients
- **Authorization enforcement** — validating that writes from clients comply with permissions before accepting them into the authoritative store [@pawar2026]
- **Cross-device relay** — pushing changes to other replicas via WebSocket, SSE, or polling
- **Server-side computation** — anything that cannot run in the browser (e.g., webhook delivery, email, scheduled tasks)

The client-side SQLite setup requires a WebAssembly build of SQLite (either the official `@sqlite.org/sqlite-wasm` or `wa-sqlite`), persisted via OPFS. The `OPFSCoopSyncVFS` from `wa-sqlite` is the recommended general-purpose VFS as of 2025, with good performance across all major browsers. For read-heavy concurrent workloads, the newer `OPFSWriteAheadVFS` (April 2026) supports parallel reads during writes [@kistner2025].

## When NOT to Use It

**Server-generated data dominates.** Analytics dashboards, social media feeds, search results — the server produces this data, so replicating it to every client adds complexity without benefit [@pawar2026].

**Strong transactional consistency required.** Banking, payment processing, inventory management with stock limits. The local-first model uses eventual consistency — conflicts are resolved during sync, not prevented upfront [@pawar2026].

**Massive datasets that won't fit on client devices.** Client-side SQLite databases beyond ~1GB cause memory pressure and slow initial sync. Better to keep data server-side.

**Simple CRUD with no offline or collaboration needs.** If the app always has internet and only one user edits each record, server-side SQLite (Go + SQLite on the same server) is dramatically simpler with zero sync infrastructure.

**Legacy browser support required.** OPFS requires recent browser versions (Chrome 102+, Safari 16.4+, Firefox 111+). Older browsers do not support the synchronous file handles that make client-side SQLite performant [@kistner2025].

## Comparison: Client-Side vs Server-Side SQLite in a Go SaaS

| Dimension | Client-Side SQLite + Go BFF | Server-Side Go + SQLite |
|---|---|---|
| Primary data store | Browser (via WASM + OPFS) | Server filesystem |
| Reads | Instant (sub-ms, local) | ~0.01ms (local file) |
| Writes | Instant locally, async sync | Synchronous to file |
| Offline capability | Full | None |
| Sync infrastructure | Required (sync engine or custom) | None needed |
| Server cost | Minimal (auth + sync only) | Single VPS |
| Complexity | High (sync, conflicts, migrations on N clients) | Low (single binary + file) |
| Collaboration | Built-in via CRDT/sync | Requires separate infrastructure |
| Privacy | Data can stay on device | Data on server |
| Best for | Local-first, offline, collaborative apps | Traditional multi-user SaaS |

The key decision point: if your users need to work offline or you want instant UI regardless of network quality, choose client-side SQLite. If you want simplicity and server-side authority without sync complexity, choose server-side SQLite [@sqliteconsortium2025; @pawar2026].

## Key Points

- Client-side SQLite runs SQLite via WebAssembly in the browser, persisted to OPFS, with a thin Go BFF on the server
- Best for local-first, offline-critical, collaborative, and privacy-sensitive applications
- Go BFF handles auth, sync, and server-side operations — not primary data storage
- Avoid when data is server-generated, strong transactional consistency is needed, or datasets are too large for client devices
- Client-side SQLite requires modern browser support (Chrome 102+, Safari 16.4+, Firefox 111+)
- The server-side pattern (Go + SQLite on same machine) is simpler for traditional multi-user SaaS without offline needs

## Sources

- [@kistner2025] PowerSync — comprehensive survey of SQLite persistence on the web
- [@pawar2026] Smashing Magazine — local-first architecture in practice
- [@steiner2023] Chrome Developers — SQLite Wasm backed by OPFS
- [@rxdb2024] RxDB — browser storage API comparison
- [@sqliteconsortium2025] SQLite.org — Appropriate Uses For SQLite
- [@shayan2025] Everyone Is Wrong About SQLite — practical decision framework

## Relevant notes

- [SQLite Database Location in a Go+HTMX SaaS](Resources/sqlite-database-location-in-a-go-htmx-saas.md)
- [When to Choose Go + HTMX + SQLite for SaaS](Resources/when-to-choose-go-htmx-sqlite-for-saas.md)
- [Auth Service Resource Consumption at 100k MAU: Executive Summary](Resources/auth-service-resource-consumption-at-100k-mau-executive-summary.md)
- [Pi-Hole Hardware Planning and Resource Allocation](Resources/pi-hole-hardware-planning-and-resource-allocation.md)
- [Cloudinary Direct Browser Upload with Unsigned Presets](Resources/cloudinary-direct-browser-upload-with-unsigned-presets.md)