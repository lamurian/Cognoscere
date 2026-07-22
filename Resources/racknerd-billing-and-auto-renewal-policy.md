---
title: RackNerd Billing and Auto-Renewal Policy
description: RackNerd does not auto-charge credit cards at renewal; invoices are generated 14 days prior, must be paid manually, or use account balance for auto-deduction
author: pi
editor: lam
date: 2026-07-22T11:39:14.362Z
tags:
  - vps
  - budget
  - cloud-computing
  - infrastructure
  - self-hosting
  - billing
  - hosting
---
## Summary

RackNerd does not auto-charge your credit card (or any stored payment method) at renewal. The billing flow is: the system generates a renewal invoice 14 days before the service due date, sends an email notification, and you must manually log in to the client portal and pay it. There is no stored-card auto-pay feature on RackNerd's platform, unlike many subscription services that automatically charge on the billing date.

The only way to achieve true automatic renewal is to pre-fund your RackNerd account balance via the "Add Funds" feature. When the renewal invoice is generated 14 days before due date, the system will automatically deduct the amount from your account balance if sufficient funds exist. This is the only mechanism RackNerd offers for hands-off renewal.

If a renewal invoice goes unpaid, a 10% late fee applies after 3 days past due. The service is automatically terminated 7 days after the due date, and all data is permanently deleted. Cancellation requires a 5-day written notice submitted through the client portal before the renewal date. RackNerd uses FastSpring as its third-party payment gateway, which does not support automatic recurring billing — it processes one-time payments only.

## Key Points

- **No auto-charge on credit cards:** RackNerd does not automatically charge stored credit cards, PayPal, or other payment methods at renewal. An invoice is generated but you must pay it manually.
- **Invoice timing:** Renewal invoices are automatically generated 14 days (two weeks) before the service due date. An email notification titled "Customer Invoice" is sent.
- **Manual payment required:** Log in to my.racknerd.com → My Invoices → find unpaid invoice → pay manually via credit card, PayPal, crypto, Alipay, or wire transfer.
- **Account balance auto-renewal:** Pre-fund your account via Billing → Add Funds. When the renewal invoice is generated, the system auto-deducts from the balance. This is the only true auto-renewal mechanism.
- **Early renewal:** A "Generate Renewal Invoice" button in the client portal lets you generate and pay renewal invoices early (before the 14-day window).
- **Late payment:** 10% late fee after 3 days past due. Service terminated 7 days past due. Data permanently deleted on termination.
- **Cancellation:** 5-day written notice required through the client portal before the renewal date. No standard refunds (case-by-case only).
- **Lifetime price lock:** The promotional deal price applies at renewal as long as you renew before service expiry. Missing the renewal forfeits the deal price.
- **Payment methods accepted:** All major credit cards (AMEX, Discover, VISA, MasterCard), PayPal, cryptocurrency (Bitcoin, Bitcoin Cash, Litecoin, Ethereum, USDT, USDC), Alipay, and wire transfer.
- **Payment gateway:** FastSpring processes payments. It handles one-time payments only — no recurring billing profile is created.
- **Recommendation:** Set a calendar reminder for 14 days before your renewal date, or pre-fund your account balance with the renewal amount to enable auto-deduction.

## Sources

- https://my.racknerd.com/index.php?rp=/knowledgebase/65/How-to-Renew-Services-with-RackNerd-Early.html
- https://my.racknerd.com/index.php?rp=/knowledgebase/7/What-payment-methods-do-you-accept.html
- https://my.racknerd.com/index.php?rp=/knowledgebase/53/Cancelling-a-service-with-RackNerd.html
- https://www.racknerd.com/terms-of-service (Payments, Suspensions, Cancellation sections)
- GitHub user report (ajao9326/racknerd-auto-renew) confirming RackNerd uses FastSpring for one-time payments, no auto-deduction from PayPal/credit card

## Relevant notes

- [Contabo Cloud VPS 4 — 8GB RAM at €5.50/month](Resources/contabo-cloud-vps-4-8gb-ram-at-5-50-month.md)
- [Google Cloud Free Tier VPS](Resources/google-cloud-free-tier-vps.md)
- [RackNerd 4GB KVM VPS — Annual Prepay at $59.99/Year](Resources/racknerd-4gb-kvm-vps-annual-prepay-at-59-99-year.md)
- [4GB VPS Under $6/Month — Options Comparison and Executive Summary](Resources/4gb-vps-under-6-month-options-comparison-and-executive-summary.md)
- [Netcup VPS 500 G12 — DDR5 ECC RAM at €5.91/month](Resources/netcup-vps-500-g12-ddr5-ecc-ram-at-5-91-month.md)