---
title: Adding a ProseMirror Plugin to a Crepe Feature in Milkdown
description: How to create a custom Crepe feature or plugin in Milkdown to add a ProseMirror plugin during editor creation.
author: pi
editor: lam
date: 2026-09-14T21:29:38.822Z
tags:
  - milkdown
  - crepe
  - prosemirror
  - plugin
  - typescript
source: https://github.com/Milkdown/milkdown
---
## Summary

Adding a custom ProseMirror plugin to Milkdown's Crepe editor requires understanding the Crepe architecture: `Crepe` extends `CrepeBuilder`, which creates an internal `Editor` instance. The `Editor` exposes `.config()` and `.use()` methods that accept `MilkdownPlugin` instances. Since raw ProseMirror plugins are not directly compatible, they must be wrapped as `MilkdownPlugin` using the `$prose` factory from `@milkdown/utils`. The maintainer confirmed in discussion #1432 that registering plugins "as usual" works after the v7.5.2 fix.

## Key Points

- **Crepe constructor** accepts `features` (partial record of `CrepeFeature` enum to boolean), `featureConfigs`, and `CrepeBuilderConfig` (`root`, `defaultValue`). Built-in features are loaded via `loadFeature(feature, this.editor, config)`.
- **`CrepeBuilder`** creates an `Editor` internally and calls `.use(commonmark, listener, history, indent, trailing, clipboard, upload, gfm)`. The `editor` getter exposes the underlying `Editor` instance.
- **Adding ProseMirror plugins**: Access `crepe.editor`, then use `crepe.editor.config(callback).use(plugin)`. The plugin must be a `MilkdownPlugin`, not a raw ProseMirror `Plugin`.
- **The `$prose` factory** from `@milkdown/utils` wraps a raw ProseMirror plugin: `$prose(ctx => new Plugin({...}))` returns a `$Prose` (MilkdownPlugin with `.plugin()` and `.key()` properties). It waits for `SchemaReady` before registering into `prosePluginsCtx`.
- **Alternative**: Use `crepe.editor.config((ctx) => { ... }).use($prose(...))` to add the plugin during or after editor creation.
- **`CrepeBuilder.addFeature`** allows manually adding Crepe features with custom configuration, but this is for Crepe features (not raw ProseMirror plugins).

## Code Pattern

```typescript
import { Crepe } from '@milkdown/crepe'
import { $prose } from '@milkdown/utils'
import { Plugin } from 'prosemirror-state'

// Create a Crepe instance
const crepe = new Crepe({
  root: '#editor',
  defaultValue: '# Hello',
  features: {
    [Crepe.Feature.CodeMirror]: false,
    [Crepe.Feature.BlockEdit]: false,
  },
})

// Add a ProseMirror plugin via the $prose wrapper
const myPlugin = $prose(ctx => new Plugin({
  state: { ... },
  props: { ... },
}))

// Register the plugin on the editor
crepe.editor.use(myPlugin)

// Or use config().use() chain
crepe.editor.config(ctx => {
  // configure context
}).use(myPlugin)

// Create the editor
crepe.create().then(() => {
  console.log('Editor ready')
})
```

## CrepeFeature Enum

The built-in features that can be toggled via the constructor:

- `Crepe.Feature.CodeMirror` — Code block editing (default: true)
- `Crepe.Feature.ListItem` — Lists (default: true)
- `Crepe.Feature.LinkTooltip` — Link editing (default: true)
- `Crepe.Feature.Cursor` — Drag-and-drop cursors (default: true)
- `Crepe.Feature.ImageBlock` — Image handling (default: true)
- `Crepe.Feature.BlockEdit` — Slash commands (default: true)
- `Crepe.Feature.Toolbar` — Formatting toolbar (default: true)
- `Crepe.Feature.Placeholder` — Placeholders (default: true)
- `Crepe.Feature.Table` — Table editing (default: true)
- `Crepe.Feature.Latex` — Math formulas (default: true)
- `Crepe.Feature.TopBar` — Top toolbar (default: false)
- `Crepe.Feature.AI` — AI-assisted editing (default: false)

## Architecture

The `Crepe` class hierarchy: `Crepe extends CrepeBuilder`. `CrepeBuilder` creates an `Editor` (from `@milkdown/kit/core`) via `Editor.make()`, configures it with context injections and built-in plugins, then `Crepe` loads features on top. The `Editor` class provides `.make()`, `.config()`, `.use()`, `.create()`, and `.destroy()` methods. The `$prose` factory wraps raw ProseMirror plugins into `MilkdownPlugin` instances that the `Editor.use()` method accepts, registering them into `prosePluginsCtx` after `SchemaReady`.

## Relevant notes

- [Goose Open Plugins Hooks vs Pi Extension Hooks: Deterministic Event Scripting](Resources/goose-open-plugins-hooks-vs-pi-extension-hooks-deterministic-event-scripting.md)
- [Pi vs Goose Extensibility: In-Process Hooks vs MCP Subprocesses](Resources/pi-vs-goose-extensibility-in-process-hooks-vs-mcp-subprocesses.md)
- [Goose Hook and Plugin Authoring: Manual-First, Low-Barrier Design](Resources/goose-hook-and-plugin-authoring-manual-first-low-barrier-design.md)
- [Paseo Alternatives in Rust and Go — Executive Summary](Resources/paseo-alternatives-in-rust-and-go-executive-summary.md)
- [Goose ACP Sessions Swap Config Extensions for Client MCP Servers](Resources/goose-acp-sessions-swap-config-extensions-for-client-mcp-servers.md)