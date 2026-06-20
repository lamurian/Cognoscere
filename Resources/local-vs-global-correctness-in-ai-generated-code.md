---
title: Local vs Global Correctness in AI-Generated Code
description: How AI agents optimize for local test correctness while failing to preserve global architectural invariants
author: pi
editor: lam
date: 2026-06-20T09:45:05.214Z
tags:
  - agent
  - architecture
  - software-engineering
  - code-generation
  - fundamental
  - reference
---

## Summary

AI coding agents operate within a fundamental tension between local correctness and global architectural alignment. Local correctness means each module behaves correctly according to its immediate tests and contracts. Global architectural alignment means the entire system maintains consistent semantics, preserves intended design principles, and respects architectural boundaries across all components. Agents excel at local correctness but systematically struggle with global invariants.

## The Empirical Evidence

The NITR benchmark provides the most rigorous evidence of this phenomenon. Across 23 coding configurations (GPT, Claude, Gemini, Qwen), only 36.2% of maintainability-preserving repository edits succeeded. The hardest dimensions were Dependency Control (4.3% pass rate), Responsibility Decomposition (15.2%), and Reuse and Repo Awareness (31.9%). Critically, 64 out of 483 outcomes (13.3%) passed all functional tests yet failed the structural maintainability oracle — they were behaviorally correct but structurally wrong [@zhu2026].

The gap between micro cases (single-change edits, 53.5% pass rate) and multi-step cases (evolutionary edits, 20.6% pass rate) reveals the core issue: architectural failure is not about isolated code generation but sustained structural discipline under change. The existing knowledge base documents this failure mode under "automated changes that satisfy local tests while violating global system intent" in [Failure Modes in LLM-Driven Software Engineering](Resources/failure-modes-in-llm-driven-software-engineering.md).

## Why This Happens

LLMs trained on massive public code repositories learn patterns that optimize for completing the immediate request. They lack persistent awareness of the project's architectural intent across sessions [Context Engineering for pi Agents](Resources/context-engineering-for-pi-agents.md). The harness engineering framework identifies this as a feedback control problem: without feedforward controls (spec files, AGENTS.md rules, formal contracts) that constrain the agent before it acts, the agent defaults to locally optimal solutions that degrade global structure [Executive Summary: Harness Engineering for pi Agent Coding](Resources/executive-summary-harness-engineering-for-pi-agent-coding.md).

## Sources

[@zhu2026] — Haichao Zhu, Qian Zhang, Jiyuan Wang, Zhaorui Yang, Yuxin Qiu, "Needle in the Repo: A Benchmark for Maintainability in AI-Generated Repository Edits", arXiv:2603.27745, 2026