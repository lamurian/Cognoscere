---
source_url: https://arxiv.org/pdf/2604.25850
author: pi
date: 2026-06-01T01:42:08.383Z
editor: lam
title: Agentic Harness Engineering: Observability-Driven Automatic Evolution of Coding-Agent Harnesses
tags:
  - LLM
  - agent
  - academic
  - research
  - paper
  - harness-engineering
---

## Source
- **Title:** Agentic Harness Engineering: Observability-Driven Automatic Evolution of Coding-Agent Harnesses
- **Authors:** Jiahang Lin, Shichun Liu, Chengjun Pan, Lizhi Lin, Shihan Dou, Zhiheng Xi, Xuanjing Huang, Hang Yan, Zhenhua Han, Tao Gui, Yu-Gang Jiang
- **URL:** https://arxiv.org/pdf/2604.25850 (arXiv:2604.25850)

## Summary

This paper introduces **Agentic Harness Engineering (AHE)**, a closed-loop system that automatically evolves a coding agent's harness — the collection of model-external, editable components (system prompt, tools, middleware, skills, long-term memory) — without modifying the underlying base model. The core insight is that automating harness evolution is bottlenecked by **observability**, not agent capability: once the evolution agent receives structured context over a clear action space, it can reliably converge on better harness designs.

AHE is built on three observability pillars:

1. **Component observability** — A decoupled harness substrate (NexAU) exposes seven editable component types as explicit files at fixed mount points. Each failure pattern maps cleanly to a single component class, giving the evolve agent a clean action space and making every edit file-level, revertible, and attributable.

2. **Experience observability** — A layered evidence corpus is distilled from millions of raw trajectory tokens using the Agent Debugger framework. Trajectories are organized into a navigable file-based environment, with per-task analysis reports and a benchmark-level overview, so the evolve agent consumes structured root causes rather than raw logs.

3. **Decision observability** — A change manifest pairs every edit with a self-declared prediction (expected fixes and at-risk regressions). The next iteration's outcomes verify these predictions, turning each edit into a falsifiable contract. Ineffective edits are reverted at file granularity.

A bootstrapping algorithm (Algorithm 1) runs the loop unattended: rollout → clean → attribute/manifest/rollback → distill via Agent Debugger → evolve/commit → repeat.

## Key Points

- **Main result:** Ten AHE iterations on Terminal-Bench 2 lift pass@1 from 69.7% (seed) to **77.0%**, surpassing the human-designed Codex harness (71.9%) and the self-evolving baselines ACE (68.9%) and Training-Free GRPO (72.3%).
- **Cross-benchmark transfer:** The frozen AHE harness (evolved on Terminal-Bench 2) transfers to SWE-bench-verified, achieving the highest aggregate success rate (75.6%) while using **12% fewer tokens** than the seed (526k vs 461k per trial). The two self-evolve baselines regress below the seed on this transfer.
- **Cross-model transfer:** The AHE harness yields consistent pass@1 gains of +5.1 to +10.1 percentage points across three alternate base-model families (deepseek-v4-flash, qwen-3.6-plus, gemini-3.1-flash-lite-preview), with the largest gains on models further from saturation.
- **Component ablations** reveal that tools (+3.3 pp), middleware (+2.2 pp), and long-term memory (+5.6 pp) each carry the improvement independently, while the system prompt alone regresses (−2.3 pp). Components interact non-additively — stacking effective edits caps the aggregate gain.
- **Self-attribution analysis** shows the evolve agent's fix predictions are evidence-driven (33.7% precision, 51.4% recall, ~5x above random), but regression predictions are only ~2x above random (11.8% precision, 11.1% recall), identifying **regression foresight** as the clearest direction for future self-evolution loops.
- The seed harness is deliberately minimal (a single shell-execution tool, no middleware, no skills) so every component AHE adds must earn its place against measured rollouts, avoiding contamination from an already-fitted seed.

## Relevance

This paper is directly relevant to anyone building or maintaining coding-agent harnesses (like the pi coding agent itself). It demonstrates that automatic harness evolution is feasible and practical, and that the gains transfer across benchmarks and model families. The three observability pillars provide a concrete design pattern for building self-improving agent systems, and the empirical results position harness-level evolution as a complementary axis to model-side training.
