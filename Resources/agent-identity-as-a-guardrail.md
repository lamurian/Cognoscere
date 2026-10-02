---
title: Agent Identity as a Guardrail
description: 'Agents as non-human identities: Entra Agent ID, Bedrock AgentCore Identity, short-lived scoped credentials, and identity-centric access control.'
author: pi
editor: lam
date: 2026-10-02T10:01:22.619Z
tags:
  - ai-agents
  - security
  - identity
  - access-control
  - production
---
## Summary

A 2026 consensus across OWASP guidance, national security agency advice, and cloud vendor products treats agent identity as the foundational guardrail for production agents. Agents behave like users: they remember context, make decisions, and hold real permissions. Security architecture built around human users leaves gaps that agents exploit [@pitts2025].

Cloud providers now ship first-class agent identity. Amazon Bedrock AgentCore Identity issues scoped credentials for agents on ECS; Microsoft Entra Agent ID gives each agent a managed directory identity; Google offers Native Agent Identities. These treat agents as Non-Human Identities with their own RBAC and ABAC, enabling just-in-time access with short-lived tokens (15-minute TTL as a practical starting point) [@chawla2026].

OWASP mitigation guidance for identity abuse (ASI03): give each agent a unique, bounded identity with short-lived credentials; isolate sessions and wipe cached context between tasks; require re-authorization for privilege escalation; detect transitive privilege inheritance and revoke stale entitlements; manage credential and role lifecycles. OWASP frames identity controls as the first of four pillars alongside zero-trust principles, observability, and human-in-the-loop governance [@pitts2025].

## Key Points

- Blast radius containment works through identity: a compromised session holding a token that expires in 12 minutes and can only read one S3 bucket is contained.
- Failure case: the Google Antigravity IDE incident combined a poisoned web guide with a browser subagent holding a permissive domain allowlist, enabling theft of AWS keys. Short-lived scoped credentials would have eliminated the vector.
- MCP security practice converges on MCP gateways as identity enforcement points for multi-user agents, centralizing authentication, credential isolation, tool permissions, and audit logging.
- Related: [[owasp-top-10-for-agentic-applications-2026]], [[five-layer-defense-for-production-agents]], [[nsa-guidance-on-careful-adoption-of-agentic-ai]].

## Sources

- [@pitts2025]
- [@chawla2026]

## Relevant notes

- [Five-Layer Defense-in-Depth for Production Agents](Resources/five-layer-defense-in-depth-for-production-agents.md)
- [OWASP Top 10 for Agentic Applications 2026](Resources/owasp-top-10-for-agentic-applications-2026.md)
- [OWASP Agent Control Standard for Runtime Enforcement](Resources/owasp-agent-control-standard-for-runtime-enforcement.md)
- [Policy-Configuration-Runtime Layering of Agent Guardrails](Resources/policy-configuration-runtime-layering-of-agent-guardrails.md)
- [NSA Guidance on Careful Adoption of Agentic AI](Resources/nsa-guidance-on-careful-adoption-of-agentic-ai.md)