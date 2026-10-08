---
title: 'SciSpace (Typeset): Mechanism, Model Provenance, and Free Tier'
description: SciSpace Copilot mechanism, its API-wrapper model provenance (OpenAI/Anthropic/Google), lack of BYOK, and the credit-metered free tier.
author: pi
editor: lam
date: 2026-10-07T10:14:35.817Z
tags:
  - AI
  - LLM
  - research
  - free-tier
  - pricing
  - wrapper
---
## Summary

SciSpace (formerly Typeset.io) is an end-to-end platform for discovering, analyzing, and writing scientific literature. Its core is Copilot: a citation-grounded chat interface that answers questions about an uploaded paper, explains highlighted sections in plain language, and links responses to passages in the text [@unknown2026d]. Surrounding it are a Literature Review table builder, AI Writer, Paraphraser, Citation Generator, structured data extraction, and an AI Detector.

On model provenance, SciSpace is an API wrapper, not a model builder. Its own peer-reviewed system paper states that it uses generative LLMs from OpenAI, Anthropic, and Google Bard, plus open-source models for certain use cases, combined through prompt engineering rather than proprietary training [@unknown2024]. No fine-tuned in-house foundation model is publicly documented.

BYOK is not supported. Users cannot connect their own API keys; all AI usage is metered through platform credits that the company sells as part of subscriptions [@unknown2026b].

The free tier (Basic, $0) provides roughly 100 credits per month, enough for light use of Copilot and the core tools, but free users are limited to lower-tier models and restricted agent tasks. Paid tiers start around $12/month billed annually (Premium, ~1,200 credits) and $70/month annually (Advanced, ~10,000 credits), with credits governing how many AI agent tasks (literature reviews, deep analysis) run each cycle [@unknown2026d] [@unknown2026b].

## Key Points

- Mechanism: citation-grounded chat over indexed papers and user PDFs, plus writing and review utilities.
- Model: API wrapper over OpenAI, Anthropic, Google, and open-source models; no proprietary foundation model.
- BYOK: not supported; usage is credit-metered.
- Free tier: ~100 credits/month with lower-tier models; paid plans at ~$12 and ~$70/month (annual billing).

## Sources

- [@unknown2026d] SciSpace pricing page (typeset.io).
- [@unknown2024] SciSpace Copilot system paper, AAAI 2024.
- [@unknown2026b] SciSpace Agent Credit Pricing & Usage Guide.

## Relevant notes

- [ResearchRabbit: Citation-Graph Mechanism, Model Provenance, and Free Tier](Resources/researchrabbit-citation-graph-mechanism-model-provenance-and-free-tier.md)
- [LeapSpace (Elsevier): Mechanism, Model Strategy, and Free Tier](Resources/leapspace-elsevier-mechanism-model-strategy-and-free-tier.md)
- [AI agents can use NotebookLM via REST wrapper or MCP](Resources/ai-agents-can-use-notebooklm-via-rest-wrapper-or-mcp.md)
- [Google Cloud Free Tier — User Sentiment and Reviews](Resources/google-cloud-free-tier-user-sentiment-and-reviews.md)
- [Pros and Cons of OmniRoute](Resources/pros-and-cons-of-omniroute.md)