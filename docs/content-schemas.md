# Content Schemas

All content is stored in Markdown files with YAML frontmatter, validated by Zod schemas defined in `src/content.config.ts`. Astro's Content Collections API loads and validates content at build time.

## Pages (`src/content/pages/*.md`)

Static page content. The filename (without `.md`) is the page ID used with `getEntry("pages", "home")`.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `title` | string | yes | — | Page title for `<title>` tag and SEO |
| `description` | string | yes | — | Meta description for search results and social sharing |
| `headline` | string | yes | — | Hero heading — large text at top of page |
| `subheadline` | string | no | — | Supporting text below the headline |
| `featuredImage` | object | no | — | Hero image and social sharing |
| `featuredImage.src` | string | — | — | Path to image (e.g. `/images/hero.jpg`) |
| `featuredImage.alt` | string | — | — | Accessible alt text |
| `draft` | boolean | no | `false` | Hides from listings during content drafting stage |

### Example

```yaml
---
title: "About Us"
description: "Learn about our team and mission."
headline: "We build things that matter"
subheadline: "A small team with big ambitions."
featuredImage:
  src: "/images/about-hero.jpg"
  alt: "Team working together"
draft: false
---

Page body content in Markdown goes here.
```

## Services (`src/content/services/*.md`)

Each file is a service offering, auto-listed on `/services` sorted by `order`.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `title` | string | yes | — | Service name (card title) |
| `description` | string | yes | — | Short summary for listing page |
| `icon` | string | yes | — | Emoji or icon character (e.g. `"◆"`) |
| `image` | object | no | — | Background image for cards |
| `image.src` | string | — | — | Path to image |
| `image.alt` | string | — | — | Accessible alt text |
| `order` | number | yes | — | Sort position (lower = first) |

### Example

```yaml
---
title: "Web Design"
description: "Beautiful, responsive websites built for results."
icon: "◆"
order: 1
---

Detailed service description in Markdown.
```

## Projects (`src/content/projects/*.md`)

Completed project showcases. The `projects` collection is defined in the schema but the content directory may not exist yet on the base template.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `title` | string | yes | — | Project name |
| `description` | string | yes | — | Short summary for cards |
| `client` | string | no | — | Client name |
| `location` | string | no | — | Project location |
| `image` | object | no | — | Project image |
| `image.src` | string | — | — | Path to image |
| `image.alt` | string | — | — | Accessible alt text |
| `order` | number | yes | — | Sort position (lower = first) |
| `featured` | boolean | no | `false` | Show on homepage featured section |

## Blog (`src/content/blog/*.md`)

Blog posts. The filename becomes the URL slug. A template file at `src/content/blog/_template.md` provides the starting point for new posts.

**Note:** The blog collection is documented in `SITE_GUIDE.md` and content files exist, but the blog collection schema is not currently defined in `content.config.ts`. It should be added if blog functionality is needed.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `title` | string | yes | — | Post title |
| `description` | string | yes | — | Post summary for listings and meta |
| `date` | date | yes | — | Publish date (`YYYY-MM-DD`) |
| `author` | string | no | `"Team"` | Author name |
| `tags` | string[] | no | `[]` | Tags for categorization |
| `image` | object | no | — | Cover image |
| `image.src` | string | — | — | Path to image |
| `image.alt` | string | — | — | Accessible alt text |
| `draft` | boolean | no | `false` | Hides from listings when `true` |

### Example

```yaml
---
title: "Getting Started with Web Design"
description: "Tips for launching your first website project."
date: 2026-03-19
author: "Jane Doe"
tags: ["design", "tips"]
image:
  src: "/images/blog/web-design-tips.jpg"
  alt: "Design workspace"
draft: false
---
```

## Adding New Fields

When adding new frontmatter fields to any schema:

1. Update `src/content.config.ts` with the new Zod field definition
2. Make new fields **optional with defaults** to avoid breaking existing content
3. Add `.describe()` annotation explaining the field's purpose
4. Update the relevant content files to use the new field
5. Run `npm run validate` to verify all existing content still passes

Never remove or rename existing fields without updating all content files that use them.

## How Content Is Accessed

In `.astro` page files:

```astro
---
import { getEntry, getCollection, render } from "astro:content";

// Single entry by ID (filename without .md)
const page = await getEntry("pages", "home");
const { Content } = await render(page);

// All entries in a collection
const services = await getCollection("services");
const sorted = services.sort((a, b) => a.data.order - b.data.order);
---

<h1>{page.data.headline}</h1>
<Content />
```

Content is **always** accessed through Astro's Content Collections API, never imported directly or hardcoded into components.
