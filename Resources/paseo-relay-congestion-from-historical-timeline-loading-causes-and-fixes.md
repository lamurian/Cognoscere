---
title: 'Paseo Relay Congestion from Historical Timeline Loading: Causes and Fixes'
description: Opening projects in app.paseo.sh triggers full timeline fetch for completed agents over relay. Large payloads (base64 images, terminal output) saturate daemon upload bandwidth causing congestion. Direct LAN or CLI are fixes.
author: pi
editor: lam
date: 2026-07-20T22:49:38.423Z
tags:
  - paseo
  - network
  - performance
  - troubleshooting
---
## Summary

When opening a project in `app.paseo.sh`, the client fetches the full agent directory and timelines for all completed agents. These timeline payloads can reach 12+ MB per agent (17+ MB on-wire after E2EE base64 inflation), sent over the relay through the daemon's internet connection. This saturates the daemon's upload bandwidth, causing bufferbloat and network congestion. Three known GitHub issues document this problem and its variants.

## Root Cause

Three compounding problems:

**1. Full timeline hydration on reconnect.** When the web app connects or opens a project, it triggers `hydrateTimelineFromProvider()` for ALL agents, including completed ones with thousands of timeline items. Each item contains tool calls, tool outputs, terminal output, file diffs, and thoughts — all serialized and sent over the relay WebSocket [@rpri2026].

**2. No byte-bounded pagination.** Timeline fetches are bounded by item count (default 200 items, `TIMELINE_FETCH_PAGE_SIZE = 100`), not byte size. A single tool call with an inline base64 image can be ~600 KB. With 200 such items, a timeline page reaches 12.2 MB (17.1 MB on-wire after E2EE XSalsa20-Poly1305 base64 encoding, which inflates payloads by 4/3). This exceeds the relay's default 10 MB message cap, causing disconnect loops [@muzhi2026].

**3. No backpressure.** The terminal binary streaming path has no flow control. On slow connections (relay), high-output terminal commands cause unbounded memory growth as WebSocket frames accumulate unsent. The `bufferedAmount` property is never checked [@shaun2026].

## Traffic Flow

```
app.paseo.sh → relay.paseo.sh:443 → daemon's outbound WebSocket
                                    ↓
                              daemon uploads timeline data
                              to relay over internet
                                    ↓
                              upload saturates homelab's
                              internet upload bandwidth
                                    ↓
                              router buffer fills (bufferbloat)
                                    ↓
                              all LAN traffic congested
```

The daemon's upload to the relay IS the bottleneck. Historical timeline data goes through the homelab's internet connection (typically 10-50 Mbps upload). A single 12 MB timeline page takes 2-10 seconds to upload at these speeds, saturating the pipe.

## Immediate Fixes

### Fix 1: Use self-hosted web UI on LAN (recommended)

Switch from `app.paseo.sh` to the daemon's self-hosted web UI on the LAN. Traffic stays local — no relay, no internet bottleneck, no message cap.

```bash
# On daemon machine, enable web UI
paseo daemon start --web-ui --listen 0.0.0.0:6767
```

Open `http://homelab-ip:6767/` in desktop browser. Timeline data flows directly over LAN at 100+ Mbps. No bufferbloat from internet upload saturation. The WebSocket head-of-line blocking from the previous note still applies, but LAN bandwidth is orders of magnitude larger than internet upload.

### Fix 2: Clean up old completed agents

Reduce the data the web app needs to sync on connect. Archive or stop agents with massive timelines.

```bash
paseo ls -a -g               # List ALL agents across directories
paseo workspace archive <id> # Archive completed workspaces
```

Fewer agents = less timeline data to fetch on connect.

### Fix 3: Use CLI for historical review

Instead of the web app, use the CLI for reviewing completed task logs. It fetches selectively, not the full timeline.

```bash
paseo ls -a -g --json           # List completed agents
paseo logs <id> --tail 10       # Last 10 entries only
paseo logs <id> --filter tools  # Only tool calls
paseo attach <id>               # Stream live output
```

### Fix 4: Router QoS

Limit the daemon's upload bandwidth on your router to ~80% of your connection's upload capacity. This prevents bufferbloat when the daemon sends large data.

### Fix 5: Clear browser site data for app.paseo.sh

On subsequent visits, `app.paseo.sh` may try to re-sync stale agent directory state. Clear the site's localStorage/cache and re-add the host.

## Comparison of Options

| Approach | Congestion | Encryption | Setup |
|---|---|---|---|
| Self-hosted web UI (LAN direct) | None (gigabit LAN) | None (LAN only) | `--web-ui` flag |
| `app.paseo.sh` via relay | Upload-saturating (slow internet) | E2EE (NaCl box) | Zero setup |
| CLI via relay | Minimal (selective fetch) | E2EE | `--host $OFFER_URL` |
| CLI on daemon machine | None (localhost) | None (UDS) | SSH into homelab |

## Sources

- [@rpri2026] Paseo GitHub Issue #538 — large timeline performance regression
- [@muzhi2026] Paseo GitHub Issue #2220 — timeline fetch exceeds relay message cap
- [@shaun2026] Paseo GitHub Issue #450 — terminal streaming no backpressure

## Relevant notes

- [Paseo Client Connection Methods: Relay vs Direct and Congestion Impact](Resources/paseo-client-connection-methods-relay-vs-direct-and-congestion-impact.md)
- [Paseo Daemon Network I/O Patterns and Congestion](Resources/paseo-daemon-network-i-o-patterns-and-congestion.md)
- [Paseo Relay Pairing: CLI and Web App Workflow](Resources/paseo-relay-pairing-cli-and-web-app-workflow.md)
- [Paseo Pi Provider Troubleshooting Guide](Resources/paseo-pi-provider-troubleshooting-guide.md)
- [Paseo Pi Provider Failure Root Causes](Resources/paseo-pi-provider-failure-root-causes.md)