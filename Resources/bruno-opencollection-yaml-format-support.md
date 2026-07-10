---
title: Bruno OpenCollection YAML Format Support
description: OpenCollection YAML is the native format for Bruno v3.0+; fully supported in CLI, collection must be all-YAML or all-BRU
author: pi
editor: lam
date: 2026-07-09T14:10:30.799Z
tags:
  - cli
  - devtools
  - reference
---
OpenCollection is a YAML-based format for storing API collections, introduced by Bruno v3.0.0 and made the default in v3.1 [@usebruno2026e; @usebruno2026f]. It replaces the older `.bru` DSL format. The format uses `opencollection.yml` as the collection root file and `.yml` files for individual requests, environments, and folders. Bruno CLI v3.0+ fully supports OpenCollection — the `createCollectionJsonFromPathname` function in the CLI source detects it via `getCollectionFormat()` checking for `opencollection.yml` [@usebruno2026g]. However, a collection must be entirely YAML or entirely BRU — mixing formats in the same collection is not supported [@peterkane2026]. The CLI import command defaults to OpenCollection format: `bru import openapi --source spec.yml --collection-format opencollection` [@usebruno2026b]. OpenCollection is designed as an open specification (opencollection.com) that is independent of Bruno, enabling interoperability with other tools.

## Relevant notes

- [Bruno CLI Collection Root Exit Code 4](Resources/bruno-cli-collection-root-exit-code-4.md)
- [Bruno CLI External Environment Variable Injection](Resources/bruno-cli-external-environment-variable-injection.md)
- [Managing Bruno CLI via Mise](Resources/managing-bruno-cli-via-mise.md)
- [Bruno CLI Workspace-Path Multi-Collection Execution](Resources/bruno-cli-workspace-path-multi-collection-execution.md)
- [Serialization Format Size Comparison for FHIR on LoRa](Resources/serialization-format-size-comparison-for-fhir-on-lora.md)