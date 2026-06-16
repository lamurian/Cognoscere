---
title: Homelab Hardware Build Guide
description: Step-by-step guide to purchasing, assembling, and upgrading the homelab hardware.
author: pi
editor: lam
date: 2026-06-16T10:40:48.646Z
tags:
  - homelab
  - hardware
  - practical
  - tutorial
---
## Prerequisites

- Basic familiarity with screwdrivers and PC hardware
- ESD-safe workspace (or touch a grounded metal surface before handling components)

## Step 1: Buy a Refurbished Mini PC

Search eBay, Tokopedia (Indonesia), or Marktplaats/Tweakers (Netherlands) for:
- "Lenovo ThinkCentre M720q Tiny" or "HP EliteDesk 800 G4 Mini" or "Dell OptiPlex 3080 Micro"
- Target spec: Intel i5-8500T (6 cores), 16GB RAM, 256GB NVMe
- Budget: $120-180
- Check seller rating and warranty (1 year is standard from reputable refurbishers)

## Step 2: Upgrade RAM (to reach 64GB)

The M720q has 2x SODIMM slots supporting DDR4-2666/3200. Buy 2x 32GB DDR4 SODIMM kit (~$80-120). Or start with existing 16GB and upgrade later.

Installation:
1. Remove the bottom cover (two screws on M720q)
2. Locate the SODIMM slots — both accessible without removing other components
3. Insert RAM at 45-degree angle, press down until clips engage on both sides
4. Replace bottom cover

## Step 3: Add Extra Storage (Optional)

The M720q has one M.2 2280 NVMe slot and one 2.5" SATA bay:
- M.2 NVMe: 1TB Samsung 990 EVO (~$60) for Docker volumes
- 2.5" SATA SSD: optional for bulk data (e.g., Immich photo library)

Install M.2 drive: remove bottom cover, insert drive at 30-degree angle into slot, secure with screw. Mount 2.5" drive in the bracket inside the chassis.

## Step 4: Initial Boot and BIOS

1. Connect power, HDMI (temporary for setup), USB keyboard
2. Press power button
3. Enter BIOS (press F1 on Lenovo, F10 on HP, F2 on Dell)
4. Check: Secure Boot disabled (needed for Linux), boot order: USB > NVMe
5. Save and exit

## Step 5: Install Debian 12

```bash
# Download and write Debian 12 netinstall ISO to USB
# Boot from USB, follow guided installer:
# - Hostname: homelab
# - Guided partitioning on NVMe (ext4)
# - Install only: SSH server, standard system utilities
```

## Step 6: First SSH Connection

```bash
# Find IP from router DHCP or check with local monitor
ssh user@192.168.x.x
sudo apt update && sudo apt upgrade -y
```

Now the hardware is ready for software setup. Proceed to [[homelab-software-setup-guide]].

## Relevant notes

- [[low-power-solar-homelab-executive-summary]]
- [[homelab-software-setup-guide]]
- [[homelab-tailscale-configuration]]
- [[homelab-solar-system-build-guide]]
- [[homelab-hardware-comparison]]