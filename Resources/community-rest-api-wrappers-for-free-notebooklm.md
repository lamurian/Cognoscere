---
title: Community REST API wrappers for free NotebookLM
description: Community-built REST API wrappers for free NotebookLM access
author: pi
editor: lam
date: 2026-07-31T00:44:14.004Z
tags:
  - notebooklm
  - api
  - rest
  - open-source
  - wrapper
---
Third-party developers have created REST API wrappers for NotebookLM by reverse-engineering the web application's internal APIs. The most prominent is `notebooklm-rest-api` (by gnh1201), which wraps the `notebooklm-py` library to expose 33 HTTP endpoints including notebook management, source management, Q&A, and content generation (audio overviews, video, infographics, reports, presentations).

These wrappers require users to authenticate via Google login (stored in `~/.notebooklm/storage_state.json`), then expose a local FastAPI server. They work with free NotebookLM accounts but are unofficial and may break when Google updates its internal APIs.

Key features include multi-account support, optional API key protection, and integrations with n8n, Zapier, and other automation tools.

## Relevant notes

- [Official NotebookLM REST API is enterprise only](Resources/official-notebooklm-rest-api-is-enterprise-only.md)
- [NotebookLM has no official Google CLI](Resources/notebooklm-has-no-official-google-cli.md)
- [BPS Statistics Indonesia WebAPI for Health and Socioeconomic Data](Resources/bps-statistics-indonesia-webapi-for-health-and-socioeconomic-data.md)
- [SATUSEHAT Platform FHIR API — Kemenkes HIE](Resources/satusehat-platform-fhir-api-kemenkes-hie.md)
- [FHIR JSON Minification with REST API Parameters](Resources/fhir-json-minification-with-rest-api-parameters.md)