---
title: OWASP Agent Control Standard for Runtime Enforcement
description: 'September 2026: OWASP receives the Agent Control Standard, extending agentic risk guidance toward practical runtime control enforcement.'
author: pi
editor: lam
date: 2026-10-02T10:01:22.621Z
tags:
  - guardrails
  - ai-agents
  - security
  - standards
  - production
---
## Summary

In September 2026 the OWASP GenAI Security Project announced several resources as it passed 30,000 members: the 2026 Top 10 for LLM Applications (developed against thousands of real-world incidents, mapping to NIST, MITRE ATLAS, CWE, and the Agentic Top 10), the GenAI Security Industry Framework Crosswalk, and the Agent Control Standard (ACS), donated to the project [@openworldwideapplicationsecurityproject2026].

The ACS fills a gap in the agentic security stack. Existing OWASP guidance covers agentic risks, security controls, identity, governance, and testing; ACS extends that toward practical runtime enforcement, giving builders enforceable controls around what agents can access, decide, and do [@openworldwideapplicationsecurityproject2026].

The 2026 LLM Top 10 reflects an evidence-based re-ranking against real incidents. Excessive Agency rose to number three, the risk where expert judgment and incident data agree most clearly: give an agent real tools and real permissions, and failure shows up in what it does, so the work is containing what a fooled agent can reach before it acts [@openworldwideapplicationsecurityproject2026].

## Key Points

- The strategic shift OWASP describes: security evolves from what a model can say to what a system can do; controls must enforce access, decision, and action boundaries at runtime.
- The Framework Crosswalk connects OWASP guidance to NIST, MITRE ATLAS, CWE, and ISO-style compliance frameworks for organizations needing mapped controls.
- Related: [[owasp-top-10-for-agentic-applications-2026]], [[architectural-patterns-for-llm-guardrail-systems-in-software-engineering]].

## Sources

- [@openworldwideapplicationsecurityproject2026]
- https://genai.owasp.org/resource/agent-control-standard-acs/

## Relevant notes

- [Agent Identity as a Guardrail](Resources/agent-identity-as-a-guardrail.md)
- [OWASP Top 10 for Agentic Applications 2026](Resources/owasp-top-10-for-agentic-applications-2026.md)
- [Policy-Configuration-Runtime Layering of Agent Guardrails](Resources/policy-configuration-runtime-layering-of-agent-guardrails.md)
- [NSA Guidance on Careful Adoption of Agentic AI](Resources/nsa-guidance-on-careful-adoption-of-agentic-ai.md)
- [Architectural Patterns for LLM Guardrail Systems in Software Engineering](Resources/architectural-patterns-for-llm-guardrail-systems-in-software-engineering.md)