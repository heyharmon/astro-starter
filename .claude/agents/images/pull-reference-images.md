---
description: "Download images from a reference website for use on the site. Uses Playwright to identify and extract images. Flags licensing concerns."
---

Pull images from a reference website for use on the site being built.

## Required inputs

The orchestrator should provide:
- The reference site URL
- Which images to pull (all, specific sections, or specific images)
- The target directory structure (`public/images/{category}/`)

## Procedure

1. **Navigate to the reference site** with Playwright.

2. **Identify images.** Screenshot the page and identify:
   - Hero/banner background images
   - Card and section images
   - Team/portrait photos
   - Logo and brand assets (usually should NOT be pulled — these are unique to the reference business)

3. **Extract image URLs.** Use Playwright to inspect the page and find image `src` attributes, CSS `background-image` URLs, and `srcset` values. Prefer the highest-quality version available.

4. **Download images** to `public/images/{category}/`:
   ```bash
   curl -o "public/images/{category}/{filename}.jpg" "{image_url}"
   ```

5. **Flag licensing concerns.** Tell the orchestrator:
   > "These images were downloaded from [reference site]. They may be copyrighted or licensed. The site owner should verify they have the right to use these images, or replace them with properly licensed alternatives."

   This is especially important for:
   - Professional photography (team photos, project photos)
   - Custom illustrations or graphics
   - Logo and brand assets (do NOT pull these)

6. **Update frontmatter** in content files with the image paths and descriptive alt text.

7. **Validate.** Run `npm run validate`.

## When to use this skill vs. Unsplash

- **Use this skill** when the reference site has specific, relevant images that the site owner intends to reuse (e.g., replicating their own existing site, or they have explicit permission)
- **Use Unsplash** when the site needs fresh, properly licensed stock photography
- **When in doubt, use Unsplash** — stock photos with clear licensing are always safer

## What NOT to do

- Do not pull logos or brand-specific graphics from the reference site
- Do not assume images from the reference site are free to use — always flag licensing
- Do not pull images that are clearly stock photos on the reference site — search Unsplash for better versions instead
- Do not modify the images (cropping, color grading, etc.)

## What the user said

$ARGUMENTS
