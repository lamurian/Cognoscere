---
title: Official NotebookLM REST API is enterprise only
description: Official Google Cloud REST API for NotebookLM Enterprise only
author: pi
editor: lam
date: 2026-07-31T00:43:54.598Z
tags:
  - google
  - notebooklm
  - api
  - enterprise
  - google-cloud
---
Google provides an official REST API for NotebookLM through the Gemini NotebookLM Enterprise service. The API is part of Google Cloud's Discovery Engine and allows programmatic notebook management including creation, retrieval, listing, deletion, and sharing of notebooks.

The API endpoints use the pattern: `https://<ENDPOINT_LOCATION>-discoveryengine.googleapis.com/v1alpha/projects/<PROJECT_NUMBER>/locations/<LOCATION>/notebooks`. Authentication requires Google Cloud credentials via `gcloud auth print-access-token`.

This API is only available for enterprise customers with NotebookLM Enterprise licenses, not for free-tier NotebookLM users.

## Relevant notes

- [NotebookLM has no official Google CLI](Resources/notebooklm-has-no-official-google-cli.md)
- [Google Workspace Integration Approaches for AI Agents](Resources/google-workspace-integration-approaches-for-ai-agents.md)
- [IBM Cloud Free Lite — User Sentiment and Reviews](Resources/ibm-cloud-free-lite-user-sentiment-and-reviews.md)
- [Wallet Pass Token Generation: Apple Wallet PKPass and Google Wallet JWT Architecture](Resources/wallet-pass-token-generation-apple-wallet-pkpass-and-google-wallet-jwt-architecture.md)
- [Forever Free VPS — User-Friendliness Comparison and Recommendation](Resources/forever-free-vps-user-friendliness-comparison-and-recommendation.md)