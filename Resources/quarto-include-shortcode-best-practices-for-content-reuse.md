---
title: Quarto Include Shortcode Best Practices for Content Reuse
description: Best practices for Quarto's {{< include >}} shortcode for content reuse across documents
author: pi
editor: lam
date: 2026-08-02T16:10:59.407Z
tags:
  - quarto
  - markdown
  - shortcodes
  - howto
  - best-practices
  - documentation
source: https://quarto.org/docs/authoring/includes.html
---
## Summary

Quarto supports an `{{< include >}}` shortcode (Hugo-style syntax) for embedding content from one `.qmd`/markdown file into another at render time. This is distinct from the book project's `chapters:` configuration — `include` is for reusing shared content snippets (introductions, code examples, computed data prep) across multiple documents, while `chapters:` structures a book.

## Key Points

### Syntax

```markdown
{{< include _path/to/file.qmd >}}
```

- Use relative paths from the **including document's directory**
- Prepend `_` to included files (e.g., `_basics.qmd`) so `quarto render` ignores them as standalone targets
- Shortcode must be on its own line, surrounded by blank lines

### Behavior

- **Equivalent to copy-paste**: Included content is spliced in before rendering
- **Relative references resolve from main file**: Links, images, nested includes in the included file resolve relative to the *including* document's location — use absolute (project-root) paths in included files
- **Metadata blocks in included files apply globally**: Avoid YAML front matter in included files; it will affect the including document
- **Computational includes work**: Can include `.qmd` files with executable cells (all must use same engine: knitr or jupyter)

### Common Use Cases

1. **Shared introductions/boilerplate** across articles: `{{< include _basics.qmd >}}`
2. **Code snippets** inside fenced blocks for display (non-executed):
   ```markdown
   ```r
   {{< include _demo.R >}}
   ```
   ```
3. **Shared computational setup** (data loading, preprocessing):
   ```markdown
   {{< include _data.qmd >}}
   ```

### Best Practices

| Practice | Reason |
|----------|--------|
| Prefix included files with `_` | Prevents `quarto render` from processing them as standalone outputs |
| Use absolute paths (`/path/`) for links/images in includes | Relative paths resolve from including document, not included file |
| Avoid YAML front matter in included files | Metadata "leaks" into including document |
| Keep includes simple — no nesting in lists/tables | Shortcodes must be standalone on their own line with blank lines around |
| Use project render lists (`project.render:`) for chapter-like structures | `include` is for content reuse, not document structure |

### When NOT to Use `include`

- **Book/chapter structure** → Use `book.chapters:` in `_quarto.yml` [@quartoteam2024a]
- **Multi-file project rendering** → Use `project.render:` in `_quarto.yml` [@quartoteam2024b]
- **Cross-document cross-references** → Only work within book projects, not across arbitrary includes

## Sources

- [@quartoteam2024c] — Official Includes documentation: syntax, behavior, examples
- [@quartoteam2024a] — Book Structure: chapters, parts, cross-references
- [@quartoteam2024b] — Project Basics: render lists, shared metadata

## Relevant notes

- [Quarto Multi-File Inclusion Patterns for Splitting Large Documents](Resources/quarto-multi-file-inclusion-patterns-for-splitting-large-documents.md)
- [Synthesis & Reporting: Communicating Statistical Findings](Resources/synthesis-reporting-communicating-statistical-findings.md)
- [Pixi and Quarto Python Integration](Resources/pixi-and-quarto-python-integration.md)
- [Scaling R and Python Polyglot Analytics to Production](Resources/scaling-r-and-python-polyglot-analytics-to-production.md)
- [Quarto Python Code Block Execution via Jupyter Kernels](Resources/quarto-python-code-block-execution-via-jupyter-kernels.md)