---
title: Paseo Custom Provider Configuration
description: 'How to configure custom providers in ~/.paseo/config.json: extend built-in providers, ACP agents, multiple profiles, custom binaries.'
author: pi
editor: lam
date: 2026-07-12T12:47:58.566Z
tags:
  - paseo
  - configuration
  - orchestration
  - tools
  - reference
---
Paseo allows custom provider configuration through `~/.paseo/config.json` under `agents.providers`. Each entry has a unique provider ID and must include a `label`. Custom providers either extend a built-in provider (`"extends": "claude"`, `"extends": "codex"`, `"extends": "pi"`, etc.) or use `"extends": "acp"` for any ACP-compatible agent. ACP providers require a `command` array specifying the binary and arguments (e.g., `["gemini", "--acp"]`). Built-in extends inherit the host provider's launch mechanism while allowing overrides for `env`, `models`, `command`, and `disallowedTools` [@mo2026c; @mo2026].

Common use cases include pointing Claude Code at third-party Anthropic-compatible endpoints (Z.AI, Alibaba Qwen) with `ANTHROPIC_BASE_URL` and `ANTHROPIC_AUTH_TOKEN`, pointing Codex at custom OpenAI-compatible endpoints with `OPENAI_BASE_URL`, creating multiple profiles for the same provider with different API keys or model defaults, overriding the binary path for nightly builds or wrapper scripts, and adding ACP agents like Gemini CLI (`gemini --acp`) or Hermes (`hermes acp`). Models can be explicitly set with the `models` array or appended with `additionalModels`. Set `"enabled": false` to hide any provider from the UI and CLI [@mo2026c].

## Relevant notes

- [Paseo CLI Remote Daemon Access](Resources/paseo-cli-remote-daemon-access.md)
- [Paseo CLI Provider Selection Syntax](Resources/paseo-cli-provider-selection-syntax.md)
- [Paseo Workflow: ADR-to-Spec-to-Plan Hierarchy](Resources/paseo-workflow-adr-to-spec-to-plan-hierarchy.md)
- [Paseo Workflow Fit: ADR-Driven TDD Pipeline with Quality Gates — Executive Summary](Resources/paseo-workflow-fit-adr-driven-tdd-pipeline-with-quality-gates-executive-summary.md)
- [Low-Power Solar Homelab: Executive Summary](Resources/low-power-solar-homelab-executive-summary.md)