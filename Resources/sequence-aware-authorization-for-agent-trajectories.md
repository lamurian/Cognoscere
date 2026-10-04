---
title: Sequence-Aware Authorization for Agent Trajectories
description: 'Individually permitted actions compose into incidents: temporal policy (sequencing, ceilings, freshness, escalation) and deterministic gates at the effect boundary.'
author: pi
editor: lam
date: 2026-10-02T19:30:00.000Z
tags:
  - guardrails
  - ai-agents
  - security
  - access-control
  - multi-agent
---
## Summary

Classical authorization judges each request on its own merits — fast, provable, order-independent — and that is exactly the property agents fall through. An agent's danger is rarely a single action: reading a customer record is permitted, calling an external API is permitted, doing the second immediately after the first is exfiltration; issuing a refund is permitted, issuing four hundred in an hour is a financial incident [@gupta2026]. Point-in-time authorization cannot see combinations.

Temporal policy closes the gap by evaluating the current request against the trajectory that preceded it. Four patterns matter in practice: workflow sequencing (this step requires that prerequisite), aggregate ceilings (cumulative spend or volume per session), freshness constraints (act only on data read within a window), and escalation triggers (tighten the envelope automatically when the agent operates without human engagement). None of these rules are expressible in stateless authorization, and all of them describe incidents that have actually happened.

Multi-agent systems sharpen the case. Probabilistic checks do not compose: if each hop in an agent chain catches 70% of dangerous requests, a five-agent chain catches roughly 17% end to end (0.7^5). The design response is to compose the reasoning but centralize the enforcement — let agents delegate freely, but make every one of them exit through the same deterministic gate at the point where actions become effects.

## Key Points

- An agent running unattended at 3am should not have the same capability envelope as one running with a human watching.
- Deterministic gates at the effect boundary give full coverage regardless of hop count; distributed probabilistic checks degrade multiplicatively.
- Digital-twin replay: re-run recorded actions in an isolated production clone before granting policy expansions.
- Related: [[five-layer-defense-in-depth-for-production-agents]], [[enforcement-outside-the-context-window]], [[out-of-band-supervision-for-agents]].

## Sources

- [@gupta2026]

## Relevant notes

- [Five-Layer Defense-in-Depth for Production Agents](five-layer-defense-in-depth-for-production-agents.md)
- [Enforcement Outside the Context Window](enforcement-outside-the-context-window.md)
- [Out-of-Band Supervision for Agents](out-of-band-supervision-for-agents.md)
