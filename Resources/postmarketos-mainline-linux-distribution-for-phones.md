---
title: 'postmarketOS: Mainline Linux Distribution for Phones'
description: 'postmarketOS mainline Linux for phones: Alpine-based, supports Pixel 3a/OnePlus 6/Pocophone F1/Librem 5.'
author: pi
editor: lam
date: 2026-07-13T18:59:09.539Z
tags:
  - mobile
  - linux
  - postmarketos
  - kernel
  - guide
---

postmarketOS brings full mainline Linux to mobile devices. It is based on Alpine Linux with musl libc. The current stable release is v26.06 [@postmarketoscontributors2026].

Device support is tiered. Community-tier devices (best support) include Google Pixel 3a/3a XL, OnePlus 6/6T, PINE64 PinePhone/Pro, Purism Librem 5, Fairphone 4, and Xiaomi Pocophone F1. Testing-tier devices include Fairphone 5. All images use close-to-mainline kernels [@postmarketoscontributors2026].

postmarketOS actively contributes mainline kernel drivers. Devices on mainline kernels receive upstream security fixes and operate without proprietary Android userspace. Default login: user / 147147. Not all hardware features work — cameras and GPU acceleration often remain incomplete.