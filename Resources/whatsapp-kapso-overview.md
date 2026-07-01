---
title: WhatsApp Kapso Overview
description: Kapso WhatsApp API platform overview, free tier limits, and how it enables pi agent messaging
author: pi
editor: lam
date: 2026-07-01T14:43:05.318Z
tags:
  - whatsapp
  - kapso
  - free-tier
  - messaging
  - pi-agent
---
Kapso is a developer-focused WhatsApp Cloud API platform that abstracts Meta's WhatsApp Business API complexity. It provides a single endpoint for sending and receiving WhatsApp messages, managing templates, handling webhooks, and provisioning phone numbers, with sandbox numbers for testing and production numbers through instant-setup [@kapso2026].

The free tier includes one connected phone number and 2,000 messages per month with sandbox access, WhatsApp API tooling, webhook support, and message logs. This is sufficient for development, testing, and light personal pi agent monitoring.

For pi integration, the `pi-kapso-whatsapp` npm package (MIT) provides 30+ WhatsApp tools covering send (text, media, templates, interactive), receive (webhook handling, access control), contact management (allowlist), and service management (PM2, Cloudflare tunnels). It pairs with `pi-whatsapp-service`.

The architectural flow for inbound messages: Kapso webhook delivers payload -> pi processes via `whatsapp_receive` -> access control check -> conversation history loaded -> pi generates response -> `whatsapp_send` dispatches reply -> `whatsapp_log_out` records the exchange. Outbound-only workflows (alerts, monitoring) skip the receive path entirely.

## Relevant notes

- [Monitoring Pi Agent with WhatsApp Kapso](Projects/monitoring-pi-agent-with-whatsapp-kapso.md)
- [Access Control in WhatsApp Kapso](Resources/access-control-in-whatsapp-kapso.md)
- [WhatsApp Kapso Setup for Pi Agent](Resources/whatsapp-kapso-setup-for-pi-agent.md)
- [WhatsApp Message Templates with Kapso](Resources/whatsapp-message-templates-with-kapso.md)
- [Homelab: System Overview](Projects/homelab-system-overview.md)