---
title: Prompt Injection Is an Architectural Problem
description: 'Sonnet 4.6 system card: 8% injection success with all safeguards on; defense must be architectural because instructions and data share one context window.'
author: pi
editor: lam
date: 2026-10-02T10:01:22.611Z
tags:
  - guardrails
  - ai-agents
  - prompt-injection
  - safety
  - llm
---
## Summary

Anthropic's Claude Sonnet 4.6 system card (February 2026) reports that with every safeguard enabled, automated adversarial attacks achieve prompt injection takeover 8% of the time on first attempt in computer use environments, rising to 50% with unbounded attempts. In coding environments with the same model, success drops to 0%. The difference is environmental structure, not model robustness [@chawla2026].

The core argument: prompt injection operates on the control plane, not content semantics. Instructions from the user and untrusted data arrive as tokens in the same context window, processed by the same mechanism. This is in-band signaling, the same class of vulnerability as SQL injection and XSS, which were solved architecturally (parameterized queries, content security policies), never by training. Training reduces attack success (Meta's SecAlign++ cut InjecAgent success from 53.8% to 0.5%) but adaptive attacks still reach 98% against defended models. Resistance asymptotes; it does not converge to zero [@chawla2026].

Anthropic's own defense strategy combines three tracks: reinforcement learning that rewards the model for identifying and refusing embedded injections; classifiers that scan all untrusted content entering the context window and flag attacks; and scaled expert human red teaming. Claude Opus 4.5 reached a 1% attack success rate against an internal adaptive Best-of-N attacker, described as progress, not a solved problem [@anthropic2025].

## Key Points

- The lethal trifecta (Simon Willison): an agent with tools, untrusted input, and sensitive access is catastrophically vulnerable; any two of three is manageable.
- Real incidents prove the threat: Notion AI exfiltration via hidden PDF text, EchoLeak (CVE-2025-32711) zero-click injection against Microsoft 365 Copilot.
- Meta's Agents Rule of Two policy mandates human oversight when all three trifecta conditions are met.
- 8% per-attempt success means compromise is statistically certain over a month of daily tasks; the question is damage containment, not prevention.
- Related: [[owasp-top-10-for-agentic-applications-2026]], [[five-layer-defense-for-production-agents]], [[limitations-of-simple-output-filters-for-llm-guardrails]].

## Sources

- [@chawla2026]
- [@anthropic2025]

## Relevant notes

- [Failure Modes in LLM-Driven Software Engineering](Resources/failure-modes-in-llm-driven-software-engineering.md)
- [Frameworks and Tools for LLM Guardrails](Resources/frameworks-and-tools-for-llm-guardrails.md)
- [Five-Layer Defense-in-Depth for Production Agents](Resources/five-layer-defense-in-depth-for-production-agents.md)
- [Evaluating Guardrail Effectiveness: Benchmarks and Metrics](Resources/evaluating-guardrail-effectiveness-benchmarks-and-metrics.md)
- [Policy-Configuration-Runtime Layering of Agent Guardrails](Resources/policy-configuration-runtime-layering-of-agent-guardrails.md)