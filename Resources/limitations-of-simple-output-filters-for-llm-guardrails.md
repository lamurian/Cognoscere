---
title: Limitations of Simple Output Filters for LLM Guardrails
description: 'Fundamental limitations of rule-based and simple output filters: circumvention, context insensitivity, the safety-usability tradeoff'
author: pi
editor: lam
date: 2026-06-12T17:55:24.668Z
tags:
  - research
  - guardrails
  - limitations
  - safety
  - llm
---
## Summary

Simple rule-based output filters and content blacklists are insufficient for LLM guardrails in software engineering contexts. These approaches face several fundamental limitations [@akheel2025].

**Circumvention by adversaries.** Rule-based methods relying on keyword blacklists can be easily circumvented through character substitution, coded language, or contextual framing. Attackers can co-opt harmless terms into references for illicit activity, slipping past naive filters. Rule-based filters also trigger frequent false positives when legitimate content inadvertently includes taboo words within a broader context.

**Context insensitivity.** Purely keyword-based approaches lack the semantic understanding to distinguish between benign discussions (e.g., medical or security documentation) and actual harmful content. A healthcare LLM discussing dosages may be wrongly blocked, while a carefully crafted prompt injection passes through because no individual keyword triggers the filter.

**The guardrail-flexibility tradeoff.** Empirical evaluation demonstrates that strengthening security measures inevitably reduces usability [@kumar2025]. Overly restrictive guardrails stifle creativity and degrade user experience; overly lenient ones let harmful content through. The "No Free Lunch" hypothesis for guardrails formalizes this: no guardrail system can simultaneously minimize residual risk, maintain utility, and avoid usability loss under realistic adversarial and naturalistic conditions [@kumar2025].

**LLM-based guardrails have their own costs.** While LLM-powered evaluators with chain-of-thought reasoning achieve state-of-the-art detection, they introduce 5-10x latency overhead compared to classifier-based systems, making them unsuitable for real-time applications [@kumar2025]. Claude-3.5-Sonnet with reasoning averages 7.88s per query, versus 0.038s for lightweight classifiers like iad-v3.

## Relevant notes

- [[state-of-the-art-in-guardrail-design-for-llm-orchestration-in-software-engineering]]
- [[frameworks-and-tools-for-llm-guardrails]]
- [[the-no-free-lunch-tradeoff-in-guardrail-design]]
- [[failure-modes-in-llm-driven-software-engineering]]
- [[architectural-patterns-for-llm-guardrail-systems-in-software-engineering]]