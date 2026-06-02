# Background

This is a personal wiki repository, i.e. a knowledge base, containing short notes on medical science, computer stuffs, statistics, maths, pyschology, and others. I use this repository to synchronize my notes across all devices. I'm aiming to have a clean, consistent, and minimalist look for my notes, and the best example would be a [website by Gwern Branwen](https://www.gwern.net/). Currently, this repository only runs in Obsidian, but I will integrate my note-taking workflow with #hugo sooner or later so I can have a publishable note. This repository combines the [**PARA method**](https://fortelabs.com/blog/para/) (Projects, Areas, Resources, Archives) with the [**Zettelkasten**](./Resources/zettelkasten-with-fzf-and-vim.md) note-taking system to create a powerful framework for personal knowledge management.

## What is PARA?

The PARA method, developed by Tiago Forte, categorizes information into four distinct areas:

- **Projects**: Active tasks with specific goals and deadlines.
- **Areas**: Ongoing responsibilities in various aspects of life.
- **Resources**: Useful materials, references, and knowledge that support your projects.
- **Archives**: Inactive items that can be revisited for insights or future use.

## What is Zettelkasten?

Zettelkasten is a note-taking technique that emphasizes linking ideas and notes to foster connections and deeper understanding. By creating atomic notes and interlinking them, you build a dynamic web of knowledge that evolves over time.

## Why Combine Them?

Integrating PARA with Zettelkasten allows for structured organization while maintaining flexibility. This approach not only enhances your ability to manage ongoing projects but also fosters creative thinking and knowledge retention, making it easier to retrieve and connect information when you need it.

## Search Stack Infrastructure

This repo includes a Docker Compose stack (`docker-compose.yml`) that powers the AI agent tools:

- **SearXNG** — privacy-respecting metasearch engine, aggregates results from ~240 search services.
- **Obscura** — lightweight Rust-based headless browser (V8 JS engine) for rendering and scraping web pages.

### Resource consumption

Measured on this machine (38.92 GiB RAM, idle system):

| Service | Idle CPU | Load CPU | Idle RAM | Peak RAM | PIDs (idle) | PIDs (load) |
|---|---|---|---|---|---|---|
| SearXNG | ~0% | ~0% | ~108 MiB | ~109 MiB | 15 | 15 |
| Obscura | ~6% | ~71% | ~31 MiB | ~159 MiB | 9 | 68 |

SearXNG is async Python and stays flat under concurrent requests. Obscura creates a full V8 isolate per fetch, so CPU and memory spike when rendering pages.

### Minimum hardware recommendation

| Resource | Minimum | Comfortable |
|---|---|---|
| **vCPU** | 1 core | 2 cores |
| **RAM** | 1 GB | 2 GB |
| **Swap** | 512 MiB | 1 GB |

A 0.5 vCPU / 0.5 GB RAM instance (e.g. free-tier micro VPS) will OOM under any concurrent fetch because obscura alone can spike to ~160 MiB. A $5-7/month VPS (1 vCPU, 1-2 GB RAM) runs this stack comfortably.

### Quick commands

```bash
docker compose up -d        # start the stack
docker compose down         # stop
docker compose logs -f      # follow logs
docker stats                # live resource monitor
docker stats obscura searxng --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```
