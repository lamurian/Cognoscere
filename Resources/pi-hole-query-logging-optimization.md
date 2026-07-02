---
title: Pi-Hole Query Logging Optimization
description: Reducing disk I/O impact of Pi-Hole query logging through privacy levels, retention limits, and log rotation configuration.
author: pi
editor: lam
date: 2026-07-02T11:51:19.109Z
tags:
  - pi-hole
  - dns
  - performance
  - optimization
  - logging
  - privacy
  - disk-io
---
Pi-Hole's query logging generates significant disk I/O, especially on Raspberry Pis with SD cards where write endurance is limited. FTLDNS offers configurable privacy levels: Level 0 logs everything (full domain names and timestamps), while Level 3 aggregates stats only and Level 4 is fully anonymous, eliminating per-query writes entirely [@piholedevelopmentteam2025].

For systems needing some logging, configure retention limits. Set `MAXDBDAYS=7` in `/etc/pihole/pihole-FTL.conf` to auto-prune entries older than 7 days. Configure logrotate for `/var/log/pihole/pihole.log` with weekly rotation and compression. On Docker deployments, use tmpfs for volatile logs if persistence is not needed, keeping the FTL database on durable storage. Pi-Hole Latency Stats provides tools to analyze logged data for performance diagnostics, helping identify slow queries and cache health issues [@panoc2025].

## Relevant notes

- [Pi-Hole Upstream DNS Server Selection](Resources/pi-hole-upstream-dns-server-selection.md)
- [Pi-Hole Hardware Planning and Resource Allocation](Resources/pi-hole-hardware-planning-and-resource-allocation.md)
- [Pi-Hole DNS Cache Tuning](Resources/pi-hole-dns-cache-tuning.md)
- [Pi-Hole Local DNS and Conditional Forwarding](Resources/pi-hole-local-dns-and-conditional-forwarding.md)
- [Pi-Hole Blocklist Quality vs Quantity](Resources/pi-hole-blocklist-quality-vs-quantity.md)