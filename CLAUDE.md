# Astro Starter — Claude Code CMS

This project is an Astro static site starter designed to be managed entirely through Claude Code. Claude Code replaces the traditional CMS — all content, design, and media are managed via slash commands and direct file editing.

## Project Overview

- **Framework**: Astro 5 with static output
- **Styling**: Tailwind CSS 4 (utility classes, no component library)
- **Interactive**: Vue 3 (used only for `ContactForm.vue`)
- **Content**: Astro Content Collections with Zod schemas

## Key Architecture Rules

1. **Content lives in `src/content/`** — never hardcode text into `.astro` page files
2. **Schemas are in `src/content.config.ts`** — if you add a frontmatter field, update the schema first
3. **Site config lives in `src/data/site.json`** — name, nav, footer, socials, Formspree ID
4. **Styles live in `src/styles/global.css`** — Tailwind theme, base styles, prose styling
5. **`.astro` for static, `.vue` for interactive** — only add Vue components when client-side JS is required
6. **Static output** — no SSR, no server. Everything pre-renders at build time

## Content Collections

| Collection | Directory | Schema fields |
|------------|-----------|---------------|
| pages | `src/content/pages/` | title, description, headline, subheadline?, featuredImage? |
| services | `src/content/services/` | title, description, icon, order |
| blog | `src/content/blog/` | title, description, date, author?, tags?, image?, draft? |

## File Conventions

- **Page content**: `src/content/pages/{slug}.md` — one file per page
- **Page routes**: `src/pages/{slug}.astro` — fetches content via `getEntry("pages", "{slug}")`
- **Services**: `src/content/services/{slug}.md` — auto-listed on `/services`, sorted by `order`
- **Blog posts**: `src/content/blog/{slug}.md` — filename becomes URL slug, `draft: true` hides from listing
- **Blog template**: `src/content/blog/_template.md` — copy this for new posts

## Adding a New Page

1. Create `src/content/pages/{slug}.md` with required frontmatter (title, description, headline)
2. Create `src/pages/{slug}.astro` that imports BaseLayout and fetches the content entry
3. Add nav entry to `src/data/site.json` if the page should appear in navigation

## Design System

- **Font**: Inter (sans), JetBrains Mono (mono)
- **Color palette**: Neutral scale (50–950) defined in `src/styles/global.css` `@theme` block
- **Layout**: Max width `max-w-5xl`, horizontal padding `px-6`, vertical padding `py-24 sm:py-32`
- **Typography**: h1 = `text-4xl sm:text-5xl font-semibold tracking-tight`, h2 = `text-2xl sm:text-3xl`, h3 = `text-xl font-medium`
- **Components**: Cards use `rounded-xl border border-neutral-200 p-8`, buttons use `rounded-lg px-6 py-3`

## Commands

```bash
npm run dev       # Start dev server at localhost:4321
npm run build     # Build static site to dist/
npm run preview   # Preview built site locally
```

## When Editing This Project

- Always read the target file before editing it
- When creating content, follow the existing frontmatter schema exactly
- When modifying styles, edit `src/styles/global.css` — do not add inline `<style>` blocks to components
- When adding Tailwind classes, use the neutral color scale and existing spacing patterns
- Run `npm run build` after structural changes to verify the site compiles
- Images go in `public/images/` and are referenced as `/images/filename.ext`
