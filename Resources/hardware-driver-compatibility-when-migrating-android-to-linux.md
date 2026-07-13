---
title: Hardware Driver Compatibility When Migrating Android to Linux
description: Detailed breakdown of which hardware features work on Linux after Android migration — WiFi, Bluetooth, GPU, cameras, sensors.
author: pi
editor: lam
date: 2026-07-13T18:59:21.437Z
tags:
  - mobile
  - linux
  - hardware
  - drivers
  - compatibility
  - kernel
---

**WiFi and Bluetooth:** Best-supported features. Broadcom BCM43xx, Qualcomm Atheros, and some MediaTek chipsets have mainline drivers. libhybris distributions reuse Android HALs directly via binder-IPC, making these reliable [@pixelclinuxcontributors2025; @libhybriscontributors2025].

**Display and touchscreen:** Work on well-mainlined devices with correct Device Tree configuration. Ilitek ILI2120 and similar I2C touchscreens have mainline drivers. Caveat: Pixel C's panel backlight needs manual wake after suspend [@pixelclinuxcontributors2025].

**GPU acceleration:** Biggest challenge. Adreno GPUs use open-source Freedreno driver with patched Mesa 18.1+. Nvidia Tegra uses Nouveau. Automatic GPU reclocking often remains partial. Full 3D acceleration needs proper firmware and patched userspace [@pixelclinuxcontributors2025; @weiss2022].

**Problematic components:** Cameras most difficult (proprietary ISP pipelines). Audio, GPS, NFC, sensors rarely functional on mainline. USB gadget mode and suspend-to-RAM frequently broken. libhybris mitigates these by reusing Android HALs for cameras and sensors [@pixelclinuxcontributors2025; @weiss2022].