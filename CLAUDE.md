# Claude Code — Project Instructions

## Project

Astro 5 static site ("Acme Studio") with Tailwind CSS 4 and Vue 3 (contact form only). Content Collections with Zod schemas. Static output — no SSR.

## Agents

This project uses six specialist agents. Route every user request to the correct agent based on the task domain. If a request spans multiple domains, break it into sub-tasks and invoke agents sequentially — foundational changes first.

### Content Agent → `content`

**When:** Creating, editing, or removing pages, blog posts, or services. Editing page text, frontmatter body content, or markdown. Managing navigation links, footer links, or site config (nav.json, footer.json, site-meta.json). Any operation a non-developer would do in a CMS.

**Owns:** `src/content/`, `src/data/`, `src/pages/` (route files for new pages only)

**Skills:** `/content:create-page`, `/content:edit-content`, `/content:update-nav`

### SEO Agent → `seo`

**When:** Auditing SEO, updating meta titles or descriptions, optimizing OG images, keyword research, competitor analysis, SERP analysis, creating content briefs, or any task focused on search visibility.

**Owns:** SEO frontmatter fields (`title`, `description`, `featuredImage`/`image`, `tags`) and `src/data/site-meta.json` (SEO fields only)

**Skills:** `/seo:update-seo`

### Design Agent → `design`

**When:** Changing colors, typography, fonts, spacing, layout, design tokens, component appearance, Tailwind theme, prose styling, or any visual change.

**Owns:** `src/styles/global.css`, Tailwind classes in `.astro` components and layouts

**Skills:** `/design:update-styles`

### Images Agent → `images`

**When:** Sourcing, downloading, or placing images. Stock photo search, reference site image pulling, or any task involving finding or managing visual assets for the site.

**Owns:** `public/images/` (except `placeholders/`), image frontmatter fields (`featuredImage`, `image`)

### Dev Agent → `dev`

**When:** Bug fixes, new features, component development, schema changes (content.config.ts), build configuration, new integrations, refactoring, performance work, or any structural codebase change.

**Owns:** Everything not owned by Content, SEO, Design, Images, or Deploy — components, layouts, schemas, build config, static assets

**Skills:** None (general-purpose developer)

### Deploy Agent → `deploy`

**When:** Deploying a client site to Vercel, setting up a new Vercel project, managing domains, checking deployment status, creating/syncing/listing client worktrees or branches, creating concept branches, or any CI/CD pipeline work.

**Owns:** `src/data/client.json` (`deploy` field), `vercel.json`, `.github/workflows/deploy-*.yml`, client lifecycle scripts (`scripts/new-client.sh`, `sync-client.sh`, `list-clients.sh`)

**Skills:** `/deploy:vercel-deploy`, `/deploy:worktree-manager`

## Routing Rules

1. **Single-domain request** → Delegate directly to that agent.
2. **Multi-domain request** → Break into sub-tasks. Execute sequentially, starting with the foundational change. Example: "Add a new Pricing page with good SEO and styled like the About page" → Content creates the page → SEO optimizes metadata → Design adjusts styling.
3. **Reference-based work** → When the user provides a reference URL to replicate or draw inspiration from, the root orchestrator MUST do visual capture before delegating to any agent:
   1. **Screenshot the reference** — Use Playwright (`mcp__playwright__*`) to take a full-page screenshot of the reference URL. This captures layout, imagery, visual weight, and spatial relationships that text extraction misses.
   2. **Extract text content** — Use `WebFetch` to get the page's text content (headlines, copy, CTAs, section structure).
   3. **Delegate with visual context** — Pass both the screenshot observations and extracted text to the appropriate agents. The design agent needs to know what the reference *looks like*, not just what colors it uses.
   4. **Structural changes before styling** — If matching the reference requires layout/HTML changes (hero images, grid structures, new sections), route to the Dev agent first, then the Design agent for token/class changes.
   5. **Visual comparison after** — Once all agents finish, screenshot our site and compare against the reference. Flag remaining gaps to the user.
4. **Ambiguous request** → Ask the user to clarify before delegating.
5. **Agents do not call each other.** Root Claude orchestrates all inter-agent coordination.

## Site Build Workflow (Stage-Gate)

When building a new site (not CMS maintenance), follow these stages in order. Read `src/data/build-state.json` for current progress. If the file is missing, infer state from the codebase and create it.

### Stages

| # | Stage | What | Gate |
|---|-------|------|------|
| 1 | **Style** | Design agent applies reference aesthetic to the style tile (`/style-tile`). Updates `global.css` tokens and `design-tokens.json`. | Human approves style tile |
| 2 | **Sitemap** | Orchestrator proposes page list + nav structure based on reference or brief. | Human approves sitemap |
| 3 | **Content Drafts** | Content agent drafts all page copy in `src/content/pages/*.md` with `draft: true`. No layout work yet. | Human reviews copy (soft gate) |
| 4 | **Page Building** | Build pages in cohorts of 2–3. Homepage is always cohort 1. | Human reviews after each cohort |
| 5 | **Final Review** | Full-site visual audit (all pages, desktop + mobile). SEO optimization pass. Design compliance check. | Human final approval |

### Per-Cohort Sequence (Stage 4)

Agents execute in this order for each cohort:

1. **Dev** — structural layout (new sections, grids, HTML in `.astro` route files)
2. **Content** — places drafted copy into layout, flips `draft: false`
3. **Design** — styles any new component patterns, updates style tile + `design-tokens.json`
4. **Images** — Images agent sources and places images via `source-page-images` skill
5. **Polish** — Design agent runs the `polish-page` skill. Compares the built page section-by-section against the reference (if one exists) or against the approved homepage + style tile (if no reference). Fixes spacing, sizing, text placement, visual weight, and layout details to reach 90–95% quality. See `.claude/agents/design/polish-page.md`.
6. **Evaluate** — screenshots at 1280px + 375px, grades against `src/data/evaluation-criteria.md`
7. **Report** — presents screenshots, scores, and flagged issues to human

### State Tracking

Update `src/data/build-state.json` after each stage transition and cohort completion. Include which pages belong to each cohort and their approval status.

**Inference fallback** (if state file is missing): style-tile.astro has non-default content → style done. nav.json has real pages → sitemap done. Content files have body text → drafts exist.

## Client Management

This repo serves as the **base** for all client websites. The `main` branch holds the starter template, shared components, agent definitions, and build infrastructure. Each client gets a **long-lived branch** (`client/<slug>`) that diverges from main with client-specific content, design, and configuration.

### Architecture: Base Layer vs. Client Layer

Read `src/data/client.json` at the start of every session to determine context.

| Field | `main` (base) | Client branch |
|-------|---------------|---------------|
| `isBase` | `true` | `false` |
| `clientId` | `null` | `"little-campus"` |
| `branch` | `"main"` | `"client/little-campus"` |

### Layer Separation Rules

When working on **main** (base layer):

- Changes must be **generic and client-agnostic**. No client names, branding, or content.
- Components should use data from content collections and `src/data/` JSON — never hardcode text.
- New components should have sensible defaults and be **overridable** by client-layer CSS tokens.
- Design tokens in `global.css` should use the neutral starter palette.
- All changes to main will eventually be merged into every client branch, so **avoid breaking changes** to content schemas, component props, or data file structures.
- When changing schemas (`content.config.ts`), add new optional fields with defaults — never remove or rename existing fields without a migration note.

When working on a **client branch**:

- **Extend, don't fork.** Prefer overriding design tokens, adding content, and configuring `src/data/` files over rewriting base components.
- Keep structural component changes minimal. If a client needs a layout pattern that could benefit other clients, consider whether it belongs in the base.
- Client-specific images go in `public/images/` (the base only has `public/images/placeholders/`).
- The files that are **always client-specific**: `src/data/client.json`, `src/data/site-meta.json`, `src/data/build-state.json`, `src/data/design-tokens.json`, `src/content/`, `src/styles/global.css` (token overrides), `public/images/` (non-placeholder).

### Workspace Strategy: Git Worktrees

Each client gets its own **directory** via git worktrees — no branch switching needed.

```
project-root/                       ← main branch (base development)
../clients/little-campus/           ← worktree for client/little-campus
../clients/acme-corp/               ← worktree for client/acme-corp
../clients/acme-corp--modern/       ← concept branch worktree
../clients/acme-corp--classic/      ← concept branch worktree
```

Each worktree is a full working directory with its own `node_modules/`. Agents working in a client worktree never see or affect other clients.

### Concept Branches

Concept branches allow presenting multiple design/content options to a client. They branch off the client branch (not main).

```
main
  └── client/acme-corp              ← primary client branch
        ├── client/acme-corp/concept/modern    ← option A
        ├── client/acme-corp/concept/classic   ← option B
        └── client/acme-corp/concept/bold      ← option C
```

Each concept is a full independent workspace. Deploy concepts as Vercel preview URLs for side-by-side client comparison. When the client picks one, merge it into the primary client branch and delete the others.

In `client.json`, concept branches have `isConcept: true` and `parentBranch` pointing to the primary client branch.

### Client Lifecycle Scripts

```bash
# Create a new client branch + initialize client.json
bash scripts/new-client.sh <slug> [--ref <url>]

# Create a concept branch for design options
bash scripts/new-client.sh <slug> --concept <name>

# Merge latest main into a client branch
bash scripts/sync-client.sh <slug>

# List all client branches and worktree status
bash scripts/list-clients.sh
```

After creating a client branch, set up its worktree:

```bash
git worktree add ../clients/<slug> client/<slug>
cd ../clients/<slug>
npm install
```

### Merge Strategy: Main → Client

When main is updated (new components, bug fixes, agent improvements), sync into client branches:

1. Run `bash scripts/sync-client.sh <slug>`
2. If conflicts occur, they will typically be in client-specific files (`global.css`, `site-meta.json`, `design-tokens.json`). Resolve by keeping client values for design/content and base values for structural changes.
3. Run `npm run build` in the client worktree to verify.

### Agent Behavior by Context

Agents must read `src/data/client.json` to determine their context:

- **On main (`isBase: true`):** Work is generic. Content uses placeholder copy. Design uses neutral tokens. Components must be reusable.
- **On a client branch (`isBase: false`):** Work is client-specific. Use the client name, branding, reference URL, and approved design tokens.

The build workflow (Stage-Gate) applies **per client branch**. Each client has its own `build-state.json` tracking independent progress through stages.

## Key Paths

| What | Where |
|------|-------|
| Content | `src/content/{pages,services,blog}/*.md` |
| Config | `src/data/nav.json`, `footer.json`, `site-meta.json` |
| Client identity | `src/data/client.json` |
| Schemas | `src/content.config.ts` |
| Styles | `src/styles/global.css` |
| Design tokens | `src/data/design-tokens.json` |
| Style tile | `src/pages/style-tile.astro` |
| Build state | `src/data/build-state.json` |
| Eval criteria | `src/data/evaluation-criteria.md` |
| Placeholders | `public/images/placeholders/` |
| Components | `src/components/` |
| Layouts | `src/layouts/BaseLayout.astro` |
| Routes | `src/pages/` |
| CMS reference | `SITE_GUIDE.md` |
| Client scripts | `scripts/new-client.sh`, `sync-client.sh`, `list-clients.sh` |
| Deploy workflow | `.github/workflows/deploy-client.yml` |
| Documentation | `docs/` |

## Documentation

Detailed documentation lives in `docs/`. Agents should reference these for full context:

| Document | What it covers |
|----------|---------------|
| `docs/project-structure.md` | Directory layout, key files, architecture |
| `docs/content-schemas.md` | Zod schemas, frontmatter fields, content collections |
| `docs/design-system.md` | Tailwind theme, tokens, style tile, colors, typography |
| `docs/agent-system.md` | Agent definitions, routing, skills, how they coordinate |
| `docs/build-workflow.md` | Stage-gate process, cohort sequence, evaluation criteria |
| `docs/client-management.md` | Branches, worktrees, concept branches, syncing, scaling |
| `docs/deployment.md` | Vercel setup, automated deploys, concept previews |
| `docs/cms-operations.md` | Day-to-day CMS tasks: create pages, edit content, manage nav |

## Build

```bash
npm run dev          # Dev server at localhost:4321
npm run build        # Production build to dist/
npm run validate     # Config checks + build (use after CMS changes)
```
