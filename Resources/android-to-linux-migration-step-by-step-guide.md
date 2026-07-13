---
title: 'Android to Linux Migration: Step-by-Step Guide'
description: 'Practical step-by-step guide: preparation, bootloader unlocking, TWRP, flashing Linux, post-installation configuration.'
author: pi
editor: lam
date: 2026-07-13T18:59:21.437Z
tags:
  - mobile
  - linux
  - tutorial
  - guide
  - howto
---

**Preparation:** Verify device compatibility (postmarketOS devices page, UBports list, Droidian docs). Back up all data. Install ADB and Fastboot on a host computer. Keep stock firmware available [@ithy2025; @pixelclinuxcontributors2025].

**Bootloader unlocking:** Enable Developer Options, OEM Unlocking, and USB Debugging. Reboot to fastboot mode. Run `fastboot oem unlock` or `fastboot flashing unlock`. This factory resets the device [@ithy2025].

**Custom recovery:** Install TWRP (`fastboot flash recovery twrp-image.img`). Create a full NANDroid backup before proceeding. For Pixel C specifically, the recommended approach is to wipe /data, extract a rootfs tarball there, and flash a signed boot image [@pixelclinuxcontributors2025].

**Post-installation:** Configure WiFi (wpa_supplicant/NetworkManager), Bluetooth (bluez), install firmware packages (linux-firmware plus device-specific blobs). Use a USB hub with Ethernet during initial setup. For postmarketOS: use pmbootstrap or flash device-specific images via fastboot [@pixelclinuxcontributors2025; @postmarketoscontributors2026].