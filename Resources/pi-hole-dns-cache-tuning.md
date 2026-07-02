---
title: Pi-Hole DNS Cache Tuning
description: Tuning Pi-Hole DNS cache size, optimizer, and TTL settings for optimal performance based on network usage patterns.
author: pi
editor: lam
date: 2026-07-02T11:51:19.108Z
tags:
  - pi-hole
  - dns
  - performance
  - optimization
  - caching
  - ftl
  - ttl
---
Pi-Hole's FTLDNS includes a configurable DNS cache with size, TTL handling, and an optimizer that serves slightly-expired records while triggering upstream refresh [@piholedevelopmentteam2025]. The default cache size of 10,000 entries is sufficient for most home networks. Increase it only when cache evictions (`cache-live-freed`) are above zero, monitored via `dig +short chaos txt evictions.bind` or the Settings > System page [@dler2018].

The cache optimizer (`dns.cache.optimizer`, default 3600s grace) serves recently-expired records to mask upstream latency on slow connections. Set maximum overaging to 86400s (1 day) to avoid stale data [@piholedevelopmentteam2025]. Caching of upstream-blocked queries is controlled by `dns.cache.upstreamBlockedTTL` (default 86400s); set to 0 to force re-check on every query. Edit `/etc/dnsmasq.d/01-pihole.conf` to change cache-size and restart pihole-FTL. Note that larger caches degrade performance due to linear search overhead — the default balances hit rate with lookup speed [@dler2018].

## Relevant notes

- [Pi-Hole Query Logging Optimization](Resources/pi-hole-query-logging-optimization.md)
- [Pi-Hole Upstream DNS Server Selection](Resources/pi-hole-upstream-dns-server-selection.md)
- [Pi-Hole Local DNS and Conditional Forwarding](Resources/pi-hole-local-dns-and-conditional-forwarding.md)
- [Pi-Hole Security Hardening and Rate Limiting](Resources/pi-hole-security-hardening-and-rate-limiting.md)
- [Pi-Hole Hardware Planning and Resource Allocation](Resources/pi-hole-hardware-planning-and-resource-allocation.md)