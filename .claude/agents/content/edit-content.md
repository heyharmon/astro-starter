---
description: "Edit existing content — pages, blog posts, services, or site config."
---

Edit existing content on this Astro site.

## Required inputs

The user should specify: which page/post/service to edit, and what changes to make.

## Procedure

1. **Locate the file**:
   - Pages: `src/content/pages/{slug}.md`
   - Blog posts: `src/content/blog/{slug}.md`
   - Services: `src/content/services/{slug}.md`
   - Site config: `src/data/site-meta.json`, `src/data/nav.json`, or `src/data/footer.json`
   - If unsure, run `ls` on the target directory to confirm actual filenames.

2. **Read the file** before making any changes.

3. **Read 1-2 neighboring files** in the same collection to calibrate tone and formatting.

4. **Make the requested changes**:
   - For body content: edit the markdown below the frontmatter
   - For frontmatter: only modify fields the user specifically asked to change
   - For config files: edit the specific JSON fields requested
   - Write in a professional, clear tone matching the existing site voice

5. **Check for coherence**: If your body edits change the fundamental identity or subject of the page (rebrand, new product, new mission), the existing frontmatter (title, description, headline, subheadline) likely needs updating too. Make those updates and tell the user what you changed and why.

6. **Do NOT**:
   - Change the file's slug/filename unless asked
   - Edit `.astro` component files — content changes go in markdown/JSON only

7. **Validate**: Run `npm run validate`. If unavailable, run `npm run build`.

## Content quality guidelines

- Match the tone and style of existing content
- Keep paragraphs short and scannable
- Use markdown formatting: bold, lists, headings
- Meta descriptions should be under 155 characters

## What the user said

$ARGUMENTS
