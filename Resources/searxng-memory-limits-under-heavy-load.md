---
title: SearXNG Memory Limits Under Heavy Load
description: 'Docker memory limits for SearXNG under heavy load: ~150MB with workers=1, ~600MB default, recommended mem_limit 256MB'
author: pi
editor: lam
date: 2026-07-23T23:48:42.534Z
tags:
  - docker
  - memory
  - performance
  - self-hosting
  - search
  - python
  - resource-optimization
source: https://github.com/searxng/searxng/discussions/1892
---
## Summary

SearXNG is a privacy-focused metasearch engine written in Python, deployed via uWSGI. Its memory consumption is highly dependent on the number of uWSGI worker processes [@ngosang2022].

With the default uWSGI configuration (`workers = %k`, which sets workers equal to CPU cores), a SearXNG instance consumes approximately 600MB of RAM. By reducing workers to 1 (`UWSGI_WORKERS=1` environment variable or `workers = 1` in `uwsgi.ini`), memory drops to approximately 150MB. For a single-user or low-traffic instance, this is the most impactful tuning lever.

The SearXNG maintainers are actively working on reducing memory footprint through lazy loading of data objects and databases, with patches like PR #4834 (lazy load of data objects) and PR #4836 (simple currencies SQL database) [@ngosang2022].

## Key Points

- **Default memory**: ~600MB with multi-worker uWSGI
- **Tuned memory**: ~150MB with `UWSGI_WORKERS=1`
- **Recommended mem_limit**: 256MB (comfortable headroom above 150MB tuned baseline)
- **Recommended mem_reservation**: 128MB (matches tuned idle usage)
- **Recommended memswap_limit**: 256MB (equal to mem_limit to disable swap)
- **CPU**: `--cpus: "0.5"` is sufficient for personal use; `--cpus: "1"` for multi-user
- **Key env var**: `UWSGI_WORKERS=1` reduces memory by ~75%

## Sources

- [@ngosang2022] — SearXNG discussion on memory reduction

## Relevant notes

- [Obscura Memory Limits Under Heavy Load](Resources/obscura-memory-limits-under-heavy-load.md)
- [Self-Hosted Software Stack for Off-Grid Resilience](Resources/self-hosted-software-stack-for-off-grid-resilience.md)
- [4GB VPS Under $6/Month — Options Comparison and Executive Summary](Resources/4gb-vps-under-6-month-options-comparison-and-executive-summary.md)
- [Scalability Limits of R and Python Analytics in Production](Resources/scalability-limits-of-r-and-python-analytics-in-production.md)
- [Minimizing Resource Consumption in Analytics Production Pipelines](Resources/minimizing-resource-consumption-in-analytics-production-pipelines.md)