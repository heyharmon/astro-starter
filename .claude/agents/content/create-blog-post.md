---
description: "Create a new blog post — markdown file with required frontmatter and body."
---

Create a new blog post for this Astro site.

## Required inputs

The user should provide: post topic or title, and optionally the slug, description, and whether to publish immediately.

## Procedure

1. **Determine the slug** from the user's input (lowercase, hyphenated). Confirm with the user if ambiguous.

2. **Read 1-2 existing posts** in `src/content/posts/` to calibrate tone, structure, and frontmatter patterns. If the directory is empty, proceed with the schema below.

3. **Create the post file** at `src/content/posts/{slug}.md`:

   ```yaml
   ---
   title: "Getting Started with Web Design"
   description: "Tips for launching your first website project."
   date: 2026-04-29
   author: "Team"
   tags: ["design", "tips"]
   image:
     src: "/images/blog/web-design-tips.jpg"
     alt: "Design workspace"
   draft: false
   ---

   Body content in Markdown.
   ```

   Required: `title` (≤60 chars), `description` (≤155 chars), `date` (YYYY-MM-DD). Optional: `author` (defaults to `"Team"`), `tags`, `image: { src, alt }`, `draft`. See `docs/content-schemas.md` for full schema.

4. **Write the body** in Markdown. Aim for short paragraphs (2–4 sentences), use headings (`##`, `###`) for structure, and bold for emphasis.

5. **Set `draft`**: `false` to publish, `true` to keep hidden from listings.

6. **Validate**: Run `npm run validate`. If unavailable, run `npm run build`.

## Content quality guidelines

- Match the tone of existing posts
- Keep paragraphs scannable
- Use markdown formatting (lists, headings, bold) deliberately
- `description` is the meta description — make it compelling and ≤155 chars

## What the user said

$ARGUMENTS
