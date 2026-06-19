---
title: User, Port, and HostName Directives in SSH Config
description: 'Basic SSH config directives: HostName maps aliases to real hosts, User sets remote user, Port sets non-standard port.'
author: pi
editor: lam
date: 2026-06-07T16:49:52.923Z
tags:
  - network
  - infrastructure
  - fundamental
  - practical
---


`HostName` maps a Host alias (used on the command line or in remote URLs) to the real destination hostname or IP address. This lets you use short aliases like `ssh myserver` instead of typing long cloud hostnames.

`User` sets the default remote username for connections to a host, saving you from typing `user@host`. Git operations always use `User git` for GitHub, GitLab, and Bitbucket — this is essential for Host stanzas that alias those services.

`Port` specifies a non-standard port number when the remote SSH daemon listens on a port other than 22. Example: `Port 2222` for a server deliberately hiding from port scanners.

All three are simple but foundational. Typical pattern: `Host myserver` with `HostName 192.168.1.100`, `User ubuntu`, `Port 22`. For GitHub: `Host github.com-personal` with `HostName github.com`, `User git` — the alias lets you differentiate keys while the real hostname stays correct.

## Sources
- [SSH Config Host Matching and Stanza Precedence](ssh-config-host-matching-and-stanza-precedence.md)
- [IdentityFile and IdentitiesOnly in SSH Config](identityfile-and-identitiesonly-in-ssh-config.md)

## Relevant notes
- [How SSH Works: Protocol, Key Exchange, and Authentication](how-ssh-works-protocol-key-exchange-and-authentication.md)
- [Digital Homelab Hardening: Core Security Practices](digital-homelab-hardening-core-security-practices.md)
