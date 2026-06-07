---
title: ControlMaster, ControlPath, and ControlPersist for SSH Multiplexing
description: SSH connection multiplexing with ControlMaster, ControlPath, and ControlPersist for faster repeated connections.
author: pi
editor: lam
date: 2026-06-07T16:49:31.471Z
tags:
  - network
  - infrastructure
  - practical
  - software
---


SSH connection multiplexing lets multiple sessions share a single TCP connection, eliminating repeated TCP and SSH handshake overhead. This is configured with three directives in `~/.ssh/config`.

`ControlMaster auto` enables multiplexing and lets the first connection become the master. Subsequent connections to the same host reuse the master connection instead of creating a new one. `ControlPath ~/.ssh/control-%C` defines where the Unix socket for the shared connection lives — `%C` is a hash of the host, port, and user, giving a unique path per destination.

`ControlPersist 300` keeps the master connection alive in the background for 300 seconds after the last session closes. This avoids re-handshaking during rapid successive connections (e.g., running multiple git commands, rsync, or Ansible). Set it to `yes` (infinite) or a timeout in seconds.

Use multiplexing for: frequent git operations to the same host, automated scripts that make many SSH calls, or any workflow where connection latency is noticeable. Avoid it when you need absolute isolation between sessions (e.g., different users authenticating through the same jump host). If using multiple GitHub accounts, ensure `ControlPath` includes `%C` or `%k` so accounts don't share a multiplexed connection.

## Relevant notes
- [[how-ssh-works-protocol-key-exchange-and-authentication]]
- [[ssh-config-host-matching-and-stanza-precedence]]
- [[serveraliveinterval-and-serveralivecountmax-in-ssh-config]]
- [[proxyjump-for-bastion-hosts-and-jump-boxes]]
- [[network-infrastructure-for-budget-homelab]]
