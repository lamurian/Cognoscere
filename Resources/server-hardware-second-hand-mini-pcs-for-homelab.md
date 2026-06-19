---
title: 'Server Hardware: Second-hand Mini PCs for Homelab'
description: Guide to selecting, buying, and powering used business mini PCs like Lenovo ThinkCentre for a budget homelab
author: pi
editor: lam
date: 2026-06-02T20:11:55.371Z
tags:
  - homelab
  - hardware
  - technology
  - infrastructure
  - practical
---
## What You Need

A used business mini PC. The most popular models are:

- **Lenovo ThinkCentre M720q** (Intel 8th gen, up to 32GB DDR4, single M.2 + 2.5" SATA)
- **Lenovo ThinkCentre M920q** (same form factor, slightly newer, dual NVMe)
- **HP EliteDesk 800 G4/G5 Mini** (Intel 8th/9th gen, comparable specs)
- **Dell OptiPlex 3070/7070 Micro** (Intel 8th/9th gen, similar footprint)

## Why These Models

Business mini PCs are built to run 24/7 in offices. They are compact (roughly 18cm x 18cm x 3.5cm), sip power (10-15W at idle, 25-35W under load), and accept standard desktop RAM and SSDs. The Intel 8th gen (Kaby Lake R/Coffee Lake) and later i5/i7 processors provide enough CPU for Docker containers, Home Assistant, and media streaming. Their fans run at low speeds under light load, making them quiet.

## Power Consumption

At idle (running Proxmox or Debian + 3-5 Docker containers), a ThinkCentre M720q with i5-8500T and 16GB RAM draws approximately 10-12W. Under moderate load (e.g., running SearXNG searches, Home Assistant automations, file transfers), it draws 18-25W. Peak under full CPU load is 45-50W but that is rare for a homelab.

Monthly energy at idle: 12W x 24h x 30 days = 8.64 kWh. At average load (18W): 12.96 kWh.

At Indonesia's residential electricity rate of $0.081/kWh [@GlobalPetrolPrices], that is $0.70-1.05 per month on grid power. On solar, it represents the primary load.

## Price

On eBay, a used ThinkCentre M720q with 8GB RAM and no storage sells for $50-80. With 8GB RAM and a 256GB SSD, $80-120. A fully loaded one (16GB RAM, 512GB NVMe) goes for $120-150. HP EliteDesk 800 G4 Mini is similarly priced. Shipping to Indonesia may add $20-40 and 2-4 weeks transit.

## Why Second-Hand

Buying used keeps these machines out of landfill. Each ThinkCentre reused saves roughly 180 kg of CO2 equivalent compared to manufacturing a new one [@EwasteMonitor]. Mini PCs are typically decommissioned in bulk by corporations after 3-4 years, many with very low usage hours.

## How It Fits the Sustainable Ecosystem

A single mini PC running Proxmox (hypervisor) hosts all services in lightweight LXC containers or Docker. At 10-15W, it can run 24/7 on a small solar panel (about 1 square meter). No dedicated server room, no AC cooling needed. It forms the brain of a digital homestead.

[@GlobalPetrolPrices]: Indonesia residential electricity rate, GlobalPetrolPrices.com, September 2025: $0.081/kWh.
[@EwasteMonitor]: Based on lifecycle analysis of desktop PC manufacturing, estimated 160-200 kg CO2 per unit (Frazer-Nash Consultancy, 2020).

## Relevant notes

- [Budget Digital Homelab for Sustainable Living](../Areas/budget-digital-homelab-for-sustainable-living.md)
- [Sustainable Homelab: Design and Optimization](sustainable-homelab-design-and-optimization.md)
- [Network Infrastructure for Budget Homelab](network-infrastructure-for-budget-homelab.md)
- [Storage Architecture for Homelab](storage-architecture-for-homelab.md)
- [Solar Power System for Off-Grid Homelab in Indonesia](solar-power-system-for-off-grid-homelab-in-indonesia.md)