---
title: Securing Paseo Daemon with Tailscale
description: How to configure the Paseo daemon to listen on a Tailscale IP for direct, encrypted connections across devices on a tailnet.
author: pi
editor: lam
date: 2026-06-03T08:30:17.493Z
tags:
  - self-hosting
  - network
  - software
  - privacy
---

## Summary

The Paseo daemon listens on `127.0.0.1:6767` by default, making it unreachable from other devices. By binding to your Tailscale IP, you can connect directly from any device on your tailnet over Tailscale's encrypted WireGuard tunnel, bypassing the Paseo relay server entirely [@paseo2026].

## Configuration

Three changes to `~/.paseo/config.json` are needed:

- **`daemon.listen`** — set to your Tailscale IP (e.g. `100.x.y.z:6767`) instead of `127.0.0.1:6767`
- **`daemon.cors.allowedOrigins`** — add `http://<tailscale-ip>:6767` so browser-based clients can connect
- **`daemon.hostnames`** — add your Tailscale hostname (e.g. `["flo-19"]`) as a DNS rebinding protection allowlist

After changing the config, restart the daemon (`paseo restart`) and add the Tailscale address as a direct connection in the Paseo mobile app.

## Security considerations

Binding to a network address exposes the daemon to any device that can reach that address. Tailscale's WireGuard encryption protects traffic in transit, but does not authenticate callers. For access control, set a password via `paseo config set password`, which stores a bcrypt hash in `config.json` and requires an `Authorization: Bearer` header on all requests.

If you only need mobile access and don't mind the relay, the default relay mode already provides end-to-end encryption (ECDH key exchange + XSalsa20-Poly1305) without any VPN setup.

## Sources

- Paseo Security docs [@paseo2026]
- [[self-hosting]]