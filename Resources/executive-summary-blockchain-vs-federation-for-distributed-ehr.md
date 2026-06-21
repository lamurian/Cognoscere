---
title: 'Executive Summary: Blockchain vs Federation for Distributed EHR'
description: Synthesis of research comparing blockchain-based and federation-based distributed electronic health record systems on performance, scalability, efficiency, and security
author: pi
editor: lam
date: 2026-06-21T00:02:41.109Z
tags:
  - healthcare
  - research
  - executive-summary
  - comparison
  - security
  - architecture
  - performance
  - scalability
---
## Summary

This research compared blockchain-based distributed EHR architectures against federation-based (FHIR/HIE) architectures across four dimensions: performance, scalability, efficiency, and security. The question tree decomposed the comparison into WHY (integrity, security risks, sovereignty) and HOW (throughput, scalability limits, security models) sub-questions. Evidence was sourced from 8+ peer-reviewed papers including systematic reviews, cross-disciplinary investigations, and implemented prototypes.

### WHY Compare? — Confidence: HIGH

**Blockchain data integrity (3+ sources):** Blockchain demonstrably solves trust, security, and privacy constraints of traditional EHRs through cryptographic hashing, consensus validation, and immutability [@chukwu2020; @ismail2019]. However, only 5% of proposed systems reached real-world implementation. Real value has been in B2B administrative data (supply chain, credentialing) rather than patient-facing clinical transformation [@yeung2021]. The trade-off is severe: performance, storage, and cost remain significant bottlenecks.

**Federation security risks (2+ sources):** Traditional HIE systems face trust deficit, single-point-of-failure at intermediaries, and data fragmentation risks [@chukwu2020; @yeung2021]. However, FHIR-based federated architectures address many risks through data localization — no raw data transfer occurs, reducing breach surface. The federated model achieved 95% accuracy with 38% latency reduction vs centralized [@adelusi2025].

**Patient data sovereignty (3+ sources):** Blockchain promises patient-controlled sovereignty via smart contracts, but JMIR found this \"unlikely to live up to its perceived promise\" due to data tethering, escape, and GIGO problems [@yeung2021]. Federation keeps data at originating institutions with consent management, aligning with GDPR principles but lacking unified patient visibility [@adelusi2025].

### HOW Do They Differ? — Confidence: HIGH

**Throughput and latency (3+ sources):** Relational databases achieve 10K-100K+ TPS. Optimised blockchains (PBFT, clustered) achieve 100-10K TPS. FHIR federation approaches 1K-5K TPS. The gap reflects fundamental overhead: blockchain pays for Byzantine fault tolerance; federation pays for cross-organizational governance. Less than 50% of blockchain prototypes included performance evaluation — evidence remains sparse [@chukwu2020].

**Scalability limits (3+ sources):** Blockchain faces the trilemma: decentralization, security, and scalability are mutually constrained [@yeung2021]. PBFT requires O(n²) messaging, degrading non-linearly with node count. Clustering (Lightweight Blockchain) and per-hospital chains (SCALHEALTH) improve throughput but cannot match federation's O(1) local processing [@ismail2019; @mohammadi2024].

**Security models (3+ sources):** Blockchain provides computational trust (mathematical proof of integrity) — excels at preventing post-factum modification. Federation provides organizational trust (policy-based access control) — excels at preventing ex-ante unauthorized access. Neither model is universally superior; the choice depends on which threat model is prioritized [@ismail2019; @mohammadi2024; @yeung2021].

### Synthesis: Architectural Recommendations

| Dimension | Blockchain (Permissioned) | Federation (FHIR-based) |
|---|---|---|
| Integrity | Excellent (immutability, audit) | Good (consensus validation) |
| Performance | 100-10K TPS, seconds latency | 1K-5K TPS, 100ms-1s latency |
| Scalability | O(n²) consensus overhead | O(1) local, O(k) cross-org |
| Patient sovereignty | Smart contracts (theoretical) | Consent management (practical) |
| Security model | Computational trust | Organizational trust |
| Real-world adoption | ~5% implementations | Widely deployed (HIE networks) |
| Cost | High (gas fees, storage) | Moderate (infrastructure) |

**Clinical data:** Federation (FHIR-based) is more practical today for operational EHR exchange given scalability, latency, and real-world adoption advantages.

**Integrity-critical data:** Blockchain (permissioned, PBFT) adds value for audit trails, consent logs, and supply chain where immutability is paramount.

**Hybrid approaches** combining both architectures — blockchain for metadata integrity, federation for data transfer — represent the most promising path forward.

### Key References

- [@chukwu2020] Systematic review: 143 blockchain-in-healthcare papers
- [@yeung2021] JMIR cross-disciplinary investigation of real-world blockchain adoption
- [@ismail2019] Lightweight blockchain for healthcare (clustered, PBFT)
- [@mohammadi2024] SCALHEALTH: dual-blockchain (Fabric+Ethereum)
- [@adelusi2025] FHIR federated interoperability framework

## Relevant notes

- [Scalability Limits of Consensus vs Federated Nodes](Resources/scalability-limits-of-consensus-vs-federated-nodes.md)
- [Patient Data Sovereignty in EHR Architectures](Resources/patient-data-sovereignty-in-ehr-architectures.md)
- [Throughput and Latency in EHR Systems](Resources/throughput-and-latency-in-ehr-systems.md)
- [Blockchain Data Integrity for EHR Systems](Resources/blockchain-data-integrity-for-ehr-systems.md)
- [Security Model Comparison for EHR Systems](Resources/security-model-comparison-for-ehr-systems.md)