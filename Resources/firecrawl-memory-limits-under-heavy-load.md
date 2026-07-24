---
title: Firecrawl Memory Limits Under Heavy Load
description: 'Docker memory limits for Firecrawl self-hosted stack under heavy load: multi-service, known memory leak, recommends 8GB+ RAM host'
author: pi
editor: lam
date: 2026-07-23T23:48:42.663Z
tags:
  - docker
  - memory
  - performance
  - self-hosting
  - crawling
  - resource-optimization
  - nodejs
source: https://github.com/firecrawl/firecrawl/blob/main/SELF_HOST.md
---
## Summary

Firecrawl is a full-stack web scraping API built on Node.js and Playwright. Its self-hosted deployment involves multiple Docker services: API server, worker, playwright-service, Redis, and PostgreSQL [@firecrawl2025]. This makes it the most resource-intensive of the three services.

The Apify self-hosting guide explicitly recommends "8GB+ RAM" for the host machine. Issue #722 [@zhiweijie2024] reports that after ~30 crawling tasks, memory usage climbs from 13% to 85% on a 4GB system (approximately 3.4GB consumed), and memory is not released after jobs complete -- indicating a memory leak or retained heap from Playwright browser contexts. Exit code 137 (OOM kill) on the `extract-worker` container is a documented symptom.

The official SELF_HOST.md provides `MAX_RAM` (default 0.8) and `MAX_CPU` (default 0.8) environment variables as thresholds: when system RAM exceeds 80%, the worker rejects new jobs instead of crashing.

## Key Points

- **Full stack memory**: The system needs 4--8GB RAM total for all services
- **API service mem_limit**: 2GB (Node.js + Playwright context management)
- **Worker service mem_limit**: 2GB (heavy processing, known to OOM at lower limits)
- **Playwright-service mem_limit**: 1GB (browser rendering)
- **Redis mem_limit**: 256MB (lightweight but essential)
- **Recommended host RAM**: 8GB minimum; 4GB is insufficient under sustained load
- **memswap_limit**: Set equal to mem_limit per service to prevent swap thrashing
- **Key env var**: `MAX_RAM=0.8` (stops accepting jobs at 80% RAM usage)
- **Known issue**: Memory does not release after crawl jobs complete; periodic container restart may be needed

## Sources

- [@firecrawl2025] — Self-hosting guide with configuration template
- [@zhiweijie2024] — Memory exhaustion issue report

## Relevant notes

- [Obscura Memory Limits Under Heavy Load](Resources/obscura-memory-limits-under-heavy-load.md)
- [SearXNG Memory Limits Under Heavy Load](Resources/searxng-memory-limits-under-heavy-load.md)
- [4GB VPS Under $6/Month — Options Comparison and Executive Summary](Resources/4gb-vps-under-6-month-options-comparison-and-executive-summary.md)
- [Pi-Hole Hardware Planning and Resource Allocation](Resources/pi-hole-hardware-planning-and-resource-allocation.md)
- [Paseo Efficiency Best Practices](Resources/paseo-efficiency-best-practices.md)