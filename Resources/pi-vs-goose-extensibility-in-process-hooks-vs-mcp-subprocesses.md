---
title: 'Pi vs Goose Extensibility: In-Process Hooks vs MCP Subprocesses'
description: Pi extensions are in-process TypeScript modules with agent-loop hook access; Goose extensions are external MCP server processes with protocol-level tool/resource/prompt integration.
author: pi
editor: lam
date: 2026-08-11T20:07:40.166Z
tags:
  - pi-agent
  - goose
  - extensions
  - mcp
  - comparison
  - architecture
---

## Summary

Pi and Goose take opposite extension runtime models. Pi extensions are TypeScript modules that run in-process inside the agent, receiving the full `ExtensionAPI`: `registerTool`, `registerCommand`, event hooks, and UI access. They load via jiti from `~/.pi/agent/extensions/` or `.pi/extensions/`, can be hot-reloaded with `/reload`, and ship as npm or git packages [@earendilworks2026].

Goose extensions are Model Context Protocol (MCP) servers that expose tools, resources, and prompts. Three transport types exist: builtin (in-process, e.g. the developer extension), stdio (external process over stdin/stdout), and SSE (HTTP). A Rust ExtensionManager spawns each extension as a separate process with `env_clear` and a safe-environment allowlist, scans downloaded extensions for malware, and supports per-tool permission rules (`allow`/`confirm`/`deny`) and OAuth flows. Because integration is protocol-based, Goose extensions can be written in any language [@goosedocs2026].

The decisive contrast is the hook surface. Pi lets extension code intercept the agent loop itself: `tool_call` can block or mutate tool arguments, `tool_result` can rewrite results, `before_agent_start` can inject system prompt fragments, and the `context` event can rewrite messages. MCP extensions in Goose cannot intercept the core loop — they expose a tool surface only. Goose compensates with a separate mechanism: Open Plugins hooks (added May 2026) run external shell scripts on lifecycle events with JSON payloads on stdin, and only PreToolUse and Stop events can block. So Goose's interception is out-of-process and mostly observational, while Pi's is in-process, mutable, and chained across extensions [@earendilworks2026; @goosedocs2026; @goosedocs2026c].

Both share the same base capabilities: custom tools callable by the LLM with JSON-schema-style parameters, package sharing, hot reload, auto-discovery, and a security posture (Pi's trust model and sandbox extension versus Goose's process isolation and malware scanning). The tradeoff is coupling versus portability: Pi's deep integration requires TypeScript and couples to pi internals; Goose's protocol decoupling works across any MCP client but restricts extensions to tool/resource/prompt primitives [@earendilworks2026; @goosedocs2026].

## Key Points

- Pi extensions run in-process as TypeScript with full event-hook access; Goose extensions run as external MCP server processes
- Pi intercepts the agent loop (`tool_call` block/modify, `tool_result` rewrite, prompt injection); Goose MCP extensions cannot — gating via declarative `allow`/`confirm`/`deny` rules plus out-of-process Open Plugins hooks (blocking only at PreToolUse/Stop)
- Goose is language-agnostic via MCP; Pi requires TypeScript but offers deeper integration
- Both support hot reload, package sharing, and extension discovery
- Related: [[goose-open-plugins-hooks-vs-pi-extension-hooks-deterministic-event-scripting]]

## Sources

[@earendilworks2026] -- Extensions, pi coding agent documentation, 2026
[@goosedocs2026] -- Extensions, Goose documentation, 2026
[@goosedocs2026c] -- Hooks, goose Documentation, 2026