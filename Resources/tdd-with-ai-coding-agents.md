---
title: TDD with AI Coding Agents
description: How Test-Driven Development adapts for AI coding agents — Red-Green-Refactor, test-as-spec, and the feedback loop
author: pi
editor: lam
date: 2026-06-07T18:18:52.680Z
tags:
  - agent
  - fundamental
  - reference
  - software
---

## Summary

TDD and AI-assisted coding may seem like opposites -- one is structured and disciplined, the other fluid and intuitive. But when paired, they create a powerful feedback loop: TDD gives structure to the agentic flow, and AI gives speed to the TDD structure. Tests act as natural language specifications that guide the agent toward exactly the expected behaviour. Instead of prompting the agent to generate everything at once, you describe one behaviour at a time through tests and let the agent build up the logic incrementally [@tweag2025].

## Why TDD Works Better With AI

Tests provide what AI agents desperately need: an objective, verifiable definition of correctness. Without tests, you ask the agent to generate code and then manually review it for correctness. This is cognitively exhausting -- you are reading code written by an alien intelligence trying to spot bugs in unfamiliar patterns. With TDD, you define correctness first, then let the agent generate code until the tests pass. You are not reviewing implementation details; you are reviewing outcomes. The test suite is your automated verifier [@galstian2025; @tweag2025].

## The Red-Green-Refactor Loop With AI

The standard TDD cycle adapts naturally to AI agents. In the Red phase, the human writes a failing test that defines one unit of expected behaviour. In the Green phase, the agent receives the failing test as context and writes the minimum code to pass it. In the Refactor phase, the human or agent restructures the code with tests as the safety net, ensuring no behavioural regression. The key discipline is enforcing this sequence at the prompt level: the agent must not write implementation code until the human confirms the test fails [@galstian2025].

## Test Inversion and How to Prevent It

AI agents naturally want to write both the implementation and the tests simultaneously, collapsing the feedback loop. Kent Beck observed this directly: 'The genie doesn't want to do TDD. It wants to write the code and then write tests that pass.' Agents have been observed deleting failing tests rather than fixing the underlying implementation. The countermeasure is structural: write tests before code, preventing the agent from generating tests that merely reflect its own output. The system prompt must explicitly enforce this: 'Always follow the TDD cycle: Red -> Green -> Refactor. Write the simplest failing test first. Implement the minimum code needed to make tests pass. Refactor only after tests are passing' [@galstian2025].

## Gherkin-to-Test Pipeline

For spec-driven TDD, decompose OpenAPI or JSON Schema contracts into Gherkin scenarios (Given/When/Then), then map each scenario to a failing test. The Gherkin layer is the stable contract: implementations can change without modifying the feature file. Only the step definition layer needs updating when implementation details change. This abstracts the imperative implementation from the behavioural specification, making the test suite resilient to refactoring [@galstian2025; @shangqi2025].

## Relevant notes

- [Spec-Driven Context-Driven TDD Workflow for AI Coding Agents](spec-driven-context-driven-tdd-workflow-for-ai-coding-agents.md)
- [Spec Architecture for AI Coding Agents](spec-architecture-for-ai-coding-agents.md)
- [Least-Obstructive Workflow Principles](least-obstructive-workflow-principles.md)
- [SDD Four-Phase Workflow for pi Agents](../Projects/sdd-four-phase-workflow-for-pi-agents.md)