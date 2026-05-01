---
title: "How the posts collection works"
description: "Anatomy of a content collection — the Markdown file, the schema, the dynamic route, and how they fit together."
date: 2026-04-15
author: "Astro Starter"
tags: ["meta", "content-collections"]
draft: false
---

This post is itself a demonstration. It lives at `src/content/posts/how-the-posts-collection-works.md`. The filename becomes the URL slug at `/blog/how-the-posts-collection-works`. There is no manifest, no registration step. Drop a Markdown file into `src/content/posts/`, run the build, and a new page exists.

## The four moving pieces

A content collection in this starter is exactly four things working together:

1. **Schema** — `src/content.config.ts` defines the `posts` collection with a Zod schema. Every Markdown file's frontmatter is validated against it at build time. Try removing the `title` field from any post and watch `npm run healthcheck` fail.
2. **Markdown files** — `src/content/posts/*.md`. One file = one entry. Frontmatter is structured data; the body is rendered as HTML.
3. **Listing route** — `src/pages/blog/index.astro` calls `getCollection("posts")`, sorts by date, and renders cards.
4. **Detail route** — `src/pages/blog/[...slug].astro` uses `getStaticPaths()` to generate one HTML page per entry. The `[...slug]` filename tells Astro to build a static page for every post slug.

## Drafts

Set `draft: true` in frontmatter and the entry disappears from production builds (the route filters with `import.meta.env.PROD ? !data.draft : true`). It still renders in `npm run dev` so you can preview unpublished work. There's a draft post in this collection — visit `/blog` in dev and you'll see it.

## Filtering, tagging, and pagination

The current setup is intentionally minimal — just chronological sort. To add tag pages, create a route at `src/pages/blog/tags/[tag].astro` that filters `getCollection("posts")` by tag in `getStaticPaths()`. Pagination follows the same shape using Astro's `paginate()` helper. None of this requires a CMS — you write the route, Astro builds the static pages.

## To replace this content

Delete this file. Add your own. Keep the schema honest — every required field validated, optional fields with defaults. If you need a new field (say, `readingTime`), add it to `src/content.config.ts` first, then add it to the relevant entries.
