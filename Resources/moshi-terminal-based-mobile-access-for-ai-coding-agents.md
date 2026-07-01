---
title: 'Moshi: Terminal-Based Mobile Access for AI Coding Agents'
description: Moshi is a mobile SSH/Mosh terminal app purpose-built for AI coding agents with tmux integration, voice input, and push notifications
author: pi
editor: lam
date: 2026-07-01T15:12:19.746Z
tags:
  - research
  - mobile
  - terminal
  - remote-access
  - ssh
  - tmux
source: https://getmoshi.app/, https://apps.apple.com/us/app/moshi-ssh-mosh-terminal/id6757859949
---
## Summary

Moshi is a mobile terminal app for iOS and Android purpose-built for AI coding agent workflows. Unlike relay-based solutions, it provides a direct SSH/Mosh connection to the server — giving users a full terminal with the agent's CLI rather than a custom chat UI.

**Why Moshi over relay apps.** Moshi replaces the terminal client, not the agent. If you already run pi (or Claude Code, Codex) inside tmux on a server, Moshi gives you a mobile-optimised terminal to connect. Deep tmux integration with picker, panels, and gestures makes managing multiple agent sessions practical on a phone.

**Key features.** Native Mosh protocol survives network switches and app kills. Voice input (on-device speech: Parakeet, Whisper, Apple, or cloud). Image paste and annotation. In-app browser for dev servers. Lock Screen Live Activity and Dynamic Island. Apple Watch. Push notifications via moshi-hook webhooks. Face ID for SSH keys. Hardware keyboard on iPad. Rated 4.8 on App Store (750+ ratings). An installable agent skill (`npx skills add rjyo/moshi-skill`) teaches the agent Moshi best practices.

**Trade-offs.** Moshi is a terminal, not a custom agent UI. You see raw agent output (pi's TUI, Claude Code's terminal) rather than a structured chat view. Users who already use tmux on desktop find this natural on mobile. Less feature discoverability than purpose-built agent apps, but full agent functionality with no feature subsetting.

**Recommended setup.** Run pi inside tmux on the server (vanilla tmux or herdr). Configure tmux for mobile-friendly layouts. Use Moshi's tmux integration for session navigation. Pair with moshi-hook for push notifications.

## Relevant notes

- [Mobile Apps for Pi Coding Agent Remote Access: Options Comparison](Resources/mobile-apps-for-pi-coding-agent-remote-access-options-comparison.md)
- [Paseo vs Alternative Free Open Source Agent Orchestrators](Resources/paseo-vs-alternative-free-open-source-agent-orchestrators.md)
- [How Tmux Set-Clipboard Works Through a TTY over SSH](Resources/how-tmux-set-clipboard-works-through-a-tty-over-ssh.md)
- [Copy Text from Remote Tmux Session to Local Clipboard](Resources/copy-text-from-remote-tmux-session-to-local-clipboard.md)
- [remote-pi: Native Mobile App for Pi Coding Agent](Resources/remote-pi-native-mobile-app-for-pi-coding-agent.md)