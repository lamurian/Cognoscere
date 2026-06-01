---
title: Resources — Agent Guidelines
description: Resources hold reference materials and knowledge that support projects. This guide explains what belongs here and how the agent uses it.
date: 2026-05-31
tags:
  - agent
---

# Resources

## Purpose

Resources store reference materials. These are topics or sources you want to keep for future use. They are not tied to a single project or responsibility.

Examples: a statistical method (copula), a programming guide (docker commands), a medical reference (IBD pathophysiology).

## What belongs here

- Tutorials, guides, and how-tos.
- Topic summaries and explainers.
- Prompts for GPT that are reusable across projects.
- External references (papers, articles, tools).
- Cheatsheets and command references.

## What does not belong

- Active project work. Move to Projects.
- Ongoing personal responsibilities. Move to Areas.
- Inactive or superseded content. Move to Archives.

## Agent usage

When searching or writing in Resources, consider:

- Is this reusable reference material, not project-specific?
- Tag it well — Resources rely heavily on tags for discoverability.
- Cite external sources (URLs, DOIs) whenever possible.
- Keep notes atomic: one topic per file.

## File convention

`kebab-case-title.md` with YAML frontmatter (`title`, `date`, `tags`, `author`, `source`).
