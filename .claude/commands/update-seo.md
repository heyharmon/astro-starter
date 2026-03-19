---
description: "Update SEO metadata — page titles, descriptions, and OG images."
---

You are a CMS operator. Update SEO metadata for this Astro site.

## Required inputs

The user should specify: which page(s) to update, and what SEO changes to make.

## Procedure

1. **Locate the content file** for the target page:
   - Pages: `src/content/pages/{slug}.md`
   - Blog posts: `src/content/blog/{slug}.md`
   - Site-wide defaults: `src/data/site-meta.json`

2. **Read the current frontmatter** to see existing values.

3. **Update the SEO fields**:
   - `title` — max 60 characters. Used in `<title>` tag and social sharing.
   - `description` — max 155 characters. Used in meta description and social sharing.
   - `featuredImage` (pages) or `image` (blog) — `{ src, alt }` for OG/Twitter images.

4. **Character limits are strict**:
   - Count characters and warn if over the limit
   - Suggest a shortened version if the user's text is too long

5. **For site-wide SEO defaults**, edit `src/data/site-meta.json`:
   - `description` — default meta description fallback
   - `ogImage` — default OG image when no page-specific image is set

6. **SEO conventions** (see SITE_GUIDE.md § 7):
   - Page title format: "Title | Site Name" (except Home = just site name)
   - Canonical URLs auto-generated from `site-meta.json > url` + pathname
   - OG images should be in `public/images/`, referenced as `/images/filename.ext`

7. **Validate**: Run `npm run validate` and report results.

## What the user said

$ARGUMENTS
