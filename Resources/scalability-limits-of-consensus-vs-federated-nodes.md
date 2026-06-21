---
title: Scalability Limits of Consensus vs Federated Nodes
description: How consensus mechanisms and federated node architectures impose different scalability constraints
author: pi
editor: lam
date: 2026-06-21T00:02:15.877Z
tags:
  - healthcare
  - scalability
  - comparison
  - research
  - architecture
  - performance
  - network
---
## Summary

Scalability in distributed EHR systems is constrained by fundamentally different architectural bottlenecks. Blockchain consensus mechanisms face a trilemma: decentralization, security, and scalability cannot all be maximised simultaneously [@yeung2021; @chukwu2020]. Proof-of-Work (PoW) requires all nodes to validate all transactions, limiting throughput to ~7 TPS (Bitcoin) or ~15 TPS (Ethereum). Proof-of-Stake (PoS) improves to ~30 TPS but still imposes global consensus overhead.

Permissioned blockchains using PBFT (Practical Byzantine Fault Tolerance) improve throughput significantly (100-10,000 TPS depending on node count) but face a quadratic communication overhead: PBFT requires O(n²) messages where n is the number of validating nodes. This means adding nodes degrades performance non-linearly. The Lightweight Blockchain addresses this through clustering — only cluster heads (BCMs) participate in consensus, reducing replication from all nodes to ~10% of nodes, achieving 10-11× traffic reduction [@ismail2019].

SCALHEALTH proposes a more radical scalability solution: separate blockchains per hospital rather than one global chain. Since patient transactions are independent (unlike financial transactions), hospitals can maintain parallel blockchains with their own miner pools. Benchmarks showed separate blockchains recorded transactions in 83.34s (60 TPS) vs 188.68s for a single chain — a 2.26× improvement [@mohammadi2024].

Federated architectures scale differently. The FHIR-based federated framework uses distributed data repositories where data stays at originating institutions. Each hospital's EHR system handles local load independently; cross-institutional queries use consensus-driven validation rather than global replication. This avoids the O(n²) consensus overhead entirely — scalability is limited by network bandwidth and API gateway throughput rather than consensus [@adelusi2025].

The fundamental scalability trade-off: blockchain pays O(n²) or O(n) consensus overhead for every transaction, making it inherently less scalable than federation as node count grows. Federation pays O(1) per local transaction and O(k) for cross-institutional queries (where k < n), making it more scalable for read-heavy workloads. However, federation sacrifices the deterministic immutability and tamper-proofing that blockchain provides.

## Key Points

- Blockchain trilemma: decentralization, security, scalability cannot be maximised together
- PBFT consensus is O(n²) messaging overhead — limits node count
- Clustering reduces to ~10% node participation (Lightweight Blockchain)
- Separate blockchains per hospital improves throughput 2.26× (SCALHEALTH)
- Federation scales O(1) local, O(k) cross-institutional — inherently more scalable

## Sources

- [@yeung2021] JMIR: blockchain trilemma applied to healthcare
- [@chukwu2020] Systematic review: consensus mechanisms
- [@ismail2019] Lightweight blockchain: clustering approach
- [@mohammadi2024] SCALHEALTH: separate blockchains per hospital
- [@adelusi2025] FHIR federated framework: distributed node architecture

## Relevant notes

- [Throughput and Latency in EHR Systems](Resources/throughput-and-latency-in-ehr-systems.md)
- [Blockchain Data Integrity for EHR Systems](Resources/blockchain-data-integrity-for-ehr-systems.md)
- [Patient Data Sovereignty in EHR Architectures](Resources/patient-data-sovereignty-in-ehr-architectures.md)
- [Security Model Comparison for EHR Systems](Resources/security-model-comparison-for-ehr-systems.md)
- [Federation Security Risks in Healthcare](Resources/federation-security-risks-in-healthcare.md)