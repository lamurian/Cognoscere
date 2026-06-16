---
title: Homelab Solar System Build Guide
description: Step-by-step guide to building the off-grid solar power system for the homelab, covering both Indonesia and Netherlands scenarios.
author: pi
editor: lam
date: 2026-06-16T10:40:48.647Z
tags:
  - homelab
  - solar
  - practical
  - tutorial
---
## Safety Warning

Working with solar panels, batteries, and 230V AC involves risk of electric shock and fire. Use appropriately-rated fuses on all DC positive wires. Disconnect solar panels before working on wiring. If unsure, consult a licensed electrician.

## System Architecture

```
[Solar Panel] --[6mm2 cable]-- [MPPT Charge Controller] --[6mm2 cable]-- [LiFePO4 Battery]
                                                                                |
                                                                          [10mm2 cable]
                                                                                |
                                                                           [Inverter]
                                                                                |
                                                                           [Mini PC]
```

## Choose Your Scenario

### Scenario A: Indonesia (easy, year-round solar)
- 1x 200W monocrystalline panel
- 1x 20A MPPT charge controller (Victron SmartSolar 75/15)
- 1x 100Ah LiFePO4 12V battery
- 1x 300W pure sine wave inverter

### Scenario B: Netherlands (grid-tie hybrid recommended)
- 1-2x 400W monocrystalline panels
- 1x 40A MPPT charge controller (Victron SmartSolar 150/45)
- 1x 200Ah LiFePO4 12V battery
- 1x 500W pure sine wave inverter
- 1x Automatic Transfer Switch (for grid fallback in deep winter)

## Assembly Steps

### Step 1: Mount the Solar Panel
- Indonesia: flat or 10 degree tilt is fine. Place in unshaded area 9AM-3PM
- Netherlands: 30-45 degree tilt, south-facing. Adjustable tilt mount is ideal

### Step 2: Connect Charge Controller to Battery First
Critical order — the controller detects battery voltage on startup:
1. Connect battery terminals to charge controller (BAT+ / BAT-) — use 6mm2 cable with inline fuse
2. The controller should power on and display battery voltage
3. Connect solar panel to controller (PV+ / PV-)
4. Connect inverter to battery terminals (or load terminals if controller supports it)

### Step 3: Configure Charge Controller (VictronConnect via Bluetooth)
- Battery type: LiFePO4 (or custom)
- Absorption voltage: 14.4V (for 12V 4-cell LiFePO4)
- Float voltage: 13.6V
- Low-voltage disconnect: 12.0V (protects battery from deep discharge)

### Step 4: Connect Inverter
- Use 10mm2 (8 AWG) cable for inverter (300W loads draw ~25A at 12V)
- Install a 40A ANL fuse between battery positive and inverter
- Keep cable runs as short as possible to minimise voltage drop

### Step 5: Plug Mini PC into Inverter
- Use the standard power brick that came with the mini PC
- Plug the power brick into the inverter's AC outlet
- The inverter provides clean sine wave AC power

## Safety Checklist

- [ ] All DC connections are tight and correct polarity (red +, black -)
- [ ] Fuses installed on all positive wires (panel to controller, battery to controller, battery to inverter)
- [ ] Battery terminals covered with insulating caps
- [ ] Inverter in well-ventilated area (not enclosed)
- [ ] Battery in dry location (LiFePO4 is safe indoors, no venting required)
- [ ] All wiring secured to prevent tripping or strain on connectors

## Monitoring

Victron SmartSolar connects via Bluetooth to the VictronConnect app. You can track:
- Panel wattage (real-time)
- Battery voltage and state of charge
- Load consumption

## Maintenance Schedule

| Interval | Task |
|---|---|
| Monthly | Check battery voltage (should be 13.0-13.6V at rest) |
| Quarterly | Clean solar panel surface, check connections for corrosion |
| Yearly | Tighten all terminal screws, verify charge controller settings |
| Every 5-10 years | Replace LiFePO4 battery (gradual capacity degradation) |

## Relevant notes

- [[low-power-solar-homelab-executive-summary]]
- [[homelab-tailscale-configuration]]
- [[homelab-hardware-build-guide]]
- [[homelab-software-setup-guide]]
- [[homelab-solar-feasibility-indonesia-and-netherlands]]