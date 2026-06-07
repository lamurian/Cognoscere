---
title: LocalForward, RemoteForward, and DynamicForward in SSH Config
description: 'SSH port forwarding: LocalForward, RemoteForward, and DynamicForward (SOCKS5 proxy) for tunnelling traffic.'
author: pi
editor: lam
date: 2026-06-07T16:49:52.924Z
tags:
  - network
  - security
  - practical
  - infrastructure
---


`LocalForward` creates a local port forward: connections to a port on your machine are tunnelled through SSH to a destination reachable from the remote server. Syntax: `LocalForward 8080 localhost:3000` — visiting `http://localhost:8080` on your machine reaches port 3000 on the remote server's localhost.

`RemoteForward` does the reverse: the remote server listens on a port and forwards connections back to your machine. Useful for exposing a local development server to a remote host.

`DynamicForward` creates a SOCKS5 proxy on your local machine. Syntax: `DynamicForward 1080`. Configure your browser to use `localhost:1080` as a SOCKS proxy, and all traffic routes through the SSH server, useful for bypassing firewalls or accessing internal networks.

Port forwarding works with `ControlMaster` — once a multiplexed connection is established, additional forwards can be added with `ssh -O forward` commands. Use `GatewayPorts yes` on the server for `RemoteForward` to bind to `0.0.0.0` instead of just `localhost`.

## Sources
- [[controlmaster-controlpath-and-controlpersist-for-ssh-multiplexing]]
- [[proxyjump-for-bastion-hosts-and-jump-boxes]]

## Relevant notes
- [[how-ssh-works-protocol-key-exchange-and-authentication]]
- [[forwardagent-and-forwardx11-in-ssh-config]]
- [[ssh-config-host-matching-and-stanza-precedence]]
