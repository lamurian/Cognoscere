---
title: SSH Config Host Matching and Stanza Precedence
description: How Host stanzas match in ~/.ssh/config, wildcard patterns, and stanza precedence rules.
author: pi
editor: lam
date: 2026-06-07T16:49:31.468Z
tags:
  - network
  - security
  - infrastructure
  - fundamental
---


The `Host` directive is the core routing mechanism in `~/.ssh/config`. Each configuration stanza begins with `Host <pattern>` and applies to connections whose target hostname matches that pattern.

Patterns support wildcards: `*` matches any hostname, `?` matches a single character, and `!` negates a match. For example, `Host github.com` matches only that exact host, while `Host *.example.com` matches any subdomain. You can list multiple patterns separated by spaces: `Host server1 server2 192.168.1.*`.

SSH reads the config file line by line and applies the **first matching stanza** for each directive. This means you can define a `Host *` stanza at the bottom with defaults, then override specific options in higher, more specific stanzas. The `Host *` wildcard matches every connection and is conventionally placed last to act as a fallback.

Use more specific Host patterns when you need different keys, ports, or users for different servers. Use `Host *` for global defaults like `AddKeysToAgent yes` or `ServerAliveInterval 60`. Place negated patterns (`Host * !github.com`) when you want defaults for everything except a specific host.

## Relevant notes
- [[how-ssh-works-protocol-key-exchange-and-authentication]]
- [[identityfile-and-identitiesonly-in-ssh-config]]
- [[user-port-and-hostname-directives-in-ssh-config]]
- [[digital-homelab-hardening-core-security-practices]]
