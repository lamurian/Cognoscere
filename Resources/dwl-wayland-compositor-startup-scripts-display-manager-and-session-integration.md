---
title: dwl Wayland Compositor — Startup Scripts, Display Manager, and Session Integration
description: How to launch dwl from a display manager, VT, or with a startup script for a complete session.
author: pi
editor: lam
date: 2026-07-28T15:23:36.057Z
tags:
  - dwl
  - wayland
  - setup
  - configuration
  - linux
---
## Summary


dwl can be launched from a display manager (via the provided `.desktop` entry), from a VT console directly, or with a startup script that configures the session environment, launches a status bar, wallpaper, notification daemon, and other services. The `-s` flag is the primary mechanism for session orchestration, but because the startup command cannot modify dwl's own environment, critical variables like `XDG_RUNTIME_DIR` and Wayland display must be set before dwl starts.

For display manager integration, dwl ships with `dwl.desktop`. The `-d` flag enables full wlroots debug logging. The `-v` flag prints the version. Runtime flags are minimal — intentional per the suckless philosophy.

## Key Points

- **VT startup:** Run `dwl` directly from a TTY. Requires `seatd` or `elogind`+`polkit` for seat management. User must be in the `video` and `input` groups, or seat management handles permissions automatically.
- **Startup script template:** `dwl -s '~/.config/dwl/autostart.sh'` where the script sources env vars, starts a bar (e.g., `waybar`), wallpaper setter (`wbg`, `swaybg`), notification daemon (`mako`, `dunst`), and idle manager (`swayidle`). The script must close stdin (`exec <&-`) unless it actively reads the status pipe.
- **Session env vars** commonly set before dwl: `XDG_SESSION_TYPE=wayland`, `XDG_CURRENT_DESKTOP=sway` (works as a compatibility preset), `QT_QPA_PLATFORM=wayland`, `ELECTRON_OZONE_PLATFORM_HINT=wayland`, `_JAVA_AWT_WM_NONREPARENTING=1` (for Java apps).
- **Runtime flags** are minimal: `-s` (startup command), `-d` (debug logging), `-v` (version). No runtime config reload, no IPC, no command socket — all changes require a rebuild and compositor restart.

## Sources

- [dwl(1) man page](https://raw.githubusercontent.com/djpohly/dwl/main/dwl.1)
- [dwl README — Running dwl](https://codeberg.org/dwl/dwl)
- [Void Linux with dwl — Corey Stephan](https://www.coreystephan.com/void-dwl/)
- [ArchWiki — dwl](https://wiki.archlinux.org/title/Dwl)

## Relevant notes

- [dwl Wayland Compositor — External Status Bar and Scripting](Resources/dwl-wayland-compositor-external-status-bar-and-scripting.md)
- [dwl Wayland Compositor — Compile-time Configuration via config.h](Resources/dwl-wayland-compositor-compile-time-configuration-via-config-h.md)
- [dwl Wayland Compositor — Source-level Patching System](Resources/dwl-wayland-compositor-source-level-patching-system.md)
- [Linux Deploy: Chroot Linux Server on Android](Resources/linux-deploy-chroot-linux-server-on-android.md)
- [Android Phone as Server: Approaches Overview](Resources/android-phone-as-server-approaches-overview.md)