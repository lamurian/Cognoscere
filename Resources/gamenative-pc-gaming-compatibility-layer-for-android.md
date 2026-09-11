---
title: 'GameNative: PC Gaming Compatibility Layer for Android'
description: GameNative open-source Android app for running PC games natively on mobile devices
author: pi
editor: lam
date: 2026-09-11T08:52:33.059Z
tags:
  - consumer-tech
  - gaming
  - mobile
  - software
  - compatibility
---
## Summary

GameNative is a free, open-source Android application that runs PC games from Steam, Epic, GOG, and Amazon libraries locally on Android hardware. Unlike cloud gaming services, it executes Windows executables on-device using compatibility layers derived from Valve's Proton, translating x86 Windows code to ARM64 Android. The project has over 10,400 GitHub stars and a 35,000+ member Discord community.

The app uses a container system to run Windows games, with community-submitted configurations automatically applied to known titles. Cloud saves sync between PC and Android, Steam DLC and workshop content are supported, and a custom on-screen control editor handles touch/gamepad mapping. GameNative explicitly supports Qualcomm Adreno GPUs, Imagination PowerVR (Pixel 10 Tensor G5), and select Samsung Exynos chips.

Version 1.2.0 (August 2026) introduced automatic CPU/GPU power tuning using PID controllers that dynamically adjust performance based on target FPS. This reduces power consumption, temperatures, and thermal throttling while maintaining stable frame rates. The system monitors FPS, CPU usage, and GPU usage in real-time with separate controllers for CPU and GPU [@whycry2026; @ashlockett2026].

Compatibility varies by game and device. The project maintains a public compatibility list at gamenative.app/compatibility. Lightweight 2D games and older 3D titles generally run well on Snapdragon 8 Gen 2-class hardware. Demanding 3D titles may require lower settings or may not be playable. Known configs are community-contributed and automatically applied when a game is detected. GameNative 1.2 adds specific support for the Retroid Pocket Nova alongside existing Retroid Pocket and AYN device support [@whycry2026; @utkarshdalal2026].

## Key Points

- Free, open-source (GPL-3.0), no subscription required
- Runs PC games locally on Android via compatibility layers (not streaming)
- Supports Steam, Epic, GOG, and Amazon game libraries
- Cloud saves sync between PC and Android devices
- Community-submitted configs auto-applied for known games
- v1.2 adds automatic CPU/GPU power tuning with PID controllers
- Supported hardware: Qualcomm Adreno, PowerVR (Pixel 10), select Samsung Exynos
- Retroid Pocket Nova support added in v1.2

## Sources

@utkarshdalal2026, @whycry2026, @ashlockett2026

## Relevant notes

- [GameNative Performance: Terraria, Stardew Valley, and Valheim on Retroid Pocket Nova](Resources/gamenative-performance-terraria-stardew-valley-and-valheim-on-retroid-pocket-nova.md)
- [Lightweight Pokemon Go Fitness Alternatives for Android](Resources/lightweight-pokemon-go-fitness-alternatives-for-android.md)
- [Android to Linux Migration: Approaches Overview](Resources/android-to-linux-migration-approaches-overview.md)
- [libhybris and Halium: Android Driver Compatibility Layer](Resources/libhybris-and-halium-android-driver-compatibility-layer.md)
- [Retroid Pocket Nova: Specifications and Emulation Performance](Resources/retroid-pocket-nova-specifications-and-emulation-performance.md)