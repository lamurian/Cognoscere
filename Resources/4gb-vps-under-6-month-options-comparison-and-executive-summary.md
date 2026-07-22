---
title: 4GB VPS Under $6/Month — Options Comparison and Executive Summary
description: Executive summary comparing 5 VPS options with ≥4GB RAM for under $6/month for a remote dev machine running Paseo, SearXNG, Firecrawl, Obscura, pi agent
author: pi
editor: lam
date: 2026-07-22T11:07:12.021Z
tags:
  - vps
  - budget
  - cloud-computing
  - infrastructure
  - self-hosting
  - comparison
  - executive-summary
  - hosting
---
## Summary

This document compares five VPS hosting options that meet the criteria of at least 4 GB RAM and predictable pricing under USD 6/month (or nearest equivalent in EUR). The intended use case is a remote development machine running Paseo, SearXNG, Firecrawl, Obscura, and the pi coding agent concurrently.

## Comparison Table

| Feature | Hetzner CX23 | Hetzner CAX11 | RackNerd 4GB | Netcup VPS 500 | Contabo VPS 4 |
|---------|-------------|---------------|-------------|----------------|---------------|
| **vCPU** | 2 shared | 2 shared ARM | 3 shared | 2 dedicated | 4 shared |
| **RAM** | 4 GB | 4 GB | 4 GB | 4 GB DDR5 ECC | 8 GB |
| **Storage** | 40 GB NVMe | 40 GB NVMe | 60 GB SSD | 128 GB NVMe | 100 GB SSD |
| **Traffic** | 20 TB | 20 TB | 7 TB | Included (unlimited @1Gbps) | Unlimited (200 Mbps) |
| **Port Speed** | 10 Gbps | 10 Gbps | 1 Gbps | 1 Gbps | 200 Mbps |
| **Arch** | x86_64 | ARM64 (Ampere) | x86_64 | x86_64 | x86_64 |
| **Price/mo** | €3.49-5.49 | €4.00-5.99 | $5.00 | €4.97 excl. VAT | €5.50 |
| **Contract** | None (hourly) | None (hourly) | Annual prepay | 12-mo or hourly | 1-month min |
| **IPv4** | Included | Included | Included | Included | Included |
| **SLA** | 99.9% | 99.9% | Not published | 99.9% | 99.9% |
| **DC Regions** | 6 global | 6 global | 10+ US/EU | 5 global | 3 global |

## Use Case Assessment

### Workload Profile

The target stack (Paseo + SearXNG + Firecrawl + Obscura + pi agent) has the following resource profile:

- **Paseo:** Go daemon, lightweight (~50-100 MB RAM idle). Cross-device orchestration, minimal CPU.
- **SearXNG:** Search aggregator. Typically uses 200-500 MB RAM. Low sustained CPU, traffic-dependent.
- **Firecrawl:** Web crawling. Bursty CPU and network usage during crawl jobs. 200-500 MB RAM typical.
- **Obscura:** Web proxy/privacy. Memory depends on concurrent connections. 100-300 MB baseline.
- **Pi agent:** AI coding agent process. Node.js or Python-based, typically 200-500 MB RAM.

**Total estimated baseline RAM: ~1-2 GB. With headroom for spikes: 4 GB is the practical minimum.** All five options meet this. 8 GB (Contabo) provides generous headroom.

### Recommendation by Priority

**Best overall value (x86): Hetzner CX23** — At €3.49-3.99/month in EU regions, no minimum contract, hourly billing, NVMe storage, 10 Gbps network, 20 TB traffic, and a reputable provider with 99.9% SLA. The 4 GB RAM and 40 GB NVMe are sufficient for all five services. Use EU regions for lowest price.

**Best RAM headroom: Contabo Cloud VPS 4** — 8 GB RAM at €5.50/month gives double the memory at a marginal cost increase. Ideal if you plan to run additional Docker containers or database services. The 200 Mbit/s port and shared CPU are the trade-offs.

**Best for short-term/flexible use: Hetzner CX23 or Netcup (hourly)** — No long-term commitment. Hetzner has no minimum term at all. Netcup offers hourly billing at €0.010/hour.

**Best CPU performance: Netcup VPS 500 G12** — Dedicated vCores (not shared) with DDR5 ECC RAM and 128 GB NVMe provide the most predictable CPU performance for CPU-bursty workloads like Firecrawl crawling jobs or SearXNG indexing.

**Best annual lock-in price: RackNerd** — $59.99/year ($5/month) with lifetime price lock. Good if you want a fixed cost for a year with no surprises. SSD (not NVMe) storage is the main compromise.

### Important Caveats

- **VAT:** Hetzner, Netcup, and Contabo prices exclude VAT for EU customers. Non-EU customers typically do not pay EU VAT, making the base prices the effective cost.
- **ARM compatibility:** Hetzner CAX11 requires ARM64 compatibility. Paseo (Go), SearXNG (Python), Firecrawl (Node.js/TypeScript), Obscura (Go), and pi agent (Node.js) all support ARM64. Verify Docker images before committing.
- **Currency risk:** EUR-denominated plans (Hetzner, Contabo, Netcup) have USD-cost exposure to EUR/USD exchange rate fluctuations. RackNerd (USD) is insulated from this.
- **No managed service:** All options are unmanaged VPS. You handle OS updates, security, and application configuration.
- **Backup strategy:** None include automated off-server backups in the base price. Consider periodic snapshots or rsync to another provider as a low-cost backup plan.

## Final Verdict

For a remote development machine running Paseo, SearXNG, Firecrawl, Obscura, and pi agent, **Hetzner CX23 is the recommended default** — best balance of price, performance, reputation, and flexibility. If your stack is fully ARM64-compatible, **CAX11** is equally capable at a similar price. If you need more RAM headroom, **Contabo Cloud VPS 4** provides 8 GB for only slightly more. If you prefer a fixed annual cost, **RackNerd** at $59.99/year is a strong alternative.

## Related Notes

- [[Resources/hetzner-cx23-cheapest-x86-vps-with-4gb-ram-under-6]]
- [[Resources/hetzner-cax11-cheapest-arm-vps-with-4gb-ram]]
- [[Resources/racknerd-4gb-kvm-vps-annual-prepay-at-59-99-year]]
- [[Resources/netcup-vps-500-g12-ddr5-ecc-ram-at-5-91-month]]
- [[Resources/contabo-cloud-vps-4-8gb-ram-at-5-50-month]]
- [[Resources/arm-vps-options-free-and-cheap-tiers-for-homelab-and-saas-production]]

## Relevant notes

- [Forever Free VPS Comparison and Executive Summary](Resources/forever-free-vps-comparison-and-executive-summary.md)
- [IBM Cloud Free Lite VPS](Resources/ibm-cloud-free-lite-vps.md)
- [DomaiNesia Cloud VPS Lite Indonesia — NVMe at Rp48,000/month](Resources/domainesia-cloud-vps-lite-indonesia-nvme-at-rp48-000-month.md)
- [Hetzner CAX11 — Cheapest ARM VPS with 4GB RAM](Resources/hetzner-cax11-cheapest-arm-vps-with-4gb-ram.md)
- [Google Cloud Free Tier VPS](Resources/google-cloud-free-tier-vps.md)