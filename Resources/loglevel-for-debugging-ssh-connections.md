---
title: LogLevel for Debugging SSH Connections
description: Using LogLevel in SSH config to debug connection and authentication issues.
author: pi
editor: lam
date: 2026-06-07T16:49:52.922Z
tags:
  - network
  - practical
  - software
---


`LogLevel` controls the verbosity of SSH client logs. Settings from quietest to loudest: `QUIET`, `FATAL`, `ERROR`, `INFO`, `VERBOSE`, `DEBUG1`, `DEBUG2`, `DEBUG3`.

Default is `INFO` for normal operation. For troubleshooting, `DEBUG3` shows the most detail: which keys are being tried, why they are rejected, config file parsing decisions, and all messages exchanged during negotiation.

Set `LogLevel DEBUG3` in a specific Host stanza when debugging authentication failures, key selection issues (`IdentityFile` not being used), or config parsing problems. Remove or set back to `INFO` after resolving. You can also use `ssh -vvv` on the command line instead of editing config — `-v`, `-vv`, and `-vvv` correspond to `DEBUG1`, `DEBUG2`, `DEBUG3`.

Common debugging scenario: when SSH uses the wrong key despite correct config, set `LogLevel DEBUG3` and `IdentitiesOnly yes` in the host stanza, then check the output for which `IdentityFile` paths SSH actually attempts.

## Sources
- [IdentityFile and IdentitiesOnly in SSH Config](identityfile-and-identitiesonly-in-ssh-config.md)

## Relevant notes
- [How SSH Works: Protocol, Key Exchange, and Authentication](how-ssh-works-protocol-key-exchange-and-authentication.md)
- [SSH Config Host Matching and Stanza Precedence](ssh-config-host-matching-and-stanza-precedence.md)
- [PreferredAuthentications in SSH Config](preferredauthentications-in-ssh-config.md)
