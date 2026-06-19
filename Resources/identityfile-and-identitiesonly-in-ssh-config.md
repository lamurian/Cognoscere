---
title: IdentityFile and IdentitiesOnly in SSH Config
description: How IdentityFile and IdentitiesOnly control SSH key selection and prevent agent key spray.
author: pi
editor: lam
date: 2026-06-07T16:49:31.470Z
tags:
  - security
  - authentication
  - practical
  - infrastructure
---


`IdentityFile` specifies which private key to attempt authentication with for a given host. You can specify multiple `IdentityFile` lines in one stanza; SSH tries them in order. Example: `IdentityFile ~/.ssh/id_ed25519` and `IdentityFile ~/.ssh/id_rsa`.

`IdentitiesOnly yes` is a critical companion directive. By default, SSH also offers all keys currently loaded in `ssh-agent`, often before trying the files listed in `IdentityFile`. This causes problems when you have multiple keys loaded — SSH may present the wrong one first, and if the server (like GitHub) accepts it, you authenticate as the wrong user. `IdentitiesOnly yes` tells SSH to **only** use the keys explicitly listed in `IdentityFile`, ignoring the agent's key list.

Use `IdentitiesOnly yes` whenever you have multiple SSH keys loaded in your agent and need deterministic key selection, especially for GitHub accounts or any service where the key determines identity. Without it, authentication order becomes unpredictable. Set it per-host rather than globally to avoid unexpected behaviour on servers that need agent keys for forwarding.

Per-repo alternative: `git config core.sshCommand 'ssh -i ~/.ssh/id_ed25519_work'` achieves the same effect without editing `~/.ssh/config`.

## Relevant notes
- [How SSH Works: Protocol, Key Exchange, and Authentication](how-ssh-works-protocol-key-exchange-and-authentication.md)
- [SSH Config Host Matching and Stanza Precedence](ssh-config-host-matching-and-stanza-precedence.md)
- [AddKeysToAgent and UseKeychain in SSH Config](addkeystoagent-and-usekeychain-in-ssh-config.md)
- [PreferredAuthentications in SSH Config](preferredauthentications-in-ssh-config.md)
- [Digital Homelab Hardening: Core Security Practices](digital-homelab-hardening-core-security-practices.md)
