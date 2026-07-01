---
title: 'remote-pi: Native Mobile App for Pi Coding Agent'
description: remote-pi is a Pi extension + Flutter mobile app for remote control of pi coding agent with QR pairing, relay, daemon mode and cron
author: pi
editor: lam
date: 2026-07-01T15:12:19.732Z
tags:
  - research
  - pi-agent
  - mobile
  - remote-access
  - self-hosting
source: https://github.com/jacobaraujo7/remote_pi, https://pi.dev/packages/remote-pi
---
## Summary

remote-pi by Jacob Moura adds remote mobile control to the pi coding agent via a Pi extension and companion Flutter mobile app (iOS/Android). It also includes a local multi-agent mesh for coordinating multiple pi instances on the same machine.

**Architecture and setup.** Flutter app → WSS → Rust relay ← WSS ← Node/TypeScript Pi extension. One-time setup: `pi install npm:remote-pi`, then `/remote-pi` runs an interactive wizard and prints a QR code. Scan with the mobile app to pair. Pairing is per-machine. The relay can be the community default or self-hosted (Docker). A local Unix Domain Socket broker enables multi-agent mesh on the same machine.

**Mobile features.** Beyond basic chat, Quick Actions: context compaction, new session, model picker, thinking level (6 levels). Image attachment (camera or gallery, compressed, inline base64). The app greys out the attach button for text-only models.

**Daemon mode and cron.** Promote a pi instance to a 24/7 daemon managed by `pi-supervisord` (systemd/launchd). Commands: `remote-pi create`, `daemon start/stop/send`. Cron scheduling with croner syntax (min 60s interval). Daemons respond to mobile prompts and process scheduled jobs.

**Security and limitations.** Ed25519 pairing authentication (challenge-response). TLS in transit. Payload is not end-to-end encrypted in current version — relay operator could read message content. Self-hosting behind a VPN (Tailscale, WireGuard) recommended. Tool approval is not gated in daemon mode. Single supervisor single point of failure (restarted automatically). One daemon per directory.

## Relevant notes

- [Mobile Apps for Pi Coding Agent Remote Access: Options Comparison](Resources/mobile-apps-for-pi-coding-agent-remote-access-options-comparison.md)
- [Moshi: Terminal-Based Mobile Access for AI Coding Agents](Resources/moshi-terminal-based-mobile-access-for-ai-coding-agents.md)
- [Paseo: Cross-Device Coding Agent Orchestration — Executive Summary](Resources/paseo-cross-device-coding-agent-orchestration-executive-summary.md)
- [Paseo Architecture: Daemon-Based Cross-Device Agent Orchestration](Resources/paseo-architecture-daemon-based-cross-device-agent-orchestration.md)
- [Paseo vs Alternative Free Open Source Agent Orchestrators](Resources/paseo-vs-alternative-free-open-source-agent-orchestrators.md)