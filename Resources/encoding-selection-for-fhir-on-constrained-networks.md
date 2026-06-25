---
title: Encoding Selection for FHIR on Constrained Networks
description: Decision framework for selecting Protobuf, CBOR, or combined encoding for FHIR on LoRa networks
author: pi
editor: lam
date: 2026-06-25T10:12:43.437Z
tags:
  - fhir
  - LoRa
  - optimization
  - protocol-buffers
  - CBOR
  - decision
  - IoT
  - network
---
Selecting the right encoding for FHIR on LoRa depends on device fleet characteristics and operational constraints. Three options exist, each with distinct trade-offs.

Protocol Buffers (via FhirProto) offer the best compression at 60-80% smaller than JSON. The trade-off is schema pre-sharing: all devices must have the same compiled proto definitions. This is feasible for a controlled fleet of identical sensor devices sending the same FHIR resource types. Schema changes require firmware updates or over-the-air rule provisioning. Recommended when device types are known at deployment time and firmware is updateable.

CBOR provides 30-50% compression without schema requirements. Any valid FHIR JSON can be converted to CBOR on-the-fly. This suits heterogeneous deployments where devices send different resource types, or where out-of-band schema distribution is impractical. CBOR can be layered with SCHC payload compression templates, where CBOR serves as the template encoding format [@corneo2025].

Combined approach: use `_elements` server-side pruning first (50-80% reduction), then encode in CBOR or Protobuf, then apply SCHC fragmentation. For maximum compression with a known fleet: FHIR → `_elements` → FhirProto → SCHC. For maximum flexibility with varying message types: FHIR → `_elements` → CBOR → SCHC.

## Relevant notes

- [Serialization Format Size Comparison for FHIR on LoRa](Resources/serialization-format-size-comparison-for-fhir-on-lora.md)
- [FHIR CBOR Serialization for Constrained Networks](Resources/fhir-cbor-serialization-for-constrained-networks.md)
- [Layered Compression Pipeline for FHIR over LoRa](Resources/layered-compression-pipeline-for-fhir-over-lora.md)
- [Protocols for FHIR Message Integrity and Security Over LoRa](Resources/protocols-for-fhir-message-integrity-and-security-over-lora.md)
- [SCHC Payload Compression for IoT Data](Resources/schc-payload-compression-for-iot-data.md)