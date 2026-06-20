---
title: Tamper Detection and Alerting for IoT Devices
description: 'Automated tamper detection for homestead IoT: heartbeat monitoring, vibration/tilt sensing, enclosure microswitches, current monitoring, out-of-band Meshtastic alerts'
author: pi
editor: lam
date: 2026-06-20T22:25:01.977Z
tags:
  - technology
  - hardware
  - security
  - safety
  - practical
  - tutorial
  - automation
  - deployment
---
## Summary

Knowing that tampering has occurred is often more important than preventing it entirely. A multi-layered detection system alerts the homesteader within seconds of an intrusion — whether by human, animal, or environmental event. The system combines hardware sensors (microswitches, accelerometers, current monitors) with software health checks (heartbeats, uptime monitoring) and out-of-band alerting via Meshtastic when WiFi is disabled.

## Key Points

**Heartbeat monitoring**: Every ESP32 node publishes a periodic "I'm alive" message to the MQTT broker (e.g., `homestead/sensor/garden/status` with payload `alive`). Home Assistant monitors all heartbeat topics. If a node misses three consecutive heartbeats (configurable interval, typically 5-15 minutes), trigger an alert: push notification via Gotify, email, and Meshtastic broadcast. This catches theft, destruction, battery death, and firmware crashes [@HomeAssistant].

**Enclosure tamper switch**: A microswitch (SPDT, $1-2) wired to an ESP32 GPIO detects enclosure opening. Use EXT0 wake capability — the ESP32 is in deep sleep (5 uA) but the switch can wake it instantly. On wake, the device captures evidence (photo via ESP32-CAM if available), broadcasts a `TAMPER_DETECTED` message over MQTT and Meshtastic, and writes a tamper event to local NVS with timestamp. The alert includes the node ID and the number of consecutive tamper events.

**Vibration and tilt sensing**: An SW-420 vibration sensor or MPU-6050 accelerometer ($2-3) detects if the enclosure is shaken, knocked over, or moved from its installation angle. Calibrate the threshold to ignore wind and passing animals but trigger on deliberate manipulation. Combined with GPS coordinate logging on the server, a tilt event can trigger a location cross-check.

**Current and power monitoring**: Use the ESP32's internal ADC or an INA219 current sensor ($3) to monitor solar panel current and battery voltage. A sudden drop in solar current suggests the panel was disconnected or covered. A rapid voltage drop suggests battery removal. A sustained zero current with full sun means the panel was stolen. Log baseline values daily to detect anomalies [@Espressif-ESP32-ADC].

**Out-of-band Meshtastic alerting**: If an attacker disables the WiFi network (e.g., cuts the router power or jams the signal), the Meshtastic mesh continues operating on independent LoRa radio hardware. Each critical node (server shed, well pump, main gate) should have a co-located Meshtastic node. When the WiFi heartbeat fails AND the Meshtastic node detects motion (via its accelerometer), it broadcasts an immediate `INTRUSION` alert to all other mesh nodes. This provides a second communication channel that shares no infrastructure with WiFi [@Meshtastic].

**Service health monitoring (Uptime Kuma)**: Monitor every service (Home Assistant, Mosquitto MQTT, Grafana, each sensor node's web endpoint) with ping/HTTP checks every 60 seconds. Dashboard shows current status. Alerts route through Gotify push notifications for immediate attention [@HomeAssistant].

**Firmware integrity check**: On each boot, the ESP32 (with Secure Boot enabled) verifies the firmware signature automatically. Additionally, the application can compute an HMAC of key configuration data (sensor calibration values, MQTT topics) stored in NVS and compare against a stored checksum. If tampered, fall back to factory defaults and alert.

**Tamper logging**: All detection events (heartbeat failures, microswitch triggers, vibration events, current anomalies) are logged to the server with timestamps and node IDs. Grafana provides time-series visualization of tamper events across the entire homestead deployment. Correlate tamper events with camera captures for complete incident reconstruction.

## Relevant notes

- [Anti-Tamper Hardware for Rural IoT](Resources/anti-tamper-hardware-for-rural-iot.md)
- [Wildlife-Proofing IoT Deployments](Resources/wildlife-proofing-iot-deployments.md)
- [Physical Enclosure Design for Outdoor IoT](Resources/physical-enclosure-design-for-outdoor-iot.md)
- [ESP32-CAM Solar Motion Camera](Resources/esp32-cam-solar-motion-camera.md)
- [ESP32 Firmware Hardening for Production Deployments](Resources/esp32-firmware-hardening-for-production-deployments.md)