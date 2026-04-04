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

### 3. Create concept options (optional)

Present multiple design directions for the client to choose from:

```bash
# From the main workspace
bash scripts/new-client.sh acme-corp --concept modern --ref https://modern-example.com
bash scripts/new-client.sh acme-corp --concept classic
bash scripts/new-client.sh acme-corp --concept bold

# Set up worktrees for each
git worktree add ../clients/acme-corp--modern client/acme-corp/concept/modern
git worktree add ../clients/acme-corp--classic client/acme-corp/concept/classic
git worktree add ../clients/acme-corp--bold client/acme-corp/concept/bold

# Install deps in each
cd ../clients/acme-corp--modern && npm install
cd ../clients/acme-corp--classic && npm install
cd ../clients/acme-corp--bold && npm install
```

Each concept is an independent workspace. Open each in Cursor to have agents build the style tile (Stage 1) with different aesthetics. Deploy as Vercel previews for the client to compare.

When the client picks one:

```bash
cd ../clients/acme-corp
git merge client/acme-corp/concept/modern

# Clean up rejected concepts
git worktree remove ../clients/acme-corp--classic
git worktree remove ../clients/acme-corp--bold
git branch -d client/acme-corp/concept/classic
git branch -d client/acme-corp/concept/bold
```

### 4. Sync base updates

When `main` gets new components or bug fixes:

```bash
bash scripts/sync-client.sh acme-corp
cd ../clients/acme-corp
npm install  # if dependencies changed
npm run build  # verify
```

### 5. Deploy to Vercel

See the [Deployment](#deployment) section below.

### 6. List all clients

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

## Deployment

### Per-Client Vercel Projects

Each client gets its own Vercel project. The production branch is `client/<slug>`.

**First-time setup (via Deploy agent or manually):**

```bash
cd ../clients/<slug>
vercel link --yes
# Note the project ID from .vercel/project.json
# Update src/data/client.json deploy.projectId
```

**Manual deploy:**

```bash
cd ../clients/<slug>
npm run build
vercel deploy --prod
```

**Automated deploys via GitHub Actions:**

The workflow at `.github/workflows/deploy-client.yml` automatically deploys when you push to any `client/**` branch. It reads `client.json` to determine the Vercel project ID and whether it's a production or preview deploy.

Required GitHub repository secrets:
- `VERCEL_TOKEN` — Vercel API token
- `VERCEL_ORG_ID` — Your Vercel org/team ID

The project ID comes from `client.json` (set per-branch), so no per-client secrets are needed.

### Concept Branch Previews

Concept branches (`client/<slug>/concept/<name>`) are deployed as Vercel **preview** deployments, not production. This gives each concept its own URL for the client to review.

```
acme-corp.vercel.app                              ← production (client/acme-corp)
acme-corp-concept-modern-abc123.vercel.app         ← preview (concept/modern)
acme-corp-concept-classic-def456.vercel.app        ← preview (concept/classic)
```

### Vercel CLI and Worktrees

The Vercel CLI has a known bug with git worktrees (`.git` is a file, not a directory in worktrees). As of early 2026 there are patches in progress. Workarounds:

1. **GitHub Actions** (recommended): Push and let CI handle deploys — no worktree issue.
2. **`vercel deploy --prebuilt`**: Build locally first, then deploy the pre-built output.
3. **Deploy from main repo**: Check out the client branch in the main repo directory for the deploy, then switch back.

## Scaling Considerations

### Will this scale to hundreds of clients?

**Git: yes.** Git handles hundreds of branches without performance issues. Worktrees share the `.git` directory and object database — there's no per-worktree storage overhead beyond the checked-out files. Since Git 2.37, `git fetch` performance is constant regardless of worktree count.

**Disk: manageable.** Each active worktree needs ~50-100MB for source + `node_modules`. A machine with 100GB of disk can handle 100+ active worktrees. Inactive clients can be archived (worktree removed, branch preserved) and reactivated on demand.

**Practical limits are operational, not technical:**

- You won't have 200 worktrees active simultaneously. Most clients are either in active build (5-10 at a time) or in maintenance mode (worktree removed, branch preserved).
- The pattern is: activate 3-5 clients → build them → archive → activate next batch.
- `bash scripts/list-clients.sh` shows which clients have active worktrees vs. archived branches.

**If you truly hit hundreds of concurrent active clients**, the bottleneck would be the single `.git` directory. At that scale (100+ active worktrees on one machine), consider splitting into multiple repos or using shallow clones. But for a web agency with 10-50 active clients and hundreds archived, the single-repo worktree approach works well.

### Active vs. archived workflow

```bash
# Active client (has worktree, can receive agent tasks)
git worktree add ../clients/acme-corp client/acme-corp

# Archive (remove worktree, branch preserved, no disk cost)
git worktree remove ../clients/acme-corp

# Reactivate anytime
git worktree add ../clients/acme-corp client/acme-corp
cd ../clients/acme-corp && npm install
```

### Branch naming convention

All client branches use the `client/` prefix:

```
client/little-campus
client/acme-corp
client/bobs-plumbing
client/acme-corp/concept/modern     ← concept branch
client/acme-corp/concept/classic    ← concept branch
```

This keeps them visually grouped and makes glob patterns easy (`client/*`).

### Keeping main clean

The main branch should never have client-specific content. All client work happens on `client/*` branches. This means:

- `git log main` shows only base improvements
- New team members clone and see the clean starter
- CI on main validates the base template, not any specific client
