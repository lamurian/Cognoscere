---
title: ThinkCentre M720q vs M920q — Specs, Power, Price for Homelab
description: Detailed comparison of Lenovo ThinkCentre M720q and M920q Tiny PCs for digital homelab server use, with verified specs, real-world power measurements, pricing, and alternatives.
author: pi
editor: lam
date: 2026-06-21T23:25:12.912Z
tags:
  - homelab
  - hardware
  - comparison
  - technology
  - practical
---

## Overview

The Lenovo ThinkCentre M720q and M920q are 1-liter Tiny form-factor business mini PCs from the 2018-2019 era, both popular as budget homelab servers. They share the same chassis, dimensions (179 x 183 x 34.5 mm), and basic layout but differ in chipset, manageability, and expansion options. This note provides verified specs from official PSREF documents [@lenovo2022a; @lenovo2022] and real-world measurements from homelab users [@sherback2026; @kennedy2022].

## Spec Comparison

| Specification | M720q | M920q |
|---|---|---|
| **Chipset** | Intel B360 | Intel Q370 |
| **CPU Support** | 8th & 9th Gen (up to i9-9900T, 8C/16T) | 8th & 9th Gen (up to i9-9900T, 8C/16T) |
| **RAM** | 2x SODIMM DDR4-2666, 32GB max officially (64GB works) | Same |
| **M.2 NVMe** | 1x PCIe 3.0 x4 (2280) | Same |
| **2.5" SATA Bay** | 1x (mutually exclusive with PCIe card) | Same |
| **PCIe Slot** | 1x PCIe 3.0 x8 low-profile | Same |
| **WLAN Slot** | 1x M.2 (2230) for WiFi/BT | Same |
| **Ethernet** | Intel I219-V (1GbE) | Intel I219-LM (1GbE, vPro) |
| **vPro / AMT** | No | Yes (Intel vPro 12.0) |
| **Rear Ports** | 1x HDMI, 1x DP, 2x USB 3.1 Gen1, 2x USB 3.1 Gen2, 1x GbE | Same + optional Thunderbolt 3 via PCIe card |
| **Front Ports** | 1x USB-C 3.1 Gen1, 1x USB 3.1 Gen1, audio jacks | Same |
| **Power Adapter** | 65W / 90W / 135W (external brick) | Same |

Key finding: Both M720q and M920q officially support 8th and 9th Gen CPUs in their PSREF — the common belief that M720q is limited to 8th Gen is incorrect. The B360 chipset may require a BIOS update for 9th Gen Coffee Lake-R CPUs, but Lenovo's own spec sheet lists them as supported [@lenovo2022a].

## Upgradeability and Maintainability

Both units are tool-less for cover removal (one screw). RAM and M.2 SSD are accessible under the bottom cover. The PCIe slot supports riser cards for quad-port gigabit NICs (I350-T4), Thunderbolt 3, or serial ports. The 2.5" drive bay and PCIe slot are mutually exclusive — you must choose one or the other [@kennedy2022].

The M920q has a clear advantage in manageability: Intel vPro with AMT 12.0 enables out-of-band keyboard-video-mouse (KVM) and power control, useful for remote homelab management. The M720q lacks this entirely.

## Power Consumption (Real-World Measurements)

Based on homelab community measurements:

| Configuration | Idle Power | Source |
|---|---|---|
| M720q (i5-8400T, 16GB, single NVMe) | 5-9W | r/minilab (Mar 2023) |
| M720q (tuned with powertop, 2.5G NIC) | 4.29W | r/homelab (Apr 2026) |
| M920q (i5-8500T, no PCIe card) | 9.75W | r/homelab (Apr 2023) |
| M920q (with I350-T2 NIC) | 5.4W | r/minilab (Nov 2024) |
| M920q (with SFP+ card, idle) | 17.5W | r/homelab (Apr 2023) |
| M920q (with SFP+ card, active link) | 20-27W | r/homelab (Apr 2023) |

Baseline expectation for a typical homelab (Proxmox, 3-5 containers): **6-12W idle**. This translates to roughly 4.3-8.6 kWh/month. At Indonesia's residential rate (~$0.081/kWh), that is $0.35-0.70/month. On solar, this is negligible for a 200W panel system.

## Price (Second-Hand, 2025-2026)

| Configuration | Estimated Price |
|---|---|
| M720q (i5-8500T, 8GB, no storage) | $50-80 |
| M720q (i5-8500T, 8GB, 256GB SSD) | $80-120 |
| M720q (i5-8500T, 16GB, 256GB NVMe) | $120-150 [@sherback2026] |
| M920q (i5-8500T, 8GB, no storage) | $100-130 |
| M920q (i7-8700T, 16GB, 256GB NVMe) | $170-220 [@sherback2026] |
| M920q (i7-9700T, 16GB, 512GB NVMe) | $250-320 |

The M720q is $30-70 cheaper than a comparable M920q. The premium for M920q buys vPro support and a slightly more robust chipset.

## Alternatives

**Dell OptiPlex 3070/7070 Micro:** Same 1L footprint, similar pricing ($100-180), 8th/9th Gen, comparable power draw. No vPro on lower-end models. Often found cheaper than Lenovo.

**HP EliteDesk 800 G4/G5 Mini:** Similar performance tier, $120-170. HP's design is less tool-friendly than Lenovo (screw-retention issues) but has marginally better software support under Linux.

**Intel N100 Mini PC (new):** $150-200 new, draws 6-10W idle, but limited to single-channel RAM (max 16GB), no PCIe slot, no 2.5" drive bay. Best for ultra-low-power single-purpose nodes, not for virtualization.

## Recommendation

For a digital homelab server running Proxmox, Docker, and a few VMs, **take the M720q**. The M920q's vPro advantage matters only if you need remote KVM access and cannot physically reach the machine. For most homelabs, the $50-70 saved on the M720q is better spent on RAM (2x32GB for 64GB total) or a larger NVMe drive.

Only buy the M920q if you explicitly need Intel vPro for remote management, or find one priced close to an equivalent M720q (within $20-30).

## Sources

[@lenovo2022a]: Lenovo PSREF — ThinkCentre M720 Tiny Platform Specifications. Accessed June 2026.
[@lenovo2022]: Lenovo PSREF — ThinkCentre M920 Tiny Platform Specifications. Accessed June 2026.
[@kennedy2022]: Kennedy, Patrick. "Lenovo ThinkCentre M920 and M920q Tiny Guide and Review." ServeTheHome, 2022.
[@sherback2026]: Sherback, Ty. "A used Lenovo ThinkCentre is still the best $100 you can spend on a home lab." XDA Developers, May 2026.
Reddit measurements from r/homelab and r/minilab community posts (2023-2026).