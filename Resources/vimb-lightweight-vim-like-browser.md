---
title: 'Vimb: Lightweight Vim-like Browser'
description: Vimb is a C/WebKitGTK vim-like browser prioritising low memory and CPU usage
author: pi
editor: lam
date: 2026-07-03T16:00:04.585Z
tags:
  - open-source
  - browser
  - vim
  - keybindings
  - software
  - tools
  - terminal
---
Vimb is a vim-like browser written in C (90%) using WebKitGTK and the GTK toolkit. It explicitly targets low memory and CPU usage while providing a complete keyboard-driven browsing experience. It is the lightest GUI browser with native vim keybindings, available on Linux only. Latest release v3.7.1 (Feb 2026), ~1,500 GitHub stars (github.com/fanglingsu/vimb).

It provides a modal interface (normal, insert, command modes like Vim), native tabs via GTK4's GtkNotebook navigated with `gt`/`gT`, hinting for link selection, SSL validation, URL shortcuts with placeholders, read-it-later queue, yank/paste registers, and vim-like autocmd. The browser migrated to GTK4 and WebKitGTK 6.0 for modern web standards support (fanglingsu.github.io/vimb/).

Vimb's C codebase avoids the overhead of Python (qutebrowser) or JavaScript/Electron (Vieb). The WebKitGTK engine is the main memory consumer, but Vimb adds minimal overhead — typically ~50-80MB total with one tab, versus ~200-400MB for qutebrowser or mainstream browsers. It is commonly used on Raspberry Pi and low-spec Linux systems.

Dependencies include `gtk4`, `webkitgtk-6.0`, and optionally `gst-libav` and `gst-plugins-good` for media decoding. Packages are available on Arch (`community/vimb`), Debian/Ubuntu (trixie/sid), Fedora, Gentoo, openSUSE, and pkgsrc. Build from source with `make && make install` using the provided Makefile.

Key features include its modal design (Vim-like modes for each browser interaction), runtime configuration changes with vim-like `set` syntax, command history with completions, and user-defined URL shortcuts with placeholders. It also supports multiple yank/paste registers for efficient URL and text management.

## Relevant notes

- [Lightweight Vim-keybinding Browser Comparison](Resources/lightweight-vim-keybinding-browser-comparison.md)
- [Mobile Apps for Pi Coding Agent Remote Access: Options Comparison](Resources/mobile-apps-for-pi-coding-agent-remote-access-options-comparison.md)
- [Copy Text from Remote Tmux Session to Local Clipboard](Resources/copy-text-from-remote-tmux-session-to-local-clipboard.md)
- [Image Compression Strategies Before Upload](Resources/image-compression-strategies-before-upload.md)
- [Paseo Architecture: Daemon-Based Cross-Device Agent Orchestration](Resources/paseo-architecture-daemon-based-cross-device-agent-orchestration.md)