---
title: Extension Guidelines
description: Governance for pi extensions under .pi/extensions/ — structure, tooling, common package.json, and quality gates.
date: 2026-06-02
tags:
  - agent
  - standards
author: pi
editor: lam
---

# AGENTS.md — Extension Guidelines

This file governs all extensions in @.pi/extensions/. It does not replace the official [pi extension docs](https://github.com/earendil-works/pi-coding-agent/docs/extensions.md) or @AGENTS.md. It adds extension-specific rules enforced by @.husky/pre-commit.

## Common package.json

All extensions share one root @package.json. Do not create separate package.json files inside extension directories.

- Add runtime dependencies to `"dependencies"` in @package.json.
- Add dev dependencies (types, linters, formatters) to `"devDependencies"`.
- Run `npm install` after adding any dependency.
- Remove unused deps to keep @package.json clean.
- The root @package.json already includes `duckdb`, `typebox`, `eslint`, `prettier`, `typescript`, `husky`, and the pi SDK `@earendil-works/pi-coding-agent`. Use these before adding new ones.

## Sub-extension documentation

Each extension directory may contain its own `AGENTS.md` documenting extension-specific parameters, configuration, and usage notes. These files are cited here for agent reference.

- @.pi/extensions/web-search/AGENTS.md — SearXNG Search API parameter reference and tier/category usage

## File structure

Two layouts are allowed.

Single-file extension (under 300 lines):

- @.pi/extensions/my-tool.ts

Multi-file extension (over 300 lines or multiple concerns):

- @.pi/extensions/my-ext/index.ts — entry point
- @.pi/extensions/my-ext/helper.ts — helpers
- @.pi/extensions/my-ext/types.ts — shared types

## Max 300 lines per file

No file under @.pi/extensions/ may exceed 300 lines. This includes blank lines, comments, and JSDoc.

The pre-commit hook at @.husky/pre-commit checks this via @scripts/check-lines.mjs. If a file hits 301 lines, the commit is blocked.

Refactor when a file approaches or exceeds 300 lines. Split into sub-modules under a directory. For example, a 400-line `search.ts` becomes @.pi/extensions/search/index.ts, @.pi/extensions/search/parser.ts, and @.pi/extensions/search/ranker.ts.

## TypeScript strict mode

All extensions must compile cleanly under `strict: true` in @tsconfig.json.

- Use explicit types on all function params and return types.
- Prefer `interface` over `type` for extendable object shapes.
- Use `import type` for type-only imports.
- Use `.js` extension in relative import paths (jiti convention). Write `import { x } from "./helper.js"` even when the source is `.ts`.
- Avoid `any`. Use `unknown` and narrow with type guards.

## Cyclomatic complexity ≤ 15

Every function must have cyclomatic complexity of 15 or less. Enforced by ESLint rule `complexity: ["error", 15]` in @eslint.config.js.

When a function gets too complex, break it into smaller functions. Extract conditions into named boolean helpers. Use early returns to reduce nesting.

## Naming conventions

| Element       | Convention                  | Example                 |
| ------------- | --------------------------- | ----------------------- |
| Extension dir | kebab-case                  | para-knowledge          |
| File names    | kebab-case                  | git-commit.ts           |
| Entry point   | index.ts                    | para-knowledge/index.ts |
| Functions     | camelCase                   | registerTool()          |
| Classes       | PascalCase                  | SearchEngine            |
| Constants     | UPPER_SNAKE_CASE            | MAX_DIFF_SIZE           |
| Type exports  | PascalCase with Type suffix | ToolInputType           |

## Import order

Three groups separated by blank lines.

1. External packages — pi SDK, npm deps, node:\* modules
2. Internal modules — same extension, relative imports
3. Type-only imports — grouped separately when mixed

## Error handling

Every `registerTool` execute function must handle errors gracefully. Return a descriptive `content` message with `isError: true` rather than throwing. Validate params at the top of the function before doing work.

## Documentation

Every exported function needs JSDoc describing its purpose, params, and return value. Every extension file needs a top-level comment describing the module. Use `description` in `registerTool()` and `registerCommand()` for LLM-visible help text.

## No module-level side effects

No network calls, file writes, or console.log at module scope. Use the async factory function for initialisation. Use `session_start` or `before_agent_start` events for session-dependent work.

## State management

Persist extension state via `pi.appendEntry(customType, data)`. Do not rely on module-level variables — they are lost on reload. Reconstruct state in `session_start` by iterating `ctx.sessionManager.getEntries()`.

## Pre-commit enforcement

The hook at @.husky/pre-commit runs these checks in order on staged `.ts` files.

1. Prettier — auto-format
2. ESLint — lint and complexity check
3. TypeScript — tsc --noEmit
4. Line count — max 300 per file

If any check fails, the commit is blocked. Do not run `git commit --no-verify`. Fix the issue, stage changes, and retry.
