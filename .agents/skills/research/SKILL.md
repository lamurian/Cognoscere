---
name: research
description: Iterative academic research on a topic using SearXNG tier 1 (scientific_publications), WHY/HOW decomposition, hypothesis-driven evidence gathering, and synthesis into linked atomic notes with executive summary and known gaps.
---

# Research Skill

Triggered by "research about {topic}" or "/skill:research {question}".

## Workflow

### 1. Core question formulation

Parse the user's topic into a clear, focused research question. If the topic is vague, use `/skill:brainstorm` first to clarify.

Examples:
- "research about dopamine and motivation" → "How does dopamine signaling in the mesolimbic pathway modulate motivation and reward-seeking behavior?"
- "research about sleep and memory consolidation" → "What are the neural mechanisms by which sleep facilitates memory consolidation?"

### 2. Decompose into WHY/HOW sub-questions

Break the core question into 3–5 sub-questions. Each sub-question must start with **WHY** or **HOW**.

Guidelines:
- Each sub-question should target a distinct mechanism, pathway, or claim
- Together they should cover the full scope of the core question
- Label them SQ1, SQ2, SQ3, ...

Example for "How does dopamine modulate motivation?":
- SQ1 (HOW): How does dopamine release in the nucleus accumbens encode reward prediction error?
- SQ2 (WHY): Why does dopamine depletion reduce effort expenditure in motivated behavior?
- SQ3 (HOW): How do tonic vs phasic dopamine firing patterns differentially affect motivation?
- SQ4 (WHY): Why do some dopamine antagonists fail to reduce motivation despite blocking receptors?

### 3. For each sub-question: hypothesize, search, collect evidence

Process each sub-question one at a time.

#### 3a. Hypothesize

Propose a preliminary answer. State it as a falsifiable hypothesis.

Format:
```
SQ1: How does dopamine in the nucleus accumbens encode reward prediction error?
Hypothesis: Dopamine neurons signal the difference between expected and actual reward, with positive prediction error causing phasic bursts and negative prediction error causing dips.
```

#### 3b. Search tier 1

Run `web_search` with **tier=1** (SearXNG `scientific_publications` category) using the sub-question as query.

```
web_search(query: "<sub-question text>", tier: 1)
```

If results are thin, run a second search with alternative phrasing or key terms extracted from the sub-question.

#### 3c. Fetch and extract evidence

For each promising result, use `fetch_url` to retrieve the full content (PDF or HTML).

Read the content. Extract:
- **Core finding** — What does the paper claim?
- **Evidence type** — Experimental data, meta-analysis, theoretical framework, review?
- **Confidence markers** — Sample size, effect size, statistical significance, replication status
- **Limitations** — The paper's own stated caveats

#### 3d. Update hypothesis

Refine the hypothesis based on the evidence. Note whether evidence:
- **Supports** — Hypothesis is consistent with findings
- **Contradicts** — Evidence conflicts with hypothesis
- **Nuances** — Evidence adds complexity (e.g., "it depends on X")
- **Gap** — No direct evidence found

#### 3e. Check for conflicting evidence

For each sub-question, also search for conflicting or alternative positions.

```
web_search(query: "<sub-question> conflicting evidence OR alternative theory", tier: 1)
```

If found, note the disagreement. If not found, state "no conflicting evidence found in this search round."

### 4. Completion criteria check (after each round)

A research cycle is complete when **all** five criteria are met:

| # | Criterion | Check |
|---|---|---|
| 1 | **Decomposition done** | Core question broken into 3–5 WHY/HOW sub-questions |
| 2 | **Each sub-question has ≥1 academic source** | Every SQ has at least one SearXNG tier 1 result that directly addresses it |
| 3 | **Evidence covers both sides** | For each SQ, explicitly checked for confirming AND conflicting evidence. If only one side exists, note that as a gap |
| 4 | **Self-confidence score assigned per SQ** | Score each sub-question: **high** (multiple consistent peer-reviewed sources), **moderate** (one source or indirect), **low** (speculative / no direct sources) |
| 5 | **≤ 5 search rounds** | Hard cap. If criteria 1–4 not met after 5 rounds, produce best-effort synthesis with a "gaps and limitations" section |

If criteria are not met and rounds < 5, go back to step 3 with refined queries.

### 5. Synthesize findings

Across all sub-questions, integrate the evidence into a coherent picture.

- Identify which claims are **well-supported** (high confidence, multiple sources)
- Identify which claims are **tentative** (moderate/low confidence, single source)
- Identify **cross-cutting themes** — patterns that appear across multiple sub-questions
- Identify **contradictions** — sub-questions where evidence conflicts

### 6. Create atomic notes

Create one atomic note per **key idea** discovered during research.

Rules:
- Each note holds exactly one key idea
- Max 4 paragraphs or two heading sections
- Use [[wikilink]] to cross-reference other notes in the set
- Always run `list_para_tags` first. Pick existing tags. Only create new tags when none fit.
- Use `batch_create_para_docs` to create all atomic notes in one call. This enables auto-linking.
- Default area: `Resources` (general reference). Use `Areas` if it relates to an ongoing life responsibility.

Naming convention: `research-{short-topic}-{idea-slug}.md`

### 7. Create executive summary

Create one executive summary note that links to all atomic notes. This note lives in the same area as the atomic notes.

Content structure:

```markdown
## Executive Summary

[A concise 2–3 paragraph overview of the research findings, synthesising across all sub-questions]

## Key Findings

- **[Idea 1]** — [[wikilink to note 1]]
- **[Idea 2]** — [[wikilink to note 2]]
- **[Idea 3]** — [[wikilink to note 3]]

## Confidence Assessment

| Sub-question | Confidence | Rationale |
|---|---|---|
| SQ1: ... | High/Moderate/Low | Brief reasoning |
| SQ2: ... | High/Moderate/Low | Brief reasoning |

## Known Gaps

Open issues from the literature and things this research did not resolve:

- [Gap 1 — specific limitation from a cited paper]
- [Gap 2 — conflicting evidence that could not be resolved]
- [Gap 3 — sub-question where no direct source was found]
- [Gap 4 — question that arose during research but was not answered]
```

Include the executive summary in the same `batch_create_para_docs` call as the atomic notes so it gets auto-linked to them.

Naming convention: `research-{short-topic}-executive-summary.md`

### 8. Auto-link to existing notes

After creation, run `/skill:auto-link` to find semantically related notes outside the current research set and append [[wikilinks]].

### 9. Confirm with the user

Report:
- Number of atomic notes created + their paths
- Executive summary path
- Overall confidence level
- Key known gaps
- Offer to refine any note or explore deeper on specific gaps

## Completion criteria reference card

Keep this in mind during every search round:

```
1. Decomposition done?
2. Each SQ has ≥1 academic source?
3. Both confirming AND conflicting evidence checked per SQ?
4. Self-confidence score assigned per SQ?
5. Rounds ≤ 5?
```

If all yes → synthesize + create notes.
If any no and rounds < 5 → refine and search again.
If any no and rounds ≥ 5 → best-effort with "gaps and limitations".

## Self-confidence rubric

| Score | Definition |
|---|---|
| **High** | ≥2 peer-reviewed sources from reputable journals, consistent findings, direct relevance to sub-question |
| **Moderate** | 1 peer-reviewed source or indirect evidence (e.g., review mentions the mechanism but isn't the primary study), or preprints |
| **Low** | No direct academic source found; answer is inferred, speculative, or based on non-academic sources |

## Tools used

- `web_search(tier: 1)` — SearXNG `scientific_publications` category for academic search
- `fetch_url(url)` — fetch academic papers (PDF via pdftotext, HTML via Obscura)
- `list_para_tags` — list existing tags before creating notes
- `batch_create_para_docs(documents)` — create all atomic notes + executive summary with auto-linking
- `/skill:brainstorm` — clarify vague topics before research
- `/skill:auto-link` — link new notes to existing knowledge
