---
title: Throughput and Latency in EHR Systems
description: Measured throughput and latency metrics comparing blockchain and federated EHR architectures
author: pi
editor: lam
date: 2026-06-21T00:01:44.295Z
tags:
  - healthcare
  - performance
  - metrics
  - comparison
  - research
  - evaluation
  - scalability
---
## Summary

Measured performance data reveals significant disparities between blockchain and federated EHR architectures. A systematic review found that of 61 implemented/prototyped blockchain healthcare systems, less than half (31) included any performance evaluation. None assessed read throughput — only transaction latency and write throughput were reported [@chukwu2020]. Tests used varied observation points, transaction characteristics, and hardware configurations, making direct comparison difficult.

Lightweight Blockchain performance: 11× less network traffic than Bitcoin-style full replication, 1.13× faster ledger updates when blocks increase, 67% speedup in processing time when nodes increase from 100 to 500 [@ismail2019]. However, even this optimised architecture uses PBFT consensus requiring f+1 (two-thirds) of manager nodes to agree — introducing latency proportional to network size.

SCALHEALTH benchmarked its dual-blockchain architecture: using separate Hyperledger Fabric blockchains per hospital (8 miners each) versus a single blockchain (16 miners for both hospitals). Results: separate blockchains achieved higher throughput and lower transaction recording time. At 60 TPS send rate: 3594 MiB RAM consumption, 83.34s recording time (proposed) vs 2227 MiB, 188.68s (single blockchain) [@mohammadi2024].

Federated FHIR framework achieved: 95%+ data retrieval accuracy, 38% latency reduction compared to conventional centralized systems, full HL7 FHIR protocol adherence [@adelusi2025]. The latency advantage comes from consensus-driven validation (no computationally expensive mining) and data localization (no cross-network replication).

Traditional database performance sets the baseline: relational databases achieve 10,000-100,000+ TPS with sub-millisecond latency. Even optimised permissioned blockchains (PBFT, clustered) achieve 100-10,000 TPS with seconds-level latency. Federation (FHIR-based) approaches 1,000-5,000 TPS with 100ms-1s latency. This gap reflects the fundamental overhead: blockchain pays for Byzantine fault tolerance and immutability; federation pays for cross-organizational governance.

## Key Points

- <50% of blockchain prototypes included performance evaluation — evidence is sparse
- Federated FHIR: 95% accuracy, 38% latency reduction vs centralized (measured)
- Lightweight blockchain: 11× less traffic, 67% faster updates vs Bitcoin (simulated)
- SCALHEALTH: dual-blockchain outperforms single by ~2× in throughput
- Baseline: relational databases 10K-100K+ TPS; blockchain 100-10K TPS; federation 1K-5K TPS

## Sources

- [@chukwu2020] Systematic review: performance evaluation gaps
- [@ismail2019] Lightweight blockchain simulation results
- [@mohammadi2024] SCALHEALTH dual-blockchain benchmarks
- [@adelusi2025] FHIR federated framework performance metrics

## Relevant notes

- [Performance Metrics for LoRa Health Systems](Resources/performance-metrics-for-lora-health-systems.md)
- [Blockchain Data Integrity for EHR Systems](Resources/blockchain-data-integrity-for-ehr-systems.md)
- [LoRa Viability for Distributed Health Records](Resources/lora-viability-for-distributed-health-records.md)
- [Patient Data Sovereignty in EHR Architectures](Resources/patient-data-sovereignty-in-ehr-architectures.md)
- [Executive Summary: Meshtastic for Distributed Health Records](Resources/executive-summary-meshtastic-for-distributed-health-records.md)