---
title: 'jcode vs Hermes: Harness vs Self-Improving Assistant'
description: Hermes Agent (Nous Research, Python, 231k stars) is a persistent self-improving assistant with a learning loop, curated file memory, messaging gateway, and 24/7 server presence; jcode is an efficiency-first coding harness.
author: pi
editor: lam
date: 2026-08-16T00:34:04.495Z
tags:
  - ai-agents
  - comparison
  - memory
  - python
---
## Summary

Hermes Agent is Nous Research's open-source, self-improving AI agent, MIT-licensed and written in Python, with about 231k GitHub stars as of August 2026. Its centerpiece is a closed learning loop: it creates skills from experience after complex tasks, improves them during use, nudges itself to persist knowledge, searches its own past conversations, and builds a deepening model of who you are across sessions. Persistent memory is bounded and curated, stored in two files (MEMORY.md and USER.md), with FTS5 session search plus LLM summarization for cross-session recall and Honcho dialectic user modeling [@nousresearch2026a; @nousresearch2026].

Where jcode is a terminal-first coding harness, Hermes is an always-on assistant: it ships a messaging gateway (Telegram, Discord, Slack, WhatsApp, Signal, email) from a single process, a built-in cron scheduler for unattended daily reports and backups, 40+ tools and 80+ skills, and runs on seven terminal backends (local, Docker, SSH, Singularity, Modal, Daytona, Vercel Sandbox) including a $5 VPS, with serverless hibernation so idle environments cost almost nothing. Delegation spawns isolated subagents for parallel workstreams, and Python scripts can call tools via RPC [@nousresearch2026a].

Both converge on memory and skills but from opposite ends. jcode's memory is a vector-embedded graph with cosine-similarity recall and embedding-gated skill injection, optimized to burn no tokens [@huang2026a]. Hermes' memory is curated, file-based, nudged by the agent itself and tied to a user model. jcode chases performance and harness-native coding collaboration (swarm, self-dev); Hermes chases permanence and reach — an agent that lives on your server and your chat platforms and stays teachable. For pure coding throughput, jcode's efficiency is the argument; for a persistent personal agent across platforms, Hermes is the argument [@grigio2026].

## Key Points

- Hermes: Python, MIT, Nous Research, ~231k stars; built-in learning loop (skills from experience, memory nudges, FTS5 session search, Honcho user modeling)
- Hermes memory: bounded curated files (MEMORY.md / USER.md) vs jcode's vector-embedded graph
- Hermes reach: messaging gateway, cron, seven terminal backends, $5 VPS, serverless hibernation, research-ready trajectory generation
- jcode: coding-specific, efficiency-first; swarm and self-dev are native
- Both auto-create and reuse skills; jcode gates skill injection by embedding hits

## Sources

[@nousresearch2026a] -- Nous Research, Hermes Agent — The agent that grows with you, GitHub, 2026
[@nousresearch2026] -- Nous Research, Persistent Memory, Hermes Agent documentation, 2026
[@huang2026a] -- Huang, Jeremy, jcode — The most RAM efficient harness, GitHub, 2026
[@grigio2026] -- Grigio, Federico, jcode: The Coding Agent That Raises the Skill Ceiling, vs opencode and pi, 2026

## Relevant notes

- [jcode vs Goose: Harness Focus vs General-Purpose Agent](Resources/jcode-vs-goose-harness-focus-vs-general-purpose-agent.md)
- [jcode vs pi: Efficiency and Philosophy](Resources/jcode-vs-pi-efficiency-and-philosophy.md)
- [jcode: Rust Terminal Coding Agent Harness](Resources/jcode-rust-terminal-coding-agent-harness.md)
- [jcode Semantic Memory: Vector Graph Recall Without Token Burn](Resources/jcode-semantic-memory-vector-graph-recall-without-token-burn.md)
- [jcode Resource Efficiency: RAM and Startup as Differentiators](Resources/jcode-resource-efficiency-ram-and-startup-as-differentiators.md)