---
title: Text-based Terminal Browsers with Vi-like Keys
description: Lynx, w3m, ELinks, browsh — terminal browsers with vi-like keybindings for minimal resource use
author: pi
editor: lam
date: 2026-07-03T16:00:17.424Z
tags:
  - open-source
  - browser
  - vim
  - keybindings
  - software
  - tools
  - terminal
  - comparison
---
Text-based terminal browsers offer the lowest possible resource consumption for web browsing, rendering pages as text within a terminal emulator. Several support vi-like keybindings natively, making them ideal for low-resource systems, SSH sessions, or distraction-free reading of text-heavy content. They cannot render modern SPAs, WebGL, video, or complex CSS.

Lynx is the oldest maintained web browser (first released 1992). It supports vi-like movement with the `-vikeys` flag, configurable via `alias lynx='lynx -vikeys'`. Written in C, GPL-2.0, latest v2.9.3 (May 2026). Supports cookies, SSL, basic HTML forms, and uses approximately ~5MB memory. Available on all platforms including BSD, Haiku, Linux, macOS, Windows, and RISC OS.

w3m offers vim-like keyboard shortcuts and doubles as a terminal pager (similar to `less` but with hyperlink support). It supports tables, frames, SSL, and inline images in supporting terminals. MIT license, v0.5.6 (Jan 2026). ELinks is an active fork of Links with JavaScript support via SpiderMonkey engine and Lua scripting — the most capable terminal browser. GPL-2.0, v0.19.1 (Feb 2026).

browsh takes a different approach: it uses a headless Firefox instance to fully render pages (including CSS and JS) and then translates the output to terminal-friendly format. Written in Go with an MIT license. While it renders modern pages accurately, it requires Firefox and Go runtime, making it heavier than other terminal browsers and somewhat defeating the minimal-resource purpose.

For pure resource efficiency, Lynx with `-vikeys` is the best choice (~5MB). w3m offers a good balance of features and lightness. ELinks provides the most capable terminal-browser feature set (JS + Lua). browsh offers modern page fidelity at higher resource cost.

## Relevant notes

- [Lightweight Vim-keybinding Browser Comparison](Resources/lightweight-vim-keybinding-browser-comparison.md)
- [Vimb: Lightweight Vim-like Browser](Resources/vimb-lightweight-vim-like-browser.md)
- [qutebrowser: Python/Qt Keyboard-driven Browser](Resources/qutebrowser-python-qt-keyboard-driven-browser.md)
- [Mobile Apps for Pi Coding Agent Remote Access: Options Comparison](Resources/mobile-apps-for-pi-coding-agent-remote-access-options-comparison.md)
- [Copy Text from Remote Tmux Session to Local Clipboard](Resources/copy-text-from-remote-tmux-session-to-local-clipboard.md)