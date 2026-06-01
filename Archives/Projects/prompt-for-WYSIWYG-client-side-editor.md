---
author: Lam
date: 2025-05-18T20:35:38+02:00
title: Prompt for WYSIWYG client-side editor
tags:
- LLM
- markdown
- publishing
- academic
---

You are an expert full-stack developer.

---

### 📌 Prompt for Fullstack Developer

**Project Title:**
Development of a Web-Based WYSIWYG Markdown Editor for GitHub-Powered Open Access Academic Journal

---

### 🧩 Context

You are building an **open access academic journal platform** for medical and social science research. The platform operates entirely on **GitHub Pages** and uses **static sites** to publish articles written in **Markdown** with a **YAML metadata block**.

Each article is:

* A separate GitHub repository owned by the author.
* Submitted by **adding the repo as a Git submodule** to the main journal repository.
* Rendered using a static site generator (e.g. Jekyll, Hugo, or Pandoc) hosted via GitHub Pages.
* Reviewed by the public using community tools like **Giscus**, **Utterances**, and **Hypothes.is**.
* Maintained at **zero infrastructure cost**—no backend server.

---

### 🎯 Objective

Build a **single-page web application (SPA)** that provides a seamless, GitHub-authenticated **WYSIWYG Markdown editor**. This editor should:

1. Authenticate users via **GitHub OAuth**.
2. Allow users to **load, edit, and save** a Markdown file from a repo they own (or have write access to).
3. Automatically **commit and push** changes to the repo via the GitHub API on save.
4. Enable users to **request publication**, which triggers:

   * Forking or referencing the user’s repo as a **submodule** in the main journal repo.
   * Opening a **pull request (PR)** to the main journal repo.
   * Adding metadata about the article (e.g. title, abstract, author info) for indexing and rendering.

---

### 🛠️ Core Features & Requirements

#### GitHub Integration

* OAuth login via GitHub
* GitHub API usage (REST or GraphQL) to:

  * Read/write files in the user’s repo (Markdown + YAML)
  * Commit/push updates
  * Create pull requests
  * Add submodules in another repo (main journal)
* Store no data on the server—use GitHub as the single source of truth.

#### Editor Capabilities

* WYSIWYG and raw Markdown editing modes (e.g. similar to StackEdit or Typora)
* Live preview of rendered article
* YAML metadata editor (form-driven or code view)
* Save button that commits to GitHub
* Publish button that:

  * Validates metadata
  * Forks or links repo as submodule to the main repo
  * Opens PR (optionally with metadata template for editors)

#### UX/UI

* Clean, distraction-free interface
* Markdown support with citation syntax (e.g. `[@smith2023]`)
* Accessibility for users with limited technical experience
* Lightweight—hostable via GitHub Pages

---

### ⚙️ Technical Constraints

* Must be **frontend-only** (pure static site)
* Use only **client-side JavaScript frameworks** (e.g. React, Svelte, Vue)
* All storage and logic must occur via **GitHub APIs**—no server or database
* Deployable to GitHub Pages (or Netlify as fallback)
* Optional: use **GitHub Actions** in the main repo for CI workflows (e.g. post-publish rendering)

---

### 🧠 Tech Recommendations

* **Authentication:** GitHub OAuth via `@octokit/auth-oauth-app` or Netlify Identity (GitHub strategy)
* **API Layer:** Use [Octokit.js](https://github.com/octokit/octokit.js) for GitHub REST interactions
* **Editor:** `Toast UI Editor`, `TipTap`, or `SimpleMDE` for WYSIWYG Markdown
* **Rendering:** `Showdown`, `Markdown-it`, or `UnifiedJS`
* **Metadata Management:** YAML parser like `js-yaml`
* **UI:** Tailwind CSS or another minimalist styling system

---

### ✅ Success Criteria (Business-Level)

From the perspective of a business developer leading this open science journal, the solution is considered successful if:

1. **Authors with no Git or command-line experience can submit an article** using only their browser.
2. The editor correctly **saves all content directly to GitHub**, with version control via commits.
3. **Articles can be published** with a single action (PR to main repo as submodule).
4. **No backend infrastructure or recurring cost** is introduced by the app.
5. **GitHub-based workflows** (submission, review, publishing) remain **transparent, traceable, and open**.
6. The app contributes to achieving **DOAJ and Google Scholar indexable outputs**, using metadata and static-site best practices.
7. Platform is **fully maintainable and deployable** by a non-technical editor using GitHub Pages.
8. Authors are successfully able to:

   * Authenticate with GitHub
   * Edit content visually
   * Push changes
   * Initiate publication
   * Receive feedback in the GitHub repo via Giscus/Hypothes.is

---

### 🚀 Stretch Goals

(Optional but valuable)

* Allow ORCID login or auto-linking to ORCID iDs
* PDF export via client-side Pandoc or third-party service
* Integration with Zenodo for DOI minting
* Built-in spellcheck, Grammarly-style hints
* Template library for different article types (review, case study, etc.)

---

Please give a thorough development overview for this platform. Detail the required tech stack. Focus on usability, especially in offline condition. I want this as a PWA.

