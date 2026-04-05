# CMS Operations

Day-to-day content management tasks. These are the operations a non-developer performs to maintain a client site.

## Creating a New Page

1. **Create the content file** at `src/content/pages/{slug}.md`:

```yaml
---
title: "Team"
description: "Meet the people behind Acme Corp."
headline: "Our Team"
subheadline: "Passionate people building great things."
---

Page body content in Markdown.
```

2. **Create the route file** at `src/pages/{slug}.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import { getEntry, render } from "astro:content";

const page = await getEntry("pages", "{slug}");
const { Content } = await render(page);
---

<BaseLayout title={page.data.title} description={page.data.description}>
  <section class="mx-auto max-w-5xl px-6 py-24 sm:py-32">
    <h1 class="max-w-3xl">{page.data.headline}</h1>
    {page.data.subheadline && (
      <p class="mt-6 max-w-2xl text-lg text-neutral-500">
        {page.data.subheadline}
      </p>
    )}
  </section>
  <section class="mx-auto max-w-5xl px-6 pb-24">
    <div class="prose">
      <Content />
    </div>
  </section>
</BaseLayout>
```

3. **Add to navigation** (if needed) — add an entry to `src/data/nav.json`.

4. **Validate**: `npm run validate`

## Editing Page Content

1. Locate the file in `src/content/` (pages, services, or blog)
2. Edit the Markdown body content
3. Leave frontmatter unchanged unless the edits change the page's fundamental identity (in which case, update `title`, `description`, `headline`, and `subheadline` to match)
4. Validate: `npm run validate`

## Creating a Blog Post

1. Copy `src/content/blog/_template.md` to `src/content/blog/{slug}.md`
2. Set required frontmatter: `title`, `description`, `date` (YYYY-MM-DD format)
3. Write the post body in Markdown
4. Set `draft: false` to publish (or `true` to keep hidden)
5. Validate: `npm run validate`

## Managing Navigation

Edit `src/data/nav.json`. Each entry needs `label`, `href`, and `order`:

```json
[
  { "label": "Home", "href": "/", "order": 0 },
  { "label": "About", "href": "/about", "order": 1 },
  { "label": "Services", "href": "/services", "order": 2 },
  { "label": "Contact", "href": "/contact", "order": 4 }
]
```

Ensure `order` values are sequential and non-conflicting. Validate after changes.

## Managing Footer Links

Edit `src/data/footer.json`. Link groups render as columns:

```json
[
  {
    "section": "Company",
    "links": [
      { "label": "About", "href": "/about" },
      { "label": "Services", "href": "/services" },
      { "label": "Contact", "href": "/contact" }
    ]
  }
]
```

## Updating Site Metadata

Edit `src/data/site-meta.json`:

| Field | What it controls |
|-------|-----------------|
| `name` | Header text, page title suffix |
| `tagline` | Branding tagline |
| `description` | Default meta description (SEO fallback) |
| `url` | Canonical URLs, OG tags |
| `ogImage` | Default social sharing image |
| `copyright` | Footer copyright text |
| `social` | Social media links (empty string hides the link) |
| `formspreeId` | Contact form submission endpoint |

## Updating SEO Metadata

Edit frontmatter fields on individual pages:

| Field | Max Length | Notes |
|-------|-----------|-------|
| `title` | 60 chars | Rendered as "Title \| Site Name" (except homepage) |
| `description` | 155 chars | Must be unique per page |
| `featuredImage` / `image` | — | Path + alt text for OG/Twitter cards |

For site-wide SEO defaults, edit `site-meta.json` (`description`, `ogImage`).

## Adding a Service

Create `src/content/services/{slug}.md`:

```yaml
---
title: "Consulting"
description: "Expert guidance for your digital strategy."
icon: "◆"
order: 4
---

Detailed service description in Markdown.
```

Services are auto-listed on `/services` sorted by `order`.

## Content Quality Standards

- Paragraphs: 2-4 sentences, short and scannable
- Meta descriptions: under 155 characters
- Page titles: under 60 characters
- Use Markdown formatting: bold for emphasis, lists for multiple items, headings for structure
- Blog posts: always set `date` to the publish date in YYYY-MM-DD format

## Validation

After every change, run:

```bash
npm run validate
```

This checks:
1. All data files are valid JSON
2. Required fields exist in `site-meta.json`
3. `nav.json` is a non-empty array
4. `client.json` is valid JSON
5. Full Astro build passes (catches schema errors, broken references, missing assets)

A task is not complete until validation passes.
