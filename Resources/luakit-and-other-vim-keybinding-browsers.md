---
title: Luakit and Other Vim-keybinding Browsers
description: Lua-scriptable keyboard-driven browser framework built on WebKit/GTK+
author: pi
editor: lam
date: 2026-07-03T16:00:39.049Z
tags:
  - open-source
  - browser
  - vim
  - keybindings
  - software
  - tools
---
Several other open-source browsers offer built-in vim keybindings with different tradeoffs. Luakit is a browser framework built on WebKit/GTK+ that uses Lua for all configuration, theming, and extension logic. It is designed for power users who want to script their browser entirely. Licensed under GPLv3, it supports Linux and BSD. Its Lua-based extensibility makes it unique among vim-keybinding browsers — users can override any aspect of browser behaviour through Lua scripts. It remains actively maintained with regular releases.

wyeb is a vim-like webkit2gtk browser written entirely in C. Its key differentiator is an editable markdown homepage that serves as the bookmarks and settings file, opened by pressing `e` in a text editor. All configuration is managed through text files, monitored for changes in real time. Features include hinting, URL-matched regex settings, rocker and middle-button gestures, pointer mode for JS-heavy pages, range hinting, and an adblock extension. It also supports window-list mode (key `z`) as an alternative to traditional tabs.

Nyxt is a keyboard-driven browser written in Lisp that supports both Vim and Emacs keybinding styles. It uses either QtWebEngine or GTK+/WebKit2. Its Lisp foundation makes it deeply programmable at runtime — users can redefine any function while the browser is running. Nyxt has faced some controversy regarding a critical remote code execution vulnerability in 2019 that was reportedly handled poorly (noted in qutebrowser's README). It remains actively developed for Linux and macOS.

Vieb is a vim-inspired Electron browser with adblocking, AMP protection, custom redirects, strict privacy settings, and window splitting. Being Electron-based, it is heavier than C-based alternatives (Vimb, surf) but offers cross-platform support and easier installation. It provides a comprehensive set of vim commands including tabs, buffers, marks, and registers.

## Relevant notes

- [Lightweight Vim-keybinding Browser Comparison](Resources/lightweight-vim-keybinding-browser-comparison.md)
- [Browser Extensions for Vim Keybindings](Resources/browser-extensions-for-vim-keybindings.md)
- [surf: Minimalist suckless Browser](Resources/surf-minimalist-suckless-browser.md)
- [Vimb: Lightweight Vim-like Browser](Resources/vimb-lightweight-vim-like-browser.md)
- [qutebrowser: Python/Qt Keyboard-driven Browser](Resources/qutebrowser-python-qt-keyboard-driven-browser.md)