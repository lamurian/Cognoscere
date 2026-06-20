---
title: Formal Models as Compilable Architectural Contracts
description: Using theorem provers like Lean to encode architectural invariants as enforceable compile-time contracts for AI agents
author: pi
editor: lam
date: 2026-06-20T09:45:05.215Z
tags:
  - agent
  - architecture
  - software-engineering
  - code-generation
  - methodology
  - reference
---

## Summary

Formal models provide a runnable, verifiable specification that can catch architectural violations at compile time, before they reach production. Unlike prose specs that cannot enforce constraints and easily become stale, formal models expressed in theorem provers like Lean 4 act as compilable contracts. Every agent-generated change must comply with the model or the build fails.

## How It Works

Architectural invariants — such as "point-like media must never be treated as interval-like media" or "all temporal relations must respect type-specific semantics" — are encoded as Lean types and propositions. The model enforces well-formedness rules: the types of allowed temporal relations are explicitly defined, and any code that violates these constraints produces a type error. Integration into the CI pipeline makes violations compile errors, forcing both agents and human developers to align implementation with the formal specification.

The Lean theorem prover is well-suited for this because it is both a functional programming language and an interactive theorem prover. It can express executable specifications that run as part of the build pipeline, and it provides machine-checked proofs that invariants hold. Recent advances like DeepSeek-Prover-V2 and Leanstral (Mistral's open-source proof agent) have made automated theorem proving in Lean more accessible, enabling integration with AI agent workflows.

## Connection to the Existing Knowledge Base

This approach extends the harness engineering framework described in [Executive Summary: Harness Engineering for pi Agent Coding](Resources/executive-summary-harness-engineering-for-pi-agent-coding.md). Formal models act as both feedforward controls (they constrain the agent before it generates code) and feedback controls (compile errors signal violations after generation). The NITR findings strongly support this direction: the failure archetypes of "shortcut over reuse" and "boundary contamination" are exactly the kind of violations that formal models can detect by encoding architectural boundaries as type constraints [@zhu2026].

## Sources

[@zhu2026] — Haichao Zhu, Qian Zhang, Jiyuan Wang, Zhaorui Yang, Yuxin Qiu, "Needle in the Repo: A Benchmark for Maintainability in AI-Generated Repository Edits", arXiv:2603.27745, 2026