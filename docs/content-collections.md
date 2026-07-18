# Content Collections

Schemas are the source of truth in [`src/content.config.ts`](../src/content.config.ts) — Zod definitions with `.describe()` annotations on every field. Read that file for fields, types, required vs. optional, and defaults. This doc covers the things the schema file can't tell you: which tier content belongs in, what each collection is *for*, and the editing/validation workflow.

## Content Architecture

Astro offers three places to store content. Pick the right one — don't default to inline.

### `src/content/` — Content Collections

Use for **repeating items that share a schema**: blog posts, case studies, products, team bios, testimonials, docs pages.

- Define a Zod schema in `src/content.config.ts` for every collection.
- Query with `getCollection()` and `getEntry()`. Use collection references for relational data.
- Render via dynamic routes: `src/pages/[collection]/[...slug].astro`.
- Schema violations fail `astro build` — Zod runs at content-load time, so `npm run healthcheck` catches them.

**Trigger:** "I'm about to create the second one of these" → make it a collection.

### `src/pages/*.astro` — Inline content

Use for **genuinely unique pages**: homepage, about, contact, services, bespoke landing pages.

- Keep content in the component's frontmatter or template directly, or in a single `.md` entry under `src/content/pages/` rendered by the route.
- Do **not** create single-entry collections to "stay consistent." That's friction without benefit.
- If a unique page later spawns siblings, migrate it to a collection then — not preemptively.

### `src/data/*.json` — Site-wide configuration

Use for **structural data that isn't really content**: nav links, footer, social handles, pricing tiers, feature flags, redirects.

- Import directly in `.astro` files. Keeps templates focused on rendering.

### Decision rules

- Repeating shape → `src/content/`
- One-of-a-kind page → inline in `src/pages/`
- Config / structural data → `src/data/`
- Never inline a list of 5+ similar items in an `.astro` file — promote to a collection.
- Never put unique page copy into a collection just to centralize it — it belongs inline.

## Collections in this project

Defined in [`src/content.config.ts`](../src/content.config.ts). Read the schema for fields. Per-collection purpose and surface:

| Collection | Path | URL surface | Notes |
|------------|------|-------------|-------|
| `pages` | `src/content/pages/*.md` | Rendered by route files in `src/pages/`. Filename = entry ID for `getEntry("pages", id)`. | One entry per unique page. Not a listing. Currently unused — the homepage and estimate page are inline. |
| `posts` | `src/content/posts/*.md` | **`/<slug>` at the site root** (slug = filename), via `src/pages/[slug].astro`. Listed on `/the-mold-academy`, sorted by `date` descending. | The Mold Academy articles. |
| `locations` | `src/content/locations/*.md` | `/locations/<slug>` (slug = filename), via `src/pages/locations/[slug].astro`. | City / region service-area pages. |

Two rules specific to this site:

- **Articles sit at the site root, not under `/blog`.** That mirrors the original WordPress
  permalinks (e.g. `/does-black-mold-smell`). Moving them would break existing inbound links and
  rankings.
- **Location pages are entirely schema-driven.** Every section on `/locations/<slug>` — hero
  bullets, how-it-works steps, pricing, areas served, local mold signs with their 🔎/🏡 callouts,
  value cards, the trust card, FAQs, mold types, and the closing CTA — comes from frontmatter, and
  each section renders only when its field is present. **Adding a city should be a new `.md` file
  and nothing else.** If a new city seems to need template changes, add an optional field rather
  than special-casing that city.

The `projects` collection from the starter has been removed; there is no `/projects` surface.

## Editing content

- Collection entries: edit the `.md`/`.mdx` file in `src/content/`. Don't touch the rendering template unless layout is changing.
- Unique pages: edit the `.astro` file directly, or its single `src/content/pages/*.md` entry if the route renders one.
- Nav / footer / config: edit the relevant JSON in `src/data/`.

## Adding new fields to a schema

1. Update `src/content.config.ts` with the new Zod field.
2. Make new fields **optional with defaults** — never break existing content.
3. Add a `.describe()` annotation explaining the field's purpose.
4. Update content files that should use the new field.
5. Run `npm run healthcheck` — schema violations fail the build.

Never remove or rename existing fields without updating all content files that use them.

## Conventions not enforced by Zod

- Meta `description`: under 155 characters.
- Page `title`: under 60 characters (renders as "Title | Site Name").
- Blog `date`: today's date in `YYYY-MM-DD` format unless the user specifies otherwise.
- Image paths: place files in `public/images/`, reference as `/images/filename.ext`.

## How content is accessed

```astro
---
import { getEntry, getCollection, render } from "astro:content";

const entry = await getEntry("locations", "salt-lake-city-mold-inspection");
const { Content } = await render(entry);

const posts = await getCollection("posts", ({ data }) => !data.draft);
const recent = posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---

<h1>{entry.data.headline}</h1>
<Content />
```

Content is **always** accessed through Astro's Content Collections API — never imported directly or hardcoded into components.
