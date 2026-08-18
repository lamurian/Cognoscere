---
title: Root Causes of OmniRoute Combo Concurrency and 503 Admission Errors
description: Explains root causes of OmniRoute combo stalling with 503 admission busy, structure limit, and agent already processing concurrency errors.
author: pi
editor: lam
date: 2026-08-18T00:12:22.359Z
tags:
  - OmniRoute
  - LLM
  - gateway
  - troubleshooting
  - pi-agent
  - architecture
---
## Summary

An OmniRoute model combo stopping midway with `503: chat_admission_busy / structure_limit` followed by `Agent is already processing... Specify streamingBehavior ('steer' or 'followUp')` stems from a two-stage failure cascade combining upstream proxy capacity limits and agent concurrency state locks.

First, the upstream model target or routing gateway rejects execution turns with `503: chat_admission_busy` when admission controller queues overflow under peak concurrency, or `structure_limit` when multi-turn context tokens or JSON tool-call schema constraints exceed target window depth during fallback switches. Second, while the agent harness is stalled on or retrying the failed response stream, the agent session retains an active `isStreaming` lock. Any unflagged client retry or user prompt sent without declaring `streamingBehavior` triggers an agent concurrency state rejection.

To resolve this, client wrappers must specify `streamingBehavior` (`"steer"` or `"followUp"`) when prompting an active agent, while OmniRoute combos should enforce target fallback context filtering and adaptive cooldown backoff.

## Key Points

- `503: chat_admission_busy` indicates upstream LLM proxy admission queue saturation.
- `structure_limit` occurs when conversation history exceeds context token boundaries or structured tool output limits during model fallback switches.
- `Agent is already processing` is triggered when a command attempts to write to an agent session with an active `isStreaming` lock.
- RPC protocols require explicit `streamingBehavior` (`"steer"` or `"followUp"`) when delivering prompts while the agent event loop is busy.

## Sources

- [Paseo Pi RPC Mode Integration](Resources/paseo-pi-rpc-mode-integration.md)
- [OmniRoute Named Combos for Fallback Chains](Resources/omniroute-named-combos-for-fallback-chains.md)
- [OmniRoute Auto-Combo for Automatic Model Switching](Resources/omniroute-auto-combo-for-automatic-model-switching.md)

## Relevant notes

- [OmniRoute Auto-Combo for Automatic Model Switching](Resources/omniroute-auto-combo-for-automatic-model-switching.md)
- [Pros and Cons of OmniRoute](Resources/pros-and-cons-of-omniroute.md)
- [OmniRoute Named Combos for Fallback Chains](Resources/omniroute-named-combos-for-fallback-chains.md)
- [Enabling Free Models in OmniRoute](Resources/enabling-free-models-in-omniroute.md)
- [Paseo Pi Provider Failure Root Causes](Resources/paseo-pi-provider-failure-root-causes.md)