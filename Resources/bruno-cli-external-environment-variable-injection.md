---
title: Bruno CLI External Environment Variable Injection
description: Inject environment variables into bru run via --env-file, --env-var, or symlinked .env files
author: pi
editor: lam
date: 2026-07-09T13:12:35.486Z
tags:
  - cli
  - devtools
  - reference
---
Bruno CLI provides three ways to inject external environment variables into `bru run` without storing them in the collection. First, `--env-file /path/to/env.bru` accepts a `.bru` or `.json` environment file from any path (absolute or relative). JSON format (v2.13.0+) uses the schema `{ "name": "...", "variables": [{ "name", "value", "enabled" }] }`. Second, `--env-var KEY=VALUE` passes or overrides individual variables inline and is repeatable — best for CI secrets: `bru run --env-var JWT_TOKEN=abc123 --env-var API_KEY=xyz789`. Third, create a symlink from the collection root's `.env` to your project root's `.env` file: `cd bruno && ln -s ../.env.local .env`. Bruno picks up `.env` from the collection root automatically, and symlinks are Git-trackable [@usebruno2026b; @paul2024].

## Relevant notes

- [Bruno CLI Workspace-Path Multi-Collection Execution](Resources/bruno-cli-workspace-path-multi-collection-execution.md)
- [Managing Bruno CLI via Mise](Resources/managing-bruno-cli-via-mise.md)
- [Bruno CLI Collection Root Exit Code 4](Resources/bruno-cli-collection-root-exit-code-4.md)
- [Paseo Architecture: Daemon-Based Cross-Device Agent Orchestration](Resources/paseo-architecture-daemon-based-cross-device-agent-orchestration.md)
- [Dagu: Lightweight Go Workflow Engine with YAML DAG](Resources/dagu-lightweight-go-workflow-engine-with-yaml-dag.md)