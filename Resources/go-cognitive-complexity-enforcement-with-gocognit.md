---
title: Go Cognitive Complexity Enforcement with Gocognit
description: Gocognit cognitive complexity enforcement at threshold <15, integrated with golangci-lint and SonarQube
author: pi
editor: lam
date: 2026-07-04T09:58:34.867Z
tags:
  - golang
  - quality
  - complexity
  - gocognit
  - best-practices
  - tools
  - metrics
---
## Summary

[Gocognit](https://github.com/uudashr/gocognit) calculates cognitive complexity of Go functions by penalising nesting depth, boolean chains, and recursion — measuring how hard code is to intuitively understand. Unlike cyclomatic complexity (gocyclo) which counts control-flow paths, gocognit assigns +1 per increment (if, else, switch, for, goto, break LABEL, binary logical operators, recursion cycle) plus additional +1 per nesting level. For example, a switch statement is cyclomatic 4 but cognitive 1, while nested loops are cyclomatic 4 but cognitive 7. Enforcement uses golangci-lint with `gocognit.min-complexity: 15` in `.golangci.yml` under `linters-settings`, or standalone via `tekwizely/pre-commit-golang` with `my-cmd-repo-mod` and `args: [gocognit, -over, \"15\", .]`. The SonarQube-aligned threshold of 15 ensures functions flagged in SonarQube are blocked at commit time. Suppress individual functions with `// gocognit:ignore` used sparingly with a justification.

## Relevant notes

- [Go Pre-commit Hooks](Resources/go-pre-commit-hooks.md)
- [Hatchet: Durable Task Orchestration Engine in Go](Resources/hatchet-durable-task-orchestration-engine-in-go.md)
- [Executive Summary: Harness Engineering for pi Agent Coding](Resources/executive-summary-harness-engineering-for-pi-agent-coding.md)
- [Measurement and Quantification of the Local-Global Correctness Gap](Resources/measurement-and-quantification-of-the-local-global-correctness-gap.md)
- [Using Go and Rust to Optimize Analytics Production Pipelines](Resources/using-go-and-rust-to-optimize-analytics-production-pipelines.md)