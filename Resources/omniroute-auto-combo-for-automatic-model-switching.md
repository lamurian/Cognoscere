---
title: OmniRoute Auto-Combo for Automatic Model Switching
description: Use the auto/ model prefix so OmniRoute automatically picks and switches models across all connected free providers.
author: pi
editor: lam
date: 2026-08-17T14:58:26.771Z
tags:
  - AI
  - LLM
  - gateway
  - routing
  - model
  - providers
---
## Summary

OmniRoute changes models automatically with the Auto-Combo engine. Set your model name to an `auto/` prefixed route and OmniRoute builds a virtual combo from every active provider connection with valid credentials, scores them, routes to the best, and silently slides to the next on failure [@souza2026] [@agentos2026]. No manual chain configuration needed — zero-config smart routing [@deepwiki2026b].

The router scores each candidate across 9 factors: health (circuit breaker state), quota remaining, cost, real p95 latency, success rate, model freshness, stability (variance in latency/error), task fit (model x task type), and headroom [@binarywarehouse2026]. Providers scoring below threshold self-heal with gradual backoff up to 30 minutes, and circuit breakers in OPEN state are excluded from the pool [@deepwiki2026b].

The `auto` strategy has six sub-modes: `auto` (generic), `auto/coding` (code-first, only tool-capable models), `auto/fast` (latency-first), `auto/cheap` (cost-first), `auto/offline` (max quota headroom), and `auto/smart` (quality-first with 10% exploration). A `:free` suffix restricts to free tiers, e.g. `auto/coding:free` [@binarywarehouse2026] [@agentos2026]. This is the recommended default for agent tools because it only selects models that support tool calling [@agentos2026].

Use it like a normal model name in any client: in a config file set `default: auto/coding:free`, or pass it as the model field in OpenAI-compatible requests. OmniRoute handles the rest [@agentos2026].

## Key Points

- Model name `auto/...` triggers the Auto-Combo engine across all connected providers [@souza2026].
- Sub-modes: auto, auto/coding, auto/fast, auto/cheap, auto/offline, auto/smart [@binarywarehouse2026].
- `:free` suffix restricts routing to free models, e.g. `auto/coding:free` [@agentos2026].
- 9-factor live scoring per request; unhealthy providers excluded and backed off [@binarywarehouse2026].

## Sources

- [@souza2026] OmniRoute Auto-Combo wiki
- [@deepwiki2026b] DeepWiki — OmniRoute Routing Strategies
- [@binarywarehouse2026] Binary WareHouse — OmniRoute combo strategy
- [@agentos2026] Agent OS — The Free Hermes Engine guide

## Relevant notes

- [Enabling Free Models in OmniRoute](Resources/enabling-free-models-in-omniroute.md)
- [OmniRoute Named Combos for Fallback Chains](Resources/omniroute-named-combos-for-fallback-chains.md)
- [Network Architecture for LoRa-Based FHIR Data Exchange](Resources/network-architecture-for-lora-based-fhir-data-exchange.md)
- [Approaches to Guardrail Design in Pi Agent for LLM-Aided Software Engineering](Resources/approaches-to-guardrail-design-in-pi-agent-for-llm-aided-software-engineering.md)
- [Architectural Patterns for LLM Guardrail Systems in Software Engineering](Resources/architectural-patterns-for-llm-guardrail-systems-in-software-engineering.md)