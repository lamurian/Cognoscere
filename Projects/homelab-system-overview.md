---
title: 'Homelab: System Overview'
description: Brief architecture overview of the single-node solar-powered homelab system.
author: pi
editor: lam
date: 2026-06-16T10:41:56.382Z
tags:
  - homelab
  - architecture
  - paseo
  - pi-agent
---

## System Architecture

The homelab is built around a single used enterprise mini PC running Debian 12 with Docker. One node handles all workloads. Tailscale provides encrypted mesh networking for SSH access from anywhere. The mini PC is powered entirely by solar.

```
[Solar Panels] -> [MPPT Charge Controller] -> [LiFePO4 Battery] -> [Inverter] -> [Mini PC]
                                                                               |
                                                                   [Tailscale Mesh]
                                                                         |
                                                              [Your Laptop/Phone]
```

## Workloads

- **paseo.sh daemon** — central orchestrator that distributes user commands across devices. See [Paseo Architecture: Daemon-Based Cross-Device Agent Orchestration](../Resources/paseo-architecture-daemon-based-cross-device-agent-orchestration.md) for the architecture.
- **pi agent** — default AI coding agent provider on this node
- **10-20 Docker containers** — Bitwarden (Vaultwarden), Immich, Paperless-ngx, SearXNG, Obscura, Nginx Proxy Manager, Uptime Kuma
- **Batch data processing** — Python/Node.js scripts triggered by paseo.sh
- **OpenCode Go** — orchestrated coding via cloud LLM subscription

The LLM runs in the cloud. The homelab handles orchestration, data processing, and self-hosted service hosting. No local GPU needed.

## Key Design Decisions

1. **Single node over cluster** — one machine with 64GB RAM is simpler to manage, uses less power, and has fewer failure points than a multi-node cluster
2. **x86 over ARM** — better software compatibility (Docker images, paseo.sh, pi agent), mature platform, huge used market, RAM upgradeability
3. **Used enterprise over new** — Lenovo ThinkCentre and HP EliteDesk series are sold by the millions on the used market; you get better hardware for less
4. **LiFePO4 battery** — safer than lead-acid, longer cycle life, better depth-of-discharge, no venting required
5. **Tailscale over WireGuard directly** — simpler setup, automatic NAT traversal, mesh networking, SSH portal

## Relevant notes

- [Low-Power Solar Homelab: Executive Summary](../Resources/low-power-solar-homelab-executive-summary.md)
- [Homelab Software Setup Guide](homelab-software-setup-guide.md)
- [Paseo.sh: Chat Room and Agentic Orchestration Platform](../Resources/paseo-sh-chat-room-and-agentic-orchestration-platform.md)
- [Paseo: Cross-Device Coding Agent Orchestration — Executive Summary](../Resources/paseo-cross-device-coding-agent-orchestration-executive-summary.md)
- [Homelab Hardware Comparison](../Resources/homelab-hardware-comparison.md)
- [The Agent Orchestration Landscape in 2026](../Resources/the-agent-orchestration-landscape-in-2026.md)
- [ARM VPS Options: Free and Cheap Tiers for Homelab and SaaS Production](../Resources/arm-vps-options-free-and-cheap-tiers-for-homelab-and-saas-production.md)