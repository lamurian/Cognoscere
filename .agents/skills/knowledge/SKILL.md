---
name: knowledge
description: Answers questions by first searching PARA-organized markdown files (Areas, Projects, Resources). If no document matches, clarifies via brainstorm, searches the web from reputable sources (.edu, .ac.*, .gov, .go.*, universities), then creates a new document with proper YAML frontmatter.
---

# Knowledge Agent

When the user asks a question about a topic, follow this workflow.

## Workflow

### 1. Search existing documents
Use the `search_para_docs` tool to find markdown files in `Areas/`, `Projects/`, `Resources/` that match via tags and content.

### 2. If matching documents exist
- `read` the most relevant document(s)
- Answer the user using the content
- Present any points for improvement
- If user confirms, use `update_para_doc` to apply improvements and renew frontmatter (`date` updated, `author: pi`, `editor: lam` preserved)

### 3. If no documents match
- Inform the user that no document covers this topic yet
- Invoke `/skill:brainstorm` to clarify and refine the question
- Use `fetch_reputable_web` to search `.edu`, `.ac.*`, `.gov`, `.go.*`, and university websites
- Summarise findings to the user
- Use `create_para_doc` to save a new document with frontmatter: `author: pi`, `date`, `editor: lam`, `title`, `tags`

## Tools provided by para-knowledge extension

See [extension reference](../../../.pi/extensions/para-knowledge/index.ts) for tool details.

- `search_para_docs` — search by tags and content in Areas/Projects/Resources
- `fetch_reputable_web` — web search filtered to reputable domains
- `create_para_doc` — create new file with YAML frontmatter
- `update_para_doc` — update file and renew frontmatter
