---
title: FHIR CBOR Serialization for Constrained Networks
description: How CBOR (RFC 8949) reduces FHIR JSON payload size for LPWANs like LoRa
author: pi
editor: lam
date: 2026-06-25T09:54:09.859Z
tags:
  - fhir
  - LoRa
  - optimization
  - IoT
  - network
---
CBOR (Concise Binary Object Representation, RFC 8949) maps FHIR JSON to compact binary tokens. Key names like `codeableConcept` and `resourceType` become short integer tags. Structural whitespace — braces, quotes, commas, newlines — is eliminated. The result is 30-50% smaller than equivalent JSON for typical FHIR resources [@viotti2022]. A ~2 KB FHIR Observation becomes ~1.2 KB in CBOR.

CBOR is schema-less, meaning any valid FHIR JSON converts without requiring predefined protobuf schemas or code generation. This makes it practical for LoRa edge nodes where the set of transmitted FHIR resource types varies per message. CBOR-LD extends this approach for JSON-LD; the CBL (CBOR + Bitmap + List) method achieves up to 95.1% network overhead reduction on JSON-LD data [@gudla2024], directly applicable to FHIR's JSON-LD serialization format.

For LoRa's 51-255 byte per-packet limit, a CBOR-encoded FHIR Observation still typically exceeds a single packet. The recommended approach uses CBOR as the on-wire format with SCHC fragmentation at the link layer. Embedded CBOR libraries exist for constrained targets: Rust `serde_cbor`, Python `cbor2`, C `libcbor`. FHIR servers do not natively serve CBOR, so an edge proxy or translation gateway performs JSON-to-CBOR conversion at the network boundary.

## Relevant notes

- [Serialization Format Size Comparison for FHIR on LoRa](Resources/serialization-format-size-comparison-for-fhir-on-lora.md)
- [FHIR JSON Minification with REST API Parameters](Resources/fhir-json-minification-with-rest-api-parameters.md)
- [Protocols for FHIR Message Integrity and Security Over LoRa](Resources/protocols-for-fhir-message-integrity-and-security-over-lora.md)
- [SCHC Compression for FHIR over LPWAN](Resources/schc-compression-for-fhir-over-lpwan.md)
- [Network Architecture for LoRa-Based FHIR Data Exchange](Resources/network-architecture-for-lora-based-fhir-data-exchange.md)