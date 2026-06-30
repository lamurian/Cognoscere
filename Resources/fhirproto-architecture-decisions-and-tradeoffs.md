---
title: FhirProto Architecture Decisions and Tradeoffs
description: 'Architectural decisions for protobuf FHIR: schema pre-sharing, controlled vs heterogeneous fleets, gRPC integration, CBOR comparison.'
author: pi
editor: lam
date: 2026-06-26T10:03:55.096Z
tags:
  - fhir
  - protocol-buffers
  - architecture
  - optimization
  - decision
  - healthcare-IT
---
The primary architectural constraint of FhirProto is schema pre-sharing: both sender and receiver must share compiled proto definitions before communication [@google2022]. This suits controlled fleets where message types are predetermined but is impractical for open ecosystems needing self-describing messages.

Three serialization options exist. Protobuf offers best compression (60-80%) but requires schema pre-sharing. CBOR provides 30-50% compression without schema requirements, working with any valid FHIR JSON on-the-fly. The combined approach layers server-side pruning, encoding, then SCHC fragmentation for constrained networks [@corneo2025].

gRPC pairs naturally with FhirProto, providing multiplexed HTTP/2 streams, mandatory TLS, and bidirectional streaming. This addresses REST/JSON pain points in disaster scenarios with low-bandwidth satellite links and intermittent connectivity [@castillo2025]. The cost is loss of self-describing capability.

## Relevant notes

- [Encoding Selection for FHIR on Constrained Networks](Resources/encoding-selection-for-fhir-on-constrained-networks.md)
- [Google FhirProto: Protocol Buffers for FHIR](Resources/google-fhirproto-protocol-buffers-for-fhir.md)
- [Layered Compression Pipeline for FHIR over LoRa](Resources/layered-compression-pipeline-for-fhir-over-lora.md)
- [Serialization Format Size Comparison for FHIR on LoRa](Resources/serialization-format-size-comparison-for-fhir-on-lora.md)
- [Protocols for FHIR Message Integrity and Security Over LoRa](Resources/protocols-for-fhir-message-integrity-and-security-over-lora.md)