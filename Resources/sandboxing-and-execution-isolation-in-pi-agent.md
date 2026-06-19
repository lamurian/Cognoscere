---
title: Sandboxing and Execution Isolation in Pi Agent
description: 'Two-level execution isolation in pi: OS-level sandboxing (bubblewrap/sandbox-exec) and config-driven filesystem/network policy enforcement'
author: pi
editor: lam
date: 2026-06-12T18:04:13.815Z
tags:
  - guardrails
  - pi-agent
  - sandbox
  - safety
  - software-engineering
---
## Summary

Pi provides two levels of execution isolation: OS-level sandboxing via the Sandbox extension, and filesystem/network policy enforcement via tool operations. These correspond to the "external level" of the layered protection model described in guardrail research [@ayyamperumal2024].

**OS-level sandbox.** The sandbox extension (`~/examples/extensions/sandbox/`) overrides the built-in `bash` tool with bubblewrap (Linux) or sandbox-exec (macOS) isolation. Configuration lives in a three-tier merge (defaults ← global `~/.pi/agent/extensions/sandbox.json` ← project `.pi/sandbox.json`). It enforces: filesystem deny-read (SSH keys, AWS credentials), deny-write (.env, *.pem, *.key), allow-write (project dir, /tmp), and network domain allowlists with default-deny policy [@pi-extensions].

**Config-driven policy.** The sandbox config exemplifies pi's three-tier configuration pattern: hardcoded defaults serve as safe baselines, global config applies across projects, and per-project config allows team-specific policies. Network access defaults to allowlist-only for package registries (npm, PyPI, GitHub), blocking arbitrary network calls.

**Environment-level isolation.** Beyond OS sandboxing, the `bash` spawnHook can inject environment restrictions: Docker containers, resource limits (ulimit), timeouts, and process-namespace isolation. The sandbox extension also demonstrates a `--no-sandbox` flag for opt-out in controlled scenarios.

**Considerations.** OS-level sandboxing adds startup latency (sandbox initialization occurs in `session_start`) and may break legitimate workflows that need access to blocked resources. The sandbox extension shows graceful degradation: if initialization fails, it falls through to the unsandboxed implementation and notifies the user. Audit logging in the status bar provides visibility into sandbox state.

**Relation to research.** This sandbox pattern directly implements the "runtime verification" and "fail-safe" layers described in the SAFE-AI Framework [@navneet2025]. The three-tier config mirrors the defense-in-depth principle: multiple independent layers compensate for each other's blind spots.

## Relevant notes

- [Approaches to Guardrail Design in Pi Agent for LLM-Aided Software Engineering](approaches-to-guardrail-design-in-pi-agent-for-llm-aided-software-engineering.md)
- [Layered Guardrail Architecture with Pi Extensions](layered-guardrail-architecture-with-pi-extensions.md)
- [Tool Override: Wrapping Built-Ins with Guard Layers](tool-override-wrapping-built-ins-with-guard-layers.md)
- [Tool Call Interception: Runtime Gating in Pi Agent](tool-call-interception-runtime-gating-in-pi-agent.md)
- [Session Lifecycle Guards in Pi Agent](session-lifecycle-guards-in-pi-agent.md)