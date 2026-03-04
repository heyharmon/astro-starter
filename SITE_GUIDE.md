# Site Guide

This is an Astro starter template for building small client websites (5-10 pages). It uses Vue for interactive components, Tailwind CSS for styling, and Astro Content Collections for all editable content.

**Designed for Claude Code** — all content lives in structured Markdown and JSON files. Content updates never require touching component code.

---

## File Structure

```
astro-starter/
├── astro.config.mjs              # Astro config (integrations, Tailwind, output mode)
├── package.json
├── tsconfig.json
├── SITE_GUIDE.md                  # This file
├── public/
│   └── favicon.svg                # Site favicon
├── src/
│   ├── content.config.ts         # ← Content collection schemas (DO NOT DELETE)
│   ├── styles/
│   │   └── global.css             # Tailwind imports + base styles + prose styling
│   ├── data/
│   │   └── site.json              # ← Global site config (name, nav, footer, socials, Formspree ID)
│   ├── content/                   # ← ALL EDITABLE CONTENT LIVES HERE
│   │   ├── pages/                 # Page content (one .md per page)
│   │   │   ├── home.md
│   │   │   ├── about.md
│   │   │   ├── services.md
│   │   │   └── contact.md
│   │   ├── services/              # Service entries (one .md per service)
│   │   │   ├── web-design.md
│   │   │   ├── seo.md
│   │   │   └── consulting.md
│   │   └── blog/                  # Blog posts (one .md per post)
│   │       ├── welcome-to-our-blog.md
│   │       └── _template.md       # Template for new posts (draft: true)
│   ├── layouts/
│   │   └── BaseLayout.astro       # Main layout (head, header, footer, SEO)
│   ├── components/
│   │   ├── Head.astro             # SEO meta tags (title, OG, Twitter)
│   │   ├── Header.astro           # Navigation bar (reads nav from site.json)
│   │   ├── Footer.astro           # Site footer (reads footer/social from site.json)
│   │   └── ContactForm.vue        # Vue contact form → Formspree
│   └── pages/                     # Route files (fetch content from collections)
│       ├── index.astro            # → /
│       ├── about.astro            # → /about
│       ├── services.astro         # → /services
│       ├── contact.astro          # → /contact
│       └── blog/
│           ├── index.astro        # → /blog
│           └── [...slug].astro    # → /blog/{post-slug}
```

---

## How to Edit Content

### Edit page content

Each page pulls its content from a Markdown file in `src/content/pages/`. Edit the corresponding file:

| Page     | Content file                      |
| -------- | --------------------------------- |
| Home     | `src/content/pages/home.md`       |
| About    | `src/content/pages/about.md`      |
| Services | `src/content/pages/services.md`   |
| Contact  | `src/content/pages/contact.md`    |

**Frontmatter fields** (between `---` markers):

```yaml
---
title: "Page Title"           # Used in browser tab and SEO
description: "Meta desc..."   # Used in search results and social sharing
headline: "Hero Heading"      # Large text shown at top of page
subheadline: "Supporting..."  # Optional smaller text below headline
featuredImage:                 # Optional hero/social image
  src: "/images/hero.jpg"
  alt: "Description"
---

Markdown body content goes here. This is rendered below the hero section.
```

### Edit the site name, navigation, or footer

Edit `src/data/site.json`:

```json
{
  "name": "Your Company",
  "tagline": "Your tagline",
  "url": "https://yourdomain.com",
  "nav": [
    { "label": "Home", "href": "/" },
    { "label": "About", "href": "/about" }
  ],
  "footer": {
    "copyright": "© 2026 Your Company. All rights reserved."
  },
  "social": {
    "twitter": "https://twitter.com/you",
    "linkedin": "",
    "github": ""
  },
  "formspreeId": "YOUR_FORM_ID"
}
```

---

## How to Add a New Service

1. Create a new `.md` file in `src/content/services/`:

```markdown
---
title: "Service Name"
description: "A one-sentence summary of this service."
icon: "◆"
order: 4
---

Detailed description of the service in Markdown.

### What's included

- Feature one
- Feature two
- Feature three
```

2. The service automatically appears on the `/services` page, sorted by the `order` field.

**Available icons**: Use any emoji or Unicode symbol (◆ ◇ ○ ● ■ □ ▲ △ ★ ☆). Or change to text-based icon identifiers if you integrate an icon library later.

---

## How to Write a New Blog Post

1. Copy `src/content/blog/_template.md` or create a new `.md` file in `src/content/blog/`.
2. The filename becomes the URL slug (e.g., `my-new-post.md` → `/blog/my-new-post`).

```markdown
---
title: "Your Post Title"
description: "A brief summary (1-2 sentences). Shown in listings and meta tags."
date: 2026-03-04
author: "Your Name"
tags: ["design", "development"]
# image:
#   src: "/images/blog/cover.jpg"
#   alt: "Cover image description"
draft: false
---

Your post content in Markdown.
```

3. Set `draft: false` to publish. Posts with `draft: true` are hidden from the blog listing.

---

## How to Add a New Page

1. **Create the content file** — Add a new `.md` file in `src/content/pages/`:

```markdown
---
title: "New Page"
description: "What this page is about."
headline: "Page Headline"
subheadline: "Optional supporting text."
---

Page body content in Markdown.
```

2. **Create the route file** — Add a new `.astro` file in `src/pages/`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import { getEntry, render } from "astro:content";

const page = await getEntry("pages", "new-page");
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

3. **Add to navigation** — Add an entry to the `nav` array in `src/data/site.json`.

---

## How to Deploy

### Vercel (recommended)

1. Push to GitHub
2. Import the repo in Vercel dashboard
3. Vercel auto-detects Astro — no special config needed
4. Deploys as static HTML

### Any static host

Run `npm run build` and upload the `dist/` folder to any static hosting provider (Netlify, Cloudflare Pages, GitHub Pages, etc.).

---

## Content Schema Reference

Schemas are defined in `src/content.config.ts`. If you add a field to a schema, all entries in that collection must include it (unless marked optional with `.optional()` or given a default with `.default()`).

### Pages schema

| Field          | Type   | Required | Description                        |
| -------------- | ------ | -------- | ---------------------------------- |
| title          | string | yes      | Page title for SEO                 |
| description    | string | yes      | Meta description                   |
| headline       | string | yes      | Hero heading text                  |
| subheadline    | string | no       | Supporting text below headline     |
| featuredImage  | object | no       | `{ src: string, alt: string }`     |

### Services schema

| Field       | Type   | Required | Description                         |
| ----------- | ------ | -------- | ----------------------------------- |
| title       | string | yes      | Service name                        |
| description | string | yes      | Short summary for listings          |
| icon        | string | yes      | Emoji or icon identifier            |
| order       | number | yes      | Sort order (lower = first)          |

### Blog schema

| Field       | Type     | Required | Default | Description                     |
| ----------- | -------- | -------- | ------- | ------------------------------- |
| title       | string   | yes      |         | Post title                      |
| description | string   | yes      |         | Post summary                    |
| date        | date     | yes      |         | Publish date (YYYY-MM-DD)       |
| author      | string   | no       | "Team"  | Author name                     |
| tags        | string[] | no       | []      | Tags for categorization         |
| image       | object   | no       |         | `{ src: string, alt: string }`  |
| draft       | boolean  | no       | false   | Hide from listings when true    |

---

## Development Commands

```bash
npm run dev       # Start dev server at localhost:4321
npm run build     # Build static site to dist/
npm run preview   # Preview the built site locally
```

---

## Setting Up Formspree

1. Create a free account at [formspree.io](https://formspree.io)
2. Create a new form and copy the form ID (looks like `xyzabcde`)
3. Replace `"YOUR_FORM_ID"` in `src/data/site.json` with your form ID
4. The contact form will now submit to your Formspree endpoint

---

## Architecture Decisions

- **`.astro` for static, `.vue` for interactive** — Only `ContactForm.vue` uses Vue. Everything else is zero-JS Astro components.
- **Content Collections** — All editable content is in `src/content/` with Zod schemas for validation.
- **No CSS framework components** — Pure Tailwind utility classes. No UI library dependency.
- **Static output** — Pre-rendered HTML at build time. No server required.
- **Flat structure** — No nested abstractions. Each page is a single file that fetches its own content.
