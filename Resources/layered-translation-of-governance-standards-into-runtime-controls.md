---
title: Layered Translation of Governance Standards into Runtime Controls
description: 'Koch''s method maps ISO/NIST governance objectives to four control layers, reserving runtime guardrails for observable, determinate, time-sensitive controls.'
author: pi
editor: lam
date: 2026-10-02T19:30:00.000Z
tags:
  - guardrails
  - governance
  - standards
  - framework
  - ai-agents
---
## Summary

Governance standards (ISO/IEC 42001, ISO/IEC 23894, ISO/IEC 42005, ISO/IEC 5338, ISO/IEC 38507, NIST AI RMF) are highly relevant to agentic AI but do not by themselves yield implementable runtime guardrails [@koch2026]. Agentic systems plan, use tools, maintain state, and act on the world, so important risks emerge during execution rather than only at model development or deployment time. Koch proposes a layered translation method connecting standards-derived governance objectives to four control layers: governance objectives, design-time constraints, runtime mediation, and assurance feedback.

The method distinguishes four things routinely conflated: governance objectives, technical controls, runtime guardrails, and assurance evidence. A control tuple and a runtime-enforceability rubric assign each control to a layer. The central claim is deliberately modest: standards should guide control placement across architecture, runtime policy, human escalation, and audit, while runtime guardrails are reserved for controls that are observable, determinate, and time-sensitive enough to justify execution-time intervention. A procurement-agent case study demonstrates the method.

The practical payoff is triage. Not every policy sentence belongs in a runtime scorer, and not every runtime check belongs in a prompt. Mapping governance obligations to the cheapest layer that can enforce them keeps runtime guardrails sparse, testable, and auditable.

## Key Points

- Four control layers: governance objectives, design-time constraints, runtime mediation, assurance feedback.
- Runtime enforcement is the expensive layer; spend it only on observable, determinate, time-sensitive controls.
- Complements [[policy-configuration-runtime-layering-of-agent-guardrails]] by adding the standards-mapping step upstream.
- Related: [[owasp-agent-control-standard-for-runtime-enforcement]], [[nsa-guidance-on-careful-adoption-of-agentic-ai]].

## Sources

- [@koch2026]

## Relevant notes

- [Policy-Configuration-Runtime Layering of Agent Guardrails](policy-configuration-runtime-layering-of-agent-guardrails.md)
- [OWASP Agent Control Standard for Runtime Enforcement](owasp-agent-control-standard-for-runtime-enforcement.md)
- [NSA Guidance on Careful Adoption of Agentic AI](nsa-guidance-on-careful-adoption-of-agentic-ai.md)
