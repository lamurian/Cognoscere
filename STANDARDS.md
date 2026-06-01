---
title: Extension Coding Standards
description: Coding best practices for creating and maintaining pi extensions under .pi/extensions/.
date: 2026-06-01
tags:
  - standards
  - extensions
  - pi
  - best-practices
---

# Extension Coding Standards

This document defines the coding standards for all pi extensions in `.pi/extensions/`.
It extends the pi agent's own best practices defined in [AGENTS.md](AGENTS.md) and
the [pi extension documentation](https://github.com/earendil-works/pi-coding-agent/docs/extensions.md) —
it does **not** replace them.

These standards are enforced by the `.husky/pre-commit` hook. Any violation blocks
the commit. The agent must resolve every issue before retrying — `git commit --no-verify`
is strictly forbidden.

---

## 1. File Extension: Always `.ts`

Every extension entry point and supporting module **must** use the `.ts` file extension.

- ✅ `.pi/extensions/my-tool/index.ts`
- ✅ `.pi/extensions/my-tool.ts`
- ❌ `.pi/extensions/my-tool.js`
- ❌ `.pi/extensions/my-tool.mjs`

**Rationale:** pi uses [jiti](https://github.com/unjs/jiti) to load TypeScript files at
runtime without compilation. Using `.ts` uniformly signals that the module is a pi
extension, enables type-checking via `tsc --noEmit`, and keeps the codebase consistent.

---

## 2. Maximum 300 Lines Per File

No single file under `.pi/extensions/` may exceed **300 lines** (including blank lines,
comments, and JSDoc).

- If a module grows beyond 300 lines, **refactor it** into smaller sub-modules.
- Use a directory-style extension (`.pi/extensions/my-ext/index.ts`) to organise
  multiple related files.
- The pre-commit hook checks this automatically via `scripts/check-lines.mjs`.

**Rationale:** Shorter files are easier to review, test, and maintain. 300 lines provides
ample room for even moderately complex tools while encouraging modular decomposition.

---

## 3. Cyclomatic Complexity ≤ 15

All functions and methods must have a [cyclomatic complexity](https://en.wikipedia.org/wiki/Cyclomatic_complexity)
of **15 or less**, as measured by ESLint's built-in `complexity` rule.

```typescript
// ❌ High complexity (refactor into smaller functions)
function process(input: string): string {
  // nested ifs, switches, loops — complexity > 15
}

// ✅ Low complexity
function validate(input: string): boolean { /* ... */ }
function transform(input: string): string { /* ... */ }
function persist(input: string): void { /* ... */ }
```

ESLint flags violations at commit time. Split complex logic into smaller,
composable functions.

---

## 4. TypeScript Strict Mode

All extensions must compile cleanly under TypeScript's `strict` mode.

- Use explicit types for all function parameters and return types.
- Prefer `interface` over `type` for object shapes that may be extended.
- Use `import type` for type-only imports to avoid runtime overhead.
- Use the `.js` extension in relative import paths (jiti convention):

```typescript
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { helper } from "./helper.js";   // ✅ .js extension for .ts files
```

- Avoid `any`. Use `unknown` when the type is genuinely not known, then narrow
  with type guards.

---

## 5. Naming Conventions

| Element           | Convention              | Example                          |
|-------------------|-------------------------|----------------------------------|
| Extension dir     | `kebab-case`            | `para-knowledge/`, `web-search/` |
| File names        | `kebab-case`            | `git-commit.ts`, `my-tool.ts`    |
| Index entry point | `index.ts`              | `para-knowledge/index.ts`        |
| Functions         | `camelCase`             | `registerTool()`, `parseFile()`  |
| Classes           | `PascalCase`            | `SearchEngine`, `DocParser`      |
| Constants         | `UPPER_SNAKE_CASE`      | `MAX_DIFF_SIZE`, `DEFAULT_PORT`  |
| Type exports      | `PascalCase` with `Type` suffix | `ToolInputType`, `SearchResult`  |

---

## 6. Import Order

Organise imports in three groups separated by a blank line:

1. **External / pi packages** — `@earendil-works/pi-coding-agent`, `typebox`, `node:*`, npm deps
2. **Internal modules (same extension)** — `"./helper.js"`, `"./tools/searchDocs.js"`
3. **Types** — `import type { ... }` grouped separately when mixed

```typescript
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { readFileSync } from "node:fs";

import { helper } from "./helper.js";
import { parseFile } from "./parse.js";

import type { MyType } from "./types.js";
```

---

## 7. Error Handling

- Every `registerTool` `execute` function must handle errors gracefully and return a
  descriptive `content` message rather than throwing.
- Use structured `isError` flags on tool results when the tool encounters a
  recoverable failure.
- Validate input parameters at the top of the `execute` function before doing work.

```typescript
async execute(toolCallId, params, signal, onUpdate, ctx) {
  try {
    if (!params.name) {
      return {
        content: [{ type: "text", text: "Error: `name` is required." }],
        isError: true,
      };
    }
    // ... do work ...
    return { content: [{ type: "text", text: `Hello, ${params.name}!` }] };
  } catch (err) {
    return {
      content: [{ type: "text", text: `Unexpected error: ${err.message}` }],
      isError: true,
    };
  }
}
```

---

## 8. Documentation

- Every exported function must have a **JSDoc comment** describing its purpose,
  parameters, and return value.
- Every extension file must start with a top-level comment block describing
  the module's purpose and architecture.
- Use `description` in `pi.registerTool()` / `pi.registerCommand()` so the LLM
  and the TUI can display meaningful help text.

```typescript
/**
 * Parses frontmatter from a markdown file's YAML block.
 *
 * @param content - Raw markdown content string
 * @returns The parsed frontmatter object, or null if no valid frontmatter
 */
function parseFrontmatter(content: string): Record<string, unknown> | null {
```

---

## 9. Avoid Side Effects at Module Scope

Module-level code runs when jiti loads the file, before the extension factory
is invoked.

- ❌ No network calls, file system writes, or `console.log` at module scope.
- ✅ Use the async factory function for initialisation that must happen at load time.
- ✅ Use `session_start` / `before_agent_start` events for work that depends on
  the session context.

```typescript
// ❌ Side effect at module scope
const config = fs.readFileSync("config.json", "utf-8");

// ✅ Lazy initialisation or factory-time init
export default async function (pi: ExtensionAPI) {
  const config = await fetchConfig();
  // ...
}
```

---

## 10. State Management

- Persist extension state via `pi.appendEntry(customType, data)` — not in module-level
  variables (which are lost on reload).
- Reconstruct state in `session_start` by iterating `ctx.sessionManager.getEntries()`.
- Use `details` in tool results for forking-friendly state preservation.

---

## 11. Commit Convention

The pre-commit hook enforces these checks in order:

1. **Prettier** — auto-formats all staged `.ts` files.
2. **ESLint** — lints with `complexity ≤ 15` and no warnings.
3. **TypeScript** — `tsc --noEmit` must pass.
4. **Line count** — no file exceeds 300 lines.

If any check fails, the commit is aborted. **Do not run `git commit --no-verify`**.
Fix every violation, stage the changes, and retry.

---

## 12. Enforcement Tools

| Check              | Tool / Command                              | Config File           |
|--------------------|---------------------------------------------|-----------------------|
| Formatting         | `npx prettier --write`                      | `.prettierrc`         |
| Linting            | `npx eslint --max-warnings=0`               | `eslint.config.js`    |
| Complexity         | ESLint rule `complexity: ["error", 15]`     | `eslint.config.js`    |
| Type-checking      | `npx tsc --noEmit`                          | `tsconfig.json`       |
| Line count         | `node scripts/check-lines.mjs`              | `scripts/check-lines.mjs` |

All checks run automatically via `.husky/pre-commit`. Ensure your development
environment has the npm dev dependencies installed (`npm install`).

---

## 13. Pre-Commit Hook Integrity

The pre-commit hook is **not optional**.

- `git commit --no-verify` is **forbidden** — it bypasses all quality gates.
- If the hook itself has a bug, fix the hook, then commit (the hook runs on its
  own file too).
- If a false-positive blocks a commit, fix the standard (update this document
  and the hook config), then retry.

---

## Directory Structure Reference

```
.pi/extensions/
├── my-tool.ts               # Single-file extension (≤ 300 lines)
├── my-complex-ext/
│   ├── index.ts             # Entry point (exports default function)
│   ├── types.ts             # Shared types
│   ├── helper.ts            # Helper utilities
│   └── tools/               # Sub-directory for tool definitions
│       ├── search.ts
│       └── create.ts
```

See the official [pi extension examples](https://github.com/earendil-works/pi-coding-agent/tree/main/examples/extensions)
and [extensions.md](https://github.com/earendil-works/pi-coding-agent/blob/main/docs/extensions.md)
for full API reference.
