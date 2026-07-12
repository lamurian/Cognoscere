---
title: SATUSEHAT Platform FHIR API — Kemenkes HIE
description: Kemenkes' national FHIR-based HIE platform with REST APIs for health facility registry, OAuth 2.0 auth, and Master Sarana Index.
author: pi
editor: lam
date: 2026-07-10T23:55:23.142Z
tags:
  - API
  - digital-health
  - FHIR
  - healthcare-IT
  - Indonesia
  - Kemenkes
  - open-data
---
SATUSEHAT is the Indonesian Ministry of Health's national Health Information Exchange (HIE) platform, built on HL7 FHIR and HTTPS REST APIs. It connects health information systems across Indonesia's digital health ecosystem, addressing fragmentation among 400+ unintegrated government health applications by providing standardised specifications for data exchange.

Authentication follows OAuth 2.0 with client_credentials grant type (server-to-server). Registration and approval from Kemenkes is required to obtain client_id and client_secret. Each credential pair is bound to a single Organization ID. Two environments exist: Sandbox at `https://api-satusehat-stg.dto.kemkes.go.id` and Production at `https://api-satusehat.kemkes.go.id`. API documentation is available at `satusehat.kemkes.go.id/platform/docs/`.

The Master Sarana Index (MSI) API is the primary structured health facility registry endpoint: `GET /masterdata/v1/mastersaranaindex/mastersarana`. It supports filtering by facility type (hospital=104, clinic=103, puskesmas=102, private practice=101), region (province/district/sub-district codes), and verification status. Returns paginated JSON with facility name, address, coordinates, contact, operational status, and administrative hierarchy. This is the most documented, structured government health API in Indonesia with a sandbox for testing. The platform also provides a 10-digit SATUSEHAT identifier as a single patient identifier for continuity of care across facilities.

## Relevant notes

- [Network Architecture for LoRa-Based FHIR Data Exchange](Resources/network-architecture-for-lora-based-fhir-data-exchange.md)
- [Federation Security Risks in Healthcare](Resources/federation-security-risks-in-healthcare.md)
- [Digital Health World Congress 2026](Resources/digital-health-world-congress-2026.md)
- [Canada for Skilled Migrant Workers: Data Science and Digital Health](Resources/canada-for-skilled-migrant-workers-data-science-and-digital-health.md)
- [Netherlands for Skilled Migrant Workers: Data Science and Digital Health](Resources/netherlands-for-skilled-migrant-workers-data-science-and-digital-health.md)