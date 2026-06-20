---
title: Physical Enclosure Design for Outdoor IoT
description: 'Weatherproofing and environmental protection for outdoor ESP32 IoT: IP ratings, thermal management, cable glands, conduit, surge suppression'
author: pi
editor: lam
date: 2026-06-20T22:23:35.831Z
tags:
  - technology
  - hardware
  - security
  - practical
  - tutorial
  - engineering
---
## Summary

Every outdoor IoT device needs an enclosure that protects against rain, dust, temperature extremes, and lightning. The minimum standard is IP65 (dust-tight, water jets) for devices under eaves; IP67 (dust-tight, immersion up to 1m) for ground-level or flood-prone deployments. Commercial polycarbonate enclosures cost $5-15 and are preferred over 3D-printed parts for long-term durability [@RAK-Outdoor-Enclosures].

## Key Points

**IP rating selection**: IP65 for wall-mounted sensors under cover. IP67 for ground-level sensors, tank monitors, and well heads. IP68 for submersible use (pond sensors, water tank bottom sensors). Verify gasket integrity annually — silicone gaskets degrade in UV after 2-3 years.

**Cable entry**: Use PG7 or PG9 nylon cable glands for all wire entry points. Apply dielectric grease inside glands to prevent capillary water ingress. Never rely on silicone sealant alone — cable glands provide mechanical strain relief plus sealing.

**Thermal management**: ESP32 operates between -40C and +85C. In tropical climates, use white or reflective enclosures to reduce solar heat gain. Add ventilation with a Gore-Tex vent (breathable membrane) to prevent condensation cycles. In cold climates, deep sleep current (5 uA) generates negligible heat — ensure the enclosure has no internal condensation traps.

**Lightning and surge protection**: For long cable runs in exposed areas, install gas discharge tubes (GDTs) on all external I/O lines. Use TVS diodes on DC power inputs. Consider fiber optic isolation or wireless LoRa instead of long copper sensor wires. A 10kA rated surge arrester at the power entry point protects the entire system.

**Conformal coating**: Apply acrylic or silicone conformal coating to all exposed PCB surfaces (except connectors) before assembly. This prevents corrosion from condensation, insect damage, and fungal growth common in tropical environments. Cost: $8-15 per can, enough for 20-30 boards.

**Conduit for buried cables**: Use UV-stabilized PVC or HDPE conduit for any wiring buried underground. Minimum 30cm depth in non-agricultural areas; 60cm depth in tilled fields to avoid plough damage. Use sweep elbows instead of 90-degree fittings to make cable pulling easier.

## Sources
- [@RAK-Outdoor-Enclosures] — RAKwireless outdoor enclosure specifications, IP67 rated for IoT gateways
- ESP32 datasheet operating range: -40C to +85C
- IEC 60529 IP rating standard

## Relevant notes

- [ESP32 Automatic Chicken Coop Door](Resources/esp32-automatic-chicken-coop-door.md)
- [ESP32-CAM Solar Motion Camera](Resources/esp32-cam-solar-motion-camera.md)
- [Network Infrastructure for Budget Homelab](Resources/network-infrastructure-for-budget-homelab.md)
- [Home Wi-Fi Security: What Actually Works](Resources/home-wi-fi-security-what-actually-works.md)
- [Meshtastic LoRa Off-Grid Mesh Network for Homestead](Resources/meshtastic-lora-off-grid-mesh-network-for-homestead.md)