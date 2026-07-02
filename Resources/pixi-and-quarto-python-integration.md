---
title: Pixi and Quarto Python Integration
description: Running Quarto projects with pixi-managed Python environments.
author: pi
editor: lam
date: 2026-07-02T08:59:00.051Z
tags:
  - pixi
  - quarto
  - python
  - environment
---

## Summary

pixi manages Python environments for Quarto projects. Quarto executes Python code blocks via a Jupyter kernel (IPython by default). Run `pixi run quarto render` inside the project directory. pixi automatically places its managed Python interpreter on PATH, so Quarto discovers and uses it for code execution without extra configuration.

## Setup

Minimal `pixi.toml` [@wolfvollprecht2024]:

```toml
[workspace]
channels = ["conda-forge"]
platforms = ["linux-64", "osx-arm64"]

[dependencies]
jupyter = "*"

[tasks]
render = "quarto render"
preview = "quarto preview"
check = "quarto check"
```

Run `pixi install && pixi run render` [@positsoftwarepbc2024]. The `jupyter` dependency gives Quarto its IPython kernel. If Quarto does not auto-discover the kernel, register it explicitly: `pixi run python -m ipykernel install --user --name=pixi-env`.

## Key Points

- `pixi run` wraps commands in a shell with the pixi environment on PATH [@wolfvollprecht2024]
- Quarto auto-detects virtual environments but works best when the kernel is registered [@positsoftwarepbc2024]
- pixi tasks in `pixi.toml` automate render, preview, check, and clean commands [@lifeaftercoding2024]
- Academic project templates combine pixi + Quarto for reproducible ML research [@behzadsamadi2025]

## Sources

- @wolfvollprecht2024
- @positsoftwarepbc2024
- @lifeaftercoding2024
- @behzadsamadi2025