---
title: Hetzner Cloud — Billing Model, Pricing and Contract Terms
description: "Hetzner's billing model: hourly-with-monthly-cap, April 2026 price increase, no annual prepay, invoice timing post-April 2024 changes"
author: pi
editor: lam
date: 2026-07-22T11:49:16.045Z
tags:
  - hosting
  - vps
  - billing
  - pricing
  - germany
  - cloud-computing
source: https://docs.hetzner.com/general/billing-and-account-management/billing-at-hetzner/billing-system-hetzner
---
## Summary

Hetzner's billing model differs significantly from RackNerd's annual-prepay approach. All Hetzner products are billed monthly with hourly metering for cloud resources. There is no annual or semi-annual prepayment option. In April 2024, Hetzner switched to rolling invoice generation throughout the month (rather than batch at month-end) to even out support volume. A significant 30-37% price increase took effect in April 2026, driven by rising DRAM and NAND costs from AI infrastructure demand.

## Pricing Model

**Cloud servers (CX, CPX, CAX series):** Hourly billing with a monthly cap. You pay for the hours the server runs, capped at the monthly price. If you delete a server mid-month, you only pay for hours used. No minimum term or contract. Prices exclude German VAT (19%) which is added for EU customers; non-EU customers typically do not pay VAT.

**Current pricing (post-April 2026 adjustment):**
- CX23 (2 vCPU, 4 GB RAM, 40 GB NVMe): starts at ~EUR 3.49-5.49/month depending on region
- CAX11 (2 vCPU ARM, 4 GB RAM, 40 GB NVMe): ~EUR 4.00-5.99/month
- CCX13 (2 vCPU, 8 GB RAM, 80 GB NVMe): ~EUR 16.49/month
- CPX series (AMD EPYC): higher than CX but with better CPU consistency

**Dedicated servers:** Billed monthly, no hourly option. The Server Auction offers refurbished enterprise hardware at steep discounts (e.g., quad-core Xeon with 64 GB RAM under EUR 40/month).

**Add-ons:** IPv4 addresses EUR 0.50/month, additional block storage EUR 0.04/GB/month, snapshots EUR 0.01/GB/month, backups from EUR 0.10/instance/month, floating IPs EUR 0.50/month, load balancers from EUR 3.49/month.

## April 2026 Price Increase

Hetzner announced a 30-37% price increase across several cloud server tiers effective April 2026. The stated reason was rising DRAM and NAND costs driven by AI infrastructure demand. Key details:
- The increase applies to **new orders** only. Existing services keep their original pricing.
- If you rescale (change the plan) an existing service, it switches to the new pricing.
- Some users on Trustpilot report unexpected charges, but Hetzner's official stance is that existing services are unaffected.
- Even after the increase, Hetzner remains 30-50% cheaper than DigitalOcean/Vultr for equivalent specs.

## Invoice and Payment

- **Invoice timing:** Since April 2024, invoices are generated throughout the month rather than en masse at month-end. This was done to improve billing support response times.
- **Payment methods:** Credit card, PayPal, SEPA direct debit, bank transfer.
- **No prepayment:** Hetzner does not accept annual or advance payments. All billing is post-paid monthly.
- **Late payment:** Multiple payment reminders are sent. If unpaid over an extended period, services are suspended and eventually data is deleted. Users report that full account lockout (including all paid services) can occur for a single unpaid item, with no escalated warnings.
- **No refunds:** Hetzner generally does not provide refunds for unused service time or billing disputes, as reported by multiple Trustpilot reviewers.

## Comparison with RackNerd

| Aspect | Hetzner | RackNerd |
|--------|---------|----------|
| Billing cycle | Monthly (hourly metering) | Annual prepay only |
| Contract | None (hourly) | Annual prepay required |
| Price lock | No — prices can change | Lifetime price lock on continuous renewal |
| Payment method | Credit card, PayPal, SEPA | Credit card, PayPal, crypto, Alipay, wire |
| Auto-renewal | Automatic (stored card) | Manual only (unless pre-fund account balance) |
| VAT | 19% German VAT for EU customers | No VAT for non-EU; varies for others |
| Minimum term | None | 1 year (prepaid) |
| Refund policy | No refunds generally | Case-by-case, no standard money-back |
| Cancellation | Cancel anytime online | 5-day written notice required |

## Key Points

- All cloud servers billed hourly with monthly price cap. No annual prepay option.
- April 2026 price increase: 30-37% across tiers. Applies to new orders only.
- Post-April 2024: invoices generated throughout the month, not batched.
- No minimum contract. No long-term commitment required.
- Payment: monthly post-paid. Late payment triggers suspension then data deletion.
- Full account lockout possible for single unpaid item (per user reports).
- Dedicated servers via Server Auction offer significant discounts on refurbished hardware.
- Hetzner's model suits flexible, short-term workloads. RackNerd's model suits fixed-cost annual planning with price predictability.

## Sources

- https://docs.hetzner.com/general/billing-and-account-management/billing-at-hetzner/billing-system-hetzner
- https://www.hetzner.com/cloud/cost-optimized
- https://news.ycombinator.com/item?id=39547940 (Hetzner billing model change)
- Trustpilot user reviews for Hetzner

## Relevant notes

- [Hetzner CX23 — Cheapest x86 VPS with 4GB RAM Under $6](Resources/hetzner-cx23-cheapest-x86-vps-with-4gb-ram-under-6.md)
- [Netcup VPS 500 G12 — DDR5 ECC RAM at €5.91/month](Resources/netcup-vps-500-g12-ddr5-ecc-ram-at-5-91-month.md)
- [Hetzner CAX11 — Cheapest ARM VPS with 4GB RAM](Resources/hetzner-cax11-cheapest-arm-vps-with-4gb-ram.md)
- [Contabo Cloud VPS 4 — 8GB RAM at €5.50/month](Resources/contabo-cloud-vps-4-8gb-ram-at-5-50-month.md)
- [RackNerd vs Hetzner — Head-to-Head VPS Comparison](Resources/racknerd-vs-hetzner-head-to-head-vps-comparison.md)