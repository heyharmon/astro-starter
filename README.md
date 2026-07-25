# Astro Starter

A static website starter managed entirely through Claude agents. No CMS dashboard, no manual editing — describe what you want in natural language.

## Quick Start

```bash
npm install
npm run dev    # http://localhost:4321
```

Open the project in Cursor or Visual Studio Code with Claude Code. Tell Claude what you need:

- "Add a team page with bios"
- "Change the accent color to teal"
- "Write a blog post about web design trends"
- "Audit the SEO across all pages"

## How It Works

Five specialist agents handle different aspects of the site. When you make a request, a root orchestrator reads your intent, routes it to the right agent (or breaks it into sub-tasks for multiple agents), and coordinates the result. You never talk to agents directly — just describe what you want.

Agents are defined in `.claude/agents/` as Markdown files with frontmatter. Each file declares the agent's name, description, allowed tools, and a set of skills — named procedures the agent reads and executes when the task matches. The orchestrator picks the agent; the agent picks the skill.

### Agents

| Agent | What it does |
|-------|-------------|
| `content` | Creates, edits, and removes pages, blog posts, and collection entries. Manages nav, footer, and site config JSON. |
| `design` | Changes colors, typography, spacing, layout, and component appearance. Owns `global.css` and Tailwind theme config. |
| `dev` | Bug fixes, new components, schema changes, build config, and any structural code work. |
| `images` | Sources, downloads, and places images. Searches Unsplash, pulls reference site images, maintains visual consistency. |
| `seo` | Audits and updates meta titles, descriptions, and OG images. Handles keyword research and competitor analysis. |
| `deploy` | Deploys to Vercel, manages the Vercel project, domains, environment variables, and CI/CD pipelines. |

See `CLAUDE.md` for routing rules and the full agent capability table.

## Features

- **Three-tier content architecture** — inline `.astro` routes for unique pages, Content Collections with Zod schemas for repeating content (posts, projects), and `src/data/*.json` for structural config. Every page in the starter demonstrates one tier.
- **Live style guide** — `/styleguide` renders a full preview of design tokens, typography scale, and UI components. Backed by `src/styles/global.css` and `src/data/design-tokens.json`.
- **Machine-readable design tokens** — `src/data/design-tokens.json` is the agent-readable source of truth for colors, spacing, and component patterns. Agents read it before making design decisions.
- **Vue 3 contact form** — a working Formspree-backed form rendered as a `client:idle` island. Set `formspreeId` in `src/data/site-meta.json` to activate it.
- **Astro islands demo** — `/islands` shows `client:load`, `client:idle`, and `client:visible` side by side with decision rules for when to reach for each.
- **XML sitemap** — auto-generated at `/sitemap-index.xml` via `@astrojs/sitemap`. Update `site` in `astro.config.mjs` with your production URL.
- **Human-readable sitemap** — `/sitemap` page listing all static pages, blog posts, and projects. Linked from the footer.
- **JSON-LD structured data** — every page emits a `WebSite` schema by default using values from `src/data/site-meta.json`. Pass a custom `jsonLd` object to `BaseLayout` to override on any page.
- **Per-page OG images** — `Head.astro` accepts an `image` prop that overrides the global fallback in `site-meta.json`. Collection schemas (`posts`, `projects`, `pages`) all include a `featuredImage`/`image` field wired through to the OG tags.

## Documentation

| Document | What it covers |
|----------|---------------|
| [Getting Started](docs/getting-started.md) | Setup, first run, how to use the system |
| [Project Structure](docs/project-structure.md) | Directory layout, key files, architecture |
| [Agent System](docs/agent-system.md) | Agent file structure, skill formats, how to extend the system |
| [Content Collections](docs/content-collections.md) | Content architecture, collection purposes, editing workflow |
| [Design System](docs/design-system.md) | Tailwind theme, tokens, colors, typography |

## Commands

```bash
npm run dev       # Dev server
npm run build     # Production build
npm run healthcheck  # Config checks + build
```
