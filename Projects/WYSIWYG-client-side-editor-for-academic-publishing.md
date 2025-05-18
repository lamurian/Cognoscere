---
author: Lam
date: 2025-05-18T20:37:37+02:00
title: WYSIWYG client-side editor for academic publishing
source:
- https://chatgpt.com/c/682a1dc8-5468-8006-a16a-281c0a3f1e5d
tags:
- LLM
- markdown
- publishing
- academic
---

## 🧱 Core Architecture Overview

| Component                  | Technology Choices                                                                             |
| -------------------------- | ---------------------------------------------------------------------------------------------- |
| **Frontend Framework**     | React (Next best: SvelteKit or Vue 3 with Vite)                                                |
| **Markdown Editor**        | [Toast UI Editor](https://ui.toast.com/tui-editor) + YAML support via `js-yaml`                |
| **GitHub API Integration** | [Octokit.js](https://github.com/octokit/octokit.js) (REST)                                     |
| **Auth**                   | GitHub OAuth via `@octokit/auth-oauth-app` (browser flow with token scope `repo`, `read:user`) |
| **Metadata Parsing**       | [`js-yaml`](https://github.com/nodeca/js-yaml)                                                 |
| **Preview Renderer**       | `Markdown-it` or `UnifiedJS` (for extensibility and plugin ecosystem)                          |
| **PWA Framework**          | Workbox + Vite/React + Service Worker + Web App Manifest                                       |
| **Styling/UI**             | Tailwind CSS for rapid dev and clean UX                                                        |
| **Hosting**                | GitHub Pages or Netlify (fallback with Netlify OAuth if GitHub browser OAuth fails)            |

---

## 🧠 App Capabilities Breakdown

### ✅ 1. **GitHub OAuth Authentication (Frontend-Only)**

* Use `@octokit/auth-oauth-app` with [PKCE Flow](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#web-application-flow).
* Request scopes:

  ```bash
  scope: repo, read:user, read:org
  ```
* Store access token in **session memory only** (`localStorage` optional but less secure).
* Validate token with `/user` endpoint and display name/avatar on login.

---

### ✍️ 2. **WYSIWYG Markdown + YAML Metadata Editor**

#### Editor Interface:

* Split-pane:

  * Left: WYSIWYG Editor (Toast UI with Markdown/HTML toggle)
  * Right: Live preview using Markdown-it (renders YAML metadata as title/abstract/etc.)

#### Metadata Editor:

* Parse `--- YAML block ---` using `js-yaml`
* Create a UI form (React) to edit fields:

  ```yaml
  title: ...
  authors:
    - name: ...
      orcid: ...
  date: ...
  abstract: ...
  keywords: [...]
  ```

#### Additional Features:

* Raw Markdown editing toggle
* Citation highlighting: detect `[@citation]` format

---

### 📂 3. **File Access + GitHub Repo Integration**

#### File Loading:

* List user repos via `/user/repos`
* Use Octokit to:

  ```ts
  GET /repos/:owner/:repo/contents/:path
  ```
* Decode and load the Markdown content

#### File Saving:

* On save:

  * Create commit via `PUT` to `/contents/:path`
  * Include `sha` for updating
  * Commit message: `"Update article: [title]"`

```ts
PUT /repos/:owner/:repo/contents/:path
{
  message: "Update article",
  content: base64encoded,
  sha: existing_sha,
  branch: "main"
}
```

---

### 🚀 4. **Publishing Workflow**

1. **Validate YAML Metadata** (title, abstract, etc.)

2. **Fork the main journal repo** (if user doesn’t already have one)

3. **Create a submodule PR** to the main repo:

   a. Modify `.gitmodules` and `journal-index.yaml` in the main repo (as a PR)

   b. Example submodule:

   ```bash
   git submodule add https://github.com/user/article-title articles/user-article
   ```

4. **Submit Pull Request:**

   * Base: `main` branch of journal
   * Head: `user:patch-X`
   * PR Body includes:

     * Article title/abstract
     * Link to repo
     * Metadata preview

---

## 💡 UX Design Principles

| UX Requirement             | Implementation Strategy                            |
| -------------------------- | -------------------------------------------------- |
| No Git knowledge required  | Abstract Git operations, focus on visual interface |
| Minimal distractions       | Fullscreen WYSIWYG editor + clean YAML sidebar     |
| Feedback loops             | Show GitHub commit status and PR confirmation      |
| Citation-friendly          | Visual cues for citations (`[@xyz]`)               |
| Author guidance            | Tooltips, metadata hints, citation examples        |
| Mobile + offline usability | Installable PWA, service worker caching            |

---

## 📱 Progressive Web App (PWA)

Make it installable and usable offline (with limited editing).

### PWA Features:

| Feature                 | How?                                                                |
| ----------------------- | ------------------------------------------------------------------- |
| Installable             | Add `manifest.json` with icons, name, etc.                          |
| Offline editing support | Cache editor shell and user draft via `localStorage` or `IndexedDB` |
| Service Worker          | Use `Workbox` to precache and fallback content                      |
| Auto-save draft         | Debounce editor state into localStorage                             |

---

## 🧪 GitHub-Based CI for Journal Repo (Optional)

Use GitHub Actions in the main journal repo to:

* Validate incoming submodules
* Render articles with Pandoc or Jekyll
* Check metadata structure
* Build static HTML outputs
* Publish final content to `gh-pages`

Example CI trigger on PR:

```yaml
on:
  pull_request:
    paths:
      - ".gitmodules"
      - "journal-index.yaml"
```

---

## 🧰 Suggested Folder Structure

```bash
/public
  /icons
/src
  /components
    Editor.tsx
    MetadataForm.tsx
    FileBrowser.tsx
  /pages
    index.tsx
    login.tsx
  /utils
    github.ts         # Octokit methods
    yamlParser.ts
    auth.ts
  /hooks
    useGitHubAuth.ts
  /services
    pwa.ts
    storage.ts        # draft save/load
/manifest.json
/service-worker.js
```

---

## 🔐 Security & Permissions

* All actions require `repo` scope—clearly state this in UI
* Tokens only live in memory (unless opted to persist)
* Show users what will be pushed and committed

---

## ✅ Success Checklist

| Goal                             | Implementation                 |
| -------------------------------- | ------------------------------ |
| No Git experience needed         | Visual WYSIWYG + metadata form |
| GitHub is single source          | Octokit-based auth + commits   |
| One-click publication            | Automate submodule + PR        |
| No backend infra                 | All API calls client-side      |
| Fully deployable on GitHub Pages | React + Vite + Service Worker  |
| Transparent publishing workflow  | GitHub PR history is canonical |

---

## 🧭 Future Stretch Enhancements

| Feature                | Stack Suggestion                                    |
| ---------------------- | --------------------------------------------------- |
| ORCID Login            | Link via ORCID OAuth; fallback to YAML ID           |
| Zenodo DOI Integration | Use Zenodo’s API client-side via OAuth (limited)    |
| PDF Export             | Use Pandoc WebAssembly or external service          |
| Grammarly-Style Hints  | Integrate `languagetool.org` or `prose-mirror-lint` |
| Article Templates      | Local template chooser with metadata prefill        |

---

## 🔚 Summary

This platform leverages **GitHub as a backend**, **WYSIWYG Markdown editing**, and a **browser-only client** to publish academic research articles in a fully open and traceable way.

The combination of React + Octokit + Tailwind + Toast UI + GitHub OAuth enables **GitHub-native publishing** while preserving a simple, elegant experience for non-technical researchers—all within a **static PWA**.
