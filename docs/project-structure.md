# Project Structure

## Directory Layout

```
.
├── CLAUDE.md                  → Agent routing, ownership, content architecture, build workflow, key paths (Claude reads this first)
├── docs/                      → Human + agent documentation (this directory)
├── astro.config.mjs           → Astro 5 config (static output, React, Tailwind)
├── package.json               → Dependencies and scripts
├── tsconfig.json              → TypeScript config (strict mode)
├── scripts/
│   └── healthcheck.sh         → JSON validation + Astro build
├── .claude/
│   ├── settings.json          → Claude Code permissions
│   └── agents/                → Agent definitions and skills
│       ├── shared/            → Shared skills (available to all agents)
│       │   └── browser/       → Browser operations (screenshots, comparison)
│       ├── content.md         → Content agent definition
│       ├── design.md          → Design agent definition
│       ├── dev.md             → Dev agent definition
│       ├── images.md          → Images agent definition
│       ├── seo.md             → SEO agent definition
│       ├── content/           → Content agent skills
│       ├── design/            → Design agent skills
│       ├── dev/               → Dev agent skills
│       ├── images/            → Images agent skills
│       └── seo/               → SEO agent skills
├── src/
│   ├── content.config.ts      → Content collection schemas (Zod)
│   ├── content/
│   │   ├── projects/          → Project showcases (one .md per project)
│   │   └── services/          → Service pages (one .md per service)
│   ├── data/
│   │   ├── nav.json           → Navigation links with sort order
│   │   ├── footer.json        → Footer link groups
│   │   ├── site-meta.json     → Site name, URL, SEO defaults, social links
│   │   ├── design-tokens.json → Machine-readable design system for agents
│   │   ├── build-state.json   → Stage-gate build progress
│   │   └── evaluation-criteria.md → Grading rubric for page evaluation
│   ├── layouts/
│   │   └── BaseLayout.astro   → Page wrapper (Head, Header, Footer, slot)
│   ├── components/
│   │   ├── Head.astro         → SEO meta tags (title, OG, Twitter, canonical)
│   │   ├── Header.astro       → Navigation bar (reads nav.json)
│   │   ├── Footer.astro       → Footer (reads site-meta.json)
│   │   └── ContactForm.jsx    → React contact form (Formspree submission)
│   ├── pages/
│   │   ├── index.astro        → / (homepage)
│   │   ├── services.astro     → /services (listing; tiles link to detail pages)
│   │   ├── services/[...slug].astro → /services/[slug] (dynamic, services collection)
│   │   ├── team.astro         → /team
│   │   ├── contact.astro      → /contact
│   │   ├── projects/          → /projects and /projects/[slug] (dynamic, projects collection)
│   │   └── styleguide.astro   → /styleguide (design system preview, noindex)
│   └── styles/
│       └── global.css         → Tailwind 4 theme, base styles, prose styling
└── public/
    ├── favicon.svg
    └── images/
        └── placeholders/      → SVG placeholders (hero-16x9, square-1x1, etc.)
```

## Key Architecture Decisions

### Static Output Only

The site builds to static HTML — no SSR, no server endpoints, no dynamic server-side logic. Everything is resolved at build time.

### Content Collections

All content lives in Markdown files with Zod-validated frontmatter. Astro's Content Collections API (`getEntry`, `getCollection`, `render`) is the only way to access content from page templates.

### Tailwind CSS 4

Configured entirely in `src/styles/global.css` via `@theme` blocks — there is no `tailwind.config` file. The Vite plugin (`@tailwindcss/vite`) handles integration.

### React — Minimal Usage

React is used only for `ContactForm.jsx` (client-side form submission to Formspree). All other components are `.astro` files (zero client-side JavaScript). Don't add React components unless client-side interactivity is truly required.

### Data-Driven Components

Components read from `src/data/*.json` at build time. The Header reads `nav.json`, the Footer reads `site-meta.json`, etc. Content never lives in component files.

## Configuration Files

### `astro.config.mjs`

Static output mode, React integration via `@astrojs/react`, Tailwind via `@tailwindcss/vite`.

### `src/data/site-meta.json`

Site-wide identity: name, tagline, description, production URL, OG image default, copyright text, social links, Formspree ID.

### `src/data/nav.json`

Array of `{ label, href, order }` objects. The Header component renders these sorted by `order`.

### `src/data/footer.json`

Array of link groups: `{ section, links: [{ label, href }] }`. Rendered as columns in the footer.

### `src/data/design-tokens.json`

Machine-readable design system. Agents reference this as the source of truth for which Tailwind classes to use for backgrounds, text, borders, buttons, spacing, and component patterns. See [Design System](design-system.md).

### `src/data/build-state.json`

Tracks progress through the stage-gate build workflow. Includes current stage, completed stages, cohort assignments, and approval status. See [Build Workflow](build-workflow.md).
