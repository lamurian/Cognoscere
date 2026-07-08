---
title: Go Pre-commit Hooks
description: Standard Go pre-commit hooks using golangci-lint, gofumpt, go mod tidy, and go test for production readiness
author: pi
editor: lam
date: 2026-07-04T09:58:27.330Z
tags:
  - golang
  - hooks
  - cicd
  - quality
  - best-practices
  - automation
  - testing
---
## Summary

Pre-commit hooks for Go are managed using the [pre-commit](https://pre-commit.com/) framework. The standard configuration uses three repos in `.pre-commit-config.yaml`: `pre-commit/pre-commit-hooks` for file-size and whitespace checks; `golangci/golangci-lint` with the `golangci-lint-full` hook; and `tekwizely/pre-commit-golang` for `go-fumpt-repo`, `go-mod-tidy-repo`, and `go-test-repo-mod`. The companion `.golangci.yml` sets `gocognit.min-complexity: 15` and `gocyclo.min-complexity: 15`, enables all govet checks, and activates linters including gosimple, staticcheck, errcheck, gocyclo, gocognit, and gofumpt. This configuration catches three common SonarQube gate failures before CI: duplicate literals (goconst), cognitive complexity >15 (gocognit), and code duplication (dupl). Installation requires running `pre-commit install` after committing the config file.

## Relevant notes

- [Paseo Workflow: Pre-commit and Pre-push Hooks with Agents](Resources/paseo-workflow-pre-commit-and-pre-push-hooks-with-agents.md)
- [Paseo Workflow Fit: ADR-Driven TDD Pipeline with Quality Gates — Executive Summary](Resources/paseo-workflow-fit-adr-driven-tdd-pipeline-with-quality-gates-executive-summary.md)
- [Paseo Workflow: TDD Iteration Loop with Agents](Resources/paseo-workflow-tdd-iteration-loop-with-agents.md)
- [Paseo Workflow: PR Revision Cycle with Agents](Resources/paseo-workflow-pr-revision-cycle-with-agents.md)
- [GitHub and CDN as Free Permanent Image Host](Resources/github-and-cdn-as-free-permanent-image-host.md)