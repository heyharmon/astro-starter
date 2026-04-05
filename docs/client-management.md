# Client Management

This repo serves as the shared base for all client websites. The `main` branch holds the starter template, and each client gets a long-lived branch with its own working directory.

## Architecture

```
┌───────────────────────────────────────────────────┐
│                  Git Repository                    │
│                                                    │
│  main (base)         Shared: components, schemas,  │
│    │                 agents, build config           │
│    │                                               │
│    ├── client/little-campus                        │
│    ├── client/acme-corp                            │
│    │     ├── client/acme-corp/concept/modern       │
│    │     └── client/acme-corp/concept/classic      │
│    └── client/bobs-plumbing                        │
│                                                    │
└───────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────┐
│               Filesystem (worktrees)               │
│                                                    │
│  /project-root/                  ← main            │
│  /project-root/../clients/                         │
│    ├── little-campus/            ← worktree        │
│    ├── acme-corp/                ← worktree        │
│    ├── acme-corp--modern/        ← concept         │
│    ├── acme-corp--classic/       ← concept         │
│    └── bobs-plumbing/            ← worktree        │
│                                                    │
└───────────────────────────────────────────────────┘
```

### Why Worktrees (not clones, not branch switching)

- **Branches** keep merge history clean. `main` updates flow into clients via standard git merge.
- **Worktrees** give each client its own directory. Agents never need to switch branches. Multiple dev servers can run simultaneously.
- **Single repo** means one place for base improvements. No remotes to maintain, no cherry-picking across repos.

## Quick Start

### Create a new client

```bash
bash scripts/new-client.sh acme-corp --ref https://acmecorp.com

git worktree add ../clients/acme-corp client/acme-corp
cd ../clients/acme-corp
npm install
```

### Start working

Open `../clients/acme-corp/` in Cursor. Agents auto-detect the client context from `src/data/client.json` and follow the [Build Workflow](build-workflow.md).

### List all clients

```bash
bash scripts/list-clients.sh
```

## Client Identity (`client.json`)

Every workspace has `src/data/client.json` that agents read at session start:

```json
{
  "clientId": "acme-corp",
  "clientName": "Acme Corp",
  "branch": "client/acme-corp",
  "isBase": false,
  "isConcept": false,
  "conceptName": null,
  "parentBranch": null,
  "referenceUrl": "https://acmecorp.com",
  "deploy": {
    "provider": "vercel",
    "projectId": "prj_xxx",
    "productionBranch": "client/acme-corp",
    "url": "https://acmecorp.vercel.app"
  },
  "createdAt": "2026-04-04T12:00:00Z",
  "notes": ""
}
```

On `main`, `isBase` is `true` and `clientId` is `null`.

## Layer Separation

### Always on `main` (shared)

| Category | Files |
|----------|-------|
| Agent system | `.claude/` |
| Project instructions | `CLAUDE.md`, `SITE_GUIDE.md`, `docs/` |
| Components | `src/components/*.astro`, `*.vue` |
| Layouts | `src/layouts/*.astro` |
| Schemas | `src/content.config.ts` |
| Build config | `astro.config.mjs`, `package.json`, `tsconfig.json` |
| Scripts | `scripts/` |
| Placeholders | `public/images/placeholders/` |

### Always client-specific

| Category | Files |
|----------|-------|
| Client identity | `src/data/client.json` |
| Site metadata | `src/data/site-meta.json` |
| Build progress | `src/data/build-state.json` |
| Design tokens | `src/data/design-tokens.json` |
| Design | `src/styles/global.css` |
| Content | `src/content/**/*.md` |
| Navigation | `src/data/nav.json`, `footer.json` |
| Images | `public/images/` (non-placeholder) |

### Rules for `main`

- Changes must be generic and client-agnostic
- Components use data from content collections — never hardcode text
- New components should be overridable by client CSS tokens
- Design tokens use the neutral starter palette
- Schema changes add optional fields with defaults — never remove or rename fields

### Rules for client branches

- **Extend, don't fork.** Override tokens, add content, configure data files — avoid rewriting base components.
- If a layout pattern could benefit all clients, propose it for `main`
- Client-specific images go in `public/images/`

## Concept Branches

Concept branches present multiple design/content options for a client to choose from.

### Creating concepts

```bash
bash scripts/new-client.sh acme-corp --concept modern
bash scripts/new-client.sh acme-corp --concept classic
bash scripts/new-client.sh acme-corp --concept bold

git worktree add ../clients/acme-corp--modern client/acme-corp/concept/modern
git worktree add ../clients/acme-corp--classic client/acme-corp/concept/classic
git worktree add ../clients/acme-corp--bold client/acme-corp/concept/bold
```

Each concept branches off the client branch (not `main`), gets its own `client.json` with `isConcept: true`, and can be built independently.

### Presenting concepts

Deploy each concept as a Vercel preview URL. The client can compare them side-by-side:

```
acme-corp.vercel.app                         ← production
acme-corp-concept-modern-abc123.vercel.app   ← concept preview
acme-corp-concept-classic-def456.vercel.app  ← concept preview
```

### Merging the chosen concept

```bash
cd ../clients/acme-corp
git merge client/acme-corp/concept/modern

# Clean up rejected concepts
git worktree remove ../clients/acme-corp--classic
git worktree remove ../clients/acme-corp--bold
git branch -d client/acme-corp/concept/classic
git branch -d client/acme-corp/concept/bold
```

## Syncing Base Updates

When `main` is updated (new components, bug fixes, agent improvements), merge into client branches:

```bash
bash scripts/sync-client.sh acme-corp
cd ../clients/acme-corp
npm install   # if dependencies changed
npm run build # verify
```

### Sync all clients at once

```bash
for branch in $(git branch --list 'client/*' --format='%(refname:short)' | grep -v '/concept/'); do
  slug=$(echo "$branch" | sed 's|client/||')
  echo "Syncing $slug..."
  bash scripts/sync-client.sh "$slug"
done
```

### Merge Conflict Resolution

| File | Resolution |
|------|------------|
| `src/data/client.json` | Always keep client version |
| `src/data/site-meta.json` | Keep client values, adopt new fields from main |
| `src/data/design-tokens.json` | Keep client values, adopt new token categories |
| `src/styles/global.css` | Keep client tokens; adopt structural changes from main |
| `src/content/**` | Keep client content |
| `src/data/build-state.json` | Keep client version |
| `src/components/**` | Adopt main changes (base components) |
| `src/content.config.ts` | Adopt main changes, verify client content validates |
| `.claude/**` | Adopt main changes (agent improvements apply to all) |

## Agent Behavior by Context

| Agent | On `main` | On client branch |
|-------|-----------|-----------------|
| **Content** | Placeholder copy | Client-specific copy |
| **Design** | Neutral starter palette | Client design tokens |
| **SEO** | Generic meta descriptions | Client-targeted SEO |
| **Images** | Placeholders only | Sources real images |
| **Dev** | Generic components | May add client-specific routes |
| **Deploy** | No deploys from main | Vercel project setup + deploys |

## Scaling

### Git performance

Git handles hundreds of branches without issues. Worktrees share the `.git` directory and object database. Since Git 2.37, `git fetch` performance is constant regardless of worktree count.

### Disk usage

Each active worktree needs ~50-100MB (source + `node_modules`). Archived clients (worktree removed, branch preserved) cost nothing.

### Practical pattern

You won't have 200 worktrees active simultaneously. The workflow is:

1. Activate 3-5 clients (create worktrees)
2. Build them through the stage-gate process
3. Archive completed clients (remove worktrees)
4. Reactivate anytime for maintenance

### Archiving and reactivating

```bash
# Archive (branch preserved, no disk cost)
git worktree remove ../clients/acme-corp

# Reactivate anytime
git worktree add ../clients/acme-corp client/acme-corp
cd ../clients/acme-corp && npm install
```

### At extreme scale

If you hit 100+ concurrent active worktrees on one machine, the single `.git` directory becomes the bottleneck. At that point, consider splitting into multiple repos. For a web agency with 10-50 active and hundreds archived, the single-repo approach works well.
