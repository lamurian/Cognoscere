---
author: Lam
date: 2025-05-25T14:23:46+02:00
title: Prompt to generate components for WYSIWYG client side academic draft editor
source:
- https://chatgpt.com/share/68330bfc-3d58-8006-86d9-cb24321a8370
tags:
- LLM
- academic
- publishing
- markdown
---

# Phase 1: ORCID Authentication (MVP)

````
// Prompt to build Phase 1: ORCID Authentication (MVP)

// 🎯 Goal:
// Implement ORCID OAuth login, authentication state management, and route protection
// for a scholarly writing PWA. This includes a login interface, an OAuth handler,
// an auth state hook, and protected access to the `/editor` route.

// 🧩 Break it down into five primary components: UI, OAuth flow, state management,
// route protection, and post-login UI.

You are building a React-based Progressive Web App for scholarly authors. Your task is to scaffold the ORCID login flow using OAuth 2.0 with PKCE. Generate components and logic needed for the following features:

---

🔹 1. `LoginForm.tsx`: A login interface with an ORCID login button.

- Create a React component with a centered ORCID login button.
- On button click, redirect the user to the ORCID authorization endpoint using OAuth 2.0 with PKCE.
- Use a function like `initiateOrcidLogin()` that generates the code verifier/challenge pair and handles redirect.

---

🔹 2. `/auth/orcid.ts`: ORCID OAuth handler (client-side, assume serverless environment).

- Create a utility or handler function to:
  - Parse the returned `code` from the ORCID redirect.
  - Exchange the authorization code and code_verifier for a token at ORCID's token endpoint.
  - Fetch the user's public profile using the returned `access_token`.
- Include error handling for timeouts, denied consent, or malformed responses.

---

🔹 3. `useAuth.ts`: React hook for managing authentication state.

- Build a custom React hook to:
  - Store and retrieve the authenticated user's data (`id`, `name`, `orcid`, `email?`).
  - Use React Context if necessary to share auth state across the app.
  - Support session persistence using localStorage or memory (configurable).
  - Include a `logout()` function and an `isAuthenticated` flag.

---

🔹 4. Route protection: Restrict access to `/editor.tsx`.

- Implement a protection mechanism that:
  - Uses `useEffect` and the `useRouter` hook to redirect unauthenticated users to `/`.
  - Optionally use a `withAuthProtection` HOC or middleware component.

---

🔹 5. Post-login header display.

- After a successful login, show the user’s name and ORCID iD in the site header.
- Create a simple header component that consumes `useAuth()` to get user data.

---

📌 Extras (Optional):

- Include session timeout detection (e.g., 1 hour inactivity = logout).
- Provide user-friendly explanations of the ORCID login process via modal or info message.
- Include a loading spinner or transition during the login process.

---

📚 Notes:

- ORCID OAuth Docs: https://info.orcid.org/documentation/integration-guide/orcid-oauth/
- The PKCE flow should generate and store `code_verifier` securely (in memory or session).
- Token and profile requests are sent to:
  - `https://orcid.org/oauth/token` (POST)
  - `https://pub.orcid.org/v3.0/{ORCID}/person` (GET)

Generate all code in TypeScript with modern React and functional components.
Use Next.js-compatible patterns if relevant.
Include placeholder environment variables or config constants where appropriate.
````

# Phase 2: GitHub Account Linking (Post-login Feature)

````
// Prompt to build Phase 2: GitHub Account Linking (Post-login Feature)

// 🎯 Goal:
// After ORCID login, allow users to securely link their GitHub account to enable saving and publishing.
// Implement the GitHub OAuth flow, token exchange, in-memory token storage, and dynamic UI updates.

You are building a React-based PWA for scholarly authors. Users already log in with ORCID. Now, you need to enable GitHub account linking using GitHub OAuth (Authorization Code Flow).

Build the following components to complete GitHub linking and show its status in the UI:

---

🔹 1. GitHub Link Button Component

- Create a `LinkGitHubButton.tsx` component.
- When clicked, initiate the GitHub OAuth redirect:
  - Request `repo` and `read:user` scopes.
  - Include a unique `state` parameter to prevent CSRF.
- Show one of the following:
  - 🔗 "Link GitHub" (if not linked)
  - ✅ "GitHub Linked: @username" (if linked)

---

🔹 2. `/auth/github.ts`: GitHub OAuth Handler

- Create a utility function or file to:
  - Handle redirect from GitHub with `code` and `state` params.
  - Exchange the code for an access token using GitHub’s token endpoint.
  - Fetch the GitHub username via `https://api.github.com/user`.
  - Return `{ username, token }`.
- Validate the `state` parameter for security.
- Handle edge cases: expired code, denied access, invalid state.

---

🔹 3. Extend `useAuth.ts` Hook

- Add support for GitHub auth data to the hook:

  ```ts
  github?: {
    username: string;
    token: string;
  }
  ```

- Provide these methods:
  - `linkGitHub(): Promise<void>` – Starts linking process.
  - `isGitHubLinked(): boolean` – Returns true if GitHub is linked.
  - `unlinkGitHub(): void` – Optional, clears GitHub data from memory.

- Tokens must be stored only in memory (or `sessionStorage` if necessary), **never in localStorage**.

---

🔹 4. UI Banner or Status Indicator

- Create a `GitHubStatusBanner.tsx` component that:
  - Shows a banner if the GitHub account is not linked.
  - Includes a "Link GitHub" call-to-action.
  - Disappears or changes once GitHub is linked.
  - Provide visual cues (icons, badges) and light explanation.

---

📌 Extras (Optional):

- Include a `Why GitHub?` modal or tooltip that:
  - Explains scope usage and token security.
  - Builds trust in linking process.
- Add automatic relink prompts if token appears expired (detect via 401 on GitHub API calls).

---

📚 Notes:

- GitHub OAuth Docs: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps
- Token Endpoint: `https://github.com/login/oauth/access_token` (POST)
- User Info: `https://api.github.com/user` (GET with `Authorization: Bearer`)
- Use a secure proxy/backend if required for client-secret handling (can be mocked for now).

Generate all code in TypeScript using React.
Use best practices for OAuth flows and in-memory token management.
Support conditional rendering for "linked" vs. "not linked" states.
Use Next.js-compatible patterns where applicable.

````

# Phase 3: Editor Setup (Markdown + Metadata + Auto-save)

````
// Prompt to build Phase 3: Editor Setup (Markdown + Metadata + Auto-save)

// 🎯 Goal:
// Provide a clean, WYSIWYG Markdown editor with a YAML metadata sidebar,
// live preview, and auto-save to `localStorage` for scholarly article writing.

You are developing a React-based editor for scholarly authors. The interface will consist of:

1. A **Markdown Editor** using Toast UI Editor (WYSIWYG).
2. A **YAML Metadata Editor Sidebar** for fields like title, author, abstract.
3. A **Live Preview** panel showing the compiled Markdown with metadata.
4. **Auto-save** functionality that stores the entire article to localStorage.

---

🔹 1. `Editor.tsx`: Main Layout

- Create a responsive two-column layout:
  - Left: Toast UI Markdown Editor (`@toast-ui/react-editor`)
  - Right: YAML Metadata Form (Title, Author, Abstract)
- Use minimal, distraction-free styling (`tailwind` or `styled-components`)
- Below the editor, include a preview section that updates live as content changes

---

🔹 2. Markdown Editor Setup

- Use Toast UI Editor in Markdown mode with the following:
  - Initial content support (`initialValue`)
  - Custom height (e.g. `600px`)
  - Autosave via `onChange` event (debounced/throttled)
- Provide `ref` access to get Markdown content

```tsx
const editorRef = useRef<Editor>(null);

const getMarkdown = () => {
  return editorRef.current?.getInstance().getMarkdown() || '';
};
```

---

🔹 3. YAML Metadata Sidebar

- Create a `MetadataEditor.tsx` component
- Use controlled form inputs bound to:

```ts
metadata = {
  title: string;
  author: string;
  abstract: string;
};
```

- Parse inputs into YAML using `js-yaml`
- Validate and show errors if YAML structure is broken
- Optionally allow toggling between form view and raw YAML textarea

---

🔹 4. Live Preview Component

- Render parsed Markdown (e.g. using `react-markdown` or `marked`)
- Display metadata (title, author, abstract) above rendered Markdown
- Auto-update preview as editor or metadata changes (throttle updates every 500ms)
- Layout: `[Metadata] + [Rendered Markdown]`

---

🔹 5. `storage.ts`: Auto-save Utility

- Create a `useAutosave()` hook or utility to:
  - Save `{ markdown, metadata, updatedAt }` to localStorage
  - Load from localStorage on component mount
  - Save every 5 seconds or on change pause (throttled)

```ts
interface Draft {
  markdown: string;
  metadata: {
    title: string;
    author: string;
    abstract: string;
  };
  updatedAt: string;
}
```

- Key: `"draft_article"` or similar

---

🔹 6. UX Features (Optional Enhancements)

- Show “Draft saved at HH:MM” toast after auto-save
- Keyboard shortcut: `Cmd+S` to trigger manual save
- Button: "Clear Draft" (with confirmation)

---

📚 Libraries

- Toast UI Editor: https://github.com/nhn/tui.editor
- js-yaml: https://github.com/nodeca/js-yaml
- react-markdown or marked for preview rendering
- lodash.debounce for throttling

---

✅ Deliver a working layout with Toast UI, YAML form, preview pane, and local auto-save.
Use modern React with hooks and best practices.
Structure components in separate files if needed (e.g. `Editor.tsx`, `MetadataEditor.tsx`, `LivePreview.tsx`, `storage.ts`).
````

# Phase 4: GitHub Integration (Save + Publish)

````
// Prompt to build Phase 4: GitHub Integration (Save + Publish)

// 🎯 Goal:
// Move the user's article (Markdown + YAML metadata) from local editor state to GitHub.
// Steps: Authenticate via token, commit a file to a repo, and create a pull request for publication.

You are implementing a GitHub integration for a scholarly writing PWA.
Use Octokit (GitHub REST SDK) with the user’s stored in-memory token to:

1. Push `.md` (or `.yml` + `.md`) file to a GitHub repo.
2. Create or update a pull request with metadata-filled details.

---

🔹 1. `github.ts`: Core GitHub Functions

Use Octokit authenticated with a user token:

```ts
import { Octokit } from 'octokit';

const octokit = new Octokit({ auth: user.github?.token });
```

Define the following functions:

```ts
// Create or update file
async function commitFile({
  owner,
  repo,
  path,
  content, // base64-encoded
  message,
  branch = 'main',
}: {
  owner: string;
  repo: string;
  path: string;
  content: string;
  message: string;
  branch?: string;
}): Promise<void> {
  try {
    const { data: { sha } = {} } = await octokit.rest.repos.getContent({ owner, repo, path }).catch(() => ({}));

    await octokit.rest.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content,
      branch,
      sha, // optional if file does not exist
    });
  } catch (error) {
    console.error('GitHub commit error', error);
    throw error;
  }
}
```

---

🔹 2. File Naming Convention

```ts
function getSubmissionPath(orcid: string, date = new Date()): string {
  const dateString = date.toISOString().split('T')[0].replace(/-/g, '');
  return `submissions/${orcid}-${dateString}.md`;
}
```

---

🔹 3. Metadata as Frontmatter

Merge metadata with Markdown:

```ts
function generateMarkdownWithFrontmatter(metadata: {
  title: string;
  author: string;
  abstract: string;
}, markdown: string): string {
  const yaml = `---\ntitle: ${metadata.title}\nauthor: ${metadata.author}\nabstract: |\n  ${metadata.abstract}\n---\n\n`;
  return yaml + markdown;
}
```

---

🔹 4. Pull Request Logic

```ts
async function createPullRequest({
  owner,
  repo,
  head,
  base = 'main',
  title,
  body,
}: {
  owner: string;
  repo: string;
  head: string;
  base?: string;
  title: string;
  body: string;
}) {
  return await octokit.rest.pulls.create({
    owner,
    repo,
    head,
    base,
    title,
    body,
  });
}
```

Populate PR body using metadata:

```ts
function generatePRBody(metadata: {
  title: string;
  author: string;
  abstract: string;
}): string {
  return `**Title**: ${metadata.title}\n**Author**: ${metadata.author}\n\n**Abstract**:\n${metadata.abstract}`;
}
```

---

🔹 5. Publish Flow

In `Editor.tsx`, create a “Save to GitHub” button that:

1. Extracts markdown + metadata from editor.
2. Generates markdown with frontmatter.
3. Encodes content in `base64`.
4. Calls `commitFile`.
5. Creates a new branch (optional).
6. Calls `createPullRequest`.

Show status messages:

- ✅ “Saved to GitHub”
- 🚀 “Pull request submitted”
- 🔗 PR URL shown after submission

---

📚 Libraries

- [Octokit REST](https://octokit.github.io/rest.js/)
- Use `btoa(unescape(encodeURIComponent(markdown)))` to safely encode UTF-8 content

---

✅ Result

A commit + PR workflow that lets users submit scholarly articles to a GitHub repo for editorial review.
````

# Phase 5: PWA & Offline Support

````
// Prompt to implement Phase 5: PWA & Offline Support

// 🎯 Goal:
// Make the Scholarly Editor app installable and usable offline using a PWA manifest, service worker, and local draft sync.

You are adding offline support and installability to a scholarly PWA editor.

---

🔹 1. Create a valid `manifest.json` file in the public directory:

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

Ensure this is referenced in `index.html`:

```html
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#000000" />
```

---

🔹 2. Register a service worker with Workbox for offline support

Install dependencies:

```bash
npm install workbox-cli --save-dev
```

Create `service-worker.js`:

```js
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';

// Precache all assets built by the framework (injected at build time)
precacheAndRoute(self.__WB_MANIFEST || []);

// Cache editor page shell
registerRoute(
  ({ url }) => url.pathname.startsWith('/editor'),
  new StaleWhileRevalidate()
);

// Cache icons and static assets
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst()
);
```

In `main.tsx` or `index.tsx`:

```ts
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}
```

---

🔹 3. Enhance `storage.ts` for offline draft syncing

Extend draft storage to include dirty state:

```ts
export function saveDraftToLocal(draft: Draft) {
  localStorage.setItem('draft', JSON.stringify({ ...draft, dirty: true }));
}

export function getDraftFromLocal(): Draft | null {
  const raw = localStorage.getItem('draft');
  return raw ? JSON.parse(raw) : null;
}

export function markDraftSynced() {
  const raw = localStorage.getItem('draft');
  if (!raw) return;
  const draft = JSON.parse(raw);
  draft.dirty = false;
  localStorage.setItem('draft', JSON.stringify(draft));
}
```

---

🔹 4. Add reconnect sync logic

Use an effect in `Editor.tsx`:

```ts
useEffect(() => {
  function handleReconnect() {
    const draft = getDraftFromLocal();
    if (navigator.onLine && draft?.dirty) {
      // Optionally: show dialog to confirm sync
      syncDraftToGitHub(draft);
    }
  }

  window.addEventListener('online', handleReconnect);
  return () => window.removeEventListener('online', handleReconnect);
}, []);
```

---

🔹 5. Install Prompt UI

Handle `beforeinstallprompt` event:

```ts
const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

useEffect(() => {
  const handler = (e: Event) => {
    e.preventDefault();
    setDeferredPrompt(e);
  };
  window.addEventListener('beforeinstallprompt', handler);
  return () => window.removeEventListener('beforeinstallprompt', handler);
}, []);

function showInstallPrompt() {
  if (deferredPrompt) {
    (deferredPrompt as any).prompt();
    setDeferredPrompt(null);
  }
}
```

Show a banner with “Install” button if `deferredPrompt` is set.

---

🔹 6. UX Elements

- Add “Offline” badge if `!navigator.onLine`.
- Disable GitHub publishing when offline.
- On reconnect, show a snackbar:
  > "We found unsynced changes. Sync them to GitHub?"

---

✅ Result

This creates an installable offline-first PWA with automatic draft recovery and GitHub sync awareness.

````
