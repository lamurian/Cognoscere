---
title: Energy Efficiency of LoRaWAN for Medical Wearables
description: Power consumption analysis and energy optimisation strategies for LoRaWAN-based medical wearable devices
author: pi
editor: lam
date: 2026-06-21T00:41:11.647Z
tags:
  - healthcare
  - loRa
  - iot
  - performance
  - energy-storage
  - research
  - digital-health
  - medical-informatics
---
## Summary

LoRaWAN's ultra-low power consumption is its primary advantage for medical wearables that must operate continuously for months to years on coin-cell batteries. The Energy Consumption Improvement study for healthcare monitoring systems (IEEE Sensors Journal, 2022) demonstrated that a LoRaWAN health sensor transmitting four vital sign readings per day (temperature, pulse, SpO2, blood pressure) at SF12 achieves an estimated battery life of over 3 years on a 2000 mAh Li-ion cell. Adaptive data rate (ADR) optimisation extends this further by selecting the lowest spreading factor that maintains link reliability [@mdhaffar2022].

Comparative experimental evaluation by Ballerini et al. (IEEE TII, 2020) showed LoRaWAN consumes 10x less energy than NB-IoT for occasional transmissions (typical of health alerts and periodic vitals). NB-IoT consumes 2 mAh more for network join and 1.7 mAh more per 44-byte uplink compared to LoRaWAN [@ugwuanyi2021]. This gap widens in deep indoor locations where NB-IoT requires multiple retransmissions.

Key energy optimisation strategies for medical wearables include: (1) Adaptive Data Rate (ADR) — dynamically selects spreading factor based on signal quality; (2) Selective threshold-based transmission — only transmit when vitals exceed clinical ranges, reducing transmissions by up to 87% compared to periodic reporting [@kerrison2023]; (3) Duty cycle management — LoRaWAN's 1% duty cycle limit (ETSI regulation) naturally constrains transmission frequency; (4) Payload minimisation — template-based transmission reduces payload to ~100 bytes using pre-agreed message structures [@kerrison2023].

LoRaWAN device classes allow further optimisation: Class A (ALOHA-based, lowest power) for periodic vitals reporting; Class B (scheduled receive windows) for devices needing medication reminders; Class C (continuous listen) only for mains-powered gateway nodes. For wearable medical sensors, Class A operation with infrequent uplink achieves the longest battery life.

## Key Points

- LoRaWAN health sensor: 3+ years on 2000 mAh cell at 4 transmissions/day (SF12)
- LoRaWAN consumes 10x less energy than NB-IoT for occasional health data transmissions
- Selective threshold-based transmission reduces transmissions by up to 87%
- ADR dynamically optimises spreading factor for minimal energy use
- Class A operation is optimal for wearable medical sensors

## Sources

- [@mdhaffar2022] Energy Consumption Improvement for Healthcare Monitoring, IEEE Sensors J.
- [@ballerini2020] NB-IoT vs LoRaWAN experimental evaluation, IEEE TII
- [@ugwuanyi2021] IoT for Developing Countries: LoRaWAN vs NB-IoT power comparison
- [@kerrison2023] HC²: 87% transmission reduction via template-based approach
- [@dammak2022] LoRaChainCare: selective transmission for health

## Relevant notes

- [Clinical Validation of LoRa-Based Health Monitoring Systems](Resources/clinical-validation-of-lora-based-health-monitoring-systems.md)
- [LoRaWAN vs NB-IoT vs LTE-M for Health Monitoring](Resources/lorawan-vs-nb-iot-vs-lte-m-for-health-monitoring.md)
- [Chronic Disease and Elderly Monitoring with LoRa](Resources/chronic-disease-and-elderly-monitoring-with-lora.md)
- [Performance Metrics for LoRa Health Systems](Resources/performance-metrics-for-lora-health-systems.md)
- [Evidence for LoRa Health Data in Low-Resource and Disaster Settings](Resources/evidence-for-lora-health-data-in-low-resource-and-disaster-settings.md)