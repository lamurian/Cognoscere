---
title: HyperFrames Determinism Contract for Agent-Authored Video
description: 'How HyperFrames guarantees deterministic MP4 output: seek-driven frame clock, seekFrame adapters, atomic capture, banned wall-clock/random/network dependencies, Docker reproducibility.'
author: pi
editor: lam
date: 2026-08-16T08:51:40.161Z
tags:
  - hyperframes
  - video-generation
  - determinism
  - ai-agents
source: https://github.com/heygen-com/hyperframes
---
## Summary

HyperFrames is an open-source (Apache 2.0) framework by HeyGen that turns HTML, CSS, media, and seekable animations into deterministic MP4 videos, built explicitly for AI agents [@heygen2026a]. Determinism is its core guarantee: the same composition always produces the same video, which is what makes automated pipelines, CI regression tests, and agent-driven workflows reliable [@heygen2026].

The rendering pipeline is frame-by-frame and seek-driven — no realtime playback. The engine computes each frame's time with integer math (`time = floor(frame) / fps`) so rendering is decoupled from wall clock. A frame adapter receives `seekFrame(frame)` and deterministically positions all animations, DOM state, and canvas content; Chrome's `HeadlessExperimental.beginFrame` API captures the pixel buffer atomically (no partial paints); FFmpeg encodes the frames and mixes audio [@heygen2026].

## Key Points

- Determinism rules: no `Date.now()`, `requestAnimationFrame`, or system timers; no unseeded `Math.random()`; no render-time network fetches (assets frozen before render); fps/width/height locked; finite duration [@heygen2026]
- Docker mode pins an exact Chrome version, font set, and FFmpeg encoder for cross-platform reproducibility; local rendering may vary with platform fonts [@heygen2026]
- Preview/render parity via one shared runtime, producer-canonical seek semantics, and readiness gates (`__playerReady`/`__renderReady`) [@heygen2026]
- Adapter contract for custom animation runtimes (GSAP, Lottie, Three.js, Anime.js, WAAPI): `seekFrame` must be idempotent, no call-order-dependent side effects, no async resolving after commit, clean `init -> seekFrame(N) -> destroy` lifecycle [@heygen2026]
- Agent integration: 20 skills with a `/hyperframes` router, MCP support, and a non-interactive CLI (`init`, `lint`, `check`, `preview`, `render`, cloud render) [@heygen2026a]

## Sources

[@heygen2026a] — HyperFrames: Write HTML. Render video. Built for agents., GitHub, 2026
[@heygen2026] — HyperFrames: Deterministic Rendering, docs, 2026

## Relevant notes

- [Video Generation Layer Split: Deterministic Rendering vs AI Footage vs Managed APIs](Resources/video-generation-layer-split-deterministic-rendering-vs-ai-footage-vs-managed-apis.md)
- [Code-Rendered Video Frameworks: Deterministic Alternatives to HyperFrames](Resources/code-rendered-video-frameworks-deterministic-alternatives-to-hyperframes.md)
- [Deterministic HTML-to-Image Generation for AI Agents](Resources/deterministic-html-to-image-generation-for-ai-agents.md)
- [jcode vs Goose: Harness Focus vs General-Purpose Agent](Resources/jcode-vs-goose-harness-focus-vs-general-purpose-agent.md)
- [Spec-Driven Agentic Development with Formal Verification](Resources/spec-driven-agentic-development-with-formal-verification.md)