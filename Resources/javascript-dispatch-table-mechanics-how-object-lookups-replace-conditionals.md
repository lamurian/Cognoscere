---
title: 'JavaScript Dispatch Table Mechanics: How Object Lookups Replace Conditionals'
description: 'How JavaScript objects act as dispatch tables: V8 shape/IC internals, bracket notation mechanics, Object vs Map performance, and practical dispatch patterns'
author: pi
editor: lam
date: 2026-07-22T00:53:35.192Z
tags:
  - javascript
  - best-practices
  - design-patterns
  - reference
  - software-engineering
---
## Summary

A dispatch table (or lookup table) is a data structure that maps keys to values or behaviors, used to replace conditional branching with direct key-based retrieval. In JavaScript, objects and Maps serve this role. The technique works because JavaScript engines optimize property access via shapes (hidden classes) and inline caches, making object lookups extremely fast — typically O(1) — compared to the O(n) traversal of else-if chains.

## How Dispatch Tables Work

A dispatch table replaces explicit branching with a data lookup:

```javascript
// Conditional chain: O(n) worst-case, must evaluate each condition sequentially
function getFruitMessage(fruit) {
  if (fruit === 'apple') return 'Apple is great for making pies.';
  else if (fruit === 'banana') return 'Bananas are great for smoothies.';
  else if (fruit === 'cherry') return 'Cherries make delicious jam.';
  else return 'Unknown fruit';
}

// Dispatch table: O(1) lookup
const fruitMessages = {
  apple: 'Apple is great for making pies.',
  banana: 'Bananas are great for smoothies.',
  cherry: 'Cherries make delicious jam.',
  default: 'Unknown fruit'
};

function getFruitMessage(fruit) {
  return fruitMessages[fruit] || fruitMessages.default;
}
```

The mechanics: `fruitMessages[fruit]` uses JavaScript's **bracket notation** to access the property whose name equals the value of `fruit`. The engine resolves this property via its internal lookup system.

## V8 Object Property Lookup Internals

JavaScript engines do not use simple hash-table lookups for every property access. V8 uses two key optimizations [@bynens2018]:

**Shapes (Hidden Classes).** When an object is created, V8 assigns it a Shape — a descriptor of the object's structure (property names and their memory offsets). Objects with the same shape share the same Shape descriptor. The JSObject stores only the actual values in a fixed-offset array:

```
Shape: [apple→offset0, banana→offset1, cherry→offset2, ...]
                     ↓
JSObject: ["Apple is great...", "Bananas are great...", ...]
```

When the dispatch table object is created with a literal like `{apple: "...", banana: "..."}`, V8 creates a single Shape that maps each property name to a fixed offset in a contiguous array. Property access becomes a pointer dereference plus memory offset — comparable to a C struct field access.

**Inline Caches (ICs).** When code accesses `fruitMessages[fruit]` repeatedly, the IC records the Shape of `fruitMessages` and the offset of the accessed property. On subsequent calls, if the Shape matches, the engine loads the value from the memorized offset directly — skipping the full property lookup. This makes repeated lookups on the same dispatch table extremely fast [@bynens2018].

## Bracket Notation vs Dot Notation

```javascript
// Dot notation: property name must be a literal identifier
fruitMessages.apple

// Bracket notation: property name is computed from expression
fruitMessages[fruitVariable]
```

Both use the same Shape+IC mechanism. However, bracket notation with a dynamic key cannot use the simplest IC path because the engine cannot predict which property will be accessed. This causes **megamorphic** access (many different property keys hitting the same call site), which V8 handles via a hash-table fallback rather than the optimized offset-based path [@bynens2018].

In practice, for dispatch tables with a small number of keys (< 20), this slowdown is negligible. For larger tables, the engine still performs O(1) dictionary lookup.

## Object vs Map for Dispatch Tables

| Aspect | Object | Map |
|--------|--------|-----|
| Key types | Strings and symbols only | Any type (objects, functions, numbers) |
| Performance (string keys, <100k entries) | ~2x slower insertion than Map | Faster for most operations [@zhenghao2022] |
| Performance (integer keys) | Faster than Map (V8 optimizes array-indexed properties) | Slower [@zhenghao2022] |
| Memory | ~20-50% more memory than Map | More memory-efficient [@zhenghao2022] |
| Prototype chain | Inherits from Object.prototype | No prototype entries |
| Iteration | Object.keys/values/entries need helpers | Built-in iterator, for...of, .forEach |
| Size | Manual calculation | .size property |

**Guideline:** Use plain objects for small, static dispatch tables with string keys (the most common case). Use Map for dynamic tables with frequent additions/deletions, non-string keys, or when you need the table to scale beyond 100k entries [@zhenghao2022].

## Function Dispatch Tables

The pattern extends naturally to behaviors by storing functions as values:

```javascript
const handlers = {
  click: (event) => handleClick(event),
  hover: (event) => handleHover(event),
  submit: (event) => handleSubmit(event),
  default: (event) => console.log('Unknown event', event.type)
};

function handleEvent(event) {
  const handler = handlers[event.type] || handlers.default;
  handler(event);
}
```

The same Shape+IC optimization applies — once the IC warms up on the dispatch table Shape, function lookup is a direct offset read. The function itself is then called with the captured arguments.

## Dynamic Dispatch Tables

Dispatch tables can be built and modified at runtime:

```javascript
const routes = {};

function addRoute(path, handler) {
  routes[path] = handler;
}

function handleRoute(path) {
  const handler = routes[path];
  if (!handler) throw new Error(`No route for ${path}`);
  handler();
}
```

Each new key addition triggers a Shape transition in V8. Up to a point (~1022 properties), V8 uses fast array-based property storage. Beyond that, it falls back to a dictionary, which is slightly slower but still O(1) [@vteam2017].

## Key Points

- A dispatch table replaces O(n) conditional chains with O(1) key lookup by encoding the mapping as data rather than control flow
- V8's Shapes (hidden classes) give objects with known properties fixed memory offsets — access becomes pointer+offset, not hash lookup
- Inline Caches (ICs) memorize Shape+offset pairs, making repeated access on the same dispatch table near-instant
- Bracket notation with dynamic keys (`obj[key]`) is the essential mechanism — it computes the property name at runtime
- Object vs Map tradeoff: use plain objects for small static string-key tables; use Map for dynamic, large, or non-string-key tables
- Storing functions as values enables behavior dispatch with the same performance characteristics
- Adding new keys at runtime triggers Shape transitions — this is efficient up to ~1022 properties, then falls back to dictionary mode

## Sources

- [@bynens2018] — Mathias Bynens & Benedikt Meurer: JavaScript engine fundamentals — Shapes and Inline Caches (canonical V8 internals reference)
- [@zhenghao2022] — He Zhenghao: When You Should Prefer Map Over Object (comprehensive benchmarks with 100-5M entries)
- [@vteam2017] — V8 Team: Optimizing hash tables — hiding the hash code (hash table mechanics in V8)
- [@dasilva2022] — Cristiam Da Silva: Replacing Nested else-if with Object Mapping (practical dispatch table examples)

## Relevant notes

- [JavaScript: Replacing Long Conditionals with Dispatch Tables and Polymorphism](Resources/javascript-replacing-long-conditionals-with-dispatch-tables-and-polymorphism.md)
- [Pi Agent Efficiency: Practical Optimization Techniques](Resources/pi-agent-efficiency-practical-optimization-techniques.md)
- [Measurement and Quantification of the Local-Global Correctness Gap](Resources/measurement-and-quantification-of-the-local-global-correctness-gap.md)
- [Text-based Terminal Browsers with Vi-like Keys](Resources/text-based-terminal-browsers-with-vi-like-keys.md)
- [Approaches to Guardrail Design in Pi Agent for LLM-Aided Software Engineering](Resources/approaches-to-guardrail-design-in-pi-agent-for-llm-aided-software-engineering.md)