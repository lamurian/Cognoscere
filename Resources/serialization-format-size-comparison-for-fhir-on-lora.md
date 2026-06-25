---
title: Serialization Format Size Comparison for FHIR on LoRa
description: Size comparison of JSON, XML, YAML, RDF/Turtle, CBOR, and Protobuf for FHIR on LoRa
author: pi
editor: lam
date: 2026-06-25T09:54:10.072Z
tags:
  - fhir
  - LoRa
  - optimization
  - comparison
  - IoT
  - network
---
Several serialization formats can represent FHIR data, each with different compactness. LoRa's 51-255 byte packet limit demands the smallest possible encoding. FHIR natively supports JSON, XML, and RDF (Turtle) as interchange formats. YAML can represent the same data but is not an official FHIR format.

JSON is the baseline — self-describing but verbose: every key name appears as a quoted string in every resource. XML adds even more tag overhead. YAML uses indentation-based structure without size advantage over JSON. RDF (Turtle) uses full URIs for every predicate — "fhir:Patient.name.family" is longer than JSON's `"family"`. FHIR in Turtle RDF is typically 2-3x larger than the equivalent JSON, making it the least suitable format for constrained networks.

For schema-less binary, CBOR is the most space-efficient option: 30-50% smaller than JSON without requiring schema pre-sharing. For schema-driven binary, Protocol Buffers via Google's FhirProto achieves 60-80% size reduction but requires out-of-band schema agreement. The FHIR specification does not officially define CBOR or Protobuf as interchange formats, but both can be used as custom wire encodings with a gateway translating to standard formats.

## Relevant notes

- [FHIR CBOR Serialization for Constrained Networks](Resources/fhir-cbor-serialization-for-constrained-networks.md)
- [FHIR JSON Minification with REST API Parameters](Resources/fhir-json-minification-with-rest-api-parameters.md)
- [Google FhirProto: Protocol Buffers for FHIR](Resources/google-fhirproto-protocol-buffers-for-fhir.md)
- [Protocols for FHIR Message Integrity and Security Over LoRa](Resources/protocols-for-fhir-message-integrity-and-security-over-lora.md)
- [Executive Summary: LoRa and LoRaWAN in Digital Health](Resources/executive-summary-lora-and-lorawan-in-digital-health.md)