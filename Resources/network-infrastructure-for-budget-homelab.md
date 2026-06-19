---
title: Network Infrastructure for Budget Homelab
description: Router, switch, access point, and cabling choices for a secure segmented home network running self-hosted services
author: pi
editor: lam
date: 2026-06-02T20:11:55.375Z
tags:
  - homelab
  - network
  - technology
  - infrastructure
---
## What You Need

- **Router**: GL.iNet GL-MT3000 (Beryl AX) or a used PC with OpenWrt. The GL.iNet draws about 4W and costs $60-80 new.
- **Managed Switch**: TP-Link TL-SG105E (5-port, 5W, $25-30). Provides VLAN support for network segmentation.
- **Access Point**: TP-Link EAP225 or used UniFi AP. Draws 5-8W, $30-50 used.
- **Cabling**: CAT5e or CAT6 Ethernet for wired devices. One cable from router to switch, one from switch to AP, one to the server.

Total power: approximately 8-15W continuous.

## Component Rationale

A router with **OpenWrt** gives you firewall control, ad blocking (AdBlock package), WireGuard VPN server, and traffic shaping. It runs on commodity hardware so you can replace it cheaply. The GL.iNet Beryl AX (MT3000) is a low-power ($60, 4W) travel router that is surprisingly capable as a primary router for a small homelab [@GLiNetMT3000]. For more throughput, a used PC with two NICs running OpenWrt or pfSense can handle gigabit routing at 10-15W.

A **managed switch** allows VLANs to separate IoT devices (smart plugs, ESP32 sensors) from the trusted server VLAN. This is critical for security. IoT devices are notorious for poor security; VLAN isolation prevents them from reaching your password manager or file server [@OWASPIoT].

The **access point** provides WiFi coverage. Dedicated APs (vs. all-in-one router/WiFi) are more reliable and allow you to position the AP where coverage is best. UniFi APs can be found used for $30-50 and draw 4-5W.

## Price

| Item | Used | New |
|-----|------|-----|
| GL.iNet MT3000 router | - | $60 |
| TP-Link TL-SG105E switch | $15 | $25 |
| TP-Link EAP225 AP | $25 | $45 |
| CAT6 cables (3x 3m) | $5 | $10 |
| **Total** | **$45** | **$140** |

## Monthly Power

15W average x 24h x 30 days = 10.8 kWh. At Indonesian PLN rates ($0.081/kWh), that is $0.87/month on grid. On solar, it represents about 15% of the homelab's total power budget.

## How It Builds a Sustainable Ecosystem

Network segmentation via VLANs reduces attack surface, extending the life of the homelab and protecting data. Low-power networking gear can run on the same solar battery bank as the server. By using OpenWrt on commodity hardware, you can re-purpose an old PC as a router, keeping e-waste out of landfills.

[@GLiNetMT3000]: GL.iNet MT3000 specifications: MediaTek MT7981A dual-core, 512MB RAM, WiFi 6, USB 3.0, OpenWrt pre-installed.
[@OWASPIoT]: OWASP IoT Security Guidance recommends network segmentation as a primary defense for IoT deployments.

## Relevant notes

- [Budget Digital Homelab for Sustainable Living](../Areas/budget-digital-homelab-for-sustainable-living.md)
- [Solar Power System for Off-Grid Homelab in Indonesia](solar-power-system-for-off-grid-homelab-in-indonesia.md)
- [Major Nationwide Programs: Soeharto vs Prabowo Indonesia](major-nationwide-programs-soeharto-vs-prabowo-indonesia.md)
- [Storage Architecture for Homelab](storage-architecture-for-homelab.md)
- [Sustainable Homelab: Design and Optimization](sustainable-homelab-design-and-optimization.md)