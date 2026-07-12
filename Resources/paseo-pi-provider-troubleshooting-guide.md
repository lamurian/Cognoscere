---
title: Paseo Pi Provider Troubleshooting Guide
description: 'Step-by-step fixes for pi agent not working under Paseo: trust config, environment, version checks, workarounds.'
author: pi
editor: lam
date: 2026-07-12T13:13:08.231Z
tags:
  - paseo
  - pi-agent
  - troubleshooting
  - orchestration
  - reference
---
When pi works from the terminal but not through Paseo's `--provider pi` flag, align pi's project trust, environment, and RPC protocol expectations with Paseo's subprocess model [@lamurian2026]. The most common fix is setting `"defaultProjectTrust": "always"` in `~/.pi/agent/settings.json`. Pi's non-interactive RPC mode does not show a trust prompt, so with the default `"ask"` setting, project-local resources (extensions, MCP servers, settings) are silently ignored. This breaks workflows where Paseo expects pi to load those resources. Alternatively, run `pi --approve` interactively once in the project directory to save a trust decision.

Verify the binary path matches. If Paseo resolves pi to a different location than your shell's `which pi`, override the command in `~/.paseo/config.json` with `"agents.providers.pi.command": ["/usr/local/bin/pi"]` [@mo2026c]. Also ensure API keys reach the daemon process environment, not just shell rc files. Create a custom pi provider entry with explicit environment: `{"extends": "pi", "env": {"PI_CODING_AGENT_DIR": "/home/user/.pi/agent"}}`. Check `paseo agent logs <id>` after launching -- empty logs mean the RPC handshake never completed, likely from protocol version drift between pi 0.80.3 and Paseo 0.1.105 [@lamurian2026]. Test an older pi version or use OpenCode in Paseo as a temporary workaround while running pi directly in a separate terminal.

## Relevant notes

- [Paseo Pi Provider Failure Root Causes](Resources/paseo-pi-provider-failure-root-causes.md)
- [Homelab: System Overview](Projects/homelab-system-overview.md)
- [Low-Power Solar Homelab: Executive Summary](Resources/low-power-solar-homelab-executive-summary.md)
- [Paseo CLI Provider Selection Syntax](Resources/paseo-cli-provider-selection-syntax.md)
- [Paseo Workflow Fit: ADR-Driven TDD Pipeline with Quality Gates — Executive Summary](Resources/paseo-workflow-fit-adr-driven-tdd-pipeline-with-quality-gates-executive-summary.md)