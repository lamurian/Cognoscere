---
title: 'Mainlining: Porting Mainline Linux to Android Devices'
description: Process of replacing vendor Android kernel with upstream Linux, requiring Device Tree porting for ARM phone hardware.
author: pi
editor: lam
date: 2026-07-13T18:59:21.436Z
tags:
  - mobile
  - linux
  - kernel
  - hardware
  - drivers
  - arm
  - developer
---

Mainlining replaces the vendor Android kernel (with thousands of out-of-tree patches) with a near-upstream kernel from kernel.org. This is needed because vendor kernels rarely receive security updates and contain proprietary userspace driver components [@weiss2022].

On ARM phones, hardware is described via Device Tree (.dts files) — a structured format specifying clocks, GPIOs, memory addresses, and interrupts. This replaces ACPI used on x86. The kernel reads a compiled Device Tree Blob (DTB) at boot to discover devices. Porting means writing accurate .dts files for each hardware component [@weiss2022].

The process: unlock bootloader, install TWRP, extract the device's full tree (/sys/firmware/fdt), compare downstream drivers with existing mainline drivers for the SoC, write device tree nodes for each component, build the kernel, and iteratively debug via UART. Qualcomm Snapdragon SoCs have the best mainline community support [@weiss2022].

This requires deep kernel knowledge and significant debugging. GPU, camera, audio, and IOMMU remain the hardest components. The postmarketOS wiki and #mainline:postmarketos.org Matrix channel are key resources.