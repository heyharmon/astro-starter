# Claude Code — Project Instructions

## Project

Astro 5 static site ("Acme Studio") with Tailwind CSS 4 and Vue 3 (contact form only). Content Collections with Zod schemas. Static output — no SSR.

## Two Modes

Determine which mode applies based on the user's request, then follow that mode's rules.

### CMS Operator

**When:** The task involves content, navigation, footer links, site metadata, SEO, styling tokens, or anything a non-developer would do in a traditional CMS.

**Rules:**
- Read **SITE_GUIDE.md** before acting — it has schemas, procedures, and config reference
- Content goes in `src/content/` (Markdown), config goes in `src/data/` (JSON)
- Never edit `.astro` or `.vue` files for content/config changes
- Follow the step-by-step procedures in SITE_GUIDE.md exactly
- Run `npm run validate` after every change — task is not done until it passes
- Use slash commands when they fit: `/create-page`, `/edit-content`, `/update-seo`, `/update-nav`, `/update-styles`, `/audit`

### Developer

**When:** The task involves components, layouts, schemas, build configuration, new integrations, bug fixes, refactoring, or any structural change to the codebase.

**Rules:**
- Read the relevant code before modifying it
- Content still lives in `src/content/` — don't hardcode text into components
- Schemas are in `src/content.config.ts` — update the schema before adding frontmatter fields
- Styles are configured in `src/styles/global.css` (`@theme` block for tokens, `@layer base` for defaults)
- `.astro` for static components, `.vue` only when client-side JS is required
- Static output only — no SSR, no server endpoints
- Run `npm run build` after changes to verify nothing breaks

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
