---
title: "An unpublished draft"
description: "This entry has draft: true. It renders in dev, disappears in production. Open /blog in npm run dev to confirm."
date: 2026-04-29
author: "Astro Starter"
tags: ["meta"]
draft: true
---

This post has `draft: true` in its frontmatter. The blog routes at `src/pages/blog/index.astro` and `src/pages/blog/[...slug].astro` filter with:

```ts
import.meta.env.PROD ? !data.draft : true
```

That predicate keeps the entry visible in `npm run dev` (where `import.meta.env.PROD` is `false`) and hides it in `npm run build` (where `PROD` is `true`).

## Why this matters

Drafting in place — in the same Markdown directory as published posts — beats keeping a separate "drafts" folder. You can preview the post at its real URL, share a dev preview with a reviewer, then flip `draft: false` and ship. No moving files around at publish time.

## Confirming the filter works

Run `npm run build` and check `dist/blog/`. This post's HTML should be missing. Run `npm run dev` and visit `/blog` — this post's card should appear with a "draft" badge.
