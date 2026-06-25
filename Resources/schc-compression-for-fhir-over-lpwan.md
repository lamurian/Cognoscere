---
title: SCHC Compression for FHIR over LPWAN
description: How IETF SCHC (RFC 8724) static context compression applies to FHIR payloads on LoRa
author: pi
editor: lam
date: 2026-06-25T09:54:10.039Z
tags:
  - fhir
  - LoRa
  - optimization
  - network
  - standard
---
Static Context Header Compression (SCHC), defined in RFC 8724, is an IETF standard for LPWAN technologies including LoRaWAN. SCHC uses pre-shared compression rules between device and network gateway, avoiding dynamic negotiation. Each rule defines matching operators and compression actions for known field values [@minaburo2020]. The context is static — rules are provisioned once during device setup and never change during operation.

For FHIR payloads, a SCHC context can assign rules per field. The `equal` operator compresses fields with known constant values (e.g., `resourceType` always `Observation`). The `match-mapping` operator maps known values like LOINC codes or status strings to small integer indices. The `not-sent` action elides fields whose value is known at both ends. SCHC also provides optional fragmentation modes (No-ACK, ACK-Always, ACK-on-Error) for payloads exceeding LoRa's per-packet MTU of 51-255 bytes.

SCHC applies at the LPWAN adaptation layer, below the application payload encoding. This makes it complementary to CBOR or Protobuf: SCHC strips redundant field information at the link layer while CBOR compresses the remaining payload. The combination provides dual-layer compression with no semantic conflict. RFC 8724 is technology-agnostic, supporting LoRaWAN, NB-IoT, and Sigfox.

## Relevant notes

- [FHIR CBOR Serialization for Constrained Networks](Resources/fhir-cbor-serialization-for-constrained-networks.md)
- [FHIR JSON Minification with REST API Parameters](Resources/fhir-json-minification-with-rest-api-parameters.md)
- [Executive Summary: Leveraging Meshtastic and LoRa for Federated FHIR-Based EHR](Resources/executive-summary-leveraging-meshtastic-and-lora-for-federated-fhir-based-ehr.md)
- [LoRa Advantages for FHIR-Based EHR Over Traditional Networks](Resources/lora-advantages-for-fhir-based-ehr-over-traditional-networks.md)
- [Data Resilience and Privacy with LoRa Mesh Health Systems](Resources/data-resilience-and-privacy-with-lora-mesh-health-systems.md)