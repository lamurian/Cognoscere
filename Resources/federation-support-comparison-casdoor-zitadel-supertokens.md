---
title: 'Federation Support Comparison: Casdoor, Zitadel, SuperTokens'
description: 'How the three low-resource auth services compare on identity federation: Casdoor free both-role SAML/OIDC, Zitadel strong brokering but no SAML federation-gateway, SuperTokens paid-only SAML.'
author: pi
editor: lam
date: 2026-08-15T22:22:18.213Z
tags:
  - authentication
  - casdoor
  - zitadel
  - supertokens
  - federation
  - saml
  - oidc
  - comparison
  - golang
  - identity
  - security
  - self-hosting
---
## Summary

All three low-resource auth services support identity federation, but maturity and cost differ sharply. Identity federation here means the service acting as an identity provider (IdP) for external parties, consuming external IdPs, or both [@startwithidentity2026].

**Casdoor has the strongest free federation support.** It acts as both a SAML 2.0 IdP (metadata URL, signed assertions with configurable assertion signing, GET/POST bindings) and a consumer of 100+ external providers via OAuth 2.0, OIDC, SAML, CAS, and LDAP [@casdoor2026]. Casdoor Identity Cloud markets exactly this capability: "federated identity — act as both identity provider and consumer," connecting enterprise IdPs like Azure AD, Okta, and PingFederate. This comes on the leanest footprint of the three at 100k MAU (~EUR 6/month, 2 vCPU / 4 GB) [@danian2026].

**Zitadel is a strong identity broker but lacks federation-gateway mode.** It integrates external IdPs (Google, GitHub, EntraID, Auth0, Okta, Keycloak) via generic OIDC and SAML templates at instance or organization level, and acts as an OIDC IdP for applications — the classic broker pattern [@zitadel2026]. The gap: it cannot join aggregated SAML federations such as eduGAIN, InCommon, or DFN AAI, which require a single SP entity ID for the whole federation plus metadata auto-import. This is an open GitHub discussion since Nov 2024 with no resolution [@glatzert2024].

**SuperTokens federation is a paid enterprise feature.** SAML SSO requires the Enterprise Edition, Core >= 11.3, and currently only the Node.js SDK (Python/Go support in development). SAML clients are scoped per tenant [@supertokens2026]. Social login via the free ThirdParty recipe covers OAuth/OIDC providers but not SAML federation.

## Key Points

- Casdoor: free, both-role federation (IdP + SP), SAML 2.0 IdP with metadata URL, 100+ external providers, Apache 2.0 [@casdoor2026]
- Zitadel: excellent OIDC/SAML brokering with org-level IdP assignment, but no aggregated SAML federation support (open since Nov 2024) [@zitadel2026; @glatzert2024]
- SuperTokens: SAML SSO is Enterprise-only, Node.js SDK only, per-tenant SAML clients [@supertokens2026]
- Resource ranking at 100k MAU is unchanged by federation: Casdoor cheapest, Zitadel mid, SuperTokens costliest [@danian2026]

## Sources

- [@casdoor2026] Casdoor SAML IdP docs
- [@zitadel2026] ZITADEL external IdP docs
- [@glatzert2024] Zitadel GitHub discussion #8942 — SAML federation support
- [@supertokens2026] SuperTokens SAML enterprise docs
- [@startwithidentity2026] Identity federation implementation guide
- [Open-Source Go Auth Services: Feature Comparison](Resources/open-source-go-auth-services-feature-comparison.md)
- [Auth Service Resource Consumption at 100k MAU: Executive Summary](Resources/auth-service-resource-consumption-at-100k-mau-executive-summary.md)

## Relevant notes

- [Auth Service Resource Consumption at 100k MAU: Executive Summary](Resources/auth-service-resource-consumption-at-100k-mau-executive-summary.md)
- [Federating Separate Deployments of the Same Auth Service](Resources/federating-separate-deployments-of-the-same-auth-service.md)
- [Open-Source Go Auth Services: Feature Comparison](Resources/open-source-go-auth-services-feature-comparison.md)
- [SuperTokens: Open-Source Authentication Architecture](Resources/supertokens-open-source-authentication-architecture.md)
- [Zitadel Resource Consumption at 100k MAU](Resources/zitadel-resource-consumption-at-100k-mau.md)