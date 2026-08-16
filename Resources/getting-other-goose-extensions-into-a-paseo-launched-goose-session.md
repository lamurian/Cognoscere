---
title: Getting Other Goose Extensions into a Paseo-Launched Goose Session
description: 'Resolution options when only the paseo tool shows in a goose session under Paseo: declare MCP servers in Paseo, disable supportsMcpServers, or run goose standalone.'
author: pi
editor: lam
date: 2026-08-16T00:46:06.380Z
tags:
  - goose
  - paseo
  - extensions
  - troubleshooting
  - howto
---
## Summary

Because Paseo owns session creation for goose and always passes `mcpServers` once "Enable Paseo tools" is on, goose's own config.yaml extensions do not load in those sessions (see [[goose-acp-sessions-swap-config-extensions-for-client-mcp-servers]]). The direct fix is to declare the servers you want on the Paseo side: configure them through Paseo's agent launch options or extension picker so they are merged into the session's `mcpServers` and passed alongside the injected paseo server [@getpaseo2026].

Two alternatives exist. Set `params.supportsMcpServers: false` on the goose provider in `~/.paseo/config.json`: Paseo then sends an empty `mcpServers` list, goose falls back to its enabled config.yaml extensions and plugin MCP servers — but the injected paseo tool is no longer delivered [@mo2026c; @aaifgoose2026]. Or run goose standalone (outside Paseo) whenever the full config.yaml extension surface is required; the config path only applies to sessions goose creates itself.

Expect per-design trade-offs: extensions declared on the Paseo side travel with Paseo-owned sessions and work across devices, while goose-native config extensions only exist in goose-launched sessions. There is no setting that gives both the injected paseo tool and the untouched config.yaml surface in one ACP session.

## Key Points

- Add the extensions as MCP servers in Paseo's launch options / extension picker to include them in the session's MCP set
- `supportsMcpServers: false` restores goose config extensions but disables the injected paseo tool
- Run goose standalone for the complete config.yaml surface
- No setting combines the injected paseo tool with the untouched goose config surface in one ACP session
- Related: [[using-goose-with-paseo-acp-integration-configuration]], [[paseo-injects-its-mcp-server-into-every-acp-agent-session]], [[invoking-paseo-orchestration-skills-in-an-agent-session]]

## Sources

[@getpaseo2026] -- paseo runtime-mcp-config.ts source, 2026
[@mo2026c] -- Custom providers, Paseo Docs, 2026
[@aaifgoose2026] -- goose acp/server.rs source, 2026
[@goosedocs2026e] -- Using Extensions, goose Documentation, 2026

## Relevant notes

- [Goose ACP Sessions Swap Config Extensions for Client MCP Servers](Resources/goose-acp-sessions-swap-config-extensions-for-client-mcp-servers.md)
- [Paseo Injects Its MCP Server into Every ACP Agent Session](Resources/paseo-injects-its-mcp-server-into-every-acp-agent-session.md)
- [Using Goose with Paseo: ACP Integration Configuration](Resources/using-goose-with-paseo-acp-integration-configuration.md)
- [Pi vs Goose Deterministic Workflow Control](Resources/pi-vs-goose-deterministic-workflow-control.md)
- [Goose Open Plugins Hooks vs Pi Extension Hooks: Deterministic Event Scripting](Resources/goose-open-plugins-hooks-vs-pi-extension-hooks-deterministic-event-scripting.md)