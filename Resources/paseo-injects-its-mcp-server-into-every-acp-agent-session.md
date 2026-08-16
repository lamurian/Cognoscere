---
title: Paseo Injects Its MCP Server into Every ACP Agent Session
description: 'How "Enable Paseo tools" works for ACP providers: Paseo merges a `paseo` HTTP MCP server into the session config and passes it via ACP session/new.'
author: pi
editor: lam
date: 2026-08-16T00:46:06.380Z
tags:
  - paseo
  - mcp
  - integration
  - orchestration
  - architecture
---
## Summary

The "Enable Paseo tools" toggle (Settings → your host → Agents) or `daemon.mcp.injectIntoAgents: true` makes Paseo deliver its orchestration catalog (agents, workspaces, terminals, schedules tools) into every new agent it launches [@mo2026g; @paseodocs2026]. For ACP providers such as goose, delivery is through MCP: Paseo registers a `paseo` MCP server — an HTTP endpoint on the daemon at `/mcp/agents`, authenticated with a per-agent capability token — into the agent's session config via `withRuntimePaseoMcpServer` [@getpaseo2026].

The ACP adapter then includes that `mcpServers` list in the `session/new` request: goose's capabilities default to `supportsMcpServers: true` in Paseo's adapter, so the server is actually passed and goose mounts it as a streamable_http session extension [@paseodocs2026; @getpaseo2026]. Any MCP servers the user configured on the Paseo side (agent launch options, extension picker) are merged alongside the injected server; together they are the complete MCP surface the session receives from Paseo.

The consequence of this delivery model is that when running goose under Paseo with Paseo tools enabled, the session's MCP tool set is whatever Paseo's session config declares. Goose's own `~/.config/goose/config.yaml` is not consulted by this path.

## Key Points

- Enable Paseo tools / `daemon.mcp.injectIntoAgents` → Paseo merges a `paseo` HTTP MCP server (daemon `/mcp/agents`) into every new agent's session config
- The ACP adapter passes `mcpServers` in `session/new`; goose advertises `supportsMcpServers: true` by default in Paseo's ACP capabilities
- User-configured MCP servers on the Paseo side are merged with the injected server
- Paseo owns the session's MCP tool surface; goose config.yaml is bypassed on this path
- Related: [[goose-acp-sessions-swap-config-extensions-for-client-mcp-servers]], [[using-goose-with-paseo-acp-integration-configuration]]

## Sources

[@mo2026g] -- Orchestration, Paseo Docs, 2026
[@paseodocs2026] -- MCP reference, Paseo Docs, 2026
[@getpaseo2026] -- paseo runtime-mcp-config.ts source, 2026

## Relevant notes

- [Getting Other Goose Extensions into a Paseo-Launched Goose Session](Resources/getting-other-goose-extensions-into-a-paseo-launched-goose-session.md)
- [Using Goose with Paseo: ACP Integration Configuration](Resources/using-goose-with-paseo-acp-integration-configuration.md)
- [Goose ACP Sessions Swap Config Extensions for Client MCP Servers](Resources/goose-acp-sessions-swap-config-extensions-for-client-mcp-servers.md)
- [Kandev: Go Server-First ADE with Phone Access](Resources/kandev-go-server-first-ade-with-phone-access.md)
- [Paseo Subagent Management Architecture](Resources/paseo-subagent-management-architecture.md)