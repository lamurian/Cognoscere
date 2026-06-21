---
title: Network Architecture for LoRa-Based FHIR Data Exchange
description: Multi-layer network architecture enabling FHIR health data exchange over LoRa mesh networks with Meshtastic
author: pi
editor: lam
date: 2026-06-21T00:25:34.985Z
tags:
  - healthcare
  - architecture
  - network
  - research
  - loRa
  - fhir
  - infrastructure
---
## Summary

The network architecture for LoRa-based FHIR data exchange follows a layered design that bridges constrained radio networks with standard healthcare interoperability protocols. The architecture synthesizes evidence from multiple implemented systems.

### Layer 1: LoRa Mesh (Meshtastic)
At the physical/mesh layer, Meshtastic nodes form a self-healing mesh using managed flooding (broadcast) and next-hop routing (direct messages). Each node relays packets for others, extending range multi-hop. Default HopLimit is 3, configurable to 7 [@meshtasticproject2026a]. Payload: ~200 bytes application data after routing overhead. Encryption: AES-256 at link layer.

### Layer 2: FHIR-to-LoRa Gateway
A gateway node (Raspberry Pi or similar) bridges the LoRa mesh to the FHIR infrastructure. Following the Semantic Gateway as a Service model, the gateway provides: (a) multi-protocol translation — CoAP (IoT) to HTTP (FHIR), (b) FHIR resource fragmentation/reassembly for LoRa packet size limits, and (c) message prioritization queue [@desai2014]. The ISO 11073-to-FHIR integration using CoAP demonstrated that medical device data can be translated to FHIR Observation resources over constrained protocols [@ieee8001674].

### Layer 3: Federated FHIR Backbone
Data received at the gateway is translated to FHIR resources (Observation, Patient, MedicationRequest, etc.) and forwarded to the appropriate FHIR server. In a federated architecture, each clinic runs its own FHIR server; the gateway resolves the destination based on patient ID and resource type. LoRaChainCare's MQTT-based routing from LoRa gateway to application server provides a pattern for this [@dammak2022].

### Layer 4: Blockchain Metadata Layer (Optional)
For integrity-critical records, metadata hashes can be recorded on a permissioned blockchain. The SCALHEALTH dual-blockchain architecture (Hyperledger Fabric for health metadata, Ethereum for financial transactions) provides a reference: only hashes and pointers go on-chain; full data stays off-chain in local FHIR stores [@mohammadi2024].

### Data Flow
1. CHW enters patient vitals on mobile app → generates compact FHIR Observation JSON (~150 bytes)
2. Phone sends via Meshtastic (fragmented if >200 bytes) to gateway
3. Gateway reassembles, validates AES-256 integrity, queues for processing
4. CoAP-to-HTTP proxy translates constrained message to FHIR REST API call
5. FHIR Observation resource created on clinic's FHIR server
6. Optional: metadata hash recorded on permissioned blockchain
7. Clinic FHIR server synchronizes with regional HIE when internet available

## Key Points

- 4-layer architecture: LoRa mesh → FHIR-to-LoRa gateway → Federated FHIR backbone → Optional blockchain
- Gateway handles: fragmentation/reassembly, CoAP-to-HTTP translation, message prioritization
- FHIR Observation (~150 bytes) fits in single LoRa packet; Patient (~3 KB) requires fragmentation
- MQTT routing enables real-time forwarding from LoRa to FHIR servers

## Sources

- [@meshtasticproject2026a] Managed flooding, next-hop routing
- [@desai2014] Semantic Gateway as a Service: multi-protocol translation
- [@ieee8001674] ISO 11073 to FHIR via CoAP
- [@dammak2022] LoRaChainCare: MQTT-based data routing
- [@mohammadi2024] SCALHEALTH: dual-blockchain, off-chain storage
- [@kerrison2023] HC²: template-based message reconstruction
- [@pamuk2026] HealthGuard: gateway-independent P2MP LoRa

## Relevant notes

- [LoRa Advantages for FHIR-Based EHR Over Traditional Networks](Resources/lora-advantages-for-fhir-based-ehr-over-traditional-networks.md)
- [Evidence for LoRa Health Data in Low-Resource and Disaster Settings](Resources/evidence-for-lora-health-data-in-low-resource-and-disaster-settings.md)
- [Data Resilience and Privacy with LoRa Mesh Health Systems](Resources/data-resilience-and-privacy-with-lora-mesh-health-systems.md)
- [Central Repository Coordination for LoRa Health Systems](Resources/central-repository-coordination-for-lora-health-systems.md)
- [Federation Security Risks in Healthcare](Resources/federation-security-risks-in-healthcare.md)