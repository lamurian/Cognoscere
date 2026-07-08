---
title: Browser Extensions for Vim Keybindings
description: Browser extensions that add vim-like keyboard navigation to Chrome, Firefox, Safari, and Edge
author: pi
editor: lam
date: 2026-07-03T16:00:23.925Z
tags:
  - open-source
  - browser
  - vim
  - keybindings
  - software
  - tools
  - productivity
---
For users who want vim keybindings without switching to a niche browser, browser extensions provide the easiest path. They add modal navigation, hinting, tab management, and vim-style search to mainstream browsers while retaining full compatibility with websites, extensions, and developer tools.

Vimium is the most popular vim extension for Chrome/Chromium (also available for Firefox as Vimium-FF). It provides link hinting, `j`/`k` scrolling, `/` search, tab navigation with `J`/`K`, and custom key mappings via JSON configuration. Open source under MIT license (github.com/philc/vimium). Vimium C is a performant fork with optimised code and additional features like command sequences and global shortcuts.

Tridactyl is the leading vim extension for Firefox, replacing the default browser UI with a vim-like command mode. It provides hinting, `:buffer` tab switching, external editor integration via native messaging, and extensive configuration. It is the recommended replacement for the now-deprecated Vimperator and Pentadactyl extensions (github.com/tridactyl/tridactyl).

Surfingkeys works across Chrome, Firefox, Safari, and Edge with JavaScript-based configuration where users define key mappings and custom functions in a JS config file. Features include visual mode, rich hinting, emoji completion in insert mode, PDF support, and session management. Vimari provides basic vim keybindings for Safari (github.com/ueokande/vimari).

Note that these extensions add functionality on top of existing browser overhead. They do not reduce resource consumption — they layer vim navigation on Chrome or Firefox's existing memory usage. For users who want both vim keybindings and reduced resource consumption, a standalone lightweight browser like Vimb or a terminal browser like Lynx is the better choice.

## Relevant notes

- [Lightweight Vim-keybinding Browser Comparison](Resources/lightweight-vim-keybinding-browser-comparison.md)
- [qutebrowser: Python/Qt Keyboard-driven Browser](Resources/qutebrowser-python-qt-keyboard-driven-browser.md)
- [Vimb: Lightweight Vim-like Browser](Resources/vimb-lightweight-vim-like-browser.md)
- [Text-based Terminal Browsers with Vi-like Keys](Resources/text-based-terminal-browsers-with-vi-like-keys.md)
- [Copy Text from Remote Tmux Session to Local Clipboard](Resources/copy-text-from-remote-tmux-session-to-local-clipboard.md)