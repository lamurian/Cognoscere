---
title: Monitoring and Automation in Closed-Loop Farming
description: Technological monitoring supports closed-loop farming by ensuring efficient resource use. ESP32-based capacitive soil moisture sensors communicate via MQTT to a local Home Assistant server, triggering
author: pi
editor: lam
date: 2026-06-23T01:10:55.917Z
tags:
  - monitoring
  - automation
  - sensors
  - IoT
  - LoRa
---
Technological monitoring supports closed-loop farming by ensuring efficient resource use. ESP32-based capacitive soil moisture sensors communicate via MQTT to a local Home Assistant server, triggering drip irrigation only when soil moisture drops below a threshold and solar forecast is sunny [@EMQX-ESP32-MQTT]. LoRa-based sensor networks extend monitoring to remote fields beyond WiFi range, transmitting temperature, humidity, and soil data over kilometers [@RandomNerd-LoRa-Sensor]. These systems enable precise control of water and nutrient cycles, prevent waste, and provide data for continuous optimization—all while operating on local networks without cloud dependency.

## Relevant notes

- [Integrated Farming System for 1m² Urban Homestead](Resources/integrated-farming-system-for-1m-urban-homestead.md)
- [ESP32 Soil Moisture Sensor for Smart Irrigation](Resources/esp32-soil-moisture-sensor-for-smart-irrigation.md)
- [ESP32 LoRa Long-Range Sensor Network for Farm Monitoring](Resources/esp32-lora-long-range-sensor-network-for-farm-monitoring.md)
- [ESP32 Water Tank Level Monitor](Resources/esp32-water-tank-level-monitor.md)
- [ESP32 Fermentation and Curing Chamber Controller](Resources/esp32-fermentation-and-curing-chamber-controller.md)