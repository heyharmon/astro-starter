# Project Audit — CMS Operator Setup

Date: 2026-03-19

## Directory Structure

```
src/
├── content.config.ts        — Content collection schemas (Zod)
├── components/
│   ├── Head.astro           — SEO meta tags
│   ├── Header.astro         — Navigation bar (imports site.json)
│   ├── Footer.astro         — Footer (imports site.json)
│   └── ContactForm.vue      — Interactive contact form (Vue 3)
├── layouts/
│   └── BaseLayout.astro     — Main layout wrapper
├── content/
│   ├── pages/               — Static page content (home, about, services, contact)
│   ├── services/            — Service offerings (web-design, seo, consulting)
│   └── blog/                — Blog posts + _template.md
├── pages/
│   ├── index.astro          — Home route
│   ├── about.astro          — About route
│   ├── services.astro       — Services listing route
│   ├── contact.astro        — Contact route (imports site.json for formspreeId)
│   └── blog/
│       ├── index.astro      — Blog listing
│       └── [...slug].astro  — Dynamic blog post routes
├── styles/
│   └── global.css           — Tailwind 4 theme, base styles, prose styling
└── data/
    └── site.json            — Centralized site config
```

## Configuration State

| Area | Status | Location | Notes |
|------|--------|----------|-------|
| Nav links | Externalized | `site.json > nav[]` | Array of `{label, href}` — no `order` field |
| Footer | Partial | `site.json > footer.copyright` | Copyright text only, no link sections |
| Social links | Externalized | `site.json > social` | twitter, linkedin, github URLs |
| Site name/tagline | Externalized | `site.json > name, tagline` | — |
| Site URL | Externalized | `site.json > url` | Set to `https://example.com` |
| Meta description | Missing | — | Head.astro falls back to `site.tagline` |
| OG image default | Missing | — | Head.astro uses empty string fallback |
| Formspree ID | Externalized | `site.json > formspreeId` | Set to placeholder `YOUR_FORM_ID` |

## Components Importing site.json

1. `src/components/Header.astro` — reads `site.name`, `site.nav`
2. `src/components/Footer.astro` — reads `site.footer.copyright`, `site.social`
3. `src/components/Head.astro` — reads `site.name`, `site.tagline`, `site.url`
4. `src/pages/contact.astro` — reads `site.formspreeId`

## Content Collections

| Collection | Files | Schema fields |
|------------|-------|---------------|
| pages | 4 (home, about, services, contact) | title, description, headline, subheadline?, featuredImage? |
| services | 3 (web-design, seo, consulting) | title, description, icon, order |
| blog | 1 + template | title, description, date, author?, tags?, image?, draft? |

- Schemas have inline comments but no `.describe()` annotations
- Blog uses `draft: boolean` (not status enum)
- `date` uses `z.coerce.date()`

## Existing Claude Code Setup

- `.claude/settings.json` — `bypassPermissions` mode
- `.claude/commands/content.md` — Content management
- `.claude/commands/design.md` — Design/styling
- `.claude/commands/images.md` — Image generation
- `CLAUDE.md` — Project instructions (architecture rules, design system, commands)
- `SITE_GUIDE.md` — User guide (file structure, how-tos, deployment)

## Styling

- **Framework:** Tailwind CSS 4 (configured in `global.css` via `@theme` block)
- **No tailwind.config.mjs** — all config in CSS
- **Fonts:** Inter (sans), JetBrains Mono (mono)
- **Colors:** Neutral scale 50–950
- **Design tokens:** CSS custom properties in `@theme`

## Validation

- No validation script exists
- No `scripts/` directory
- Build command: `npm run build` (astro build)
