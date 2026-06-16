---
title: Homelab Component Prices and Alternatives
description: Detailed pricing of all homelab components with alternatives and sourcing notes for Indonesia and Netherlands.
author: pi
editor: lam
date: 2026-06-16T10:40:48.645Z
tags:
  - homelab
  - reference
  - hardware
  - comparison
---
## Component Pricing Table (USD, 2025-2026)

All prices estimated from eBay, refurbished retailers, and Amazon. Prices vary significantly by region — Indonesia has higher import duties on electronics; Netherlands has 21% VAT but a deeper used market.

| Component | Option | Price (USD) | Notes |
|---|---|---|---|
| **Mini PC (base)** | Lenovo ThinkCentre M720q (i5-8500T, 16GB, 256GB NVMe) | $130-180 | eBay refurbished, most common option |
| **Mini PC (base)** | HP EliteDesk 800 G4 Mini (i5-8500T, 16GB, 256GB) | $120-170 | Slightly cheaper, same performance tier |
| **Mini PC (base)** | Dell OptiPlex 3080 Micro (i5-10500T, 8GB, 256GB) | $150-200 | Newer gen, slightly more expensive |
| **RAM upgrade** | DDR4 32GB SODIMM (1x32GB) | $40-60 | For incremental upgrade |
| **RAM upgrade** | DDR4 32GB SODIMM kit (2x32GB) | $80-120 | For full 64GB |
| **Storage** | 1TB NVMe SSD (e.g., Samsung 990 EVO) | $50-80 | Extra capacity for Docker volumes |
| **Solar panel** | 200W 12V monocrystalline | $120-180 | Adequate for Indonesia |
| **Solar panel** | 400W 24V monocrystalline | $180-280 | For Netherlands, buy 2-3 |
| **Charge controller** | 20A MPPT (Victron SmartSolar 75/15) | $80-130 | For Indonesia (200W panel) |
| **Charge controller** | 40A MPPT (Victron SmartSolar 150/45) | $130-200 | For Netherlands (800W+ panels) |
| **Battery** | 100Ah LiFePO4 12V (Eco-Worthy or similar) | $150-250 | For Indonesia |
| **Battery** | 300Ah LiFePO4 12V | $400-600 | For Netherlands winter autonomy |
| **Inverter** | 300W pure sine wave | $40-80 | Adequate for mini PC + router |
| **Inverter** | 500W pure sine wave | $60-120 | Headroom for accessories |
| **Wiring kit** | Solar cable + fuses + MC4 connectors | $30-60 | 6mm2 (10 AWG) for DC side |

## Budget Scenarios

### Indonesia: ~$790
- Lenovo M720q (16GB) — $150
- Upgrade to 64GB (2x32GB) — $100
- 200W solar panel — $150
- 20A MPPT charge controller — $100
- 100Ah LiFePO4 battery — $200
- 300W inverter — $50
- Wiring kit — $40

### Netherlands (full off-grid): ~$1,490
- Lenovo M720q (16GB) — $150
- Upgrade to 64GB (2x32GB) — $100
- 2x 400W solar panels — $450
- 40A MPPT charge controller — $160
- 300Ah LiFePO4 battery — $500
- 500W inverter — $80
- Wiring kit — $50

### Netherlands (grid-tie hybrid): ~$890
- Same mini PC + RAM — $250
- 1x 400W solar panel — $220
- 20A MPPT charge controller — $100
- 100Ah LiFePO4 battery — $200
- 300W inverter + ATS — $80
- Wiring kit — $40

The grid-tie hybrid uses grid power during deep winter and solar the rest of the year. This is the most cost-effective approach for the Netherlands.

## Relevant notes

- [[low-power-solar-homelab-executive-summary]]
- [[homelab-hardware-build-guide]]
- [[homelab-hardware-comparison]]
- [[arm-vps-options-free-and-cheap-tiers-for-homelab-and-saas-production]]
- [[homelab-system-overview]]