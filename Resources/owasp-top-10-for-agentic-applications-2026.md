---
title: OWASP Top 10 for Agentic Applications 2026
description: 'Community-validated threat taxonomy for agentic AI: goal hijack, tool misuse, identity abuse, memory poisoning, rogue agents, and mitigation guidance.'
author: pi
editor: lam
date: 2026-10-02T10:01:22.610Z
tags:
  - guardrails
  - ai-agents
  - security
  - threat-modeling
  - production
---
## Summary

The OWASP GenAI Security Project published the Top 10 for Agentic Applications in December 2025, developed with more than 100 industry experts. It is the first risk list specifically for agents that plan, act, and make decisions across workflows, rather than chatbots [@openworldwideapplicationsecurityproject2025].

The ten risks are: ASI01 Agent Goal Hijack (manipulating objectives via injected instructions in documents, emails, or retrieved data); ASI02 Tool Misuse and Exploitation (legitimate tools used unsafely via chaining or unsafe delegation); ASI03 Identity and Privilege Abuse (credential reuse, delegation chains, ambiguous identity); ASI04 Agentic Supply Chain Vulnerabilities (malicious plugins, MCP servers, tampered agent cards); ASI05 Unexpected Code Execution; ASI06 Memory and Context Poisoning; ASI07 Insecure Inter-Agent Communication (spoofing, replay attacks); ASI08 Cascading Failures; ASI09 Human-Agent Trust Exploitation (persuasive manipulation of users); ASI10 Rogue Agents (agents that deviate from authorized scope) [@pitts2025].

Each risk carries concrete mitigations. Recurring themes: treat all text influencing agent reasoning as untrusted input; enforce least privilege per tool with rate limits and data scoping; give each agent a unique, bounded, short-lived identity; sign and attest manifests, models, prompts, and tool descriptors; separate code generation from execution with approval gates; scan and segment memory writes; use mTLS and signed messages between agents; add circuit breakers and blast-radius caps; require explicit confirmation for high-impact actions; maintain tamper-evident audit logs [@pitts2025].

## Key Points

- Prompt injection (goal hijack) is the top risk: agents cannot distinguish valid instructions from malicious content embedded in external inputs.
- Identity-centric controls are the recommended foundation: scoped, short-lived agent credentials and zero-trust boundaries.
- A notable production mitigation is digital-twin replay: re-run recorded agent actions in an isolated clone of production to gate policy expansions on blast-radius thresholds.
- Related: [[prompt-injection-is-an-architectural-problem]], [[five-layer-defense-for-production-agents]], [[agent-identity-as-a-guardrail]].

## Sources

- [@openworldwideapplicationsecurityproject2025]
- [@pitts2025]
- OWASP GenAI Security Project: https://genai.owasp.org/

## Relevant notes

- [OWASP Agent Control Standard for Runtime Enforcement](Resources/owasp-agent-control-standard-for-runtime-enforcement.md)
- [NSA Guidance on Careful Adoption of Agentic AI](Resources/nsa-guidance-on-careful-adoption-of-agentic-ai.md)
- [Agent Identity as a Guardrail](Resources/agent-identity-as-a-guardrail.md)
- [Prompt Injection Is an Architectural Problem](Resources/prompt-injection-is-an-architectural-problem.md)
- [Failure Modes in LLM-Driven Software Engineering](Resources/failure-modes-in-llm-driven-software-engineering.md)