---
title: Access Control in WhatsApp Kapso
description: Managing the contact allowlist, access control, and multi-agent number sharing with Kapso free tier
author: pi
editor: lam
date: 2026-07-01T14:43:05.331Z
tags:
  - whatsapp
  - kapso
  - security
  - access-control
  - setup
---
The pi-kapso-whatsapp extension implements a strict allowlist model: only explicitly added contacts receive responses. Unknown numbers are silently ignored — no error, no reply, no log exposure. This defense-in-depth pattern keeps monitoring channels private.

**Managing contacts.** Add: `whatsapp_contact_add with {"name": "Lam", "phone_number": "+15551234567"}`. List: `whatsapp_contacts_list`. Remove or disable: `whatsapp_contact_remove` / `whatsapp_contact_update with {"enabled": false}`. The `/kapso-contacts` command provides a formatted summary. Disabled contacts remain in the list but are silently rejected.

**Multi-agent sharing.** The free tier includes one number. When multiple services share it, use SYSTEM.md and PROMPT.md to define each agent's identity context, prefix alerts with service identifiers (`[pi-agent]`, `[homelab]`), and use the contact notes field for routing metadata. Security practices: protect `~/.pi/agent/extensions/pi-kapso-whatsapp/.env`, audit contacts regularly via `whatsapp_contacts_list`, and ensure template variables don't leak internal paths or credentials.

## Relevant notes

- [WhatsApp Kapso Overview](Resources/whatsapp-kapso-overview.md)
- [WhatsApp Kapso Setup for Pi Agent](Resources/whatsapp-kapso-setup-for-pi-agent.md)
- [Monitoring Pi Agent with WhatsApp Kapso](Projects/monitoring-pi-agent-with-whatsapp-kapso.md)
- [WhatsApp Message Templates with Kapso](Resources/whatsapp-message-templates-with-kapso.md)
- [Securing Paseo Daemon with Tailscale](Resources/securing-paseo-daemon-with-tailscale.md)