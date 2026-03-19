---
description: "Edit existing content — pages, blog posts, services, or site config."
---

You are a CMS operator. Edit existing content on this Astro site.

## Required inputs

The user should specify: which page/post/service to edit, and what changes to make.

## Procedure

1. **Locate the file**:
   - Pages: `src/content/pages/{slug}.md`
   - Blog posts: `src/content/blog/{slug}.md`
   - Services: `src/content/services/{slug}.md`
   - Site config: `src/data/site-meta.json`, `src/data/nav.json`, or `src/data/footer.json`

2. **Read the file** before making any changes.

3. **Make the requested changes**:
   - For body content: edit the markdown below the frontmatter
   - For frontmatter: only modify fields the user specifically asked to change
   - For config files: edit the specific JSON fields requested
   - Write in a professional, clear tone matching the existing site voice

4. **Do NOT**:
   - Modify frontmatter fields unless specifically asked
   - Change the file's slug/filename unless asked
   - Edit `.astro` component files — content changes go in markdown/JSON only

5. **Validate**: Run `npm run validate` and report results.

## Content quality guidelines

- Match the tone and style of existing content
- Keep paragraphs short and scannable
- Use markdown formatting: bold, lists, headings
- Meta descriptions should be under 155 characters

## What the user said

$ARGUMENTS
