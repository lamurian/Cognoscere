---
title: 'surf: Minimalist suckless Browser'
description: Minimalist keyboard-driven browser from suckless.org with WebKit2/GTK+
author: pi
editor: lam
date: 2026-07-03T16:00:31.383Z
tags:
  - open-source
  - browser
  - vim
  - keybindings
  - software
  - tools
  - terminal
---
surf is a minimalist web browser from suckless.org, a project known for the Unix philosophy of simplicity and minimal code. Written in C using WebKit2/GTK+, the binary is approximately 30KB. It has no tabs, no GUI controls, no settings dialogs — just a web view window. Navigation is done entirely via keyboard shortcuts or by setting XProperties.

Key features include support for the XEmbed protocol, making it possible to embed surf inside other applications or tabbed window managers like `tabbed` (also from suckless). Users can point surf to another URI by setting its XProperties. It supports WebP, JavaScript, frames, and scored 100/100 on Acid3 and 385/500 on HTML5 test. License is MIT.

surf is designed for users who want complete control through their window manager and keyboard. It follows the suckless philosophy of doing one thing well. It does not provide built-in vim keybindings per se, but its keyboard-driven nature combined with the minimal interface makes it suitable for vim users who manage browsing through tiling window managers.

The latest release is v2.1 (May 2021). It is available on Linux and BSD systems through package managers. Build dependencies include `webkit2gtk` and `gtk+`. Configure via editing `config.h` before compilation, following suckless conventions. It is considered stable but has had no new releases since 2021.

## Relevant notes

- [Lightweight Vim-keybinding Browser Comparison](Resources/lightweight-vim-keybinding-browser-comparison.md)
- [Browser Extensions for Vim Keybindings](Resources/browser-extensions-for-vim-keybindings.md)
- [Text-based Terminal Browsers with Vi-like Keys](Resources/text-based-terminal-browsers-with-vi-like-keys.md)
- [Vimb: Lightweight Vim-like Browser](Resources/vimb-lightweight-vim-like-browser.md)
- [qutebrowser: Python/Qt Keyboard-driven Browser](Resources/qutebrowser-python-qt-keyboard-driven-browser.md)