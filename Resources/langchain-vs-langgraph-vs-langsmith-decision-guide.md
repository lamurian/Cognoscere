---
title: LangChain vs LangGraph vs LangSmith Decision Guide
description: Decision framework for choosing LangChain, LangGraph, and LangSmith with use cases, best practices, and common production pitfalls.
author: pi
editor: lam
date: 2026-07-28T00:09:18.097Z
tags:
  - llm
  - llm-agents
  - agent
  - frameworks
  - architecture
  - reference
  - best-practices
  - comparison
  - production
  - observability
---
## Summary

The LangChain ecosystem provides three complementary tools that serve different parts of the LLM application lifecycle. LangChain is the foundational framework for building modular LLM pipelines (prompts, models, tools, retrievers, memory) using its Runnable/LCEL protocol — best for linear workflows like RAG, chatbots, and structured extraction. LangGraph extends LangChain with stateful graph-based orchestration — nodes, edges, and a shared state object — purpose-built for agents that need loops, branching, retries, human-in-the-loop, and multi-step reasoning. LangSmith is the observability and evaluation platform that sits on top of both — it provides tracing, run trees, evaluation datasets, LLM-as-judge scoring, and hosted deployment via LangGraph Platform [@kaur2026; @langcopilot2025].

The 2026 recommendation from the LangChain team is a clear division of labor: LangChain for building blocks, LangGraph for anything agentic or multi-step, LangSmith for observability [@kaur2026]. They are designed to work together, not as alternatives.

## Decision Criteria

**Use LangChain alone** when your workflow is a straight line: input goes through a fixed sequence of steps (retrieve, prompt, generate, parse). Typical use cases: RAG pipelines, document Q&A, summarization, structured extraction, simple tool calling. LangChain's LCEL (pipe operator) composes Runnable objects into a single callable with `.invoke()`, `.stream()`, and `.batch()` for free. The linear model starts to break down when the agent needs to decide what to do next based on what just happened, call a tool, look at the result, and decide again — that's when you need LangGraph [@datacamp2026; @codebasicsteam2025].

**Use LangGraph** when your agent needs to loop, branch, hold state across many steps, or coordinate multiple sub-agents. LangGraph models execution as a `StateGraph` where nodes are functions, edges (including conditional edges) decide what runs next, and a shared state object flows through the whole thing. This makes it natural to express retries, human-in-the-loop interrupts, multi-agent coordination, and persistent checkpointing with PostgresSaver or RedisSaver for production. LangGraph nodes commonly call out to LCEL chains internally, so it's an additional layer rather than a replacement [@kaur2026; @mishra2026].

**Use LangSmith** when you need visibility into what your LLM app is doing in production. It wraps any function with `@traceable` to capture inputs, outputs, and every nested call as a run tree. It also provides evaluation datasets, LLM-as-judge evaluators, prompt A/B testing, and — via LangGraph Platform — hosted graph deployment. Skipping LangSmith is common for small prototypes, but strongly recommended once an agent is doing anything beyond a quick prototype [@kaur2026; @codebasicsteam2025].

## Quick Heuristic

Ask three questions: (1) Is your workflow a straight line? Start and end with LangChain. (2) Does your app need to remember things, loop, or make decisions? You need LangGraph. (3) Are you building for production? LangSmith becomes non-negotiable for ensuring reliability and performance [@langcopilot2025].

## Common Pitfalls

**Runaway agent loops.** Agents without iteration limits can enter endless tool-call loops that spike costs. Mitigation: set `recursionLimit` on the graph compiler, add an `iterationCount` reducer to state, and enforce a hard exit after N cycles [@james2026].

**Unbounded state growth.** Storing full message history and large API responses in graph state causes token explosion and slow checkpoint writes. Mitigation: trim messages at node entry with `trimMessages(maxTokens=4000)`, store only references (S3 keys) for large objects [@james2026].

**Thread ID misuse.** Using user ID directly as `thread_id` makes all conversations share a single state snapshot, causing cross-conversation leakage. Mitigation: generate unique `threadId = userId-uuid()` per conversation [@james2026].

**Production checkpointer misconfiguration.** Leaving `LANGCHAIN_TRACING_V2=true` in production leaks user PII to LangSmith. Using `MemorySaver` loses all state on restart. Mitigation: use `PostgresSaver` or `RedisSaver` for persistence, sanitize metadata before tracing [@james2026].

**Tool errors crash the graph.** Unhandled exceptions in tools bubble up as 500s. Mitigation: catch errors in tool layer, return structured `{success: false, error, suggestion}` objects, route to fallback nodes after N failures [@james2026].

**Prompt fragility and spaghetti.** Minor prompt wording changes or model upgrades silently alter agent behavior. Mitigation: version prompts as code, run prompt regression tests, centralize prompt management [@hashblock2025].

**Latency and cost surprises.** Sequential LLM calls, overuse of embeddings, and no caching cause long delays and high bills. Mitigation: parallel calls where possible, cache embeddings and frequent queries, set per-user quotas [@hashblock2025; @milan2026].

**Ignoring observability.** Without traces, debugging agents is like debugging a ghost. Mitigation: log inputs/outputs of every chain, use LangSmith traces, track token usage per request [@hashblock2025].

**SubGraph state mismatch.** If a SubGraph outputs a field name the parent Graph doesn't declare, the data silently disappears. Mitigation: align all field names between parent and subgraph state schemas [@james2026].

**Human-in-the-loop timeout.** Interrupted checkpoints remain in the database indefinitely; stale approvals break business logic. Mitigation: record interruption timestamps, auto-cancel after 30-minute timeout [@james2026].

## Key Points

- LangChain (framework) for linear pipelines: RAG, chatbots, extraction
- LangGraph (orchestration) for stateful agents: loops, branching, multi-step
- LangSmith (platform) for observability: tracing, eval, deployment
- They're complementary layers, not alternatives — most production stacks use 2-3 together
- Top pitfalls: runaway loops, unbounded state, thread ID misuse, PII leakage via tracing, tool errors crashing the graph
- Start with LangChain, add LangGraph when complexity demands it, add LangSmith before production

## Sources

- [@kaur2026] LangChain vs LangGraph vs LangSmith: What's the Difference in 2026, TrueFoundry
- [@langcopilot2025] LangChain vs LangGraph vs LangSmith: Complete Comparison, LangCopilot
- [@datacamp2026] LangChain vs LangGraph vs LangSmith vs LangFlow: Key Differences, DataCamp
- [@codebasicsteam2025] LangChain vs LangGraph vs LangSmith: Which One Should You Use?, Codebasics
- [@mishra2026] LangChain vs LangGraph vs LangSmith vs LangFlow: Choosing the Right LLM Toolkit, Analytics Vidhya
- [@james2026] 10 Real-World LangGraph Production Pitfalls, BestHub
- [@hashblock2025] LangChain Missteps: The 7 Worst Patterns I See in Production, Medium
- [@milan2026] Production Pitfalls of LangChain Nobody Warns You About, Medium

## Relevant notes

- [Computational vs Inferential Controls in Agent Harness Design](Resources/computational-vs-inferential-controls-in-agent-harness-design.md)
- [Low-Power Solar Homelab: Executive Summary](Resources/low-power-solar-homelab-executive-summary.md)
- [Issues, Opportunities, and Best Practices for LLMs in Healthcare and Medical Informatics](Resources/issues-opportunities-and-best-practices-for-llms-in-healthcare-and-medical-informatics.md)
- [Executive Summary: Harness Engineering for pi Agent Coding](Resources/executive-summary-harness-engineering-for-pi-agent-coding.md)
- [LALS: LLM-Based Digital Clone Simulation for Lifelong Resilience](Resources/lals-llm-based-digital-clone-simulation-for-lifelong-resilience.md)