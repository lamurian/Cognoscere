---
title: Deploying GGUF Models via Go REST API
description: 'Options for serving a GGUF model behind a Go API service: llama.cpp server, go-llama bindings, and gollama instance manager'
author: pi
editor: lam
date: 2026-07-21T23:38:23.042Z
tags:
  - go
  - deployment
  - api
  - llama.cpp
  - gguf
  - inference
---
## Summary

Three approaches exist for deploying a GGUF model behind a Go API service, ranging from zero Go code to full Go-native integration. All use llama.cpp as the underlying inference engine [@gerganov2025].

**Approach 1: llama.cpp built-in server + Go proxy (recommended for your use case).** llama.cpp includes a production-ready HTTP server (`llama-server`) that exposes an OpenAI-compatible API at `/v1/chat/completions` and `/v1/completions` [@gerganov2025]. Your Go service acts as a thin proxy: receive requests, forward to llama-server, stream responses back. This is the simplest path — no CGo, no compilation complexity. Example: `llama-server -m model-q4_k_m.gguf --host 0.0.0.0 --port 8081`. The Go API service handles routing, authentication, rate limiting, and SNOMED CT-specific pre/post-processing while delegating inference to llama-server running as a subprocess or sidecar.

**Approach 2: go-llama bindings (full Go integration).** MutableLogic's `go-llama` provides native Go bindings to llama.cpp via CGo [@mutablelogic2025]. It includes an HTTP server with REST endpoints for chat, completion, embeddings, and model management. Features: model pull from HuggingFace, streaming token generation, GPU support (CUDA/Vulkan/Metal), Docker images for CPU/CUDA/Vulkan. The Go API service can import `go-llama` directly and control model loading/unloading programmatically. Downside: CGo compilation complexity, larger binary size.

**Approach 3: gollama (Go instance manager).** Korai's `gollama` is a single Go binary that downloads GGUF models from HuggingFace, manages llama.cpp instances, and exposes an OpenAI-compatible API [@korai2025]. Features: auto-launch models on demand, multi-instance on separate ports, idle TTL auto-stop, web UI, streaming chat, reasoning display. Auto-routes by model name — point any OpenAI SDK at `http://host:9080/v1/chat/completions`. Best for multi-model scenarios but adds abstraction over the raw llama.cpp server.

**Recommended architecture for your single-model deployment.** Run llama-server as a subprocess managed by your Go binary. The Go service handles: (a) SNOMED CT concept extraction from model output (parse structured response), (b) ECL validation (run through ECL ANTLR grammar), (c) authentication and usage tracking, (d) request/response logging for clinical audit trails. This keeps the C/C++ inference path untouched while letting Go handle everything else. For CPU-only inference with 40GB RAM, use `--threads N` (matching core count) and `--ctx-size 4096`.

## Key Points

- Simplest: llama-server built-in HTTP API + Go proxy sidecar (no CGo)
- go-llama provides native Go bindings via CGo for full control
- gollama offers instance management with OpenAI-compatible API auto-routing
- Go service wraps llama-server: handles auth, ECL validation, audit logging
- CPU tuning: match threads to physical cores, use Q4_K_M quantization for 1-3B models
- llama-server supports streaming (SSE), continuous batching, and KV cache quantization

## Sources

- [llama.cpp: LLM inference in C/C++](https://github.com/ggml-org/llama.cpp)
- [go-llama: Go bindings for llama.cpp](https://github.com/mutablelogic/go-llama)
- [gollama: llama.cpp instance manager in Go](https://github.com/majidkorai/gollama)
- [CPU-Only Transformers Optimization](Resources/cpu-only-transformers-optimization.md)
- [Memory Management and Optimization for CPU-Only Fine-Tuning of Small Language Models](Resources/memory-management-and-optimization-for-cpu-only-fine-tuning-of-small-language-models.md)

## Relevant notes

- [Exporting a Single GGUF Model from Fine-Tuned Checkpoints](Resources/exporting-a-single-gguf-model-from-fine-tuned-checkpoints.md)
- [Scaling R and Python Polyglot Analytics to Production](Resources/scaling-r-and-python-polyglot-analytics-to-production.md)
- [Scaling R Analytics to Production](Resources/scaling-r-analytics-to-production.md)
- [Scaling Python Analytics to Production](Resources/scaling-python-analytics-to-production.md)
- [SATUSEHAT Platform FHIR API — Kemenkes HIE](Resources/satusehat-platform-fhir-api-kemenkes-hie.md)