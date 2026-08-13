---
title: Kandev Resource Tuning and Limits
description: 'Kandev resource tuning levers: focus-gated poll modes (2s/30s/paused), diff caps (10MB/256KB/2MB), idle storage maintenance, resource monitor, log rotation, image flavors'
author: pi
editor: lam
date: 2026-08-12T23:53:28.784Z
tags:
  - golang
  - self-hosting
  - configuration
  - resource-optimization
  - docker
  - monitoring
  - reference
  - tools
---
## Summary

Kandev's resource consumption is controllable through several levers added across 2026 in response to measured incidents. The most impactful is focus-gated git polling.

**Poll modes.** The WorkspaceTracker polls fast (2s monitor / 3s git) when a session is focused, slow (30s) when subscribed but unfocused (sidebar diff badges), and paused when no client is subscribed. Default is slow — the safe fallback for headless agentctl [@carlosflorencio2026a].

**Diff generation caps.** To prevent OOM, diff enrichment now skips files over 10MB (too_large), detects binary via null-byte scan of the first 8KB (binary), caps each diff at 256KB (truncated), and enforces a 2MB total diff budget per update (budget_exceeded). Skip reasons are surfaced in the changes/review panels instead of silently showing "No changes" [@zeval2026].

**Storage hygiene.** Idle-aware storage analysis and cleanup (disabled by default) reclaims workspaces, dependency trees, Go build cache, and Docker data left behind by short-lived tasks [@kdlbs2026a]. The System settings page exposes a disk usage breakdown per worktrees, repositories, sessions, tasks, quick chat, and backups [@kdlbs2026].

**Observability.** An optional resource monitor shows host CPU, memory, disk, CPU temperature, and load in the desktop/tablet status bar or phone Status drawer; Kandev can also collect execution-environment metrics for Docker, SSH, Sprites, and other remote runtimes [@kdlbs2026]. Log rotation defaults are 100MB max size, 5 backups, 30 days age, gzip compression [@kdlbs2026].

**Deployment sizing.** The default vanilla Docker image is the smallest; the :universal image (~1.4GB) adds Go/Rust toolchains, build-essential, linters, and Playwright Chromium system libs for agents working on compiled projects or driving headless browsers [@kdlbs2026]. Architecture-doc agent allocations: Auggie CLI 2 CPU / 2GB RAM, Gemini 1.5 CPU / 1.5GB RAM [@kdlbs2026].

## Key Points

- Focus-gated polling: fast 2s/3s focused, slow 30s unfocused, paused when unwatched; default slow
- Diff caps: 10MB per file, 256KB per diff, 2MB per update; skip reasons visible in UI
- Idle storage maintenance: opt-in cleanup of leftover workspaces, caches, Docker data
- Disk usage inspector per worktrees/repos/sessions/tasks/quick chat/backups
- Resource monitor: host CPU/RAM/disk/temp/load in status bar; per-executor metrics for Docker/SSH/Sprites
- Log rotation: 100MB / 5 backups / 30 days / gzip
- Vanilla vs universal image (~1.4GB with toolchains and Chromium libs)
- Agent container allocations (arch doc): Auggie 2 CPU/2GB, Gemini 1.5 CPU/1.5GB

## Sources

- [@kdlbs2026] Kandev GitHub repository and docs
- [@carlosflorencio2026a] Kandev PR #610 — focus-gated git polling
- [@zeval2026] Kandev PR #598 — agentctl OOM from unbounded diff generation
- [@kdlbs2026a] Kandev PR #1699 — idle storage maintenance
- [Kandev Resource Consumption Profile](kandev-resource-consumption-profile.md)

## Relevant notes

- [Kandev Resource Consumption Profile](Resources/kandev-resource-consumption-profile.md)
- [Kandev: Go Server-First ADE with Phone Access](Resources/kandev-go-server-first-ade-with-phone-access.md)
- [Paseo Alternatives in Rust and Go — Executive Summary](Resources/paseo-alternatives-in-rust-and-go-executive-summary.md)
- [Recommended Docker Memory Limits for Obscura, SearXNG, and Firecrawl](Resources/recommended-docker-memory-limits-for-obscura-searxng-and-firecrawl.md)
- [SearXNG Memory Limits Under Heavy Load](Resources/searxng-memory-limits-under-heavy-load.md)