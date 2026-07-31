---
title: AI agents can use NotebookLM via REST wrapper or MCP
description: Practical integration paths for AI agents using NotebookLM
author: pi
editor: lam
date: 2026-07-31T00:45:25.518Z
tags:
  - notebooklm
  - ai-agents
  - integration
  - mcp
  - rest-api
---
For AI agents to use NotebookLM, the practical options are: (1) Use the official Google Cloud NotebookLM Enterprise REST API (requires enterprise license), (2) Deploy the community `notebooklm-rest-api` wrapper as a local HTTP service and call it from the agent, (3) Run the `notebooklm-mcp` server locally and use MCP tool calls, or (4) Build custom browser automation with tools like Playwright.

Option 2 (REST API wrapper) is best for programmatic control with standard HTTP. Option 3 (MCP) is best for AI agents with native MCP support. Both require local deployment and handle free-tier authentication via stored browser sessions.

No solution provides a simple installed CLI binary — all require running a local server process.

## Relevant notes

- [MCP server enables AI agent access to NotebookLM](Resources/mcp-server-enables-ai-agent-access-to-notebooklm.md)
- [Community REST API wrappers for free NotebookLM](Resources/community-rest-api-wrappers-for-free-notebooklm.md)
- [Google Workspace Integration Approaches for AI Agents](Resources/google-workspace-integration-approaches-for-ai-agents.md)
- [Official NotebookLM REST API is enterprise only](Resources/official-notebooklm-rest-api-is-enterprise-only.md)
- [Google Productivity Skill for AI Coding Agents](Resources/google-productivity-skill-for-ai-coding-agents.md)