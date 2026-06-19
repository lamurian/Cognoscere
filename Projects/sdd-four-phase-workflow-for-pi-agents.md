---
title: SDD Four-Phase Workflow for pi Agents
description: Practical implementation of the Specification-Driven Development four-phase loop for pi agent coding projects
author: pi
editor: lam
date: 2026-06-07T18:18:52.686Z
tags:
  - agent
  - practical
  - implementation
  - software
---

## Summary

Specification-Driven Development replaces the single 'prompt to code' step with a four-phase loop that builds context before generating code. Each phase produces a document artifact that the agent references in subsequent phases. The phases are: Requirements (what are we building, captured in requirements.md), Design (how will we build it, captured in design.md), Tasks (what exact steps in what order, captured in tasks.md), and Implementation (build it, test it, verify it, producing code and tests). This workflow transforms AI-assisted coding from unstructured generation into engineering discipline [@pockit2025; @shangqi2025].

## Phase 1: Requirements

Start every feature by making the agent help clarify what you are building. Do not ask for code -- ask for a requirements analysis. The prompt should request: user stories for the flow, edge cases, security requirements, integration points with existing systems, and explicit scope boundaries (what we are NOT building). The 'what we are NOT building' constraint is critical. Without explicit scope boundaries, AI agents tend to over-build, adding unrequested features and introducing premature abstractions. The output is a requirements.md file that both human and agent reference as the source of truth for the feature scope [@pockit2025].

## Phase 2: Design

With requirements locked, translate them into technical decisions. Still no code -- just architecture. The design document should cover: database schema changes (with migration strategy), API endpoints (method, path, request/response shapes), service layer architecture (functions and dependencies), error handling strategy, and state machines for lifecycle management. This phase catches architectural mistakes before any code exists. It is infinitely cheaper to fix a design document than to debug a half-implemented feature. The agent should be instructed to reference existing patterns in the codebase and flag any design decisions that need human review [@pockit2025].

## Phase 3: Tasks

Break the design into discrete, dependency-ordered implementation steps. Each task should be small enough that the agent can complete it in a single focused session. Tasks should be grouped by layer (database, service, API, integration tests) with explicit dependencies between them. Each task includes its expected test coverage and complexity estimate. The output is a tasks.md with checkboxes that the agent marks as it completes each task. This prevents the agent from jumping ahead or implementing tasks out of order, which is a common source of cascading failures in AI-generated code [@pockit2025; @osmani2025].

## Phase 4: Implementation

Feed the agent one task at a time with full context: the requirements, design, and task description. The prompt for each task should include explicit constraints: 'Follow our existing pattern in [reference file], use [specific validation library], write tests first, run tests after implementation, do NOT modify any existing files except to add imports, do NOT implement other tasks.' These constraints prevent context collapse, enforce TDD, prevent scope creep, and ensure consistency with the existing codebase. After each task completes successfully, the agent marks it in tasks.md and proceeds to the next [@pockit2025; @galstian2025].

## Integration Verification

After all tasks are complete, the agent runs the full test suite and linting. Any failures must be fixed before the feature is considered done. The spec files (requirements.md, design.md, tasks.md) should be updated to reflect what was actually built, ensuring they remain accurate for future sessions. This final step prevents the slow divergence between documentation and implementation that accumulates into architectural drift [@pockit2025].

## Adapting for pi Knowledge Work

For the pi knowledge management workflow (research, summarisation, atomic note creation), the four-phase loop adapts by substituting: Requirements becomes the research question and scope definition. Design becomes the note structure and citation plan. Tasks becomes the list of atomic notes to create (one per key idea). Implementation becomes the batch creation of linked atomic notes using batch_create_para_docs. The same principles apply: define scope first, plan the structure, decompose into atomic tasks, execute one task at a time, verify against requirements, and update the plan as work progresses.

## Relevant notes

- [Spec-Driven Context-Driven TDD Workflow for AI Coding Agents](../Resources/spec-driven-context-driven-tdd-workflow-for-ai-coding-agents.md)
- [Spec Architecture for AI Coding Agents](../Resources/spec-architecture-for-ai-coding-agents.md)
- [Least-Obstructive Workflow Principles](../Resources/least-obstructive-workflow-principles.md)
- [TDD with AI Coding Agents](../Resources/tdd-with-ai-coding-agents.md)
- [Multi-Agent Orchestration Patterns](../Resources/multi-agent-orchestration-patterns.md)