---
title: "About this page"
description: "How the about page demonstrates the hybrid inline + Markdown pattern."
headline: "Inline route, Markdown body"
subheadline: "The route is at src/pages/about.astro. The text you're reading right now lives in src/content/pages/about.md."
---

This page is the **hybrid pattern** — a one-of-a-kind route paired with a single Markdown entry. The `.astro` file controls layout and structure; the `.md` file holds the prose. You get the editing ergonomics of Markdown without the friction of creating a single-entry collection.

## Why use the hybrid pattern

When a page is genuinely unique (about, contact, mission, careers) but you still want non-developers to edit the body copy, this is the move. The route file in `src/pages/about.astro` calls `getEntry("pages", "about")` and renders the body through Astro's `<Content />` component. Schema for the `pages` collection lives in `src/content.config.ts`.

## Lorem ipsum, for visual weight

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.

## How to replace this content

1. Open `src/content/pages/about.md` and rewrite the body and frontmatter (`title`, `headline`, `subheadline`).
2. If you need new frontmatter fields (a hero image, an author photo), add them to the `pages` schema in `src/content.config.ts` first — make new fields optional with defaults so existing entries don't break.
3. The route file at `src/pages/about.astro` only needs editing if you want to change layout. The `<Content />` component re-renders whatever Markdown you put here.

> **Tip:** This is a hybrid, not a collection. Don't add a second entry to `src/content/pages/` and call it a "team" page — promote it to its own route file. Single-entry collections work for unique pages; collections are for repeating shapes.
