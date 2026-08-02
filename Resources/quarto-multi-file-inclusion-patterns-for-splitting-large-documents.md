---
title: Quarto Multi-File Inclusion Patterns for Splitting Large Documents
description: How to split large Quarto documents into multiple .qmd files using book projects and project render lists
author: pi
editor: lam
date: 2026-08-02T15:50:40.158Z
tags:
  - quarto
  - markdown
  - documentation
  - howto
  - configuration
  - project-structure
source: https://quarto.org/docs/books/
---
## Summary

Quarto provides two primary patterns for splitting large documents into multiple `.qmd` files: **Book Projects** (canonical approach for chapter-based documents) and **Project Render Lists** (for general multi-file projects). There is no inline `include` directive in Pandoc/Quarto markdown for embedding one `.qmd` file within another; the intended workflow is to configure file composition at the project level via `_quarto.yml`.

## Key Points

### Book Project Pattern (Recommended for Chapters)

Create a book project with `quarto create project book mybook` or manually configure `_quarto.yml`:

```yaml
project:
  type: book

book:
  title: "My Book"
  author: "Jane Doe"
  chapters:
    - index.qmd       # Required: serves as home page/preface
    - intro.qmd
    - chapter1.qmd
    - chapter2.qmd
    - references.qmd  # Bibliography placeholder

bibliography: references.bib

format:
  html:
    theme: cosmo
  pdf:
    documentclass: scrreprt
```

- `index.qmd` is required (serves as HTML home page)
- Chapters are automatically numbered and support cross-references
- Use `{.unnumbered}` on headings for unnumbered chapters (e.g., preface)
- Parts and appendices supported via `part:` and `appendices:` keys [@quartoteam2024a]

### Project Render List Pattern (General Multi-File)

For non-book projects, control which files render and their order:

```yaml
project:
  type: default  # or website, manuscript, etc.
  render:
    - section1.qmd
    - section2.qmd
    - "chapters/*.qmd"  # Wildcards supported
    - "!draft.qmd"      # Exclude with !
```

- Files with `_` prefix (e.g., `_shared.qmd`) are excluded from rendering by default
- Use `quarto render` to render all specified files with shared project metadata [@quartoteam2024b]

### Pandoc Command-Line Includes (Advanced)

Pandoc supports including raw content at specific document positions (not markdown composition):

- `--include-in-header=FILE` — Include in document header (CSS, JS, LaTeX preamble)
- `--include-before-body=FILE` — Include at start of body (navigation, banners)
- `--include-after-body=FILE` — Include at end of body (footers, scripts)

These accept HTML/LaTeX/Typst fragments, not markdown content to be parsed [@macfarlane2024].

### Shared Configuration

- `_quarto.yml` — Project-level metadata inherited by all documents
- `_metadata.yml` — Directory-level metadata for subsets of files
- Metadata merges: document > directory > project [@quartoteam2024b]

## Sources

- [@quartoteam2024] — Official book creation guide
- [@quartoteam2024a] — Book structure: chapters, parts, appendices, numbering
- [@quartoteam2024b] — Project basics: render lists, shared metadata, directory config
- [@macfarlane2024] — Pandoc manual: include options for header/body/footer

## Relevant notes

- [Scaling R and Python Polyglot Analytics to Production](Resources/scaling-r-and-python-polyglot-analytics-to-production.md)
- [Pixi and Quarto Python Integration](Resources/pixi-and-quarto-python-integration.md)
- [Synthesis & Reporting: Communicating Statistical Findings](Resources/synthesis-reporting-communicating-statistical-findings.md)
- [Quarto Python Code Block Execution via Jupyter Kernels](Resources/quarto-python-code-block-execution-via-jupyter-kernels.md)
- [Roadmap: Learning Statistics from Scratch — Frequentist and Bayesian Perspectives](Projects/roadmap-learning-statistics-from-scratch-frequentist-and-bayesian-perspectives.md)