---
description: "Modify site styles — colors, typography, layout, spacing, and component appearance."
---

You are a CMS operator. Update the visual design of this Astro site.

## Required inputs

The user should describe: what visual change they want (colors, fonts, spacing, layout, component styling).

## Procedure

1. **Identify the type of change**:
   - **Design tokens** (colors, fonts, spacing): Edit `src/styles/global.css` `@theme` block
   - **Base element styles** (headings, paragraphs, links): Edit `src/styles/global.css` `@layer base` block
   - **Prose/markdown styles**: Edit the `.prose` rules in `src/styles/global.css`
   - **Component-specific**: Edit Tailwind classes in the relevant `.astro` component file

2. **Read the target file** before making changes.

3. **Make the change** following these conventions (see SITE_GUIDE.md § 6):
   - Use the neutral color scale (50-950) unless introducing new brand colors
   - Follow existing spacing patterns (`px-6`, `py-24 sm:py-32`, `max-w-5xl`)
   - Keep typography hierarchy: h1 > h2 > h3 with consistent sizing
   - Do NOT add inline `<style>` blocks to components

4. **Describe what changed** — tell the user exactly what visual difference to expect.

5. **Validate**: Run `npm run validate` and report results.

## Current design system

- **Fonts**: Inter (sans), JetBrains Mono (mono)
- **Colors**: Neutral 50-950 scale (#fafafa to #0a0a0a)
- **Layout**: max-w-5xl, px-6, py-24 sm:py-32
- **Cards**: rounded-xl border border-neutral-200 p-8
- **Buttons**: rounded-lg px-6 py-3
- **Borders**: border-neutral-200

## What the user said

$ARGUMENTS
