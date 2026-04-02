---
name: block-replicator
description: Pixel-perfect replication of website blocks using HTML, CSS, and Tailwind only (never React/Vue). Guides users through a multi-model workflow - providing prompts for GPT-5 (visual analysis) and Gemini (interaction analysis), then synthesizes all gathered specifications into final HTML/CSS/Tailwind code. Use when users want to recreate a specific block, section, hero, card, navbar, footer, or any isolated UI component from a reference website or screenshot.
---

# Block Replicator

Replicate website blocks pixel-for-pixel using HTML, CSS, and Tailwind through a guided multi-model workflow.

**Output: HTML + CSS + Tailwind ONLY. Never React, Vue, or other frameworks.**

## Workflow Overview

Guide the user through 4 phases, providing prompts they'll run through other models:

```
Phase 1: Input Collection → Gather screenshot, URL, HTML
Phase 2: Visual Analysis  → User runs prompt through GPT-5/Vision model
Phase 3: Interactions     → User runs prompt through Gemini (if animations)
Phase 4: Code Synthesis   → Claude generates final HTML/CSS/Tailwind
```

---

## Phase 1: Input Collection

Ask what inputs the user has:

"To replicate this block with maximum fidelity, what do you have available?

**Required (at least one):**
- [ ] Screenshot of the block
- [ ] URL to the live page

**Recommended (significantly improves accuracy):**
- [ ] Extracted HTML of the block
- [ ] Computed CSS styles

**Optional (for animations):**
- [ ] Screen recording showing hover states or animations

Which of these can you provide?"

### HTML + CSS Extraction Instructions

If user can access DevTools, walk them through extraction:

"**To extract the block's HTML and CSS, follow these steps:**

**Step 1: Extract HTML**
1. Right-click the block → Inspect
2. In Elements panel, find the **outermost container** of just that block
3. Right-click that element → Copy → **Copy outerHTML**
4. Paste it here

*Tip: Look for the smallest DOM subtree that renders the complete block. Remove unrelated parent wrappers if you accidentally copy too much.*

**Step 2: Extract Computed CSS**
Option A - Copy All Styles:
1. With the element selected in Elements panel
2. Go to the Styles pane (right side)
3. Right-click → **Copy all declarations** (or manually copy the key rules)

Option B - Manual extraction (more precise):
1. With element selected, check the Computed tab
2. Copy these key properties:
   - **Layout**: `display`, `flex-direction`, `align-items`, `justify-content`, `grid-template-*`, `gap`
   - **Spacing**: `padding`, `margin`, `width`, `max-width`, `height`
   - **Typography**: `font-family`, `font-size`, `font-weight`, `line-height`, `letter-spacing`, `color`
   - **Background**: `background`, `background-color`, `background-image`
   - **Effects**: `border`, `border-radius`, `box-shadow`, `opacity`
   - **Transitions**: `transition`, `transform`

**Step 3: Repeat for key child elements**
If the block has distinct sections (heading, buttons, cards), extract computed CSS for those too.

Share whatever you can extract—even partial CSS helps significantly."

---

## Phase 2: Visual Analysis

Once you have the screenshot/image, provide this prompt for the user:

"**Copy this prompt and run it through GPT-5 (or another vision model) with your screenshot attached:**"

```
Analyze this UI block for pixel-perfect HTML/CSS replication. Be exhaustive and specific:

## LAYOUT
- Container type: [flex | grid | block]
- Flex/grid direction: [row | column]
- Justify content: [start | center | end | space-between | space-around]
- Align items: [start | center | end | stretch | baseline]
- Gap between items: [Xpx]
- Container max-width: [Xpx or full-width]
- Nested structure: describe the parent→child element hierarchy

## TYPOGRAPHY
For EACH text element visible, provide:
| Role | Font Family (guess) | Size | Weight | Line Height | Color | Letter Spacing | Transform |
|------|---------------------|------|--------|-------------|-------|----------------|-----------|
| Main heading | | px | | | #hex | | |
| Subheading | | px | | | #hex | | |
| Body text | | px | | | #hex | | |
| Button text | | px | | | #hex | | |
| Labels/small | | px | | | #hex | | |

## COLORS (provide hex values)
- Primary background: #
- Secondary background: #
- Primary text: #
- Secondary/muted text: #
- Accent color: #
- Border color: #
- Button background: #
- Button text: #

## SPACING (estimate in pixels)
- Container padding: top right bottom left
- Space between major sections: Xpx
- Space between elements within sections: Xpx
- Button/element internal padding: Xpx Xpx

## EFFECTS
- Border radius: Xpx (note if different per element)
- Box shadows: offset-x offset-y blur spread color (list each shadow if multiple)
- Gradients: type, direction, color stops
- Border: width style color
- Backdrop blur: Xpx (if any)

## IMAGES/ICONS
- Image dimensions or aspect ratio:
- Image fit: [cover | contain]
- Icon sizes: Xpx
- Icon colors: #hex

## ELEMENT INVENTORY
List every distinct element in the block:
1. [element] - brief description
2. [element] - brief description
...

Note any uncertainty with [?]. Be precise with pixel values and hex colors.
```

Then tell user: "**Paste the response you get back here, and we'll move to the next phase.**"

---

## Phase 3: Interaction Analysis

After receiving the visual spec, ask:

"Does this block have any of these?
- Hover effects (color changes, shadows, scaling)
- Click/active states
- Animations on page load
- Scroll-triggered animations
- Transitions

If yes, and you can provide a screen recording or hover-state screenshots, I'll give you a prompt for Gemini. If not, we can skip to code generation."

### If user has interactions to capture:

"**Copy this prompt and run it through Gemini (with video) or GPT-5 (with hover screenshots):**"

```
Analyze all interactions and animations in this UI block:

## HOVER STATES
For each interactive element, describe:
| Element | Property | Default State | Hover State | Transition Duration | Easing |
|---------|----------|---------------|-------------|---------------------|--------|
| | background | #hex | #hex | ms | |
| | color | #hex | #hex | ms | |
| | transform | none | scale(X) | ms | |
| | shadow | value | value | ms | |
| | border | value | value | ms | |

## ANIMATIONS (if any)
For each animation:
- Element affected:
- Trigger: [page load | scroll | hover | click]
- Properties animated: [opacity, transform, etc.]
- Start state:
- End state:
- Duration: Xms
- Delay: Xms (and stagger between elements if applicable)
- Easing: [ease | ease-in-out | ease-out | cubic-bezier(...)]

## FOCUS STATES (for form elements/buttons)
- Focus ring color:
- Focus ring style:

Be specific about timing and easing values.
```

Then: "**Paste the interaction analysis here when ready.**"

---

## Phase 4: Code Synthesis

Once you have:
- Visual spec from Phase 2
- Interaction spec from Phase 3 (if applicable)
- Original screenshot for reference
- **Extracted HTML structure (if provided)**
- **Computed CSS values (if provided)**

Generate the final HTML/CSS/Tailwind code.

### When HTML/CSS Was Provided

If user extracted HTML and computed CSS:
1. **Use extracted HTML as structural foundation** — match the DOM hierarchy exactly
2. **Use computed CSS values as ground truth** — these are more accurate than visual estimates
3. **Use visual spec to fill gaps** — for anything not captured in computed styles
4. **Cross-reference screenshot** — final visual verification

Priority when values conflict:
```
Computed CSS > Visual Spec > Screenshot estimation
```

### When Only Screenshot/Visual Spec Available

Rely on visual spec from Phase 2 and implement from scratch.

### Implementation Order
1. HTML structure (match hierarchy from extracted HTML or visual spec)
2. Layout (flex/grid via Tailwind)
3. Typography (fonts, sizes, weights)
4. Colors (backgrounds, text)
5. Spacing (padding, margins, gaps)
6. Effects (shadows, borders, radius)
7. Interactions (hover states, transitions)

### Output Format

For simple blocks:
```html
<!-- Block: [Name] -->
<section class="[tailwind classes]">
  ...
</section>
```

For blocks needing custom CSS (complex shadows, gradients, animations):
```html
<!-- Block: [Name] -->
<section class="block-name [tailwind classes]">
  ...
</section>

<style>
.block-name {
  /* Custom CSS Tailwind can't handle */
}
</style>
```

### Tailwind Arbitrary Value Usage

Use arbitrary values for precise matching:
- `text-[17px]` for exact font sizes
- `text-[#1a1b23]` for exact colors
- `p-[18px]` for exact padding
- `gap-[22px]` for exact gaps
- `rounded-[6px]` for exact radius
- `shadow-[0_4px_12px_rgba(0,0,0,0.15)]` for exact shadows

### Font Handling

```html
<!-- Include font import at top -->
<link href="https://fonts.googleapis.com/css2?family=[Font]+[weights]" rel="stylesheet">
```

Common substitutions if exact font unavailable:
- SF Pro → Inter, system-ui
- Helvetica Neue → Arial
- Circular → Plus Jakarta Sans

---

## Iteration

After delivering code:

1. Ask user to preview the result
2. Request specific feedback: "Compare against the original—what doesn't match?"
3. Make targeted fixes based on feedback
4. Repeat until user confirms pixel-perfect match

**Expect 2-3 iterations minimum for high fidelity.**

---

## Conversation Flow Summary

```
1. User: "Replicate this block" + screenshot/URL

2. Claude: Ask about available inputs
   → Can you extract HTML + computed CSS? (provide instructions)
   → Any hover states or animations?

3. User: Provides what they have (screenshot, HTML, CSS, etc.)

4. Claude: Provide VISUAL ANALYSIS PROMPT for GPT-5
   → "Run this through GPT-5 with your screenshot..."

5. User: Pastes visual spec from GPT-5

6. Claude: If interactions exist, provide INTERACTION ANALYSIS PROMPT
   → "Run this through Gemini with your video..."

7. User: Pastes interaction spec (or confirms none)

8. Claude: Generate HTML/CSS/Tailwind code
   → Uses extracted HTML/CSS as foundation (if provided)
   → Uses visual spec to fill gaps
   → Uses interaction spec for hover/animations

9. User: Feedback on differences

10. Claude: Iterate until matched
```
