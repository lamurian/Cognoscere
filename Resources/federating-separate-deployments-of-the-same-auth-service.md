---
title: Federating Separate Deployments of the Same Auth Service
description: 'How N independent instances of the same auth service federate: peer-to-peer IdP registration, hub-and-spoke brokering, and OpenID Federation 1.0 trust anchors with signed entity statements.'
author: pi
editor: lam
date: 2026-08-15T22:22:18.217Z
tags:
  - authentication
  - federation
  - oidc
  - saml
  - architecture
  - identity
  - security
  - multi-tenancy
  - reference
  - standards
---
## Summary

Federating separate deployments of the same auth service is standard identity federation — the fact that both sides run identical software does not change the protocol. Each deployment remains authoritative for its own users and acts as an identity provider (IdP); deployments in other domains act as service providers / relying parties (SP/RP) for its tokens. Trust is established by exchanging machine-readable metadata (SAML XML or OIDC discovery JSON) and recognizing each other's signing keys, not by sharing user databases [@startwithidentity2026].

Three topologies apply. **Direct (point-to-point):** each deployment registers the other as an external IdP — simple for 2-5 partners, but O(n^2) trust configuration at scale. **Hub-and-spoke:** a central broker (your IdP or a federation gateway) is the single trust point for all partners, cutting management to O(n). **Multi-hub mesh:** academic federations (eduGAIN, InCommon) interconnect hubs to reach massive scale [@startwithidentity2026].

Two mechanisms handle the same-service case. First, **peer-to-peer registration:** deployment A registers deployment B as a generic OIDC or SAML provider, and vice versa — exactly what Zitadel's generic OIDC template supports [@zitadel2026]. Home realm discovery routes users to the right IdP (email domain is the common strategy); account linking merges identities across domains [@startwithidentity2026]. Second, **trust-anchor mediation:** OpenID Federation 1.0 (finalized Feb 2026) lets a federation operator run a Trust Anchor that issues signed Entity Statements; each deployment publishes its own signed Entity Configuration (JWT), and trust chains prove federation membership. Metadata policies enforce interoperability and security profiles [@hedberg2026].

Operational mechanics matter more than the software choice: metadata URL exchange should be automated (SAML metadata polled daily, OIDC discovery refreshed automatically) so certificate rollovers propagate; attribute/claims mapping must be agreed (persistent NameID, role-based claims preferred); IdP and SP sessions have independent lifetimes; Single Logout is unreliable across domains [@startwithidentity2026]. A known gap: joining aggregated SAML federations (eduGAIN style) requires acting as a single SP for the whole federation — Zitadel cannot do this yet [@glatzert2024]. SCIM is the companion standard for provisioning federated users across deployments.

## Key Points

- Same software on both sides means mirrored configuration, not custom protocols — federation is vendor-neutral [@startwithidentity2026]
- Topologies: direct O(n^2), hub-and-spoke O(n), multi-hub mesh for eduGAIN/InCommon scale [@startwithidentity2026]
- Mechanism 1: peer-to-peer generic OIDC/SAML provider registration between instances [@zitadel2026]
- Mechanism 2: OpenID Federation 1.0 Trust Anchor + signed Entity Statements and trust chains [@hedberg2026]
- Automate metadata exchange for certificate rollover; persistent NameIDs; role-based claims; SLO unreliable [@startwithidentity2026]
- Aggregated SAML federation (single SP entity ID) unsupported in Zitadel as of the open discussion [@glatzert2024]

## Sources

- [@startwithidentity2026] Identity federation implementation guide
- [@zitadel2026] ZITADEL external IdP docs
- [@hedberg2026] OpenID Federation 1.0 final specification
- [@glatzert2024] Zitadel GitHub discussion #8942
- [Security Model Comparison for EHR Systems](Resources/security-model-comparison-for-ehr-systems.md) — federation relies on organizational trust boundaries

## Relevant notes

- [Federation Support Comparison: Casdoor, Zitadel, SuperTokens](Resources/federation-support-comparison-casdoor-zitadel-supertokens.md)
- [SuperTokens: Open-Source Authentication Architecture](Resources/supertokens-open-source-authentication-architecture.md)
- [Open-Source Go Auth Services: Feature Comparison](Resources/open-source-go-auth-services-feature-comparison.md)
- [Security Model Comparison for EHR Systems](Resources/security-model-comparison-for-ehr-systems.md)
- [Patient Data Sovereignty in EHR Architectures](Resources/patient-data-sovereignty-in-ehr-architectures.md)