---
title: Quarto Python Code Block Execution via Jupyter Kernels
description: How Quarto uses Jupyter kernels to execute Python code blocks.
author: pi
editor: lam
date: 2026-07-02T08:59:00.051Z
tags:
  - quarto
  - python
  - jupyter
  - kernel
---

## Summary

Quarto executes Python code blocks through Jupyter kernels. When rendering a `.qmd` file, Quarto scans for `{python}` code blocks and runs them via a Jupyter kernel (IPython by default) [@positsoftwarepbc2024a]. Each code block runs in a fresh kernel session, making execution reproducible. pixi provides the Python interpreter and kernel for this process.

## Mechanism

Quarto discovers kernels in standard Jupyter locations or auto-starts one using the Python interpreter on PATH [@positsoftwarepbc2024]. For explicit control, set `kernel: pixi-env` under `execute:` in `_quarto.yml`. pixi bootstraps its own Python interpreter from `requires-python` in `pyproject.toml`. Running `pixi run quarto render` ensures the pixi Python and kernel are on PATH [@wolfvollprecht2024].

## Setup

In `pixi.toml`, include `jupyter` or `ipykernel` in dependencies to provide the kernel:

```toml
[dependencies]
jupyter = "*"  # includes IPython kernel
matplotlib = "*"
pandas = "*"
```

Then register the kernel explicitly if needed: `pixi run python -m ipykernel install --user --name=pixi-env`.

## Sources

- @positsoftwarepbc2024a
- @positsoftwarepbc2024
- @wolfvollprecht2024