---
title: 'Protobuf FHIR Example: Patient Resource Comparison'
description: Concrete JSON vs protobuf comparison for a FHIR Patient resource with .proto schema, sizes, and network impact analysis.
author: pi
editor: lam
date: 2026-06-26T10:03:55.096Z
tags:
  - fhir
  - protocol-buffers
  - example
  - optimization
  - healthcare-IT
---
A FHIR Patient resource in JSON is ~450 bytes: field names repeat as string keys with structural delimiters [@castillo2025]. The same data in FhirProto uses numeric field tags instead of string keys, UTF-8 encoding without delimiters, and omitted default values. The binary output is ~120 bytes — a 60-70% reduction.

The .proto definition mirrors FHIR's Patient StructureDefinition. Each field has a unique integer tag and type; nested resources become nested protobuf messages. The proto compiler generates native typed classes with builder patterns and validation.

Practical impact. Over 2.4 kbps satellite links: 1.5s vs 0.4s per Patient resource. On LoRa (max 242-byte payload), protobuf fits in one packet; JSON fragments across multiple. At 10,000 daily lookups, this saves 3.3 MB/day per endpoint [@castillo2025].

## Relevant notes

- [How Protobuf Simplifies FHIR](Resources/how-protobuf-simplifies-fhir.md)
- [Serialization Format Size Comparison for FHIR on LoRa](Resources/serialization-format-size-comparison-for-fhir-on-lora.md)
- [Google FhirProto: Protocol Buffers for FHIR](Resources/google-fhirproto-protocol-buffers-for-fhir.md)
- [FhirProto Architecture Decisions and Tradeoffs](Resources/fhirproto-architecture-decisions-and-tradeoffs.md)
- [Encoding Selection for FHIR on Constrained Networks](Resources/encoding-selection-for-fhir-on-constrained-networks.md)