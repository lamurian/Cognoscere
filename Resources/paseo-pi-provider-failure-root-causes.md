---
title: Paseo Pi Provider Failure Root Causes
description: Known causes and diagnostic steps when pi agent hangs or fails to start under Paseo orchestration.
author: pi
editor: lam
date: 2026-07-12T13:12:35.780Z
tags:
  - paseo
  - pi-agent
  - troubleshooting
  - orchestration
  - reference
---
## Summary

Paseo launches pi using `pi --mode rpc`, communicating via JSONL over stdin/stdout. When pi works from the terminal but not through Paseo -- while other providers like OpenCode work -- the issue is in the Paseo-to-pi integration layer. A confirmed open bug (Issue #1991) reports pi sticking with endless loading and "No activity to display" in agent logs, even though the provider diagnostic shows Status: Ready with auth found [@lamurian2026].

## Known Root Causes

**Project trust in RPC mode.** Pi's non-interactive modes do not show a trust prompt. If no saved trust decision exists for the project directory, pi uses `defaultProjectTrust` from settings.json. The default `"ask"` silently ignores project-local resources (extensions, skills, settings) in non-interactive mode. If Paseo expects pi to load certain project resources like MCP servers from `.pi/settings.json`, the missing trust breaks the workflow silently with no error output.

**RPC protocol version drift.** Pi's RPC protocol requires strict LF-delimited JSONL framing. If Paseo's pi adapter was written for an earlier RPC spec version, a mismatch causes silent deadlock -- Paseo sends unrecognized commands or pi emits unexpected event fields. The `hasUI` flag also differs between terminal and RPC mode, affecting extension UI methods and the `ask` tool [@clarephang2026].

**Binary resolution and environment.** Paseo resolves the pi binary through its daemon PATH, which may differ from the user's shell PATH. The diagnostic may show the correct binary while the spawned process lacks environment variables (API keys, `PI_CODING_AGENT_DIR`) needed for authentication. Without auth, pi may hang silently waiting for credentials during RPC startup.

## Relevant notes

- [Paseo Workflow Fit: ADR-Driven TDD Pipeline with Quality Gates — Executive Summary](Resources/paseo-workflow-fit-adr-driven-tdd-pipeline-with-quality-gates-executive-summary.md)
- [Paseo CLI Provider Selection Syntax](Resources/paseo-cli-provider-selection-syntax.md)
- [Homelab: System Overview](Projects/homelab-system-overview.md)
- [Paseo Architecture: Daemon-Based Cross-Device Agent Orchestration](Resources/paseo-architecture-daemon-based-cross-device-agent-orchestration.md)
- [Paseo.sh: Chat Room and Agentic Orchestration Platform](Resources/paseo-sh-chat-room-and-agentic-orchestration-platform.md)