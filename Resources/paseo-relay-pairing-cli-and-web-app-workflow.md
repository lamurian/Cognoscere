---
title: 'Paseo Relay Pairing: CLI and Web App Workflow'
description: How to generate a pairing offer URL and use it from CLI or hosted web app to connect via relay, avoiding LAN congestion.
author: pi
editor: lam
date: 2026-07-20T22:19:19.587Z
tags:
  - paseo
  - cli
  - reference
  - remote-access
  - network
  - troubleshooting
---
## Summary

To use the Paseo relay (E2EE tunnel via `relay.paseo.sh:443`) from a desktop web browser or CLI, generate a pairing offer URL on the daemon side, then use it to connect from any client. The daemon stays on localhost — no ports exposed, no LAN congestion.

## Daemon Side: Generate Pairing Offer

The daemon must be running (default: bound to `127.0.0.1:6767`). Generate an offer URL:

```bash
paseo daemon pair --json
```

Output:
```json
{
  "url": "https://app.paseo.sh/#offer=eyJ2IjoyLC...",
  "qr": "https://api.qrserver.com/v1/create-qr-code/?data=https%3A%2F%2Fapp.paseo.sh%2F%23offer%3DeyJ2IjoyLC..."
}
```

The `url` field is the same link used by the mobile app's QR pairing [@mo2026b]. It contains the daemon's ECDH public key for the cryptographic handshake. The daemon does not need to bind to a network interface — it connects outbound to the relay.

## Client Side: Connect via Relay

### Method 1 — CLI with `--host`

```bash
paseo ls --host 'https://app.paseo.sh/#offer=eyJ2IjoyLC...'
paseo run --host "$OFFER_URL" "implement user auth"
```

The `--host` flag accepts the offer URL directly. The CLI connects through the relay with end-to-end encryption [@mo2026b].

### Method 2 — Environment variable

```bash
export PASEO_HOST='https://app.paseo.sh/#offer=eyJ2IjoyLC...'
paseo ls          # uses PASEO_HOST from env
paseo run "task"  # uses PASEO_HOST from env
```

Set once in your shell profile to avoid passing `--host` on every command.

### Method 3 — Hosted web app (`app.paseo.sh`)

Open `https://app.paseo.sh` in any desktop browser. The hosted web app supports adding a daemon as a host via its offer URL:

1. Click "Add Host" (or the equivalent from the host list)
2. Paste the offer URL (`https://app.paseo.sh/#offer=...`)
3. The browser connects to the daemon through the relay — end-to-end encrypted, traffic goes via internet, not LAN

The hosted web app at `app.paseo.sh` is the same Expo/React Native codebase as the self-hosted UI and the mobile app [@boudra2026]. It can manage multiple daemons simultaneously, each connected via relay or direct.

### Method 4 — Self-hosted web UI with relay

The self-hosted web UI (served from the daemon at `http://localhost:6767/`) auto-connects to its own daemon via direct connection [@mo2026e]. To connect to a **different** daemon via relay:

1. Open the self-hosted web UI (e.g., `http://localhost:6767/`)
2. Use the "Add Host" feature to add the remote daemon's offer URL
3. The self-hosted UI can manage multiple daemons, each with its own WebSocket connection

However, the self-hosted UI's own origin connection remains direct. For a purely relay-based web session, use the hosted web app at `app.paseo.sh`.

## Why This Avoids Congestion

With the relay path:

- Daemon stays bound to `127.0.0.1:6767` — no direct network exposure
- Daemon connects **outbound** to `relay.paseo.sh:443` (Cloudflare DO) [@mo2026f]
- Desktop browser connects to `app.paseo.sh` over HTTPS/WSS
- Browser's traffic goes via internet → relay → daemon's outbound connection
- LAN sees only the daemon's steady-state outbound WebSocket to the relay
- No large file uploads traverse the LAN
- No head-of-line blocking or bufferbloat on the local router

This is the same path the Android app uses by default, which is why it avoids the congestion described in `Resources/paseo-daemon-network-i-o-patterns-and-congestion.md`.

## Sources

- [@mo2026b] Paseo docs — CLI reference
- [@mo2026e] Paseo docs — Self-hosting the Web UI
- [@mo2026f] Paseo docs — Security
- [@boudra2026] Hacker News, Show HN: Paseo by Mo

## Relevant notes

- [Paseo CLI Remote Daemon Access](Resources/paseo-cli-remote-daemon-access.md)
- [Paseo Client Connection Methods: Relay vs Direct and Congestion Impact](Resources/paseo-client-connection-methods-relay-vs-direct-and-congestion-impact.md)
- [Paseo Architecture: Daemon-Based Cross-Device Agent Orchestration](Resources/paseo-architecture-daemon-based-cross-device-agent-orchestration.md)
- [Paseo Daemon Network I/O Patterns and Congestion](Resources/paseo-daemon-network-i-o-patterns-and-congestion.md)
- [Paseo: Cross-Device Coding Agent Orchestration — Executive Summary](Resources/paseo-cross-device-coding-agent-orchestration-executive-summary.md)