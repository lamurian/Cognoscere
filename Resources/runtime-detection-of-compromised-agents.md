---
title: Runtime Detection of Compromised Agents
description: 'Guardrails leak: detect compromised agents via known-bad rules, capability scoping, and tool-call auditing; automate containment at machine speed.'
author: pi
editor: lam
date: 2026-10-02T19:30:00.000Z
tags:
  - guardrails
  - ai-agents
  - security
  - monitoring
  - production
---
## Summary

Prevention-first agent security leaks. A leading prompt-injection defense still fails about 58% of the time against an optimization-based attack, and a broader benchmark found the most effective attack succeeding around 84% while reducing agent usefulness [@sysdig2026]. Guardrails filter what goes into an agent and what comes out; the risk lives in what the agent does in between, using legitimate tools with valid credentials, which is also why dangerous behavior looks like ordinary operations.

Behavioral baselines, the default in workload security, do not transfer to agents. The same task can take different paths, and the actions worth flagging (shell execution, file reads, outbound connections) are an agent's normal operating behavior. Detection therefore anchors on concrete actions rather than deviation: known-bad rules (credential file reads, connections to known-malicious hosts, post-exploitation tooling), capability scoping (sandbox boundaries as the baseline; crossing them is the signal), and tool-call-level auditing (which tool, which arguments, in response to which prompt).

Early results are promising: agent behavioral detection reports F1 between 0.93 and 0.96 and catches attacks with no malicious payload that work by reordering or retiming valid steps, invisible to content scans. The discipline maps agent-stack attacks to MITRE ATLAS techniques (tool poisoning AML.T0081, delegation-chain escalation AML.T0086, memory poisoning AML.T0080) and treats agent security as a program of prevention, detection, and response rather than a single tool.

## Key Points

- Detect what the agent does, not deviations from "normal"; content scans miss payload-free sequence attacks.
- Response must be automated: isolate the workload, revoke credentials, stop the process. Cloud attacks move from access to stolen data in under four minutes.
- Revoking credentials stops future use, not past theft; rotate whatever the agent could reach.
- Set the automate-versus-escalate line before an incident; keep human review for high-consequence decisions (EU AI Act human-oversight requirement).
- Related: [[five-layer-defense-in-depth-for-production-agents]], [[prompt-injection-is-an-architectural-problem]], [[agent-identity-as-a-guardrail]].

## Sources

- [@sysdig2026]

## Relevant notes

- [Five-Layer Defense-in-Depth for Production Agents](five-layer-defense-in-depth-for-production-agents.md)
- [Prompt Injection Is an Architectural Problem](prompt-injection-is-an-architectural-problem.md)
- [Agent Identity as a Guardrail](agent-identity-as-a-guardrail.md)
- [OWASP Top 10 for Agentic Applications 2026](owasp-top-10-for-agentic-applications-2026.md)
