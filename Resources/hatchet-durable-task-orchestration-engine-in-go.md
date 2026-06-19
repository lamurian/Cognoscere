---
title: 'Hatchet: Durable Task Orchestration Engine in Go'
description: Hatchet is a Go-based durable task orchestration engine, SDK-first with multi-language support, designed for high-throughput production services — not YAML DAG authoring.
author: pi
editor: lam
date: 2026-06-17T11:08:36.039Z
tags:
  - workflow
  - orchestration
  - open-source
  - tools
source: https://github.com/hatchet-dev/hatchet
---
## Summary

Hatchet is a Go-based orchestration engine for background tasks, AI agents, and durable workflows at scale. Unlike the other tools, Hatchet is SDK-first — workflows are defined in Python, TypeScript, Go, or Ruby code using Hatchet's client libraries, not in YAML. It uses PostgreSQL as a durability layer for both task state and observability, and targets high-throughput production deployments (tested at 10k tasks/second) [@hatchet2026].

## Key Strengths

- **Durable execution model.** Tasks survive worker crashes and can recover intermediate state automatically — a stronger guarantee than at-least-once engines like Dagu or Tork.
- **High throughput.** Load-tested at 10k tasks/second with fair scheduling, priority queues, rate limiting, and dynamic concurrency controls — suitable for high-volume production services.
- **Multi-language SDKs.** First-class support for Python, TypeScript, Go, and Ruby, with auto-generated clients. Teams can write workflows in their preferred language.
- **Comprehensive observability.** Real-time Web UI with alerting, monitoring, logging, OpenTelemetry (built-in collector), and Prometheus metrics — all integrated into the platform.
- **AI agent orchestration.** Native support for durable AI agent workflows with pause/resume, human-in-the-loop, and multi-agent coordination, positioning Hatchet as an agent orchestration platform.
- **Multi-tenant by default.** Users, roles, and tenant isolation built into the core — suitable for platform teams serving multiple engineering groups.

## Key Limitations

- **Not YAML-first.** Workflows are defined in code using SDKs, not in declarative YAML. There is no `workflow.yaml` file to version control — workflows live in application code. This is the opposite of Kestra's and n8n's declarative approach.
- **Complex infrastructure.** Requires PostgreSQL, a message broker, the Hatchet engine, and frontend services. Self-hosting involves multiple containers and is not single-binary.
- **Frontend-heavy platform.** The Web UI is a core component, not optional. Hatchet is designed as a platform with observability dashboards, not a headless CLI tool.
- **Not lightweight.** The full platform includes a React frontend, gRPC APIs, worker processes, and OpenTelemetry infrastructure. Memory footprint and deployment complexity are significantly higher than Dagu or Tork.
- **Overkill for simple DAGs.** If you need to run a chain of shell commands as a YAML-defined DAG, Hatchet's durable execution, multi-tenancy, and SDK complexity are unnecessary overhead.

## Sources

- [@hatchet2026] Hatchet GitHub repository and documentation
- [@sadeghi2025] State of Open Source Workflow Orchestration Systems 2025

## Relevant notes

- [Lightweight Go Workflow Engines: Executive Summary and Recommendation](lightweight-go-workflow-engines-executive-summary-and-recommendation.md)
- [Dagu: Lightweight Go Workflow Engine with YAML DAG](dagu-lightweight-go-workflow-engine-with-yaml-dag.md)
- [Tork: Distributed Go Workflow Engine with YAML Jobs](tork-distributed-go-workflow-engine-with-yaml-jobs.md)
- [µTask: YAML Automation Engine by OVH](task-yaml-automation-engine-by-ovh.md)
- [Paseo: Cross-Device Coding Agent Orchestration — Executive Summary](paseo-cross-device-coding-agent-orchestration-executive-summary.md)