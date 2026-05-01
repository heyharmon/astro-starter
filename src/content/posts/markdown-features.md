---
title: "Markdown features your prose styling supports"
description: "A reference rendering of headings, lists, code, blockquotes, and links — the typography you get for free in this starter."
date: 2026-04-22
author: "Astro Starter"
tags: ["meta", "design-system"]
draft: false
---

This post exists to **show**, not tell. Open it in the browser and you'll see how every standard Markdown element renders against the prose styles in `src/styles/global.css`. If you change typography tokens, scroll through this post to verify the impact end to end.

## Headings

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

### Subheadings (H3)

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Inline formatting

You can write **bold text**, *italic text*, ***bold italic***, ~~strikethrough~~, and `inline code` mid-paragraph. Links look like [this one to the home page](/). Make sure your design tokens give all of these visual hierarchy without competing.

## Lists

Unordered:

- First item — short and scannable
- Second item with a [link inside](/about) and some `inline code`
- Third item that runs slightly longer to verify line height feels right when text wraps

Ordered:

1. Step one — open `src/content/posts/markdown-features.md`
2. Step two — make a change to the body
3. Step three — save and see it in `npm run dev`

## Code block

```ts
// src/content.config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
```

## Blockquote

> The best content collection is the one you don't have to think about. Define the shape once, then add files. Build time enforces the rest.

## Horizontal rule

Above this line is content. Below it is also content. The rule visually separates the two.

---

## Closing

If anything in this post looks wrong — line heights too tight, code blocks washed out, links indistinguishable from regular text — that's a signal to revisit `@layer base` and `.prose` rules in `src/styles/global.css`. The Design agent owns those styles.
