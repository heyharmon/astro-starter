# Claude Code — Project Instructions

## Project

Astro 5 static site ("Acme Studio") with Tailwind CSS 4 and Vue 3 (contact form only). Content Collections with Zod schemas. Static output — no SSR.

## Agents

This project uses four specialist agents. Route every user request to the correct agent based on the task domain. If a request spans multiple domains, break it into sub-tasks and invoke agents sequentially — foundational changes first.

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

### Dev Agent → `dev`

**When:** Bug fixes, new features, component development, schema changes (content.config.ts), build configuration, new integrations, refactoring, performance work, or any structural codebase change.

**Owns:** Everything not owned by Content, SEO, or Design — components, layouts, schemas, build config, scripts, static assets

**Skills:** None (general-purpose developer)

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
4. **Content (images)** — sources and places images via Unsplash skill
5. **Evaluate** — screenshots at 1280px + 375px, grades against `src/data/evaluation-criteria.md`
6. **Report** — presents screenshots, scores, and flagged issues to human

### State Tracking

Update `src/data/build-state.json` after each stage transition and cohort completion. Include which pages belong to each cohort and their approval status.

**Inference fallback** (if state file is missing): style-tile.astro has non-default content → style done. nav.json has real pages → sitemap done. Content files have body text → drafts exist.

## Key Paths

| What | Where |
|------|-------|
| Content | `src/content/{pages,services,blog}/*.md` |
| Config | `src/data/nav.json`, `footer.json`, `site-meta.json` |
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
| CMS manual | `SITE_GUIDE.md` |

## Build

```bash
npm run dev          # Dev server at localhost:4321
npm run build        # Production build to dist/
npm run validate     # Config checks + build (use after CMS changes)
```
