---
title: Frameworks and Tools for LLM Guardrails
description: 'Ecosystem of guardrail frameworks: NeMo Guardrails, Guardrails AI, Llama Guard, provider APIs, agent-specific guards, and LLM evaluators'
author: pi
editor: lam
date: 2026-06-12T17:55:24.672Z
tags:
  - research
  - guardrails
  - tools
  - frameworks
  - comparison
---
## Summary

A diverse ecosystem of guardrail frameworks has emerged, each with distinct architectural philosophies.

**NeMo Guardrails** (NVIDIA, 2023). An open-source toolkit for adding programmable guardrails to LLM-based conversational systems. Uses a runtime inspired by dialogue management, routing all queries through chains of classifiers and transformations. Independent of the underlying LLM and interpretable [@rebedea2023]. Supports topical rails, dialogue path enforcement, and language style control.

**Guardrails AI.** Operates as a policy specification layer allowing developers to define output schemas, acceptance criteria, and recourse steps if outputs violate policy (e.g., re-prompting the model). Supports structured data validation beyond simple content filtering [@akheel2025].

**Llama Guard.** Tailored for Llama-based models, focusing on domain-specific classification with explicit feedback loops and policy constraints. Offers lightweight deployment relative to LLM-based evaluators [@akheel2025].

**OpenAI Moderation API / Azure Content Safety / AWS Bedrock Guardrails.** Provider-deployed guardrails offering fast, low-latency filtering via pre-trained risk classifiers. Azure achieves 1.000 F1 on utility datasets but scores as low as 0.010 on adversarial datasets like SAGE [@kumar2025]. AWS Bedrock achieves balanced performance (0.938 on PHTest, 0.819 on Long Prompts).

**DKnownAI Guard.** Agent-specific guardrail with dual-channel detection distinguishing agent threats (instruction override, indirect injection, tool abuse) from harmful content. Achieves 96.5% recall and 90.4% true negative rate in comparative evaluation [@li2026].

**Lightweight classifiers.** Models like iad-v3, vijil-mbert-prompt-injection, and Prompt-Guard offer sub-0.1s latency for real-time filtering but trade accuracy for speed. iad-v3 achieves 0.819 F1 on pseudo-harm detection vs 0.971 for llama-guard [@kumar2025].

**LLM-based evaluators.** GPT-4o, Claude-3.5-Sonnet, and Gemini 2.0-Flash with chain-of-thought prompting achieve state-of-the-art adversarial detection but incur 4-8x latency overhead, limiting real-time deployment [@kumar2025].

## Relevant notes

- [[state-of-the-art-in-guardrail-design-for-llm-orchestration-in-software-engineering]]
- [[failure-modes-in-llm-driven-software-engineering]]
- [[the-no-free-lunch-tradeoff-in-guardrail-design]]
- [[limitations-of-simple-output-filters-for-llm-guardrails]]
- [[architectural-patterns-for-llm-guardrail-systems-in-software-engineering]]