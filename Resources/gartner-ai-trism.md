---
title: Gartner AI TRiSM
description: "Gartner's 2023 AI TRiSM: four technical domains, runtime enforcement layers, and the 2025 agentic shift to tool-call governance and per-agent identity."
author: pi
editor: lam
date: 2026-10-04T23:38:16.115Z
tags:
  - governance
  - security
  - ai-agents
  - risk-management
  - frameworks
source: https://www.cyberhaven.com/infosec-essentials/what-is-ai-trism
---
## Summary

Gartner introduced AI TRiSM (AI Trust, Risk and Security Management) in 2023 as an operating model for governing enterprise AI across its lifecycle [@cyberhaven2025]. It organizes four technical domains — Explainability, ModelOps, AI Application Security, and Data Privacy — into layered enforcement: an AI governance catalog of models and agents, runtime inspection that flags or blocks policy violations in real time, information governance over the data feeding AI systems, and infrastructure protection beneath them [@cyberhaven2025; @akto2025].

The distinguishing claim is operational: governance sets policy, while TRiSM is the layer that makes policy enforceable through continuous monitoring, runtime controls, and data protection rather than one-time audits [@cyberhaven2025]. It is a framework spanning capabilities and vendors, not a single product.

For agentic systems, Gartner argued that the original four-pillar model breaks down because agents can change behavior between reviews. A dedicated Agentic AI TRiSM research line, reported from September 2025, adds tool-call governance, delegation-chain trust boundaries at every agent handoff, and per-agent identity and credentials [@akto2025]. The multi-agent adaptation by Raza et al. (see [[trism-framework-for-agentic-multi-agent-systems]]) builds on this lineage.

## Key Points

- Policy versus enforcement: governance defines intent, TRiSM operationalizes it at runtime.
- The agentic extension shifts the enforcement surface to tool calls, delegation chains, and per-agent identity.
- Sourcing caveat: primary Gartner research is paywalled; this note relies on vendor commentary and should be read with that limitation in mind.

## Sources

- [@cyberhaven2025]
- [@akto2025]

## Relevant notes

- [TRiSM Framework for Agentic Multi-Agent Systems](trism-framework-for-agentic-multi-agent-systems.md)
- [State of the Art in Guardrail Design for LLM Orchestration in Software Engineering](state-of-the-art-in-guardrail-design-for-llm-orchestration-in-software-engineering.md)
- [Architectural Patterns for LLM Guardrail Systems in Software Engineering](architectural-patterns-for-llm-guardrail-systems-in-software-engineering.md)
- [OWASP Agent Control Standard for Runtime Enforcement](owasp-agent-control-standard-for-runtime-enforcement.md)
- [NSA Guidance on Careful Adoption of Agentic AI](nsa-guidance-on-careful-adoption-of-agentic-ai.md)
- [Agent Identity as a Guardrail](agent-identity-as-a-guardrail.md)
- [Layered Translation of Governance Standards into Runtime Controls](layered-translation-of-governance-standards-into-runtime-controls.md)