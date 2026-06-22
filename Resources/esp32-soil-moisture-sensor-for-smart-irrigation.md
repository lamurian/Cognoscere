---
title: ESP32 Soil Moisture Sensor for Smart Irrigation
description: ESP32-based soil moisture sensor using capacitive sensor and MQTT for automated garden irrigation on local network
author: pi
editor: lam
date: 2026-06-20T22:06:26.116Z
tags:
  - technology
  - hardware
  - agriculture
  - automation
  - sustainability
  - practical
  - tutorial
source: https://www.emqx.com/en/blog/hands-on-guide-on-esp32
---
## Summary

A capacitive soil moisture sensor connected to an ESP32 microcontroller provides real-time soil moisture readings over the local WiFi network via MQTT. This is the core sensing component for automated drip irrigation in a homestead garden. The system runs fully on LAN with no cloud dependency.

The capacitive sensor (v1.2) measures soil moisture as an analog voltage. Unlike resistive sensors, capacitive sensors resist corrosion and last years in soil. The ESP32 reads the analog value, publishes it as JSON over MQTT to a local broker (Mosquitto), and Home Assistant subscribes to trigger irrigation when soil is dry [@tao2024]. Total cost per sensor node is approximately $8-12.

## Key Points

- **Parts**: ESP32 dev board ($5), capacitive soil moisture sensor v1.2 ($3), optional relay + 12V solenoid valve ($5)
- **Communication**: MQTT to local Mosquitto broker on a mini PC server
- **Power**: Solar-charged 18650 Li-Ion with TP4056 charger ($3); ESP32 deep sleep between readings (5 uA idle)
- **Range**: Standard WiFi range (30-50m on 2.4GHz); use ESP32-LoRa for remote garden beds
- **Automation**: Home Assistant automations water only when moisture drops below threshold AND solar forecast is sunny
- **Calibration**: Place sensor in air (dry reading) and water (wet reading) for threshold calibration

This sensor works with [ESPHome](https://esphome.io) firmware for zero-code Home Assistant integration, or raw Arduino code for full control [@GitHub-ESP32-Moisture].

## Relevant notes

- [ESP32 LoRa Long-Range Sensor Network for Farm Monitoring](Resources/esp32-lora-long-range-sensor-network-for-farm-monitoring.md)
- [ESP32 Water Tank Level Monitor](Resources/esp32-water-tank-level-monitor.md)
- [Meshtastic LoRa Off-Grid Mesh Network for Homestead](Resources/meshtastic-lora-off-grid-mesh-network-for-homestead.md)
- [ESP32 Automatic Chicken Coop Door](Resources/esp32-automatic-chicken-coop-door.md)
- [Self-Hosted Software Stack for Off-Grid Resilience](Resources/self-hosted-software-stack-for-off-grid-resilience.md)