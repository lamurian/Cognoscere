---
title: OmniRoute Named Combos for Fallback Chains
description: Create a named combo in OmniRoute with a routing strategy for manual fallback chains, then reference it as a model.
author: pi
editor: lam
date: 2026-08-17T14:58:26.772Z
tags:
  - AI
  - LLM
  - gateway
  - routing
  - model
  - providers
---
## Summary

A named combo in OmniRoute is a chain of models from different providers grouped under one name with a routing strategy. When a request references the combo name in the model field (e.g. `combo/free-forever`), OmniRoute evaluates the strategy, selects a provider and model, and falls back to the next node in the chain if the selected provider fails [@deepwiki2026c].

Create one in the dashboard: go to Combos → + New Combo, name it, add nodes (each node is a provider/model pair), and pick a strategy. Order nodes by preference — primary providers first, backups last [@binarywarehouse2026]. Strategies include: `priority` (try nodes in order, fallback on failure), `weighted` (proportional routing), `round-robin` (even distribution), `p2c` (power-of-two choices for high throughput), `cost-optimized`, `lkgp` (stick to last-known-good provider), `fill-first` (drain an account before moving on), `context-relay` (hand context across switches), `fusion` (fan out to multiple models and synthesize), and `auto` (9-factor smart scoring) [@deepwiki2026c] [@deepwiki2026b] [@binarywarehouse2026].

Combos support nesting (combos inside combos, expanded at request time), DAG validation to prevent circular references, context-window filtering against estimated token count, cooldown resilience for transient 429s, response validation predicates, and a 120-second default per-target timeout [@deepwiki2026c]. In priority mode, requests flow through the chain invisibly — the calling tool only ever sees a successful response [@binarywarehouse2026].

Practical example from a real deployment: a `free-forever` combo with Cerebras `glm-4.7` as primary, NVIDIA and OpenRouter free pool in the middle, and DeepSeek Web as final fallback, giving a zero-dollar always-available coding and chat pipeline [@binarywarehouse2026].

## Key Points

- Reference combos as models: `combo/<name>` or just the combo name [@deepwiki2026c].
- Dashboard path: Combos → + New Combo → add nodes, set strategy [@binarywarehouse2026].
- Best strategies: `priority` for simple preference chains, `auto` for zero-config smart routing [@binarywarehouse2026].
- Combos support nesting, DAG validation, context filtering, and failure cooldowns [@deepwiki2026c].

## Sources

- [@deepwiki2026c] DeepWiki — OmniRoute Model Combos
- [@deepwiki2026b] DeepWiki — OmniRoute Routing Strategies
- [@binarywarehouse2026] Binary WareHouse — OmniRoute combo free-model strategy

## Relevant notes

- [OmniRoute Auto-Combo for Automatic Model Switching](Resources/omniroute-auto-combo-for-automatic-model-switching.md)
- [Enabling Free Models in OmniRoute](Resources/enabling-free-models-in-omniroute.md)
- [Architectural Patterns for LLM Guardrail Systems in Software Engineering](Resources/architectural-patterns-for-llm-guardrail-systems-in-software-engineering.md)
- [Network Architecture for LoRa-Based FHIR Data Exchange](Resources/network-architecture-for-lora-based-fhir-data-exchange.md)
- [Frameworks and Tools for LLM Guardrails](Resources/frameworks-and-tools-for-llm-guardrails.md)