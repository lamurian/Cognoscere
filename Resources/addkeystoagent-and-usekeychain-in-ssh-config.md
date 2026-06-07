---
title: AddKeysToAgent and UseKeychain in SSH Config
description: Automatic SSH key loading with AddKeysToAgent and macOS Keychain integration with UseKeychain.
author: pi
editor: lam
date: 2026-06-07T16:49:52.923Z
tags:
  - security
  - authentication
  - practical
  - software
---


`AddKeysToAgent yes` automatically loads private keys into the running SSH agent the first time they are used during authentication. Without it, you must manually run `ssh-add ~/.ssh/id_ed25519` after each login or rely on your desktop environment's keychain integration.

On macOS, `UseKeychain yes` additionally stores the key's passphrase in the macOS Keychain, so you only need to enter the passphrase once per system reboot. When combined with `AddKeysToAgent yes`, keys are loaded transparently on first use without any manual `ssh-add` step.

`AddKeysToAgent` accepts: `no` (default — do not auto-add), `yes` (add after first successful use), `ask` (prompt before adding), or a time limit like `30m` (add for a limited duration).

Use `AddKeysToAgent yes` globally in `Host *` for convenience when you use passphrase-protected keys. But if you have multiple keys for different accounts (e.g., personal vs work GitHub), pair it with `IdentitiesOnly yes` in per-host stanzas to prevent the agent from offering the wrong key first.

## Sources
- [[identityfile-and-identitiesonly-in-ssh-config]]
- [[ssh-config-host-matching-and-stanza-precedence]]

## Relevant notes
- [[how-ssh-works-protocol-key-exchange-and-authentication]]
- [[preferredauthentications-in-ssh-config]]
