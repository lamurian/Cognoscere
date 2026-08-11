---
title: 'Goose Hook and Plugin Authoring: Manual-First, Low-Barrier Design'
description: "Goose's documented authoring is manual-first: hooks are tiny shell scripts in any language ('without writing a custom extension'), and MCP extensions follow a standard Python/TS software project workflow with MCP Inspector testing."
author: pi
editor: lam
date: 2026-08-11T20:22:35.008Z
tags:
  - goose
  - hooks
  - extensions
  - workflow
  - mcp
  - reference
---
## Summary

Goose's authoring workflow is manual-first by design. The hooks system (May 2026) exists so users can script the agent loop "without writing any Rust or any MCP server" — hooks are shell commands in any language, configured in a `hooks/hooks.json` that maps lifecycle events to scripts, with a JSON payload on stdin. The plugin model is deliberately small: a folder, a JSON file, a script, no registration step, no daemon, no rebuild [@gooseblog2026a; @goosedocs2026c].

For capabilities beyond hooks, Goose's official tutorial treats MCP extension development as a standard software project: `uv init`, write the server with the Python MCP SDK (`FastMCP`), define tools/resources/prompts, configure `pyproject.toml`, test with MCP Inspector (a browser-based dev tool), integrate via `goose configure` or the Desktop sidebar, and publish to PyPI for distribution. Advanced features include MCP sampling (tools can request AI completions from goose's LLM) and MCP Apps (interactive UI components) [@goosedocs2026f].

Plugins package skills and hooks for distribution: `plugin.json` manifest, git-backed install (`goose plugin install <git-url>`), auto-update, disable via settings, and namespaced skill imports (e.g., `my-plugin:review`). Goose also supports Gemini-format extension repositories [@goosedocs2026d].

The only LLM-assisted piece in official docs is selection, not authoring: Smart Extension Recommendation auto-detects and enables existing extensions mid-session based on task needs [@goosedocs2026e]. Authoring itself is presented as user-side work — the barrier is low for hooks (any shell scripter) and standard-software for MCP servers (Python/Node developers). Goose the agent can technically write its own hook files, but no documented path positions agent-authoring as the workflow.

## Key Points

- Hooks are manual-first: tiny shell scripts in any language, "without writing a custom extension"
- MCP extensions follow a standard software project workflow: Python SDK, MCP Inspector, PyPI publishing
- Plugins package skills + hooks for distribution via git install
- Smart Extension Recommendation is LLM-assisted installation, not authoring
- Low barrier: shell scripters can write hooks; developers can write MCP servers

## Sources

[@gooseblog2026a] -- Hooks: Run Your Own Scripts on Every Goose Event, 2026
[@goosedocs2026c] -- Hooks, goose Documentation, 2026
[@goosedocs2026f] -- Building Custom Extensions, goose Documentation, 2026
[@goosedocs2026d] -- Plugins, goose Documentation, 2026
[@goosedocs2026e] -- Using Extensions, goose Documentation, 2026

## Relevant notes

- [Authoring Best Practices: Evaluation-Driven Workflow and Mechanism Selection](Resources/authoring-best-practices-evaluation-driven-workflow-and-mechanism-selection.md)
- [Pi vs Goose Extensibility: In-Process Hooks vs MCP Subprocesses](Resources/pi-vs-goose-extensibility-in-process-hooks-vs-mcp-subprocesses.md)
- [Pi vs Goose Deterministic Workflow Control](Resources/pi-vs-goose-deterministic-workflow-control.md)
- [Goose Open Plugins Hooks vs Pi Extension Hooks: Deterministic Event Scripting](Resources/goose-open-plugins-hooks-vs-pi-extension-hooks-deterministic-event-scripting.md)
- [Parallel Execution in Pi vs Goose: Tool-Level vs Subagent-Level](Resources/parallel-execution-in-pi-vs-goose-tool-level-vs-subagent-level.md)