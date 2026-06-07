---
title: Multi-Agent Orchestration Patterns
description: Patterns for orchestrating multiple AI coding agents — single-agent, sub-agent, parallel, and orchestrator/worker architectures
author: pi
editor: lam
date: 2026-06-07T18:18:52.682Z
tags:
  - agent
  - architecture
  - reference
  - software
---

## Summary

Multi-agent orchestration for coding workflows follows four core patterns: single agent (simplest, lowest overhead, best for isolated modules), sub-agent delegation (main agent routes tasks to specialised sub-agents with separate context windows), parallel agents (multiple agents work on independent tasks simultaneously), and orchestrator/worker (a coordinator agent breaks work into tasks and delegates to worker agents). Each pattern makes different trade-offs between throughput, coordination overhead, and context isolation. The choice depends on project size, task interdependence, and team maturity with agent workflows [@osmani2025; @pockit2025].

## Pattern 1: Single Agent

One agent handles the full workflow. Simplest setup, lowest overhead, easiest to debug. Best for isolated modules, small-to-medium projects, and early prototyping. The main challenge is context overload -- a single agent's context window must hold the entire spec, project structure, and conversation history. Mitigation strategies include spec summaries, refreshing context per task, and starting fresh sessions often. For the pi knowledge management workflow, the single agent pattern currently dominates: one agent handles search, creation, updates, and linking of atomic notes [@osmani2025].

## Pattern 2: Sub-Agent Delegation

The main agent (or orchestrator) delegates tasks to specialised sub-agents, each with its own system prompt and context window. Claude Code supports this natively: sub-agents have specific purposes and expertise areas, use separate context windows from the main conversation, and return results independently. For example, a Database Designer sub-agent knows only the data model section of the spec, an API Coder sub-agent knows only the API endpoints spec. The benefit is each agent has a smaller, more focused context window, which boosts accuracy for specialised tasks. Sub-agents can also work in parallel on independent tasks, increasing throughput. The key challenge is managing interdependencies: sub-agents must still coordinate through shared contracts (API specs, data models) [@osmani2025].

## Pattern 3: Parallel Agents

Multiple agents run simultaneously on non-overlapping work. One agent codes a feature while another writes tests, or separate components get built concurrently. This is emerging as 'the next big thing' for developer productivity, though it can be mentally exhausting to manage. The critical requirement is scoping tasks so agents do not step on each other -- clear boundaries, shared context via version-controlled spec files, and a central overview agent that ensures consistency. Frameworks like LangGraph, CrewAI, and OpenAI Swarm can coordinate parallel agents, and shared memory via vector databases lets them access common context without redundant prompting [@osmani2025; @agensi2026].

## Pattern 4: Orchestrator/Worker

A coordinator agent analyses the codebase, generates the spec, breaks work into tasks, and delegates to specialist worker agents. A verifier agent checks results against the spec before code reaches the branch. This is the most structured pattern, closest to how human software teams operate. The orchestrator maintains the big picture while workers focus on implementation. The verifier provides quality assurance independent from the builder. This pattern is well-suited to the pi ecosystem where skills (knowledge, research, roadmap, summarize-link) act as specialised sub-agents coordinated by the main agent [@galstian2025; @osmani2025].

## Pattern Selection Guidance

Use a single agent for isolated modules and prototyping. Use sub-agent delegation when tasks require different expertise areas and context isolation. Use parallel agents when tasks are truly independent and throughput matters more than coordination simplicity. Use orchestrator/worker when the project is large enough to need architectural oversight and independent verification. Start with the simplest pattern that solves the problem, and escalate only when measurable friction appears.

## Relevant notes

- [[spec-driven-context-driven-tdd-workflow-overview]]
- [[least-obstructive-workflow-principles]]
- [[sdd-four-phase-workflow-for-pi-agents]]
- [[context-engineering-for-pi-agents]]