---
title: Goose ACP Sessions Swap Config Extensions for Client MCP Servers
description: "Why a goose session created via `goose acp` with non-empty mcpServers (e.g. Paseo's injected server) only exposes those tools: config.yaml extensions are skipped."
author: pi
editor: lam
date: 2026-08-16T00:46:06.379Z
tags:
  - goose
  - acp
  - extensions
  - mcp
  - architecture
---
## Summary

Goose runs as an ACP server via `goose acp`. When a client such as Paseo creates a session with `session/new` and passes a non-empty `mcpServers` list, goose builds the session's tool surface from exactly those servers — plus a small builtin selection — and does not load the extensions enabled in `~/.config/goose/config.yaml` or the enabled plugin MCP servers [@aaifgoose2026].

The switch lives in `initial_session_extensions` in goose's `acp/server.rs` [@aaifgoose2026]. Request-scoped recipe extensions or goose-specific extension metadata win if present; otherwise, if `mcp_servers` is non-empty, each server is converted to a per-session extension (stdio or streamable_http) and pushed into the set. Only when `mcp_servers` is empty does goose fall back to `get_enabled_extensions_with_config(config)` plus enabled plugin MCP servers. It is all-or-nothing: a single injected server replaces the user's entire config.yaml extension surface.

Two consequences follow. First, anything installed to goose itself (servers added via `goose configure`, plugins, config.yaml entries) is invisible in sessions created by an ACP client that passes MCP servers. Second, in `goose acp` the builtin selection defaults to empty, and when the client advertises filesystem and terminal capabilities goose delegates those operations to the client instead of the `developer` builtin [@aaifgoose2026; @goosedocs2026e]. The session can therefore expose only the client-supplied tools — exactly the "only the paseo tool is usable" symptom.

## Key Points

- `goose acp` session/new with non-empty `mcpServers`: session tools = those servers only (+ selected builtins); config.yaml extensions and plugin MCP servers are skipped
- `mcpServers` empty: goose falls back to enabled config.yaml extensions plus enabled plugin MCP servers
- No merging happens: one injected server replaces the entire config extension surface
- Builtin selection defaults to empty in `goose acp`; fs/terminal work is delegated to the client when it advertises those capabilities
- Related: [[using-goose-with-paseo-acp-integration-configuration]], [[pi-vs-goose-extensibility-in-process-hooks-vs-mcp-subprocesses]]

## Sources

[@aaifgoose2026] -- goose acp/server.rs source, 2026
[@goosedocs2026e] -- Using Extensions, goose Documentation, 2026

## Relevant notes

- [Paseo Injects Its MCP Server into Every ACP Agent Session](Resources/paseo-injects-its-mcp-server-into-every-acp-agent-session.md)
- [Getting Other Goose Extensions into a Paseo-Launched Goose Session](Resources/getting-other-goose-extensions-into-a-paseo-launched-goose-session.md)
- [Using Goose with Paseo: ACP Integration Configuration](Resources/using-goose-with-paseo-acp-integration-configuration.md)
- [Pi vs Goose Extensibility: In-Process Hooks vs MCP Subprocesses](Resources/pi-vs-goose-extensibility-in-process-hooks-vs-mcp-subprocesses.md)
- [Goose Hook and Plugin Authoring: Manual-First, Low-Barrier Design](Resources/goose-hook-and-plugin-authoring-manual-first-low-barrier-design.md)