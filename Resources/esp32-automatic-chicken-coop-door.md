---
title: ESP32 Automatic Chicken Coop Door
description: ESP32-controlled automatic chicken coop door with light and time-based logic, solar/battery powered for off-grid homesteads
author: pi
editor: lam
date: 2026-06-20T22:06:26.123Z
tags:
  - technology
  - hardware
  - automation
  - agriculture
  - safety
  - solar
  - practical
  - tutorial
source: https://github.com/ESP32-COOP/ESP32-COOP-DOC/
---
## Summary

An ESP32 microcontroller controls a DC motor or linear actuator to open and close a chicken coop door automatically based on light level, time, or both. The system runs on a 12V battery with solar charging, making it fully off-grid. It uses an L298N H-bridge motor driver, a photoresistor for light sensing, and communicates via BLE to a mobile app or via WiFi/ESPHome for Home Assistant integration.

Several open-source projects exist: ESP32-COOP provides a full BLE app, configurable open/close conditions, and a 3D-printable enclosure [@ESP32-COOP]. OpenCoopControl offers MQTT integration with Home Assistant for monitoring door status, feeding schedules, and environmental sensors [@OpenCoopControl]. Total build cost is approximately $30-50.

## Key Points

- **Parts**: ESP32 ($5), L298N H-bridge ($3), 12V linear actuator or DC motor with encoder ($15-25), photoresistor ($1), 12V battery + solar panel ($20-30)
- **Logic**: Open/close based on light threshold, time of day, or combined AND/OR conditions
- **Power**: 12V lead-acid or LiFePO4 battery charged by 10-20W solar panel; motor runs only for a few seconds twice per day
- **Safety**: Current sensing stops the motor if the door jams on an animal
- **Integration**: ESPHome firmware connects door state to Home Assistant for remote monitoring and notifications
- **Predator protection**: Door provides physical barrier against nocturnal predators (raccoons, foxes, snakes)

The door boosts egg production by keeping chickens safe and reducing stress. It also eliminates the need to be home at dawn/dusk to manually close the coop [@BackyardChickens-ESP32-Door].

## Relevant notes

- [ESP32-CAM Solar Motion Camera](Resources/esp32-cam-solar-motion-camera.md)
- [ESP32 Soil Moisture Sensor for Smart Irrigation](Resources/esp32-soil-moisture-sensor-for-smart-irrigation.md)
- [ESP32 Fermentation and Curing Chamber Controller](Resources/esp32-fermentation-and-curing-chamber-controller.md)
- [ESP32 Water Tank Level Monitor](Resources/esp32-water-tank-level-monitor.md)
- [ESP32 LoRa Long-Range Sensor Network for Farm Monitoring](Resources/esp32-lora-long-range-sensor-network-for-farm-monitoring.md)