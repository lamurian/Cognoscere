---
title: dwl Wayland Compositor — Compile-time Configuration via config.h
description: How dwl follows the suckless philosophy of compile-time configuration via editing config.h and recompiling.
author: pi
editor: lam
date: 2026-07-28T15:23:36.052Z
tags:
  - dwl
  - wayland
  - configuration
  - open-source
  - linux
---
## Summary

dwl is a compact, hackable Wayland compositor based on wlroots, designed as the Wayland equivalent of dwm. Like dwm, all configuration is done at compile time by editing the `config.h` file and recompiling. There is no runtime config file parser, no hot-reloading, and no GUI settings panel. This approach keeps the codebase small (single C source file) and avoids feature creep.

The default `config.def.h` file is well-commented and serves as the template that generates `config.h` at build time. Users copy `config.def.h` to `config.h`, edit the values, and run `make` to produce a new binary. The user's `config.h` is gitignored, so it does not conflict with upstream changes.

## Key Points

- **Everything in config.h:** appearance (border width, colors, fullscreen background), tag count (TAGCOUNT, max 31), keyboard layout (xkb_rules, repeat rate/delay), trackpad settings (tap-to-click, natural scrolling, scroll method, acceleration), monitor rules (name, mfact, nmaster, scale, layout, transform, position), client rules (app_id, title, tags, floating state, monitor assignment), keybindings (modifier, key, function, argument), mouse bindings, and layout definitions.
- **config.mk for build flags:** Uncomment `XWAYLAND` and `XLIBS` lines to enable XWayland support. This is the only build-level toggle exposed in the Makefile.
- **Rebuild required for every change:** Any modification to `config.h` requires `make && sudo make clean install` followed by restarting the compositor. Since Wayland does not allow restarting the WM independently of the display server, the user must log out and back in (or restart via a VT switch).
- **Default keybindings** use MODKEY (default Alt, changeable to Super/Logo) for operations: switching tags (Mod+[1-9]), moving windows (Mod+Shift+[1-9]), spawning terminal and menu (Mod+Shift+Enter, Mod+p), focus and layout control (Mod+j/k, Mod+i/d, Mod+h/l), and window management (close, fullscreen, floating toggle).

## Sources

- [dwl README — Codeberg](https://codeberg.org/dwl/dwl)
- [config.def.h — dwl main branch](https://raw.githubusercontent.com/djpohly/dwl/main/config.def.h)
- [ArchWiki — dwl](https://wiki.archlinux.org/title/Dwl)

## Relevant notes

- [dwl Wayland Compositor — Source-level Patching System](Resources/dwl-wayland-compositor-source-level-patching-system.md)
- [dwl Wayland Compositor — External Status Bar and Scripting](Resources/dwl-wayland-compositor-external-status-bar-and-scripting.md)
- [dwl Wayland Compositor — Startup Scripts, Display Manager, and Session Integration](Resources/dwl-wayland-compositor-startup-scripts-display-manager-and-session-integration.md)
- [surf: Minimalist suckless Browser](Resources/surf-minimalist-suckless-browser.md)
- [Hardware Driver Compatibility When Migrating Android to Linux](Resources/hardware-driver-compatibility-when-migrating-android-to-linux.md)