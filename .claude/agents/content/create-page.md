---
description: "Create a new page — content file, route file, and optional nav entry."
---

Create a new page for this Astro site.

## Required inputs

The user should provide: page topic or title, and optionally the slug, description, and whether to add it to navigation.

## Procedure

1. **Determine the slug** from the user's input (lowercase, hyphenated). Confirm with the user if ambiguous.

2. **Read 1-2 existing pages** in `src/content/pages/` to calibrate tone, formatting, and frontmatter patterns.

3. **Follow SITE_GUIDE.md § "Create a new page"** for the full procedure, schema, and route file template.

4. **Create the content file** at `src/content/pages/{slug}.md` with required frontmatter (`title`, `description`, `headline`) and professional body content in markdown.

5. **Create the route file** at `src/pages/{slug}.astro` using the template from SITE_GUIDE.md. Copy the pattern from an existing page route if the template has drifted.

6. **Ask about navigation** — if the user wants it in the nav, read `src/data/nav.json`, add an entry with the next `order` value, and verify `href` matches the new route.

7. **Validate**: Run `npm run validate`. If unavailable, run `npm run build`.

## What the user said

$ARGUMENTS
