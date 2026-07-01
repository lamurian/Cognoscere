---
title: WhatsApp Message Templates with Kapso
description: How to create, approve, and send WhatsApp message templates via Kapso for proactive pi agent notifications
author: pi
editor: lam
date: 2026-07-01T14:43:05.330Z
tags:
  - whatsapp
  - kapso
  - templates
  - messaging
  - tutorial
---
WhatsApp message templates are pre-approved formats required for sending proactive outbound messages outside the 24-hour conversation window. For pi monitoring, templates enable reliable delivery of alerts — cost warnings, failure notifications, session summaries — even when the recipient hasn't messaged recently. Use the **Utility** category for monitoring alerts (account/status updates), which gets faster Meta approval than Marketing.

**Creating and submitting.** In the Kapso dashboard, navigate to Templates -> Create Template. Define the body with `{{1}}`, `{{2}}` variable placeholders (e.g., "Pi Alert: {{1}} — {{2}}"). Submit for Meta review; Utility templates typically approve within hours. Each template goes through full Meta review — batch submissions to minimize iterations.

**Sending from pi.** List approved templates with `whatsapp_templates_list`. Send with `whatsapp_send_template` providing the recipient, template name, language, and body parameters as an ordered array. Within the 24-hour conversation window, `whatsapp_send` works without templates. Best practices: create separate templates for critical vs informational alerts, use descriptive names (`pi_alert_critical`, `pi_alert_info`), and test in sandbox before submitting to Meta.

## Relevant notes

- [WhatsApp Kapso Overview](Resources/whatsapp-kapso-overview.md)
- [Monitoring Pi Agent with WhatsApp Kapso](Projects/monitoring-pi-agent-with-whatsapp-kapso.md)
- [Access Control in WhatsApp Kapso](Resources/access-control-in-whatsapp-kapso.md)
- [WhatsApp Kapso Setup for Pi Agent](Resources/whatsapp-kapso-setup-for-pi-agent.md)
- [Protocols for FHIR Message Integrity and Security Over LoRa](Resources/protocols-for-fhir-message-integrity-and-security-over-lora.md)