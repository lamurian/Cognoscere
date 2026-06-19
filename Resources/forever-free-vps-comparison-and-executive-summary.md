---
title: Forever Free VPS Comparison and Executive Summary
description: Comprehensive comparison of all forever-free VPS options from major cloud providers with recommendations
author: pi
editor: lam
date: 2026-06-10T13:19:23.169Z
tags:
  - vps
  - cloud-computing
  - infrastructure
  - self-hosting
  - free-tier
  - comparison
  - executive-summary
---

## Overview

As of mid-2026, only three major cloud providers offer genuinely forever-free VPS (compute instances that never expire): **Oracle Cloud**, **Google Cloud**, and **IBM Cloud**. AWS and Azure have discontinued their forever-free VPS offerings — AWS replaced its 12-month EC2 free tier with a 6-month credit-based system, and Azure's B1s VM is free for only 12 months.

## Quick Comparison Table

| Feature | Oracle Cloud | Google Cloud | IBM Cloud |
|---|---|---|---|
| **vCPU** | Up to 4 OCPU (ARM) + 2x 1/8 OCPU (AMD) | 0.25 vCPU (burst to 2) | 1 vCPU |
| **RAM** | Up to 24 GB (ARM) + 2x 1 GB (AMD) | 1 GB | 1-2 GB |
| **Storage** | 200 GB block + 20 GB object | 30 GB persistent disk | 25-100 GB |
| **Egress** | 10 TB/month | ~1 GB/month | ~2 TB/month |
| **Architecture** | ARM (Ampere) + x86 (AMD) | x86 only | x86 only |
| **Max Instances** | Up to 4 VMs combined | 1 instance | 1 instance |
| **Idle Reclaim** | Yes (7 days idle) | No | Yes (30 days inactive) |
| **Regions** | Global | 3 US regions | Global |
| **Credit Card** | Required | Required | Required |
| **Support** | Community forums only | Community + docs | Stack Overflow only |

## Detailed Analysis

### Oracle Cloud Always Free (Best Overall)
Oracle Cloud dominates the forever-free VPS space. The Ampere A1 ARM instances provide 4 OCPUs and 24 GB RAM, which rivals paid low-end VPS plans. The 10 TB/month egress is generous enough for real applications. The main caveats are ARM compatibility, capacity contention (common "out of host capacity" errors), and the idle reclamation policy that deletes instances after 7 days of low utilisation.

**Best for:** Self-hosting applications that run on ARM (Docker, Jellyfin, databases, web apps), CI/CD runners, VPN servers, and learning cloud infrastructure.

### Google Cloud Free Tier (Best Simplicity)
The e2-micro (0.25 vCPU, 1 GB RAM, 30 GB disk) is the smallest forever-free option but the easiest to use. Google's Console, browser-based SSH, and excellent documentation make it the most beginner-friendly. The main limitation is the tiny specs — it can barely run a web server under moderate load. The 1 GB/month egress is extremely restrictive.

**Best for:** Learning GCP, hosting a low-traffic static site or API proxy, running a VPN (WireGuard) for personal use, or experimenting with cloud — provided you stay within US regions.

### IBM Cloud Free Lite (Best Dark Horse)
IBM Cloud's Lite plan offers a 1 vCPU VM from a major enterprise provider. It splits the difference between Oracle's power and Google's simplicity. However, the confusing Classic vs VPC portal split, the auto-sleep (10 days) and auto-deletion (30 days) inactivity policies, and limited community support make it the least attractive option.

**Best for:** Learning IBM Cloud/Watson services, running a lightweight bot or monitoring script that gets regular use, or as a secondary VPS for redundancy.

## Advisory

**If you need a forever-free VPS for real work, use Oracle Cloud.** No other provider comes close in terms of raw specs, storage, and bandwidth. It is the only free tier that can run full application stacks, databases, and multiple services simultaneously.

**Mitigate Oracle's risks:**
- **Capacity issues:** Create instances during off-peak hours (early morning UTC). Try multiple availability domains.
- **ARM incompatibility:** Use Docker images that support ARM64, or reserve the 2 AMD micro instances for x86-only workloads.
- **Idle reclamation:** Run a cron job that generates light CPU/network activity (e.g., a health check endpoint or a periodic curl to your own service) to keep utilisation above 20%.
- **Backup critical data** to object storage or to a secondary provider.

**If Oracle Cloud is not suitable** (ARM incompatibility, capacity issues in your region, or you need simpler setup), use **Google Cloud** for lightweight tasks only. **IBM Cloud** is only recommended if you specifically need to learn IBM Cloud or Watson services.

**Do not use AWS or Azure expecting a forever-free VPS** — their free compute offers are time-limited to 6-12 months. They can still be useful for short-term projects or trials, but are not "forever free" VPS solutions.

## Summary Recommendation

| Use Case | Recommended Provider |
|---|---|
| Self-hosting apps (Docker, databases) | Oracle Cloud (ARM) |
| x86-only applications | Oracle Cloud (AMD micro) |
| Low-traffic proxy / VPN | Google Cloud (e2-micro) |
| Learning cloud infrastructure | Google Cloud (best docs) |
| Learning IBM Cloud / Watson | IBM Cloud |
| Production-critical free hosting | None — use paid VPS (Hetzner, DigitalOcean) |

No forever-free VPS should be considered production-grade. Oracle's reclaim policy, Google's tiny specs, and IBM's inactivity rules each preclude reliable production use. For any critical workload, budget $3-5/month for a basic paid VPS from Hetzner, DigitalOcean, or similar.

## Relevant notes

- [Oracle Cloud Always Free VPS](oracle-cloud-always-free-vps.md)
- [Google Cloud Free Tier VPS](google-cloud-free-tier-vps.md)
- [IBM Cloud Free Lite VPS](ibm-cloud-free-lite-vps.md)
- [Budget Digital Homelab for Sustainable Living](../Areas/budget-digital-homelab-for-sustainable-living.md)
- [Self-Hosted Software Stack for Off-Grid Resilience](self-hosted-software-stack-for-off-grid-resilience.md)
- [Digital Homelab Hardening: Core Security Practices](digital-homelab-hardening-core-security-practices.md)
- [Server Hardware: Second-hand Mini PCs for Homelab](server-hardware-second-hand-mini-pcs-for-homelab.md)