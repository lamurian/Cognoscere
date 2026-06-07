---
title: StrictHostKeyChecking and UserKnownHostsFile
description: 'Host key verification settings in SSH config: StrictHostKeyChecking and UserKnownHostsFile.'
author: pi
editor: lam
date: 2026-06-07T16:49:31.472Z
tags:
  - security
  - network
  - fundamental
  - infrastructure
---


`StrictHostKeyChecking` controls how SSH verifies remote host keys when connecting for the first time. Three settings: `ask` (default — prompts to accept unknown keys), `yes` (refuse connection if host key changed or unknown), and `no` (automatically accept any host key — insecure, avoid in production).

`UserKnownHostsFile ~/.ssh/known_hosts` lets you specify a custom location for known hosts entries. You can point it to a shared file across machines or split known_hosts per environment (e.g., `~/.ssh/known_hosts_internal` for private network hosts).

Use `StrictHostKeyChecking yes` for production servers, CI/CD pipelines, or any automated environment where a man-in-the-middle attack could cause damage. Combined with `UserKnownHostsFile`, you can pre-populate host keys and enforce them strictly. Use `StrictHostKeyChecking ask` (default) for personal ad-hoc connections to new servers.

Never use `StrictHostKeyChecking no` globally. If you must disable it for ephemeral hosts (e.g., cloud instances with rotating IPs), scope it to a narrow Host pattern and combine it with `UserKnownHostsFile /dev/null` to avoid accumulating junk entries.

## Relevant notes
- [[how-ssh-works-protocol-key-exchange-and-authentication]]
- [[ssh-config-host-matching-and-stanza-precedence]]
- [[digital-homelab-hardening-core-security-practices]]
- [[proxyjump-for-bastion-hosts-and-jump-boxes]]
