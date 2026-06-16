---
title: 'ARM VPS Options: Free and Cheap Tiers for Homelab and SaaS Production'
description: Survey of forever-free ARM VPS (Oracle Ampere A1) and the cheapest paid ARM VPS options. Recommendation for homelab vs SaaS production use cases.
author: pi
editor: lam
date: 2026-06-16T01:44:50.131Z
tags:
  - vps
  - cloud
  - arm
  - hosting
  - saas
  - homelab
  - comparison
---

## Overview

ARM-based cloud VPS has become a strong alternative to x86 for cost-sensitive workloads. This note surveys the best free option (Oracle Cloud Always Free) and the cheapest paid ARM tiers, with a recommendation split by use case.

## Oracle Cloud Always Free Tier (ARM)

Oracle Cloud Infrastructure (OCI) offers the most generous permanent free tier in the market, headlined by the Ampere A1 ARM instances.

**Always Free ARM resources:**
- 4 OCPU + 24 GB RAM total (split across one or more Ampere A1 Flex instances)
- 200 GB block storage total (boot + block)
- 10 TB/month outbound data transfer
- Also includes 2 AMD micro instances (1/8 OCPU, 1 GB each), Autonomous Database (2 instances), load balancer (10 Mbps), and object storage (20 GB)

**Limitations and risks:**
- ARM instance availability is capacity-constrained — not all regions have stock
- One account per person, requires credit card for identity verification
- Accounts idle for 30+ days may be terminated
- No GPU in free tier
- Oracle may reclaim or throttle free resources without extensive warning
- To access the ARM instances you often need to upgrade to PAYG (still free within limits)
- Best effort, no SLA

**Verdict for homelab:** Excellent for learning, self-hosting services, and non-critical workloads at zero cost. The 24 GB RAM and 4 cores run many Docker containers comfortably. Not reliable enough for production SaaS.

## Paid ARM VPS: Hetzner Cloud (CAX Series)

Hetzner's CAX series runs on Ampere Altra ARM processors and offers the best price-performance ratio among paid ARM VPS providers.

**Current pricing (post-June 15, 2026 adjustment):**
- CAX11: 2 vCPU, 4 GB RAM, 40 GB NVMe, 20 TB traffic — €5.99/month (excl. IPv4)
- CAX21: 4 vCPU, 8 GB RAM, 80 GB NVMe, 20 TB traffic — previously €7.99, check current
- CAX31: 8 vCPU, 16 GB RAM, 160 GB NVMe, 20 TB traffic
- CAX41: 16 vCPU, 32 GB RAM, 320 GB NVMe, 20 TB traffic
- IPv4 add-on: €0.50/month

**Key advantages:**
- Still 3-4x cheaper than DigitalOcean, Vultr, or Linode for equivalent specs
- 20 TB included traffic
- NVMe SSD storage with excellent disk I/O
- Hourly billing available
- Data centers in Germany, Finland, US (Hillsboro, Ashburn), and Singapore
- 99.9% uptime SLA

**Limitations:**
- ARM compatibility — verify your stack supports ARM64 (modern Node.js, Python, Go, Docker work; some legacy software may not)
- Shared vCPU (neighbors share physical cores) — not ideal for sustained high CPU loads
- Unmanaged — you handle OS updates, security, and configuration
- Requires identity verification (can delay initial provisioning)

## Other ARM VPS Options

| Provider | Entry ARM Spec | Price | Notes |
|---|---|---|---|
| IONOS | 1 vCPU, 1 GB ARM | ~$2-6/month | Enterprise-grade parent (United Internet) |
| Servers Guru | 2 vCPU, 4 GB Ampere | €9.99/month | Anonymous, crypto payment, often out of stock |
| Scaleway (France) | ARM instances | Varies | EU sovereign cloud |
| AWS Graviton | Variable | Higher | Good but premium-priced |
| Azure (Ampere) | Variable | Higher | Similar pricing to AWS |

## Recommendation

**For homelab / self-hosting / learning:** Use Oracle Cloud Always Free tier as your primary sandbox. The 4-OCPU, 24 GB ARM instance runs Docker, WireGuard, monitoring stacks, small databases, and personal websites without cost. Supplement with a cheap Hetzner CAX11 as backup or for workloads that need reliability.

**For SaaS production:** Use Hetzner Cloud CAX series. Start with CAX11 (€5.99/month) for low-traffic services or staging, scale to CAX21 (4 vCPU, 8 GB) for production services. Hetzner's SLA, network performance, and NVMe storage make it suitable for customer-facing workloads. The cost advantage over DigitalOcean/Vultr (~3-4x cheaper) directly improves SaaS margins.

**Key consideration — ARM compatibility:** Before committing, verify your entire stack (languages, databases, libraries, Docker images) supports ARM64. Most modern tooling does, but legacy dependencies may not.
