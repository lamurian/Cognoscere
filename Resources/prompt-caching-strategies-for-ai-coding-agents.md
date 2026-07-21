---
title: Prompt Caching Strategies for AI Coding Agents
description: How strategic prompt caching reduces API costs by 41-80% and TTFT by 13-31% for agent workloads
author: pi
editor: lam
date: 2026-07-20T23:44:40.061Z
tags:
  - agent
  - caching
  - optimization
  - performance
  - llm
---
## Summary

Prompt caching reuses previously computed KV tensors from attention layers across API requests, avoiding redundant computation on repeated prompt prefixes. For AI coding agents that accumulate large context windows over multi-turn sessions, prompt caching is the single highest-ROI optimization available at the API level [@lumer2026].

A comprehensive evaluation across OpenAI, Anthropic, and Google models found that prompt caching reduces API costs by 41-80% and improves time to first token (TTFT) by 13-31%. Cost savings scale linearly with prompt size: at 50,000 tokens, savings reach 54-89% across providers. Below provider minimum thresholds (1,024 tokens for OpenAI/Anthropic, 4,096 for Google), caching cannot activate [@lumer2026].

## Key Points

- **System prompt only caching** provides the most consistent benefits. Caching only the stable system prompt while excluding dynamic tool results outperforms naive full-context caching, which can paradoxically increase latency due to cache write overhead for session-specific content [@lumer2026].
- **Place dynamic content at the end** of the system prompt. Timestamps, session IDs, and user-specific info should never appear at the beginning, as they break the cache prefix. A UUID after the system prompt creates a clean cache boundary [@lumer2026].
- **Tool call caching is counterproductive** for session-specific tool outputs. Cache creation overhead is only amortized if subsequent requests benefit from cache reads. For tool calls that produce variable results, caching provides no benefit [@lumer2026].
- **Cost reduction is universal**, while latency improvement depends on strategy selection. The strategy that maximizes cost savings does not always maximize TTFT improvement [@lumer2026].

## Sources

[@lumer2026] -- Elias Lumer et al., "Don't Break the Cache: An Evaluation of Prompt Caching for Long-Horizon Agentic Tasks", arXiv:2601.06007, 2026

## Relevant notes

- [Semantic Caching for Agent Workloads](Resources/semantic-caching-for-agent-workloads.md)
- [Failure Modes in LLM-Driven Software Engineering](Resources/failure-modes-in-llm-driven-software-engineering.md)
- [Mechanisms of Structural Degradation in Agent-Generated Code](Resources/mechanisms-of-structural-degradation-in-agent-generated-code.md)
- [Context Engineering: Write, Select, Compress, Isolate](Resources/context-engineering-write-select-compress-isolate.md)
- [Pi-Hole DNS Cache Tuning](Resources/pi-hole-dns-cache-tuning.md)