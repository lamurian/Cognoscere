---
title: 'Go Dotenv: Loading .env Files with godotenv'
description: Using godotenv.Load() to read .env files into os.Getenv in Go applications.
author: pi
editor: lam
date: 2026-07-12T01:25:36.101Z
tags:
  - golang
  - configuration
  - tutorial
  - environment-variables
---
## Summary

`joho/godotenv` is a Go port of Ruby's dotenv library that parses `.env` files and injects their `KEY=VALUE` pairs into `os.Getenv()` [@barton2025]. Install with `go get github.com/joho/godotenv`. Call `godotenv.Load()` early in your program — typically in `main()` or a `config.Load()` function. After that, all variables from `.env` are readable via standard `os.Getenv()` calls. The file path is relative to the process working directory, not the Go source file. `Load()` does not overwrite existing env vars. If `.env` is missing, it returns an error — handle this gracefully in production where `.env` is not used.

## Relevant notes

- [Bruno CLI External Environment Variable Injection](Resources/bruno-cli-external-environment-variable-injection.md)
- [Go Pre-commit Hooks](Resources/go-pre-commit-hooks.md)
- [Bruno CLI Workspace-Path Multi-Collection Execution](Resources/bruno-cli-workspace-path-multi-collection-execution.md)
- [Bruno Workspace Environment File Formats](Resources/bruno-workspace-environment-file-formats.md)
- [Dagu: Lightweight Go Workflow Engine with YAML DAG](Resources/dagu-lightweight-go-workflow-engine-with-yaml-dag.md)