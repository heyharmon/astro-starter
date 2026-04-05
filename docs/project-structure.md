# Project Structure

## Directory Layout

```
.
├── CLAUDE.md                  → Agent routing rules (Claude reads this first)
├── SITE_GUIDE.md              → Condensed CMS reference for agents
├── docs/                      → Human + agent documentation (this directory)
├── astro.config.mjs           → Astro 5 config (static output, Vue, Tailwind)
├── package.json               → Dependencies and scripts
├── tsconfig.json              → TypeScript config (strict mode)
├── scripts/
│   ├── validate.sh            → JSON validation + Astro build
│   ├── new-client.sh          → Create client/concept branches
│   ├── sync-client.sh         → Merge main into client branches
│   └── list-clients.sh        → List all client branches and worktrees
├── .claude/
│   ├── settings.json          → Claude Code permissions
│   └── agents/                → Agent definitions and skills
│       ├── content.md         → Content agent definition
│       ├── design.md          → Design agent definition
│       ├── dev.md             → Dev agent definition
│       ├── images.md          → Images agent definition
│       ├── seo.md             → SEO agent definition
│       ├── deploy.md          → Deploy agent definition
│       ├── content/           → Content agent skills
│       ├── design/            → Design agent skills
│       ├── dev/               → Dev agent skills
│       ├── images/            → Images agent skills
│       ├── seo/               → SEO agent skills
│       └── deploy/            → Deploy agent skills
├── .github/
│   └── workflows/
│       └── deploy-client.yml  → GitHub Actions auto-deploy for client branches
├── src/
│   ├── content.config.ts      → Content collection schemas (Zod)
│   ├── content/
│   │   ├── pages/             → Static page content (home, about, services, contact)
│   │   ├── services/          → Service offerings (one .md per service)
│   │   └── blog/              → Blog posts + _template.md
│   ├── data/
│   │   ├── client.json        → Client identity (base vs. client, deploy config)
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
│   │   └── ContactForm.vue    → Vue 3 contact form (Formspree submission)
│   ├── pages/
│   │   ├── index.astro        → / (homepage)
│   │   ├── about.astro        → /about
│   │   ├── services.astro     → /services
│   │   ├── contact.astro      → /contact
│   │   └── style-tile.astro   → /style-tile (design system preview, noindex)
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

### Vue 3 — Minimal Usage

Vue is used only for `ContactForm.vue` (client-side form submission to Formspree). All other components are `.astro` files (zero client-side JavaScript). Don't add Vue components unless client-side interactivity is truly required.

### Data-Driven Components

Components read from `src/data/*.json` at build time. The Header reads `nav.json`, the Footer reads `site-meta.json`, etc. Content never lives in component files.

## Configuration Files

### `astro.config.mjs`

Static output mode, Vue integration via `@astrojs/vue`, Tailwind via `@tailwindcss/vite`.

### `src/data/client.json`

Identifies whether this workspace is the base template (`isBase: true`) or a client branch. Agents read this first to determine context. See [Client Management](client-management.md).

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
