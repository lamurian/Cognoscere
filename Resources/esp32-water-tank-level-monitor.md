---
title: ESP32 Water Tank Level Monitor
description: Low-cost ESP32 ultrasonic water tank level monitor for rainwater catchment and well storage, integrated with Home Assistant
author: pi
editor: lam
date: 2026-06-20T22:06:26.124Z
tags:
  - technology
  - hardware
  - agriculture
  - automation
  - sustainability
  - practical
  - tutorial
source: https://somm15.github.io/esp32/iot/3d/homeassistant/2021/03/01/water-sensor.html
---
## Summary

An ESP32 connected to a waterproof ultrasonic sensor measures water level in tanks, cisterns, or wells. The system publishes readings via ESPHome firmware directly to Home Assistant over the local WiFi network. Total cost is under $30, far cheaper than commercial tank monitoring solutions [@Somm15-Water-Sensor].

A JSN-SR04T waterproof ultrasonic sensor is mounted at the top of the tank pointing down at the water surface. The ESP32 calculates distance to the water and publishes the level (converted to volume percentage) every 5 minutes. A 3D-printed holder keeps the sensor perpendicular to the water surface for accurate readings. The setup handles filter_out:nan filters to discard failed measurements from ripples or debris.

## Key Points

- **Parts**: ESP32 NodeMCU ($5), JSN-SR04T waterproof ultrasonic sensor ($8), 3D-printed sensor mount ($2), USB power or solar + 18650 ($12)
- **Integration**: ESPHome firmware — no coding needed, YAML-only configuration
- **Calibration**: Measure tank depth manually, set 1.64-x lambda filter in ESPHome config to convert distance-to-water into water level
- **Power**: USB from solar-charged battery system; can deep sleep between readings for sub-10 mW average power
- **Alerts**: Home Assistant notifies when tank drops below 20% (refill needed) or pump runs dry
- **Extension**: Pair with pressure sensor at tank bottom for cross-validation; second sensor detects leaks

For tanks beyond WiFi range, use ESP32-LoRa (TTGO LoRa32) to relay readings via long-range radio to a base station receiver that publishes to MQTT [@RandomNerd-LoRa-Sensor].

## Relevant notes

- [ESP32 Soil Moisture Sensor for Smart Irrigation](Resources/esp32-soil-moisture-sensor-for-smart-irrigation.md)
- [ESP32 LoRa Long-Range Sensor Network for Farm Monitoring](Resources/esp32-lora-long-range-sensor-network-for-farm-monitoring.md)
- [ESP32 Automatic Chicken Coop Door](Resources/esp32-automatic-chicken-coop-door.md)
- [ESP32 Fermentation and Curing Chamber Controller](Resources/esp32-fermentation-and-curing-chamber-controller.md)
- [ESP32-CAM Solar Motion Camera](Resources/esp32-cam-solar-motion-camera.md)