---
description: "Modify site styles — colors, typography, layout, spacing, and component appearance."
---

Update the visual design of this Astro site.

## Required inputs

The user should describe: what visual change they want (colors, fonts, spacing, layout, component styling).

## Procedure

1. **Identify the type of change**:
   - **Design tokens** (colors, fonts, spacing): Edit `src/styles/global.css` `@theme` block
   - **Base element styles** (headings, paragraphs, links): Edit `src/styles/global.css` `@layer base` block
   - **Prose/markdown styles**: Edit the `.prose` rules in `src/styles/global.css`
   - **Component-specific**: Edit Tailwind classes in the relevant `.astro` component file

2. **Read the target file** before making changes.

3. **For token changes, verify coverage first.** Grep components for hardcoded hex colors or Tailwind arbitrary values (e.g., `text-[#xxx]`) that bypass the theme. Report any you find — they won't be affected by token changes alone.

4. **Make the change** following these conventions (see SITE_GUIDE.md § 6):
   - Use standard Tailwind palette values when available (slate, gray, zinc, neutral, stone; red, orange, amber, yellow, etc.)
   - Follow existing spacing patterns (`px-6`, `py-24 sm:py-32`, `max-w-5xl`)
   - Keep typography hierarchy: h1 > h2 > h3 with consistent sizing
   - Do NOT add inline `<style>` blocks to components

5. **Check for unused tokens.** After changing tokens, grep components for usage. If no components reference the changed tokens, tell the user so they know the change has no visible effect yet.

6. **Sync design tokens.** If you changed `global.css` tokens or introduced new component patterns, update `src/data/design-tokens.json` to reflect the changes. This keeps the machine-readable design system in sync with the CSS. Update the relevant sections (`colors`, `typography`, `spacing`, `effects`, or `componentPatterns`).

7. **Describe what changed** — list 3-5 specific visual differences the user will notice.

8. **Validate**: Run `npm run validate`. If unavailable, run `npm run build`.

9. **Visual verification** — use the **Browser skill** (`.claude/agents/shared/browser/SKILL.md`) to verify your changes visually. Follow the "Screenshot the Dev Server" procedure.

   a. **Identify which page(s) to check.** Based on the files you modified:
      - Token/base style changes → check the home page (`/`) and one inner page
      - Component-specific changes → check the page that uses that component
      - Prose style changes → check a content-heavy page (blog post or services)

   b. **Take desktop and mobile screenshots** using the browser skill procedures.

   c. **Review both screenshots.** Check for:
      - Does the change match what the user asked for?
      - Visual consistency — no orphaned colors, spacing mismatches, or broken layout
      - Typography hierarchy — headings, body text, and links are clearly differentiated
      - Responsive behavior — nothing overflows, overlaps, or collapses at mobile width
      - No obvious regressions — other page elements still look correct

   d. **If something looks wrong**, fix it and re-screenshot. Do not report success if the visual result doesn't match intent. You may iterate up to 3 times.

   e. **Include the screenshots in your response** so the user can see the result.

## Current design system

- **Fonts**: Inter (sans), JetBrains Mono (mono)
- **Colors — Neutral**: 50-950 scale (#fafafa to #0a0a0a)
- **Colors — Accent**: 50-900 scale (indigo, #f0f4ff to #312e81)
- **Layout**: max-w-5xl, px-6, py-24 sm:py-32
- **Cards**: rounded-xl border border-neutral-200 p-8
- **Buttons**: rounded-lg px-6 py-3
- **Borders**: border-neutral-200

## What the user said

$ARGUMENTS
