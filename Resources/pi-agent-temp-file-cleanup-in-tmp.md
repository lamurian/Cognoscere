---
title: Pi Agent Temp File Cleanup in /tmp
description: How pi sandbox Unix domain sockets (pi-sadbox-socks*, pi-sandbox-http*) accumulate in /tmp and how to clean them up
author: pi
editor: lam
date: 2026-07-21T00:05:42.538Z
tags:
  - pi-agent
  - performance
  - sandbox
  - optimization
  - maintenance
---

## Summary

Pi's sandbox extension creates Unix domain socket files in `/tmp` for IPC with isolated execution environments. Two socket types exist:

- **`pi-sadbox-socks*`** — general-purpose Unix domain sockets for sandbox subprocess management
- **`pi-sandbox-http*`** — HTTP-over-Unix-domain-socket channels created by `@anthropic-ai/sandbox-runtime` for HTTP protocol IPC between pi and the sandboxed execution environment

Both are created per sandbox session and persist after the agent session ends if cleanup is not properly handled. Over time they accumulate to thousands of files, consuming gigabytes of storage.

## Origin of the Files

The sandbox extension overrides the built-in `bash` tool with bubblewrap (Linux) or sandbox-exec (macOS) isolation via `@anthropic-ai/sandbox-runtime` [Sandboxing and Execution Isolation in Pi Agent](Resources/sandboxing-and-execution-isolation-in-pi-agent.md). The library creates Unix domain sockets for communication between the main pi process and the sandboxed execution environment. `pi-sandbox-http*` sockets specifically serve the HTTP protocol channel, while `pi-sadbox-socks*` handles general subprocess IPC.

Each new sandbox session creates a fresh pair of socket files in `/tmp`. The sandbox extension calls `SandboxManager.reset()` in `session_shutdown` for cleanup, and the sockets are also cleaned up when quitting pi or when starting a new session via `/new`.

Additionally, pi may create other temp files in `/tmp` including session artifacts, cached tool outputs, and temporary workspace files. These all share the `pi-*` prefix pattern.

## Why They Accumulate

Several factors cause accumulation:
- Agent sessions that terminate abnormally (SIGKILL, crash, network disconnect) skip the cleanup sequence in `session_shutdown`, leaving the `SandboxManager.reset()` call unexecuted
- The sandbox subprocess may not trigger cleanup when the parent process exits suddenly
- Each new pi session in a new terminal creates fresh sandbox sockets without removing old ones
- Normal session lifecycle events (`/new`, quit) do trigger cleanup, but only when they complete gracefully
- No built-in temp file TTL or expiration mechanism exists

## Expected Cleanup Behavior

When pi exits cleanly or `/new` is used, the sandbox extension's `session_shutdown` hook calls `SandboxManager.reset()`, which tears down the sandbox and removes the socket files. Accumulation only happens when sessions exit abnormally.

## Cleanup Strategies

### 1. Manual Cleanup (Immediate Fix)

```bash
# List all pi temp files sorted by modification time (oldest first)
ls -lt /tmp/pi-* 2>/dev/null

# Count and check disk usage
du -sh /tmp/pi-* 2>/dev/null
ls /tmp/pi-* 2>/dev/null | wc -l

# Remove all pi temp files (safe only if no pi sessions are running)
rm -f /tmp/pi-* 2>/dev/null

# More targeted: remove only socket files
find /tmp -maxdepth 1 -name 'pi-sadbox-socks*' -o -name 'pi-sandbox-http*' -delete
```

### 2. Systemd-tmpfiles (Automatic Cleanup)

Create a configuration file at `/etc/tmpfiles.d/pi-agent.conf`:

```
# Clean pi temp files older than 1 hour
d /tmp 0755 root root 1h
```

Or more specifically for pi files:

```
# Type, path, mode, uid, gid, age, cleanup
d /tmp/pi-* 0755 root root 1h
```

### 3. tmpreaper (Scheduled Cleanup)

```bash
# Install
sudo apt install tmpreaper

# Configure (edit /etc/tmpreaper.conf)
# Set TMPREPER_TIME to 1h for aggressive cleanup
# Add to /etc/cron.d/tmpreaper

# Or run manually
sudo tmpreaper --protect '*.pid' 1h /tmp/
```

### 4. Extension-Based Cleanup (Recommended)

Create a cleanup extension in `~/.pi/agent/extensions/tmp-cleanup.ts` that hooks into `session_shutdown`:

```typescript
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { execSync } from "node:child_process";

export default function (pi: ExtensionAPI) {
  pi.on("session_shutdown", async () => {
    execSync(
      "find /tmp -maxdepth 1 \\( -name 'pi-sadbox-socks*' -o -name 'pi-sandbox-http*' -o -name 'pi-*' \\) -mmin +60 -delete 2>/dev/null",
      { timeout: 5000 },
    );
  });
}
```

This runs cleanup on every graceful session shutdown, removing only files older than 60 minutes.

## Best Practices

- Run `rm -f /tmp/pi-*` as a cron job if you find accumulation is heavy
- Use the extension-based approach for per-session cleanup
- Set up systemd-tmpfiles for system-wide automated rotation
- When investigating, check `ls -lt /tmp/pi-* | head` to see which are from running vs dead sessions
- Avoid deleting temp files while pi is actively running — sockets in use will cause failures
- Normal cleanup happens on graceful `session_shutdown` (quit, `/new`) — only crash-exits leave orphans

## Sources

[Sandboxing and Execution Isolation in Pi Agent](Resources/sandboxing-and-execution-isolation-in-pi-agent.md)
[Session Lifecycle Guards in Pi Agent](Resources/session-lifecycle-guards-in-pi-agent.md)
[Approaches to Guardrail Design in Pi Agent for LLM-Aided Software Engineering](Resources/approaches-to-guardrail-design-in-pi-agent-for-llm-aided-software-engineering.md)