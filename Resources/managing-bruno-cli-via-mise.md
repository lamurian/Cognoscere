---
title: Managing Bruno CLI via Mise
description: How to install and manage the Bruno API client CLI using mise's npm backend instead of npm install -g.
author: pi
editor: lam
date: 2026-07-08T15:54:50.062Z
tags:
  - tools
  - cli
  - npm
  - devtools
  - reference
---
Bruno CLI (`@usebruno/cli`) is normally installed globally via `npm install -g @usebruno/cli` [@usebruno2026a]. When using mise as the dev tool manager, the npm backend provides a cleaner alternative that keeps tool versions tracked in configuration and avoids global npm state [@jdx2026a]. Mise supports an npm backend for installing Node.js-based CLI tools, classified as Tier 3 because it requires `node` on PATH and silently binds tools to whichever Node.js is available at install time [@jdx2026]. Despite this caveat, it works well for Bruno CLI where npm is the canonical distribution method. Install globally with `mise use --global npm:@usebruno/cli` (add `--pin` to pin a specific version), or per-project by omitting `--global`. The `bru` command is then available when mise is activated. For one-off usage without permanent installation, use `mise exec npm:@usebruno/cli -- bru run docs/api`. If Node.js is also managed by mise, install it first: `mise use node@22 npm:@usebruno/cli`. Note that Bruno CLI v3.0.0+ defaults to Safe Mode; pass `--sandbox=developer` for scripts needing external packages [@usebruno2026]. For CI/CD, prefer the official Docker image `usebruno/cli:latest` over the npm backend [@usebruno2026a].

## Relevant notes

- [Paseo Workflow Fit: ADR-Driven TDD Pipeline with Quality Gates — Executive Summary](Resources/paseo-workflow-fit-adr-driven-tdd-pipeline-with-quality-gates-executive-summary.md)
- [Mobile Apps for Pi Coding Agent Remote Access: Options Comparison](Resources/mobile-apps-for-pi-coding-agent-remote-access-options-comparison.md)
- [Paseo vs Alternative Free Open Source Agent Orchestrators](Resources/paseo-vs-alternative-free-open-source-agent-orchestrators.md)
- [Paseo.sh: Chat Room and Agentic Orchestration Platform](Resources/paseo-sh-chat-room-and-agentic-orchestration-platform.md)
- [Paseo Workflow: Pre-commit and Pre-push Hooks with Agents](Resources/paseo-workflow-pre-commit-and-pre-push-hooks-with-agents.md)