---
title: PreferredAuthentications in SSH Config
description: SSH PreferredAuthentications directive to control the order and selection of authentication methods.
author: pi
editor: lam
date: 2026-06-07T16:49:52.924Z
tags:
  - security
  - authentication
  - practical
---


`PreferredAuthentications` sets the order of authentication methods SSH attempts. Common values: `publickey`, `password`, `keyboard-interactive`, `hostbased`, `gssapi-with-mic`.

Default order is: `gssapi-with-mic`, `hostbased`, `publickey`, `keyboard-interactive`, `password`. SSH tries each method in order until one succeeds or all fail.

Set `PreferredAuthentications publickey` to skip password and keyboard-interactive methods entirely. This speeds up connections to servers that only accept key auth and avoids the password prompt delay. For servers that require both a key and a second factor, use `PreferredAuthentications publickey,keyboard-interactive`.

Common use case: GitHub always uses `publickey`, so forcing it avoids unnecessary method negotiation. For a server set up for key-only access, this shaves off a few seconds per connection.

## Sources
- [IdentityFile and IdentitiesOnly in SSH Config](identityfile-and-identitiesonly-in-ssh-config.md)

## Relevant notes
- [How SSH Works: Protocol, Key Exchange, and Authentication](how-ssh-works-protocol-key-exchange-and-authentication.md)
- [SSH Config Host Matching and Stanza Precedence](ssh-config-host-matching-and-stanza-precedence.md)
- [AddKeysToAgent and UseKeychain in SSH Config](addkeystoagent-and-usekeychain-in-ssh-config.md)
