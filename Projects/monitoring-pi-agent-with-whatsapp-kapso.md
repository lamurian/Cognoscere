---
title: Monitoring Pi Agent with WhatsApp Kapso
description: Configure pi to send WhatsApp alerts for tool call failures, cost thresholds, and session errors via Kapso
author: pi
editor: lam
date: 2026-07-01T14:43:05.331Z
tags:
  - whatsapp
  - kapso
  - monitoring
  - pi-agent
  - automation
  - projects
---
The monitoring strategy uses pi's own extension system to self-report when defined triggers fire. Since pi runs inside a coding session, the monitoring loop is event-driven: pi decides when to notify based on session context.

**Alert triggers.** Implement in a guardrail extension's `on("tool_call")` hook: track consecutive failures per tool and alert after 3+ failures (`whatsapp_send` with severity, tool name, session ID). Track cumulative LLM API cost per session and alert when budget is exceeded ($0.50, configurable). Use session lifecycle hooks (`before_agent_start`, `agent_end`) to notify on session start/end or abnormal termination.

**Free tier budgeting.** Kapso's free tier allows 2,000 messages/month. At 50 alerts/day that's 1,500/month — within limits. Debounce same-type alerts (minimum 5-minute interval) to prevent storming. Use `whatsapp_send_template` for alerts outside the 24-hour window. Create a monitoring skill at `~/.pi/agent/skills/monitor-kapso/SKILL.md` that loads failure counters, checks thresholds after each tool call, dispatches alerts, and logs via `whatsapp_log_out`.

## Relevant notes

- [WhatsApp Kapso Setup for Pi Agent](Resources/whatsapp-kapso-setup-for-pi-agent.md)
- [WhatsApp Kapso Overview](Resources/whatsapp-kapso-overview.md)
- [Access Control in WhatsApp Kapso](Resources/access-control-in-whatsapp-kapso.md)
- [WhatsApp Message Templates with Kapso](Resources/whatsapp-message-templates-with-kapso.md)
- [Paseo Workflow Fit: ADR-Driven TDD Pipeline with Quality Gates — Executive Summary](Resources/paseo-workflow-fit-adr-driven-tdd-pipeline-with-quality-gates-executive-summary.md)