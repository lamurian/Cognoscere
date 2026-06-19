---
title: Oracle Cloud Always Free VPS
description: Oracle Cloud Infrastructure (OCI) Always Free Tier — the most generous forever-free VPS with AMD and Ampere A1 ARM instances
author: pi
editor: lam
date: 2026-06-10T13:19:23.168Z
tags:
  - vps
  - cloud-computing
  - infrastructure
  - self-hosting
  - free-tier
  - oracle
---

Oracle Cloud Infrastructure (OCI) offers an Always Free tier that is the most generous permanent free VPS offering from any major cloud provider. It has been available since 2019 and shows no signs of being discontinued.

## VPS Specs

- **AMD Micro Instances (VM.Standard.E2.1.Micro):** Up to 2 instances, each with 1/8 OCPU (AMD processor), 1 GB RAM, 50 Mbps network bandwidth, 1 VNIC with 1 public IP.
- **Ampere A1 ARM Instances (VM.Standard.A1.Flex):** 4 OCPUs + 24 GB RAM total, flexibly allocable across up to 4 VMs. Network bandwidth scales with OCPUs (up to ~4 Gbps).
- **Storage:** 200 GB total block volume (boot + block combined), 5 volume backups. Minimum boot volume is 47 GB per instance.
- **Object Storage:** 20 GB combined Standard/Infrequent Access/Archive tier + 50,000 API requests/month.
- **Database:** Up to 2 Oracle Autonomous Databases (1 OCPU, 20 GB storage each) + 1 standalone MySQL HeatWave node.
- **Networking:** 1 flexible load balancer (10 Mbps), 1 network load balancer, up to 2 VCNs.
- **Data Egress:** 10 TB per month outbound data transfer.
- **Other Free Services:** Vault (20 HSM keys, 150 secrets), Monitoring (500M ingestion points), Logging (10 GB/month), Email Delivery (3,000 emails/month), Bastion service.

## How It Is Forever Free
After signing up, you get $300 in credits for 30 days to test paid services. After the trial, you can either do nothing (continue with Always Free services only) or convert to a Pay-As-You-Go account (you only pay for usage above Always Free limits). The Always Free services remain free for the life of the account, with no time limit. One account per person. Requires a credit/debit card for identity verification (a temporary hold is placed, not a charge).

URL: https://www.oracle.com/cloud/free/

## Ease of Use, Maintenance, and Configuration
- OCI Console is well-organised but has a learning curve compared to simpler VPS panels.
- ARM instances use a flexible shape — you choose OCPUs and memory via sliders at creation.
- SSH key-based authentication is mandatory. No password login out of the box.
- Operating System images available: Oracle Linux, Ubuntu, CentOS. For AMD micro instances, Oracle Linux Cloud Developer and Ubuntu are available.
- Manual security list (firewall) configuration required for each VCN — not open by default.
- Block volumes must be formatted and mounted manually.
- No automatic backups beyond manual volume snapshots.

## Pros
- By far the most generous forever-free specs: 4 ARM cores + 24 GB RAM at zero cost.
- 10 TB/month free egress — enough for real applications.
- Free load balancer for high-availability setups.
- Autonomous Database included for learning and small projects.
- Mature infrastructure with global regions.

## Cons
- **ARM-only for the big specs:** The 4 OCPU / 24 GB RAM is only available on Ampere A1 (ARM). Not all software is ARM-compatible.
- **Capacity shortages:** "Out of host capacity" errors are common — the free tier is over-subscribed. You may need to try multiple availability domains or times of day.
- **Idle instance reclamation:** Instances with <20% CPU, network, and memory utilisation for 7 days may be reclaimed (deleted).
- **Minimum 47 GB boot volume limits the number of instances** you can create within the 200 GB block storage limit (max 4 instances).
- **Credit card required** for signup. Some banks reject Oracle's verification hold.
- **Support:** No direct support on free tier — only community forums.
- **Account suspension risk:** Idle for >30 days may lead to termination.

## Strength and Limitations
- **Strength:** Unmatched raw compute resources for a free tier. Can run real workloads (web servers, databases, CI/CD runners, Jellyfin, VPNs).
- **Limitation:** ARM architecture compatibility issues, capacity contention, idle reclamation policy, and the OCI learning curve. Not suitable for production-critical workloads due to risk of resource reclamation.

## Verdict
Best-in-class forever free VPS — use it if your software runs on ARM and you can tolerate occasional capacity issues and idle reclamation risk.

## Relevant notes

- [Forever Free VPS Comparison and Executive Summary](forever-free-vps-comparison-and-executive-summary.md)
- [Google Cloud Free Tier VPS](google-cloud-free-tier-vps.md)
- [IBM Cloud Free Lite VPS](ibm-cloud-free-lite-vps.md)
- [Budget Digital Homelab for Sustainable Living](../Areas/budget-digital-homelab-for-sustainable-living.md)
- [Self-Hosted Software Stack for Off-Grid Resilience](self-hosted-software-stack-for-off-grid-resilience.md)
- [Digital Homelab Hardening: Core Security Practices](digital-homelab-hardening-core-security-practices.md)