---
title: 'Wallet Pass Token Generation: Apple Wallet PKPass and Google Wallet JWT Architecture'
description: How Apple Wallet (.pkpass signed bundles) and Google Wallet (JWT REST API) generate, sign, update, and manage loyalty passes under the hood.
author: pi
editor: lam
date: 2026-07-24T22:51:23.824Z
tags:
  - digital-loyalty
  - architecture
  - mobile
  - qr-code
  - api
  - security
  - wallet
---
## Summary

Digital loyalty passes in Apple Wallet and Google Wallet are not simple QR images — they are cryptographically signed data bundles (Apple) or JWT-based REST objects (Google) that encode loyalty state and update over the air. Understanding how the backend generates and manages these passes is essential to understanding what data flows where.

### Apple Wallet (.pkpass)

An Apple Wallet pass is a signed `.pkpass` bundle — a ZIP archive containing a `pass.json` manifest and image assets. The pass is signed with a pass certificate issued through the Apple Developer Program ($99/year). The signature must be valid; unsigned passes silently fail with no error message.

**Pass structure.** `pass.json` defines the pass type (loyalty, coupon, boarding pass, etc.), visual layout (fields: header, primary, secondary, auxiliary), barcode data (encoding loyalty ID or serial number), and web service URLs for updates. The barcode field typically encodes a unique customer identifier or serial number that the merchant's POS scans on each visit.

**Update lifecycle.** The backend generates and signs the `.pkpass` → customer adds it to Wallet → on each qualifying action, the backend sends a push notification through Apple Push Notification service (APNs) → the device fetches a new `.pkpass` from the backend's web service endpoint → Wallet displays the updated pass. The backend must implement a web service with endpoints for: registering passes (POST), getting the latest pass (GET), and unregistering (DELETE). Passes are identified by a `passTypeIdentifier` + `serialNumber` pair; same identifiers cause stacking in the Wallet app.

**Certificate management.** Pass certificates expire annually. Renewing requires generating new certificates on the Apple Developer Portal, re-signing all passes, and pushing updates to all devices. There is no automated way to generate pass identifiers and certificates — it must be done manually.

### Google Wallet (JWT-based REST API)

Google Wallet uses a REST API with JWT authentication. Passes are JSON objects submitted to the Google Wallet API, and updates propagate through Google's infrastructure directly — no APNs-style relay needed.

**Authentication.** A Google Cloud service account generates a JWT signed with a private key. This JWT authenticates all API calls to the Google Wallet API. No annual certificates, no developer program fee.

**Pass structure.** Passes are JSON objects conforming to a defined schema (loyaltyClass, loyaltyObject). Each pass has `class` (template-level: business info, colors, logo) and `object` (instance-level: customer-specific data like points balance, barcode value, state). Barcode data encodes a loyalty ID or serial number.

**Update lifecycle.** The customer adds a pass via a "Save to Google Wallet" link (a URL to the Google Wallet API with the class/object ID). When the customer earns points, the backend sends the updated pass object to the Google Wallet API. Google's infrastructure pushes the update to the device automatically. No direct push infrastructure needed from the backend.

**Production requirements.** Initially only demo passes are allowed. Google requires business profile validation and screenshots of passes to approve production access.

### Data Embedded in Barcodes

Both platforms encode a customer-specific identifier in the barcode (typically a loyalty ID, serial number, or token). When the merchant scans this barcode at the POS, their system looks up the customer's current balance server-side. The barcode itself does not contain personal data (name, email, phone) — only an opaque identifier. The personal data resides in the merchant's backend, linked to that identifier.

### Pass Update Comparison

| Feature | Apple Wallet | Google Wallet |
|---------|-------------|---------------|
| Pass format | Signed `.pkpass` (ZIP+JSON) | JWT-authenticated JSON |
| Update push | APNs → device fetches new pass | Direct API push → Google infrastructure |
| Developer fee | $99/year (Apple Developer Program) | None |
| Certificate | Pass certificate (annual renewal) | None (JWT service account) |
| Debugging | Console.app (silent failures) | Web dashboard + emulator |
| Production | Immediate with developer account | Business validation required |
| Stacking | Same identifier stacks | No stacking |

### Key Points

- Apple Wallet: `.pkpass` signed with pass certificate, updates via APNs + backend web service
- Google Wallet: JWT-authenticated JSON via REST API, updates through Google's infrastructure
- Barcode encodes an opaque customer identifier, not personal data — personal info stays on merchant's backend
- Apple certificates expire annually with no automated renewal
- Google requires business validation for production passes
- Both platforms support push notifications for balance updates, promotions, and rewards

## Relevant notes

- [QR-Based Digital Loyalty Stamp Programs: Mechanics and Benefits](Resources/qr-based-digital-loyalty-stamp-programs-mechanics-and-benefits.md)
- [Cirqle Stamp: QR-Based Digital Loyalty for Small Businesses](Resources/cirqle-stamp-qr-based-digital-loyalty-for-small-businesses.md)
- [Bibit: Robo-Advisor Mutual Fund and SBN Platform Indonesia](Resources/bibit-robo-advisor-mutual-fund-and-sbn-platform-indonesia.md)
- [SuperTokens: Open-Source Authentication Architecture](Resources/supertokens-open-source-authentication-architecture.md)
- [Bareksa: Indonesia's First Digital Mutual Fund Marketplace](Resources/bareksa-indonesia-s-first-digital-mutual-fund-marketplace.md)