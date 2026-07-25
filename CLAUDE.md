# Claude Code — Project Instructions

Astro 5 static site ("Acme Studio") with Tailwind CSS 4 and React (contact form only). Content Collections with Zod schemas. Static output — no SSR.

## Agents

Five specialist agents. Route every request to the correct one based on task domain. For multi-domain requests, break into sub-tasks and execute foundational changes first. Agents do not call each other — root Claude orchestrates all coordination.

| Agent | When to use | Owns |
|-------|-------------|------|
| `content` | Creating, editing, or removing pages, blog posts, projects, and other collection entries. Markdown body and frontmatter edits. Managing nav, footer, and site config. | `src/content/`, `src/data/`, `src/pages/` (route files for new pages only) |
| `seo` | SEO audits, meta titles/descriptions, OG images, keyword research, competitor and SERP analysis. | SEO frontmatter fields (`title`, `description`, `featuredImage`/`image`, `tags`) and `src/data/site-meta.json` (SEO fields only) |
| `design` | Colors, typography, fonts, spacing, layout, design tokens, component appearance, Tailwind theme, prose styling. | `src/styles/global.css`, Tailwind classes in `.astro` components and layouts |
| `images` | Sourcing, downloading, or placing images. Stock photo search, reference image pulling. | `public/images/` (except `placeholders/`), image frontmatter fields |
| `dev` | Bug fixes, new features, components, schema changes (`content.config.ts`), build config, integrations, refactoring. | Everything not owned above — components, layouts, schemas, build config, static assets |
| `deploy` | Deploying to Vercel, setting up the Vercel project, managing domains, environment variables, and CI/CD pipelines. | `vercel.json`, `.github/workflows/*.yml` |

Each agent's full skill table lives in its definition file: `.claude/agents/<agent>.md`.

## Routing Rules

1. **Single-domain** → delegate directly.
2. **Multi-domain** → break into sub-tasks, execute sequentially, foundational first. Example: "Add a Pricing page with good SEO and styled like About" → Content creates → SEO optimizes → Design adjusts.
3. **Reference-based work** — when the user provides a reference URL to replicate or draw inspiration from, the orchestrator MUST do visual capture before delegating:
   1. Screenshot the reference with the browser skill (`playwright-cli`) — captures layout, imagery, visual weight.
   2. Extract text content with `WebFetch` (headlines, copy, CTAs, structure).
   3. Delegate with both screenshot observations AND extracted text. Design needs to know what the reference *looks like*, not just its colors.
   4. Structural before styling — if the reference requires layout/HTML changes, route to Dev first, then Design.
   5. After all agents finish, screenshot our site and compare against the reference. Flag remaining gaps.
4. **Ambiguous request** → ask the user to clarify before delegating.

## Content Architecture

Three tiers, ordered from simplest to most structured. Pick the right one, don't default to inline. This drives routing: unique-page copy edits go to Content (in the `.astro` route file when no Markdown entry exists); collection work and `src/data/` config also go to Content; schema changes go to Dev.

| # | Tier | Path | Use for |
|---|------|------|---------|
| 1 | **Inline content** | `src/pages/*.astro` (optionally paired with a single entry in `src/content/pages/*.md`) | Genuinely unique pages — homepage, about, contact, bespoke landing pages |
| 2 | **Content Collections** | `src/content/` | Repeating items sharing a Zod schema — blog posts, projects, products, team bios, testimonials, case studies |
| 3 | **Site config** | `src/data/*.json` | Structural data that isn't really content — nav, footer, social handles, pricing tiers, redirects |

There's also a separate axis — **interactivity** — covered by Astro's island model (`client:*` directives on React/Vue/Svelte/Solid components). Islands aren't a fourth tier; any tier can include one. The `/islands` route is a working demo.

### Decision rules

- One-of-a-kind page → **Tier 1** inline in `src/pages/`
- Repeating shape → **Tier 2** in `src/content/`
- Config / structural data → **Tier 3** in `src/data/`
- Trigger to promote Tier 1 → Tier 2: "I'm about to create the second one of these."
- Never inline a list of 5+ similar items in an `.astro` file — promote to a collection.
- Never put unique page copy into a collection just to centralize it.
- Don't create single-entry collections "for consistency." If a unique page later spawns siblings, migrate it then — not preemptively.

Schemas are defined in `src/content.config.ts`. Architecture details and editing workflow: `docs/content-collections.md`.

## Key Paths

| What | Where |
|------|-------|
| Content | `src/content/{pages,projects,posts}/*.md` (services are inline) |
| Schemas | `src/content.config.ts` |
| Site config | `src/data/site-meta.json` (name, URL, description, OG image, social, formspreeId) |
| Navigation | `src/data/nav.json` — `[{ label, href, order }]` |
| Footer | `src/data/footer.json` — `[{ section, links: [{ label, href }] }]` |
| Design tokens | `src/data/design-tokens.json` (machine-readable) + `src/styles/global.css` (CSS source of truth) |
| Components | `src/components/` |
| Layouts | `src/layouts/BaseLayout.astro` |
| Routes | `src/pages/` |
| Placeholders | `public/images/placeholders/` |

For deeper context, see [`docs/`](docs/): `project-structure.md`, `content-collections.md`, `design-system.md`, `agent-system.md`.

## Healthcheck

```bash
npm run healthcheck
```

Checks JSON validity, required fields, non-empty nav, and runs a full Astro build. A task is not complete until healthcheck passes.
