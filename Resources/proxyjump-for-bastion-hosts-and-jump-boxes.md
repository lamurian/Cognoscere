---
title: ProxyJump for Bastion Hosts and Jump Boxes
description: Using ProxyJump in SSH config to route connections through bastion hosts and jump boxes.
author: pi
editor: lam
date: 2026-06-07T16:49:31.471Z
tags:
  - network
  - security
  - infrastructure
  - practical
---


`ProxyJump` (added in OpenSSH 7.3) lets you connect to a target host through an intermediate SSH server — a bastion host or jump box. Syntax: `ProxyJump user@jump-host[:port]`.

In `~/.ssh/config`: use it on the target host's stanza. SSH opens a connection to the jump host first, then tunnels the second connection through it. Multiple jump hosts can be chained with commas: `ProxyJump hop1,hop2`.

Use `ProxyJump` when: your target server is not directly reachable from your network (e.g., inside a VPC, behind a firewall, or on a private subnet); you need a fixed public entry point into an infrastructure; or you want to audit/control access through a single bastion. It replaces the older and more complex `ProxyCommand ssh -W %h:%p jump-host`.

For performance, combine with `ControlMaster` on the jump host connection so repeated proxied connections reuse the same TCP channel. For security, ensure the jump host is properly hardened — it sees connection metadata even if the final connection is end-to-end encrypted.

## Relevant notes
- [[how-ssh-works-protocol-key-exchange-and-authentication]]
- [[ssh-config-host-matching-and-stanza-precedence]]
- [[controlmaster-controlpath-and-controlpersist-for-ssh-multiplexing]]
- [[forwardagent-and-forwardx11-in-ssh-config]]
- [[digital-homelab-hardening-core-security-practices]]
