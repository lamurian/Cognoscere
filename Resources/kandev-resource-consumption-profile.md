---
title: Kandev Resource Consumption Profile
description: 'Kandev resource consumption: official 4-core/8GB/50GB minimums, measured CPU (300%+/workspace), memory (OOM, session/MCP leak), storage figures from 2026 PRs/issues'
author: pi
editor: lam
date: 2026-08-12T23:53:28.783Z
tags:
  - golang
  - performance
  - resource-optimization
  - self-hosting
  - memory
  - cpu
  - storage
  - benchmarks
  - reference
---
## Summary

Kandev publishes no idle-vs-active benchmark tables, but its resource profile is defined by three data sources: the official system requirements in the architecture doc, measured incidents in GitHub PRs/issues from 2026, and the mitigations added in response.

Official published minimums: Linux (Ubuntu 20.04+) or macOS 12+, 4 CPU cores (8 recommended), 8GB RAM (16GB recommended), 50GB free disk, Docker 20.10+ [@kdlbs2026]. The architecture doc also records per-agent container allocations from its container-based design: Auggie CLI 2 CPU / 2GB RAM, Gemini 1.5 CPU / 1.5GB RAM [@kdlbs2026]. Note the doc is partially aspirational — the current implementation is a unified Go binary with SQLite, in-memory event bus, and local/agentctl process execution.

**Measured CPU.** The workspace tracker's polling loops were the dominant CPU consumer. Two independent loops (monitor every 2s, git poll every 3s) with no overlap guards caused git process pile-up and 300%+ CPU per workspace on large repos; `git status --porcelain --untracked-files=all` ran every 3s purely for change detection [@carlosflorencio2026]. Separately, agentctl ran `git ls-files --others --exclude-standard` every 2s for every retained task worktree under `~/.kandev/tasks` regardless of whether anyone was watching — concurrent fan-out across many tasks saturated CPU even with zero agents running [@carlosflorencio2026a]. Both were fixed in April 2026 (overlap guards + focus-gated polling).

**Measured memory.** Diff enrichment was unbounded: pprof heap snapshots showed 100% of allocations in `strings.Builder` inside untracked-file diff generation, causing agentctl OOM crashes when workspaces held large or numerous untracked files (e.g., build artifacts before .gitignore) [@zeval2026]. A second incident: disconnected ACP sessions and their per-session MCP server children accumulated indefinitely — after ~27 hours of normal use one user had 27 stale opencode ACP sessions, ~110 MCP server processes, 66 node processes, and 123 MCP-related children. Each session spawns its own copy of every configured MCP server (4-5 per session, no pooling). On a 32GB host the cumulative RSS pushed the working set over RAM, triggering heavy swap, page-fault storms, and visible UI lag [@clemdnl2026].

**Measured storage.** The same incident showed agentctl writing 382GB to disk in ~28 hours (write_bytes), with 1.12TB rchar — per-session state being persisted aggressively for all stale sessions [@clemdnl2026]. Kandev's data lives in one home directory: SQLite DB (kandev.db plus -wal/-shm) alongside worktrees, tasks, repos, sessions, lsp-servers, npm-global, and $HOME for agent CLIs [@kdlbs2026]. Idle storage maintenance was later added because short-lived tasks leave workspaces, dependency trees, Go build cache, and Docker data consuming self-hosted disks [@kdlbs2026a].

**Bottom line.** Kandev's baseline footprint is modest for a Go backend (unified binary, SQLite, embedded web assets), but CPU and RAM scale with workspace count and session churn rather than active work — the 2026 fixes (focus-gated polling, diff caps, session reaping, idle storage cleanup) directly address that scaling. There is still no published idle-RAM figure.

## Key Points

- Official minimums: 4 cores / 8GB RAM / 50GB disk; recommended 8 cores / 16GB
- CPU: 300%+ per workspace from git polling pile-up (fixed PR #554); fan-out CPU saturation from 2s untracked scans (fixed PR #610)
- Memory: agentctl OOM from unbounded diff generation (fixed PR #598); 27 stale sessions → ~110 MCP processes, swap storms on 32GB host (fixed #1249)
- Storage: 382GB written in 28h under session leak (issue #1247); idle storage maintenance added (PR #1699)
- Data layout: single home dir with SQLite + worktrees/repos/sessions + agent CLI state
- No official idle-RAM baseline; resource monitor surfaces live host metrics
- Current architecture: unified Go binary + SQLite + agentctl sidecars

## Sources

- [@kdlbs2026] Kandev GitHub repository and docs
- [@carlosflorencio2026] Kandev PR #554 — git process pile-up CPU fix
- [@carlosflorencio2026a] Kandev PR #610 — focus-gated git polling
- [@zeval2026] Kandev PR #598 — agentctl OOM from unbounded diff generation
- [@clemdnl2026] Kandev issue #1247 — ACP session / MCP child accumulation
- [@kdlbs2026a] Kandev PR #1699 — idle storage maintenance
- [Kandev: Go Server-First ADE with Phone Access](kandev-go-server-first-ade-with-phone-access.md)

## Relevant notes

- [Kandev Resource Tuning and Limits](Resources/kandev-resource-tuning-and-limits.md)
- [Casdoor Resource Consumption at 100k MAU](Resources/casdoor-resource-consumption-at-100k-mau.md)
- [Zitadel Resource Consumption at 100k MAU](Resources/zitadel-resource-consumption-at-100k-mau.md)
- [Obscura Memory Limits Under Heavy Load](Resources/obscura-memory-limits-under-heavy-load.md)
- [Auth Service Resource Consumption at 100k MAU: Executive Summary](Resources/auth-service-resource-consumption-at-100k-mau-executive-summary.md)