---
title: Bruno Workspace Environment File Formats
description: Bruno workspaces use .yml for global envs (--global-env) and .bru for collection envs (--env)
author: pi
editor: lam
date: 2026-07-09T14:10:39.332Z
tags:
  - cli
  - devtools
  - reference
---
Bruno distinguishes between two kinds of environments in a workspace. Collection-level envs (used with `--env`) live in `environments/` inside the collection root and use `.bru` format. Global/workspace-level envs (used with `--global-env`) live in `environments/` at the workspace root and use `.yml` format [@usebruno2026b; @usebruno2026c]. The `--global-env` flag references an environment by name from the workspace's `environments/` directory, looking for `<name>.yml`. The `--env` flag references a collection-level environment, looking for `<name>.bru` in the collection's `environments/`. Both can be combined: `bru run --env Local --global-env Production` — collection envs override global envs of the same name. The `--workspace-path` flag specifies the path from the collection root to the workspace root, enabling Bruno to resolve global environments when the collection is not at the workspace root [@usebruno2026b].

## Relevant notes

- [Bruno CLI Workspace-Path Multi-Collection Execution](Resources/bruno-cli-workspace-path-multi-collection-execution.md)
- [Bruno CLI External Environment Variable Injection](Resources/bruno-cli-external-environment-variable-injection.md)
- [Bruno OpenCollection YAML Format Support](Resources/bruno-opencollection-yaml-format-support.md)
- [Bruno CLI Collection Root Exit Code 4](Resources/bruno-cli-collection-root-exit-code-4.md)
- [Managing Bruno CLI via Mise](Resources/managing-bruno-cli-via-mise.md)