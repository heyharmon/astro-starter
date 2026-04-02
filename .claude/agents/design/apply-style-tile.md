---
description: "Apply a reference site's aesthetic to the style tile during the style stage of a new site build."
---

Apply a reference aesthetic to the style tile page, iterating visually until the design system matches.

## Required inputs

The orchestrator should provide:
- Visual description of the reference site (from screenshots the orchestrator took)
- The reference URL (so you can screenshot it yourself for comparison)
- Any specific direction from the human ("I want it darker", "use warmer tones", etc.)

## Procedure

### Phase 1: Capture both sites

1. **Screenshot the reference site.** Navigate to the reference URL with Playwright and take a full-page screenshot. Study:
   - Color palette (backgrounds, text, accents, borders)
   - Typography (serif/sans, weights, sizes, transforms, letter-spacing)
   - Spacing density (generous/tight, section padding, gaps)
   - Visual treatments (overlays, shadows, borders, radius)
   - Button styles (filled, outline, ghost, hover states)
   - Component patterns (hero style, card style, CTA style)

2. **Start the dev server** in the background (`npm run dev &`). Navigate to `http://localhost:4321/style-tile` and screenshot.

3. **List specific differences** between the reference and our style tile. Be visual, not abstract.

### Phase 2: Update the design system

4. **Read the current files:**
   - `src/styles/global.css` — current tokens and base styles
   - `src/data/design-tokens.json` — current machine-readable tokens
   - `src/pages/style-tile.astro` — current style tile page

5. **Update `global.css`:**
   - `@theme` block — change color scale, font families
   - `@layer base` — update body background, text colors, heading styles, link styles
   - `.btn-ghost` and any other utilities — match button style to reference
   - `.prose` styles — ensure readable on new color scheme

6. **Update Tailwind classes in `style-tile.astro`** — adjust component pattern examples to match reference (overlay opacities, card treatments, section backgrounds, etc.)

7. **Update `design-tokens.json`** — sync all changes:
   - `colors` — update background, text, border, button mappings
   - `typography` — update font names, heading classes, body classes
   - `spacing` — update if section padding or gaps change
   - `effects` — update overlays, radius, shadows
   - `componentPatterns` — update descriptions if patterns change visually

### Phase 3: Verify and iterate

8. **Validate.** Run `npm run validate`.

9. **Screenshot the updated style tile** at desktop (1280px) and mobile (375px).

10. **Compare against the reference.** Check:
    - Does the color mood match?
    - Does the typography feel similar (weight, hierarchy, transforms)?
    - Do buttons, cards, and sections have similar visual treatment?
    - Does the spacing density feel comparable?
    - Is the overall aesthetic the same "family" as the reference?

11. **Iterate up to 3 times** if there are clear gaps.

12. **Stop the dev server:** `kill %1 2>/dev/null || true`

13. **Report to the orchestrator:**
    - What tokens and styles you changed
    - Desktop and mobile screenshots of the style tile
    - Any remaining gaps (e.g., "reference uses a font we don't have" or "reference has a pattern not on the style tile")
    - Recommendation for whether the style is ready for human review

## What NOT to do

- Do not create or modify any page except `style-tile.astro`
- Do not create content files or navigation entries
- Do not add images beyond the existing placeholders
- Do not change the style tile's structure (Layer 1 / Layer 2 sections) — only change the styling

## What the user said

$ARGUMENTS
