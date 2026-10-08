---
title: 'ResearchRabbit: Citation-Graph Mechanism, Model Provenance, and Free Tier'
description: ResearchRabbit's citation-graph recommendation mechanism (Semantic Scholar + OpenAlex), no generative model, no BYOK, and a durable free tier.
author: pi
editor: lam
date: 2026-10-07T10:14:35.817Z
tags:
  - research
  - literature
  - free-tier
  - pricing
  - recommendation
  - knowledge-graph
---
## Summary

ResearchRabbit is a citation-based literature mapping tool, not a chatbot. The user seeds a collection with up to 50 articles; the algorithm then analyzes bibliographies, citation links, and co-authorship networks to recommend similar work, earlier work, later work, and related authors [@unknown2026a]. Results render as interactive citation maps, and the recommendations adapt as the user adds papers, so the tool effectively learns the shape of a research topic through iterative "rabbit hole" exploration.

On model provenance, ResearchRabbit does not train or serve a generative LLM. It is a recommendation engine over open scholarly graphs, drawing data primarily from Semantic Scholar and OpenAlex [@unknown2023]. There is no chat interface, so the question of API wrapper versus own model barely applies: the "AI" is statistical linkage in citation networks plus collaborative filtering on reading patterns, not language generation.

BYOK is not applicable. Nothing in the product consumes user-supplied model keys, because no LLM inference runs in the user-facing workflow.

The free tier ("Free Forever") is generous: unlimited searches across 310+ million articles, unlimited libraries and collections, collection sharing for collaboration, and up to 50 seed articles per search [@unknown2026a]. The paid tier RR+ costs $10/month annually ($12.50 monthly, with parity discounts in 100+ countries) and raises the seed limit to 300, adds advanced search controls, multiple projects, and alerts. A 2024 Reddit thread questioned whether free access was being curtailed, but the company affirms the free offering remains [@unknown2024a] [@unknown2026a].

## Key Points

- Mechanism: citation-graph recommendation from seed articles (similar/earlier/later work, related authors), visualized as interactive maps.
- Model: no generative LLM; algorithmic recommendations over Semantic Scholar and OpenAlex data.
- BYOK: not applicable; no LLM inference in the workflow.
- Free tier: unlimited searches and collections, 50 seed articles; RR+ at $10-12.50/month for 300 seeds and advanced controls.

## Sources

- [@unknown2026a] ResearchRabbit pricing page.
- [@unknown2023] Aaron Tay, overview of citation-chasing tools and their data sources.
- [@unknown2024a] r/PhD thread on ResearchRabbit premium changes, 2024.

## Relevant notes

- [SciSpace (Typeset): Mechanism, Model Provenance, and Free Tier](Resources/scispace-typeset-mechanism-model-provenance-and-free-tier.md)
- [LeapSpace (Elsevier): Mechanism, Model Strategy, and Free Tier](Resources/leapspace-elsevier-mechanism-model-strategy-and-free-tier.md)
- [Cheapest Paid VPS Indonesia — User Sentiment Comparison and Production Recommendation](Resources/cheapest-paid-vps-indonesia-user-sentiment-comparison-and-production-recommendation.md)
- [Google Cloud Free Tier — User Sentiment and Reviews](Resources/google-cloud-free-tier-user-sentiment-and-reviews.md)
- [Oracle Cloud Free Tier — User Sentiment and Reviews](Resources/oracle-cloud-free-tier-user-sentiment-and-reviews.md)