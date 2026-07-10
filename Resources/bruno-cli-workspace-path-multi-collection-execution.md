---
title: Bruno CLI Workspace-Path Multi-Collection Execution
description: Use --workspace-path and --global-env flags to run bru run from a parent directory with multiple Bruno collections
author: pi
editor: lam
date: 2026-07-09T13:12:35.486Z
tags:
  - cli
  - devtools
  - reference
---
To run `bru run` from a parent directory containing multiple Bruno collections without the "You can run only at the root of a collection" error, use the `--workspace-path` and `--global-env` flags. Set up a workspace directory parallel to your collections: create `workspace/bruno.json` for workspace-level config and `workspace/environments/Global.bru` for shared environment variables. Then run: `bru run collections/users-api --global-env Beta --workspace-path workspace`. The `--workspace-path` tells Bruno where the workspace root is relative to the collection, enabling resolution of global environments. Combine `--env` for collection-level and `--global-env` for workspace-wide variables — collection envs override globals. For simpler multi-collection setups, navigate into each collection root and run `bru run` directly, which avoids workspace configuration entirely [@usebruno2026b; @usebruno2026c].

## Relevant notes

- [Bruno CLI Collection Root Exit Code 4](Resources/bruno-cli-collection-root-exit-code-4.md)
- [Managing Bruno CLI via Mise](Resources/managing-bruno-cli-via-mise.md)
- [Paseo Architecture: Daemon-Based Cross-Device Agent Orchestration](Resources/paseo-architecture-daemon-based-cross-device-agent-orchestration.md)
- [Paseo.sh: Chat Room and Agentic Orchestration Platform](Resources/paseo-sh-chat-room-and-agentic-orchestration-platform.md)
- [Paseo Workflow Fit: ADR-Driven TDD Pipeline with Quality Gates — Executive Summary](Resources/paseo-workflow-fit-adr-driven-tdd-pipeline-with-quality-gates-executive-summary.md)