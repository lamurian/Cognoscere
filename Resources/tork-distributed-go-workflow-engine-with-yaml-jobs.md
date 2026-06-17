---
title: 'Tork: Distributed Go Workflow Engine with YAML Jobs'
description: Tork is a pure-Go, MIT-licensed distributed workflow engine with YAML job definitions and container-based task isolation, requiring PostgreSQL for state persistence.
author: pi
editor: lam
date: 2026-06-17T11:08:36.038Z
tags:
  - workflow
  - orchestration
  - open-source
  - tools
source: https://github.com/runabol/tork
---
## Summary

Tork is a lightweight, distributed workflow engine written in pure Go (99.7%). Jobs are defined in YAML and consist of sequential or parallel tasks, each running in its own container via Docker, Podman, or a shell runtime. Tork supports standalone (single-machine) and distributed (coordinator + workers) modes, with PostgreSQL as the only hard dependency for state persistence and an optional RabbitMQ broker for distributed operation [@cohen2026].

## Key Strengths

- **Pure Go, MIT licensed.** Nearly 100% Go codebase with a permissive MIT license, making it suitable for embedding and commercial use without licensing concerns.
- **YAML-defined jobs with rich task primitives.** Built-in support for parallel tasks, each-tasks (loops), sub-jobs, conditional execution via expressions, pre/post tasks, mounts, and secrets with auto-redaction.
- **Multiple runtimes.** Tasks execute in Docker (default), Podman (daemonless), or shell (host process). Docker provides strong isolation; shell mode enables lightweight local execution.
- **Stateless, leaderless coordinator.** No single point of failure — multiple coordinator instances can run concurrently, all sharing the same PostgreSQL datastore.
- **Extensible architecture.** Custom brokers, datastores, mounters, middleware (HTTP, Job, Task, Node), and endpoints can be registered via Go plugins.
- **Built-in scheduling.** Cron-based scheduled jobs with timezone support, plus webhooks for event-driven triggering.

## Key Limitations

- **Requires PostgreSQL even for standalone mode.** The single hard dependency — there is no embedded or file-based storage option. For simple standalone use, this adds operational complexity.
- **Docker dependency for task isolation.** Unless using the shell runtime (which sacrifices isolation), every task runs in a container. This adds overhead for simple command execution compared to Dagu's native shell approach.
- **Job-centric, not DAG-centric.** Tork models workflows as jobs with sequential/parallel tasks, not as arbitrary DAGs. There is no explicit `depends` field — parallel tasks run as a group, and each-tasks iterate over lists. Complex branching DAGs are harder to express.
- **Smaller community.** 807 GitHub stars and a single-maintainer project. While actively maintained (997 commits, 146 releases), the bus factor is a concern for production adoption.
- **Web UI is a separate service.** The Tork Web UI runs as an independent Docker container and must be configured separately — it is not integrated into the core binary.

## Sources

- [@cohen2026] Tork GitHub repository and documentation
- [@sadeghi2025] State of Open Source Workflow Orchestration Systems 2025

## Relevant notes

- [[lightweight-go-workflow-engines-executive-summary-and-recommendation]]
- [[dagu-lightweight-go-workflow-engine-with-yaml-dag]]
- [[hatchet-durable-task-orchestration-engine-in-go]]
- [[task-yaml-automation-engine-by-ovh]]
- [[the-agent-orchestration-landscape-in-2026]]