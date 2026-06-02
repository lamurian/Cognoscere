---
title: Storage Architecture for Homelab
description: SSD and HDD selection, backup strategy, and power-efficient storage for self-hosted services
author: pi
editor: lam
date: 2026-06-02T20:11:55.377Z
tags:
  - homelab
  - storage
  - technology
  - infrastructure
---
## What You Need

- **Boot drive**: 256-512GB NVMe SSD for OS, Docker images, and frequently accessed data. Power: 2-3W. Cost: $20-40 (used).
- **Data drive**: 1-2TB 2.5" HDD for backups, media, logs. Power: 4-8W when spinning, 0.5W idle. Cost: $30-50 (used enterprise drive).
- **Optional NAS** (if budget allows): A used 2-bay NAS like Synology DS218j. Draws 10-15W. Costs $60-100 used. Not mandatory for a single-server setup.

## Rationale

SSDs are essential for the boot drive because they use little power and have no moving parts. A 256GB SATA SSD is enough for Proxmox, a dozen Docker containers, and their data volumes. NVMe is faster but SATA is sufficient; power difference is minimal.

The data drive spins down when not in use (via hdparm or systemd). Your homelab's backup job runs once daily to the HDD. Most of the time, the HDD is parked and drawing under 1W.

You do not need a RAID for a budget homelab [^1]. The main server SSD fails rarely; you can reinstall from Ansible/playbook automation and restore data from the HDD backup. For important data (Vaultwarden vault, Home Assistant config), automate daily encrypted backups to a remote location (friend's server, $5 VPS, or Raspberry Pi at a family member's house).

## Price

| Item | Used | New |
|-----|------|-----|
| 256GB M.2 SATA SSD | $15 | $30 |
| 1TB 2.5" HDD | $25 | $45 |
| USB enclosure for backup | $5 | $15 |
| **Total** | **$45** | **$90** |

## Monthly Power

With HDD spun down most of the day (assume 4h active): SSD 2.5W x 24h + HDD 6W x 4h + HDD 0.5W x 20h = 60 + 24 + 10 = 94 Wh/day = 2.82 kWh/month.

## Backup Strategy

1. Daily rsync to external HDD (local backup).
2. Weekly encrypted Borg backup to a remote server (family member's house or cheap VPS).
3. Vaultwarden has its own encrypted export to both locations.

This three-tier approach protects against hardware failure, theft, and ransomware.

## How It Builds a Sustainable Ecosystem

SSDs last 5-10 years in a homelab. Enterprise HDDs (refurbished) from server pulls can last 5+ years. Using one external drive for backup instead of a RAID array reduces component count and e-waste. When the HDD fails, replace it with another used drive. The system is designed for repairability, not for hardware RAID lock-in.

[^1]: RAID is not a backup — a common sysadmin axiom. RAID protects against drive failure, not accidental deletion, corruption, or theft. Offline backup is cheaper and more effective for a budget homelab.

## Relevant notes

- [[budget-digital-homelab-for-sustainable-living]]
- [[global-trajectories-and-current-impact-of-solarpunk]]
- [[solar-power-system-for-off-grid-homelab-in-indonesia]]
- [[network-infrastructure-for-budget-homelab]]
- [[solarpunk-in-the-united-states]]