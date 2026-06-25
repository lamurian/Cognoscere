---
title: Layered Compression Pipeline for FHIR over LoRa
description: How Protobuf (schema), CBOR (encoding), and SCHC (link-layer) combine to compress FHIR for LoRa
author: pi
editor: lam
date: 2026-06-25T10:12:43.430Z
tags:
  - fhir
  - LoRa
  - optimization
  - protocol-buffers
  - CBOR
  - SCHC
  - network
---
Protobuf, CBOR, and SCHC operate at different layers of the network stack and can be combined in a layered compression pipeline for FHIR over LoRa. They are not competing alternatives but complementary mechanisms that reduce payload at different stages.

Layer 1 (Application — Protobuf/FhirProto) provides the most compact FHIR representation by replacing string key names with integer field tags and omitting default values. A 3 KB FHIR JSON compresses to ~600-800 bytes. This requires schema pre-sharing, limiting flexibility to known device fleets.

Layer 2 (Presentation — CBOR) serves as an alternative when Protobuf schemas cannot be pre-shared. CBOR is schema-less, reducing JSON by 30-50% without code generation. SCHC payload compression templates can embed CBOR as the template format, making CBOR the natural encoding for SCHC-processed payloads [@corneo2025].

Layer 3 (Adaptation — SCHC) operates at the LPWAN link layer. Standard SCHC (RFC 8724) compresses IPv6/UDP/CoAP headers. The new SCHC Payload Compression extension (draft-corneo-schc-compress-payload-00) extends this to application payloads using static templates or dynamic dictionaries. SCHC also provides fragmentation modes for payloads exceeding LoRa's 51-255 byte MTU [@minaburo2020].

The pipeline is a decision tree: choose Protobuf for maximum compression with known schemas, or CBOR for flexibility with varying message types. In either case, SCHC provides link-layer compression and fragmentation as a final stage before LoRa transmission. The three layers can be stacked independently: FHIR → Protobuf or CBOR → SCHC → LoRa.

## Relevant notes

- [Encoding Selection for FHIR on Constrained Networks](Resources/encoding-selection-for-fhir-on-constrained-networks.md)
- [SCHC Compression for FHIR over LPWAN](Resources/schc-compression-for-fhir-over-lpwan.md)
- [SCHC Payload Compression for IoT Data](Resources/schc-payload-compression-for-iot-data.md)
- [FHIR CBOR Serialization for Constrained Networks](Resources/fhir-cbor-serialization-for-constrained-networks.md)
- [Serialization Format Size Comparison for FHIR on LoRa](Resources/serialization-format-size-comparison-for-fhir-on-lora.md)