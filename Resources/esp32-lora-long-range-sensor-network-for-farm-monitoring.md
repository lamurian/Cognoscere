---
title: ESP32 LoRa Long-Range Sensor Network for Farm Monitoring
description: Long-range ESP32 LoRa sensor network for monitoring remote farm fields, greenhouses, and pastures beyond WiFi range
author: pi
editor: lam
date: 2026-06-20T22:06:26.125Z
tags:
  - technology
  - hardware
  - agriculture
  - automation
  - sustainability
  - infrastructure
  - practical
  - tutorial
source: https://randomnerdtutorials.com/esp32-lora-sensor-web-server/
---
## Summary

LoRa (Long Range) radio modules paired with ESP32 microcontrollers create a wireless sensor network that spans kilometers, not meters. This solves the range limitation of WiFi for homestead monitoring. A LoRa sender node in a remote field reads temperature, humidity, barometric pressure, and soil moisture, transmits via LoRa radio to a receiver base station, which displays data on a web server or Home Assistant dashboard [@santos2020].

The system uses TTGO LoRa32 boards (ESP32 + SX1276 LoRa + OLED) each costing approximately $15-20. A single sender node with BME280 sensor draws about 80mA during transmission and can be solar-powered with deep sleep to achieve years of operation. Range tested reliably at 180m (600 ft) in suburban conditions and several kilometers with optimized antennas and lower data rates [@RandomNerd-LoRa-Range].

## Key Points

- **Parts**: TTGO LoRa32 SX1276 ($15-20) or Heltec WiFi LoRa 32 ($18), BME280 sensor ($3), 868/915 MHz antenna ($5), solar panel + battery ($15)
- **Range**: 180m standard, 2-5 km with optimized antennas and spread factor settings
- **Power**: 80mA tx / 5 uA sleep; solar-powered with deep sleep for years between battery changes
- **Frequency bands**: 433 MHz (Asia), 868 MHz (Europe), 915 MHz (North America) — check local regulations
- **Data**: Temperature, humidity, pressure, soil moisture, rain gauge, wind speed
- **Syncword**: Prevents interference from nearby LoRa networks
- **Scalability**: One receiver can handle 10+ sender nodes with different sensor payload types

The receiver node runs an AsyncWebServer on the local WiFi network, serving a real-time dashboard accessible from any device on the homestead LAN. No cloud infrastructure is required.

## Relevant notes

- [ESP32 Water Tank Level Monitor](Resources/esp32-water-tank-level-monitor.md)
- [ESP32 Soil Moisture Sensor for Smart Irrigation](Resources/esp32-soil-moisture-sensor-for-smart-irrigation.md)
- [Meshtastic LoRa Off-Grid Mesh Network for Homestead](Resources/meshtastic-lora-off-grid-mesh-network-for-homestead.md)
- [ESP32 Automatic Chicken Coop Door](Resources/esp32-automatic-chicken-coop-door.md)
- [ESP32-CAM Solar Motion Camera](Resources/esp32-cam-solar-motion-camera.md)