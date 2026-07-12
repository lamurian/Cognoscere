---
title: Paseo Pi RPC Mode Integration
description: How Paseo launches pi via --mode rpc, the JSONL protocol, and what can go wrong in the handshake.
author: pi
editor: lam
date: 2026-07-12T13:13:19.642Z
tags:
  - paseo
  - pi-agent
  - reference
  - architecture
  - troubleshooting
---
Paseo launches pi as a subprocess using `pi --mode rpc`, which communicates via a JSONL protocol over stdin/stdout. Commands are JSON objects sent to pi's stdin, one per line delimited by LF (`\n`). Events stream back on stdout as JSON lines. The protocol requires strict LF-only framing -- generic line readers like Node's `readline` are not compliant because they also split on Unicode separators (U+2028, U+2029) that can appear inside JSON strings. All commands support an optional `id` for request/response correlation. Responses have `type: "response"` with a `success` boolean. Events stream asynchronously during agent operation and have types like `agent_start`, `agent_end`, `message_update`, `turn_start`, `turn_end`, and `tool_execution_*`.

The RPC mode expects specific init behavior. When Paseo spawns pi, it should first probe the binary with `pi --version` for diagnostics (this is what the provider check does, showing Version 0.80.3). Then for an actual session, Paseo sends RPC commands like `{"type": "prompt", "message": "task"}`. If pi never responds, the agent logs show "No activity to display" [@lamurian2026]. The most critical integration points that can fail are: project trust silently blocking resource loading (fixable via `defaultProjectTrust: "always"`), environment variables not reaching the subprocess (API keys, `PI_CODING_AGENT_DIR`), binary path discrepancies between Paseo's daemon PATH and the user's shell PATH, and protocol version drift between pi's RPC implementation and Paseo's native pi adapter. The RPC protocol is documented at `docs/rpc.md` in the pi repository and covers 30+ commands including prompt, steer, follow_up, abort, set_model, get_state, bash, and session operations.

## Relevant notes

- [Paseo Pi Provider Failure Root Causes](Resources/paseo-pi-provider-failure-root-causes.md)
- [Paseo Pi Provider Troubleshooting Guide](Resources/paseo-pi-provider-troubleshooting-guide.md)
- [Paseo CLI Provider Selection Syntax](Resources/paseo-cli-provider-selection-syntax.md)
- [Paseo Workflow Fit: ADR-Driven TDD Pipeline with Quality Gates — Executive Summary](Resources/paseo-workflow-fit-adr-driven-tdd-pipeline-with-quality-gates-executive-summary.md)
- [Homelab: System Overview](Projects/homelab-system-overview.md)