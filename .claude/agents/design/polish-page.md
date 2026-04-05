---
description: "Section-by-section visual polish of a built page. Compares against reference site or approved pages to fix spacing, sizing, and layout details. Run after initial page build, before evaluation."
---

Polish a built page by comparing it section-by-section against a reference and fixing visual details until quality reaches 90–95%.

## Required inputs

The orchestrator should provide:
- Which page(s) to polish (URLs on the dev server)
- Whether a reference site exists, and if so, the URL
- Which pages have already been approved (for consistency comparison)

## Procedure

### Phase 1: Capture and compare

Use the **Browser skill** (`.claude/agents/shared/browser/SKILL.md`) for all screenshots, navigation, and DOM inspection.

1. **Start the dev server** and open the browser using the browser skill's "Screenshot the Dev Server" procedure.

2. **Screenshot our page** at desktop (1280px). Scroll through and take multiple screenshots to capture every section individually.

3. **Determine comparison target:**

   **If a reference page exists** (e.g., homepage matches reference homepage):
   - Screenshot the reference page at the same width
   - Scroll through the reference and capture each section individually
   - Map our sections to reference sections (hero ↔ hero, services ↔ services, etc.)

   **If no reference page exists** (e.g., inner page with no reference equivalent):
   - Screenshot the approved homepage as the consistency baseline
   - Read `src/data/design-tokens.json` for established patterns
   - Read `src/pages/style-tile.astro` for component pattern specimens
   - The goal is consistency with the established site, not matching a specific reference

4. **Compare section by section.** For each section, check these details:

   **Spacing & sizing:**
   - Section padding (top/bottom) — is it consistent with other sections and the reference?
   - Text size relative to the section — are headings the right visual weight?
   - Gaps between elements (heading → body → CTA) — too tight? Too loose?
   - Container max-width — does content feel the right width for the section type?

   **Text placement & hierarchy:**
   - Is the headline positioned correctly (left-aligned, centered, overlaid on image)?
   - Does body text have the right max-width for readability?
   - Are labels/eyebrow text the right size and opacity?
   - Is the CTA button the right size and positioned correctly relative to content?

   **Visual weight & balance:**
   - Does the section feel the right "heaviness" compared to the reference or siblings?
   - Are images the right aspect ratio and size relative to text?
   - Does whitespace feel intentional or accidental?
   - Are background colors/overlays the right intensity?

   **Special treatments:**
   - Sticky/fixed elements (sticky headings, scroll-linked animations)
   - Hover states on cards and links
   - Image zoom/scale effects
   - Overlay gradients (direction, opacity, color)
   - Border treatments (which sides, thickness, color)

5. **List every difference** you find. Be specific: "Hero heading is text-4xl but reference is closer to text-6xl" not "heading is too small."

### Phase 2: Fix and verify

6. **Fix each issue.** Work through your list, editing the page's `.astro` route file and/or `global.css` as needed. Group related fixes (e.g., fix all spacing in one pass, then all typography).

7. **Re-screenshot after fixes** (using the browser skill). Compare again. There may be secondary issues revealed after fixing the primary ones.

8. **Iterate up to 2 more times** if there are remaining issues. The goal is 90–95% match, not pixel-perfect.

### Phase 3: Mobile check

9. **Switch to mobile viewport** (375px) using the browser skill and screenshot the page.

10. **Check mobile-specific issues:**
    - Does the layout stack correctly?
    - Are headings readable but not oversized?
    - Do touch targets (buttons, links) have adequate size?
    - Does horizontal scrolling occur anywhere? (It should not.)
    - Are images scaling proportionally?

11. **Fix any mobile issues** found.

### Phase 4: Report

12. **Stop the dev server and close the browser** (see browser skill cleanup procedures).

13. **Report to the orchestrator:**
    - List of issues found and fixed (specific: "Increased hero padding from py-16 to py-32 to match reference")
    - Desktop and mobile screenshots of the polished page
    - Any remaining gaps that couldn't be fixed with styling alone (e.g., "reference has a video background, ours has a static image")
    - Confidence level: how close is the result to the target (reference or consistency baseline)?

## What NOT to do

- Do not change page content (text, headings, copy) — that's Content agent territory
- Do not add or remove sections — that's Dev agent territory
- Do not source or replace images — that's the image sourcing step
- Do not change global tokens unless a token is clearly wrong for the whole site — prefer component-level class changes
- Do not spend iterations on issues below 2% visual impact — focus on the big wins

## What the user said

$ARGUMENTS
