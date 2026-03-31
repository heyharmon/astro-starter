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
3. **Ambiguous request** → Ask the user to clarify before delegating.
4. **Agents do not call each other.** Root Claude orchestrates all inter-agent coordination.

## Key Paths

| What | Where |
|------|-------|
| Content | `src/content/{pages,services,blog}/*.md` |
| Config | `src/data/nav.json`, `footer.json`, `site-meta.json` |
| Schemas | `src/content.config.ts` |
| Styles | `src/styles/global.css` |
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
