---
title: Enforcement Outside the Context Window
description: 'Agent guardrails must enforce outside the model''s context window: policy engines, behavioral classifiers, and portable control specs complement each other.'
author: pi
editor: lam
date: 2026-10-02T19:30:00.000Z
tags:
  - guardrails
  - ai-agents
  - security
  - architecture
  - production
---
## Summary

The central architectural principle of 2026 guardrail engineering: a guardrail the model can read is a guardrail the model can rationalize past. Enforcement must live somewhere the agent's context window cannot reach — a gateway, a policy engine, a decision runtime, a kernel hook [@gupta2026]. Guardrail design has consequently converged on authorization engineering rather than content moderation. The useful questions are what this identity can do, in what order, with whose approval, and how to stop it mid-flight.

Three complementary enforcement approaches shipped within ten weeks in 2026. AWS Dogwood is an open-source policy language extending Cedar with temporal constructs (rate limits, time windows, prerequisites, escalation triggers), wired into Bedrock AgentCore Policy and enforced at the gateway perimeter outside agent code; AWS states its reference interpreter is for exploration, not production authorization. Ant Group's SingGuard-NSFA is an open behavioral classifier (0.8B to 9B parameters, 185 threat scenarios, 133 languages) rendering judgments in roughly 50ms, cheap enough for the hot path of every tool call. Microsoft's Agent Control Specification is a vendor-neutral, fail-closed decision runtime with checkpoints before input, before tool calls, after tool results, and before final output, traveling with the agent as a portable policy file.

The synthesis: policy engines prevent what you thought to prohibit; classifiers catch what you did not anticipate; specifications make either one portable. Their blind spots do not overlap, which is why mature stacks run all three. OWASP's Agent Control Standard, announced September 2026, pushes the same shift into standards — security moving from what a model can say to what a system can do, with enforceable access, decision, and action boundaries at runtime.

## Key Points

- Inventory first: you cannot govern agents you do not know exist; shadow agents are shadow IT with credentials.
- The policy-to-runtime chain: human-readable policy, then structural configuration (no send_email tool means no email regardless of prompting), then runtime scorers.
- Enforcement points: input filtering, policy checks during planning, tool-call validation before execution, post-execution logging.
- Related: [[policy-configuration-runtime-layering-of-agent-guardrails]], [[owasp-agent-control-standard-for-runtime-enforcement]], [[frameworks-and-tools-for-llm-guardrails]].

## Sources

- [@gupta2026]
- [@openworldwideapplicationsecurityproject2026]

## Relevant notes

- [Policy-Configuration-Runtime Layering of Agent Guardrails](policy-configuration-runtime-layering-of-agent-guardrails.md)
- [OWASP Agent Control Standard for Runtime Enforcement](owasp-agent-control-standard-for-runtime-enforcement.md)
- [Frameworks and Tools for LLM Guardrails](frameworks-and-tools-for-llm-guardrails.md)
