---
title: 'jcode Safety System: Two-Tier Human-in-the-Loop Guardrails'
description: "jcode's safety system: two-tier action classification (auto-allowed vs requires-permission), request_permission tool, review queue, multi-channel notifications, and custom rules."
author: pi
editor: lam
date: 2026-08-16T01:12:05.904Z
tags:
  - ai-agents
  - rust
  - safety
  - guardrails
  - human-in-the-loop
---
## Summary

jcode documents a human-in-the-loop safety system for unmonitored agent operations, the only consumer of which is ambient mode, though it is designed as a decoupled subsystem any feature can use [@huang2026c]. It classifies every action into exactly two tiers: Tier 1 auto-allowed (local, reversible, inside the project sandbox — read files, git history, read-only tests, memory operations, local branches/worktrees) and Tier 2 requires-permission (anything that communicates with a human or leaves a trace outside the local sandbox — emails, PRs, chats, push, CI/CD changes, package installs, network services, deployments, deletion outside the sandbox, database drops, financial/account changes). There is deliberately no "always denied" tier: if the user approves, the agent can do it [@huang2026c].

The flow: the agent calls a `request_permission` tool (action, description, rationale, urgency, wait), the request lands in a persistent review queue, notifications go out over email (SMTP/SendGrid/SES with interactive mailto approve/deny links), SMS (Twilio), desktop notify, ntfy.sh, webhooks, or a TUI widget, and the user decides via the TUI review panel, CLI (`jcode safety review/list/approve/deny/log`), email reply, or debug socket commands (`ambient:approve:<id>` / `ambient:deny:<id>`). Transcripts and per-cycle summaries are written to `~/.jcode/ambient/transcripts/` and the queue lives in `~/.jcode/safety/` [@huang2026c; @deepwiki2026a].

Custom rules let users promote or demote actions in `~/.jcode/config.toml` under `[safety.rules]`: `allow_without_permission`, `require_permission`, `allow_push_to`. The bash tool ties into the same system at the tool level — bash commands affecting system state are Tier 2, and the destructive gate can trigger a permission requirement for patterns like `rm -rf /` or `mkfs` [@deepwiki2026a].

Status caveat: the design doc is marked "Status: Design" (2026-02-08), but a source-level index from August 2026 cites implemented code — a pre_tool hook gate on tool calls, a notification dispatcher, the `jcode-notify-email` crate with IMAP polling that parses approval replies ("lgtm", "nope", etc.), and the bash destructive gate itself — so the system is partially shipped, primarily wired to ambient/unmonitored operation rather than interactive per-command approval [@deepwiki2026a].

## Key Points

- Two tiers only: auto-allowed vs requires-permission; no always-denied tier
- General rule: anything communicating with humans or leaving a trace outside the local sandbox requires permission
- `request_permission` tool + persistent review queue + multi-channel notifications (email/SMS/desktop/ntfy/webhook/TUI)
- Review via TUI panel, CLI, email reply links, or debug socket
- `[safety.rules]` custom classification (promote/demote; allow_push_to)
- Design doc status vs partial implementation (pre_tool hooks, email crate, bash gate exist in source)

## Sources

[@huang2026c] -- Huang, Jeremy, Safety System — jcode documentation, GitHub, 2026
[@deepwiki2026a] -- DeepWiki, Safety System and Notifications — jcode source analysis, 2026

## Relevant notes

- [Guardrailing jcode: Layered Protection Against Destructive Actions](Resources/guardrailing-jcode-layered-protection-against-destructive-actions.md)
- [Layered Guardrail Architecture with Pi Extensions](Resources/layered-guardrail-architecture-with-pi-extensions.md)
- [The No Free Lunch Tradeoff in Guardrail Design](Resources/the-no-free-lunch-tradeoff-in-guardrail-design.md)
- [Approaches to Guardrail Design in Pi Agent for LLM-Aided Software Engineering](Resources/approaches-to-guardrail-design-in-pi-agent-for-llm-aided-software-engineering.md)
- [Architectural Patterns for LLM Guardrail Systems in Software Engineering](Resources/architectural-patterns-for-llm-guardrail-systems-in-software-engineering.md)