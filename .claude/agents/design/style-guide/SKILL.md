---
name: style-guide-generator
description: Generate comprehensive style guides from website screenshots and URLs for frontend developers. Extracts colors, typography, buttons, and block styling patterns to enable replicating a website's visual style onto another site. Use when users want to copy/transfer the style or design system of one website to another, create a style guide from a website, or document a site's visual language for a Tailwind CSS implementation.
---

# Style Guide Generator

Generate detailed style guides from website screenshots and URLs that enable frontend developers to apply the same visual style to a different website using Tailwind CSS.

## Workflow Overview

```
Phase 1: Input Collection → Gather screenshots, URL, and page sections
Phase 2: Visual Analysis  → User runs prompt through GPT-5/Vision model
Phase 3: Style Extraction → Claude synthesizes into structured style guide
Phase 4: Output          → Markdown style guide + Tailwind config recommendations
```

---

## Phase 1: Input Collection

Ask what inputs the user has:

"To generate a comprehensive style guide, what can you provide?

**Required:**
- [ ] Full-page screenshots (desktop and/or mobile)
- [ ] URL to the live website

**Recommended for accuracy:**
- [ ] Screenshots of key page sections (hero, cards, footer, etc.)
- [ ] Screenshots showing hover states on buttons/links

**Helpful extras:**
- [ ] Screenshots of multiple pages (to identify consistent patterns)
- [ ] Any known font names

Which of these can you provide?"

If user provides URL, offer to fetch CSS variables:

"If you can access the browser DevTools, I can help you extract CSS custom properties:

1. Open DevTools (F12) → Console
2. Paste and run:
```javascript
// Extract CSS variables from :root
const styles = getComputedStyle(document.documentElement);
const cssVars = {};
for (let i = 0; i < styles.length; i++) {
  const prop = styles[i];
  if (prop.startsWith('--')) {
    cssVars[prop] = styles.getPropertyValue(prop).trim();
  }
}
console.log(JSON.stringify(cssVars, null, 2));
```
3. Copy the output and paste it here

This gives us the exact color and spacing tokens the site uses."

---

## Phase 2: Visual Analysis

Once you have screenshots, provide this prompt for the user:

"**Copy this prompt and run it through GPT-5 (or another vision model) with ALL your screenshots attached:**"

```
Analyze this website's visual design system for a style guide. Be exhaustive and precise with values:

## OVERALL AESTHETIC
- Design style: [minimalist | corporate | playful | luxury | editorial | tech | organic | brutalist | other]
- Visual mood: [describe in 2-3 words]
- Era/influence: [modern flat | material | glassmorphism | neomorphism | classic web | etc.]
- Density: [spacious | balanced | compact]
- Notable design characteristics:

## COLORS (provide hex values for ALL colors you can identify)

### Backgrounds
- Main page background: #
- Secondary background (sections/stripes): #
- Tertiary background (if any): #
- Card/container background: #
- Header background: #
- Footer background: #
- Dropdown/menu background: #
- Modal/overlay background: #

### Text Colors
- Primary heading color (h1): #
- Secondary heading color (h2-h3): #
- Tertiary heading color (h4-h6): #
- Body text color: #
- Muted/secondary text: #
- Link color (default): #
- Link color (hover): #

### Interactive Elements
- Primary button background: #
- Primary button text: #
- Primary button hover background: #
- Secondary button background: #
- Secondary button text: #
- Secondary button border: #
- Tertiary/ghost button style: describe

### Accent & Utility Colors
- Primary accent/brand color: #
- Secondary accent: #
- Success color: #
- Warning color: #
- Error color: #
- Info/neutral color: #
- Border/divider color: #
- Input field border: #
- Input field focus border: #

### Special Elements
- Badge/pill background: #
- Badge/pill text: #
- Tag colors (if different from badges): #
- Highlight/selection color: #
- Icon color (default): #
- Icon color (on dark bg): #

## TYPOGRAPHY

### Fonts
- Heading font family: [name or describe style]
- Body font family: [name or describe style]
- Accent/special font (if any): [name or describe]
- Monospace font (if used): [name]

### Heading Sizes (estimate in pixels)
| Level | Size | Weight | Line Height | Letter Spacing | Transform |
|-------|------|--------|-------------|----------------|-----------|
| H1 | px | | | | |
| H2 | px | | | | |
| H3 | px | | | | |
| H4 | px | | | | |
| H5 | px | | | | |
| H6 | px | | | | |

### Body Text
- Base body size: px
- Body line height:
- Body weight:
- Small text size: px
- Caption/fine print size: px
- Large/lead paragraph size: px

### Special Typography
- Navigation link size: px, weight:
- Button text size: px, weight:, transform:
- Form label size: px, weight:
- Input text size: px
- Footer text size: px

## BUTTONS & INTERACTIVE ELEMENTS

### Primary Button
- Background: #hex
- Text color: #hex
- Font size: px
- Font weight:
- Padding: Xpx Ypx (vertical horizontal)
- Border radius: px
- Border: [none | Xpx solid #hex]
- Shadow: [none | describe]
- Hover state changes:
- Active/pressed state:

### Secondary Button
- Background: #hex
- Text color: #hex
- Border: Xpx solid #hex
- Other properties same as primary or:

### Other Button Variants
- Ghost/text button style:
- Icon button style:
- Button sizes (if multiple): sm, md, lg dimensions

### Links
- Default style: [underline | no-underline | color only]
- Hover effect: [underline | color change | both]

### Form Inputs
- Height: px
- Padding: px
- Border: Xpx solid #hex
- Border radius: px
- Focus style:

## SPACING PATTERNS

### Section Spacing
- Space between major page sections: px
- Section internal padding: px (top/bottom) px (left/right)
- Max content width: px

### Component Spacing
- Card internal padding: px
- Gap between cards in grid: px
- Gap between list items: px
- Space between heading and content: px
- Space between paragraphs: px

## EFFECTS & TREATMENTS

### Border Radius Scale
- Small (inputs, tags): px
- Medium (buttons, cards): px
- Large (containers, images): px
- Full/pill: px or 9999px

### Shadows
- Small shadow (buttons, inputs):
- Medium shadow (cards, dropdowns):
- Large shadow (modals, popovers):

### Borders
- Default border width: px
- Border color: #hex
- Divider style:

### Other Effects
- Backdrop blur used?: [yes/no] - value:
- Gradients used?: describe
- Overlays on images?: describe
- Texture or patterns?: describe

## BLOCK/COMPONENT PATTERNS

For each major block type visible, describe:

### Hero Section
- Layout style: [centered | split | image bg | video bg]
- Background treatment:
- Typography scale:
- CTA button style:
- Spacing/padding:
- Any special effects:

### Cards
- Background:
- Border radius:
- Shadow:
- Padding:
- Image treatment (if any):
- Hover effect (if any):

### Feature/Spotlight Sections
- Layout: [alternating | grid | stacked]
- Image style:
- Content alignment:

### Testimonials
- Card style:
- Quote styling:
- Avatar treatment:

### Pricing Tables (if present)
- Card differentiation:
- Featured/recommended treatment:
- Price typography:

### Logo Carousels/Trust Bars
- Background:
- Logo treatment (grayscale? size?):
- Spacing:

### Tables (if present)
- Header styling:
- Row styling:
- Border treatment:

### Footer
- Background:
- Column layout:
- Link styling:
- Typography scale:

### Navigation/Header
- Background:
- Height:
- Logo size:
- Link styling:
- Dropdown treatment:
- Mobile menu style (if visible):

Note any uncertainty with [?]. Provide exact pixel values and hex colors where possible.
```

Then tell user: "**Paste the complete response you get back here.**"

---

## Phase 3: Style Guide Generation

Once you receive the visual analysis, synthesize it into a structured style guide document.

### Output Format

Generate a markdown document with these sections:

```markdown
# [Website Name] Style Guide

> Generated from visual analysis for Tailwind CSS implementation

## Overview

**Design Style:** [aesthetic description]
**Visual Mood:** [2-3 word description]
**Key Characteristics:** [bullet list of defining features]

---

## Color Palette

### Background Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-primary` | #xxx | Main page background |
| `bg-secondary` | #xxx | Alternating sections |
| `bg-card` | #xxx | Cards, containers |
| `bg-header` | #xxx | Navigation header |
| `bg-footer` | #xxx | Footer area |

### Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `text-heading` | #xxx | H1-H2 headings |
| `text-subheading` | #xxx | H3-H6 headings |
| `text-body` | #xxx | Body copy |
| `text-muted` | #xxx | Secondary text |

### Interactive Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `btn-primary` | #xxx | Primary button bg |
| `btn-primary-hover` | #xxx | Primary button hover |
| `btn-secondary` | #xxx | Secondary button bg |
| `accent` | #xxx | Brand accent color |

### Utility Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `border` | #xxx | Default borders |
| `divider` | #xxx | Section dividers |
| `success` | #xxx | Success states |
| `error` | #xxx | Error states |

---

## Typography

### Font Families

- **Headings:** [Font Name] — `font-family: 'Font', sans-serif`
- **Body:** [Font Name] — `font-family: 'Font', sans-serif`

**Google Fonts Import:**
```html
<link href="https://fonts.googleapis.com/css2?family=[Font]:wght@[weights]&display=swap" rel="stylesheet">
```

### Heading Scale

| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| H1 | Xpx / X.Xrem | XXX | X.X | Xem |
| H2 | Xpx / X.Xrem | XXX | X.X | Xem |
| H3 | Xpx / X.Xrem | XXX | X.X | Xem |
| H4 | Xpx / X.Xrem | XXX | X.X | Xem |
| H5 | Xpx / X.Xrem | XXX | X.X | Xem |
| H6 | Xpx / X.Xrem | XXX | X.X | Xem |

### Body Text

| Variant | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Base | Xpx | XXX | X.X |
| Small | Xpx | XXX | X.X |
| Large/Lead | Xpx | XXX | X.X |

---

## Buttons

### Primary Button

```
Background: #xxx
Text: #xxx, Xpx, weight XXX
Padding: Xpx Xpx (Y X)
Border Radius: Xpx
Hover: [describe changes]
```

**Tailwind Classes:**
```html
<button class="bg-[#xxx] text-[#xxx] text-[Xpx] font-[XXX] px-[Xpx] py-[Xpx] rounded-[Xpx] hover:bg-[#xxx] transition-colors">
  Button Text
</button>
```

### Secondary Button

```
Background: #xxx
Text: #xxx
Border: Xpx solid #xxx
[other properties]
```

### Other Interactive Elements

[Describe any other clickable element patterns]

---

## Spacing System

### Section Spacing

- Between sections: Xpx
- Section padding (vertical): Xpx
- Section padding (horizontal): Xpx
- Max content width: Xpx

### Component Spacing

- Card padding: Xpx
- Grid gaps: Xpx
- Element gaps: Xpx

---

## Effects

### Border Radius Scale

| Size | Value | Usage |
|------|-------|-------|
| sm | Xpx | Inputs, tags |
| md | Xpx | Buttons, cards |
| lg | Xpx | Containers |
| full | 9999px | Pills, avatars |

### Shadows

| Size | Value | Usage |
|------|-------|-------|
| sm | `X Y Xpx rgba(...)` | Buttons |
| md | `X Y Xpx rgba(...)` | Cards |
| lg | `X Y Xpx rgba(...)` | Modals |

### Borders

- Default: Xpx solid #xxx

---

## Block Styling Reference

### Hero Section

**Style:** [description]
- Background: [treatment]
- Layout: [centered/split/etc]
- Padding: [values]
- Typography: [H1 style, subtitle style]
- CTA: [button style reference]

### Cards

**Style:** [description]
- Background: #xxx
- Border Radius: Xpx
- Shadow: [value]
- Padding: Xpx
- Hover: [effect if any]

### Feature Sections

**Style:** [description]
- Layout: [pattern]
- Image treatment: [description]
- Spacing: [values]

[Continue for each block type identified]

---

## Tailwind Config

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'primary': '#xxx',
        'secondary': '#xxx',
        // ... all custom colors
      },
      fontFamily: {
        'heading': ['Font Name', 'sans-serif'],
        'body': ['Font Name', 'sans-serif'],
      },
      fontSize: {
        // Custom font sizes if needed
      },
      spacing: {
        // Custom spacing values if needed
      },
      borderRadius: {
        // Custom radius values
      },
      boxShadow: {
        // Custom shadows
      },
    },
  },
}
```

---

## Implementation Notes

[Any special considerations, edge cases, or important patterns the developer should know]
```

---

## Phase 4: Iteration

After delivering the style guide:

1. Ask: "Does this capture the key visual patterns? Should I add detail to any specific section?"
2. If user provides additional screenshots or clarification, update the guide
3. Offer to expand on specific block types if needed

---

## Conversation Flow Summary

```
1. User: "Generate a style guide from this website" + screenshots/URL

2. Claude: Ask about available inputs
   → Full page screenshots?
   → Multiple pages?
   → Can you extract CSS variables?

3. User: Provides screenshots and any extras

4. Claude: Provide VISUAL ANALYSIS PROMPT for GPT-5
   → "Run this through GPT-5 with all screenshots..."

5. User: Pastes visual analysis response

6. Claude: Generate complete style guide markdown
   → Colors, typography, buttons, spacing, effects
   → Block styling reference
   → Tailwind config recommendations

7. User: Feedback or requests for more detail

8. Claude: Iterate until comprehensive
```
