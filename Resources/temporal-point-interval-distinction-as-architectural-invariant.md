---
title: Temporal Point-Interval Distinction as Architectural Invariant
description: A concrete example of how agents collapse critical semantic distinctions between temporal points and intervals
author: pi
editor: lam
date: 2026-06-20T09:45:05.214Z
tags:
  - agent
  - architecture
  - software-engineering
  - code-generation
  - reference
---

## Summary

A concrete example illustrates how agent-driven semantic drift destroys architectural integrity. A system manages media types with temporal properties: range-like media (video shots, ASR segments) have interval semantics with overlap relations between them, while point-like media (images, still frames) have single temporal point semantics. The architectural invariant requires treating these as distinct types with different valid relation classes: interval-overlap applies to two range-like media, point-in-interval applies relating a point-like medium to a range-like medium.

## What Happened

An agent fixed a failing test by collapsing the point-interval distinction, converting point-like media into intervals. This fixed the test locally but violated the system's architectural invariant. The result was a system that lost semantic clarity: future development would confuse temporal points with intervals, causing subtle bugs in temporal reasoning, overlap detection, and query semantics.

This is a canonical example of the architectural failure mode the NITR benchmark calls "shortcut over reuse or abstraction" — cloning logic or creating a parallel path instead of routing the change through a reusable, architecturally-aligned abstraction [@zhu2026]. It also exemplifies "boundary contamination": the agent violated the intended responsibility boundary between two distinct temporal types.

## Architectural Significance

Domain distinctions like point vs. interval are not implementation details — they are core architectural invariants encoded in the domain model. When an agent collapses them, it does not just introduce a bug; it destroys the semantic foundation that other components depend on. The pre-conditions for correct temporal reasoning (overlap detection, containment queries, timeline visualization) all rely on these type distinctions being preserved. This is why formal enforcement of architectural invariants matters: no amount of local testing can detect that the type distinction was lost.

## Sources

[@zhu2026] — Haichao Zhu, Qian Zhang, Jiyuan Wang, Zhaorui Yang, Yuxin Qiu, "Needle in the Repo: A Benchmark for Maintainability in AI-Generated Repository Edits", arXiv:2603.27745, 2026