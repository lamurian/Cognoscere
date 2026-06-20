---
title: Meshtastic Mesh Routing Protocol
description: How Meshtastic uses managed flooding, CSMA/CA, and next-hop routing for device-to-device communication across a LoRa mesh
author: pi
editor: lam
date: 2026-06-20T22:43:06.721Z
tags:
  - network
  - technology
  - hardware
  - open-source
  - infrastructure
---
## Summary

Meshtastic uses a multi-layer routing protocol on top of LoRa radio to enable decentralized, self-healing mesh communication. Each node automatically relays packets for others, extending range without any central infrastructure [@meshtasticproject2026].

### Layer 0: LoRa Radio
All data is converted into LoRa chirp symbols. Each packet includes a 16-symbol preamble (longer than the minimum 8 to allow SX126x receivers to sleep longer, saving power), a sync word set to 0x2B to distinguish Meshtastic networks from other LoRa transmissions, the LoRa physical header with packet length and coding rate, and the encrypted payload with CRC. LoRa's Chirp Spread Spectrum (CSS) modulation trades bandwidth for range and power efficiency.

### Layer 1: Unreliable Zero-Hop (CSMA/CA)
Before transmitting, a node performs Channel Activity Detection (CAD). If the channel is busy, it waits. When idle, the node waits a random multiple of slot times (contention window) to reduce collisions. The contention window size adapts to channel utilization — larger under heavy load. The raw LoRa packet contains: destination node ID (4 bytes), sender ID (4 bytes), unique packet ID (4 bytes), flags (hop limit 3 bits, WantAck 1 bit, ViaMQTT 1 bit, HopStart 3 bits), channel hash (1 byte), next-hop (1 byte), relay node (1 byte), and encrypted payload (up to ~200 bytes). Only the payload is encrypted; headers are in plaintext to permit routing without decryption.

### Layer 2: Reliable Zero-Hop (ACKs)
Setting the WantAck flag requests an ACK. For broadcasts, any rebroadcast by another node serves as an implicit ACK. If no ACK arrives within timeout, the sender retransmits up to 3 times. For direct messages, the intended recipient sends a real ACK back to the original sender.

### Layer 3: Multi-Hop — Managed Flooding
For broadcasts, each node that receives a packet with HopLimit > 0 decrements the limit and listens briefly before rebroadcasting. The contention window size depends on the Signal-to-Noise Ratio (SNR): nodes farther away (lower SNR) have a smaller window and rebroadcast first. Closer nodes hear the rebroadcast and suppress their own, preventing channel flooding. This is called "managed flooding."

### Direct Messages: Next-Hop Routing (v2.6+)
For DMs, the first transmission uses managed flooding. When a response arrives, the sender tracks which relay node forwarded it. That relay becomes the designated "next hop" for future messages to that destination, and the next-hop byte is set in subsequent packets. Only the designated relay retransmits, saving airtime. If the link fails, the system falls back to managed flooding on the last retransmission attempt.

### Regular Traffic
Nodes broadcast device telemetry (every 30 min), position (every 15 min with smart broadcast), and NodeInfo (every 3 hours). For meshes larger than 40 active nodes, these intervals scale up automatically to prevent channel saturation [@meshtasticproject2026a].

## Key Points

- Each node stores ~30 recent packet IDs for deduplication
- Default HopLimit is 3 hops; configurable up to 7
- Managed flooding uses SNR-based prioritisation to reduce airtime
- Next-hop routing (v2.6+) optimises direct messages by remembering relay paths
- CSMA/CA with adaptive contention window prevents collisions
- Only the application payload is encrypted; routing headers are plaintext

## Sources

- [Meshtastic Overview](https://meshtastic.org/docs/overview/)
- [Meshtastic Mesh Broadcast Algorithm](https://meshtastic.org/docs/overview/mesh-algo/)

## Relevant notes

- [Meshtastic LoRa Off-Grid Mesh Network for Homestead](Resources/meshtastic-lora-off-grid-mesh-network-for-homestead.md)
- [Meshtastic Data Throughput and Community Use Limitations](Resources/meshtastic-data-throughput-and-community-use-limitations.md)
- [Executive Summary: Securing Homestead IoT from Tampering](Areas/executive-summary-securing-homestead-iot-from-tampering.md)
- [Tamper Detection and Alerting for IoT Devices](Resources/tamper-detection-and-alerting-for-iot-devices.md)
- [Anti-Tamper Hardware for Rural IoT](Resources/anti-tamper-hardware-for-rural-iot.md)