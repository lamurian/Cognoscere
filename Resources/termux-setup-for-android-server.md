---
title: Termux Setup for Android Server
description: How to use Termux with PRoot-distro to run server software on Android without root, including nginx, SSH, and keep-alive setup.
author: pi
editor: lam
date: 2026-07-13T19:08:45.977Z
tags:
  - android
  - server
  - self-hosting
  - mobile
  - linux
  - tutorial
  - termux
---
## Summary

Termux is the foundation for Android server setups without root. It provides a terminal emulator with packages compiled for Android's Bionic libc using native epoll() — no emulation overhead [@mia2026].

**Setup flow.** Install Termux from F-Droid (Play Store version is outdated). Run `pkg update && pkg upgrade`, then `pkg install proot-distro` and `proot-distro install debian`. Inside Debian, install server software with apt: nginx, Apache, or Node.js. For SSH access from other devices: `pkg install openssh` then `sshd` (listens on port 8022) [@mourad2025; @gangwar2022].

**Keeping the server alive.** Android aggressively kills background processes and disconnects WiFi when the screen is off. Disable battery optimization for Termux (Settings → Apps → Termux → Battery → Unrestricted). Run `termux-wake-lock` to prevent CPU sleep. Set a static DHCP lease on the router for a fixed local IP [@gangwar2022].

**Performance.** Termux + nginx serves with 8.3 ms median latency over Wi-Fi 6 at 50 req/sec, using 28 MB RAM idle. The main limit is Android's Low Memory Killer terminating processes above ~500 MB RSS [@mia2026].

## Relevant notes

- [App-Based Android Web Servers](Resources/app-based-android-web-servers.md)
- [Android to Linux Migration: Step-by-Step Guide](Resources/android-to-linux-migration-step-by-step-guide.md)
- [Android to Linux Migration: Approaches Overview](Resources/android-to-linux-migration-approaches-overview.md)
- [Mobile Apps for Pi Coding Agent Remote Access: Options Comparison](Resources/mobile-apps-for-pi-coding-agent-remote-access-options-comparison.md)
- [libhybris and Halium: Android Driver Compatibility Layer](Resources/libhybris-and-halium-android-driver-compatibility-layer.md)