---
title: Deterministic Versus Model-Based Guardrails
description: 'Exact rules belong in deterministic code, semantic checks in models; every guardrail needs an explicit fail-open or fail-closed decision.'
author: pi
editor: lam
date: 2026-10-02T19:30:00.000Z
tags:
  - guardrails
  - architecture
  - best-practices
  - howto
  - ai-agents
---
## Summary

A useful division of labor for guardrail design: deterministic code for exact rules, models for semantic judgment [@promptessor2026]. Amount thresholds, allowed domains, role permissions, schema validation, path allowlists, rate limits, resource quotas, tool allowlists, and tenant IDs belong in code. If the business rule is refund_amount <= 50, use code, not another model asked whether $47 is less than $50. Semantic relevance, ambiguous policy interpretation, prompt-injection classification, intent classification, and complex content-safety checks belong in classifiers or LLM evaluators.

Every guardrail also needs an explicit fail-open or fail-closed decision, made per check rather than by default. Payment authorization, cross-tenant access checks, and production deploy approval fail closed; optional tone or style classifiers may fail open. A guardrail architecture is a pipeline, not a filter: input checks, untrusted-content handling (external data never gains instructional authority), tool and action authorization with deterministic argument validation and precondition checks against current state, approval gates for consequential actions, containment, resource limits, output validation, and observability across the whole workflow.

Two design traps recur. Guarding final output while leaving tool calls unguarded — a blocked confirmation message does not undo an executed side effect. And trusting that a system prompt enforces permissions: instructions are behavioral guidance; real permissions are enforced by the runtime, identity system, and tool layer.

## Key Points

- Propose/validate split: the model proposes an action; deterministic authorization and validation decide whether it executes.
- Verify postconditions against observable state; "request accepted" is not "refund completed".
- Evaluate guardrails as components: normal, boundary, adversarial, and regression cases across the complete trajectory.
- Approval fatigue is a failure mode: too many low-information gates become rubber-stamping [@gupta2026].
- Related: [[frameworks-and-tools-for-llm-guardrails]], [[policy-configuration-runtime-layering-of-agent-guardrails]], [[evaluating-guardrail-effectiveness-benchmarks-and-metrics]].

## Sources

- [@promptessor2026]

## Relevant notes

- [Frameworks and Tools for LLM Guardrails](frameworks-and-tools-for-llm-guardrails.md)
- [Policy-Configuration-Runtime Layering of Agent Guardrails](policy-configuration-runtime-layering-of-agent-guardrails.md)
- [Evaluating Guardrail Effectiveness: Benchmarks and Metrics](evaluating-guardrail-effectiveness-benchmarks-and-metrics.md)
