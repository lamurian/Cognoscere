---
title: 'Using Goose with Paseo: ACP Integration Configuration'
description: Configure Goose as an ACP provider in Paseo for cross-device agent orchestration
author: pi
editor: lam
date: 2026-08-15T10:28:00.110Z
tags:
  - paseo
  - goose
  - acp
  - integration
  - configuration
  - agent-orchestration
---
## Summary

Paseo supports Goose as an ACP (Agent Client Protocol) provider, enabling you to run Goose agents on your machine and orchestrate them from Paseo's desktop, mobile, web, or CLI clients. Goose exposes two ACP server modes: stdio (`goose acp`) for direct subprocess communication, and HTTP/WebSocket (`goose serve`) for networked access. Paseo's ACP integration uses the stdio mode, spawning `goose acp` as a subprocess and communicating via JSON-RPC 2.0 over stdin/stdout.

## Key Points

### Prerequisites
- Goose CLI installed and authenticated (`goose configure` or `GOOSE_PROVIDER`/`GOOSE_MODEL` env vars)
- Paseo daemon running (desktop app, CLI `paseo`, or Docker)
- Goose binary in PATH (or full path specified in config)

### Configuration
Add a custom provider entry in `~/.paseo/config.json`:

```json
{
  "version": 1,
  "agents": {
    "providers": {
      "goose": {
        "extends": "acp",
        "label": "Goose",
        "description": "Block's open-source AI agent via ACP",
        "command": ["goose", "acp"],
        "params": {
          "supportsMcpServers": false,
          "clientCapabilities": {
            "fs": { "readTextFile": true, "writeTextFile": true },
            "terminal": true
          }
        }
      }
    }
  }
}
```

**Required fields for ACP providers:**
- `extends: "acp"` — identifies this as an ACP provider
- `label` — display name in Paseo UI
- `command` — array specifying the Goose ACP server command (`["goose", "acp"]`)

**Optional but recommended:**
- `params.supportsMcpServers: false` — Goose's ACP server may not support Paseo's injected MCP servers; disable to avoid session creation failures
- `params.clientCapabilities` — enables Paseo to execute filesystem/terminal operations on behalf of Goose (requires matching workspace paths)

### How It Works
1. Paseo spawns `goose acp` as a subprocess
2. Sends ACP `initialize` request over stdin
3. Goose responds with capabilities, modes, and models
4. Paseo creates sessions and sends prompts via ACP protocol
5. Goose streams responses, tool calls, and permission requests back

### Using Goose Extensions with Paseo
Goose extensions (MCP servers) are passed through to the ACP session. Configure in Paseo via agent launch options or the UI's extension picker. Alternatively, set `GOOSE_PROVIDER`/`GOOSE_MODEL` env vars in the provider's `env` field to control which LLM Goose uses.

### Running Goose via HTTP/WebSocket (Alternative)
For remote or multi-user scenarios, run `goose serve` on a server and connect Paseo via a custom ACP HTTP client (not natively supported yet; requires `goose acp` stdio mode).

### Known Limitations
- **No session fork/resume** — ACP providers don't support Goose's session fork/resume features
- **ACP session ID differs from Goose session ID** — telemetry correlation may not work
- **MCP server injection** — may cause issues; set `supportsMcpServers: false` if session creation fails
- **Authentication** — `goose serve` requires `GOOSE_SERVER__SECRET_KEY`; stdio mode inherits daemon auth

## Sources
- [Paseo Custom Providers Documentation](https://raw.githubusercontent.com/getpaseo/paseo/main/docs/custom-providers.md) — ACP provider configuration reference
- [Goose CLI Source](https://github.com/aaif-goose/goose/blob/main/crates/goose-cli/src/cli.rs) — `acp` and `serve` command definitions
- [Goose ACP Providers Guide](https://goose-docs.ai/docs/guides/acp-providers) — Goose as ACP client (using other agents)
- [Paseo Supported Agents](https://paseo.sh/agents) — Goose listed as supported agent

## Relevant notes

- [Paseo Custom Provider Configuration](Resources/paseo-custom-provider-configuration.md)
- [Parallel Execution in Pi vs Goose: Tool-Level vs Subagent-Level](Resources/parallel-execution-in-pi-vs-goose-tool-level-vs-subagent-level.md)
- [Paseo: Cross-Device Coding Agent Orchestration — Executive Summary](Resources/paseo-cross-device-coding-agent-orchestration-executive-summary.md)
- [Paseo vs Alternative Free Open Source Agent Orchestrators](Resources/paseo-vs-alternative-free-open-source-agent-orchestrators.md)
- [Paseo Alternatives in Rust and Go — Executive Summary](Resources/paseo-alternatives-in-rust-and-go-executive-summary.md)