---
title: Least-Obstructive Workflow Principles
description: Core principles for designing AI coding workflows that minimise friction and maximise autonomy within safe constraints
author: pi
editor: lam
date: 2026-06-07T18:18:52.684Z
tags:
  - agent
  - reference
  - software
  - fundamental
---

## Summary

A least-obstructive workflow minimises friction between the human and the AI agent while maintaining safety and quality. The core tension is that more constraints produce safer output but slower iteration, while fewer constraints produce faster output but more drift. The least-obstructive workflow resolves this tension through progressive disclosure, graduated constraints, and asynchronous verification. The goal is an agent that can do useful work autonomously for long stretches without blocking on human input, while the human trusts that the agent will escalate appropriately when it reaches a boundary [@osmani2025; @pockit2025].

## Principle 1: Progressive Disclosure

The agent receives only the context needed for the current task, with references to deeper information available on demand. Root context files (AGENTS.md) route to deeper documentation rather than dumping everything. Per-directory rules scope what the agent knows based on where it is working. This prevents context overload: as research shows, piling more instructions into the prompt causes model performance on each instruction to drop significantly. The curse of instructions means that progressive disclosure is not just polite -- it is necessary for reliable agent behaviour [@osmani2025].

## Principle 2: Three-Tier Boundaries

Use the Always / Ask First / Never boundary system rather than flat rule lists. Always-do actions let the agent operate autonomously. Ask-first actions trigger a human check-in at critical decision points. Never-do actions provide hard safety rails. This system minimises unnecessary human interruptions (the main source of workflow friction) while ensuring that high-impact decisions receive human oversight. The boundaries should be defined in the root context file and enforced by the agent's execution framework [@osmani2025].

## Principle 3: Verifiable Completion Criteria

Every task must have an objective, automatable definition of done. For code generation, this means a passing test suite. For knowledge work, this means a check against the spec or requirements document. Without verifiable criteria, the human must manually inspect every output, which is the primary source of friction in AI-assisted workflows. Verifiable criteria transform the human role from reviewer of implementation details to reviewer of outcomes [@galstian2025; @tweag2025].

## Principle 4: Asynchronous Verification

Verification should not block generation. The ideal workflow is: human defines spec and tests, agent generates implementation asynchronously, tests run automatically, results are reported back. The human reviews only when tests fail or when the agent requests input at an 'Ask first' boundary. This parallelises human and agent work, eliminating the sequential bottleneck where human waits for agent output or agent waits for human approval. CI/CD pipelines are the natural infrastructure for asynchronous verification, with spec-conformance gates that fail the build on contract mismatch [@galstian2025; @pockit2025].

## Principle 5: Persistent Context Replace Ephemeral Prompts

Prompts are ephemeral -- they disappear when the session ends. Persistent context files (AGENTS.md, per-directory rules, spec files) survive across sessions and improve over time. They make every agent session productive from the first turn, rather than requiring the human to re-establish context each time. This is the single highest-leverage investment in workflow efficiency: one hour spent curating context files saves dozens of hours of repeated prompting and correction [@pockit2025; @osmani2025].

## Principle 6: Modular Task Decomposition

Complex tasks decompose into small, independently verifiable units that fit within a single agent interaction. Each unit has a clear input (spec section + context), output (code or document), and verification criteria (passing test or spec check). This keeps each agent interaction within the model's reliable working context and prevents the quality degradation that occurs when tasks exceed the agent's attention budget. The decomposition is itself a spec-writing activity, captured in a tasks.md file that both human and agent reference [@osmani2025; @pockit2025].

## Relevant notes

- [[spec-driven-context-driven-tdd-workflow-overview]]
- [[spec-architecture-for-ai-coding-agents]]
- [[context-engineering-for-pi-agents]]
- [[multi-agent-orchestration-patterns]]
- [[sdd-four-phase-workflow-for-pi-agents]]