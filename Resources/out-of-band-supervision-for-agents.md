---
title: Out-of-Band Supervision for Agents
description: 'Supervision and stop mechanisms outside the agent''s loop: veto-only guardian agents, out-of-band kill switches, structured human escalation.'
author: pi
editor: lam
date: 2026-10-02T19:30:00.000Z
tags:
  - guardrails
  - ai-agents
  - security
  - human-in-the-loop
  - production
---
## Summary

Some agents and controls cannot be trusted to police themselves, so supervision and stop mechanisms must live outside the agent's own control loop [@gupta2026]. Guardian agents, specialized agents that observe, score, and block other agents' actions, catch semantic anomalies and drift that rules miss and operate at machine speed. The recursion problem is explicit: a guardian is itself an agent, injectable through the very content it inspects, so layering a probabilistic supervisor over a probabilistic actor gives two probabilistic systems, not a guarantee. The design rule: a guardian may escalate, flag, and deny, but it must never be the sole authority that permits.

Kill switches are the last resort, and most architecture-diagram kill switches fail exactly when needed. Requirements: out of band (revocation at the credential and gateway layer, effective regardless of what the agent's loop is doing), granular (per-agent, per-tool, per-tier, per-tenant — a single global switch never gets used), fast (the documented PocketOS incident ran nine seconds end to end), tested (exercise in production like a failover), and paired with reconstruction logs that answer what happened, in what order, on what evidence, under whose authority.

Human review is a control, not the control: reviewers under volume miss a substantial share of dangerous requests, roughly one in three by some measures. The practice that emerged is structured escalation thresholds rather than more review — defined risk classes that pause execution, timeout-equals-reject (an approval that self-grants on expiry is a delay wearing a gate's clothing), and an interrupt budget small enough that reviewers still read.

## Key Points

- Guardian agents hold veto-only authority, logged and constrained like any other agent.
- Automate low-risk containment; escalate high-consequence decisions; set the line before an incident.
- Approval fatigue is real: Claude Code telemetry showed users approving roughly 93% of permission prompts, motivating fewer, higher-signal gates [@promptessor2026].
- Human judgment is layer six of the stack, working only because layers one through five reduced the volume.
- Related: [[jcode-safety-system-two-tier-human-in-the-loop-guardrails]], [[runtime-detection-of-compromised-agents]], [[agent-identity-as-a-guardrail]].

## Sources

- [@gupta2026]
- [@promptessor2026]

## Relevant notes

- [jcode Safety System: Two-Tier Human-in-the-Loop Guardrails](jcode-safety-system-two-tier-human-in-the-loop-guardrails.md)
- [Runtime Detection of Compromised Agents](runtime-detection-of-compromised-agents.md)
- [Agent Identity as a Guardrail](agent-identity-as-a-guardrail.md)
