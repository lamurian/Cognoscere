---
title: Google Productivity Skill for AI Coding Agents
description: Agent-agnostic ~2800-line SKILL.md teaching agents to automate Google Workspace via direct Google REST API calls in Python.
author: pi
editor: lam
date: 2026-07-13T23:57:48.797Z
tags:
  - google
  - python
  - automation
  - open-source
  - integration
  - productivity
  - reference
  - tools
source: https://github.com/sfc-gh-kkeller/google-productivity-skill
---
The Google Productivity Skill by Kevin Keller (sfc-gh-kkeller) is a ~2,800-line SKILL.md file that teaches any AI coding agent to automate Google Workspace — Slides, Sheets, Docs, Drive, and Forms — via direct Google REST API calls in Python. It is agent-agnostic: works with Claude Code, Cortex Code, Cursor, Continue.dev, Windsurf, and any agent that reads project context files.

The skill file contains API reference documentation, working code examples, pre-built presentation themes (Corporate Clean, Technical Dark, Modern Light), error handling patterns, and project structure conventions. The agent reads SKILL.md, understands the available APIs and patterns, then generates Python code using google-api-python-client. Scripts run via pixi (pixi.sh), a Python package manager. Generated scripts are organized with numbered prefixes (001_create_presentation.py) and a HISTORY.md tracks every operation for rollback.

Key capabilities: Slides with themed styling, shapes/text boxes/images/charts/tables, Sheets chart embeddings. Sheets create/read/write/format/cells/charts/formulas/conditional formatting. Docs create with formatted text/tables/images. Forms create surveys/quizzes (multiple choice, text, scale) linked to Sheets. Drive list/search/upload/download/share files.

Setup requires pixi, gcloud CLI, and a GCP project with APIs enabled. Authentication via `gcloud auth application-default-login` with quota project set. Skill file is cloned into the project directory. No real-time Google connection — each request generates and runs a new Python script. Higher latency than CLI-based approaches but more flexible for complex multi-step workflows (e.g., query DB rarr write to Sheets rarr generate Slides from data). MIT license.

## Relevant notes

- [Google Workspace Integration Approaches for AI Agents](Resources/google-workspace-integration-approaches-for-ai-agents.md)
- [GWS CLI and google-workspace-skill for Claude Code](Resources/gws-cli-and-google-workspace-skill-for-claude-code.md)
- [Hatchet: Durable Task Orchestration Engine in Go](Resources/hatchet-durable-task-orchestration-engine-in-go.md)
- [Autonomy-Coordination Balance for Resolving Local-Global Correctness](Resources/autonomy-coordination-balance-for-resolving-local-global-correctness.md)
- [Research Synthesis: Best Practice to Resolve Local vs Global Correctness in Agentic Software Engineering](Resources/research-synthesis-best-practice-to-resolve-local-vs-global-correctness-in-agentic-software-engineering.md)