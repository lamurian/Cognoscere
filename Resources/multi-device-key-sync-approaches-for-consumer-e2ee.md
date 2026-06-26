---
title: Multi-Device Key Sync Approaches for Consumer E2EE
description: Comparison of per-device, server-synced, and per-user key (PUK) approaches for E2EE across multiple user devices.
author: pi
editor: lam
date: 2026-06-25T15:00:44.039Z
tags:
  - security
  - encryption
  - saas
  - design
  - technology
  - best-practices
  - user-experience
---
## Summary

Multi-device key sync is the hardest engineering challenge in consumer E2EE. Per-device keys (no sync) are simplest: each device generates independent key pairs, old messages readable only on that device. Requires excellent onboarding — QR device linking and clear messaging that old messages won't appear on new devices [@editorialteam2026].

Server-synced with extra encryption: keys encrypted at rest with a user-derived secret and synced through the server. Requires a trusted provisioning path. The Technori guide calls this "complex or leaky" — the sync layer itself needs an additional encryption layer [@editorialteam2026].

Per-user keys (PUKs) with device approval: Zoom's approach creates a cryptographic trust graph where each PUK generation seeds multiple sub-keys (email, voicemail, storage). New devices get current keys, approved devices get historical keys, revoked devices lose access. A trust graph via BatchApprove links binds device approval classes [@blum2022]. Choose based on UX priorities: per-device keys sacrifice cross-device history; PUKs provide seamless multi-device experience at much higher engineering cost.

## Relevant notes

- [Account Recovery Patterns for Consumer E2EE SaaS](Resources/account-recovery-patterns-for-consumer-e2ee-saas.md)
- [QR-Based Key Exchange for Consumer E2EE](Resources/qr-based-key-exchange-for-consumer-e2ee.md)
- [Communicating E2EE Threat Models to Non-Technical Users](Resources/communicating-e2ee-threat-models-to-non-technical-users.md)
- [Executive Summary: Meshtastic for Distributed Health Records](Resources/executive-summary-meshtastic-for-distributed-health-records.md)
- [Self-Hosted Software Stack for Off-Grid Resilience](Resources/self-hosted-software-stack-for-off-grid-resilience.md)