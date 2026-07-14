---
title: GWS CLI and google-workspace-skill for Claude Code
description: Open-source Claude Code skill wrapping Google's GWS CLI — 239 operations across Docs, Sheets, Slides, Drive, Gmail, Calendar, and Contacts.
author: pi
editor: lam
date: 2026-07-13T23:57:48.795Z
tags:
  - google
  - cli
  - automation
  - tools
  - open-source
  - integration
  - productivity
  - reference
source: https://github.com/andmarios/google-workspace-skill
---
The google-workspace-skill by andmarios is the closest available Claude Code skill for direct Google Docs, Slides, and Sheets integration. It wraps Google's official GWS CLI (gws-cli) — a Python CLI tool providing 239 operations across 8 Google Workspace services: Docs (50 ops), Sheets (49 ops), Slides (36 ops), Drive (28 ops), Gmail (35 ops), Calendar (23 ops), Contacts (15 ops), and Convert (3 ops including markdown-to-Doc/Slide/PDF with diagram rendering).

The skill is a Claude Code skill placed in ~/.claude/skills/google-workspace/. It includes SKILL.md with command reference and safety guidelines. Claude discovers and uses it automatically via uvx (no install needed): `uvx gws-cli --help`. The CLI outputs JSON for easy scripting. Authentication uses Google Cloud OAuth — create a project, enable APIs, download OAuth desktop credentials to ~/.config/gws-cli/client_secret.json, then run `uvx gws-cli auth` once. Multi-account support available (work/personal).

Key capabilities: Docs read/create/edit/format/export (md/pdf/docx/html/txt/rtf/epub/odt), tables, headers/footers, images, named ranges. Sheets read/write/format/charts/conditional formatting/data validation/sorting/filters/pivot tables. Slides create with text/images/shapes/tables/transforms/grouping/speaker notes/Sheets chart embedding. Drive upload/download/search/share/comments/revisions/permissions. Convert markdown to Google Docs/Slides/PDF with Kroki diagram rendering.

Security: All external content from Google Workspace is wrapped with security markers via prompt-security-utils against prompt injection. Two-tier config: gws-cli controls what to protect, prompt-security-utils controls how to protect. Tokens encrypted at rest. Requires Python 3.10+, uv, Google Cloud OAuth. MIT license. Active development — breaking changes expected before v1.0.

## Relevant notes

- [Google Workspace Integration Approaches for AI Agents](Resources/google-workspace-integration-approaches-for-ai-agents.md)
- [Google Productivity Skill for AI Coding Agents](Resources/google-productivity-skill-for-ai-coding-agents.md)
- [Paseo vs Alternative Free Open Source Agent Orchestrators](Resources/paseo-vs-alternative-free-open-source-agent-orchestrators.md)
- [Paseo CLI Provider Selection Syntax](Resources/paseo-cli-provider-selection-syntax.md)
- [Paseo Workflow Fit: ADR-Driven TDD Pipeline with Quality Gates — Executive Summary](Resources/paseo-workflow-fit-adr-driven-tdd-pipeline-with-quality-gates-executive-summary.md)