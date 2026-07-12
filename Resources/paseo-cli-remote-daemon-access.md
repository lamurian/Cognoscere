---
title: Paseo CLI Remote Daemon Access
description: How to connect Paseo CLI to remote daemons via host:port, unix socket, or end-to-end encrypted relay offer URLs.
author: pi
editor: lam
date: 2026-07-12T12:47:37.729Z
tags:
  - paseo
  - cli
  - orchestration
  - tools
  - reference
  - remote-access
---
Paseo's CLI can connect to daemons running on remote machines, enabling control of agents on servers, homelabs, or cloud VMs from any terminal. Use `--host` to target a specific daemon. It accepts a direct `host:port` pair (e.g., `workstation.local:6767`), a unix socket path, or a relay offer URL. The relay offer URL (`https://app.paseo.sh/#offer=...`) is the same link used by QR pairing on mobile -- it connects through Paseo's end-to-end encrypted relay so the daemon never needs to expose its port to the network. `PASEO_HOST` can be set as an environment variable to avoid passing `--host` on every command. `paseo daemon pair --json` generates an offer URL on the daemon side. Password authentication is configured via `PASEO_PASSWORD` or `paseo daemon set-password` on the daemon [@mo2026b].

## Relevant notes

- [Paseo Architecture: Daemon-Based Cross-Device Agent Orchestration](Resources/paseo-architecture-daemon-based-cross-device-agent-orchestration.md)
- [Paseo.sh: Chat Room and Agentic Orchestration Platform](Resources/paseo-sh-chat-room-and-agentic-orchestration-platform.md)
- [Paseo: Cross-Device Coding Agent Orchestration — Executive Summary](Resources/paseo-cross-device-coding-agent-orchestration-executive-summary.md)
- [Paseo vs Alternative Free Open Source Agent Orchestrators](Resources/paseo-vs-alternative-free-open-source-agent-orchestrators.md)
- [Mobile Apps for Pi Coding Agent Remote Access: Options Comparison](Resources/mobile-apps-for-pi-coding-agent-remote-access-options-comparison.md)