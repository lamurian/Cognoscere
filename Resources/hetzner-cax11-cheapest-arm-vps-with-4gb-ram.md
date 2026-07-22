---
title: Hetzner CAX11 — Cheapest ARM VPS with 4GB RAM
description: 'Hetzner CAX11 ARM cloud server: 2 vCPU (Ampere Altra), 4GB RAM, 40GB NVMe, 20TB traffic from ~€4/month'
author: pi
editor: lam
date: 2026-07-22T11:06:31.936Z
tags:
  - vps
  - budget
  - cloud-computing
  - infrastructure
  - self-hosting
  - arm
  - hosting
---
## Summary

Hetzner CAX11 is the ARM-based entry-level cloud server in Hetzner's Cost-Optimized line, using Ampere Altra processors. It offers 2 vCPU cores (ARM64), 4 GB RAM, 40 GB NVMe SSD, and 20 TB included traffic. Pricing is approximately €4.00/month in EU data centers, making it competitive with the x86 CX23. It sits on the same Cost-Optimized tier as the CX23, sharing identical RAM, storage, and traffic specs.

The ARM architecture offers better price-per-core efficiency at the cost of software compatibility. Most modern Linux distributions, Docker images, Node.js, Python, Go, and Rust toolchains now support ARM64. However, legacy binaries, some niche Docker images, and certain closed-source software may not be available. If your entire stack (Paseo, SearXNG, Firecrawl, Obscura, pi agent) supports ARM64, this is the most energy-efficient option.

Note: after June 15, 2026 price adjustments, CAX11 pricing may have increased. The CAX series previously listed at €5.99/month but now aligns closer to the CX series pricing on the Cost-Optimized tier.

## Key Points

- **Provider:** Hetzner Cloud (hetzner.com)
- **Plan:** CAX11 (Cost-Optimized, ARM)
- **URL:** https://www.hetzner.com/cloud/cost-optimized
- **vCPU:** 2 shared (Ampere Altra ARM64)
- **RAM:** 4 GB RAM
- **Storage:** 40 GB NVMe SSD
- **Traffic:** 20 TB/month included
- **Network:** 10 Gbit infrastructure, 1 IPv4 address, IPv6 /64 subnet
- **Price:** ~€4.00-5.99/month (excl. VAT). EU regions at the lower end of this range.
- **Contract:** No minimum term. Hourly billing with monthly cap.
- **Locations:** Same as CX series — Germany, Finland, US, Singapore
- **SLA:** 99.9% uptime guarantee
- **Limitations:** ARM64 compatibility required. Verify all Docker images and binaries support ARM before committing. Shared vCPU — not for sustained high CPU. Slightly less community documentation than x86.
- **Cross-reference:** [Hetzner CX23 — Cheapest x86 VPS with 4GB RAM Under $6] for the x86 equivalent at comparable pricing.

## Sources

- https://www.hetzner.com/cloud/cost-optimized
- https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/

## Relevant notes

- [ARM VPS Options: Free and Cheap Tiers for Homelab and SaaS Production](Resources/arm-vps-options-free-and-cheap-tiers-for-homelab-and-saas-production.md)
- [Hetzner CX23 — Cheapest x86 VPS with 4GB RAM Under $6](Resources/hetzner-cx23-cheapest-x86-vps-with-4gb-ram-under-6.md)
- [Forever Free VPS Comparison and Executive Summary](Resources/forever-free-vps-comparison-and-executive-summary.md)
- [RackNerd 4GB KVM VPS — Annual Prepay at $59.99/Year](Resources/racknerd-4gb-kvm-vps-annual-prepay-at-59-99-year.md)
- [Oracle Cloud Always Free VPS](Resources/oracle-cloud-always-free-vps.md)