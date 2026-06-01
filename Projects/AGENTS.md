---
title: Projects — Agent Guidelines
description: Projects are active tasks with specific goals and deadlines. This guide explains what belongs here and how the agent uses it.
date: 2026-05-31
tags:
  - agent
---

# Projects

## Purpose

Projects hold notes about active tasks. Each project has a clear outcome and a deadline (or intended completion date).

Examples: building a web widget, writing a paper, planning a conference talk.

## What belongs here

- Research notes for an active study (e.g. agent-based simulation).
- Implementation plans and roadmaps.
- Prompts and instructions tied to a deliverable.
- Business model briefs for a specific product.
- Decision records made during the project.

## What does not belong

- Ongoing responsibilities without an end date. Move to Areas.
- Raw reference material. Move to Resources.
- Completed or abandoned work. Move to Archives.

## Agent usage

When searching or writing in Projects, consider:

- Is this tied to a specific, finite goal?
- Include status or next steps when relevant.
- Link to Resources or Areas that support this project.
- Use `update_para_doc` to keep timelines and progress current.

## File convention

`kebab-case-title.md` with YAML frontmatter (`title`, `date`, `tags`, `author`, `source`).
