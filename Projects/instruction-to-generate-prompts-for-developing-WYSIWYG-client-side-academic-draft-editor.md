---
author: Lam
date: 2025-05-25T14:09:39+02:00
title: Instruction to generate prompts for developing WYSIWYG client side academic draft editor
source:
- https://chatgpt.com/share/6833089a-89cc-8006-b2fc-320375f4c49a
tags:
- LLM
- academic
- publishing
- markdown
---

## ✅ Phase 1 Instruction: ORCID Authentication (MVP)

### **Context**

We are building a Progressive Web App (PWA) targeting scholarly authors. In this first phase, the goal is to allow users to log in using ORCID (OAuth 2.0 with PKCE), store basic profile data, and restrict access to an editor page unless authenticated.

### **Objective**

Develop prompt-driven components or flows to assist in ORCID login implementation, authentication state management, and conditional routing to a protected `/editor` page.

### **Key Components to Support**

1. **Login Interface**
   Component: `LoginForm.tsx`

   * Includes an “ORCID Login” button.
   * On click, triggers the OAuth redirect flow.

2. **Auth Handler**
   File: `/auth/orcid.ts`

   * Manages OAuth PKCE flow (authorization + token exchange).
   * Fetches user profile from ORCID public API.
   * Handles success, error, and edge cases (e.g., denial, timeout).

3. **Authentication State Hook**
   File: `useAuth.ts`

   * React hook that stores login state and user info:

     ```ts
     {
       id: string;
       name: string;
       orcid: string;
       email?: string;
     }
     ```

4. **Route Protection**

   * Restrict `/editor.tsx` route access if user is not authenticated.
   * If unauthenticated, redirect to `/`.

5. **Header UI**

   * After login, show basic profile (e.g., name + ORCID ID) in the header.

### **Prompt Design Goals**

The prompt engineer should enable interactions such as:

* Generating error-safe OAuth redirect code with PKCE.
* Scaffolding `useAuth.ts` hook with state and context API (if used).
* Generating example fetch calls to ORCID’s public API and token endpoint.
* Suggesting clean ways to conditionally protect routes in React (e.g., using `useEffect` + `router.push()`).

### **Optional Enhancements**

* Prompts for session timeout warnings.
* Prompts to explain the OAuth process to users in a friendly, accessible way (e.g., via modals or inline messages).

### **Deliverables**

* Prompt-driven code templates and logic suggestions for each of the above components.
* Edge case handling suggestions (auth failure, bad state).
* Session management strategy (if requested by dev team).

## ✅ Phase 2 Instruction: GitHub Account Linking (Post-login Feature)

### **Context**

Following ORCID login, users should be able to link their GitHub account to enable saving work and publishing via GitHub in later phases. This step involves initiating a GitHub OAuth flow, storing the resulting token, and updating the user interface accordingly.

### **Objective**

Support the development of prompts that generate or assist with GitHub OAuth integration (including UI/UX), token handling, and feature-gating UI elements based on GitHub link status.

---

### **Key Components to Support**

1. **GitHub Link Button**

   * UI shown post-login (e.g., in profile dropdown, settings, or a banner).
   * Button triggers GitHub OAuth login.
   * Should be styled to indicate link status (linked/unlinked).

2. **Auth Handler**
   File: `/auth/github.ts`

   * Manages GitHub OAuth 2.0 flow (Authorization Code Flow).
   * Requests scopes: `repo`, `read:user`.
   * Exchanges code for token via GitHub’s token endpoint.
   * Optionally fetches GitHub username from GitHub API (`https://api.github.com/user`).

3. **Auth Hook Extension**
   File: `useAuth.ts`

   * Extend existing hook to store:

     ```ts
     github?: {
       username: string;
       token: string; // stored in session memory only
     }
     ```
   * Provide utility methods:

     * `linkGitHub()`
     * `isGitHubLinked()`
     * `unlinkGitHub()` (optional)

4. **UI Indicator**

   * Show a banner or message if GitHub is not yet linked (e.g., “Link your GitHub account to save work”).
   * Prompt should support generating banner components and logic for conditional rendering.

---

### **Prompt Design Goals**

The prompt engineer should create capabilities to:

* Generate GitHub OAuth redirect logic, including state validation.
* Safely exchange authorization code for token and store it only in memory (e.g., `sessionStorage` or app state).
* Scaffold UI components that:

  * Show linking status.
  * Trigger the auth flow.
  * Display linked GitHub account info after success.
* Offer error handling suggestions for failed/expired GitHub sessions.

---

### **Security Considerations**

* Ensure prompts generate examples that **never persist tokens to localStorage**.
* Emphasize secure redirect flows, state parameter usage, and session memory safety.

---

### **Optional Enhancements**

* Prompts to help users understand why GitHub access is needed.
* UI copy that reassures users about scope and token usage.
* Suggestions for managing token expiration gracefully (e.g., prompt relinking).

---

### **Deliverables**

* Prompt-ready templates and scaffolds for:

  * GitHub auth flow
  * Token exchange and fetch user info
  * UI for link status and error messages
* Utility functions inside the `useAuth.ts` hook
* UX patterns for post-auth GitHub status display

## ✅ Phase 3 Instruction: Editor Setup (View + Edit)

### **Context**

Now that users can authenticate and link GitHub, the next goal is to provide a powerful writing interface for composing articles. This editor will support WYSIWYG Markdown editing, YAML metadata, live preview, and local auto-saving.

### **Objective**

Design prompt flows that enable development of a robust editor experience using Toast UI Editor, a YAML sidebar editor, and auto-save via localStorage. Prompts should assist in creating both UI components and data management logic.

---

### **Key Components to Support**

1. **Markdown Editor**
   File: `Editor.tsx`

   * Use [Toast UI Editor](https://github.com/nhn/tui.editor) (React wrapper).
   * Enable Markdown input with WYSIWYG support.
   * Style and structure editor area to match a clean, distraction-free writing environment.

2. **Sidebar Metadata Editor**

   * YAML editor for basic metadata fields:

     ```yaml
     title: ""
     author: ""
     abstract: ""
     ```
   * Allow inline editing with live YAML validation.
   * Support suggestions for input field scaffolding (e.g., text input for `title`, textarea for `abstract`).

3. **Live Preview**

   * Show rendered Markdown with metadata overlay or merged preview.
   * Auto-update preview as the user types (throttle updates to prevent performance issues).

4. **Auto-save Functionality**
   File: `storage.ts`

   * Save editor content + metadata as a combined object:

     ```ts
     {
       markdown: string;
       metadata: { title: string; author: string; abstract: string };
       updatedAt: string;
     }
     ```
   * Store in `localStorage` on interval (e.g., every 5s or on pause).
   * Load from `localStorage` on component mount.

---

### **Prompt Design Goals**

The prompt engineer should enable:

* Generation of React components using Toast UI Editor.
* YAML editor that:

  * Accepts input via form or text.
  * Uses `js-yaml` or similar for parsing + validation.
* Auto-save hook or service that syncs to `localStorage`.
* Live preview component that renders Markdown + metadata together.

---

### **User Experience Enhancements**

* Prompts for layout: Editor (left) + Sidebar (right) or tabbed view.
* Prompts that add keyboard shortcut support (e.g., `Cmd+S` for manual save).
* Markdown styling previews (e.g., headers, code blocks, footnotes).
* Notifications for “Saved to local” with timestamp.

---

### **Deliverables**

* Prompt-driven generation of:

  * Full editor layout with Markdown + YAML support
  * Storage utility for auto-save/load
  * Live preview logic with optional diff highlighting
* Validation prompts for YAML schema
* UX scaffolding for minimal, clean authoring interface

## ✅ Phase 4 Instruction: GitHub Integration (Save + Publish)

### **Context**

After users finish writing in the editor, they should be able to save their work to GitHub and initiate a publication process by creating a pull request into a journal repository. This is the critical publishing backend functionality.

### **Objective**

Design prompts to assist in generating the GitHub integration layer, file commit workflows, and PR creation logic using the GitHub API (via Octokit). The goal is to move user content from local editor state to a persistent, reviewable GitHub repository.

---

### **Key Components to Support**

1. **GitHub API Integration**
   File: `github.ts`

   * Use [Octokit](https://octokit.github.io/rest.js/) to:

     * Authenticate with the linked GitHub token.
     * List and verify repository access.
     * Create or update a Markdown file in a repo.
     * Create a pull request with metadata summary.

2. **File Format**

   * Files should be saved in a `.md` or `.yml` + `.md` format.
   * Suggested naming convention:

     ```
     submissions/{orcid}-{YYYYMMDD}.md
     ```
   * Metadata can be embedded as YAML frontmatter or saved in a sidecar `.yml`.

3. **Commit + Save Functionality**

   * Use commit messages like:

     ```
     Add submission: "title" by ORCID:xxxx-xxxx
     ```
   * Support file overwrite if it already exists (updating a draft).

4. **Pull Request Creation**

   * Open PR into a journal’s main repo (e.g., `main` or `submissions` branch).
   * Title: `"Submission: {title}"`
   * Body: Summary from YAML metadata (e.g., author, abstract).
   * Add optional label or tag for editorial review.

5. **Git Submodule (Advanced)**

   * (Optional) If a repo-per-author model is used, link their repo to the journal’s repo as a Git submodule. This is a backend consideration, may not be automated initially.

---

### **Prompt Design Goals**

The prompt engineer should enable:

* Scaffolding of GitHub file commit logic using Octokit (token auth, content upload).
* Suggestions for writing clean, idempotent commit/update functions.
* PR creation templates using metadata to populate the title/body.
* Detecting if a PR already exists for the same file to prevent duplication.

---

### **Security Considerations**

* Token used must be stored **in memory only**, never persisted.
* Prompts should suggest token scope handling (e.g., `repo` access only).

---

### **User Experience Enhancements**

* Prompts to:

  * Show status: “Saving...”, “Draft saved to GitHub”, “PR submitted”.
  * Display the GitHub URL of the PR after submission.
* Support GitHub errors gracefully (e.g., 403, repo not found, merge conflicts).

---

### **Deliverables**

* Prompt templates to generate:

  * GitHub commit/upload functions using Octokit
  * File naming logic and metadata parsing
  * PR creation workflow with dynamic metadata population
* UI prompts for publish/save buttons with state feedback
* PR body generation using YAML fields

## ✅ Phase 5 Instruction: PWA & Offline Support

### **Context**

Now that users can write and publish content, we want to make the app installable and reliable offline. This ensures users can continue editing even without a network connection, syncing their drafts once reconnected.

### **Objective**

Create prompt-driven scaffolding and logic to implement PWA features including manifest configuration, service worker setup, asset caching, and local draft persistence/recovery.

---

### **Key Components to Support**

1. **Web App Manifest**
   File: `manifest.json`

   * Prompts should generate a minimal valid PWA manifest:

     ```json
     {
       "name": "Scholarly Editor",
       "short_name": "Editor",
       "start_url": "/",
       "display": "standalone",
       "background_color": "#ffffff",
       "theme_color": "#000000",
       "icons": [
         {
           "src": "/icon-192.png",
           "sizes": "192x192",
           "type": "image/png"
         },
         {
           "src": "/icon-512.png",
           "sizes": "512x512",
           "type": "image/png"
         }
       ]
     }
     ```
   * Prompt engineer should provide reusable prompt snippets to help with icon sizing, theme selection, and dynamic generation.

2. **Service Worker**

   * Use [Workbox](https://developer.chrome.com/docs/workbox/) or a custom service worker.
   * Prompt engineer should guide:

     * Precaching of static assets (JS, CSS, icons).
     * Runtime caching of routes like `/editor`.
     * Cache-first or stale-while-revalidate strategy for critical files.

3. **Offline Draft Sync**

   * Extend `storage.ts` to mark drafts as “dirty” (unsynced).
   * On reconnect, check if local draft differs from GitHub and prompt user to sync.
   * Prompt engineer should offer utilities for:

     * `isOnline()` check
     * Sync queue or background sync example
     * Draft conflict resolution (e.g., last-modified timestamps)

4. **Install Prompt UI**

   * Suggest prompts for:

     * Triggering the native install prompt (`beforeinstallprompt`)
     * Styling install banners
     * Tracking install status (e.g., `isInstalled()` flag)

---

### **Prompt Design Goals**

Prompt engineer should be able to:

* Generate manifest, service worker, and caching strategies based on described app structure.
* Suggest modular prompts for working with `localStorage`/`IndexedDB` for offline caching.
* Build offline-aware UI components (e.g., “Offline” badge, disabled GitHub publish when offline).
* Support Workbox plugin prompts for flexible caching rules.

---

### **User Experience Enhancements**

* Offline notification with UI feedback (e.g., snackbar or status bar).
* Auto-recovery prompt: “We found unsynced changes — would you like to save them now?”
* Install banner with custom design (not default browser one).

---

### **Security & Performance Considerations**

* Prompt engineer must ensure caching does not include sensitive data (e.g., GitHub tokens).
* Draft recovery logic must avoid overwriting newer versions on sync.

---

### **Deliverables**

* Prompt-ready templates to generate:

  * `manifest.json` and install flow
  * `service-worker.js` using Workbox
  * Offline-detecting and auto-sync logic in `storage.ts`
  * UX banners, alerts, and install interactions
