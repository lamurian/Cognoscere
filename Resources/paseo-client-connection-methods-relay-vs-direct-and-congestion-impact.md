---
title: 'Paseo Client Connection Methods: Relay vs Direct and Congestion Impact'
description: 'Why Android app avoids LAN congestion: it uses relay (traffic goes via internet, not LAN). Desktop/web on direct LAN cause congestion from upload bufferbloat.'
author: pi
editor: lam
date: 2026-07-20T22:13:52.924Z
tags:
  - paseo
  - network
  - performance
  - troubleshooting
  - mobile
---
## Summary

All Paseo clients (web, Android, iOS, desktop, CLI) use the same shared Expo/React Native codebase from `packages/app` and connect to the daemon via the same WebSocket protocol [@boudra2026]. However, each client defaults to a different network path, which determines whether LAN congestion occurs. The key factor is not the client type but whether the connection uses the **relay** (traffic routed via internet) or a **direct LAN connection** (traffic stays on local network).

## Two Connection Methods

Paseo supports two transport paths [@mo2026f]:

**Relay connection (recommended for mobile).** The daemon connects outbound to `relay.paseo.sh:443` (Cloudflare DO). The phone meets it there. All traffic is end-to-end encrypted via Curve25519 ECDH + XSalsa20-Poly1305. No open ports required. The daemon stays bound to localhost.

**Direct connection.** The daemon listens on a network address (LAN IP or `0.0.0.0`). Clients connect directly over TCP/WebSocket. No relay involved. Usually used for the self-hosted web UI or LAN-based desktop usage.

## Why Android App Avoids Congestion

Three factors combine:

**1. Relay routing removes upload from LAN.** The Android app defaults to relay pairing (QR code scan). When the phone sends data (prompts, file attachments), the traffic goes phone → WiFi router → internet → Cloudflare relay → internet → daemon's outbound connection. The phone's upload does not traverse the LAN towards the daemon. The daemon receives data over its own internet-facing connection. The LAN sees only the daemon's outbound WebSocket to the relay, which is a single persistent control channel with low, steady-state bandwidth. No large uploads traverse the LAN.

**2. Mobile stream filtering.** The daemon's session management layer implements `computeShouldNotifyClient` that filters high-frequency agent stream events for mobile clients to reduce bandwidth [@devin2026a]. This reduces downstream data but does not affect upstream congestion.

**3. Usage patterns.** The Android app's primary interaction is text prompts and reading agent output. It lacks the file-upload UX for large files that the web app supports (where `client_max_body_size` needs to be configured for up to 100 MB uploads) [@mo2026e].

## Why Web App Causes Congestion

The self-hosted web UI is served from the daemon's HTTP server and auto-connects to the same origin [@mo2026e]. This means:

- The browser's WebSocket connects directly to the daemon over LAN
- File uploads, large prompts, and binary frames traverse the LAN as raw WebSocket frames
- Upload saturation triggers bufferbloat on consumer routers [@bufferbloat2026]
- Head-of-line blocking on the single WebSocket delays all other agent output

## Desktop App Behavior

The desktop app (Electron wrapper around the same Expo codebase) can use either transport. It has no special network handling different from the web or mobile app [@boudra2026]. The desktop app ships with a bundled daemon for local use, but when connecting to a remote daemon:

- If connected via relay (scanning a QR pairing link from the remote daemon), it behaves like the Android app — no LAN upload congestion.
- If connected directly to the daemon's LAN IP (like the web UI), it causes the same LAN congestion.

## Recommendation

Switching to the desktop app does not prevent congestion by itself. The congestion is a function of the **network path**, not the client type:

- **To avoid congestion:** connect via the relay (QR pairing). The daemon stays on localhost, the Android/desktop app meets it at the relay. All uploads go through the internet, bypassing the LAN.
- **If you must use direct LAN connection:** apply QoS on your router to limit upload bandwidth for non-interactive flows, or upload large files outside of active agent sessions. The mitigations documented in `Resources/paseo-daemon-network-i-o-patterns-and-congestion.md` apply equally to web and desktop clients using direct connections.

## Sources

- [@mo2026e] Paseo docs — Self-hosting the Web UI
- [@mo2026f] Paseo docs — Security
- [@boudra2026] Hacker News, Show HN: Paseo by Mo
- [@devin2026a] Paseo DeepWiki — Session Management
- [@bufferbloat2026] Bufferbloat.net

## Relevant notes

- [Paseo Daemon Network I/O Patterns and Congestion](Resources/paseo-daemon-network-i-o-patterns-and-congestion.md)
- [Securing Paseo Daemon with Tailscale](Resources/securing-paseo-daemon-with-tailscale.md)
- [Paseo CLI Remote Daemon Access](Resources/paseo-cli-remote-daemon-access.md)
- [Paseo.sh: Chat Room and Agentic Orchestration Platform](Resources/paseo-sh-chat-room-and-agentic-orchestration-platform.md)
- [Paseo Architecture: Daemon-Based Cross-Device Agent Orchestration](Resources/paseo-architecture-daemon-based-cross-device-agent-orchestration.md)