---
title: 'jcode Semantic Memory: Vector Graph Recall Without Token Burn'
description: jcode embeds every turn as a semantic vector, queries a memory graph via cosine similarity, and injects relevant memories through a verifying sideagent for passive recall.
author: pi
editor: lam
date: 2026-08-16T00:34:04.494Z
tags:
  - ai-agents
  - memory
  - embeddings
  - semantic-search
---
## Summary

jcode gives agents long-term memory. Every turn and response is embedded as a semantic vector, and every turn queries a graph of memories to find related entries via cosine similarity. Retrieval can be passive: embedding hits are fed into the conversation, or an optional memory sideagent verifies memories are relevant and does extra information retrieval before injection, so recall does not burn conversation tokens on active memory-tool calls [@huang2026a].

For storage, memories are extracted periodically (on semantic drift, after K turns, at session end) by a memory sideagent and written into the memory graph. Explicit memory tools (remember, recall, search, tag, link, forget) let the agent store and retrieve deliberately. Memories carry scopes (global, project, session), provenance, confidence that decays over time, and relationships like "supersedes" and "contradicts". An ambient background mode periodically consolidates the graph, checking staleness and conflicts [@huang2026a; @grigio2026].

Skills use the same mechanism: they are not loaded at startup; the conversation is embedded and a skill auto-injects on an embedding hit, similar to memory recall [@huang2026a]. The practical payoff is long-lived projects: pick up weeks later and the agent still remembers why a config field exists, your 4-space indentation preference, and that .env must never be committed [@grigio2026].

## Key Points

- Each turn embedded as a vector; memory graph queried by cosine similarity each turn
- Memory sideagent verifies relevance before injection (passive recall, no token burn)
- Explicit tools: remember, recall, search, tag, link, forget; scopes, provenance, decaying confidence, contradiction/supersede relations
- Skills auto-inject on embedding hits instead of loading at startup
- Ambient mode consolidates the graph (staleness, conflicts) periodically

## Sources

[@huang2026a] -- Huang, Jeremy, jcode — The most RAM efficient harness, GitHub, 2026
[@grigio2026] -- Grigio, Federico, jcode: The Coding Agent That Raises the Skill Ceiling, vs opencode and pi, 2026

## Relevant notes

- [jcode vs Hermes: Harness vs Self-Improving Assistant](Resources/jcode-vs-hermes-harness-vs-self-improving-assistant.md)
- [jcode vs Goose: Harness Focus vs General-Purpose Agent](Resources/jcode-vs-goose-harness-focus-vs-general-purpose-agent.md)
- [jcode vs pi: Efficiency and Philosophy](Resources/jcode-vs-pi-efficiency-and-philosophy.md)
- [Context Engineering: Write, Select, Compress, Isolate](Resources/context-engineering-write-select-compress-isolate.md)
- [LLM Embeddings for Clustering and Semantic Grouping](Resources/llm-embeddings-for-clustering-and-semantic-grouping.md)