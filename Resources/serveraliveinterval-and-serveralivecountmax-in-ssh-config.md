---
title: ServerAliveInterval and ServerAliveCountMax in SSH Config
description: SSH ServerAliveInterval and ServerAliveCountMax to prevent dropped idle connections through NAT and firewalls.
author: pi
editor: lam
date: 2026-06-07T16:49:52.923Z
tags:
  - network
  - infrastructure
  - practical
---


`ServerAliveInterval` sends a keep-alive message through the encrypted channel at a specified interval in seconds. This prevents routers, NAT gateways, and firewalls from dropping idle SSH connections. Example: `ServerAliveInterval 60` sends a message every 60 seconds.

`ServerAliveCountMax` sets the number of missed alive responses before SSH disconnects. Default is 3. With `ServerAliveInterval 60` and `ServerAliveCountMax 3`, SSH waits up to 3 minutes without a response before giving up.

These are different from TCP keep-alives (`TCPKeepAlive`) which operate at the transport layer and can be unreliable through NAT. SSH-level keep-alives are encrypted and properly acknowledged by the remote SSH daemon.

Use `ServerAliveInterval 60` globally in `Host *` when you frequently experience dropped connections, such as over VPN, mobile networks, or when leaving shells idle for long periods. Set a higher interval (300+) for laptops that sleep frequently to avoid unnecessary traffic.

## Sources
- [ControlMaster, ControlPath, and ControlPersist for SSH Multiplexing](controlmaster-controlpath-and-controlpersist-for-ssh-multiplexing.md)

## Relevant notes
- [How SSH Works: Protocol, Key Exchange, and Authentication](how-ssh-works-protocol-key-exchange-and-authentication.md)
- [SSH Config Host Matching and Stanza Precedence](ssh-config-host-matching-and-stanza-precedence.md)
- [Network Infrastructure for Budget Homelab](network-infrastructure-for-budget-homelab.md)
