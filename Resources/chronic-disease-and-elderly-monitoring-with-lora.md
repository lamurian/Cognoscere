---
title: Chronic Disease and Elderly Monitoring with LoRa
description: LoRa/LoRaWAN applications for chronic disease management and ambient assisted living for elderly patients
author: pi
editor: lam
date: 2026-06-21T00:41:11.647Z
tags:
  - healthcare
  - loRa
  - iot
  - chronic-disease
  - elderly-care
  - digital-health
  - medical-informatics
  - research
---
## Summary

LoRa-based systems have been demonstrated for multiple chronic disease monitoring scenarios where low data rate, long battery life, and wide coverage are required. The IoWT-HHMS (Internet of Wearable Things-based Hybrid Healthcare Monitoring System) validated real-time remote monitoring for chronic conditions using LoRaWAN as the primary communication link for periodic vital sign transmission, with selective alerting triggered when readings exceed clinical thresholds [@iot2024].

For heart failure patients, heterogeneous active assisted living solutions integrating LoRa with short-range PAN enable continuous weight, blood pressure, and SpO2 monitoring with multi-day battery life on wearable sensors. The ECGs and detailed diagnostics are transmitted during clinic visits via Bluetooth/PAN, while daily trend data uses LoRa [@kerrison2023].

Diabetes management represents a strong use case: continuous glucose monitors (CGMs) produce small data payloads (glucose reading + timestamp ~50 bytes) ideally suited for LoRa's packet size. The IoMT survey explicitly identifies CGMs and insulin pumps as key wearable IoMT devices, with LoRa and NB-IoT listed as enabling wide-area connectivity technologies [@putra2024].

For elderly/ambient assisted living, LoRa sensors enable fall detection alerts, medication adherence tracking (smart pill bottle open events), and activity pattern monitoring (motion sensors detecting reduced movement). These generate infrequent small packets — exactly the profile LoRaWAN handles best. The Stratos project validated TinyML-based message prioritisation ensuring falls and emergency alerts transmit first under bandwidth constraints [@kadiyala2026].

## Key Points

- Heart failure: daily weight/BP/SpO2 via LoRa, detailed diagnostics via PAN during visits
- Diabetes: CGM data (~50 bytes/reading) ideally fits LoRa packet size
- Elderly AAL: fall detection, medication adherence, activity monitoring via infrequent small packets
- Selective threshold-based alerting preserves battery and bandwidth
- TinyML prioritisation ensures emergency alerts transmit first

## Sources

- [@iot2024] IoWT-HHMS: LoRaWAN-based hybrid IoT wearable system for smart healthcare, IoT Journal
- [@kerrison2023] HC²: hybrid LPWAN/PAN, chronic condition monitoring
- [@kadiyala2026] Stratos: TinyML prioritisation for emergency alerts
- [@putra2024] IoMT review: CGMs, insulin pumps with LoRa/NB-IoT connectivity
- [@pamuk2026] HealthGuard: chronic disease vital sign monitoring

## Relevant notes

- [Clinical Validation of LoRa-Based Health Monitoring Systems](Resources/clinical-validation-of-lora-based-health-monitoring-systems.md)
- [LoRaWAN vs NB-IoT vs LTE-M for Health Monitoring](Resources/lorawan-vs-nb-iot-vs-lte-m-for-health-monitoring.md)
- [Energy Efficiency of LoRaWAN for Medical Wearables](Resources/energy-efficiency-of-lorawan-for-medical-wearables.md)
- [Issues, Opportunities, and Best Practices for LLMs in Healthcare and Medical Informatics](Resources/issues-opportunities-and-best-practices-for-llms-in-healthcare-and-medical-informatics.md)
- [Realistic Use Cases for LoRa-FHIR Health Data Exchange](Resources/realistic-use-cases-for-lora-fhir-health-data-exchange.md)