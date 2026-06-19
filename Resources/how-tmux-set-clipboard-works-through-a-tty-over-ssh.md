---
title: How Tmux Set-Clipboard Works Through a TTY over SSH
description: Explains the OSC 52 escape sequence path from remote tmux through SSH and PTY chain to the local terminal emulator's clipboard.
author: pi
editor: lam
date: 2026-06-13T00:53:00.675Z
tags:
  - reference
  - tools
  - workflow
  - security
---

## Summary

When you run tmux on a remote server over SSH, `set -g set-clipboard on` works because the entire connection is built on PTYs that pass terminal escape sequences transparently. SSH does not filter or modify escape sequences — it is a byte-transparent pipe for terminal I/O. The OSC 52 sequence travels from tmux to your local terminal emulator unchanged.

## The byte path

```
tmux (server)
  → remote PTY (/dev/pts/*)
    → SSH server
      → encrypted SSH tunnel
        → SSH client
          → local PTY
            → local terminal emulator
              → writes to system clipboard
```

When you copy text in tmux, it writes an OSC 52 escape sequence to its output:

```
\033]52;c;<base64-encoded-text>\033\\
```

Each link in the chain passes bytes through without inspection:
- The **remote PTY** is a kernel device pair — bytes written to the master end appear on the slave end and vice versa. No filtering.
- **SSH** requests a PTY on the remote side (`ssh -t` or by default for interactive sessions). It reads raw bytes from that PTY and forwards them over the encrypted channel. The `PermitTTY` and `PermitUserRC` options on the server control PTY allocation but do not inspect byte content.
- The **local PTY** delivers bytes to the terminal emulator's input queue.

Only the local terminal emulator interprets the OSC 52 sequence and decides whether to write to the clipboard.

## set-clipboard value comparison

| Value | Sends OSC 52 (copy out) | Accepts OSC 52 (paste in) | Use case |
|---|---|---|---|
| `off` | No | No | No clipboard integration |
| `on` | Yes | Yes | Bidirectional — allows both directions |
| `external` | Yes | No | Prevents terminal from injecting clipboard into tmux |

`external` is the safest choice for most setups. It allows tmux to push copied text to your local clipboard but rejects incoming OSC 52 sequences from the terminal emulator. This prevents untrusted content from silently entering tmux's paste buffer — relevant when pasting into a terminal that echoes back the pasted content.

## Local terminal requirements

The remote server has no requirements beyond `set -g set-clipboard on` or `external`. All the clipboard handling happens on the local side. The terminal emulator must:

1. Support OSC 52 (most modern ones do).
2. Have clipboard access enabled in its settings.
3. Be able to decode base64 and write to the OS clipboard API.

## Relevant notes

- [Copy Text from Remote Tmux Session to Local Clipboard](copy-text-from-remote-tmux-session-to-local-clipboard.md)
