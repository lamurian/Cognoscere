---
title: Paseo Efficiency Best Practices
description: 'Practical steps to reduce Paseo daemon and web UI resource usage: suspend/archive idle agents, restart daemon periodically, reduce timeline size, use CLI for history review, configure process manager with memory limits.'
author: pi
editor: lam
date: 2026-07-20T23:37:45.728Z
tags:
  - paseo
  - performance
  - troubleshooting
---
## Summary

Paseo's daemon and web UI can consume significant resources over time due to accumulated agent timelines, WebSocket buffer growth, and orphaned processes. These practices reduce memory usage, prevent OOM crashes, and keep the daemon responsive.

## Practice 1: Suspend or Archive Idle Agents

Completed agents keep their runtime process resident and their timeline in daemon memory. The suspend/resume feature (v0.1.110+) closes the runtime process while keeping the agent discoverable [@grahamjenkins2026].

```bash
# Suspend an idle agent — frees runtime process, keeps agent visible
paseo agent suspend <id>

# Resume when needed (auto-resumed on next prompt)
paseo run "continue the task" --agent <id>

# Archive completed agents — removes from active list entirely
paseo workspace archive <id>

# List all agents, including archived
paseo ls -a -g
```

The daemon may support auto-suspend via idle timeout TTL in the future. For now, suspend manually after completed turns.

## Practice 2: Restart the Daemon Periodically

Memory grows over time from timeline accumulation, WebSocket buffers, and orphaned processes [@mj2026]. A periodic restart clears all accumulated state.

```bash
# Graceful restart
paseo daemon stop
paseo daemon start --web-ui --listen 0.0.0.0:6767 --hostnames ".ts.net"
```

If using PM2, configure memory-based auto-restart as a safety net:

```bash
pm2 start paseo -- daemon start --web-ui --listen 0.0.0.0:6767 \
  --max-memory-restart 2G
```

## Practice 3: Reduce Timeline Data

Large agent timelines (10k+ items) are the primary cause of slow workspace loading, high memory, and WebSocket buffer growth [@rpri2026].

- Archive agents with completed tasks instead of keeping them idle
- Avoid image-heavy tool outputs that produce 500 KB+ timeline entries
- Use the CLI (`paseo logs --tail 10`) instead of the web UI for reviewing completed task history

## Practice 4: Use CLI Over Web UI for Heavy Operations

The CLI fetches data selectively and doesn't auto-load full timelines [@rpri2026]:

```bash
# Selective fetch — no full timeline download
paseo ls -a -g --json
paseo logs <id> --tail 10
paseo attach <id>  # Stream live output (avoids timeline fetch)

# Remote via relay — no LAN congestion
export PASEO_HOST='https://app.paseo.sh/#offer=eyJ...'
paseo logs <id>
```

## Practice 5: Monitor Daemon Health

The daemon logs runtime metrics every 30 seconds. Watch for warning signs:

```bash
# Check daemon logs for resource metrics
grep ws_runtime_metrics ~/.paseo/daemon.log | tail -5

# Key metrics to watch in daemon.log
# - eventLoopDelay: p99 indicating main loop congestion
# - bufferedAmount: outbound WebSocket buffer size (>100 MB is dangerous)
# - heapUsed: daemon memory (>2 GB indicates a leak)
# - activeSockets: stale sockets accumulating
```

Warning signs that indicate a restart is needed [@ffattiger2026]:
- `activeSockets` > 3 for a single connection
- `bufferedAmount.max` > 100 MB
- `heapUsed` > 2 GB
- Repeated `ws_slow_request` entries for `fetch_agent_timeline_response`

## Practice 6: Configure Terminal Output Limits

Terminal output is the primary source of large binary frames. The daemon has built-in limits [@paseoteam2026b]:

- `MAX_TERMINAL_OUTPUT_FRAME_BYTES` = 256 KB (frame size cap)
- `MAX_CLIENT_BUFFERED_BYTES` = 4 MB (client drops frames above this)

These cannot be configured at runtime yet. To reduce terminal load:
- Avoid running build commands or large file dumps in agent terminals
- Use `tail` or `grep` to filter heavy output

## Practice 7: Use Direct Connection Over Relay

Relay connections add per-frame tweetnacl encryption + base64 cost on the daemon main loop [@paseoteam2026b]. On a LAN, use the self-hosted web UI directly for lower CPU overhead:

```bash
# Daemon on LAN — direct connection, no encryption overhead
paseo daemon start --web-ui --listen 0.0.0.0:6767
# Access via http://homelab-ip:6767/
```

For remote access, use relay pairing for security.

## Summary Table

| Practice | Impact | Effort |
|---|---|---|
| Suspend idle agents | Frees runtime memory per agent | Low |
| Archive completed agents | Frees timeline memory | Low |
| Periodic daemon restart | Clears all accumulated memory | Medium |
| PM2 max-memory-restart | Prevents OOM crashes | Medium |
| Use CLI for history | Avoids full timeline fetch | Low |
| Monitor daemon metrics | Early warning of leaks | Low |
| Direct LAN connection | Lower CPU than relay | Medium |

## Sources

- [@rpri2026] Paseo Issue #538 — large timeline performance regression
- [@ffattiger2026] Paseo Issue #2095 — WebSocket reconnect loop OOM
- [@grahamjenkins2026] Paseo Issue #2179 — suspend/resume for idle agents
- [@mj2026] Paseo Issue #1868 — memory spikes after days without shutdown
- [@paseoteam2026b] Paseo terminal performance docs

## Relevant notes

- [Paseo Pi Provider Troubleshooting Guide](Resources/paseo-pi-provider-troubleshooting-guide.md)
- [Paseo Pi Provider Failure Root Causes](Resources/paseo-pi-provider-failure-root-causes.md)
- [Paseo Relay Congestion from Historical Timeline Loading: Causes and Fixes](Resources/paseo-relay-congestion-from-historical-timeline-loading-causes-and-fixes.md)
- [Paseo Pi RPC Mode Integration](Resources/paseo-pi-rpc-mode-integration.md)
- [Paseo Daemon and Web UI Resource Consumption Patterns](Resources/paseo-daemon-and-web-ui-resource-consumption-patterns.md)