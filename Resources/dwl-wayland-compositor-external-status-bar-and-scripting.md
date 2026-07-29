---
title: dwl Wayland Compositor — External Status Bar and Scripting
description: How dwl communicates with external status bars via stdin and supports startup scripting.
author: pi
editor: lam
date: 2026-07-28T15:23:36.056Z
tags:
  - dwl
  - wayland
  - status-bar
  - configuration
  - linux
---
## Summary

dwl does not ship with a built-in status bar (unlike dwm). Instead, it writes status information — selected layouts, current window title, app-id, and selected/occupied/urgent tags — to the stdin of the startup command specified via the `-s` flag. This design keeps the compositor agnostic to rendering libraries (fonts, drawing) while enabling full flexibility in bar choice.

The `-s` startup command runs as a child process of dwl. dwl sends status lines to its stdin. If the command does not read stdin, dwl will eventually block when the pipe buffer fills up. The workaround is to redirect stdin with `<&-` in the shell command.

## Key Points

- **Status output format:** dwl's `printstatus()` function writes tab-separated fields to the child's stdin. External bars (Waybar, eww, polybar, yambar) or scripts parse this data to display window titles, tag states, and layout indicators.
- **External bar ecosystem** includes Waybar, eww, yambar, i3status-rust, and slstatus. The bar patch from dwl-patches adds a minimal dwm-style built-in bar.
- **slstatus integration:** The suckless `slstatus` tool can pipe its output into dwl's status area (when using the bar patch) via `slstatus -s | dwl`. slstatus itself is compile-time configurable (CPU, RAM, battery, network, datetime).
- **Startup scripting** (`-s` flag): runs a shell command at compositor startup. dwl sends SIGTERM to this process at shutdown and waits for it to terminate. This is ideal for launching service managers (s6, runit, dinit, systemd --user) or session scripts that set environment variables, start bars, and launch background services.
- **Environment variables:** dwl reads `XDG_RUNTIME_DIR`, `WLR_*`, `XKB_*`, `XCURSOR_PATH`, and standard Wayland variables. It sets `WAYLAND_DISPLAY` and optionally `DISPLAY` for XWayland. The `-s` command does not inherit the ability to affect dwl's environment — session env vars must be set before launching dwl.

## Sources

- [dwl README — Status information section](https://codeberg.org/dwl/dwl)
- [dwl(1) man page](https://raw.githubusercontent.com/djpohly/dwl/main/dwl.1)
- [ArchWiki — dwl usage](https://wiki.archlinux.org/title/Dwl)
- [Void Linux with dwl — Corey Stephan](https://www.coreystephan.com/void-dwl/)

## Relevant notes

- [dwl Wayland Compositor — Startup Scripts, Display Manager, and Session Integration](Resources/dwl-wayland-compositor-startup-scripts-display-manager-and-session-integration.md)
- [dwl Wayland Compositor — Source-level Patching System](Resources/dwl-wayland-compositor-source-level-patching-system.md)
- [dwl Wayland Compositor — Compile-time Configuration via config.h](Resources/dwl-wayland-compositor-compile-time-configuration-via-config-h.md)
- [Sandboxing and Execution Isolation in Pi Agent](Resources/sandboxing-and-execution-isolation-in-pi-agent.md)
- [Linux Deploy: Chroot Linux Server on Android](Resources/linux-deploy-chroot-linux-server-on-android.md)