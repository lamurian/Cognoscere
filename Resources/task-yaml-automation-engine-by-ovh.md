---
title: 'µTask: YAML Automation Engine by OVH'
description: µTask is OVH's Go-based YAML automation engine for business process orchestration with rich templating, conditional flow control, and built-in action plugins.
author: pi
editor: lam
date: 2026-06-17T11:08:36.039Z
tags:
  - workflow
  - orchestration
  - open-source
  - tools
  - automation
source: https://github.com/ovh/utask
---
## Summary

µTask (uTask) is a Go-based automation engine developed by OVH that models and executes business processes declared in YAML templates. Each template defines inputs, a graph of steps with inter-dependencies, and conditions that control execution flow. µTask is designed for operational automation — certificate provisioning, user onboarding, asynchronous API processing — rather than data pipelines. A single PostgreSQL database is its only runtime dependency [@ovh2026].

## Key Strengths

- **Rich, mature YAML templating.** µTask's template engine is the most expressive among Go-based alternatives, with Go text/template + Sprig functions, JSON manipulation, base64 encoding, and dynamic variable evaluation. This rivals Kestra's expression capabilities.
- **Sophisticated flow control.** Custom step states, skip/check conditions with multiple operators (EQ, REGEXP, IN, etc.), dependency qualification by state (`stepX:NOT_FOUND`), automatic branch pruning, and crossroads patterns allow complex decision trees in pure YAML.
- **Built-in action plugins.** HTTP, SSH, email, sub-task spawning, batch, notifications (Slack, Opsgenie, webhooks), callbacks, caching, and ping — all usable without writing code.
- **Resource-based rate limiting.** Steps declare target resources; administrators set numerical concurrency limits. Automatic resource acquisition prevents flooding downstream systems.
- **Security-first design.** All task data is encrypted at rest. Secrets are redacted from logs. Authentication is pluggable via init plugins (LDAP, OIDC, custom).
- **Go plugin extensibility.** Custom actions and authentication providers are compiled as Go plugins (`*.so`), enabling deep customization without forking.

## Key Limitations

- **Business-process oriented, not general DAG.** µTask excels at structured operational workflows (provisioning, onboarding, approvals) with human-in-the-loop steps. It is less suited for ad-hoc command chains or quick script orchestration that Dagu or Tork handle naturally.
- **PostgreSQL required.** No embedded or file-based storage option. The database is the only persistence mechanism.
- **Single-runtime architecture.** All task execution happens within the µTask process — there is no container isolation, no distributed workers, and no support for running steps on remote machines (except via SSH plugin).
- **Has a frontend.** µTask ships an Angular-based dashboard for task management and resolution. While the API can be used headlessly, the frontend is baked into the binary.
- **Corporate maintenance risk.** Maintained by OVH with 1.4k stars but the last release was March 2026. As a single-company project, long-term stewardship depends on OVH's internal priorities.

## Sources

- [@ovh2026] µTask GitHub repository and documentation
- [@sadeghi2025] State of Open Source Workflow Orchestration Systems 2025

## Relevant notes

- [Lightweight Go Workflow Engines: Executive Summary and Recommendation](lightweight-go-workflow-engines-executive-summary-and-recommendation.md)
- [Paseo Workflow Fit: ADR-Driven TDD Pipeline with Quality Gates — Executive Summary](paseo-workflow-fit-adr-driven-tdd-pipeline-with-quality-gates-executive-summary.md)
- [Hatchet: Durable Task Orchestration Engine in Go](hatchet-durable-task-orchestration-engine-in-go.md)
- [Dagu: Lightweight Go Workflow Engine with YAML DAG](dagu-lightweight-go-workflow-engine-with-yaml-dag.md)
- [Tork: Distributed Go Workflow Engine with YAML Jobs](tork-distributed-go-workflow-engine-with-yaml-jobs.md)