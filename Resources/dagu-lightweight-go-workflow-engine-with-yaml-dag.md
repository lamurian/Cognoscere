---
title: 'Dagu: Lightweight Go Workflow Engine with YAML DAG'
description: Dagu is a single-binary Go workflow engine with YAML DAG definitions, no DBMS required, and headless operation — the closest lightweight alternative to Kestra's declarative model.
author: pi
editor: lam
date: 2026-06-17T11:08:36.022Z
tags:
  - workflow
  - orchestration
  - open-source
  - tools
source: https://github.com/dagucloud/dagu
---
## Summary

Dagu is a self-contained, single-binary workflow engine written in Go that executes DAGs defined in declarative YAML format. It requires no database, message broker, or language runtime — all state lives in local files. Dagu is the closest open-source match to Kestra's YAML-first DAG authoring model, but implemented as a single Go binary that can run headless (`DAGU_HEADLESS=true`), making it ideal for users who want text-based orchestration without frontend overhead [@dagucloud2026].

## Key Strengths

- **True zero-dependency deployment.** Single binary with no DBMS, no broker, no runtime required. File-based storage for all workflow definitions, logs, and state.
- **Native YAML DAG with Kestra-like syntax.** Workflows are defined as directed acyclic graphs with `depends` fields, parallel branches, sub-DAG composition (`dag.run`), retry policies, cron scheduling, and lifecycle hooks.
- **Headless-first operation.** Run without the Web UI via `DAGU_HEADLESS=true` for CI/CD pipelines or CLI-only environments. The server, scheduler, and executor can run as separate processes.
- **Language-agnostic steps.** Tasks can be shell commands, Docker containers, Kubernetes jobs, SSH commands, HTTP requests, SQL queries, or custom actions — all from YAML.
- **Distributed execution.** Optional coordinator/worker architecture with gRPC for scaling across machines, worker labels for task routing, and Prometheus metrics.
- **MCP server built in.** AI agents (Claude Code, Codex, Pi, etc.) can manage workflows through the built-in Model Context Protocol endpoint.

## Key Limitations

- **GPLv3 license.** Copyleft licensing may restrict embedding in proprietary products. The embedded Go API requires a commercial license.
- **File-based storage ceiling.** Local file storage works for thousands of runs per day but lacks the concurrency and durability guarantees of a proper database for very high-throughput deployments.
- **Younger ecosystem.** At 3.5k GitHub stars and growing fast, but the plugin/action marketplace is smaller than Kestra's or Airflow's. Community is smaller than established players.
- **No native data-passing between steps.** Unlike data-centric orchestrators (Dagster, Prefect), Dagu passes data via files, environment variables, or external storage — no built-in data serialization between tasks.

## Sources

- [@dagucloud2026] Dagu GitHub repository and documentation
- [@sadeghi2025] State of Open Source Workflow Orchestration Systems 2025

## Relevant notes

- [[lightweight-go-workflow-engines-executive-summary-and-recommendation]]
- [[hatchet-durable-task-orchestration-engine-in-go]]
- [[tork-distributed-go-workflow-engine-with-yaml-jobs]]
- [[task-yaml-automation-engine-by-ovh]]
- [[the-agent-orchestration-landscape-in-2026]]