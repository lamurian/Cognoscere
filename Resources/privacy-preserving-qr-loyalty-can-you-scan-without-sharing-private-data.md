---
title: 'Privacy-Preserving QR Loyalty: Can You Scan Without Sharing Private Data?'
description: Whether QR loyalty scanning requires personal data processing — opaque IDs vs. blind signatures, differential privacy (GlassJar), and token-based zero-knowledge loyalty architectures.
author: pi
editor: lam
date: 2026-07-24T22:52:57.823Z
tags:
  - digital-loyalty
  - privacy
  - security
  - qr-code
  - cryptography
  - architecture
  - differential-privacy
---
## Summary

In standard QR-based digital loyalty programs (Cirqle Stamp, Loopy Loyalty, BonusQR, Revio), scanning a QR code **does require some data processing** — but the data is limited to an opaque identifier, not personal information. Whether this constitutes "private data being processed" depends on the threat model and the program's architecture.

### What Happens in a Standard QR Wallet-Pass Program

When a customer scans the enrollment QR code at a coffee shop, the system creates a digital pass linked to their phone. The barcode on that pass encodes an **opaque loyalty ID** (a random string or serial number) — not a name, email, phone number, or address. When the merchant scans this barcode on subsequent visits, their system looks up the loyalty ID server-side and retrieves the points balance. The personal data (if any was collected during enrollment) sits in the merchant's backend database, never on the pass itself.

However, most programs **do collect some identifier at enrollment** — typically a phone number, email, or name — because the merchant needs a way to recover the account if the customer loses their phone, and to send push notifications. Some programs (like BonusQR) offer enrollment with just a QR scan and no form, but this limits recovery options.

**What data is minimally processed:**
- The opaque loyalty ID on the pass
- Visit timestamps (recorded each time the pass is scanned)
- Whether a reward threshold was met (stored server-side)
- Push notification tokens (if the customer opted in)

**What is NOT on the pass:**
- Customer name, email, phone number
- Purchase history details (line items)
- Payment card information
- Location data beyond the merchant's POS

### Privacy-Preserving Architectures

**1. Partially blind signatures (Blanco-Justicia and Domingo-Ferrer, 2014).** This protocol uses partially blind signatures to let customers earn and spend loyalty points anonymously. The vendor sees only what the customer explicitly agrees to reveal. The customer can decide per-purchase whether to link the transaction to their profile. Anonymity is preserved unless the customer opts into profiling in exchange for extra rewards. This is the strongest theoretical privacy guarantee but rarely implemented in commercial programs because vendors lose profiling value.

**2. GlassJar (MIT, 2018).** A privacy-friendly loyalty framework where customers use RSA signatures to authenticate transactions without revealing itemized purchase details. Each purchase, the customer chooses: share itemized history (earn more points) or share only the total with Laplacian noise (earn standard points). When vendors sell data to third parties, they apply differential privacy (Laplacian mechanism) to query results, preventing individual re-identification. The key innovation: customers get fine-grained control per transaction, and third-party data sharing is differentially private.

**3. Token-based loyalty (ValiDeck, patented US12125054B2).** Repurposes payment card tokenization for loyalty. The customer's bank attests their public key (KYC already done), generates a payment card token, and maps it to a pseudonymous ValiDeck ID. Transactions are filed against the token, not the customer's name. The merchant runs a complete loyalty program — enrollment, earning, redemption — while holding zero customer identity. Cohort-level analytics are computed on aggregate data without ever identifying individuals. This is the only production-ready architecture that achieves true zero-knowledge loyalty.

**4. Apple/Google Wallet server-side lookup.** The barcode encodes only an opaque serial number. When scanned, the POS calls the loyalty platform's API to look up the balance. The merchant's POS never sees personal data unless the program explicitly collects it. If the program uses pass-only enrollment (no form), the merchant may never learn the customer's identity.

### The Trade-Off

Full anonymity (blind signatures, token-based) gives customers complete privacy but eliminates the vendor's ability to personalize offers, send targeted promotions, or recover lost accounts. Most vendors compensate by offering extra rewards for data sharing — creating a graduated privacy model where the customer chooses their privacy level per transaction. The standard wallet-pass program with an opaque loyalty ID is a reasonable middle ground: the merchant sees visit frequency and aggregate behavior but not identity, unless the customer voluntarily provides it.

### Can You Scan a QR Without Any Personal Data Being Processed?

**Yes, with significant caveats.** To have zero personal data processed:

1. Enrollment must require no email, phone, or name — just a QR scan (supported by some platforms).
2. The barcode must encode only an opaque random ID, not a hash of personal data.
3. The merchant must not link the loyalty ID to any external data source (CRM, email list).
4. Account recovery must be device-bound (lost phone = lost account).

Programs like ValiDeck's token-based loyalty achieve this through bank-attested cryptographic keys and tokenization. Standard wallet-pass programs approach it but typically collect at least a contact method for recovery.

### Key Points

- Standard QR wallet-pass barcodes encode an opaque loyalty ID, not personal data
- Personal data (name, email, phone) sits in the merchant's backend, not on the pass
- Enrollment typically requires at least a phone/email for account recovery
- Privacy-preserving architectures exist: blind signatures (academic), GlassJar (differential privacy), ValiDeck (token-based, patented)
- Token-based loyalty (ValiDeck) is production-ready with bank-attested keys — merchant holds zero identity
- Trade-off: full anonymity prevents personalization, lost account recovery, and targeted offers
- The opaque ID approach with pass-only enrollment is a practical middle ground: visit data tracked, identity not exposed unless volunteered

## Relevant notes

- [Cirqle Stamp: QR-Based Digital Loyalty for Small Businesses](Resources/cirqle-stamp-qr-based-digital-loyalty-for-small-businesses.md)
- [QR-Based Digital Loyalty Stamp Programs: Mechanics and Benefits](Resources/qr-based-digital-loyalty-stamp-programs-mechanics-and-benefits.md)
- [Wallet Pass Token Generation: Apple Wallet PKPass and Google Wallet JWT Architecture](Resources/wallet-pass-token-generation-apple-wallet-pkpass-and-google-wallet-jwt-architecture.md)
- [Digital Loyalty Program Architecture: Core Components](Resources/digital-loyalty-program-architecture-core-components.md)
- [QR-Based Key Exchange for Consumer E2EE](Resources/qr-based-key-exchange-for-consumer-e2ee.md)