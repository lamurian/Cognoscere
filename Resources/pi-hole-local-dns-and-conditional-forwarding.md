---
title: Pi-Hole Local DNS and Conditional Forwarding
description: Using Pi-Hole local DNS records and conditional forwarding to resolve internal services instantly and reduce external query load.
author: pi
editor: lam
date: 2026-07-02T11:51:19.111Z
tags:
  - pi-hole
  - dns
  - performance
  - optimization
  - self-hosting
  - networking
  - local-dns
---
Pi-Hole's local DNS record capability allows defining custom domain-to-IP mappings for internal services like Home Assistant, media servers, and NAS. Local entries reply instantly from cache with zero upstream latency and are marked as immortal cache entries that never expire [@piholedevelopmentteam2025]. If a service moves to a new IP, one update in Pi-Hole propagates to all clients immediately [@butts2025].

Conditional forwarding extends this pattern: Pi-Hole can forward queries for a specific local domain (e.g., `home.local`) to a designated internal DNS server (router or domain controller) while sending all other queries through normal upstream resolution. Configure this in Settings > DNS > Advanced by specifying the local domain and target DNS server IP. Combine with router DHCP pointing to Pi-Hole as the sole DNS server to ensure all devices use local resolution [@butts2025]. For VPN clients, ensure the Pi-Hole IP is reachable from the VPN subnet.

## Relevant notes

- [Pi-Hole Upstream DNS Server Selection](Resources/pi-hole-upstream-dns-server-selection.md)
- [Pi-Hole DNS Cache Tuning](Resources/pi-hole-dns-cache-tuning.md)
- [Pi-Hole Hardware Planning and Resource Allocation](Resources/pi-hole-hardware-planning-and-resource-allocation.md)
- [Pi-Hole Security Hardening and Rate Limiting](Resources/pi-hole-security-hardening-and-rate-limiting.md)
- [Pi-Hole Blocklist Quality vs Quantity](Resources/pi-hole-blocklist-quality-vs-quantity.md)