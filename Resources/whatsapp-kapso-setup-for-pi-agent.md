---
title: WhatsApp Kapso Setup for Pi Agent
description: Step-by-step guide to set up Kapso account, provision WhatsApp number, and install pi-kapso-whatsapp extension
author: pi
editor: lam
date: 2026-07-01T14:43:05.320Z
tags:
  - whatsapp
  - kapso
  - tutorial
  - setup
  - pi-agent
---
**Phase 1: Account and number.** Create a free account at kapso.com, navigate to Numbers, and choose Sandbox (instant, pre-verified, best for testing) or Instant Setup (production number). Note the Phone Number ID and generate an API Key.

**Phase 2: Install extension.** Run `pi install npm:pi-kapso-whatsapp`, then reload pi's extensions. This installs the extension and `pi-whatsapp-service` dependency.

**Phase 3: Automated setup.** Tell pi "Set up the WhatsApp bot". The autonomous routine checks system requirements, installs PM2 if needed, builds and starts the webhook receiver, sets up a Cloudflare tunnel, registers the webhook in Kapso, adds your number to the contact allowlist, and verifies everything. The only manual step is `pm2 startup` (requires sudo, one-time). If credentials aren't captured, run `/kapso-setup` to provide API key and Phone Number ID.

**Verification.** Send a test: `whatsapp_send with {"to": "+15551234567", "text": "Pi agent monitoring active."}`. Check service status with `whatsapp_service_status` and `whatsapp_service_logs`. The free sandbox number needs no Meta verification; temporary Cloudflare tunnel URL changes on restart (permanent tunnel needs a custom domain).

## Relevant notes

- [WhatsApp Kapso Overview](Resources/whatsapp-kapso-overview.md)
- [Access Control in WhatsApp Kapso](Resources/access-control-in-whatsapp-kapso.md)
- [WhatsApp Message Templates with Kapso](Resources/whatsapp-message-templates-with-kapso.md)
- [Monitoring Pi Agent with WhatsApp Kapso](Projects/monitoring-pi-agent-with-whatsapp-kapso.md)
- [Homelab Software Setup Guide](Projects/homelab-software-setup-guide.md)