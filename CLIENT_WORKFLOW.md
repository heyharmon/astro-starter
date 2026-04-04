# Client Website Management

This document explains how to manage multiple client websites using this repo as a shared base.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Git Repository                        │
│                                                          │
│  main (base)          Shared starter: components,        │
│    │                  schemas, agents, build config       │
│    │                                                     │
│    ├── client/little-campus     Client branch             │
│    ├── client/acme-corp         Client branch             │
│    └── client/bobs-plumbing     Client branch             │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  Filesystem (worktrees)                   │
│                                                          │
│  /project-root/                ← main (base dev)         │
│  /project-root/../clients/                               │
│    ├── little-campus/          ← worktree                │
│    ├── acme-corp/              ← worktree                │
│    └── bobs-plumbing/          ← worktree                │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**Why this approach (not clones, not branch switching):**

- **Branches** keep merge history clean — `main` updates flow into clients via standard git merge. Schema changes, component fixes, and agent improvements propagate to all clients.
- **Worktrees** give each client its own directory — agents never need to switch branches. You can run `npm run dev` in multiple client directories simultaneously.
- **Single repo** means one place for base improvements. No need to set up remotes, cherry-pick across repos, or maintain forks.

## Quick Start

### 1. Create a new client

```bash
# From the main workspace
bash scripts/new-client.sh acme-corp --ref https://acmecorp.com

# Set up its worktree
git worktree add ../clients/acme-corp client/acme-corp
cd ../clients/acme-corp
npm install
```

### 2. Start the build workflow

Open the client worktree in Cursor. The agent system reads `src/data/client.json` to detect that this is a client workspace and follows the Stage-Gate workflow in `CLAUDE.md`.

### 3. Sync base updates

When `main` gets new components or bug fixes:

```bash
bash scripts/sync-client.sh acme-corp
cd ../clients/acme-corp
npm install  # if dependencies changed
npm run build  # verify
```

### 4. List all clients

```bash
bash scripts/list-clients.sh
```

## What Lives Where

### Always on `main` (base layer)

These are shared across all clients and should remain generic:

| Category | Files |
|----------|-------|
| Agent system | `.claude/` (all agent definitions, skills, scripts) |
| Project instructions | `CLAUDE.md`, `SITE_GUIDE.md`, `CLIENT_WORKFLOW.md` |
| Components | `src/components/*.astro`, `src/components/*.vue` |
| Layouts | `src/layouts/*.astro` |
| Schemas | `src/content.config.ts` |
| Build config | `astro.config.mjs`, `package.json`, `tsconfig.json` |
| Scripts | `scripts/` |
| Placeholders | `public/images/placeholders/` |
| Evaluation criteria | `src/data/evaluation-criteria.md` |

### Always client-specific

These diverge on every client branch:

| Category | Files |
|----------|-------|
| Client identity | `src/data/client.json` |
| Site metadata | `src/data/site-meta.json` |
| Build progress | `src/data/build-state.json` |
| Design tokens | `src/data/design-tokens.json` |
| Design | `src/styles/global.css` (token overrides + custom styles) |
| Content | `src/content/pages/*.md`, `services/*.md`, `blog/*.md` |
| Navigation | `src/data/nav.json`, `src/data/footer.json` |
| Images | `public/images/` (non-placeholder) |

### May diverge (extend carefully)

These start identical to main but clients may need additions:

| Category | Notes |
|----------|-------|
| Page routes (`src/pages/`) | Clients may add routes. Avoid renaming base routes. |
| Components | Clients may add new `.astro` files. Avoid modifying base components on client branches — propose the change for main instead. |

## Merge Conflict Strategy

When merging `main` into a client branch, conflicts are expected in client-specific files. Resolution rules:

| File | Resolution |
|------|------------|
| `src/data/client.json` | Always keep client version |
| `src/data/site-meta.json` | Keep client values, adopt any new fields from main |
| `src/data/design-tokens.json` | Keep client values, adopt new token categories from main |
| `src/styles/global.css` | Keep client token values; adopt structural/base-layer changes from main |
| `src/content/**` | Keep client content |
| `src/data/build-state.json` | Keep client version |
| `src/components/**` | Adopt main changes (these are base components) |
| `src/content.config.ts` | Adopt main changes, verify client content still validates |
| `.claude/**` | Adopt main changes (agent improvements apply to all clients) |

## Working with Agents

### Sending tasks to base vs. client

Open the correct workspace directory in Cursor:

- **Base work** (new component, schema change, agent improvement) → open the main project root
- **Client work** (build a page, update copy, change colors) → open `../clients/<slug>/`

The agent reads `src/data/client.json` automatically. No special instructions needed.

### What agents do differently on client branches

| Agent | On main | On client branch |
|-------|---------|-----------------|
| **Content** | Writes placeholder copy | Writes client-specific copy |
| **Design** | Uses neutral starter palette | Uses client design tokens |
| **SEO** | Generic meta descriptions | Client-targeted SEO |
| **Images** | Only placeholders | Sources real images |
| **Dev** | Builds generic components | May add client-specific routes |

### Multi-client agent coordination

If you need an agent to work across clients (e.g., apply the same base fix to all), do it on `main` and sync:

1. Make the fix on `main`
2. Commit and push
3. Run `bash scripts/sync-client.sh <slug>` for each client

## Scaling Considerations

### Worktree limits

Git worktrees are lightweight — they share the `.git` directory with the main repo. You can have dozens of client worktrees without significant disk overhead (beyond each client's `node_modules/` and built `dist/`).

### CI/CD

Each client branch can have its own deployment pipeline. The `client/<slug>` naming convention makes it easy to set up branch-pattern-based deployments (e.g., Netlify, Vercel, Cloudflare Pages all support branch deploys).

### Archiving clients

When a client project is complete and in maintenance mode:

```bash
# Remove the worktree (branch is preserved)
git worktree remove ../clients/<slug>

# The branch stays in the repo for future maintenance
# Re-create the worktree anytime:
git worktree add ../clients/<slug> client/<slug>
```

### Branch naming convention

All client branches use the `client/` prefix for clean separation:

```
client/little-campus
client/acme-corp
client/bobs-plumbing
```

This keeps them visually grouped and makes glob patterns easy (`client/*`).
