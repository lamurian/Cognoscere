---
author: pi
date: 2026-06-01T02:20:02.339Z
editor: lam
title: LLM-powered auto-linking for Zettelkasten notes
tags:
  - note-taking
  - agent
  - pi
  - embedding
  - search
  - skills
---

## Problem

Newly created notes in a Zettelkasten system need to be linked to related existing notes to build a meaningful knowledge network. Manual linking is effortful and inconsistent. Keyword-based approaches (BM25) miss synonym relationships and conceptual parallels.

## Solution

A pi agent skill (`/skill:auto-link`) that runs automatically after note creation, using the LLM's semantic understanding to find and append `[[wikilinks]]` to related notes.

## How it works

1. **Candidate retrieval** — The agent extracts 3–5 key concepts from the new note and runs `search_para_docs` (BM25) for each, gathering candidate documents from the DuckDB index.
2. **LLM-powered semantic evaluation** — For each candidate, the LLM evaluates genuine semantic relatedness: conceptual overlap, complementary angles, sibling topics, and indirect connections that keyword search would miss.
3. **Link selection** — The top 3–7 semantically strongest candidates are selected.
4. **Content appending** — A `## Relevant notes` section with `[[wikilinks]]` is appended to the note via `update_para_doc`.

## Why LLM over SBERT embeddings?

Both approaches capture semantic meaning. The LLM approach:
- Requires no additional infrastructure (no Python packages, no embedding index, no periodic re-indexing)
- Uses the model that's already running for the pi agent
- Benefits from the model's broad world knowledge (it can connect concepts that require understanding of domain relationships, not just text similarity)
- Is inherently explainable — the agent can tell you *why* two notes are related

## Integration points

| Skill | When auto-link runs |
|---|---|
| `knowledge` | After `create_para_doc` in step 3 (new document from web research) |
| `summarize-link` | After `create_para_doc` in step 5 (new summary from URL) |
| Manual | Via `/skill:auto-link` for notes created outside pi (e.g., via `zk` script) |

## Related notes

- [Conceptual overview of linking Zettelkasten notes in command line](../Projects/conceptual-overview-of-linking-Zettelkasten-notes-in-command-line.md)
- [Read Zettelkasten link using Python](../Resources/read-zettelkasten-link-using-python.md)
- [Okapi BM25 and its Variants](../Resources/okapi-bm25-and-its-variants.md)
- [Measuring semantic similarity of contexts](../Resources/measuring-semantic-similarity-of-contexts.md)
