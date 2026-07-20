---
title: Paseo Daemon and Web UI Resource Consumption Patterns
description: 'Paseo daemon and web UI CPU/memory usage breakdown: daemon memory grows with agent timelines and WebSocket buffers; web UI (React SPA) shares browser main thread with terminal rendering. Key issues: OOM from socket accumulation, idle agent memory, child process leaks.'
author: pi
editor: lam
date: 2026-07-20T23:37:20.712Z
tags:
  - paseo
  - performance
  - troubleshooting
  - reference
---
## Summary

Paseo's resource consumption has two components: the daemon process (Node.js) and the web UI (Expo/React Native Web SPA running in the browser). There are no official benchmarks, but documented issues reveal patterns. The daemon's memory grows with agent timeline sizes, WebSocket buffer accumulation, and idle agent runtime processes. The web UI consumes additional browser memory for timeline rendering, terminal state, and stream event processing.

## Daemon CPU/Memory

### Baseline

The daemon process idles at modest resource usage with no active agents or connected clients. CPU usage spikes during agent turns (provider API calls, tool executions, terminal output processing). Memory grows proportionally with agent activity and accumulated state.

### Memory growth factors

**Agent timelines** — The `InMemoryAgentTimelineStore` holds all timeline events for every active agent in daemon memory. An agent with ~10k timeline items (~870 rows) can produce timeline response pages of 12+ MB [@muzhi2026]. Multiple agents compound this.

**Idle agent processes** — Each completed agent keeps its provider runtime process resident until archived or suspended. For resource-constrained machines or users running many parallel agents, this occupies memory and process slots [@grahamjenkins2026]. The suspend/resume feature (v0.1.110+) addresses this by closing the runtime process while keeping the agent discoverable.

**WebSocket buffer accumulation** — On reconnect storms, old WebSocket sockets are not cleaned up. Outbound buffers can grow unbounded: observed metrics show `bufferedAmount.max` climbing from ~120 MB to ~402 MB, and `heapUsed` from ~830 MB to ~4.25 GB, ending in V8 OOM during `JSON.stringify` [@ffattiger2026]. Active sockets accumulate from 4 to 10 for a single logical session.

**Orphaned child processes** — The daemon can leave orphaned CLI provider processes running after tasks complete, causing a slow process and memory leak over days of uptime [@mj2026].

**Large agent stream messages** — A single 250 KB diff payload in an `agent_stream` message causes measurable main-loop delay (~100 ms) due to daemon serialization and app-side parse/render on the shared browser main thread [@paseoteam2026b].

### Terminal output pipeline

The terminal pipeline has specific resource limits:
- `MAX_TERMINAL_OUTPUT_FRAME_BYTES` = 256 KB per frame
- `MAX_CLIENT_BUFFERED_BYTES` = 4 MB (client drops frames above this)
- Coalescer throttles terminal output to ≤1 IPC message per 5 ms per terminal
- Relay-attached clients pay per-frame tweetnacl encryption + base64 on the daemon main loop

### Runtime metrics

The daemon logs `ws_runtime_metrics` every 30 seconds, showing `eventLoopDelay` (ground truth for daemon busy-ness), `bufferedAmount`, memory (rss, heapTotal, heapUsed, arrayBuffers), and socket counts.

## Web UI (Browser) CPU/Memory

The web app is an Expo/React Native Web SPA. Resource usage depends on:

- **Timeline rendering**: Loading large timelines (10k+ items) blocks the browser main thread. The `AgentStreamReducerQueue` flushes every 48ms, but hydrating 10k+ items on connect causes UI thread congestion [@rpri2026].
- **Terminal emulation**: xterm.js maintains a cell grid in memory. A full JSON cell-grid snapshot is ~200k objects across IPC.
- **Stream event processing**: Agent stream events are parsed and rendered on the main thread. Large diffs and tool outputs cause frame drops.
- **Reconnection loops**: Persistent WebSocket reconnection attempts accumulate listeners and event handlers.

## Comparison

| Component | Typical idle | Heavy load | Bottleneck |
|---|---|---|---|
| Daemon (no agents) | ~50-100 MB RSS | N/A | N/A |
| Daemon (5 agents, 18k timeline items) | ~500 MB RSS | ~4.25 GB RSS (OOM risk) | Timeline store + WebSocket buffers |
| Web UI (idle) | ~50-100 MB browser tab | ~300 MB+ with large timeline | Main thread parse/render |
| Provider subprocess (per agent) | ~100-300 MB per Claude/Codex process | Higher during turns | Provider runtime |

## Sources

- [@rpri2026] Paseo Issue #538 — large timeline performance regression
- [@muzhi2026] Paseo Issue #2220 — timeline fetch exceeds relay message cap
- [@ffattiger2026] Paseo Issue #2095 — WebSocket reconnect loop OOM
- [@grahamjenkins2026] Paseo Issue #2179 — suspend/resume for idle agents
- [@mj2026] Paseo Issue #1868 — memory spikes after days without shutdown
- [@paseoteam2026b] Paseo Docs — Terminal performance

## Relevant notes

- [Paseo Relay Pairing: CLI and Web App Workflow](Resources/paseo-relay-pairing-cli-and-web-app-workflow.md)
- [Paseo Client Connection Methods: Relay vs Direct and Congestion Impact](Resources/paseo-client-connection-methods-relay-vs-direct-and-congestion-impact.md)
- [Paseo Relay Congestion from Historical Timeline Loading: Causes and Fixes](Resources/paseo-relay-congestion-from-historical-timeline-loading-causes-and-fixes.md)
- [Paseo Daemon Network I/O Patterns and Congestion](Resources/paseo-daemon-network-i-o-patterns-and-congestion.md)
- [Paseo Architecture: Daemon-Based Cross-Device Agent Orchestration](Resources/paseo-architecture-daemon-based-cross-device-agent-orchestration.md)