---
title: FHIR JSON Minification with REST API Parameters
description: Using FHIR's _elements and _summary parameters to reduce payload before serialization
author: pi
editor: lam
date: 2026-06-25T09:54:10.036Z
tags:
  - fhir
  - optimization
  - IoT
  - LoRa
  - network
---
The FHIR RESTful API provides `_elements` and `_summary` query parameters to minimize payload size before serialization. `_elements` accepts a comma-separated list of top-level element names; the server returns only those and their nested children. On a Patient resource with ~30 fields, `_elements=identifier,name,birthDate` eliminates over 70% of the output. `_summary` offers preset reduction: `true` (computable elements only), `text` (narrative only), `data` (omit narrative), or `count` (just total count).

`_contained` inlines referenced resources into the main resource to avoid separate API round trips, though it increases single-payload size — use carefully on LoRa's constrained pipe. These parameters operate at the API layer, before format conversion, so they apply equally whether the final output is JSON, XML, or CBOR. No custom server tooling is needed; they are part of the standard FHIR RESTful API in R4 and R5.

Best practice for LoRa is to pre-define minimal FHIR profiles per message type (vital sign, medication, alert) and then use `_elements` filters matching only the profiled elements. A vital-sign Observation with `_elements=status,code,value,effectiveDateTime` can reduce a 1.5 KB resource to ~400 bytes before any format compression.

## Relevant notes

- [FHIR CBOR Serialization for Constrained Networks](Resources/fhir-cbor-serialization-for-constrained-networks.md)
- [Serialization Format Size Comparison for FHIR on LoRa](Resources/serialization-format-size-comparison-for-fhir-on-lora.md)
- [Network Architecture for LoRa-Based FHIR Data Exchange](Resources/network-architecture-for-lora-based-fhir-data-exchange.md)
- [Protocols for FHIR Message Integrity and Security Over LoRa](Resources/protocols-for-fhir-message-integrity-and-security-over-lora.md)
- [Google FhirProto: Protocol Buffers for FHIR](Resources/google-fhirproto-protocol-buffers-for-fhir.md)