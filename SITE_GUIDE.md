# Site Guide — CMS Operations Manual

## 1. Project Overview

Astro static site for a digital agency ("Acme Studio"). Built with Astro 5, Tailwind CSS 4, and Vue 3 (contact form only). All content is managed via Markdown files and JSON config — no CMS UI, no database.

```bash
npm run dev          # Dev server at localhost:4321
npm run build        # Build static site to dist/
npm run preview      # Preview built site
npm run validate     # Full validation (config checks + build)
```

---

## 2. Directory Map

```
src/
├── content.config.ts    → Content collection schemas (Zod validation)
├── content/
│   ├── pages/           → Static page content (home, about, services, contact)
│   ├── services/        → Service offerings (one .md per service)
│   └── blog/            → Blog posts + _template.md
├── data/
│   ├── nav.json         → Navigation links with order
│   ├── footer.json      → Footer link sections
│   ├── site-meta.json   → Site identity, SEO defaults, social links
│   ├── design-tokens.json → Design system tokens (colors, typography, patterns)
│   ├── build-state.json → Stage-gate build progress tracking
│   └── evaluation-criteria.md → Grading rubric for cohort evaluation
├── layouts/
│   └── BaseLayout.astro → Main page wrapper (head, header, footer)
├── components/
│   ├── Head.astro       → SEO meta tags (title, OG, Twitter)
│   ├── Header.astro     → Navigation bar (reads nav.json)
│   ├── Footer.astro     → Footer (reads footer.json + site-meta.json)
│   └── ContactForm.vue  → Vue contact form → Formspree
├── pages/               → Astro route files
│   ├── index.astro      → / (home)
│   ├── about.astro      → /about
│   ├── services.astro   → /services
│   ├── contact.astro    → /contact
│   ├── style-tile.astro  → /style-tile (design system preview, dev-only)
│   └── blog/
│       ├── index.astro      → /blog
│       └── [...slug].astro  → /blog/{slug}
├── styles/
│   └── global.css       → Tailwind theme, base styles, prose styling
public/
├── images/
│   └── placeholders/    → SVG placeholder images (16:9, 1:1, 3:4, 4:3)
└── favicon.svg
```

---

## 3. Configuration Reference

### `src/data/nav.json`

Array of navigation links. Header renders these sorted by `order`.

| Field | Type | Description |
|-------|------|-------------|
| label | string | Display text |
| href | string | URL path (e.g., "/about") |
| order | number | Sort position (lower = first) |

### `src/data/footer.json`

Array of link groups rendered as columns in the footer.

| Field | Type | Description |
|-------|------|-------------|
| section | string | Group heading (e.g., "Company") |
| links | array | Array of `{ label, href }` objects |

### `src/data/site-meta.json`

| Field | Type | Description |
|-------|------|-------------|
| name | string | Site name — shown in header and page titles |
| tagline | string | Short tagline — used in branding |
| description | string | Default meta description — SEO fallback |
| url | string | Production URL — used for canonical URLs and OG tags |
| ogImage | string | Default OG image path (e.g., "/images/og-default.png") |
| copyright | string | Footer copyright text |
| social | object | Social links: `{ twitter, linkedin, github }` — empty string hides the link |
| formspreeId | string | Formspree form ID for the contact form |

---

## 4. Content Schemas

### Pages (`src/content/pages/*.md`)

Static page content. The filename (without `.md`) is the page ID used with `getEntry()`.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| title | string | yes | — | Page title for `<title>` tag and SEO |
| description | string | yes | — | Meta description for search results and social sharing |
| headline | string | yes | — | Hero heading — large text at top of page |
| subheadline | string | no | — | Supporting text below the headline |
| featuredImage | object | no | — | `{ src: "/images/...", alt: "..." }` — hero image and social sharing |

```yaml
---
title: "About Us"
description: "Learn about our team and mission."
headline: "We build things that matter"
subheadline: "A small team with big ambitions."
featuredImage:
  src: "/images/about-hero.jpg"
  alt: "Team working together"
---
```

### Services (`src/content/services/*.md`)

Each file is a service offering. Auto-listed on `/services`, sorted by `order`.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| title | string | yes | — | Service name — card title |
| description | string | yes | — | Short summary for listing page |
| icon | string | yes | — | Emoji or icon character (e.g., "◆") |
| order | number | yes | — | Sort position (lower = first) |

```yaml
---
title: "Web Design"
description: "Beautiful, responsive websites built for results."
icon: "◆"
order: 1
---
```

### Blog (`src/content/blog/*.md`)

Blog posts. Filename becomes URL slug. Template at `src/content/blog/_template.md`.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| title | string | yes | — | Post title |
| description | string | yes | — | Post summary for listings and meta |
| date | date | yes | — | Publish date (YYYY-MM-DD) |
| author | string | no | "Team" | Author name |
| tags | string[] | no | [] | Tags for categorization |
| image | object | no | — | `{ src: "/images/...", alt: "..." }` — cover image |
| draft | boolean | no | false | `true` hides from listings |

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

---

## 5. CMS Operations — Standard Procedures

### Create a new page

1. Create content file at `src/content/pages/{slug}.md` with required frontmatter (`title`, `description`, `headline`)
2. Create route file at `src/pages/{slug}.astro`:
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
3. If the page should appear in navigation, add an entry to `src/data/nav.json`
4. Run validation: `npm run validate`

### Edit page content

1. Locate the file in `src/content/` (pages, services, or blog)
2. Edit the markdown body content
3. Do NOT modify frontmatter fields unless specifically asked to
4. Run validation: `npm run validate`

### Update SEO metadata

1. Edit the page's frontmatter fields:
   - `title` — max 60 characters
   - `description` — max 155 characters
   - `featuredImage` or `image` — for social sharing
2. For site-wide SEO defaults, edit `src/data/site-meta.json` (`description`, `ogImage`)
3. Run validation: `npm run validate`

### Modify navigation

1. Edit `src/data/nav.json`
2. Each entry needs `label`, `href`, and `order`
3. Ensure `order` values are sequential and non-conflicting
4. Run validation: `npm run validate`

### Modify footer links

1. Edit `src/data/footer.json`
2. Add/remove link groups or individual links within groups
3. Run validation: `npm run validate`

### Create a new blog post

1. Copy `src/content/blog/_template.md` to `src/content/blog/{slug}.md`
2. Set `title`, `description`, `date` (today: YYYY-MM-DD)
3. Write the post body in markdown
4. Set `draft: false` to publish (or `true` to keep hidden)
5. Run validation: `npm run validate`

### Change site-wide styles

1. Identify whether the change is a **token change** or a **component change**
2. For design tokens (colors, fonts, spacing): edit `src/styles/global.css` `@theme` block
3. For base element styles: edit `src/styles/global.css` `@layer base` block
4. For component-specific styles: edit the Tailwind classes in the relevant `.astro` component
5. Do NOT add inline `<style>` blocks to components
6. Run validation: `npm run validate`

---

## 6. Styling Reference

- **Framework**: Tailwind CSS 4 — configured entirely in `src/styles/global.css` (no `tailwind.config` file)
- **Theme block**: `@theme` in `global.css` defines CSS custom properties

### Fonts
- Sans: Inter (`--font-sans`)
- Mono: JetBrains Mono (`--font-mono`)

### Color Palette (Neutral scale)
| Token | Value | Usage |
|-------|-------|-------|
| neutral-50 | #fafafa | Footer background |
| neutral-100 | #f5f5f5 | Code block background |
| neutral-200 | #e5e5e5 | Borders, dividers |
| neutral-300 | #d4d4d4 | — |
| neutral-400 | #a3a3a3 | — |
| neutral-500 | #737373 | Secondary text, muted content |
| neutral-600 | #525252 | Body paragraph text |
| neutral-700 | #404040 | — |
| neutral-800 | #262626 | — |
| neutral-900 | #171717 | Primary text, headings |
| neutral-950 | #0a0a0a | — |

### Typography Scale
- **h1**: `text-4xl sm:text-5xl font-semibold tracking-tight`
- **h2**: `text-2xl sm:text-3xl font-semibold tracking-tight`
- **h3**: `text-xl font-medium`
- **p**: `leading-relaxed text-neutral-600`

### Layout Conventions
- Max width: `max-w-5xl`
- Horizontal padding: `px-6`
- Section vertical padding: `py-24 sm:py-32`
- Cards: `rounded-xl border border-neutral-200 p-8`
- Buttons: `rounded-lg px-6 py-3`

### What NOT to change without explicit instruction
- Font families
- The neutral color scale values
- Base typography sizes
- Max width constraint

---

## 7. SEO Conventions

### Frontmatter → Meta Tag Mapping

| Frontmatter field | Meta tag | Notes |
|-------------------|----------|-------|
| title | `<title>`, `og:title`, `twitter:title` | Format: "Title \| Site Name" (except Home = just site name) |
| description | `meta[name=description]`, `og:description`, `twitter:description` | Falls back to `site-meta.json > description > tagline` |
| featuredImage.src / image.src | `og:image`, `twitter:image` | Falls back to `site-meta.json > ogImage` |

### Canonical URLs
- Auto-generated from `site-meta.json > url` + current pathname
- Override with `canonicalURL` prop on Head component

### OG Image Conventions
- Default fallback: `site-meta.json > ogImage`
- Place images in `public/images/`
- Reference as `/images/filename.ext` (no `public/` prefix)

---

## 8. Style Tile & Design Tokens

### Style Tile Page (`/style-tile`)

A development-only page that previews the full design system. Not included in navigation or SEO. Located at `src/pages/style-tile.astro`.

**Layer 1 (Atomic):** Color swatches, typography samples, buttons, form inputs, borders/effects.

**Layer 2 (Component Patterns):** Hero sections, card variants, CTA bands, section layouts, nav/footer previews. This section grows — when building a new page type, add the new pattern to the style tile.

The style tile does NOT use BaseLayout — it renders nav/footer as specimens, not wrappers. It imports `global.css` directly so it reflects live tokens.

### Design Tokens (`src/data/design-tokens.json`)

Machine-readable design system that agents reference as the source of truth for styling decisions. Contains:

- `colors` — background, text, border, and button color mappings (Tailwind class names)
- `typography` — font families, heading/body class conventions
- `spacing` — section padding, container width, grid gaps
- `effects` — border radius, shadows, overlay opacities
- `componentPatterns` — named patterns (hero-fullbleed, card-overlay, etc.) with descriptions

**When to update:** After any change to `global.css` tokens or when introducing a new component pattern during page building, update both the CSS and the JSON to stay in sync.

**How agents use it:** Read `design-tokens.json` to know which Tailwind classes to use for backgrounds, text, borders, and component patterns. Read `global.css` for raw CSS variable values.

### Placeholder Images (`public/images/placeholders/`)

SVG placeholder images at standard aspect ratios. Use these wherever a real image hasn't been sourced yet:

| File | Ratio | Use for |
|------|-------|---------|
| `hero-16x9.svg` | 16:9 | Hero backgrounds, CTA bands |
| `square-1x1.svg` | 1:1 | Thumbnails, avatars |
| `portrait-3x4.svg` | 3:4 | Team photos, tall cards |
| `landscape-4x3.svg` | 4:3 | Project images, service cards |

Referenced as `/images/placeholders/hero-16x9.svg` from any page.

### Build State (`src/data/build-state.json`)

Tracks progress through the stage-gate site build workflow. Agents and the orchestrator read this at session start. See CLAUDE.md "Site Build Workflow" for stage definitions.

---

## 9. Validation Checklist

After every content or config change, run:

```bash
npm run validate
# or
./scripts/validate.sh
```

This checks:
1. All data files (`nav.json`, `footer.json`, `site-meta.json`) are valid JSON
2. Required fields exist in `site-meta.json` (`name`, `url`, `description`)
3. `nav.json` is a non-empty array
4. Full Astro build passes (catches schema errors, broken references, missing assets)

**Do not consider a task complete until validation passes.**

If validation fails:
1. Read the error message carefully
2. Fix the identified issue (usually a frontmatter typo or missing field)
3. Re-run validation
4. Repeat until clean
