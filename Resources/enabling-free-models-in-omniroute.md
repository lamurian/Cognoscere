---
title: Enabling Free Models in OmniRoute
description: 'How to enable free AI models in OmniRoute: install, connect no-signup free providers, generate API key, point tools at the gateway endpoint.'
author: pi
editor: lam
date: 2026-08-17T14:58:26.769Z
tags:
  - AI
  - LLM
  - gateway
  - providers
  - free
  - api
---
## Summary

OmniRoute is a free MIT-licensed self-hosted AI gateway: one endpoint fronting 340 providers (90+ with free tiers) and 1200+ models. It runs locally on port 20128 and serves OpenAI-compatible, Anthropic, MCP, and A2A clients [@souza2026a]. A fresh install has no providers connected, so the model list starts empty [@agentos2026].

Enable free models through the dashboard: install with `npm install -g omniroute`, start with `omniroute serve` (or the Docker image `diegosouzapw/omniroute:latest`), open `http://localhost:20128`, then go to Providers and connect free no-signup providers. These need no registration or API key: OpenCode Zen, Pollinations, Qoder AI, Kiro AI, SiliconFlow, Z.AI GLM-Flash, OpenRouter free pool, Cloudflare, Scaleway, Groq, NVIDIA, and Cerebras [@binarywarehouse2026] [@agentos2026]. Free provider quotas change often, so verify current availability in the Providers page [@binarywarehouse2026].

Each connected provider becomes an active connection. OmniRoute stores credentials encrypted at rest, runs entirely on your hardware, and never phones home [@souza2026a]. Generate an API key in the dashboard (Settings → API Keys or Endpoints → Create API Key), then point any client at `http://localhost:20128` (Anthropic protocol) or `http://localhost:20128/v1` (OpenAI-compatible) [@binarywarehouse2026]. Confirm routing works with `curl http://localhost:20128/v1/models` using the key [@agentos2026].

## Key Points

- One endpoint, many providers: connect 3-4 free providers so routing has fallback options [@agentos2026].
- Free providers need no signup or key; paid providers can be added the same way with their API key [@binarywarehouse2026].
- Dashboard at localhost:20128 manages providers, combos, usage, and API keys [@binarywarehouse2026].
- For Claude Code specifically: `omniroute setup-claude` wires the endpoint automatically [@agentos2026].

## Sources

- [@souza2026a] OmniRoute GitHub repository
- [@binarywarehouse2026] Binary WareHouse — OmniRoute self-host gateway guide
- [@agentos2026] Agent OS — The Free Hermes Engine guide

## Relevant notes

- [OmniRoute Auto-Combo for Automatic Model Switching](Resources/omniroute-auto-combo-for-automatic-model-switching.md)
- [OmniRoute Named Combos for Fallback Chains](Resources/omniroute-named-combos-for-fallback-chains.md)
- [Frameworks and Tools for LLM Guardrails](Resources/frameworks-and-tools-for-llm-guardrails.md)
- [Evaluating Guardrail Effectiveness: Benchmarks and Metrics](Resources/evaluating-guardrail-effectiveness-benchmarks-and-metrics.md)
- [Cloudinary Direct Browser Upload with Unsigned Presets](Resources/cloudinary-direct-browser-upload-with-unsigned-presets.md)