---
title: 'qutebrowser: Python/Qt Keyboard-driven Browser'
description: Most popular keyboard-driven vim-like browser based on Python and Qt
author: pi
editor: lam
date: 2026-07-03T16:00:10.603Z
tags:
  - open-source
  - browser
  - vim
  - keybindings
  - software
  - tools
  - python
---
qutebrowser is the most popular keyboard-driven vim-like browser with ~11,600 GitHub stars. Built on Python and Qt, it uses QtWebEngine (Chromium-based) as its rendering backend and provides comprehensive vim keybindings, tab management, hinting, and adblocking. It is cross-platform (Linux, macOS, Windows) and actively maintained (v3.7.0, Apr 2026) (github.com/qutebrowser/qutebrowser).

Features include a full vim-like modal interface, hinting for link selection, adblocking via the `adblock` library, multiple tab modes, command history and completion, session management, PDF viewing via pdf.js, and extensive Python-based configuration. Requirements are Python 3.9+, Qt 6.2+ (or 5.15+), PyQt, jinja2, and PyYAML.

qutebrowser is lighter than Chrome or Firefox but heavier than Vimb or terminal browsers. The QtWebEngine backend wraps Chromium, inheriting most of its memory usage, and the Python layer adds additional overhead. Typical memory consumption is ~200-400MB with several tabs open. For truly minimal resource usage on Linux, Vimb (C/GTK) is a better choice.

Compared to Vimb, qutebrowser is cross-platform while Vimb is Linux-only. qutebrowser offers more features (adblocking, session management, PDF viewer) but at higher resource cost. Vimb prioritises minimalism and low memory, while qutebrowser prioritises feature completeness and cross-platform support.

The project is funded through donations, with its primary maintainer (The-Compiler) working part-time. Downloads are available via GitHub releases for Windows, and through package managers on Linux (Arch, Debian, Fedora, Gentoo) and macOS (Homebrew). It was inspired by dwb and Vimperator/Pentadactyl.

## Relevant notes

- [Lightweight Vim-keybinding Browser Comparison](Resources/lightweight-vim-keybinding-browser-comparison.md)
- [Vimb: Lightweight Vim-like Browser](Resources/vimb-lightweight-vim-like-browser.md)
- [Image Compression Strategies Before Upload](Resources/image-compression-strategies-before-upload.md)
- [Paseo: Cross-Device Coding Agent Orchestration — Executive Summary](Resources/paseo-cross-device-coding-agent-orchestration-executive-summary.md)
- [Paseo Architecture: Daemon-Based Cross-Device Agent Orchestration](Resources/paseo-architecture-daemon-based-cross-device-agent-orchestration.md)