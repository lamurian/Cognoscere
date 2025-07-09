---
author: Lam
date: 2025-05-20T12:22:21+02:00
title: Development roadmap WYSIWYG editor for an academic publishing suite
source:
- https://chatgpt.com/c/682a1dc8-5468-8006-a16a-281c0a3f1e5d
tags:
- LLM
- academic
- publishing
- markdown
---

[Related note](Projects/WYSIWYG-client-side-editor-for-academic-publishing.md).

### Phase 1: ORCID Authentication (MVP)

**Goal**: Users can sign in via ORCID and access the editor page.  

**Tasks:**

* [ ] Add `LoginForm.tsx` with an **ORCID login button**
* [ ] Create `/auth/orcid.ts` to handle:
  * Authorization redirect to ORCID
  * Token exchange (OAuth 2.0 PKCE)
  * Profile fetch from ORCID public API
* [ ] `useAuth.ts`: Hook to manage login state, user info (`id`, `name`, `orcid`, `email`)
* [ ] Protect `/editor.tsx` route: If not authenticated, redirect to `/` (login)
* [ ] Show basic profile in header (after login)

**Success Criteria**:  
Users can log in via ORCID and access `/editor` after auth.

---

### Phase 2: GitHub Account Linking (Post-login feature)

**Goal**: Logged-in users can link their GitHub account to enable saving and publishing.  

**Tasks:**

* [ ] Add "Link GitHub" button after ORCID login
* [ ] Add `/auth/github.ts`: OAuth with `repo`, `read:user`
* [ ] Extend `useAuth.ts`: Store linked GitHub username/token
* [ ] UI indicator if GitHub is not linked (e.g. banner)

**Success Criteria**:  
ORCID-authenticated users can securely link GitHub, with token stored in session memory.

---

### Phase 3: Editor Setup (View + Edit)

**Goal**: Provide a WYSIWYG Markdown + metadata editor.  

**Tasks:**

* [ ] Use Toast UI Editor in `Editor.tsx`
* [ ] Sidebar YAML metadata editor (basic fields: title, author, abstract)
* [ ] Live preview
* [ ] Auto-save to `localStorage` via `storage.ts`

**Success Criteria**:  
Users can write Markdown, edit metadata, and auto-save drafts.

---

### Phase 4: GitHub Integration (Save + Publish)

**Goal**: Save to GitHub repo and submit a publication request (PR).  

**Tasks:**

* [ ] File load/save via `github.ts` (Octokit)
* [ ] Commit file to repo with GitHub token
* [ ] Add repo as submodule to journal main repo
* [ ] Open PR with metadata summary

**Success Criteria**:  
Users can save articles to GitHub and initiate a pull request for publication.

---

### Phase 5: PWA & Offline Support

**Goal**: Make the app installable and offline-capable.  

**Tasks:**

* [ ] Add `manifest.json`
* [ ] Add Service Worker via Workbox
* [ ] Cache static assets and editor shell
* [ ] Sync drafts from `localStorage` when reconnected

**Success Criteria**:  
Users can use the app offline and resume edits without data loss.

---

## Summary of Phases

| Phase | Feature                    | Outcome                                |
| ----- | -------------------------- | -------------------------------------- |
| 1     | ORCID Login                | Login with ORCID, access editor        |
| 2     | GitHub Account Linking     | Allow publishing/saving via GitHub     |
| 3     | Markdown + Metadata Editor | Full WYSIWYG + YAML metadata support   |
| 4     | GitHub Save + Publish      | Commit to GitHub, submit PR to journal |
| 5     | PWA Offline Support        | Offline editing, installable app       |
