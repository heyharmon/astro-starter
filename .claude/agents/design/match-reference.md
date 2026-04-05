---
description: "Match the site's design to a reference website using visual comparison. Use when the orchestrator provides reference screenshots and a target URL to replicate."
---

Match the visual design of this site to a reference website through iterative visual comparison.

## Required inputs

The orchestrator should provide:
- A description of the reference site's visual design (from screenshots the orchestrator took)
- The reference URL (so you can screenshot it yourself for comparison)
- Which page(s) to focus on
- What aspects to match (full redesign, color palette only, layout structure, etc.)

## Procedure

### Phase 1: Understand the reference

Use the **Browser skill** (`.claude/agents/shared/browser/SKILL.md`) for all screenshots, navigation, and DOM inspection.

1. **Screenshot the reference site.** Use the browser skill to navigate to the reference URL and take full-page screenshots. Study carefully — note:
   - Overall color scheme and mood (dark/light, warm/cool)
   - Layout structure (hero style, section arrangement, grid patterns)
   - Typography style (serif/sans, weight, sizing hierarchy, any uppercase/transforms)
   - Spacing patterns (generous/tight, section padding, card gaps)
   - Visual weight (image-heavy vs text-heavy, use of whitespace)
   - Special treatments (gradients, overlays, borders, shadows, background images)
   - Button and CTA styling
   - Header and footer design

2. **Screenshot our site.** Follow the browser skill's "Screenshot the Dev Server" procedure to capture the corresponding page on `http://localhost:4321`.

3. **List the differences.** Be specific and visual, not abstract. Bad: "the colors are different." Good: "the reference has a full-bleed hero image with dark gradient overlay and white text; ours has plain white text on a flat dark background with no imagery."

### Phase 2: Plan changes by ownership

4. **Separate what you can change from what needs other agents.** You own:
   - Design tokens in `src/styles/global.css` (`@theme`, `@layer base`, prose styles)
   - Tailwind classes in `.astro` component and layout files
   
   You do NOT own and cannot change:
   - Page layout structure (adding/removing HTML sections) — needs Dev agent
   - Content (markdown text, frontmatter copy) — needs Content agent
   - Images and media — needs Content agent (Unsplash skill) or Dev agent
   
   If the gap requires structural HTML changes or new images, note these as "out of scope — requires Dev/Content agent" and focus on what you CAN do.

5. **Prioritize your changes.** Work in this order:
   a. Color palette and background treatments (biggest visual impact)
   b. Typography (fonts, sizes, weights, transforms)
   c. Spacing and layout density
   d. Component styling (cards, buttons, borders, shadows)
   e. Header and footer styling

### Phase 3: Implement and compare

6. **Read all target files** before making changes.

7. **Make changes** following the existing design system conventions (see SITE_GUIDE.md § 6):
   - Update `@theme` tokens for palette changes
   - Update `@layer base` for typography/element defaults
   - Update Tailwind classes in components for component-specific changes
   - No inline `<style>` blocks

8. **Validate.** Run `npm run validate`.

9. **Screenshot our site again** (using the browser skill) and compare against the reference. Check:
   - Does the overall color mood match?
   - Does the typography feel similar (weight, hierarchy, spacing)?
   - Do the cards/buttons/sections have similar visual treatment?
   - Does the spacing density feel comparable?
   - Are there obvious remaining gaps?

10. **Iterate.** If there are clear gaps you can close with styling changes, fix them and re-screenshot. Up to 3 iterations.

11. **Report results.** Include:
    - What you changed (token changes, class changes)
    - Screenshot of the current state
    - Remaining gaps that need other agents (structural changes, images, content)
    - Specific recommendations for what the Dev or Content agent should do next

12. **Stop the dev server and close the browser** (see browser skill cleanup procedures).

## What NOT to do

- Do not add images or media files — that's Content agent territory
- Do not restructure page HTML (add/remove sections, change grid layouts) — that's Dev agent territory
- Do not change markdown content or frontmatter text — that's Content agent territory
- Do not guess at exact hex values from screenshots — use `playwright-cli eval` to extract computed styles, or use the closest standard Tailwind palette value
- Do not try to achieve pixel-perfect replication — aim for matching the visual *feel* and design system

## What the user said

$ARGUMENTS
