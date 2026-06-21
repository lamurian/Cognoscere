---
title: Patient Data Sovereignty in EHR Architectures
description: How blockchain and federation architectures impact patient control, data ownership, and privacy
author: pi
editor: lam
date: 2026-06-21T00:01:44.294Z
tags:
  - healthcare
  - privacy
  - research
  - comparison
  - architecture
  - legal
  - policy
---
## Summary

Blockchain and federation architectures offer fundamentally different models of patient data sovereignty. Blockchain proponents argue it enables "fine-grained, patient-controlled access, sharing, and management of EHRs" through self-sovereign identity and smart contract-based consent management [@yeung2021]. However, the JMIR study found this claim "unlikely to live up to its perceived promise" due to unresolved challenges in data tethering (linking on-chain hashes to accurate off-chain records), data escape (once accessed, data can be copied indefinitely), and the garbage-in-garbage-out problem.

SCALHEALTH implements patient sovereignty through an authentication protocol where patients register with hospital gateways via secure channels, establish symmetric shared keys, and grant/revoke permissions through blockchain transactions. Patient data is encrypted and stored on IPFS, only metadata hashes reside on-chain. NFTs are used to authenticate prescriptions sent from doctors to pharmacies and insurers [@mohammadi2024].

The FHIR-based federated framework implements patient sovereignty differently: consent management modules at each institution control data access, patients retain data at their originating healthcare provider, and authorized queries return only permitted information. "The federated model significantly reduced the risk of data breaches, as no raw data was transferred" [@adelusi2025]. This aligns with GDPR's data minimization principle.

The JMIR study identified three normative tensions requiring resolution: (1) high performance/scalability vs adequate security, (2) transparency/accountability vs privacy/confidentiality, and (3) computational trust vs social trust [@yeung2021]. These tensions are architectural: blockchain optimises for computational trust and transparency but may compromise privacy; federation optimises for privacy-by-design through data localization but relies on organizational trust.

No current system fully resolves patient sovereignty. Blockchain systems store only hashes on-chain (following "minimal sufficiency" principle), meaning patient data still resides in traditional databases. Federation systems keep data at institutions but patients lack unified visibility. Both architectures fall short of true patient-controlled sovereignty in practice.

## Key Points

- Blockchain promises patient-controlled sovereignty via smart contracts and self-sovereign identity
- JMIR review: this promise "unlikely to live up to perceived promise" in practice
- SCALHEALTH: authentication protocol + IPFS + NFT-based prescription authentication
- FHIR federation: data stays at origin, consent modules control access, no raw data transfer
- Three unresolved tensions: scalability vs security, transparency vs privacy, computational vs social trust

## Sources

- [@yeung2021] JMIR: critical assessment of patient-controlled sovereignty
- [@mohammadi2024] SCALHEALTH: authentication protocol, IPFS, NFT prescriptions
- [@adelusi2025] FHIR federated framework: consent management, data localization
- [@chukwu2020] Systematic review: storage schemes (on-chain vs off-chain)

## Relevant notes

- [Regulatory and Evaluation Frameworks for LLMs in Healthcare](Resources/regulatory-and-evaluation-frameworks-for-llms-in-healthcare.md)
- [Blockchain Data Integrity for EHR Systems](Resources/blockchain-data-integrity-for-ehr-systems.md)
- [Federation Security Risks in Healthcare](Resources/federation-security-risks-in-healthcare.md)
- [Issues, Opportunities, and Best Practices for LLMs in Healthcare and Medical Informatics](Resources/issues-opportunities-and-best-practices-for-llms-in-healthcare-and-medical-informatics.md)
- [Executive Summary: Meshtastic for Distributed Health Records](Resources/executive-summary-meshtastic-for-distributed-health-records.md)