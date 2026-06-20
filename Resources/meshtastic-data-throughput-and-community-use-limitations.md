---
title: Meshtastic Data Throughput and Community Use Limitations
description: Data rate limits of LoRa-based Meshtastic networks and what community data sharing is realistically possible
author: pi
editor: lam
date: 2026-06-20T22:43:06.725Z
tags:
  - network
  - technology
  - limitations
  - community
  - infrastructure
  - resilience
---
## Summary

Meshtastic operates over LoRa radio, which achieves long range (1-3 km urban, 10+ km line-of-sight) by deliberately limiting data rate. Understanding these throughput constraints is essential before planning any community deployment.

### Data Rates by Preset
Meshtastic offers eight radio presets that trade speed for range:

| Preset | Data Rate | Bandwidth | Spreading Factor | Link Budget |
|---|---|---|---|---|
| ShortTurbo | 21.88 kbps | 500 kHz | SF7 | 140 dB |
| ShortFast | 10.94 kbps | 250 kHz | SF7 | 143 dB |
| MediumFast | 3.52 kbps | 250 kHz | SF9 | 148 dB |
| LongFast (default) | 1.07 kbps | 250 kHz | SF11 | 153 dB |
| LongSlow | 0.18 kbps | 125 kHz | SF12 | 158.5 dB |

Custom settings can reach 37.5 kbps (SF6/500kHz) but with only 129 dB link budget [@meshtasticproject2026b].

### Packet Size Limits
Each LoRa packet carries a maximum of ~200 bytes of application payload after protocol overhead. The routing header takes 16 bytes, leaving ~200 bytes for the encrypted application message (text, position, telemetry, etc.).

### What This Means for Community Data Sharing
**Possible:**
- Real-time text messaging (group or direct)
- GPS location sharing across the community
- Sensor telemetry (temperature, humidity, pressure, battery voltage, soil moisture)
- Emergency broadcast (one message reaches all nodes instantly)
- MQTT bridging to the internet if at least one node has connectivity
- Coordination during disasters or power outages

**Not possible:**
- File sharing (even a 1 KB text file would take ~8 seconds at LongFast)
- Photos or images (a 50 KB compressed photo would take ~7 minutes)
- Video or audio streaming
- Web browsing
- Any real-time application beyond text

### Scaling Behaviour
For meshes with more than 40 active nodes, the firmware automatically scales back telemetry and position broadcast intervals using: ScaledInterval = Interval × (1.0 + ((OnlineNodes - 40) × 0.075)). At 62 nodes, telemetry intervals stretch from 30 to ~80 minutes [@meshtasticproject2026a].

### Can It Serve as a "Local Internet"?
**Not in the traditional sense.** Meshtastic is more accurately described as an off-grid text-messaging and telemetry mesh network, not a local internet. However, combining Meshtastic with other technologies creates a more capable stack: Portable Network Kits (Community Tech NY) extend local Wi-Fi; MeshCore supports larger networks with manual routing; Reticulum provides a full networking stack across multiple media types.

### Real-World Community Use
In Bvlbancha (New Orleans) after Hurricane Ida, mutual aid groups deployed a solar-powered Meshtastic network spanning 3.5 miles across distribution hubs. The network maintained text communication when cellular and internet infrastructure were destroyed. Weather, buildings, and vegetation reduced effective range, highlighting the need for careful node placement [@liu2025a].

## Key Points

- LongFast preset: ~1.07 kbps (1/70,000th of typical 4G)
- Max application payload per packet: ~200 bytes
- Text messaging, GPS, and telemetry work well; file transfer, media, and web do not
- Auto-scaling prevents channel saturation as mesh grows beyond 40 nodes
- Best used as a resilient backup communication layer, not an internet replacement
- Can bridge to internet via MQTT if one node has connectivity

## Sources

- [Meshtastic Radio Settings](https://meshtastic.org/docs/overview/radio-settings/)
- [Meshtastic Mesh Broadcast Algorithm](https://meshtastic.org/docs/overview/mesh-algo/)
- Liu & Verdin (2025). Networking a Network. Open Rivers, 28.

## Relevant notes

- [Meshtastic LoRa Off-Grid Mesh Network for Homestead](Resources/meshtastic-lora-off-grid-mesh-network-for-homestead.md)
- [Meshtastic Mesh Routing Protocol](Resources/meshtastic-mesh-routing-protocol.md)
- [Tamper Detection and Alerting for IoT Devices](Resources/tamper-detection-and-alerting-for-iot-devices.md)
- [Executive Summary: Securing Homestead IoT from Tampering](Areas/executive-summary-securing-homestead-iot-from-tampering.md)
- [Self-Hosted Software Stack for Off-Grid Resilience](Resources/self-hosted-software-stack-for-off-grid-resilience.md)