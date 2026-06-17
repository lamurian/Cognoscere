---
title: 'Lightweight Go Workflow Engines: Executive Summary and Recommendation'
description: Executive summary comparing Dagu, Tork, µTask, and Hatchet — Go-based workflow engines evaluated against lightweight, headless, YAML-DAG requirements. Dagu is the recommended solution.
author: pi
editor: lam
date: 2026-06-17T11:08:36.040Z
tags:
  - executive-summary
  - workflow
  - orchestration
  - open-source
  - comparison
  - tools
source: https://github.com/dagucloud/dagu
---
## Summary

This executive summary compares four open-source, Go-based workflow engines — Dagu, Tork, µTask, and Hatchet — against the requirements: lightweight deployment, Go implementation, headless operation, and YAML-based DAG authoring similar to Kestra. Dagu is the strongest recommendation. It is the only tool that satisfies all criteria out of the box: single Go binary, zero infrastructure dependencies, declarative YAML DAG syntax with explicit `depends` fields, and a dedicated headless mode. Tork is a viable MIT-licensed alternative but requires PostgreSQL and models workflows as sequential jobs rather than arbitrary DAGs. µTask offers the richest YAML templating but targets structured business processes and lacks container isolation. Hatchet is excluded — it is SDK-first, frontend-heavy, and infrastructure-complex [@dagucloud2026; @cohen2026; @ovh2026; @hatchet2026].

## Comparison Table

| Criterion | Dagu | Tork | µTask | Hatchet |
|---|---|---|---|---|
| **Language** | Go (76.7%) | Go (99.7%) | Go (69.2%) | Go (28.1%) + TS/Python/Ruby |
| **License** | GPLv3 | MIT | BSD-3-Clause | MIT |
| **YAML DAG** | Yes — full DAG with `depends` | Partial — sequential jobs with parallel groups | Yes — graph of steps with state-qualified deps | No — SDK-defined in code |
| **Headless mode** | Yes (`DAGU_HEADLESS=true`) | Yes (CLI only) | Partial (API-first, UI bundled) | No (UI is core component) |
| **Infrastructure** | None — single binary, file-based | PostgreSQL required | PostgreSQL required | PostgreSQL + broker + multiple services |
| **Task isolation** | Shell, Docker, K8s, SSH | Docker, Podman, Shell | In-process only | Worker processes |
| **GitHub stars** | 3.5k | 807 | 1.4k | 7.4k |
| **Best for** | Lightweight YAML DAG orchestration | Containerized job workflows | Structured business process automation | High-throughput durable task execution |

## Recommendation: Dagu

Dagu is the recommended tool for the stated requirements. Here is how it satisfies each criterion:

**Lightweight.** Dagu ships as a single statically-compiled Go binary. There is no database, no message broker, no container runtime, and no language runtime to install. Workflow state, logs, and queue data are stored as local files. Installation is a one-liner: `brew install dagu` or `curl | bash`.

**Go implementation.** The core engine is Go (76.7% of the codebase, with the remainder being the web UI in TypeScript). The embedded Go API allows importing Dagu directly into Go applications as a library.

**Headless operation.** Setting `DAGU_HEADLESS=true` disables the Web UI entirely. Dagu then runs as a CLI tool (`dagu start`, `dagu start-all`, `dagu scheduler`) with REST API access for job submission and status querying. This matches the requirement for no-frontend, text-based operation.

**YAML DAG authoring.** Workflows are defined in declarative YAML with a `depends` field that mirrors Kestra's syntax. A three-step ETL pipeline with a diamond dependency pattern looks like this:

```yaml
steps:
  - id: extract
    run: ./extract.sh
  - id: transform_a
    run: ./transform_a.sh
    depends: extract
  - id: transform_b
    run: ./transform_b.sh
    depends: extract
  - id: load
    run: ./load.sh
    depends: [transform_a, transform_b]
```

This is near-identical to Kestra's YAML paradigm but without requiring a JVM, a database, or a web server.

**Kestra-like features.** Dagu supports cron scheduling with overlap control and catch-up, retry policies with backoff, lifecycle hooks (`onSuccess`, `onFailure`, `onExit`), sub-DAG composition (`dag.run`), parameterized workflows with typed inputs, secret management with log redaction, and built-in actions for HTTP, SQL, Docker, Kubernetes, and SSH.

## When to Choose Tork Instead

If the GPLv3 license is a blocker and MIT licensing is mandatory, Tork is the preferred alternative. It is 99.7% pure Go, MIT-licensed, and also uses YAML job definitions. The tradeoff is that Tork requires PostgreSQL and models tasks as sequential containers rather than arbitrary DAGs. For simple sequential or parallel job processing where DAG flexibility is not critical, Tork's MIT license and mature retry/scheduling features make it a strong choice.

## When to Choose µTask Instead

If the primary use case is structured business process automation — with human approval steps, conditional branching based on HTTP status codes, and rich Go-template expressions — µTask's mature templating engine and built-in action plugins (HTTP, SSH, email, notifications) are the best fit. The tradeoff is that µTask lacks container isolation and distributed workers.

## Sources

- [@dagucloud2026] Dagu GitHub repository
- [@cohen2026] Tork GitHub repository
- [@ovh2026] µTask GitHub repository
- [@hatchet2026] Hatchet GitHub repository
- [@sadeghi2025] State of Open Source Workflow Orchestration Systems 2025

## Relevant notes

- [[dagu-lightweight-go-workflow-engine-with-yaml-dag]]
- [[tork-distributed-go-workflow-engine-with-yaml-jobs]]
- [[hatchet-durable-task-orchestration-engine-in-go]]
- [[paseo-cross-device-coding-agent-orchestration-executive-summary]]
- [[task-yaml-automation-engine-by-ovh]]