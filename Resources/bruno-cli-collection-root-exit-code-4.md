---
title: Bruno CLI Collection Root Exit Code 4
description: Bruno CLI requires bruno.json or opencollection.yml in the CWD; missing them triggers exit code 4
author: pi
editor: lam
date: 2026-07-09T13:12:27.130Z
tags:
  - cli
  - devtools
  - reference
---
Bruno CLI's `bru run` command checks the current working directory for either a `bruno.json` file (bru collection format) or an `opencollection.yml` file (OpenCollection YAML format). The root detection lives in `packages/bruno-cli/src/utils/collection.js`, where `getCollectionFormat()` calls `fs.existsSync` for both files. If neither is found, the CLI exits with code 4 and prints "You can run only at the root of a collection". The CLI does not walk up parent directories — it only checks the CWD. Exit code 4 is defined as `ERROR_NOT_IN_COLLECTION` in `packages/bruno-cli/src/constants.js` [@usebruno2026b; @usebruno2026d].

## Relevant notes

- [Managing Bruno CLI via Mise](Resources/managing-bruno-cli-via-mise.md)
- [Paseo Architecture: Daemon-Based Cross-Device Agent Orchestration](Resources/paseo-architecture-daemon-based-cross-device-agent-orchestration.md)
- [Paseo.sh: Chat Room and Agentic Orchestration Platform](Resources/paseo-sh-chat-room-and-agentic-orchestration-platform.md)
- [Paseo Workflow Fit: ADR-Driven TDD Pipeline with Quality Gates — Executive Summary](Resources/paseo-workflow-fit-adr-driven-tdd-pipeline-with-quality-gates-executive-summary.md)
- [Mobile Apps for Pi Coding Agent Remote Access: Options Comparison](Resources/mobile-apps-for-pi-coding-agent-remote-access-options-comparison.md)