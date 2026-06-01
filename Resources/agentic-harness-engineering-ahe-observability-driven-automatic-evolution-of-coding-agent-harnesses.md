---
author: pi
date: 2026-06-01T01:05:00.073Z
editor: lam
title: Agentic Harness Engineering (AHE) — Observability-Driven Automatic Evolution of Coding-Agent Harnesses
tags:
  - agent
  - LLM
  - development
  - tech
  - harness-engineering
---

## Source
- **Title:** Agentic Harness Engineering: Observability-Driven Automatic Evolution of Coding-Agent Harnesses
- **Authors:** Jiahang Lin, Shichun Liu, Chengjun Pan, Lizhi Lin, Shihan Dou, Zhiheng Xi, Xuanjing Huang, Hang Yan, Zhenhua Han, Tao Gui, Yu-Gang Jiang (Fudan University, Peking University, Shanghai Qiji Zhifeng Co., Ltd)
- **URL:** https://arxiv.org/html/2604.25850v4
- **Date:** May 2026

## Summary

This paper introduces **Agentic Harness Engineering (AHE)**, a closed-loop system that automatically evolves a coding agent's harness — the surrounding components (system prompt, tools, middleware, skills, memory) that mediate how the model interacts with its environment — without changing the base LLM.

The central insight is that harness evolution is bottlenecked by **observability**, not by agent capability. AHE implements three observability pillars:

1. **Component observability** — Each editable harness component (system prompt, tool description, tool implementation, middleware, skill, sub-agent config, long-term memory) lives in its own file within a decoupled framework (NexAU), so every failure pattern maps cleanly to a single component class.

2. **Experience observability** — Raw rollout trajectories (millions of tokens) are distilled via the Agent Debugger into a layered evidence corpus with per-task analysis reports and a benchmark-level overview, making root causes legible to the evolution agent.

3. **Decision observability** — Every edit ships with a change manifest containing a self-declared prediction (expected fixes + at-risk regressions), which is verified against the next round's task-level outcomes. Failed predictions trigger automatic rollback at file granularity.

## Key Findings

- **10 iterations** of AHE on Terminal-Bench 2 lifted pass@1 from **69.7% → 77.0%**, surpassing all human-designed harnesses (Codex: 71.9%, Terminus-2: 62.9%, OpenCode: 47.2%) and self-evolving baselines (ACE: 68.9%, Training-Free GRPO: 72.3%).

- **Cross-benchmark transfer** — The frozen AHE harness (evolved on Terminal-Bench 2) transferred to SWE-bench-verified without re-evolution, achieving the highest aggregate success (75.6%) while using **12% fewer tokens** than the seed harness.

- **Cross-model transfer** — Across three alternate model families (deepseek-v4-flash, qwen-3.6-plus, gemini-3.1-flash-lite-preview), AHE yielded consistent gains of **+5.1 to +10.1 pp**, with the largest gains on models furthest from saturation.

- **Component ablation** revealed that gains concentrate in **tools, middleware, and long-term memory** — not the system prompt. The system-prompt-only variant actually regressed (−2.3 pp), suggesting factual harness structure transfers while prose-level strategy does not.

## Key Points

- Harness engineering is a first-class lever for coding agent performance, separate from base model capability.
- Decoupling harness components into files makes the action space explicit and enables git-level rollback.
- Distilling raw trajectories into structured reports (rather than dumping raw logs) is crucial for the evolution agent to identify actionable failures.
- Every edit should be a falsifiable contract (prediction → verification → rollback), preventing trial-and-error collapse.
- Components interact non-additively — stacking effective edits can produce diminishing returns due to overlapping behavior.
- The loop's self-attribution is reliable for fixes but blind to regressions, pointing to regression foresight as the key direction for future work.

## Relevance

This paper is directly relevant to anyone building or maintaining coding-agent harnesses (like pi's extension/skill system). The AHE framework demonstrates that automated harness evolution can produce practical, transferable improvements — the evolved harness worked better across different benchmarks and different base models without re-tuning. The observability principles (component isolation, trajectory distillation, falsifiable edit contracts) are architecture patterns that apply to any agent system, not just coding agents.
