---
title: Budget Digital Homelab for Sustainable Living
description: Overview of a complete budget digital homelab built from second-hand hardware, solar-powered, for off-grid digital sovereignty in Indonesia
author: pi
editor: lam
date: 2026-06-02T20:11:13.508Z
tags:
  - homelab
  - self-hosting
  - infrastructure
  - solar
  - indonesia
  - technology
  - sustainability
---
## Overview

This document series covers the complete build of a budget digital homelab designed for off-grid living in Indonesia. The homelab uses second-hand business mini PCs (e.g., Lenovo ThinkCentre) sourced from eBay auctions, solar-powered with panels sized for Indonesian insolation.

## What Each Atomic Note Covers

- **[Server Hardware](../Resources/server-hardware-second-hand-mini-pcs-for-homelab.md)**: Selecting used mini PCs (ThinkCentre M720q/M920q, HP EliteDesk 800 G4/G5, Dell OptiPlex Micro). Power consumption (10-25W idle), price ($50-150), rationale for each component.
- **[Network Infrastructure](../Resources/network-infrastructure-for-budget-homelab.md)**: Router with OpenWrt, managed switch, access point. Power draw (5-20W), cost ($30-100), VLAN segmentation for security.
- **[Storage Architecture](../Resources/storage-architecture-for-homelab.md)**: Boot SSD + data HDD configuration. Power draw (3-10W), cost ($20-60), backup strategy with remote sync.
- **[Solar Power System](../Resources/solar-power-system-for-off-grid-homelab-in-indonesia.md)**: Panel sizing using NASA POWER solar insolation data for Jakarta (4.64 kWh/m²/day average). Required panels (~1.6 m²), LiFePO4 battery (2.5 kWh), charge controller, inverter. Total system cost ($370-610).
- **[Self-Hosted Software Stack](../Resources/self-hosted-software-stack-for-off-grid-resilience.md)**: Essential services — Vaultwarden, SearXNG, Home Assistant, Mosquitto MQTT, Tailscale, Gitea, Syncthing, Grafana + Prometheus. All run as Docker containers on Alpine Linux.
- **[Sustainable Design](../Resources/sustainable-homelab-design-and-optimization.md)**: Power optimization strategies, hardware lifecycle management, cooling without AC, and e-waste reduction.

## System Power Budget Summary

| Component | Idle Power | Load Power | Monthly Energy |
|-----------|-----------|-----------|---------------|
| Mini PC server | 12 W | 25 W | 8.6-18 kWh |
| Network stack | 8 W | 15 W | 5.8-10.8 kWh |
| Storage (SSD+HDD) | 5 W | 10 W | 3.6-7.2 kWh |
| **Total** | **25 W** | **50 W** | **18-36 kWh** |

## Estimated Total Cost

| Category | Used Price (USD) | New Price (USD) |
|---------|-----------------|----------------|
| Mini PC (ThinkCentre) | $80 | $400+ |
| 16GB RAM + 256GB SSD | $30 | $80 |
| Router + Switch + AP | $60 | $150 |
| 1TB HDD for backup | $40 | $60 |
| Solar system (300W + 100Ah battery) | $400 | $500 |
| **Total** | **$610** | **$1,190+** |

## Goal

A self-hosted digital ecosystem that runs entirely on solar power, reduces dependence on grid electricity and cloud providers, and provides essential quality-of-life services: privacy-respecting search (SearXNG), password management (Vaultwarden), home automation (Home Assistant), smart gardening (ESPHome), and secure remote access (Tailscale).

## Relevant notes

- [Global Trajectories and Current Impact of Solarpunk](../Resources/global-trajectories-and-current-impact-of-solarpunk.md)
- [Major Nationwide Programs: Soeharto vs Prabowo Indonesia](../Resources/major-nationwide-programs-soeharto-vs-prabowo-indonesia.md)
- [Smart Village Indonesia: The 6-Pillar Framework](../Resources/smart-village-indonesia-the-6-pillar-framework.md)
- [Solarpunk in the European Union](../Resources/solarpunk-in-the-european-union.md)
- [Digital Transformation for Rural Indonesia](../Resources/digital-transformation-for-rural-indonesia.md)