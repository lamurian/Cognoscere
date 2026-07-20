---
title: Paseo Daemon Network I/O Patterns and Congestion
description: 'Why Paseo web app on a separate machine congests the LAN: single WebSocket carries all agent streams + file transfers via binary frames, creating head-of-line blocking and upload bandwidth saturation.'
author: pi
editor: lam
date: 2026-07-20T22:10:03.986Z
tags:
  - paseo
  - network
  - performance
  - troubleshooting
---
## Summary

The Paseo web app connects to the daemon over a single persistent WebSocket at `/ws` [@mo2026e]. This single connection carries all traffic between the browser and the daemon: real-time agent stream events, terminal PTY output, git diff subscriptions, permission requests/responses, voice audio chunks, and binary file transfers. When one data type saturates the connection — for example, uploading a large file — it blocks or delays all other traffic on the same WebSocket, causing the network to feel congested even on a LAN.

## Architecture

The daemon exposes a single HTTP server that handles API routes (`/api/*`), MCP (`/mcp/*`), static web assets, and a WebSocket endpoint at `/ws` [@mo2026e]. All clients (web, mobile, desktop, CLI) connect through this same WebSocket. The daemon uses a custom binary frame protocol with opcodes for `FileTransferOpcode` and `TerminalStreamOpcode`, multiplexed over the same WebSocket connection [@devin2026].

The web app ships inside the daemon package [@mo2026e]. When hosted on a LAN, the daemon binds to a network interface and the browser connects directly via WebSocket — no relay involved. For remote access, traffic goes through an end-to-end encrypted relay (Curve25519 + XSalsa20-Poly1305) [@mo2026f].

## Why LAN Congestion Occurs

Three mechanisms combine to produce congestion:

**1. Head-of-line (HoL) blocking.** WebSocket frames are delivered over TCP in order. A single large binary frame being uploaded (a photo as `FileTransferOpcode`) blocks the delivery of subsequent frames — terminal output, agent stream events, git diff updates — until the large transfer completes. This makes the UI appear frozen or sluggish during file uploads.

**2. Upload bandwidth saturation.** Uploading pictures or videos consumes the upstream bandwidth between the browser machine and the daemon machine. On consumer-grade routers with shallow buffers, a saturated upload queue triggers bufferbloat: the router's buffer fills, delaying all packets including the TCP ACKs needed for downstream traffic. This makes the entire connection feel congested in both directions [@bufferbloat2026].

**3. No built-in rate limiting.** The Paseo daemon does not implement QoS, bandwidth throttling, or prioritisation for its binary frame streams. A large `FileTransferOpcode` competes equally with latency-sensitive `TerminalStreamOpcode` frames. The nginx reverse proxy configuration recommends `client_max_body_size 100m` and `proxy_buffering off` to handle large payloads at the proxy layer [@mo2026e], but this does not affect the WebSocket binary protocol itself.

## Data Types and Their Bandwidth Profiles

| Data Type | Transport | Bandwidth Profile |
|---|---|---|
| Agent stream events (thoughts, tool calls) | JSON over WS | Low, continuous |
| Terminal PTY output | Binary frame (TerminalStreamOpcode) | Low-medium, continuous |
| Git diff updates | JSON over WS (subscription) | Medium, bursty |
| File transfers | Binary frame (FileTransferOpcode) | High, on-demand |
| Voice audio chunks | Binary frame | Medium, real-time |

The file transfer path is the only one that regularly reaches multi-megabyte payload sizes. The docs explicitly note that prompts and file uploads can be large [@mo2026e].

## Mitigations

- Use a dedicated network for agent traffic separate from bulk data transfers.
- Configure QoS on the router to prioritise WebSocket traffic or limit upload bandwidth for non-interactive flows.
- When using a reverse proxy, ensure `proxy_buffering off` and set `proxy_read_timeout` and `proxy_send_timeout` high (recommended: 3600s) [@mo2026e].
- Avoid uploading very large files through the Paseo web UI during active agent sessions. Use direct transfer methods (SCP, rsync, file share) for bulk data.
- If using the relay, switch to direct LAN connection — the relay adds a TCP-over-TCP layer that compounds congestion under packet loss.
- The `client_max_body_size` directive (default nginx example: 100m) limits HTTP-level upload size but does not solve WebSocket HoL blocking.

## Sources

- [@mo2026e] Paseo docs — Self-hosting the Web UI
- [@devin2026] Paseo DeepWiki — Client-Server Communication
- [@mo2026f] Paseo docs — Security
- [@bufferbloat2026] Bufferbloat.net

## Relevant notes

- [Paseo Pi Provider Troubleshooting Guide](Resources/paseo-pi-provider-troubleshooting-guide.md)
- [Securing Paseo Daemon with Tailscale](Resources/securing-paseo-daemon-with-tailscale.md)
- [Paseo CLI Remote Daemon Access](Resources/paseo-cli-remote-daemon-access.md)
- [Paseo Architecture: Daemon-Based Cross-Device Agent Orchestration](Resources/paseo-architecture-daemon-based-cross-device-agent-orchestration.md)
- [Paseo: Cross-Device Coding Agent Orchestration — Executive Summary](Resources/paseo-cross-device-coding-agent-orchestration-executive-summary.md)