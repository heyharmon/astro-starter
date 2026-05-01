---
title: "A featured project entry"
description: "This entry has featured: true. The homepage (or any other page) can filter the projects collection on this flag to surface a curated subset."
client: "Acme Demo Co."
location: "Anywhere, USA"
order: 1
featured: true
draft: false
---

## Why this entry exists

This project demonstrates the `featured` flag in the projects schema. It has `featured: true` in its frontmatter, which means a route somewhere — typically the homepage — can call:

```ts
const featured = (await getCollection("projects"))
  .filter((p) => p.data.featured)
  .sort((a, b) => a.data.order - b.data.order);
```

…and get back only the entries with the flag set. That gives you a curated "highlighted work" section without maintaining a separate manual list. Editors flip a boolean in the Markdown frontmatter; the homepage updates on the next build.

## Lorem ipsum, for body weight

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## How the schema differs from posts

The `projects` collection (defined in `src/content.config.ts`) intentionally has a different shape than `posts`:

- **No `date`** — projects don't sort chronologically; they sort by `order`.
- **`order: number`** — manual sort key, lower numbers first.
- **`featured: boolean`** — surfacing flag for filtered displays.
- **`client` and `location`** — optional structured fields rendered in the project header.

When you build your own collection, ask: what fields do you need to *filter* on? What fields do you need to *sort* by? Those go in the schema. Free-form prose lives in the Markdown body.
