---
title: Security Model Comparison for EHR Systems
description: Comparative analysis of security models in blockchain and federation architectures for preventing unauthorized access and breaches
author: pi
editor: lam
date: 2026-06-21T00:02:15.897Z
tags:
  - healthcare
  - security
  - comparison
  - research
  - authentication
  - privacy
  - architecture
---
## Summary

Blockchain and federation architectures implement fundamentally different security models. Blockchain relies on cryptographic trust: transactions are validated by consensus, immutably recorded, and auditable by all permissioned nodes. Federation relies on organizational trust boundaries: access is controlled by institutional authentication (OAuth, SAML) and data sharing is governed by inter-organizational agreements [@chukwu2020].

The Lightweight Blockchain architecture evaluated its security model against seven threat categories: DoS, data modification, block dropping, invalid block appending, anonymity, authentication, and impersonation. Key mitigations include: single HBCM processing transactions to filter DoS; immutability preventing data modification; canal-based isolation preventing cross-canal attacks; and permissioned access limiting node participation [@ismail2019].

SCALHEALTH provides a multi-layered security model combining: (1) authentication protocol with symmetric shared key agreement between patient and hospital gateway, (2) IPFS-based off-chain encrypted storage, (3) Hyperledger Fabric for metadata integrity with device manufacturer miner verification, (4) NFTs for prescription authenticity preventing forgery. The dual-blockchain architecture (health + financial) ensures transaction independence [@mohammadi2024].

Federated security relies on a different model: data never leaves the originating institution. The FHIR framework demonstrated "the federated model significantly reduced the risk of data breaches, as no raw data was transferred" [@adelusi2025]. Security is maintained through: consent management modules at each node, FHIR-based API security (OAuth 2.0, SMART on FHIR), encrypted point-to-point communication, and consensus-driven validation of queries.

The JMIR study identified several unresolved security challenges for both architectures. For blockchain: "data leakage or escape" (once data is revealed, recipients can copy it indefinitely), the "garbage-in-garbage-out" problem (immutability preserves inaccurate data), and performance-security trade-offs. For federation: organizational trust must be established through legal agreements, which are "difficult to navigate" and "very challenging" to enforce [@yeung2021].

The key difference: blockchain provides security through mathematical proof (computational trust); federation provides security through organizational policy (social trust). Blockchain excels at preventing unauthorized modification post-factum; federation excels at preventing unauthorized access ex-ante.

## Key Points

- Blockchain: cryptographic trust via consensus, immutability, auditability (computational trust)
- Federation: organizational trust via access control, consent management, data localization
- Lightweight Blockchain: canals provide transaction isolation between groups
- SCALHEALTH: authentication protocol + IPFS + Fabric + NFT multi-layer model
- FHIR federation: no raw data transfer, OAuth 2.0, encrypted P2P
- Each model protects against different threats; neither is universally superior

## Sources

- [@ismail2019] Security analysis against 7 threat categories
- [@mohammadi2024] SCALHEALTH multi-layer security
- [@adelusi2025] FHIR federated security: data stays at origin
- [@yeung2021] Data leakage/escape, GIGO challenges
- [@chukwu2020] Privacy/security compliance: HIPAA, GDPR analysis

## Relevant notes

- [Patient Data Sovereignty in EHR Architectures](Resources/patient-data-sovereignty-in-ehr-architectures.md)
- [Blockchain Data Integrity for EHR Systems](Resources/blockchain-data-integrity-for-ehr-systems.md)
- [Federation Security Risks in Healthcare](Resources/federation-security-risks-in-healthcare.md)
- [Executive Summary: Meshtastic for Distributed Health Records](Resources/executive-summary-meshtastic-for-distributed-health-records.md)
- [Patient Authorization Methods for LoRa Health Systems](Resources/patient-authorization-methods-for-lora-health-systems.md)