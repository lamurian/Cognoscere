---
title: 'Low-Power Solar Homelab: Executive Summary'
description: Executive summary of the low-power solar homelab project covering hardware recommendation, solar feasibility analysis, and build guides.
author: pi
editor: lam
date: 2026-06-16T10:41:36.170Z
tags:
  - homelab
  - executive-summary
  - architecture
  - paseo
  - pi-agent
  - solar
---

## Executive Summary

This project designs a low-power homelab for running the paseo.sh daemon, pi agent, and 10-20 Docker containers (Bitwarden, Immich, Paperless-ngx, SearXNG, Obscura) on 100% solar power. The primary constraint is RAM: you need upgradeability up to 64GB for concurrent Docker workloads and future data processing tasks. Local LLM inference is offloaded to cloud subscriptions (OpenCode Go).

**Recommended approach: a single refurbished enterprise mini PC, not a Raspberry Pi cluster.** A used Lenovo ThinkCentre M720q (or HP EliteDesk 800 G4 / Dell OptiPlex 3080 Micro) delivers 42-62% better CPU performance than a Pi 5 at comparable idle power (4-10W). It has 2x SODIMM slots supporting up to 64GB DDR4 RAM. A fully-kitted Pi 5 (board + case + PSU + NVMe HAT + SSD) costs about the same or more as a used enterprise mini PC with double the RAM ceiling, built-in NVMe, and far better community support for Proxmox and Docker. [@geerling2025; @louwrentius2024]

For solar power: in Indonesia, a single 200W panel + 100Ah LiFePO4 battery covers the load year-round. In the Netherlands, winter requires 800-1000W of panels and a 300Ah battery for 5-7 days autonomy, or alternatively a grid-tie hybrid approach to avoid massive overbuilding.

## Key Documents

- **System Overview** — [[homelab-overview]]
- **Hardware Comparison** — [Homelab Hardware Comparison](homelab-hardware-comparison.md)
- **Component Prices and Alternatives** — [Homelab Component Prices and Alternatives](homelab-component-prices-and-alternatives.md)
- **Solar Feasibility: Indonesia and Netherlands** — [Homelab Solar Feasibility: Indonesia and Netherlands](homelab-solar-feasibility-indonesia-and-netherlands.md)
- **Hardware Build Guide** — [Homelab Hardware Build Guide](../Projects/homelab-hardware-build-guide.md)
- **Software Setup Guide** — [Homelab Software Setup Guide](../Projects/homelab-software-setup-guide.md)
- **Tailscale Configuration** — [Homelab Tailscale Configuration](../Projects/homelab-tailscale-configuration.md)
- **Solar System Build Guide** — [Homelab Solar System Build Guide](../Projects/homelab-solar-system-build-guide.md)

## Confidence Assessment

| Decision | Confidence | Rationale |
|---|---|---|
| Used x86 mini PC over RPi cluster | High | Multiple independent benchmarks confirm better perf/$, higher RAM ceiling, and idle power parity [@geerling2025; @louwrentius2024] |
| Solar sizing for Indonesia | High | Consistent tropical PSH data year-round; conservative 200W panel leaves headroom |
| Solar sizing for Netherlands | Moderate | Winter PSH variability means either large overbuild or grid-tie hybrid; local test data needed |
| Single-node over cluster | High | Simpler management, lower power, fewer failure points, meets all requirements |

## Known Gaps

- External GPU expansion (for future gaming) is not practical on the M720q chassis — would require an eGPU enclosure via M.2/OCuLink or a second node
- Solar component pricing varies significantly by local market (Indonesia import duties vs Netherlands VAT) — prices in the component guide are USD estimates from global markets
- Docker container power draw under mixed workload (10-20 containers) is estimated — actual draw depends on container activity patterns

## Related Existing Notes

- [Paseo Architecture: Daemon-Based Cross-Device Agent Orchestration](paseo-architecture-daemon-based-cross-device-agent-orchestration.md)
- [Paseo: Cross-Device Coding Agent Orchestration — Executive Summary](paseo-cross-device-coding-agent-orchestration-executive-summary.md)
- [ARM VPS Options: Free and Cheap Tiers for Homelab and SaaS Production](arm-vps-options-free-and-cheap-tiers-for-homelab-and-saas-production.md)
- [The Agent Orchestration Landscape in 2026](the-agent-orchestration-landscape-in-2026.md)
- [Paseo vs Alternative Free Open Source Agent Orchestrators](paseo-vs-alternative-free-open-source-agent-orchestrators.md)