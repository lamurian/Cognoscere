---
title: ForwardAgent and ForwardX11 in SSH Config
description: 'SSH agent forwarding and X11 forwarding: use cases, configuration, and security tradeoffs.'
author: pi
editor: lam
date: 2026-06-07T16:49:52.922Z
tags:
  - security
  - network
  - infrastructure
  - practical
---


`ForwardAgent yes` enables SSH agent forwarding, which lets your local SSH agent (and its loaded keys) be used on the remote host. When you SSH from the remote host to another server, your local private key authenticates you without the key file ever leaving your machine.

`ForwardX11 yes` enables X11 forwarding, allowing graphical applications running on the remote server to display windows on your local machine. `ForwardX11Trusted yes` disables X11 security extensions for compatibility — use cautiously.

Both are powerful but risky. Agent forwarding means any user with root on the intermediate host can use your agent to authenticate as you to any server your keys grant access to. Prefer `ProxyJump` for multi-hop SSH instead of agent forwarding when possible.

Use `ForwardAgent yes` only when you need to git push or SSH onward from a bastion and cannot use `ProxyJump` (e.g., legacy tooling). Use `ForwardX11 yes` sparingly for occasional remote GUI apps. Set both to `no` by default in `Host *` and only enable per-host where needed.

## Sources
- [[proxyjump-for-bastion-hosts-and-jump-boxes]]

## Relevant notes
- [[how-ssh-works-protocol-key-exchange-and-authentication]]
- [[identityfile-and-identitiesonly-in-ssh-config]]
- [[digital-homelab-hardening-core-security-practices]]
- [[localforward-remoteforward-and-dynamicforward-in-ssh-config]]
