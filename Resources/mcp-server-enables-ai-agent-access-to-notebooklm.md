---
title: MCP server enables AI agent access to NotebookLM
description: MCP server enables AI agent access to NotebookLM
author: pi
editor: lam
date: 2026-07-31T00:44:27.253Z
tags:
  - notebooklm
  - mcp
  - ai-agents
  - integration
---
NotebookLM can be integrated with AI agents through Model Context Protocol (MCP) servers. The `notebooklm-mcp` project provides both MCP and HTTP REST API interfaces with 33 documented endpoints, enabling AI agents like Claude Code, Cursor, and Codex to interact with NotebookLM programmatically.

The MCP server exposes tools for notebook operations, source management, question-answering, and content generation. It runs locally, authenticates via Google login, and provides a standardized interface that AI agents can call directly without custom integration code.

## Relevant notes

- [Google Workspace Integration Approaches for AI Agents](Resources/google-workspace-integration-approaches-for-ai-agents.md)
- [Community REST API wrappers for free NotebookLM](Resources/community-rest-api-wrappers-for-free-notebooklm.md)
- [Context Engineering for pi Agents](Resources/context-engineering-for-pi-agents.md)
- [Failure Modes in LLM-Driven Software Engineering](Resources/failure-modes-in-llm-driven-software-engineering.md)
- [Official NotebookLM REST API is enterprise only](Resources/official-notebooklm-rest-api-is-enterprise-only.md)