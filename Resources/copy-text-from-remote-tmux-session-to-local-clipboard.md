---
title: Copy Text from Remote Tmux Session to Local Clipboard
description: Methods for copying text from a remote tmux session over SSH to your local machine's clipboard, including OSC 52, tmux-yank, and simple workarounds.
author: pi
editor: lam
date: 2026-06-13T00:36:02.911Z
tags:
  - reference
  - tools
  - workflow
---

## Summary

When you run tmux on a remote server over SSH, the clipboard is no longer shared between your local machine and the tmux session. Tmux captures mouse and keyboard events, so normal terminal selection and Ctrl+C/Ctrl+V don't cross the SSH boundary. Several solutions exist, ranging from zero-config workarounds to OSC 52 escape sequence support.

## OSC 52 — the proper solution

OSC 52 (Operating System Command 52) is a terminal escape sequence that tells the terminal emulator to write text to the system clipboard. Tmux can forward copied text via OSC 52, which your local terminal emulator then writes to your clipboard.

**Server-side (tmux.conf):**

```
set -g set-clipboard on
```

**Client-side requirement:** Your local terminal emulator must support OSC 52. Most modern terminals do:
- iTerm2 (macOS) — enable "Allow clipboard access from terminal" in Preferences > General > Selection
- Kitty (Linux/macOS)
- Alacritty (Linux/macOS/Windows)
- WezTerm (cross-platform)
- Windows Terminal (Windows)
- Ghostty (macOS/Linux)
- tmux itself (nested) — needs `set-clipboard external` on the outer tmux

**How to use:** Enter tmux copy mode with Prefix+[ (default Ctrl+b then [), navigate with arrow keys or vim keys, press Space to start selecting, move to highlight, press Enter to copy. The text appears in your local clipboard immediately.

## Tmux Yank plugin

If you already use tpm (tmux plugin manager), install [tmux-yank](https://github.com/tmux-plugins/tmux-yank). It wraps OSC 52 and adds convenience keybindings like Prefix+y to copy the current selection to the system clipboard. It works over SSH out of the box.

```
set -g @plugin 'tmux-plugins/tmux-yank'
```

## Quick workarounds (no config change on server)

If you cannot modify the server's tmux config:

**Method 1 — Select with mouse + Alt/Option:**
Hold Alt (Linux/Windows) or Option (macOS) while selecting text with the mouse. This tells your terminal emulator to bypass tmux's mouse capture and use native terminal selection. Works in most terminal emulators.

**Method 2 — Disable tmux mouse mode temporarily:**
```
Prefix+m   (if you bind it) or run in tmux:  :set mouse off
```
Then select text normally with the mouse. Re-enable with `Prefix+m` or `:set mouse on`.

**Method 3 — Capture pane to file and read locally:**
On the server:
```
tmux capture-pane -pS - > /tmp/out.txt
```
Then on your local machine, `cat` the file or use `scp` to copy it. The `-p` flag outputs to stdout. `-S -` captures the entire history. Pipe to `pbcopy`, `xclip`, or `wl-copy` if you have clipboard tools on the server.

**Method 4 — SSH with X11 forwarding + xclip:**
If you SSH with `-X` flag, you can pipe tmux output to `xclip` on the server which forwards to your local X11 clipboard:
```
tmux capture-pane -pS - | xclip -selection clipboard
```

## Sources

- [tmux manual — set-clipboard option](https://man.archlinux.org/man/tmux.1#set-clipboard)
- tmux-yank plugin: https://github.com/tmux-plugins/tmux-yank
- [OSC 52 specification](https://invisible-island.net/xterm/ctlseqs/ctlseqs.html)

## Relevant notes

- [How Tmux Set-Clipboard Works Through a TTY over SSH](how-tmux-set-clipboard-works-through-a-tty-over-ssh.md)
