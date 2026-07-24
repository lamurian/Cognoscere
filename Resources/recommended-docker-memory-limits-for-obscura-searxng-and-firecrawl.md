---
title: Recommended Docker Memory Limits for Obscura, SearXNG, and Firecrawl
description: Combined memory limit recommendations and docker-compose configuration for Obscura, SearXNG, and Firecrawl self-hosted stack
author: pi
editor: lam
date: 2026-07-23T23:48:46.277Z
tags:
  - docker
  - memory
  - self-hosting
  - resource-optimization
  - best-practices
  - infrastructure
  - performance
---
## Summary

When running Obscura, SearXNG, and Firecrawl together via Docker Compose, each service has distinct memory characteristics that inform appropriate `mem_limit`, `mem_reservation`, and `memswap_limit` values [@dockerinc2025]. The key principle: set `memswap_limit` equal to `mem_limit` to disable swap, preventing swap thrashing under memory pressure. Set `mem_reservation` as a soft floor that Docker uses when the host is under contention.

Obscura is the most efficient: ~30MB idle, V8 heap up to 2GB if unconstrained. SearXNG drops from ~600MB to ~150MB by setting `UWSGI_WORKERS=1`. Firecrawl is the heaviest: a multi-service Node.js/Playwright stack requiring 4--8GB host RAM.

## Recommended docker-compose snippet

```yaml
services:
  obscura:
    mem_limit: 512m
    mem_reservation: 128m
    memswap_limit: 512m
    # --cpus: "1" or "2" with --workers 4

  searxng:
    environment:
      - UWSGI_WORKERS=1    # drops memory from ~600MB to ~150MB
    mem_limit: 256m
    mem_reservation: 128m
    memswap_limit: 256m
    # --cpus: "0.5"

  firecrawl-api:
    mem_limit: 2g
    mem_reservation: 1g
    memswap_limit: 2g

  firecrawl-worker:
    mem_limit: 2g
    mem_reservation: 1g
    memswap_limit: 2g

  firecrawl-playwright:
    mem_limit: 1g
    mem_reservation: 512m
    memswap_limit: 1g

  firecrawl-redis:
    mem_limit: 256m
    mem_reservation: 128m
    memswap_limit: 256m
```

## Key Points

- Set `memswap_limit` = `mem_limit` to disable swap per container [@dockerinc2025]
- Obscura: 512m limit, 128m reservation (idles at ~30m, bursts to ~400m under V8 load)
- SearXNG: 256m limit, 128m reservation, with `UWSGI_WORKERS=1`
- Firecrawl: sum of all services ~5.5GB; host needs 8GB minimum; 4GB insufficient under sustained load
- Use `docker stats --no-stream <container>` to verify actual consumption after applying limits
- Firecrawl should set `MAX_RAM=0.8` to reject jobs at 80% system memory usage [@firecrawl2025]

## Sources

- [@hckfrday2025] — Obscura production guide
- [@ngosang2022] — SearXNG memory tuning discussion
- [@firecrawl2025] — Firecrawl self-hosting guide
- [@zhiweijie2024] — Firecrawl memory issue report
- [@dockerinc2025] — Docker Engine resource constraints documentation

## Relevant notes

- [4GB VPS Under $6/Month — Options Comparison and Executive Summary](Resources/4gb-vps-under-6-month-options-comparison-and-executive-summary.md)
- [Firecrawl Memory Limits Under Heavy Load](Resources/firecrawl-memory-limits-under-heavy-load.md)
- [Obscura Memory Limits Under Heavy Load](Resources/obscura-memory-limits-under-heavy-load.md)
- [SearXNG Memory Limits Under Heavy Load](Resources/searxng-memory-limits-under-heavy-load.md)
- [Hetzner CAX11 — Cheapest ARM VPS with 4GB RAM](Resources/hetzner-cax11-cheapest-arm-vps-with-4gb-ram.md)