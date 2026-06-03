---
name: roadmap
description: Orchestrates the creation of a structured learning pathway (roadmap) for any topic, from fundamentals to practical application, with atomic PARA documents and a final master roadmap document.
---

# Roadmap Skill — Learning Pathway Orchestrator

When the user asks to outline a learning pathway, roadmap, or curriculum for a certain topic, follow this workflow.

## Trigger phrases

The user may say things like:
- "Outline a learning pathway for X"
- "Create a roadmap to learn X"
- "I want to learn X, where do I start?"
- "Design a curriculum for X"
- "How do I become proficient in X?"

## Workflow overview

```
User request
    │
    ▼
Step 0: Check for existing scratchpad → resume or start fresh
    │
    ├─ Scratchpad exists → read it → continue from where we left off
    └─ No scratchpad   → proceed to Step 1
    │
    ▼
Step 1: Clarify scope (engage user)
    │
    ▼
Step 2: Formulate learning steps (Layers 1–5)
    │
    ▼
Step 3: Generate guiding questions per step
    │
    ▼
[Present Steps 2+3 to user for approval]
    │
    ▼
Step 4: Init scratchpad (record steps, questions, todo list)
    │
    ▼
Step 5: Search PARA notes + web per step
    │  (update scratchpad: mark search as done, record results)
    │
    ▼
Step 6: Create atomic PARA docs with batch_create_para_docs
    │  (batch auto-linking included)
    │
    ▼
Step 7: Create master roadmap in Projects/roadmap-*.md
    │
    ▼
Step 8: Delete scratchpad (cleanup)
    │
    ▼
Confirm with user, present the full roadmap
```

---

## Step 0 — Check for existing scratchpad

Before starting work, check whether a scratchpad for this topic already exists in the knowledge base. This allows resuming interrupted roadmap creation.

```
search_para_docs(query: "<topic from user>", tags: ["scratchpad", "roadmap"])
```

### If a scratchpad is found

1. `read` the scratchpad file (path from search results)
2. Parse the JSON body to extract current state:
   - `steps` — which steps are `done: true` and which remain
   - `questions` — guiding questions already generated
   - `searchResults` — materials already collected
   - `milestones` — milestones already defined
3. Inform the user: "Resuming roadmap for [topic] — [X/Y] steps completed. Ready to continue with step [next]."
4. **Skip to the appropriate step below** based on what's done:
   - If steps defined but not searched → go to Step 5 (search)
   - If searched but docs not created → go to Step 6 (batch create)
   - If docs created but no master roadmap → go to Step 7 (master doc)
   - If everything done → go to Step 8 (cleanup)

### If no scratchpad is found

Proceed to **Step 1** below to start fresh.

---

## Step 1 — Clarify scope

Engage the user to define:

| Question | Purpose |
|----------|---------|
| "What is the exact topic you want a roadmap for?" | Nail down the subject |
| "Any specific perspective or school of thought?" | e.g. Bayesian vs frequentist, functional vs OOP, etc. |
| "What is your current level?" | beginner, intermediate, advanced |
| "What is your goal?" | job-ready, hobby, academic research, certification |
| "Do you have a time constraint?" | 3 months, 6 months, 1 year |

If the user's request is already detailed (e.g., "I want to learn statistics from both bayesian and frequentist perspective"), you may skip some questions but **always confirm the scope** before proceeding.

---

## Step 2 — Formulate the learning steps

Decompose the topic into a **progression** from fundamental to practical. Follow this structure:

### Layer 1 — Foundations (Fundamental prerequisites)
- Prerequisite math, theory, or background knowledge
- Core concepts that everything else builds on

### Layer 2 — Core theory / Conceptual understanding
- The main theoretical body of the subject
- Key models, frameworks, or paradigms

### Layer 3 — Intermediate applied skills
- Practical techniques, tools, methods
- Hands-on exercises and applications

### Layer 4 — Advanced / Specialised topics
- Cutting-edge or niche sub-areas
- Integration of multiple concepts

### Layer 5 — Real-world application / Capstone
- Portfolio projects, case studies, or research
- Synthesis of everything learned

**For each layer**, produce 2–5 concrete steps. Each step is one atomic skill or knowledge area.

Format the output as a structured outline and **present it to the user for approval** before proceeding to Step 3.

### Example

For "statistics from Bayesian and frequentist perspective", the outline might look like:

```
Layer 1 — Foundations
  1.1 Fundamental mathematics for statistics (calculus, probability axioms)
  1.2 Descriptive statistics and data visualisation
  1.3 Linear algebra essentials

Layer 2 — Core theory
  2.1 Frequentist inference (hypothesis testing, p-values, confidence intervals)
  2.2 Bayesian inference (priors, likelihood, posteriors, Bayes' theorem)
  2.3 Comparison: frequentist vs Bayesian philosophy

Layer 3 — Intermediate applied skills
  3.1 Regression models (linear, logistic) — both perspectives
  3.2 Bayesian computation (MCMC, PyMC, Stan)
  3.3 Frequentist ANOVA and experimental design
  3.4 Model evaluation (cross-validation, information criteria, Bayes factors)

Layer 4 — Advanced topics
  4.1 Hierarchical / multilevel models
  4.2 Non-parametric Bayesian methods
  4.3 Causal inference (frequentist and Bayesian)
  4.4 Time series analysis

Layer 5 — Capstone
  5.1 End-to-end analysis: pick a dataset, apply both perspectives
  5.2 Write a report comparing findings from both frameworks
```

---

## Step 3 — Generate guiding questions

For **each** step formulated in Step 2, generate 1–3 concrete questions that will guide the research for that step. These questions must be:

- **Answerable** — They should yield factual, findable answers
- **Scoped** — Narrow enough to fit a single atomic note
- **Actionable** — They help the learner understand what to study next

### Example

| Step | Guiding questions |
|------|------------------|
| 1.1 Fundamental mathematics | What calculus and probability concepts are prerequisites for statistics? What textbooks or courses teach these fundamentals? |
| 1.2 Descriptive statistics | What are the key descriptive statistics measures? How do frequentist and Bayesian approaches differ in describing data? |
| 2.1 Frequentist inference | How do hypothesis testing, p-values, and confidence intervals work in the frequentist framework? What are common misinterpretations? |
| 2.2 Bayesian inference | How does Bayes' theorem update beliefs? What are conjugate priors and why do they matter? |
| 3.1 Regression models | How are linear and logistic regression treated differently in frequentist vs Bayesian frameworks? |
| ... | ... |

**Append these questions to the outline** from Step 2 and present to the user for final approval before executing research and document creation.

---

## Step 4 — Initialize the scratchpad

Once the user approves the plan (steps + questions), create a scratchpad to track progress.

Use `init_scratchpad`:

```
init_scratchpad(
  name: "<topic-slug>",
  description: "Roadmap creation: <topic> — <perspective/goal>",
  steps: [
    { id: 1, title: "1.1 Fundamental mathematics for statistics", done: false, description: "Calculus, probability axioms" },
    { id: 2, title: "1.2 Descriptive statistics", done: false, description: "Measures, visualization" },
    // ... one entry per formulated step
  ],
  questions: [
    { stepId: 1, questions: ["What calculus concepts are prerequisites?", "What probability axioms are needed?"] },
    // ... per step
  ]
)
```

This creates a searchable markdown file at `Areas/_scratchpad-<topic-slug>.md` with YAML frontmatter (tags: `scratchpad`, `roadmap`, `<topic>`) and registers it in `notes.duckdb`.

The scratchpad acts as the **todo list and state store** for the entire workflow. After each major action, call `update_scratchpad` to mark steps as done and record results.

The scratchpad JSON schema:

```json
{
  "name": "<topic-slug>",
  "description": "Concise description for searchability",
  "steps": [{ "id": 1, "title": "1.1 ...", "done": false, "description": "..." }],
  "questions": [{ "stepId": 1, "questions": ["q1", "q2"] }],
  "searchResults": [{ "stepId": 1, "results": [{"title": "...", "url": "...", "note": "..."}] }],
  "milestones": [{ "id": 1, "name": "...", "stepIds": [1,2,3], "done": false, "epic": "..." }]
}
```

---

## Step 5 — Search for materials

For **each step**, in order from Layer 1 to Layer 5:

### 5a. Search existing PARA notes first

```
search_para_docs(query: "<step topic and guiding question>")
```

If a relevant note already exists, **record its path** — you will reference it in the atomic note and the master roadmap instead of recreating it.

### 5b. If no relevant note exists, search the web

```
web_search(query: "<guiding question or specific search>")
```

For each promising result, use `fetch_url` to read the full content and extract key information.

### 5c. Collect and synthesise

For each step, collect:
- What existing PARA notes cover (path + title)
- What web sources were found (URL + title + key excerpts)
- A brief synthesis (2–3 sentences) of what the learner should know at this step

### 5d. Update scratchpad after each step's search

After searching materials for a step, mark it as searched and record the results:

```
update_scratchpad(
  path: "Areas/_scratchpad-<topic-slug>.md",
  steps: [{ id: N, title: "...", done: true, description: "..." }],  // mark searched step as done
  searchResults: [
    { stepId: N, results: [
      { title: "Existing note title", url: "/Resources/existing-note.md", note: "Covers this topic already" },
      { title: "Web source title", url: "https://...", note: "Key excerpt" }
    ]}
  ]
)
```

> **Important:** Only update the step that was just completed. The `update_scratchpad` tool does a **partial merge** — it replaces the `steps` array entirely, so pass ALL steps (with the latest one marked `done: true`).

---

## Step 6 — Create atomic PARA documents with batch_create_para_docs

This is where `batch_create_para_docs` replaces the old per-document loop.

### Before calling batch_create_para_docs

**Always run `list_para_tags` first** to see all existing unique tags. Choose tags from that array; only create new tags when none of the existing ones fit the topic.

### Classification rules

| Content type | PARA category | Tags |
|---|---|---|
| Foundational theory, concepts, prerequisites | `"Resources"` | `"roadmap"`, topic tag, `"fundamental"` |
| Practical techniques, tools, exercises | `"Projects"` | `"roadmap"`, topic tag, `"practical"` |
| Comparisons, frameworks, paradigms | `"Resources"` | `"roadmap"`, topic tag, `"reference"` |
| Capstone / portfolio project ideas | `"Projects"` | `"roadmap"`, topic tag, `"capstone"` |

### Document creation standards

Follow the knowledge skill's `Document Creation Standards` (@.agents/skills/knowledge/SKILL.md section `Document Creation Standards`) for:
- Atomic principle (one idea per note, max 100 lines)
- Language (casual business English)
- Citation style (if citing external sources, use `resolve_citation` and `[@citekey]`)
- Cross-referencing (`[[wikilink]]`)
- Classification (Resources vs Areas vs Projects)
- Frontmatter (the tool auto-generates it; provide title, tags, area, description, source)

Roadmap-specific additions to the standard:
- Use `[[wikilinks]]` to reference prerequisite notes and sibling notes at the same layer
- The batch auto-link in `batch_create_para_docs` handles cross-linking between new notes automatically

### Naming convention

Use descriptive kebab-case filenames (the slug is auto-generated from the title):
- `Resources/fundamentals-of-probability-for-statistics.md`
- `Resources/bayesian-inference-core-concepts.md`
- `Projects/practical-linear-regression-frequentist-and-bayesian.md`
- `Projects/capstone-comparative-statistical-analysis.md`

### Build the batch payload

For each step that needs a **new** atomic note (where no existing PARA note already covers it), prepare:

```typescript
{
  title: "Descriptive Statistics: Frequentist and Bayesian Views",
  content: "## Summary\n\n[2-3 paragraphs synthesising the research from Step 5]\n\n## Key concepts\n\n...\n\n## Sources\n- [[existing-related-note]]\n- [Web source title](url)",
  tags: ["roadmap", "statistics", "fundamental"],
  area: "Resources",
  description: "Short summary ≤200 characters of what this note covers"
}
```

### Call batch_create_para_docs

```
batch_create_para_docs(
  documents: [
    { title: "...", content: "...", tags: [...], area: "Resources", description: "..." },
    { title: "...", content: "...", tags: [...], area: "Projects", description: "..." },
    // ... one entry per new note
  ],
  autoLink: true   // auto-links all created docs to each other
)
```

The tool:
1. Creates all markdown files on disk
2. Indexes all in `notes.duckdb` in one write session
3. Runs batch semantic auto-linking — for each new doc, it finds related docs (from the batch + existing index) via BM25 and appends `[[wikilinks]]`
4. Returns the list of created paths

**You do NOT need to call `/skill:auto-link` separately** — `batch_create_para_docs` with `autoLink: true` handles this.

### Update scratchpad after batch creation

```
update_scratchpad(
  path: "Areas/_scratchpad-<topic-slug>.md",
  steps: [/* all steps with doc-creation ones marked done */],
  milestones: [
    { id: 1, name: "Foundations of Probability and Mathematics", stepIds: [1, 2, 3], done: false, epic: "Master prerequisite math and probability concepts" },
    // ... one per milestone
  ]
)
```

**Group steps into milestones** at this point:
- Each milestone = one epic = one subskill mastery
- Group 2–5 related steps per milestone
- Milestones should be completable in 1–4 weeks
- Each milestone has a `stepIds` array referencing the step IDs

---

## Step 7 — Create the master roadmap document

After all atomic notes are created, create the **master roadmap document** in `Projects/`.

Follow the knowledge skill's `Document Creation Standards` (@.agents/skills/knowledge/SKILL.md section `Document Creation Standards`) for language and citation style.

### Naming

The filename **must** start with `roadmap-` followed by the topic slug:

```
Projects/roadmap-<topic-slug>.md
```

Example: `Projects/roadmap-mastering-statistics-from-frequentist-and-bayesian-perspective.md`

### Document structure

Use `create_para_doc` to create the master roadmap. The content must follow this template:

```markdown
# Roadmap: [Topic Name]

## Overview
[2–3 paragraph overview of the roadmap: what it covers, who it is for, what perspective/approach it takes, estimated time to complete]

## Prerequisites
- [Any assumed prior knowledge]
- [Tools or software needed]
- [Recommended mindset or commitment level]

## Milestones

### 🏁 Milestone 1: [Milestone Name — e.g. "Foundations of Probability and Mathematics"]
> **Epic:** [One-sentence description of the subskill mastered in this milestone]

**Steps:**
1. [[atomic-note-slug-1]] — Brief description of what this step covers
2. [[atomic-note-slug-2]] — Brief description
3. ...

**Guiding questions:**
- Q1: [Guiding question for self-check]
- Q2: ...

**Estimated effort:** [e.g. 2 weeks, 20 hours]
**Checkpoint:** [A simple self-assessment task, e.g. "Solve 10 probability problems", "Implement a descriptive statistics summary"]

---

### 🏁 Milestone 2: [Milestone Name]
> **Epic:** [One-sentence description]

**Steps:**
1. [[atomic-note-slug]] — ...
...

**Guiding questions:**
- Q1: ...
...

**Estimated effort:** ...
**Checkpoint:** ...

---

### 🏁 Milestone N: [Milestone Name — Capstone]
> **Epic:** [Synthesis and real-world application]

**Steps:**
1. [[capstone-note-slug]] — ...
...

**Guiding questions:**
- Q1: ...
...

**Estimated effort:** ...
**Checkpoint:** [Final project or assessment]

---

## How to use this roadmap

[Advice on how to navigate the roadmap — learn sequentially, skip known material, revisit milestones, etc.]

## Resources and references

- [[note-slug-1]] — [description]
- [[note-slug-2]] — [description]
- [External resource links with source URLs]

---

## Appendix: Full step list

[Optional: A flat list of all steps in order for quick reference]

1. Step 1 — [[slug]] → [category]
2. Step 2 — [[slug]] → [category]
...
```

Use `create_para_doc` with:
- `area: "Projects"`
- `title: "Roadmap: <Topic>"` (the file is auto-named `roadmap-<topic-slug>.md`)
- `tags: ["roadmap", "<topic>", "index"]`

### Update scratchpad

```
update_scratchpad(
  path: "Areas/_scratchpad-<topic-slug>.md",
  steps: [/* all steps marked done */],
  milestones: [/* all milestones, final version */]
)
```

---

## Step 8 — Delete the scratchpad

Once the master roadmap document is created and confirmed with the user, clean up the temporary scratchpad:

```
delete_scratchpad(path: "Areas/_scratchpad-<topic-slug>.md")
```

This:
1. Deletes the scratchpad file from `Areas/`
2. Removes all its entries from `notes.duckdb` (files, tags, term_index, doc_lengths)
3. Recomputes corpus statistics

---

## Scratchped resume workflow

If the agent loses context mid-task (e.g., compaction, session restart), the user can say "continue the roadmap" or the agent can detect the scratchpad exists. The resume workflow is:

1. `search_para_docs(query: "<topic>", tags: ["scratchpad", "roadmap"])` → find scratchpad
2. `read` the file → parse JSON body
3. Check `steps` array — find the first step where `done: false`
4. Check `searchResults` and `milestones` to see what's already been done
5. Pick up from the appropriate step above
6. Inform the user of progress and next action

---

## Provided tools used

This skill relies on:

### Existing tools (from prior extensions)
- `search_para_docs` — BM25 search across PARA documents
- `list_para_tags` — list all existing tags before creating documents
- `web_search` — SearXNG category-based search (3-tier) with optional category override.
  See [API parameters](../../../.pi/extensions/web-search/AGENTS.md) for supported categories.
- `fetch_url` — fetch and extract content from web sources
- `create_para_doc` — create new PARA documents (used for master roadmap)
- `update_para_doc` — update existing documents
- `read` — read file contents
- `expand_bullet_points` — expand skeletal notes into full content

### New tools (from this work)
- `batch_create_para_docs` (from `batch-create` extension) — create multiple documents in one call with batch auto-linking
- `init_scratchpad` (from `roadmap-scratchpad` extension) — create a new roadmap scratchpad
- `update_scratchpad` (from `roadmap-scratchpad` extension) — update scratchpad state (partial merge)
- `delete_scratchpad` (from `roadmap-scratchpad` extension) — delete scratchpad and clean up DuckDB

## Milestone = one epic = one subskill mastery

Each `🏁 Milestone` in the roadmap groups 2–5 related steps into a coherent **epic**. An epic represents a complete subskill that the learner can claim mastery over before moving to the next milestone.

**Rules for grouping steps into milestones:**
- Each milestone should represent a **natural chunk** of the learning journey (e.g., all of "Core Theory" is one milestone)
- A milestone should be completable in 1–4 weeks of consistent study
- Each milestone has a **checkpoint** — a concrete deliverable that proves comprehension
- Milestones are progressive: each builds on the previous

## Related skills

- [Knowledge skill](../knowledge/SKILL.md) — general Q&A and document creation
- [Auto-link skill](../auto-link/SKILL.md) — semantic linking between notes (still relevant for non-batch scenarios)
- [Brainstorm skill](../brainstorm/SKILL.md) — clarifying vague requirements
