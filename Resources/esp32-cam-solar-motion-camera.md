---
title: ESP32-CAM Solar Motion Camera
description: Solar-powered ESP32-CAM motion camera for off-grid homestead security, captures photos on PIR trigger and sleeps between events
author: pi
editor: lam
date: 2026-06-20T22:06:26.121Z
tags:
  - technology
  - hardware
  - security
  - safety
  - automation
  - solar
  - practical
  - tutorial
source: https://shillehtek.com/blogs/news/esp32-cam-pir-solar-off-grid-motion-camera
---
## Summary

The ESP32-CAM paired with a PIR motion sensor creates a zero-cloud, solar-powered security camera for homestead surveillance. It wakes on motion, captures a still image (UXGA resolution), uploads it via WiFi to a local server or Telegram, then returns to deep sleep. Total component cost is under $25.

The system uses a 6V 2W solar panel, CN3791 MPPT charger, a single 18650 battery (3000mAh), and an HC-SR501 PIR sensor. Sleep current is approximately 5 uA. Each motion event (capture + upload) consumes about 0.56 mAh at 250mA for 8 seconds, supporting roughly 5000 photos on a full charge. Solar harvest provides 1-2 Wh per sunny day, enough for 50-100 daily photos [@ShillehTek-ESP32-CAM].

## Key Points

- **Parts**: ESP32-CAM module with OV2640 ($10), HC-SR501 PIR or HLK-2410C mmWave radar ($3-11), 6V 2W solar panel, CN3791 MPPT charger, 18650 battery + BMS
- **Connectivity**: WiFi to local network; images can POST to local web server or Telegram via an internet gateway
- **Trigger**: EXT0 wake pin from PIR; the mmWave radar option detects through walls for longer range
- **Power**: 5 uA deep sleep, ~250 mA during active capture/upload
- **Enclosure**: Weatherproof box with 12mm lens hole; 3D-printed mount available
- **Deployment**: Trail camera, chicken coop guardian, driveway monitor, mailbox notifier, equipment shed surveillance

The firmware uses ESP32 deep sleep with EXT0 wake, the ESP32-CAM camera library, and HTTP client for image upload [@Nabto-ESP32-Camera]. No cloud subscription required.

## Relevant notes

- [ESP32 Automatic Chicken Coop Door](Resources/esp32-automatic-chicken-coop-door.md)
- [Meshtastic LoRa Off-Grid Mesh Network for Homestead](Resources/meshtastic-lora-off-grid-mesh-network-for-homestead.md)
- [ESP32 Fermentation and Curing Chamber Controller](Resources/esp32-fermentation-and-curing-chamber-controller.md)
- [ESP32 Soil Moisture Sensor for Smart Irrigation](Resources/esp32-soil-moisture-sensor-for-smart-irrigation.md)
- [Homelab Solar System Build Guide](Projects/homelab-solar-system-build-guide.md)