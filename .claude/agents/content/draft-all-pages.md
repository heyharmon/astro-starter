---
description: "Draft all page copy during the content drafting stage of a new site build."
---

Draft copy for all pages in the approved sitemap, creating markdown files with `draft: true`.

## Required inputs

The orchestrator should provide:
- The approved sitemap (which pages to create, from `build-state.json` or `nav.json`)
- The business context (from `site-meta.json` — name, tagline, description)
- Any reference site content (extracted via WebFetch) for tone and messaging guidance
- Any specific direction from the human about messaging, tone, or what to include/exclude

## Procedure

1. **Read context files:**
   - `src/data/site-meta.json` — business name, tagline, description
   - `src/data/nav.json` — approved page list and navigation order
   - `src/data/build-state.json` — current build stage and notes
   - Any existing content files in `src/content/pages/` — to calibrate tone

2. **Read SITE_GUIDE.md** for content schemas and formatting conventions.

3. **Plan the content architecture.** For each page in the sitemap, decide:
   - What the headline and subheadline should be
   - What sections the body content should cover (as markdown headings)
   - How the tone should differ per page (homepage = confident + concise, about = personal + credible, services = specific + authoritative, contact = warm + direct)

4. **Write all page drafts.** For each page, create or update `src/content/pages/{slug}.md` with:
   - Complete frontmatter (title, description, headline, subheadline)
   - `draft: true` in frontmatter
   - Full body content in markdown — not placeholder text, real copy

5. **Calibrate tone across all pages.** After writing all drafts, read them back-to-back. Check:
   - Does the voice feel consistent across pages?
   - Is the formality level appropriate for the business type?
   - Are there redundant sentences or sections across pages?
   - Does each page have a distinct purpose, or do they blend together?

6. **Validate.** Run `npm run validate`.

7. **Report to the orchestrator:**
   - List of all pages drafted with a one-line summary of each
   - Any pages where you had to make assumptions about content (flag for human review)
   - Tone/voice notes (e.g., "I wrote in a professional but approachable tone, avoiding jargon")

## Content Quality Standards

- Paragraphs: 2–4 sentences max, scannable
- Headings: use h2 for main sections, h3 for subsections
- Be specific to the business — no generic "we are committed to excellence" filler
- Meta descriptions: under 155 characters
- Page titles: under 60 characters
- Use bold for emphasis, lists for multiple items
- Every page should pass the "would the business owner recognize their company" test

## What NOT to do

- Do not create route files (`.astro` pages) — that's Dev agent work
- Do not modify navigation, footer, or site-meta — that's a separate content skill
- Do not touch styling or Tailwind classes
- Do not remove `draft: true` — that happens during page building when copy is placed into layouts

## What the user said

$ARGUMENTS
