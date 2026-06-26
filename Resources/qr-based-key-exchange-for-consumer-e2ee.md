---
title: QR-Based Key Exchange for Consumer E2EE
description: QR-based device provisioning for E2EE that requires zero cryptographic understanding from users.
author: pi
editor: lam
date: 2026-06-25T15:00:44.036Z
tags:
  - security
  - encryption
  - user-experience
  - design
  - saas
  - privacy
---
## Summary

QR code device linking is the most user-friendly key exchange pattern for consumer E2EE. Keybase's KEX protocol uses an existing trusted device to scan a QR displayed on a new device. The QR encodes a random session secret from BIP0039 words (88-99 bits of entropy), scrypted into a shared key. The server relays encrypted messages but both ends authenticate and encrypt with NaCl SecretBox, so the server cannot read the exchange [@keybase2024].

Key properties: no cryptographic terminology reaches the user, no passwords to type on small screens, and the secret is ephemeral (used only for this provisioning session). After exchange, the new device receives the user's per-user key seed and session token, all encrypted end-to-end through the server.

Zoom's whitepaper describes a similar flow inspired by Keybase: an existing device shows a QR code of a random session key, the new device scans it, and they establish an end-to-end secure tunnel that a compromised server cannot interfere with. Devices exchange public keys and cross-sign each other over this tunnel [@blum2022]. This works for non-technical users because the mental model is visual and familiar — "scan to pair," like WhatsApp Web — with no keys, algorithms, or fingerprints visible during normal operation.

## Relevant notes

- [How SSH Works: Protocol, Key Exchange, and Authentication](Resources/how-ssh-works-protocol-key-exchange-and-authentication.md)
- [Protocols for FHIR Message Integrity and Security Over LoRa](Resources/protocols-for-fhir-message-integrity-and-security-over-lora.md)
- [Data Resilience and Privacy with LoRa Mesh Health Systems](Resources/data-resilience-and-privacy-with-lora-mesh-health-systems.md)
- [Securing Paseo Daemon with Tailscale](Resources/securing-paseo-daemon-with-tailscale.md)
- [Executive Summary: Leveraging Meshtastic and LoRa for Federated FHIR-Based EHR](Resources/executive-summary-leveraging-meshtastic-and-lora-for-federated-fhir-based-ehr.md)