---
title: Obscura Memory Limits Under Heavy Load
description: 'Docker memory limits for Obscura headless browser under heavy load: ~30MB idle, V8 heap up to 2GB, recommended mem_limit 512MB'
author: pi
editor: lam
date: 2026-07-23T23:48:42.477Z
tags:
  - docker
  - memory
  - performance
  - self-hosting
  - browser
  - rust
  - resource-optimization
source: https://docs.obscura.sh/guides/run-in-production-at-scale
---
## Summary

Obscura is a Rust-based headless browser with V8 JavaScript engine, designed for AI agents and web scraping [@pyshine2026]. Its memory profile is remarkably efficient compared to Chromium alternatives: ~30MB runtime memory per instance at idle, and ~70MB binary size. A fleet of 50 concurrent Obscura instances consumes roughly 1.5GB of memory, compared to 15--25GB for the same number of Chrome instances.

Under heavy load, the primary memory driver is the V8 JavaScript engine. The production guide [@hckfrday2025] recommends setting `--v8-flags "--max-old-space-size=2048"` to cap the V8 heap at 2GB. Without this flag, V8 can grow unbounded depending on page complexity and JavaScript execution. The `--workers 4` flag enables four concurrent worker threads, each with its own memory context.

## Key Points

- **Idle memory**: ~30MB per instance
- **Under load**: V8 heap can reach 2GB if unconstrained; set `max-old-space-size` to cap it
- **Recommended mem_limit**: 512MB (accommodates V8 heap up to ~400MB + overhead)
- **Recommended mem_reservation**: 128MB (soft floor for idle periods)
- **Recommended memswap_limit**: 512MB (equal to mem_limit to disable swap and prevent swap thrashing)
- **CPU**: `--cpus: "1"` is sufficient for most workloads; `--cpus: "2"` for concurrent scraping with `--workers 4`
- **Key env vars**: `max-old-space-size=2048` caps V8 heap; `OBSCURA_NAV_TIMEOUT_MS=30000` prevents hung pages

## Sources

- [@hckfrday2025] — Obscura production-at-scale guide
- [@pyshine2026] — PyShine performance benchmarks

## Relevant notes

- [Scalability Limits of R and Python Analytics in Production](Resources/scalability-limits-of-r-and-python-analytics-in-production.md)
- [Using Go and Rust to Optimize Analytics Production Pipelines](Resources/using-go-and-rust-to-optimize-analytics-production-pipelines.md)
- [Pi-Hole Hardware Planning and Resource Allocation](Resources/pi-hole-hardware-planning-and-resource-allocation.md)
- [Minimizing Resource Consumption in Analytics Production Pipelines](Resources/minimizing-resource-consumption-in-analytics-production-pipelines.md)
- [Hetzner CAX11 — Cheapest ARM VPS with 4GB RAM](Resources/hetzner-cax11-cheapest-arm-vps-with-4gb-ram.md)