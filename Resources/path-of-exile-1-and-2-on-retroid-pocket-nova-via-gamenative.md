---
title: Path of Exile 1 and 2 on Retroid Pocket Nova via GameNative
description: Path of Exile 1 and 2 performance analysis on Retroid Pocket Nova via GameNative
author: pi
editor: lam
date: 2026-09-11T15:46:58.962Z
tags:
  - consumer-tech
  - gaming
  - performance
  - mobile
  - review
---
## Summary

Path of Exile 1 (PoE1) and Path of Exile 2 (PoE2) are demanding online ARPGs from Grinding Gear Games with significantly different hardware requirements. The Retroid Pocket Nova's Snapdragon 8 Gen 2-class QCS8550 with Adreno 740 GPU faces substantial challenges running either title through GameNative, though PoE1 is more feasible than PoE2.

**Path of Exile 1** has modest minimum requirements: quad-core 2.6GHz CPU, 8GB RAM, and GTX 650 Ti / HD 7850-class GPU with DirectX 11. Through GameNative on Snapdragon 8 Gen 2 devices, PoE1 has been reported as playable on the Odin 2 Mini Pro (same SoC class as the Nova), though setup requires significant configuration effort. The game is free-to-play, making it zero-cost to test. Performance varies — end-game content with many particle effects and monsters can cause frame drops. The 4:3 display on the Nova will show black bars since PoE uses an isometric perspective optimized for widescreen. Controller support exists natively in PoE1, which helps with handheld play [@grindinggeargames2013].

**Path of Exile 2** has substantially higher requirements: Intel i7-7700 / Ryzen 5 2500x, 8GB RAM, GTX 960 (3GB VRAM) minimum, DirectX 12, and 100GB storage. PoE2 is still in Early Access (leaving December 11, 2026) with known performance issues even on dedicated gaming hardware. Forum reports indicate that even Steam Deck, ROG Ally, and ONEXFLY handheld PCs struggle with PoE2 — users report 50 FPS at full 30W power, dropping to 15 FPS during combat with rituals or expedition encounters. On the Nova's mobile SoC, PoE2 is effectively unplayable through GameNative. The game's DirectX 12 requirement, high VRAM needs, and poor optimization make it incompatible with the translation layer's current capabilities [@grindinggeargames2024; @noskins2025].

GameNative 1.2's automatic power tuning helps with battery and thermal management but cannot overcome the fundamental GPU performance gap for demanding 3D titles like PoE2. The project's compatibility list should be checked for any updates, but as of the Nova's release window, neither PoE1 nor PoE2 are confirmed as well-optimized GameNative titles.

## Key Points

- **PoE1**: Playable on Snapdragon 8 Gen 2 via GameNative with configuration; free-to-play; 4:3 display adds black bars; controller support exists
- **PoE2**: Effectively unplayable on Nova via GameNative; requires GTX 960 (3GB VRAM) minimum, DX12; even dedicated handheld PCs (Steam Deck, Ally) struggle at 15-50 FPS
- PoE1 min specs: quad-core 2.6GHz, 8GB RAM, GTX 650 Ti, DX11, 40GB storage
- PoE2 min specs: i7-7700/Ryzen 5 2500x, 8GB RAM, GTX 960 3GB, DX12, 100GB storage
- PoE2 Early Access performance issues acknowledged by community even on dedicated gaming hardware
- GameNative 1.2 auto-tuning helps thermals but cannot bridge GPU performance gap for demanding 3D titles
- Alternative: Path of Exile Mobile exists as a separate mobile-native version (not via GameNative)

## Sources

@grindinggeargames2013, @grindinggeargames2024, @noskins2025

## Relevant notes

- [GameNative Performance: Terraria, Stardew Valley, and Valheim on Retroid Pocket Nova](Resources/gamenative-performance-terraria-stardew-valley-and-valheim-on-retroid-pocket-nova.md)
- [GameNative: PC Gaming Compatibility Layer for Android](Resources/gamenative-pc-gaming-compatibility-layer-for-android.md)
- [Retroid Pocket Nova: Specifications and Emulation Performance](Resources/retroid-pocket-nova-specifications-and-emulation-performance.md)
- [Lightweight Pokemon Go Fitness Alternatives for Android](Resources/lightweight-pokemon-go-fitness-alternatives-for-android.md)
- [Step-Powered RPGs for Android Without GPS](Resources/step-powered-rpgs-for-android-without-gps.md)