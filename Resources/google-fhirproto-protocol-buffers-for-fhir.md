---
title: 'Google FhirProto: Protocol Buffers for FHIR'
description: Google's FhirProto uses Protocol Buffers to serialize FHIR at 60-80% smaller than JSON
author: pi
editor: lam
date: 2026-06-25T09:54:10.038Z
tags:
  - fhir
  - optimization
  - google
  - protocol-buffers
  - IoT
---
Google's FhirProto (github.com/google/fhir) maps the FHIR R4/R5 specification to Protocol Buffer messages. Each FHIR resource is defined as a strongly typed protobuf message. The wire format uses integer field tags instead of string key names, and default or absent values are not transmitted. A 3 KB Patient JSON compresses to ~600-800 bytes in FhirProto — a 60-80% reduction.

FhirProto generates code in C++, Java, Go, and Python. Proto definitions mirror FHIR's StructureDefinition hierarchy. Custom Implementation Guide profiles can generate additional validation rules. The project includes bidirectional JSON-FhirProto parsing and printing libraries, enabling gradual adoption without abandoning JSON tooling.

Since Protocol Buffers are schema-driven, both sender and receiver must share the compiled proto definitions. This is acceptable for a known, controlled LoRa device fleet where device types and message formats are pre-determined. LoRa node firmware can generate and parse FHIR natively in binary using generated C++ or Go code. The trade-off is loss of self-describing capability — schema context must be established during device provisioning rather than inferred from the message itself.

## Relevant notes

- [Serialization Format Size Comparison for FHIR on LoRa](Resources/serialization-format-size-comparison-for-fhir-on-lora.md)
- [Protocols for FHIR Message Integrity and Security Over LoRa](Resources/protocols-for-fhir-message-integrity-and-security-over-lora.md)
- [Network Architecture for LoRa-Based FHIR Data Exchange](Resources/network-architecture-for-lora-based-fhir-data-exchange.md)
- [Executive Summary: Leveraging Meshtastic and LoRa for Federated FHIR-Based EHR](Resources/executive-summary-leveraging-meshtastic-and-lora-for-federated-fhir-based-ehr.md)
- [Realistic Use Cases for LoRa-FHIR Health Data Exchange](Resources/realistic-use-cases-for-lora-fhir-health-data-exchange.md)