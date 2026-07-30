---
title: CJS-ESM Interop Double-Wrapping Fix in Next.js Dynamic Import
description: Root cause and fix for runtime error when dynamically importing CJS package with nested default export in Next.js App Router
author: pi
editor: lam
date: 2026-07-29T16:02:51.331Z
tags:
  - nextjs, dynamic-import, CJS, ESM, interop, runtime-error, nextjs-toploader
---
## Summary

A runtime error `Element type is invalid. Received a promise that resolves to: [object Object]` occurred when dynamically importing `nextjs-toploader` (a CommonJS package) via `next/dynamic` in Next.js 14 App Router. The root cause was a CJS/ESM interop double-wrapping issue in webpack's module bundling.

## Root Cause

The `nextjs-toploader` package uses CommonJS: `module.exports = { __esModule: true, default: NextTopLoaderFn, useTopLoader }`. When webpack bundles `import('nextjs-toploader')` from an ESM context, it wraps the CJS exports in a synthetic namespace where `namespace.default` = the entire `module.exports` object. This produces:

```
{ default: { default: NextTopLoaderFn, __esModule: true, useTopLoader } }
```

Next.js App Router's `lazy-dynamic/loadable.js` applies `convertModule()` which unwraps only one level via `mod.default`, returning `{ default: NextTopLoaderFn, __esModule: true }` — still a plain object. `React.lazy` stores this object as the resolved component type. When `mountLazyComponent` tries to render it, the switch statement falls through because a plain object is neither a function, class, `forwardRef`, nor `memo`.

## Why Other Dynamic Imports Work

TS/ESM modules (`RecommendationCardStack`, `FhirFormsRenderer`) use `export default Component`. For those, `import()` returns `{ default: Component }` directly — no CJS wrapping occurs.

## Solution

Add a `resolveCjsDefaultExport()` helper that safely extracts the actual component by checking for nested default exports in the correct priority: `mod.default?.default` -> `mod.default` -> `mod`. Apply it to the loader function of `next/dynamic`.

## Key Points

- Root cause: CJS `module.exports = { default: fn }` is double-wrapped by webpack's `import()` into `{ default: { default: fn } }`
- The fix unwraps via `mod.default?.default ?? mod.default ?? mod`
- Located in `src/lib/lazy-component.tsx` as `resolveCjsDefaultExport()`
- Applied in `src/components/app-chrome.tsx` for the `nextjs-toploader` dynamic import
- All 188 test files (1436 tests) pass with the fix

## Relevant files
- `src/lib/lazy-component.tsx` — `resolveCjsDefaultExport` function
- `src/components/app-chrome.tsx` — fixed dynamic import
- `src/__tests__/lazy-component.test.tsx` — unit tests for the helper

## Relevant notes

- [Memory Management and Optimization for CPU-Only Fine-Tuning of Small Language Models](Resources/memory-management-and-optimization-for-cpu-only-fine-tuning-of-small-language-models.md)
- [Vite-Based Single-Page Applications: Definition and Architecture](Resources/vite-based-single-page-applications-definition-and-architecture.md)
- [JavaScript Dispatch Table Mechanics: How Object Lookups Replace Conditionals](Resources/javascript-dispatch-table-mechanics-how-object-lookups-replace-conditionals.md)
- [Frequentist Inference](Resources/frequentist-inference.md)
- [Time Series Analysis: Bayesian Approach](Resources/time-series-analysis-bayesian-approach.md)