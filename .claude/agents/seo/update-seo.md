---
description: "Update SEO metadata — page titles, descriptions, and OG images."
---

Update SEO metadata for this Astro site.

## Required inputs

The user should specify: which page(s) to update, and what SEO changes to make.

## Procedure

1. **Read the site config** (`src/data/site-meta.json`) to get the site name — you need this to calculate rendered title length.

2. **Locate the content file** for the target page:
   - Pages: `src/content/pages/{slug}.md`
   - Blog posts: `src/content/blog/{slug}.md`
   - Services: `src/content/services/{slug}.md`
   - Site-wide defaults: `src/data/site-meta.json`

3. **Read the current frontmatter** to see existing values.

4. **Update the SEO fields**:
   - `title` — rendered as "Title | Site Name" by Head.astro. The **rendered** title must be under 60 characters. Calculate: raw title + " | " + site name.
   - `description` — max 155 characters. Must be unique across all pages.
   - `featuredImage` (pages) or `image` (blog) — `{ src, alt }` for OG/Twitter images.

5. **Character limits are strict**:
   - Count characters for both raw and rendered title
   - Count description characters
   - Warn if over the limit and suggest a shortened version

6. **For site-wide SEO defaults**, edit `src/data/site-meta.json`:
   - `description` — default meta description fallback
   - `ogImage` — default OG image when no page-specific image is set
   - `url` — must be the real production URL (not "example.com")

7. **SEO conventions** (see SITE_GUIDE.md § 7):
   - Page title format: "Title | Site Name" (except Home = just site name)
   - Canonical URLs auto-generated from site config `url` + pathname
   - OG images should be in `public/images/`, referenced as `/images/filename.ext`

8. **Validate**: Run `npm run validate`. If unavailable, run `npm run build`.

## What the user said

$ARGUMENTS
