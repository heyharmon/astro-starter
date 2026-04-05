---
description: "Source and place images for pages during the per-cohort page building workflow. Identifies all image placements, sources appropriate images, downloads to public/images/, and updates frontmatter."
---

Source and place all images needed for a set of pages in the current build cohort.

## Required inputs

The orchestrator should provide:
- Which page(s) need images (by slug or URL)
- Whether a reference site exists, and its URL
- The business context (from `site-meta.json`)
- Which pages have already been completed (for visual consistency)

## Procedure

### Phase 1: Inventory image placements

1. **Read the page files.** For each page in the cohort:
   - Read the `.astro` route file in `src/pages/` — identify all `<img>` tags, background image references, and placeholder image paths
   - Read the `.md` content file in `src/content/pages/` — check `featuredImage` and any other image fields in frontmatter
   - Read any related collection files (e.g., `src/content/services/*.md` for a services page)

2. **Read `src/data/design-tokens.json`** — check `componentPatterns` to understand what aspect ratios and image treatments each pattern expects.

3. **Build an image inventory.** For each image placement, note:
   - **Location:** which file and section (e.g., "index.astro hero section, line 15")
   - **Current source:** placeholder SVG path or empty
   - **Required aspect ratio:** 16:9, 4:3, 3:4, 1:1 (from component pattern)
   - **Content context:** what the image should depict based on surrounding text
   - **Mood:** atmospheric, professional, warm, industrial, etc. (from site aesthetic)

### Phase 2: Source images

4. **Check if a reference site exists.** If so:
   - Use the **Browser skill** (`.claude/agents/shared/browser/SKILL.md`) to navigate to the reference page and screenshot sections that contain images
   - If the reference has high-quality images that are appropriate, use the `pull-reference-images` skill to download them
   - Flag licensing concerns to the orchestrator

5. **For placements without reference images** (or if no reference exists):
   - Construct search queries using: business type + section content + mood
   - Use the Unsplash search script:
     ```bash
     python3 .claude/agents/images/unsplash/scripts/unsplash_search.py "query" -n 4 --json
     ```
   - Select the best match considering: relevance to content, visual quality, mood consistency with other images already placed, correct orientation for the aspect ratio

6. **Download each image** to the appropriate subdirectory:
   ```bash
   python3 .claude/agents/images/unsplash/scripts/unsplash_download.py \
     --url "{url}" \
     --output-dir "public/images/{category}" \
     --filename "{slug}" \
     --download-endpoint "{endpoint}" \
     --metadata-json '{...}'
   ```

### Phase 3: Place and verify

7. **Update frontmatter** in the content `.md` files:
   - Set `featuredImage` or `image` fields with the correct path and descriptive alt text
   - Alt text should describe the image content specifically, not generically

8. **Update route files** if images are referenced inline (e.g., hero background `src` attributes in `.astro` files).

9. **Validate.** Run `npm run validate`.

10. **Visual check.** Use the browser skill's "Screenshot the Dev Server" procedure to verify:
    - Images load correctly (no broken references)
    - Images fit their containers (correct aspect ratio, no distortion)
    - Images reinforce the page content (a welding hero shows welding, not a sunset)
    - Visual consistency across all images on the page (similar style, color temperature, quality level)

11. **Report to the orchestrator:**
    - List of images sourced and placed (filename, source, placement)
    - Any placements where no good match was found (flag for human review)
    - Any licensing concerns (reference site images)
    - Screenshots showing images in context

## Image Quality Standards

- **Minimum resolution:** regular size (~1080px width) from Unsplash
- **Aspect ratio match:** image orientation must match the placement (landscape for 16:9 and 4:3, portrait for 3:4, square for 1:1)
- **No watermarks:** reject any images with visible watermarks
- **Brand consistency:** all images on the site should feel like they belong together — similar color temperature, quality level, and style
- **Context fit:** a welding company should have industrial imagery, not corporate stock photos of handshakes

## What NOT to do

- Do not modify page content (text, headings, copy)
- Do not modify page styling or Tailwind classes
- Do not change the page's section structure or layout
- Do not place low-quality or mismatched images just to fill slots — a placeholder is better than a bad image
- Do not use images with visible watermarks or inappropriate content

## What the user said

$ARGUMENTS
