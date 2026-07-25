---
title: What Is a Wallet Pass? Definition, Capabilities, and Comparison
description: 'Definition of wallet pass: a live, updatable digital card in Apple/Google Wallet — offline barcode, push notifications, location-aware, one-tap enrollment.'
author: pi
editor: lam
date: 2026-07-25T00:28:41.601Z
tags:
  - digital-loyalty
  - mobile
  - qr-code
  - wallet
  - saas
  - user-experience
---
## Summary

A wallet pass is a digital file that lives in Apple Wallet or Google Wallet on a consumer's phone. It is a digital representation of a physical card — loyalty card, membership, event ticket, coupon, gift card, voucher, or stamp card. Unlike a static image or PDF, a wallet pass is a live, updatable object that pushes notifications to the lock screen, responds to location, and generates first-party data.

### Key Characteristics

**Always-on, not static.** A wallet pass is not a screenshot or a PDF. It is a cryptographically signed data bundle (`.pkpass` on Apple, JWT-authenticated JSON on Google) that the brand can update over the air. When a points balance changes, a tier upgrades, or an event time shifts, the pass updates automatically without the customer doing anything.

**Frictionless enrollment.** Customers add a pass in one tap from a QR code, link, email, SMS, or NFC tap. No app download, no account creation, no login. The wallet app is pre-installed on every modern iPhone and Android device — over 1.3 billion people carry Apple Wallet or Google Wallet globally.

**Works offline.** The pass and its barcode are stored on-device. It scans at the counter even without internet signal — the same reason boarding passes work on a plane. Only content updates (new points balance, changed gate) need a connection.

**Location-aware.** Passes can surface on the lock screen when the phone is near a defined location (store, venue, partner location). The brand can trigger notifications based on where the customer is.

**Direct brand channel.** A wallet pass gives a brand a direct, persistent presence on the customer's phone — without competing with email inboxes (15-25% open rate) or app notifications (75% of users lost within 3 days). Wallet push notifications achieve ~28% click-through rates compared to 1-2% for email.

### What a Wallet Pass Can Be

- **Loyalty card** — holds points balance, stamp count, membership tier, updates in real time
- **Coupon/voucher** — shows offer, expiry, remaining value; can update or disappear after redemption
- **Event ticket / boarding pass** — barcode scans offline; seat, gate, or time updates over air
- **Gift card** — carries live balance visible at a glance
- **Membership card** — gym, library, club — replaces plastic

### Comparison: Wallet Pass vs App vs Plastic Card

| Feature | Wallet Pass | Mobile App | Plastic Card |
|---------|------------|-----------|-------------|
| Enrollment | One QR scan | Download + install + account | Physical pickup |
| Always with customer | Yes (in native wallet) | Only if app installed | Easily lost/forgotten |
| Update capability | Over-the-air real-time | Requires app update | None |
| Push notifications | Lock screen (~28% CTR) | In-app (~75% churn in 3 days) | None |
| Offline usability | Full (barcode on device) | Varies | Full |
| Customer data | First-party, brand-owned | Depends on app permissions | None |
| Fraud protection | Signed/token-verified | Depends on implementation | Easily duplicated |
| Build cost | Dashboard-based, no code | High (iOS + Android dev) | Printing cost |
| Enrollment rate | 2-3x higher than app | Lower (download friction) | N/A |

### Key Points

- A wallet pass is a live, updatable digital card in Apple Wallet or Google Wallet — not a static image
- Added in one tap via QR code or link — no app download, no account creation
- Barcode stored on-device: works offline for scanning at counter
- Location-aware: can surface on lock screen near a store
- Push notifications from wallet pass achieve ~28% CTR vs 1-2% for email
- Brands can update passes over the air: points, tiers, expiry, offers
- Over 1.3 billion people have Apple Wallet or Google Wallet pre-installed
- The pass is a direct brand channel: no competition with inbox or third-party apps

## Relevant notes

- [Wallet Pass Fallback: Loyalty Programs Without Apple Wallet or Google Wallet](Resources/wallet-pass-fallback-loyalty-programs-without-apple-wallet-or-google-wallet.md)
- [Cirqle Stamp: QR-Based Digital Loyalty for Small Businesses](Resources/cirqle-stamp-qr-based-digital-loyalty-for-small-businesses.md)
- [QR-Based Digital Loyalty Stamp Programs: Mechanics and Benefits](Resources/qr-based-digital-loyalty-stamp-programs-mechanics-and-benefits.md)
- [Wallet Pass Token Generation: Apple Wallet PKPass and Google Wallet JWT Architecture](Resources/wallet-pass-token-generation-apple-wallet-pkpass-and-google-wallet-jwt-architecture.md)
- [Payment Method Independence in No-POS Digital Loyalty Programs](Resources/payment-method-independence-in-no-pos-digital-loyalty-programs.md)