---
title: SCHC Payload Compression for IoT Data
description: IETF draft extending SCHC from header compression to application payload compression using templates
author: pi
editor: lam
date: 2026-06-25T10:12:43.437Z
tags:
  - fhir
  - LoRa
  - SCHC
  - CBOR
  - optimization
  - IETF
  - network
---
The IETF draft "SCHC Payload compression" (draft-corneo-schc-compress-payload-00, June 2025) extends the SCHC framework from header compression to application payload compression. It introduces two approaches applicable to FHIR data over LoRa [@corneo2025].

The static template approach defines templates with `$n` placeholders for variable values. For FHIR Observation payloads, fixed fields like `resourceType`, `status`, and `code` are replaced by template placeholders while variable values (patient ID, measurement) are transmitted as a compact compression residue. The template itself can use CBOR encoding for smaller rule size, creating a natural CBOR+SCHC pairing.

The dynamic approach inspects payloads over time, builds a frequency map of key-value pairs, and generates SCHC rules for values recurring above a threshold. For FHIR IoT scenarios where a device sends the same resource type and unit codes repeatedly, these become compressed via `not-sent` or `MSB/LSB` CDAs, while only the varying measurement values are transmitted as `value-sent`. The compressed payload for a SenML-like FHIR Observation can be as small as 14 bytes including rule ID.

This draft is significant because it unifies CBOR and SCHC — CBOR compresses the encoding, SCHC templates strip redundant structure. Both mechanisms reuse the same SCHC rule engine already present in LoRaWAN devices.

## Relevant notes

- [SCHC Compression for FHIR over LPWAN](Resources/schc-compression-for-fhir-over-lpwan.md)
- [Layered Compression Pipeline for FHIR over LoRa](Resources/layered-compression-pipeline-for-fhir-over-lora.md)
- [Encoding Selection for FHIR on Constrained Networks](Resources/encoding-selection-for-fhir-on-constrained-networks.md)
- [FHIR CBOR Serialization for Constrained Networks](Resources/fhir-cbor-serialization-for-constrained-networks.md)
- [FHIR JSON Minification with REST API Parameters](Resources/fhir-json-minification-with-rest-api-parameters.md)